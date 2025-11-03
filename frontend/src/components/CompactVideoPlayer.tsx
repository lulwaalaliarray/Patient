import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompactVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompactVideoPlayer: React.FC<CompactVideoPlayerProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [showOverlay, setShowOverlay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45); // 45 seconds total
  const navigate = useNavigate();

  // Video scenes with shorter durations
  const scenes = [
    {
      id: 'homepage',
      title: 'PatientCare Homepage',
      startTime: 0,
      endTime: 8,
      page: 'home',
      cursor: { x: 50, y: 50 },
      overlay: 'Homepage'
    },
    {
      id: 'scroll-features',
      title: 'Platform Features',
      startTime: 8,
      endTime: 16,
      page: 'home',
      cursor: { x: 50, y: 70 },
      overlay: 'Features'
    },
    {
      id: 'navigation',
      title: 'Navigation Menu',
      startTime: 16,
      endTime: 22,
      page: 'home',
      cursor: { x: 35, y: 15 },
      overlay: 'Navigation'
    },
    {
      id: 'doctors-page',
      title: 'Find Doctors',
      startTime: 22,
      endTime: 32,
      page: 'doctors',
      cursor: { x: 50, y: 40 },
      overlay: 'Find Doctors'
    },
    {
      id: 'booking',
      title: 'Book Appointment',
      startTime: 32,
      endTime: 40,
      page: 'doctors',
      cursor: { x: 65, y: 65 },
      overlay: 'Book Appointment'
    },
    {
      id: 'complete',
      title: 'Platform Overview',
      startTime: 40,
      endTime: 45,
      page: 'doctors',
      cursor: { x: 50, y: 50 },
      overlay: 'PatientCare'
    }
  ];

  const currentScene = scenes[currentStep] || scenes[0];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.5; // Update every 500ms for smoother progress
          
          // Find current scene based on time
          const sceneIndex = scenes.findIndex(scene => 
            newTime >= scene.startTime && newTime < scene.endTime
          );
          
          if (sceneIndex !== -1 && sceneIndex !== currentStep) {
            const nextScene = scenes[sceneIndex];
            setCurrentStep(sceneIndex);
            
            // Handle page transitions
            if (nextScene.page !== currentScene.page) {
              setIsLoading(true);
              setTimeout(() => {
                setCurrentPage(nextScene.page);
                setIsLoading(false);
              }, 300);
            }
          }
          
          // End of video
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          
          return newTime;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, currentScene.page]);

  // Animate cursor
  useEffect(() => {
    const targetCursor = currentScene.cursor;
    setCursorPosition(targetCursor);
    
    if (currentScene.overlay) {
      setShowOverlay(currentScene.overlay);
      const timer = setTimeout(() => setShowOverlay(''), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && !isMinimized) {
      timeout = setTimeout(() => setShowControls(false), 2000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isMinimized]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setShowControls(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCurrentTime(0);
    setCurrentPage('home');
    onClose();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    setCurrentTime(newTime);
    
    // Find corresponding scene
    const sceneIndex = scenes.findIndex(scene => 
      newTime >= scene.startTime && newTime < scene.endTime
    );
    
    if (sceneIndex !== -1) {
      setCurrentStep(sceneIndex);
      const scene = scenes[sceneIndex];
      if (scene.page !== currentPage) {
        setCurrentPage(scene.page);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVideoContent = () => {
    if (currentPage === 'home') {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            animation: isPlaying ? 'float 4s ease-in-out infinite' : 'none'
          }}></div>

          <div style={{ textAlign: 'center', zIndex: 2, padding: '20px' }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '12px',
              animation: isPlaying ? 'bounce 2s infinite' : 'none'
            }}>
              🏥
            </div>
            <h2 style={{
              fontSize: isMinimized ? '16px' : '24px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {currentStep <= 1 ? 'PatientCare Platform' : 'Platform Features'}
            </h2>
            <p style={{
              fontSize: isMinimized ? '12px' : '14px',
              opacity: 0.9,
              margin: 0
            }}>
              {currentStep <= 1 ? 'Your Health, Simplified' : 'Find doctors, book appointments, manage health'}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '12px',
              animation: isPlaying ? 'bounce 2s infinite' : 'none'
            }}>
              👨‍⚕️
            </div>
            <h2 style={{
              fontSize: isMinimized ? '16px' : '24px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#111827'
            }}>
              Find Healthcare Professionals
            </h2>
            <p style={{
              fontSize: isMinimized ? '12px' : '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Search 500+ NHRA-licensed doctors across Bahrain
            </p>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: isMinimized ? 'auto' : '50%',
      left: isMinimized ? 'auto' : '50%',
      bottom: isMinimized ? '20px' : 'auto',
      right: isMinimized ? '20px' : 'auto',
      transform: isMinimized ? 'none' : 'translate(-50%, -50%)',
      width: isMinimized ? '300px' : '600px',
      height: isMinimized ? '200px' : '400px',
      backgroundColor: '#000',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onClick={handleVideoClick}
    onMouseEnter={() => setShowControls(true)}
    onMouseLeave={() => !isMinimized && setShowControls(showControls)}
    >
      {/* Video Content */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid #374151',
              borderTop: '3px solid #0d9488',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}

        {/* Main Video Content */}
        {renderVideoContent()}

        {/* Mouse Cursor */}
        <div style={{
          position: 'absolute',
          left: `${cursorPosition.x}%`,
          top: `${cursorPosition.y}%`,
          width: '12px',
          height: '12px',
          pointerEvents: 'none',
          zIndex: 20,
          transition: 'all 1s ease'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L12 13L8 19L5 3Z" fill="white" stroke="black" strokeWidth="2"/>
          </svg>
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30
          }}>
            <svg width="24" height="24" fill="#0d9488" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}

        {/* Text Overlay */}
        {showOverlay && !isMinimized && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: 25,
            animation: 'fadeInOut 1.5s ease'
          }}>
            {showOverlay}
          </div>
        )}

        {/* Video Controls */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: isMinimized ? '8px' : '12px',
          transform: showControls ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 40
        }}
        onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            marginBottom: isMinimized ? '6px' : '8px',
            cursor: 'pointer'
          }}
          onClick={handleSeek}
          >
            <div style={{
              width: `${(currentTime / duration) * 100}%`,
              height: '100%',
              backgroundColor: '#0d9488',
              borderRadius: '2px',
              transition: 'width 0.1s ease'
            }}></div>
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMinimized ? '6px' : '8px' }}>
              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <svg width={isMinimized ? "16" : "20"} height={isMinimized ? "16" : "20"} fill="currentColor" viewBox="0 0 24 24">
                  {isPlaying ? (
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  ) : (
                    <path d="M8 5v14l11-7z"/>
                  )}
                </svg>
              </button>

              {/* Time Display */}
              {!isMinimized && (
                <span style={{ fontSize: '12px', fontWeight: '500' }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Minimize/Maximize */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMinimize();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  ) : (
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  )}
                </svg>
              </button>

              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Close"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Try PatientCare Button (only when not minimized and not playing) */}
      {!isMinimized && !isPlaying && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/signup');
          }}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            backgroundColor: 'rgba(13, 148, 136, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 50,
            backdropFilter: 'blur(10px)'
          }}
        >
          Try PatientCare →
        </button>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
            60% { transform: translateY(-4px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(1deg); }
          }
          
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-5px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
};

export default CompactVideoPlayer;