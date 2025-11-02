import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const DemoVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            PatientCare Demo Video
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Watch how PatientCare transforms healthcare in Bahrain
          </p>

          {/* Video Player */}
          <div style={{
            width: '100%',
            height: '500px',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '32px'
          }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(13, 148, 136, 0.9)',
                border: 'none',
                color: 'white',
                fontSize: '40px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Demo video showcasing PatientCare's comprehensive healthcare platform
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DemoVideo;