import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const ScreenRecordingDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [showCursor] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [showOverlay, setShowOverlay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Screen recording steps
  const recordingSteps = [
    {
      id: 'browser-load',
      duration: 2000,
      page: 'home',
      action: 'Browser loads PatientCare homepage',
      cursor: { x: 50, y: 50 },
      overlay: 'Home Page',
      description: 'Loading PatientCare.bh in Chrome browser'
    },
    {
      id: 'scroll-hero',
      duration: 3000,
      page: 'home',
      action: 'Scroll down to view hero section',
      cursor: { x: 50, y: 60 },
      overlay: 'Hero Section',
      description: 'Viewing main banner and call-to-action'
    },
    {
      id: 'scroll-features',
      duration: 3000,
      page: 'home',
      action: 'Continue scrolling to features',
      cursor: { x: 50, y: 70 },
      overlay: 'Features',
      description: 'Exploring platform features'
    },
    {
      id: 'hover-nav',
      duration: 2000,
      page: 'home',
      action: 'Move cursor to navigation',
      cursor: { x: 30, y: 15 },
      overlay: '',
      description: 'Navigating to top menu'
    },
    {
      id: 'click-doctors',
      duration: 1500,
      page: 'home',
      action: 'Click on Find Doctors',
      cursor: { x: 35, y: 15 },
      overlay: 'Navigation',
      description: 'Clicking Find Doctors menu item'
    },
    {
      id: 'page-load',
      duration: 2000,
      page: 'doctors',
      action: 'Doctors page loads',
      cursor: { x: 50, y: 30 },
      overlay: 'Find Doctors',
      description: 'Loading doctor search page'
    },
    {
      id: 'search-interaction',
      duration: 4000,
      page: 'doctors',
      action: 'Interact with search filters',
      cursor: { x: 25, y: 40 },
      overlay: 'Search & Filter',
      description: 'Using search and filter options'
    },
    {
      id: 'hover-doctor',
      duration: 3000,
      page: 'doctors',
      action: 'Hover over doctor card',
      cursor: { x: 60, y: 55 },
      overlay: 'Doctor Profiles',
      description: 'Viewing doctor information'
    },
    {
      id: 'click-book',
      duration: 2000,
      page: 'doctors',
      action: 'Click book appointment',
      cursor: { x: 65, y: 65 },
      overlay: 'Book Appointment',
      description: 'Initiating appointment booking'
    },
    {
      id: 'zoom-out',
      duration: 3000,
      page: 'doctors',
      action: 'Zoom out to show full page',
      cursor: { x: 50, y: 50 },
      overlay: 'PatientCare Platform',
      description: 'Complete platform overview'
    }
  ];

  const currentStepData = recordingSteps[currentStep] || recordingSteps[0];

  // Auto-play functionality
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && currentStep < recordingSteps.length - 1) {
      timeout = setTimeout(() => {
        const nextStep = recordingSteps[currentStep + 1];
        
        // Show loading between page changes
        if (nextStep.page !== currentStepData.page) {
          setIsLoading(true);
          setTimeout(() => {
            setCurrentPage(nextStep.page);
            setIsLoading(false);
          }, 800);
        }
        
        setCurrentStep(prev => prev + 1);
      }, currentStepData.duration);
    } else if (isPlaying && currentStep === recordingSteps.length - 1) {
      timeout = setTimeout(() => {
        setIsPlaying(false);
      }, currentStepData.duration);
    }
    return () => clearTimeout(timeout);
  }, [currentStep, isPlaying, currentStepData]);

  // Animate cursor movement
  useEffect(() => {
    const targetCursor = currentStepData.cursor;
    const startCursor = cursorPosition;
    
    let animationFrame: number;
    let startTime: number;
    const duration = 1000; // 1 second for cursor movement
    
    const animateCursor = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for natural movement
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCursorPosition({
        x: startCursor.x + (targetCursor.x - startCursor.x) * easeProgress,
        y: startCursor.y + (targetCursor.y - startCursor.y) * easeProgress
      });
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCursor);
      }
    };
    
    animationFrame = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentStep]);

  // Update overlay text
  useEffect(() => {
    if (currentStepData.overlay) {
      setShowOverlay(currentStepData.overlay);
      const timer = setTimeout(() => setShowOverlay(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (currentStep === recordingSteps.length - 1) {
      setCurrentStep(0);
      setCurrentPage('home');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCurrentPage('home');
    setIsPlaying(true);
  };

  const handleSkipForward = () => {
    const nextStep = Math.min(currentStep + 1, recordingSteps.length - 1);
    setCurrentStep(nextStep);
    const stepData = recordingSteps[nextStep];
    if (stepData.page !== currentPage) {
      setCurrentPage(stepData.page);
    }
  };

  const handleSkipBackward = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    const stepData = recordingSteps[prevStep];
    if (stepData.page !== currentPage) {
      setCurrentPage(stepData.page);
    }
  };

  const handleWebsiteClick = () => {
    navigate('/');
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <div style={{ height: '100%', overflow: 'hidden' }}>
          {/* Homepage Content */}
          <div style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
            transform: currentStep >= 1 ? 'translateY(-20%)' : 'translateY(0)',
            transition: 'transform 2s ease'
          }}>
            {/* Hero Content */}
            <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '24px',
                opacity: currentStep >= 0 ? 1 : 0,
                transform: currentStep >= 0 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s ease 0.5s'
              }}>
                Your Health, Simplified
              </h1>
              <p style={{
                fontSize: '20px',
                marginBottom: '32px',
                opacity: currentStep >= 1 ? 1 : 0,
                transform: currentStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s ease 1s'
              }}>
                Connect with Bahrain's top healthcare professionals
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                opacity: currentStep >= 1 ? 1 : 0,
                transform: currentStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s ease 1.5s'
              }}>
                <button style={{
                  padding: '16px 32px',
                  backgroundColor: 'white',
                  color: '#0d9488',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transform: cursorPosition.x > 45 && cursorPosition.x < 55 && cursorPosition.y > 55 && cursorPosition.y < 65 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}>
                  Get Started Free
                </button>
                <button style={{
                  padding: '16px 32px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transform: cursorPosition.x > 55 && cursorPosition.x < 65 && cursorPosition.y > 55 && cursorPosition.y < 65 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}>
                  Watch Demo
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div style={{
            padding: '80px 20px',
            backgroundColor: 'white',
            transform: currentStep >= 2 ? 'translateY(-100vh)' : 'translateY(0)',
            transition: 'transform 2s ease'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '48px', color: '#111827' }}>
                Platform Features
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {[
                  { icon: '👨‍⚕️', title: 'Find Doctors', desc: 'Search NHRA-licensed specialists' },
                  { icon: '📅', title: 'Book Appointments', desc: 'Real-time scheduling system' },
                  { icon: '💊', title: 'Digital Prescriptions', desc: 'Secure medication management' },
                  { icon: '📱', title: 'Telemedicine', desc: 'Video consultations available' }
                ].map((feature, index) => (
                  <div key={index} style={{
                    padding: '32px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    transform: cursorPosition.x > (index * 25) && cursorPosition.x < ((index + 1) * 25) && cursorPosition.y > 65 && cursorPosition.y < 85 ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'transform 0.3s ease',
                    boxShadow: cursorPosition.x > (index * 25) && cursorPosition.x < ((index + 1) * 25) && cursorPosition.y > 65 && cursorPosition.y < 85 ? '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: '#6b7280' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentPage === 'doctors') {
      return (
        <div style={{ height: '100%', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
          {/* Doctors Page Header */}
          <div style={{
            backgroundColor: 'white',
            padding: '40px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Find Healthcare Professionals
              </h1>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                Search from over 500+ NHRA-licensed doctors across Bahrain
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px 20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transform: cursorPosition.x > 20 && cursorPosition.x < 50 && cursorPosition.y > 35 && cursorPosition.y < 45 ? 'scale(1.02)' : 'scale(1)',
                    borderColor: cursorPosition.x > 20 && cursorPosition.x < 50 && cursorPosition.y > 35 && cursorPosition.y < 45 ? '#0d9488' : '#e5e7eb',
                    transition: 'all 0.2s ease'
                  }}
                />
                <select style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  minWidth: '150px',
                  transform: cursorPosition.x > 50 && cursorPosition.x < 70 && cursorPosition.y > 35 && cursorPosition.y < 45 ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}>
                  <option>All Specialties</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Pediatrics</option>
                </select>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transform: cursorPosition.x > 70 && cursorPosition.x < 85 && cursorPosition.y > 35 && cursorPosition.y < 45 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Cards */}
          <div style={{ padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px'
              }}>
                {[
                  { name: 'Dr. Ahmed Al-Mahmood', specialty: 'Cardiologist', rating: 4.9, fee: '25 BHD' },
                  { name: 'Dr. Fatima Al-Zahra', specialty: 'Dermatologist', rating: 4.8, fee: '30 BHD' },
                  { name: 'Dr. Mohammed Hassan', specialty: 'Pediatrician', rating: 4.9, fee: '20 BHD' },
                  { name: 'Dr. Aisha Al-Khalifa', specialty: 'Gynecologist', rating: 4.7, fee: '35 BHD' }
                ].map((doctor, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    transform: cursorPosition.x > (50 + index * 10) && cursorPosition.x < (70 + index * 10) && cursorPosition.y > 50 && cursorPosition.y < 70 ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.3s ease',
                    border: cursorPosition.x > (50 + index * 10) && cursorPosition.x < (70 + index * 10) && cursorPosition.y > 50 && cursorPosition.y < 70 ? '2px solid #0d9488' : '2px solid transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#0d9488',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '600'
                      }}>
                        {doctor.name.split(' ')[1][0]}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                          {doctor.name}
                        </h3>
                        <p style={{ color: '#6b7280', margin: 0 }}>{doctor.specialty}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#f59e0b' }}>★</span>
                        <span style={{ fontWeight: '600' }}>{doctor.rating}</span>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>(150+ reviews)</span>
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#0d9488' }}>
                        {doctor.fee}
                      </span>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: cursorPosition.x > (60 + index * 10) && cursorPosition.x < (80 + index * 10) && cursorPosition.y > 60 && cursorPosition.y < 70 ? '#0f766e' : '#0d9488',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transform: cursorPosition.x > (60 + index * 10) && cursorPosition.x < (80 + index * 10) && cursorPosition.y > 60 && cursorPosition.y < 70 ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}>
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      {/* Demo Title Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Interactive Demo
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Watch how easy it is to book appointments and manage your healthcare with PatientCare
        </p>
      </div>
      
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        justifyContent: 'center'
      }}>
      {/* Browser Window Frame - Smaller Size */}
      <div style={{
        width: '800px',
        height: '500px',
        backgroundColor: '#374151',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onClick={handleWebsiteClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      }}>
        {/* Browser Header */}
        <div style={{
          backgroundColor: '#374151',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #4b5563'
        }}>
          {/* Traffic Lights */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </div>
          
          {/* Address Bar */}
          <div style={{
            flex: 1,
            backgroundColor: '#4b5563',
            borderRadius: '6px',
            padding: '6px 12px',
            marginLeft: '16px',
            color: '#d1d5db',
            fontSize: '14px'
          }}>
            🔒 https://patientcare.bh{currentPage === 'doctors' ? '/doctors' : ''}
          </div>
        </div>

        {/* Browser Navigation */}
        <div style={{
          backgroundColor: 'white',
          padding: '0',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          {/* Navigation Bar */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#0d9488',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600'
              }}>
                P
              </div>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                PatientCare
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '32px' }}>
              {['Home', 'Find Doctors', 'About', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: cursorPosition.x > (25 + index * 10) && cursorPosition.x < (35 + index * 10) && cursorPosition.y > 10 && cursorPosition.y < 20 ? '#0d9488' : '#374151',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transform: cursorPosition.x > (25 + index * 10) && cursorPosition.x < (35 + index * 10) && cursorPosition.y > 10 && cursorPosition.y < 20 ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
            
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              transform: cursorPosition.x > 85 && cursorPosition.x < 95 && cursorPosition.y > 10 && cursorPosition.y < 20 ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}>
              Sign Up
            </button>
          </nav>
        </div>

        {/* Page Content */}
        <div style={{
          height: '400px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          {/* Loading Overlay */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #0d9488',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}
          
          {renderPage()}
          
          {/* Mouse Cursor */}
          {showCursor && (
            <div style={{
              position: 'absolute',
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
              width: '20px',
              height: '20px',
              pointerEvents: 'none',
              zIndex: 1000,
              transition: 'all 0.1s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 3L19 12L12 13L8 19L5 3Z" fill="white" stroke="black" strokeWidth="1"/>
              </svg>
            </div>
          )}
          
          {/* Text Overlay */}
          {showOverlay && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1001,
              animation: 'fadeInOut 2s ease'
            }}>
              {showOverlay}
            </div>
          )}
        </div>
      </div>

      {/* Video Controls */}
      <div style={{
        width: '800px',
        margin: '20px auto 0',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Interactive Demo
          </h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>
            {currentStepData.description} • Step {currentStep + 1} of {recordingSteps.length}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '11px' }}>
            Click the demo to visit the website
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleSkipBackward}
            disabled={currentStep === 0}
            style={{
              padding: '6px 12px',
              backgroundColor: currentStep === 0 ? '#f3f4f6' : '#e5e7eb',
              color: currentStep === 0 ? '#9ca3af' : '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            ⏪ -5s
          </button>
          
          <button
            onClick={handleRestart}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            ↻
          </button>
          
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              padding: '6px 12px',
              backgroundColor: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button
            onClick={handleSkipForward}
            disabled={currentStep === recordingSteps.length - 1}
            style={{
              padding: '6px 12px',
              backgroundColor: currentStep === recordingSteps.length - 1 ? '#f3f4f6' : '#e5e7eb',
              color: currentStep === recordingSteps.length - 1 ? '#9ca3af' : '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === recordingSteps.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            +5s ⏩
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
      </div>
      
      <Footer />
    </div>
  );
};

export default ScreenRecordingDemo;