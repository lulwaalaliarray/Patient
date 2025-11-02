import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleNavigation, routes } from '../utils/navigation';
import { useToast } from './Toast';
import DemoVideoPlayer from './DemoVideoPlayer';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onWatchDemo }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      handleNavigation(navigate, routes.signup, false, showToast);
    }
  };

  const handleWatchDemo = () => {
    if (onWatchDemo) {
      onWatchDemo();
    } else {
      setShowDemoModal(true);
    }
  };
  return (
    <section style={{
      backgroundColor: '#f8fafc',
      padding: '80px 20px',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '24px'
              }}>
                🇧🇭 Trusted by patients across Bahrain
              </span>
              
              <h1 style={{
                fontSize: window.innerWidth >= 768 ? '56px' : '40px',
                fontWeight: '800',
                lineHeight: '1.1',
                color: '#111827',
                marginBottom: '24px'
              }}>
                Your Health,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Simplified
                </span>
              </h1>
              
              <p style={{
                fontSize: '20px',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '500px'
              }}>
                Connect with Bahrain's top healthcare professionals, book appointments at leading hospitals, and manage your health records with the Kingdom's most trusted medical platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
              gap: '16px',
              marginBottom: '48px'
            }}>
              <button
                onClick={handleGetStarted}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(13, 148, 136, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(13, 148, 136, 0.3)';
                }}
              >
                Get Started Free
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={handleWatchDemo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                NHRA Approved
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                MOH Certified
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Arabic & English
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Demo Preview */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div 
              onClick={handleWatchDemo}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: '400px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Demo Preview Content */}
              <div style={{
                width: '90%',
                height: '90%',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                                   radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                  pointerEvents: 'none'
                }}></div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '60px',
                    marginBottom: '16px',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    🏥
                  </div>
                  
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Interactive Demo
                  </h3>
                  
                  <p style={{
                    fontSize: '16px',
                    opacity: 0.9,
                    marginBottom: '20px',
                    lineHeight: '1.4'
                  }}>
                    Explore PatientCare's features through our interactive slideshow and video walkthrough
                  </p>

                  {/* Feature Icons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    {['👨‍⚕️', '📅', '💬', '📋'].map((icon, index) => (
                      <div key={index} style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        animation: `float 3s ease-in-out infinite ${index * 0.5}s`
                      }}>
                        {icon}
                      </div>
                    ))}
                  </div>

                  {/* Play Button */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.2s'
                  }}>
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                borderRadius: '16px',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  color: '#0d9488',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  Click to Watch Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal with Slideshow */}
      {showDemoModal && (
        <DemoModalWithSlideshow 
          onClose={() => setShowDemoModal(false)}
          onWatchVideo={() => {
            setShowDemoModal(false);
            setShowVideoPlayer(true);
          }}
        />
      )}

      {/* Video Player */}
      <DemoVideoPlayer 
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
      />
    </section>
  );
};

// Demo Modal Component with Slideshow
interface DemoModalProps {
  onClose: () => void;
  onWatchVideo: () => void;
}

const DemoModalWithSlideshow: React.FC<DemoModalProps> = ({ onClose, onWatchVideo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const slides = [
    {
      title: "Welcome to PatientCare",
      subtitle: "Your Digital Health Companion",
      description: "Experience seamless healthcare management with Bahrain's most trusted medical platform. Connect with NHRA-licensed doctors, book appointments, and manage your health records all in one place.",
      image: "🏥",
      color: "#0d9488",
      features: ["NHRA Licensed Doctors", "Secure Health Records", "24/7 Support"]
    },
    {
      title: "Find Qualified Doctors",
      subtitle: "Search & Connect with Specialists",
      description: "Browse through our network of verified healthcare professionals. Filter by specialization, location, availability, and patient reviews to find the perfect doctor for your needs.",
      image: "👨‍⚕️",
      color: "#10b981",
      features: ["Advanced Search Filters", "Real-time Availability", "Patient Reviews"]
    },
    {
      title: "Book Appointments Instantly",
      subtitle: "Real-time Scheduling Made Easy",
      description: "View real-time availability and book appointments with just a few clicks. Choose between in-person visits or telemedicine consultations with instant confirmation.",
      image: "📅",
      color: "#3b82f6",
      features: ["Instant Booking", "SMS Reminders", "Flexible Scheduling"]
    },
    {
      title: "Secure Health Records",
      subtitle: "Your Complete Medical History",
      description: "Access your comprehensive medical records anytime, anywhere. Integration with MOH systems and major Bahraini hospitals ensures complete health tracking.",
      image: "📋",
      color: "#8b5cf6",
      features: ["MOH Integration", "Secure Storage", "Easy Access"]
    },
    {
      title: "Telemedicine & Chat",
      subtitle: "Healthcare from Anywhere",
      description: "Connect with doctors through secure video consultations and HIPAA-compliant messaging. Perfect for follow-ups, prescription renewals, and consultations.",
      image: "💬",
      color: "#f59e0b",
      features: ["Video Consultations", "Secure Messaging", "Prescription Renewals"]
    }
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Slideshow Content */}
        <div style={{
          background: `linear-gradient(135deg, ${currentSlideData.color} 0%, ${currentSlideData.color}dd 100%)`,
          color: 'white',
          padding: '60px 40px 40px',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            pointerEvents: 'none'
          }}></div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '24px',
              animation: 'slideIn 0.6s ease-out'
            }}>
              {currentSlideData.image}
            </div>

            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '12px',
              animation: 'slideIn 0.6s ease-out 0.1s both'
            }}>
              {currentSlideData.title}
            </h2>

            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              opacity: 0.9,
              animation: 'slideIn 0.6s ease-out 0.2s both'
            }}>
              {currentSlideData.subtitle}
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 32px',
              opacity: 0.9,
              animation: 'slideIn 0.6s ease-out 0.3s both'
            }}>
              {currentSlideData.description}
            </p>

            {/* Features */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
              animation: 'slideIn 0.6s ease-out 0.4s both'
            }}>
              {currentSlideData.features.map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentSlide ? currentSlideData.color : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={prevSlide}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ← Prev
            </button>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${currentSlideData.color}`,
                borderRadius: '6px',
                backgroundColor: isAutoPlaying ? currentSlideData.color : 'white',
                color: isAutoPlaying ? 'white' : currentSlideData.color,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Auto'}
            </button>

            <button
              onClick={nextSlide}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Next →
            </button>
          </div>

          {/* Watch Video Button */}
          <button
            onClick={onWatchVideo}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: currentSlideData.color,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${currentSlideData.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Watch Full Demo
          </button>
        </div>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: currentSlideData.color,
              animation: 'progress 4s linear infinite',
              transformOrigin: 'left'
            }}></div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes progress {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;