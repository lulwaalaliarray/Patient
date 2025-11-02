import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const InteractiveVideoDemo: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = [
    {
      title: "Patient Dashboard", 
      scene: "dashboard",
      narration: "Your personal dashboard gives you a complete overview of your health journey. Track appointments, view prescriptions, access medical records, and manage your healthcare all in one place."
    },
    { 
      title: "Find Doctors", 
      scene: "search",
      narration: "Search through our network of NHRA-licensed healthcare professionals. Filter by specialization, location, and availability to find the perfect doctor for your needs."
    },
    { 
      title: "Book Appointment", 
      scene: "booking",
      narration: "Select your preferred time slot and book appointments instantly. Choose between in-person visits or telemedicine consultations with real-time availability."
    },
    { 
      title: "Video Consultation", 
      scene: "video",
      narration: "Connect with your doctor through secure video calls. Perfect for follow-ups, consultations, and prescription renewals from anywhere in Bahrain."
    },
    { 
      title: "Prescription Management", 
      scene: "prescription",
      narration: "Receive digital prescriptions directly from your doctor. Track medications, set reminders, and maintain a complete medication history."
    }
  ];

  const handleSceneChange = (index: number) => {
    setCurrentScene(index);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderScene = () => {
    const scene = scenes[currentScene];
    
    return (
      <div style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Mock Video Content */}
        <div style={{
          width: '90%',
          height: '90%',
          backgroundColor: '#374151',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            {scene.scene === 'dashboard' && '📊'}
            {scene.scene === 'search' && '🔍'}
            {scene.scene === 'booking' && '📅'}
            {scene.scene === 'video' && '📹'}
            {scene.scene === 'prescription' && '💊'}
          </div>
          
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#f9fafb'
          }}>
            {scene.title}
          </h3>
          
          <p style={{
            fontSize: '16px',
            color: '#d1d5db',
            lineHeight: '1.5',
            maxWidth: '400px'
          }}>
            {scene.narration}
          </p>
        </div>

        {/* Play/Pause Overlay */}
        <button
          onClick={handlePlayPause}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(13, 148, 136, 0.9)',
            border: 'none',
            color: 'white',
            fontSize: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            opacity: isPlaying ? 0 : 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(15, 118, 110, 0.9)';
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(13, 148, 136, 0.9)';
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              backgroundColor: '#0d9488',
              borderRadius: '2px',
              animation: 'progress 3s ease-in-out infinite'
            }}></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Interactive Video Demo
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              Explore PatientCare's features through our interactive demonstration
            </p>
          </div>

          {/* Video Player */}
          <div style={{ marginBottom: '32px' }}>
            {renderScene()}
          </div>

          {/* Scene Navigation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {scenes.map((scene, index) => (
              <button
                key={index}
                onClick={() => handleSceneChange(index)}
                style={{
                  padding: '16px',
                  border: `2px solid ${index === currentScene ? '#0d9488' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  backgroundColor: index === currentScene ? '#f0fdfa' : 'white',
                  color: index === currentScene ? '#0d9488' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentScene) {
                    e.currentTarget.style.borderColor = '#0d9488';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentScene) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {scene.scene === 'dashboard' && '📊'}
                  {scene.scene === 'search' && '🔍'}
                  {scene.scene === 'booking' && '📅'}
                  {scene.scene === 'video' && '📹'}
                  {scene.scene === 'prescription' && '💊'}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 4px 0'
                }}>
                  {scene.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {scene.narration.substring(0, 80)}...
                </p>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => setCurrentScene(Math.max(0, currentScene - 1))}
              disabled={currentScene === 0}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: currentScene === 0 ? '#f9fafb' : 'white',
                color: currentScene === 0 ? '#9ca3af' : '#374151',
                fontSize: '16px',
                fontWeight: '500',
                cursor: currentScene === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ← Previous
            </button>
            
            <button
              onClick={handlePlayPause}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#0d9488',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f766e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0d9488';
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            
            <button
              onClick={() => setCurrentScene(Math.min(scenes.length - 1, currentScene + 1))}
              disabled={currentScene === scenes.length - 1}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: currentScene === scenes.length - 1 ? '#f9fafb' : 'white',
                color: currentScene === scenes.length - 1 ? '#9ca3af' : '#374151',
                fontSize: '16px',
                fontWeight: '500',
                cursor: currentScene === scenes.length - 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Features Highlight */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            { icon: '🏥', title: 'NHRA Licensed', desc: 'All doctors are verified by Bahrain\'s health authority' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Military-grade encryption for all health data' },
            { icon: '🌍', title: 'Arabic & English', desc: 'Full bilingual support for all users' },
            { icon: '📱', title: 'Mobile Ready', desc: 'Access from any device, anywhere in Bahrain' }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                {feature.icon}
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      
      <style>
        {`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default InteractiveVideoDemo;