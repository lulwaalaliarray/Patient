import React, { useState, useEffect } from 'react';
import { User } from '../utils/userStorage';
import { reviewStorage } from '../utils/reviewStorage';

interface DoctorCardProps {
  doctor: User & {
    specialty?: string;
    experience?: number | string;
    rating?: number;
    reviewCount?: number;
    fee?: number;
    isOnline?: boolean;
    nextAvailable?: string;
    languages?: string[];
    education?: string;
    hospital?: string;
    coordinates?: { lat: number; lng: number };
    address?: string;
  };
  onBookAppointment: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
  isUserLoggedIn?: boolean;
  distance?: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment, onViewProfile, isUserLoggedIn = false, distance }) => {
  const [realTimeRating, setRealTimeRating] = useState<number>(0); // Start with 0, load real data
  const [realTimeReviewCount, setRealTimeReviewCount] = useState<number>(0); // Start with 0, load real data

  // Load real-time review data
  useEffect(() => {
    const loadReviewData = () => {
      const doctorReviews = reviewStorage.getDoctorReviews(doctor.id);
      const averageRating = reviewStorage.getDoctorAverageRating(doctor.id);
      
      setRealTimeRating(averageRating || 0); // Only use real ratings, no fallback to mock data
      setRealTimeReviewCount(doctorReviews.length || 0); // Only use real review count
    };

    loadReviewData();

    // Listen for review updates
    const handleReviewUpdate = () => {
      loadReviewData();
    };

    window.addEventListener('reviewAdded', handleReviewUpdate);
    window.addEventListener('reviewUpdated', handleReviewUpdate);

    return () => {
      window.removeEventListener('reviewAdded', handleReviewUpdate);
      window.removeEventListener('reviewUpdated', handleReviewUpdate);
    };
  }, [doctor.id, doctor.rating, doctor.reviewCount]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '400px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }}>
      {/* Header with Avatar and Online Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#f3f4f6'
          }}>
            {doctor.profilePicture ? (
              <img 
                src={doctor.profilePicture} 
                alt={doctor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: '#0d9488',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          {/* Online Status Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid white',
            backgroundColor: doctor.status === 'active' ? '#10b981' : '#9ca3af'
          }}>
            {doctor.status === 'active' && (
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                animation: 'pulse 2s infinite'
              }}></div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {doctor.name}
          </h3>
          <p style={{
            color: '#0d9488',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            {doctor.specialization || doctor.specialty}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {doctor.qualifications || doctor.education}
          </p>
          {doctor.hospital && (
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '2px'
            }}>
              {doctor.hospital}
            </p>
          )}
          <p style={{
            fontSize: '12px',
            color: '#0d9488',
            marginTop: '2px',
            fontWeight: '500'
          }}>
            📍 {doctor.location || 'Bahrain'}
            {distance && (
              <span style={{ marginLeft: '8px', color: '#6366f1' }}>
                • {distance.toFixed(1)} km away
              </span>
            )}
          </p>
          {doctor.address && (
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              marginTop: '2px'
            }}>
              {doctor.address}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#111827'
          }}>
            {doctor.consultationFee || doctor.fee || 25} BHD
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            per consultation
          </div>
        </div>
      </div>

      {/* Rating and Experience */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
          {renderStars(realTimeRating || 4.8)}
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginLeft: '4px'
          }}>
            {realTimeRating > 0 ? realTimeRating.toFixed(1) : 'N/A'}
          </span>
          <button 
            style={{
              fontSize: '14px',
              color: '#0d9488',
              cursor: 'pointer',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              padding: '0',
              fontWeight: '500',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(doctor.id);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f766e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0d9488';
            }}
            title="Click to view doctor profile and reviews"
          >
            ({realTimeReviewCount > 0 ? `${realTimeReviewCount} review${realTimeReviewCount !== 1 ? 's' : ''}` : 'No reviews yet'})
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          {/* Rating Quality Badge */}
          {realTimeRating >= 4.5 && realTimeReviewCount >= 5 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Top Rated
            </div>
          )}
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {doctor.experience || '10+ years'} exp.
        </div>
      </div>

      {/* Languages */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(doctor.languages || ['Arabic', 'English']).map((language, index) => (
            <span
              key={index}
              style={{
                fontSize: '12px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '4px 8px',
                borderRadius: '12px'
              }}
            >
              {language}
            </span>
          ))}
        </div>
      </div>

      {/* Availability - Only show for logged in users */}
      {isUserLoggedIn && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#0d9488" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{
              fontSize: '14px',
              color: '#374151'
            }}>
              {doctor.isOnline ? 'Available now' : doctor.nextAvailable || 'Next available: Tomorrow 9:00 AM'}
            </span>
          </div>
        </div>
      )}

      {/* Sign in prompt for non-logged in users */}
      {!isUserLoggedIn && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span style={{
              fontSize: '14px',
              color: '#92400e',
              fontWeight: '500'
            }}>
              Sign in to view availability and book appointments
            </span>
          </div>
        </div>
      )}

      {/* Spacer to push buttons to bottom */}
      <div style={{ flex: 1 }}></div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {/* View Profile Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(doctor.id);
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: 'white',
            color: '#0d9488',
            border: '1px solid #0d9488',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0fdfa';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          View Profile
        </button>

        {/* Book Appointment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isUserLoggedIn) {
              onBookAppointment(doctor.id);
            } else {
              onViewProfile(doctor.id);
            }
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: isUserLoggedIn 
              ? 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)'
              : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            if (isUserLoggedIn) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (isUserLoggedIn) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {isUserLoggedIn ? (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M3 7h18l-2 13H5L3 7z" />
              </svg>
              Book Appointment
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
              </svg>
              Sign In to Book
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;