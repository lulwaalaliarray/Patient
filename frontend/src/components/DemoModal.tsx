import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const DemoModal: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: "Welcome to PatientCare",
      description: "Your comprehensive healthcare platform for Bahrain",
      image: "🏥",
      content: "PatientCare connects you with NHRA-licensed healthcare professionals across the Kingdom of Bahrain. Experience seamless appointment booking, secure messaging, and comprehensive health management."
    },
    {
      title: "Find Qualified Doctors",
      description: "Search NHRA-licensed specialists near you",
      image: "👨‍⚕️",
      content: "Browse through our network of verified healthcare professionals. Filter by specialization, location, availability, and patient reviews to find the perfect doctor for your needs."
    },
    {
      title: "Book Appointments Easily",
      description: "Real-time scheduling with instant confirmation",
      image: "📅",
      content: "View real-time availability and book appointments instantly. Choose between in-person visits or telemedicine consultations. Receive SMS reminders in Arabic or English."
    },
    {
      title: "Secure Health Records",
      description: "Access your complete medical history",
      image: "📋",
      content: "Your health records are securely stored and accessible anytime. Integration with MOH systems and major Bahraini hospitals ensures comprehensive medical history tracking."
    },
    {
      title: "Telemedicine & Chat",
      description: "Connect with doctors from anywhere",
      image: "💬",
      content: "Secure video consultations and HIPAA-compliant messaging. Perfect for follow-ups, prescription renewals, and consultations from the comfort of your home."
    },
    {
      title: "Prescription Management",
      description: "Digital prescriptions and medication tracking",
      image: "💊",
      content: "Receive digital prescriptions directly from your doctor. Track medication schedules, refill reminders, and maintain a complete medication history."
    }
  ];

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/signup');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < demoSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
      });
    }, 3000);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          textAlign: 'center'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px'
            }}>
              PatientCare Platform Demo
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover how PatientCare revolutionizes healthcare in Bahrain
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            marginBottom: '40px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
              height: '100%',
              backgroundColor: '#0d9488',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {/* Step Counter */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px'
          }}>
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentStep ? '#0d9488' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '60px 40px',
            marginBottom: '40px',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Icon */}
            <div style={{
              fontSize: '80px',
              marginBottom: '24px',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              {currentStepData.image}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px',
              animation: 'slideUp 0.5s ease-out'
            }}>
              {currentStepData.title}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '20px',
              color: '#0d9488',
              fontWeight: '600',
              marginBottom: '24px',
              animation: 'slideUp 0.5s ease-out 0.1s both'
            }}>
              {currentStepData.description}
            </p>

            {/* Content */}
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6',
              maxWidth: '600px',
              animation: 'slideUp 0.5s ease-out 0.2s both'
            }}>
              {currentStepData.content}
            </p>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: currentStep === 0 ? '#f9fafb' : 'white',
                color: currentStep === 0 ? '#9ca3af' : '#374151',
                fontSize: '16px',
                fontWeight: '500',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={startAutoPlay}
                disabled={isPlaying}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #0d9488',
                  borderRadius: '8px',
                  backgroundColor: isPlaying ? '#f0fdfa' : 'white',
                  color: '#0d9488',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isPlaying ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #0d9488',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Playing...
                  </>
                ) : (
                  <>
                    ▶ Auto Play
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #6b7280',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Skip Demo
              </button>
            </div>

            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#0d9488',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f766e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0d9488';
              }}
            >
              {currentStep === demoSteps.length - 1 ? 'Get Started →' : 'Next →'}
            </button>
          </div>

          {/* Step Info */}
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: 0
          }}>
            Step {currentStep + 1} of {demoSteps.length}
          </p>
        </div>

        {/* Features Preview */}
        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {['NHRA Approved', 'MOH Certified', 'Arabic & English', '24/7 Support'].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <span style={{ fontSize: '20px' }}>✓</span>
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {feature}
              </h4>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `}
      </style>
    </div>
  );
};

export default DemoModal;