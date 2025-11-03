import React, { useState } from 'react';
import ProfessionalWebsiteDemo from './ProfessionalWebsiteDemo';

interface WebsiteDemoPlayerProps {
  width?: string;
  height?: string;
  autoPlay?: boolean;
  showTitle?: boolean;
}

const WebsiteDemoPlayer: React.FC<WebsiteDemoPlayerProps> = ({
  width = '100%',
  height = '600px',
  autoPlay = false,
  showTitle = true
}) => {
  const [showDemo, setShowDemo] = useState(autoPlay);

  const handlePlayDemo = () => {
    setShowDemo(true);
  };

  const handleDemoComplete = () => {
    // Keep demo visible after completion
  };

  if (showDemo) {
    return (
      <div style={{
        width,
        height,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb'
      }}>
        <ProfessionalWebsiteDemo 
          onComplete={handleDemoComplete}
          showControls={true}
        />
      </div>
    );
  }

  return (
    <div style={{
      width,
      height,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Preview Thumbnail */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="800" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="800" height="600" fill="%23f8fafc"/%3E%3Crect x="0" y="0" width="800" height="60" fill="%23ffffff"/%3E%3Crect x="20" y="20" width="120" height="20" rx="4" fill="%230d9488"/%3E%3Crect x="600" y="15" width="60" height="30" rx="15" fill="%23e5e7eb"/%3E%3Crect x="680" y="15" width="60" height="30" rx="15" fill="%23e5e7eb"/%3E%3Crect x="0" y="60" width="800" height="400" fill="%23667eea"/%3E%3Ctext x="400" y="280" text-anchor="middle" fill="white" font-size="32" font-weight="bold"%3EPatientCare%3C/text%3E%3Ctext x="400" y="320" text-anchor="middle" fill="white" font-size="16"%3EYour Health, Our Priority%3C/text%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3
      }}></div>

      {/* Play Button Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center'
      }}>
        {showTitle && (
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            PatientCare Website Demo
          </h3>
        )}
        
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '32px',
          maxWidth: '400px',
          lineHeight: '1.6',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Watch a realistic screen recording of our healthcare platform in action
        </p>

        <button
          onClick={handlePlayDemo}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 32px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1e293b',
            border: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play Demo
        </button>

        <div style={{
          marginTop: '24px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <span>🎬 30-60 seconds</span>
          <span>•</span>
          <span>🖱️ Interactive demo</span>
          <span>•</span>
          <span>📱 Responsive design</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default WebsiteDemoPlayer;