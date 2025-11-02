import React, { useEffect, useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import DoctorDashboard from './DoctorDashboard';
import { isLoggedIn } from '../utils/navigation';

interface WelcomeScreenProps {
  onGetStarted?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType?: string;
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for user authentication on component mount
  useEffect(() => {
    if (isLoggedIn()) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #0d9488',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If user is a doctor, show doctor dashboard
  if (user && user.userType === 'doctor') {
    return <DoctorDashboard user={user} />;
  }

  // Default welcome screen for non-authenticated users and patients
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Header />
      
      {/* Hero Section with video/slideshow */}
      <HeroSection onGetStarted={onGetStarted} />
      
      {/* Features Section with information */}
      <FeaturesSection />
      
      {/* Statistics Section */}
      <StatsSection />
      
      <Footer />
      <BackToTopButton />
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomeScreen;