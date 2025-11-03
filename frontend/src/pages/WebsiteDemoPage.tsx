import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WebsiteDemoPlayer from '../components/WebsiteDemoPlayer';

const WebsiteDemoPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <main style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              PatientCare Platform Demo
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Experience our healthcare platform through this realistic screen recording demo. 
              See how patients and doctors interact with our intuitive interface.
            </p>
          </div>

          {/* Main Demo Player */}
          <div style={{ marginBottom: '80px' }}>
            <WebsiteDemoPlayer 
              height="700px"
              showTitle={false}
              autoPlay={false}
            />
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '80px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#ecfdf5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px'
              }}>
                🎬
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Realistic Screen Recording
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6'
              }}>
                Watch a genuine browser experience with natural mouse movements, 
                smooth scrolling, and realistic user interactions.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px'
              }}>
                🖱️
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Interactive Elements
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6'
              }}>
                See hover effects, button interactions, form filling, 
                and navigation in action with smooth animations.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Professional Quality
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6'
              }}>
                High-quality 1080p presentation with smooth transitions, 
                modern design, and professional UI/UX showcase.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Ready to Experience PatientCare?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px'
            }}>
              Join thousands of patients and healthcare providers who trust 
              PatientCare for their medical needs.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => window.location.href = '/signup'}
                style={{
                  padding: '16px 32px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f766e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d9488';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get Started Free
              </button>
              <button
                onClick={() => window.location.href = '/doctors'}
                style={{
                  padding: '16px 32px',
                  backgroundColor: 'transparent',
                  color: '#0d9488',
                  border: '2px solid #0d9488',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d9488';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#0d9488';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Find Doctors
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WebsiteDemoPage;