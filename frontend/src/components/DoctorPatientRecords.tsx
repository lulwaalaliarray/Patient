import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientRecord, patientRecordsStorage } from '../utils/patientRecordsStorage';
interface DoctorPatientRecordsProps {
  doctorId: string;
}

// Helper function to get patients the doctor has actually seen (completed appointments)
const getSeenPatientIds = (doctorId: string): string[] => {
  const completedAppointments = JSON.parse(localStorage.getItem('patientcare_appointments') || '[]');
  const doctorCompletedAppointments = completedAppointments.filter((apt: any) => 
    apt.doctorId === doctorId && apt.status === 'completed'
  );
  return [...new Set(doctorCompletedAppointments.map((apt: any) => apt.patientId || apt.patientEmail))] as string[];
};

const DoctorPatientRecords: React.FC<DoctorPatientRecordsProps> = ({ doctorId }) => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isViewingSinglePatient, setIsViewingSinglePatient] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [doctorId]);

  const loadPatients = () => {
    setLoading(true);
    
    const seenPatientIds = getSeenPatientIds(doctorId);
    
    if (seenPatientIds.length === 0) {
      // No patients seen yet, don't initialize sample data
      setPatients([]);
      setLoading(false);
      return;
    }
    
    // Initialize sample data only if no records exist AND doctor has seen patients
    patientRecordsStorage.initializeSampleData(doctorId);
    const allRecords = patientRecordsStorage.getDoctorPatientRecords(doctorId);
    
    // Filter records to only include patients the doctor has actually seen
    let filteredRecords = allRecords.filter(record => 
      seenPatientIds.includes(record.id) || seenPatientIds.includes(record.contactInfo.email)
    );
    
    // If viewing a specific patient, filter further
    if (patientId) {
      filteredRecords = filteredRecords.filter(record => 
        record.id === patientId || record.contactInfo.email === patientId
      );
      setIsViewingSinglePatient(true);
      
      // Check if doctor has access to this specific patient
      if (filteredRecords.length === 0) {
        // Patient not found or doctor doesn't have access
        setLoading(false);
        return;
      }
    } else {
      setIsViewingSinglePatient(false);
    }
    
    setPatients(filteredRecords);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const seenPatientIds = getSeenPatientIds(doctorId);
    
    if (query.trim() === '') {
      const allRecords = patientRecordsStorage.getDoctorPatientRecords(doctorId);
      const filteredRecords = allRecords.filter(record => 
        seenPatientIds.includes(record.id) || seenPatientIds.includes(record.contactInfo.email)
      );
      setPatients(filteredRecords);
    } else {
      const results = patientRecordsStorage.searchPatientRecords(doctorId, query);
      const filteredResults = results.filter(record => 
        seenPatientIds.includes(record.id) || seenPatientIds.includes(record.contactInfo.email)
      );
      setPatients(filteredResults);
    }
  };

  const handleExport = () => {
    const jsonData = patientRecordsStorage.exportPatientRecords(doctorId);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatHeight = (height: PatientRecord['physicalInfo']['height']) => {
    if (height.unit === 'cm') {
      return `${height.value} cm`;
    } else {
      return `${height.feet}'${height.inches}"`;
    }
  };

  const formatWeight = (weight: PatientRecord['physicalInfo']['weight']) => {
    return `${weight.value} ${weight.unit}`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading patient records...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {/* Back Button for Single Patient View */}
          {isViewingSinglePatient && (
            <button
              onClick={() => navigate('/patient-records')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Patient Records
            </button>
          )}

          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827',
            margin: 0
          }}>
            {isViewingSinglePatient ? 'Patient Details' : 'Patient Records'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '8px 0 0 0'
          }}>
            {isViewingSinglePatient 
              ? 'Detailed records for this patient'
              : 'Records for patients you have completed appointments with'
            }
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
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
              + Add Patient
            </button>
            <button
              onClick={handleExport}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5856eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6366f1';
              }}
            >
              Export Records
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by name, CPR number, or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#0d9488';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
          <svg 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#6b7280'
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="#2563eb" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2M4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v4H4v-4z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', margin: 0 }}>
                {patients.length}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Total Patients
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dcfce7',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="#16a34a" viewBox="0 0 24 24">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
                {patients.reduce((sum, p) => sum + p.numberOfVisits, 0)}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Total Visits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Records Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {patients.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <svg 
              style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#d1d5db' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              {isViewingSinglePatient ? 'Access Denied' : 'No patient records found'}
            </h3>
            <p style={{ margin: 0 }}>
              {isViewingSinglePatient 
                ? 'You can only view records for patients you have completed appointments with.'
                : searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Patient records will appear here after you complete appointments with patients'
              }
            </p>
            {isViewingSinglePatient && (
              <button
                onClick={() => navigate('/patient-records')}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Back to All Records
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Patient
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    CPR Number
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Visits
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Height/Weight
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Contact
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Last Visit
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr 
                    key={patient.id}
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#0d9488',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {patient.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                            {patient.fullName}
                          </p>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            {patient.contactInfo.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#374151' }}>
                      {patient.cprNumber}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {patient.numberOfVisits}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>
                      <div>
                        <div>{formatHeight(patient.physicalInfo.height)}</div>
                        <div>{formatWeight(patient.physicalInfo.weight)}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>
                      <div>
                        <div>{patient.contactInfo.phoneNumber}</div>
                        <div style={{ color: '#6b7280' }}>
                          {patient.contactInfo.address.city}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>
                      {patient.lastVisit 
                        ? new Date(patient.lastVisit).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'No visits'
                      }
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdate={loadPatients}
        />
      )}

      {/* Add Patient Form Modal */}
      {showAddForm && (
        <AddPatientForm
          doctorId={doctorId}
          onClose={() => setShowAddForm(false)}
          onAdd={loadPatients}
        />
      )}
    </div>
  );
};

