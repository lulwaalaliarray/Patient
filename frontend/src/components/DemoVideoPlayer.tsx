import React from 'react';

interface DemoVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '1000px',
          backgroundColor: 'black',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Interactive Demo Content (Since we don't have actual video) */}
        <div style={{
          width: '100%',
          height: '500px',
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white'
        }}>
          {/* Demo Content */}
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '24px',
              animation: 'pulse 2s infinite'
            }}>
              🏥
            </div>
            
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              PatientCare Platform Demo
            </h2>
            
            <p style={{
              fontSize: '18px',
              marginBottom: '32px',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              Experience the future of healthcare in Bahrain. This interactive demo showcases how PatientCare connects patients with NHRA-licensed doctors, streamlines appointment booking, and provides secure health record management.
            </p>

            {/* Demo Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {[
                { icon: '👨‍⚕️', title: 'Find Doctors', desc: 'Search NHRA-licensed specialists' },
                { icon: '📅', title: 'Book Appointments', desc: 'Real-time scheduling system' },
                { icon: '💬', title: 'Telemedicine', desc: 'Secure video consultations' },
                { icon: '📋', title: 'Health Records', desc: 'Complete medical history' }
              ].map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    {feature.icon}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {feature.title}
                  </h4>
                  <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => window.open('/signup', '_blank')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#0d9488',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get Started Free
              </button>
              
              <button
                onClick={() => window.open('/doctors', '_blank')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Browse Doctors
              </button>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 4s ease-in-out infinite 2s'
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '20%',
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 5s ease-in-out infinite 1s'
          }}></div>
        </div>


      </div>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default DemoVideoPlayer;