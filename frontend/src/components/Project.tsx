import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Project: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}>
            PatientCare Project Overview
          </h1>
          
          <div style={{ display: 'grid', gap: '24px' }}>
            <section>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                About PatientCare
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
                PatientCare is a comprehensive healthcare platform designed specifically for the Kingdom of Bahrain. 
                Our mission is to connect patients with NHRA-licensed healthcare professionals through a secure, 
                user-friendly digital platform that supports both Arabic and English languages.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                Key Features
              </h2>
              <ul style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
                <li>NHRA-licensed doctor verification and directory</li>
                <li>Real-time appointment booking and management</li>
                <li>Secure telemedicine and video consultations</li>
                <li>Digital health records and prescription management</li>
                <li>Bilingual support (Arabic and English)</li>
                <li>Integration with Bahrain's healthcare system</li>
                <li>Mobile-responsive design for all devices</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                Technology Stack
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { category: 'Frontend', tech: 'React, TypeScript, Vite' },
                  { category: 'Backend', tech: 'Node.js, Express, PostgreSQL' },
                  { category: 'Security', tech: 'JWT, Encryption, HIPAA' },
                  { category: 'Deployment', tech: 'Docker, AWS, CI/CD' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
                      {item.category}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {item.tech}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Project;