// Patient Detail Modal Component
interface PatientDetailModalProps {
  patient: PatientRecord;
  onClose: () => void;
  onUpdate: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose, onUpdate }) => {
  const handleIncrementVisit = () => {
    patientRecordsStorage.incrementVisitCount(patient.id);
    onUpdate();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Patient Details
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px' }}>
          {/* Patient Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#0d9488',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '32px'
            }}>
              {patient.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                {patient.fullName}
              </h3>
              <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 8px 0' }}>
                CPR: {patient.cprNumber}
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {patient.numberOfVisits} visits
                </span>
                <button
                  onClick={handleIncrementVisit}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  + Add Visit
                </button>
              </div>
            </div>
          </div>

          {/* Patient Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Physical Information */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Physical Information
              </h4>
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Height:</span>
                  <span style={{ fontSize: '16px', color: '#111827', marginLeft: '8px' }}>
                    {patient.physicalInfo.height.unit === 'cm' 
                      ? `${patient.physicalInfo.height.value} cm`
                      : `${patient.physicalInfo.height.feet}'${patient.physicalInfo.height.inches}"`
                    }
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Weight:</span>
                  <span style={{ fontSize: '16px', color: '#111827', marginLeft: '8px' }}>
                    {patient.physicalInfo.weight.value} {patient.physicalInfo.weight.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Contact Information
              </h4>
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Phone:</span>
                  <span style={{ fontSize: '16px', color: '#111827', marginLeft: '8px' }}>
                    {patient.contactInfo.phoneNumber}
                  </span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Email:</span>
                  <span style={{ fontSize: '16px', color: '#111827', marginLeft: '8px' }}>
                    {patient.contactInfo.email}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Address:</span>
                  <div style={{ fontSize: '16px', color: '#111827', marginTop: '4px' }}>
                    {patient.contactInfo.address.street}<br />
                    {patient.contactInfo.address.city}, {patient.contactInfo.address.governorate}<br />
                    {patient.contactInfo.address.postalCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Medical History
            </h4>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Diagnoses:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {patient.medicalHistory.diagnoses.map((diagnosis, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    >
                      {diagnosis}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Current Treatments:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {patient.medicalHistory.treatments.map((treatment, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Allergies:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {patient.medicalHistory.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#fecaca',
                        color: '#991b1b',
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {patient.medicalHistory.notes && (
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Notes:
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    margin: 0,
                    padding: '12px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {patient.medicalHistory.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import AddPatientForm from './AddPatientForm';

export default DoctorPatientRecords;