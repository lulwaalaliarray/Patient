import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const VideoWalkthrough: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes total
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  
  const videoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Video scenes with timestamps
  const scenes = [
    {
      id: 'intro',
      title: 'Welcome to PatientCare',
      startTime: 0,
      endTime: 25,
      description: 'Introduction to Bahrain\'s leading healthcare platform',
      thumbnail: '🏥',
      content: 'Welcome to PatientCare! I\'m Dr. Sarah, and I\'ll be your guide through our comprehensive healthcare platform designed specifically for Bahrain residents.'
    },
    {
      id: 'search-doctors',
      title: 'Finding the Right Doctor',
      startTime: 25,
      endTime: 55,
      description: 'Search by specialty, location, and patient ratings',
      thumbnail: '👨‍⚕️',
      content: 'Let me show you how easy it is to find the perfect doctor. You can search by medical specialty, filter by location across Bahrain, and read verified patient reviews.'
    },
    {
      id: 'booking',
      title: 'Booking Your Appointment',
      startTime: 55,
      endTime: 85,
      description: 'Real-time scheduling with instant confirmation',
      thumbnail: '📅',
      content: 'Booking is simple! Select your preferred doctor, choose from available time slots, and get instant confirmation. You can even choose between in-person or telemedicine appointments.'
    },
    {
      id: 'appointments',
      title: 'Managing Appointments',
      startTime: 85,
      endTime: 115,
      description: 'View, reschedule, and track your healthcare visits',
      thumbnail: '📋',
      content: 'Your dashboard shows all upcoming appointments, allows easy rescheduling, and keeps a complete history of your healthcare visits with detailed notes.'
    },
    {
      id: 'prescriptions',
      title: 'Digital Prescriptions',
      startTime: 115,
      endTime: 145,
      description: 'Secure digital prescriptions and medication tracking',
      thumbnail: '💊',
      content: 'After your appointment, receive digital prescriptions directly in your account. Track medications, set reminders, and share with pharmacies across Bahrain.'
    },
    {
      id: 'doctor-portal',
      title: 'For Healthcare Providers',
      startTime: 145,
      endTime: 180,
      description: 'Professional tools for doctors and clinics',
      thumbnail: '🩺',
      content: 'Healthcare providers get powerful tools: manage availability, approve appointments, write digital prescriptions, and access comprehensive patient records - all NHRA compliant.'
    }
  ];

  const currentSceneData = scenes[currentScene];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Check if we need to move to next scene
          const nextScene = scenes.findIndex(scene => 
            newTime >= scene.startTime && newTime < scene.endTime
          );
          if (nextScene !== -1 && nextScene !== currentScene) {
            setCurrentScene(nextScene);
          }
          
          // Stop at the end
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScene, duration]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    const sceneIndex = scenes.findIndex(scene => 
      time >= scene.startTime && time < scene.endTime
    );
    if (sceneIndex !== -1) {
      setCurrentScene(sceneIndex);
    }
    setShowControls(true);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const jumpToScene = (sceneIndex: number) => {
    setCurrentScene(sceneIndex);
    setCurrentTime(scenes[sceneIndex].startTime);
    setShowControls(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryFeature = () => {
    switch (currentSceneData.id) {
      case 'search-doctors':
        navigate('/doctors');
        break;
      case 'booking':
        navigate('/doctors');
        break;
      case 'appointments':
        navigate('/appointments');
        break;
      case 'prescriptions':
        navigate('/prescriptions');
        break;
      case 'doctor-portal':
        navigate('/manage-availability');
        break;
      default:
        navigate('/signup');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      {!isFullscreen && <Header />}
      
      <div style={{
        maxWidth: isFullscreen ? '100vw' : '1200px',
        margin: '0 auto',
        padding: isFullscreen ? '0' : '40px 20px',
        height: isFullscreen ? '100vh' : 'auto'
      }}>
        {/* Video Player Container */}
        <div 
          ref={videoRef}
          style={{
            position: 'relative',
            width: '100%',
            height: isFullscreen ? '100vh' : '600px',
            backgroundColor: '#000',
            borderRadius: isFullscreen ? '0' : '16px',
            overflow: 'hidden',
            cursor: showControls ? 'default' : 'none'
          }}
          onMouseMove={() => setShowControls(true)}
          onClick={handlePlayPause}
        >
          {/* Video Content Area */}
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `,
              animation: isPlaying ? 'float 6s ease-in-out infinite' : 'none'
            }}></div>

            {/* Main Content */}
            <div style={{
              textAlign: 'center',
              color: 'white',
              zIndex: 2,
              maxWidth: '800px',
              padding: '40px'
            }}>
              {/* Character Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                margin: '0 auto 24px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                animation: isPlaying ? 'bounce 2s infinite' : 'none'
              }}>
                {currentSceneData.thumbnail}
              </div>

              {/* Scene Title */}
              <h1 style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {currentSceneData.title}
              </h1>

              {/* Scene Description */}
              <p style={{
                fontSize: '20px',
                marginBottom: '24px',
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {currentSceneData.description}
              </p>

              {/* Narration Text */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {currentSceneData.content}
                </p>
              </div>

              {/* Try Feature Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTryFeature();
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Try This Feature →
              </button>
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}>
                <svg width="32" height="32" fill="#0d9488" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '20px',
            transform: showControls ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
            zIndex: 20
          }}>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              marginBottom: '16px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = Math.floor((clickX / rect.width) * duration);
              handleSeek(newTime);
            }}>
              <div style={{
                width: `${(currentTime / duration) * 100}%`,
                height: '100%',
                backgroundColor: '#0d9488',
                borderRadius: '3px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    {isPlaying ? (
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    ) : (
                      <path d="M8 5v14l11-7z"/>
                    )}
                  </svg>
                </button>

                {/* Time Display */}
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      {isMuted || volume === 0 ? (
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      ) : (
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      )}
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    style={{
                      width: '80px',
                      height: '4px',
                      background: '#333',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Scene Navigation */}
                <select
                  value={currentScene}
                  onChange={(e) => jumpToScene(parseInt(e.target.value))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px'
                  }}
                >
                  {scenes.map((scene, index) => (
                    <option key={scene.id} value={index} style={{ color: '#000' }}>
                      {scene.title}
                    </option>
                  ))}
                </select>

                {/* Fullscreen */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    {isFullscreen ? (
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    ) : (
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Information */}
        {!isFullscreen && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px'
            }}>
              PatientCare Platform Walkthrough
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Discover how PatientCare is revolutionizing healthcare in Bahrain. This comprehensive walkthrough 
              shows you every feature of our NHRA-approved platform, from finding doctors to managing your 
              complete healthcare journey.
            </p>

            {/* Chapter List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: index === currentScene ? '#f0fdfa' : '#f9fafb',
                    border: `2px solid ${index === currentScene ? '#0d9488' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentScene) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentScene) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {scene.thumbnail}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {scene.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {formatTime(scene.startTime)} - {formatTime(scene.endTime)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && <Footer />}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoWalkthrough;