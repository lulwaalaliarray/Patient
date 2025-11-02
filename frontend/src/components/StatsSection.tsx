import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleNavigation, routes } from '../utils/navigation';
import { useToast } from './Toast';

const StatsSection: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const stats = [
    {
      number: '5,000+',
      label: 'Bahraini Patients',
      description: 'Trusted by patients across all governorates'
    },
    {
      number: '200+',
      label: 'Licensed Doctors',
      description: 'NHRA-licensed specialists and GPs'
    },
    {
      number: '15+',
      label: 'Partner Hospitals',
      description: 'Connected to major Bahraini hospitals'
    },
    {
      number: '24/7',
      label: 'Arabic Support',
      description: 'Round-the-clock assistance in Arabic & English'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#0d9488',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: window.innerWidth >= 768 ? '36px' : '28px',
            fontWeight: '800',
            color: 'white',
            marginBottom: '16px'
          }}>
            Trusted by Healthcare Professionals
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Join thousands of Bahraini patients and healthcare providers who trust PatientCare for their medical needs across the Kingdom.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, 1fr)' : window.innerWidth >= 640 ? 'repeat(2, 1fr)' : '1fr',
          gap: '40px'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                padding: '20px'
              }}
            >
              <div style={{
                fontSize: window.innerWidth >= 768 ? '48px' : '36px',
                fontWeight: '800',
                color: 'white',
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px'
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.4'
              }}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default StatsSection;