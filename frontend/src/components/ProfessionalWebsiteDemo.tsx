import React, { useState, useEffect } from 'react';

interface DemoProps {
  onComplete?: () => void;
  showControls?: boolean;
}

const ProfessionalWebsiteDemo: React.FC<DemoProps> = ({ 
  onComplete, 
  showControls = true 
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [showTooltip, setShowTooltip] = useState('');
  const [clickEffect, setClickEffect] = useState({ show: false, x: 0, y: 0 });
  const [typingText, setTypingText] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Demo scenes with realistic timing
  const scenes = [
    { 
      id: 'homepage-load', 
      duration: 3000, 
      title: 'Home Page',
      description: 'Loading PatientCare homepage'
    },
    { 
      id: 'scroll-hero', 
      duration: 2500, 
      title: 'Hero Section',
      description: 'Exploring main banner'
    },
    { 
      id: 'features-section', 
      duration: 3000, 
      title: 'Our Features',
      description: 'Viewing platform features'
    },
    { 
      id: 'nav-hover', 
      duration: 1500, 
      title: 'Navigation',
      description: 'Exploring navigation menu'
    },
    { 
      id: 'about-page', 
      duration: 2500, 
      title: 'About Us',
      description: 'Learning about PatientCare'
    },
    { 
      id: 'services-menu', 
      duration: 2000, 
      title: 'Our Services',
      description: 'Discovering our services'
    },
    { 
      id: 'doctors-search', 
      duration: 3500, 
      title: 'Find Doctors',
      description: 'Searching for healthcare providers'
    },
    { 
      id: 'contact-form', 
      duration: 2500, 
      title: 'Contact Us',
      description: 'Getting in touch'
    },
    { 
      id: 'zoom-out', 
      duration: 2000, 
      title: 'Overview',
      description: 'Complete website overview'
    }
  ];

  // Smooth mouse movement with realistic easing
  const animateMouseTo = (targetX: number, targetY: number, duration: number = 1200) => {
    const startX = mousePos.x;
    const startY = mousePos.y;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Natural easing with slight overshoot
      const easeOutBack = (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      
      const easedProgress = progress < 0.8 ? 
        4 * progress * progress * progress : 
        easeOutBack((progress - 0.8) / 0.2) * 0.2 + 0.8;
      
      setMousePos({
        x: startX + (targetX - startX) * easedProgress,
        y: startY + (targetY - startY) * easedProgress
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Simulate click effect
  const simulateClick = (x: number, y: number) => {
    setClickEffect({ show: true, x, y });
    setTimeout(() => setClickEffect({ show: false, x: 0, y: 0 }), 300);
  };

  // Typing animation
  const typeText = (text: string, speed: number = 100) => {
    setTypingText('');
    let i = 0;
    const timer = setInterval(() => {
      setTypingText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);
  };

  // Execute scene actions
  useEffect(() => {
    if (!isPlaying || currentScene >= scenes.length) {
      if (currentScene >= scenes.length && onComplete) {
        onComplete();
      }
      return;
    }

    const scene = scenes[currentScene];
    executeScene(scene.id);

    const timer = setTimeout(() => {
      setCurrentScene(prev => prev + 1);
    }, scene.duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const executeScene = (sceneId: string) => {
    switch (sceneId) {
      case 'homepage-load':
        setScrollY(0);
        animateMouseTo(50, 30, 1000);
        setShowTooltip('');
        break;

      case 'scroll-hero':
        setTimeout(() => {
          setScrollY(400);
          animateMouseTo(45, 60, 1500);
        }, 500);
        break;

      case 'features-section':
        setTimeout(() => {
          setScrollY(800);
          animateMouseTo(35, 70, 1200);
        }, 300);
        setTimeout(() => animateMouseTo(65, 70, 800), 1500);
        break;

      case 'nav-hover':
        animateMouseTo(25, 12, 800);
        setTimeout(() => setShowTooltip('About Us'), 600);
        setTimeout(() => setShowTooltip(''), 1200);
        break;

      case 'about-page':
        simulateClick(25, 12);
        setScrollY(0);
        setTimeout(() => {
          setScrollY(300);
          animateMouseTo(50, 50, 1000);
        }, 800);
        break;

      case 'services-menu':
        animateMouseTo(40, 12, 600);
        setTimeout(() => setShowTooltip('Our Services'), 400);
        setTimeout(() => setShowTooltip(''), 1000);
        break;

      case 'doctors-search':
        simulateClick(40, 12);
        setScrollY(0);
        setTimeout(() => {
          animateMouseTo(50, 25, 800);
          typeText('Cardiology', 150);
        }, 500);
        setTimeout(() => {
          simulateClick(50, 25);
          animateMouseTo(70, 45, 1000);
        }, 2000);
        break;

      case 'contact-form':
        animateMouseTo(80, 12, 600);
        setTimeout(() => {
          setShowModal(true);
          animateMouseTo(60, 40, 800);
        }, 400);
        setTimeout(() => setShowModal(false), 2000);
        break;

      case 'zoom-out':
        setShowTooltip('');
        animateMouseTo(50, 50, 1000);
        break;
    }
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setMousePos({ x: 50, y: 50 });
    setScrollY(0);
    setShowTooltip('');
    setTypingText('');
    setShowModal(false);
    setIsPlaying(true);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Browser Window */}
      <div style={{
        width: '85%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        transform: currentScene >= scenes.length - 1 ? 'scale(0.9)' : 'scale(1)',
        transition: 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #334155'
      }}>
        {/* Browser Chrome */}
        <div style={{
          height: '40px',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          </div>
          <div style={{
            flex: 1,
            height: '24px',
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            marginLeft: '16px',
            fontSize: '13px',
            color: '#64748b',
            border: '1px solid #e2e8f0'
          }}>
            🔒 https://patientcare.bh
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          height: '64px',
          backgroundColor: 'white',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            PatientCare
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {['Home', 'About', 'Services', 'Doctors', 'Contact'].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#475569',
                  backgroundColor: mousePos.x > (15 + index * 15) && mousePos.x < (35 + index * 15) && mousePos.y < 20 ? '#f8fafc' : 'transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {item}
                {showTooltip === item && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    marginTop: '4px'
                  }}>
                    {item}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Page Content */}
        <div style={{
          height: 'calc(100% - 104px)',
          overflow: 'hidden',
          position: 'relative',
          transform: `translateY(-${scrollY}px)`,
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Hero Section */}
          <section style={{
            height: '100vh',
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ zIndex: 2, position: 'relative' }}>
              <h1 style={{
                fontSize: '4rem',
                fontWeight: '900',
                marginBottom: '24px',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}>
                Your Health, Our Priority
              </h1>
              <p style={{
                fontSize: '1.5rem',
                marginBottom: '32px',
                opacity: 0.95,
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}>
                Connect with qualified healthcare professionals across Bahrain
              </p>
              <button style={{
                padding: '16px 32px',
                fontSize: '18px',
                backgroundColor: 'white',
                color: '#0d9488',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transform: mousePos.x > 40 && mousePos.x < 60 && mousePos.y > 70 && mousePos.y < 80 ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
              }}>
                Get Started Today
              </button>
            </div>
          </section>

          {/* Features Section */}
          <section style={{
            padding: '80px 32px',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '48px',
                color: '#1e293b'
              }}>
                Why Choose PatientCare?
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '32px'
              }}>
                {[
                  {
                    icon: '🏥',
                    title: 'NHRA Licensed Doctors',
                    description: 'All healthcare providers are verified and licensed'
                  },
                  {
                    icon: '📱',
                    title: 'Digital Consultations',
                    description: 'Secure video consultations from home'
                  },
                  {
                    icon: '⚡',
                    title: 'Instant Booking',
                    description: 'Book appointments with real-time availability'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      padding: '40px',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      transform: mousePos.x > (20 + index * 30) && mousePos.x < (50 + index * 30) && mousePos.y > 60 && mousePos.y < 85 ? 'translateY(-8px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '24px'
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#1e293b'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      color: '#64748b',
                      lineHeight: '1.7',
                      fontSize: '16px'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section style={{
            padding: '80px 32px',
            backgroundColor: 'white'
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '32px',
                color: '#1e293b'
              }}>
                Find Your Doctor
              </h2>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '32px',
                borderRadius: '16px',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <input
                    type="text"
                    placeholder="Search by specialty, doctor name..."
                    value={typingText}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      borderColor: mousePos.x > 30 && mousePos.x < 70 && mousePos.y > 20 && mousePos.y < 35 ? '#0d9488' : '#e2e8f0',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  <button style={{
                    padding: '16px 24px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mouse Cursor */}
      <div style={{
        position: 'absolute',
        left: `${mousePos.x}%`,
        top: `${mousePos.y}%`,
        pointerEvents: 'none',
        zIndex: 1000,
        transition: 'all 0.1s ease'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 3L19 12L12 13.5L8.5 20L5.5 3Z"
            fill="white"
            stroke="#1e293b"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Click Effect */}
      {clickEffect.show && (
        <div style={{
          position: 'absolute',
          left: `${clickEffect.x}%`,
          top: `${clickEffect.y}%`,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#0d9488',
          opacity: 0.6,
          transform: 'translate(-50%, -50%)',
          animation: 'clickRipple 0.3s ease-out',
          pointerEvents: 'none',
          zIndex: 999
        }}></div>
      )}

      {/* Contact Modal */}
      {showModal && (
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '10%',
          width: '320px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          padding: '32px',
          zIndex: 1001,
          animation: 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#1e293b'
          }}>
            Get In Touch
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Have questions? Our team is here to help you 24/7.
          </p>
          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0d9488',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Start Conversation
          </button>
        </div>
      )}

      {/* Scene Indicator */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '16px', marginBottom: '4px' }}>
          {currentScene < scenes.length ? scenes[currentScene].title : 'Demo Complete'}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          {currentScene < scenes.length ? scenes[currentScene].description : 'Thank you for watching!'}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        backgroundColor: 'rgba(30, 41, 59, 0.3)'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: '#0d9488',
          width: `${(currentScene / scenes.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>

      {/* Controls */}
      {showControls && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '12px 20px',
              backgroundColor: isPlaying ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={handleRestart}
            style={{
              padding: '12px 20px',
              backgroundColor: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Restart
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes clickRipple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalWebsiteDemo;