import React, { useState, useEffect } from 'react';
import { PatientRecord, patientRecordsStorage } from '../utils/patientRecordsStorage';

interface AddPatientFormProps {
  doctorId: string;
  onClose: () => void;
  onAdd: () => void;
}

interface PreviousPatient {
  id: string;
  name: string;
  email: string;
  appointmentDate: string;
  appointmentType: string;
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ doctorId, onClose, onAdd }) => {
  const [mode, setMode] = useState<'select' | 'new'>('select');
  const [previousPatients, setPreviousPatients] = useState<PreviousPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PreviousPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    cprNumber: '',
    email: '',
    phoneNumber: '',
    height: '',
    heightUnit: 'cm' as 'cm' | 'ft/in',
    feet: '',
    inches: '',
    weight: '',
    weightUnit: 'kg' as 'kg' | 'lbs',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
    diagnoses: '',
    treatments: '',
    allergies: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPreviousPatients();
  }, [doctorId]);

  const loadPreviousPatients = () => {
    try {
      // Get completed appointments for this doctor
      const appointmentStorageData = localStorage.getItem('patientcare_appointments');
      if (!appointmentStorageData) return;
      
      const appointments = JSON.parse(appointmentStorageData);
      const completedAppointments = appointments.filter((apt: any) => 
        apt.doctorId === doctorId && apt.status === 'completed'
      );
      
      // Get unique patients from completed appointments
      const patientMap = new Map<string, PreviousPatient>();
      completedAppointments.forEach((apt: any) => {
        const patientKey = apt.patientId || apt.patientEmail;
        if (!patientMap.has(patientKey)) {
          patientMap.set(patientKey, {
            id: patientKey,
            name: apt.patientName,
            email: apt.patientEmail,
            appointmentDate: apt.date,
            appointmentType: apt.type
          });
        }
      });
      
      // Filter out patients who already have records
      const existingRecords = patientRecordsStorage.getDoctorPatientRecords(doctorId);
      const existingPatientIds = existingRecords.map(record => record.id);
      const existingPatientEmails = existingRecords.map(record => record.contactInfo.email);
      
      const availablePatients = Array.from(patientMap.values()).filter(patient => 
        !existingPatientIds.includes(patient.id) && 
        !existingPatientEmails.includes(patient.email)
      );
      
      setPreviousPatients(availablePatients);
    } catch (error) {
      console.error('Error loading previous patients:', error);
    }
  };

  const handlePatientSelection = (patient: PreviousPatient) => {
    setSelectedPatient(patient);
    // Pre-populate available information
    setFormData(prev => ({
      ...prev,
      fullName: patient.name,
      email: patient.email,
      // Leave other fields empty for the doctor to fill
    }));
    setMode('new'); // Switch to form mode
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.cprNumber.trim()) newErrors.cprNumber = 'CPR number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.height.trim()) newErrors.height = 'Height is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // CPR validation (basic format check)
    if (formData.cprNumber && !/^\d{9}$/.test(formData.cprNumber)) {
      newErrors.cprNumber = 'CPR number must be 9 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredPatients = previousPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const newPatient: Omit<PatientRecord, 'id' | 'dateCreated' | 'lastUpdated'> = {
        fullName: formData.fullName.trim(),
        cprNumber: formData.cprNumber.trim(),
        numberOfVisits: 0,
        medicalHistory: {
          diagnoses: formData.diagnoses ? formData.diagnoses.split(',').map(d => d.trim()).filter(d => d) : [],
          treatments: formData.treatments ? formData.treatments.split(',').map(t => t.trim()).filter(t => t) : [],
          allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()).filter(a => a) : ['None known'],
          notes: formData.notes.trim()
        },
        physicalInfo: {
          height: formData.heightUnit === 'cm' 
            ? { value: parseFloat(formData.height), unit: 'cm' }
            : { 
                value: 0, 
                unit: 'ft/in', 
                feet: parseInt(formData.feet) || 0, 
                inches: parseInt(formData.inches) || 0 
              },
          weight: {
            value: parseFloat(formData.weight),
            unit: formData.weightUnit
          }
        },
        contactInfo: {
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim(),
          address: {
            street: formData.street.trim(),
            city: formData.city.trim(),
            governorate: formData.governorate.trim(),
            postalCode: formData.postalCode.trim()
          }
        },
        doctorId
      };

      patientRecordsStorage.addPatientRecord(newPatient);
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding patient:', error);
      setErrors({ submit: 'Failed to add patient. Please try again.' });
    }
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
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {mode === 'new' && selectedPatient && (
              <button
                onClick={() => {
                  setMode('select');
                  setSelectedPatient(null);
                  setFormData({
                    fullName: '',
                    cprNumber: '',
                    email: '',
                    phoneNumber: '',
                    height: '',
                    heightUnit: 'cm',
                    feet: '',
                    inches: '',
                    weight: '',
                    weightUnit: 'kg',
                    street: '',
                    city: '',
                    governorate: '',
                    postalCode: '',
                    diagnoses: '',
                    treatments: '',
                    allergies: '',
                    notes: ''
                  });
                }}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {mode === 'select' ? 'Add Patient Record' : selectedPatient ? `Add Record for ${selectedPatient.name}` : 'Add New Patient'}
            </h2>
          </div>
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

        {/* Patient Selection Mode */}
        {mode === 'select' && (
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                Select Patient
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                Choose from patients you've previously seen, or create a completely new patient record.
              </p>
              
              {/* Mode Selection */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  onClick={() => setMode('select')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Previous Patients
                </button>
                <button
                  onClick={() => setMode('new')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  New Patient
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {previousPatients.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <svg style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#9ca3af'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search patients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Previous Patients List */}
            {previousPatients.length > 0 ? (
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelection(patient)}
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                            {patient.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                            {patient.email}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            Last appointment: {new Date(patient.appointmentDate).toLocaleDateString()} ({patient.appointmentType})
                          </p>
                        </div>
                        <svg width="20" height="20" fill="none" stroke="#0d9488" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <svg width="48" height="48" fill="#d1d5db" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2M4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v4H4v-4z"/>
                </svg>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  No Previous Patients
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  You haven't completed any appointments yet, or all previous patients already have records.
                </p>
                <button
                  onClick={() => setMode('new')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Create New Patient Record
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {mode === 'new' && (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {errors.submit && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '20px'
            }}>
              {errors.submit}
            </div>
          )}

          {selectedPatient && (
            <div style={{
              padding: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" fill="#2563eb" viewBox="0 0 24 24">
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: '500' }}>
                  Creating record for existing patient: {selectedPatient.name}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#1e40af', margin: '4px 0 0 24px' }}>
                Name and email have been pre-filled. Please complete the remaining required fields.
              </p>
            </div>
          )}

          {/* Personal Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.fullName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  CPR Number *
                </label>
                <input
                  type="text"
                  value={formData.cprNumber}
                  onChange={(e) => handleInputChange('cprNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.cprNumber ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="9-digit CPR number"
                  maxLength={9}
                />
                {errors.cprNumber && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.cprNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Contact Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="patient@email.com"
                />
                {errors.email && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.phoneNumber ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="+973 XXXX XXXX"
                />
                {errors.phoneNumber && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Building, Road, Block"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${errors.city ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Manama"
                />
                {errors.city && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Governorate
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => handleInputChange('governorate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select</option>
                  <option value="Capital">Capital</option>
                  <option value="Muharraq">Muharraq</option>
                  <option value="Northern">Northern</option>
                  <option value="Southern">Southern</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Physical Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Height *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {formData.heightUnit === 'cm' ? (
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: `1px solid ${errors.height ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="170"
                    />
                  ) : (
                    <>
                      <input
                        type="number"
                        value={formData.feet}
                        onChange={(e) => handleInputChange('feet', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                        placeholder="5"
                      />
                      <input
                        type="number"
                        value={formData.inches}
                        onChange={(e) => handleInputChange('inches', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                        placeholder="8"
                      />
                    </>
                  )}
                  <select
                    value={formData.heightUnit}
                    onChange={(e) => handleInputChange('heightUnit', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="cm">cm</option>
                    <option value="ft/in">ft/in</option>
                  </select>
                </div>
                {errors.height && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.height}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Weight *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${errors.weight ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="70"
                  />
                  <select
                    value={formData.weightUnit}
                    onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
                {errors.weight && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
                    {errors.weight}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Medical History (Optional)
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Diagnoses (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.diagnoses}
                  onChange={(e) => handleInputChange('diagnoses', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Hypertension, Diabetes, etc."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Current Treatments (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.treatments}
                  onChange={(e) => handleInputChange('treatments', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Metformin 500mg, Lisinopril 10mg, etc."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Penicillin, Shellfish, None known, etc."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Any additional medical notes or observations..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Add Patient
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AddPatientForm;