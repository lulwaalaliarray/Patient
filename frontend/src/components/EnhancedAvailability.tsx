import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useToast } from './Toast';
import { availabilityStorage, WeeklyAvailability, TimeSlot as StorageTimeSlot, UnavailableDate } from '../utils/availabilityStorage';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

const EnhancedAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'calendar'>('weekly');
  
  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyAvailability>(availabilityStorage.getDefaultWeeklySchedule());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
  const [selectedUnavailableDates, setSelectedUnavailableDates] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.userType !== 'doctor' && parsedUser.userType !== 'admin') {
          showToast('Access denied. Doctors and admins only.', 'error');
          navigate('/');
          return;
        }
        setUser(parsedUser);
        loadDoctorAvailability(parsedUser.id || parsedUser.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        showToast('Error loading user data', 'error');
      }
    }
    setLoading(false);
  }, [navigate, showToast]);

  const loadDoctorAvailability = (doctorId: string) => {
    const availability = availabilityStorage.getDoctorAvailability(doctorId);
    if (availability) {
      setWeeklySchedule(availability.weeklySchedule);
      setUnavailableDates(availability.unavailableDates);
    }
    
    // Load booked appointments for this doctor
    loadBookedAppointments(doctorId);
  };

  const loadBookedAppointments = (doctorId: string) => {
    try {
      // Import appointmentStorage dynamically to avoid circular dependencies
      const appointmentStorageData = localStorage.getItem('patientcare_appointments');
      if (appointmentStorageData) {
        const appointments = JSON.parse(appointmentStorageData);
        const doctorAppointments = appointments.filter((apt: any) => 
          apt.doctorId === doctorId && 
          (apt.status === 'confirmed' || apt.status === 'pending')
        );
        setBookedAppointments(doctorAppointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateUnavailable = (dateString: string) => {
    return unavailableDates.some(unavailable => unavailable.date === dateString);
  };

  const isDateBooked = (dateString: string) => {
    return bookedAppointments.some(apt => apt.date === dateString);
  };

  const getDateStatus = (dateString: string) => {
    if (isDateUnavailable(dateString)) return 'unavailable';
    if (isDateBooked(dateString)) return 'booked';
    return 'available';
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDateString(date);
    
    // Only allow clicks on current month dates
    if (date.getMonth() !== currentMonth.getMonth()) {
      return;
    }
    
    if (isMultiSelectMode) {
      // Multi-select mode for marking unavailable dates
      if (selectedUnavailableDates.includes(dateString)) {
        setSelectedUnavailableDates(prev => prev.filter(d => d !== dateString));
      } else {
        setSelectedUnavailableDates(prev => [...prev, dateString]);
      }
    } else {
      // Single select mode for viewing date details
      setSelectedDate(dateString);
      // Clear any existing time slots when selecting a new date
      setTimeSlots([]);
    }
  };

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedUnavailableDates([]);
  };

  const markDatesUnavailable = () => {
    if (selectedUnavailableDates.length === 0) {
      showToast('Please select dates to mark as unavailable', 'info');
      return;
    }

    const newUnavailableDates = selectedUnavailableDates.map(date => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      date,
      reason: 'Doctor unavailable',
      type: 'other' as const
    }));

    const updatedUnavailableDates = [...unavailableDates, ...newUnavailableDates];
    setUnavailableDates(updatedUnavailableDates);

    // Save to storage
    if (user) {
      availabilityStorage.saveDoctorAvailability(user.id || user.email, weeklySchedule, updatedUnavailableDates);
    }

    setSelectedUnavailableDates([]);
    setIsMultiSelectMode(false);
    showToast(`Marked ${selectedUnavailableDates.length} date(s) as unavailable`, 'success');
  };

  const markDatesAvailable = () => {
    if (selectedUnavailableDates.length === 0) {
      showToast('Please select dates to mark as available', 'info');
      return;
    }

    const updatedUnavailableDates = unavailableDates.filter(
      unavailable => !selectedUnavailableDates.includes(unavailable.date)
    );
    setUnavailableDates(updatedUnavailableDates);

    // Save to storage
    if (user) {
      availabilityStorage.saveDoctorAvailability(user.id || user.email, weeklySchedule, updatedUnavailableDates);
    }

    setSelectedUnavailableDates([]);
    setIsMultiSelectMode(false);
    showToast(`Marked ${selectedUnavailableDates.length} date(s) as available`, 'success');
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '10:00'
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: 'start' | 'end', value: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  // Day selection functions
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const toggleDaySelection = (dayKey: string) => {
    setSelectedDays(prev => {
      const isCurrentlySelected = prev.includes(dayKey);
      if (isCurrentlySelected) {
        return prev.filter(d => d !== dayKey);
      } else {
        return [...prev, dayKey];
      }
    });
  };

  const toggleDayAvailability = (dayKey: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        available: !prev[dayKey].available
      }
    }));
  };

  const addTimeSlotToDay = (dayKey: string) => {
    const newSlot: StorageTimeSlot = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      start: '09:00',
      end: '10:00'
    };
    
    setWeeklySchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: [...prev[dayKey].timeSlots, newSlot]
      }
    }));
  };

  const removeTimeSlotFromDay = (dayKey: string, slotId: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
  };

  const updateDayTimeSlot = (dayKey: string, slotId: string, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.map(slot => 
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const applyToSelectedDays = () => {
    if (selectedDays.length === 0) {
      showToast('Please select at least one day to apply changes', 'info');
      return;
    }

    const referenceDay = selectedDays[0];
    const referenceSchedule = weeklySchedule[referenceDay];
    const selectedCount = selectedDays.length;

    setWeeklySchedule(prev => {
      const updated = { ...prev };
      selectedDays.forEach(dayKey => {
        updated[dayKey] = {
          available: referenceSchedule.available,
          timeSlots: referenceSchedule.timeSlots.map(slot => ({
            ...slot,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 11)
          }))
        };
      });
      return updated;
    });

    // Use setTimeout to ensure state update completes before clearing selection
    setTimeout(() => {
      setSelectedDays([]);
      showToast(`Schedule applied to ${selectedCount} selected days`, 'success');
    }, 100);
  };

  const handleSave = () => {
    if (!user) return;
    
    const doctorId = user.id || user.email;
    const success = availabilityStorage.saveDoctorAvailability(doctorId, weeklySchedule, unavailableDates);
    
    if (success) {
      showToast('Availability saved successfully!', 'success');
    } else {
      showToast('Failed to save availability', 'error');
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading availability...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Manage Availability
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              Set your schedule and manage your availability for appointments
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{ 
            marginBottom: '32px',
            borderBottom: '2px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', gap: '0' }}>
              {[
                { key: 'weekly', label: 'Weekly Schedule', icon: '📅' },
                { key: 'calendar', label: 'Calendar View', icon: '🗓️' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'weekly' | 'calendar')}
                  style={{
                    padding: '16px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab.key ? '3px solid #0d9488' : '3px solid transparent',
                    color: activeTab === tab.key ? '#0d9488' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: activeTab === tab.key ? '600' : '500',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Schedule Tab */}
          {activeTab === 'weekly' && (
            <div>
              {/* Day Selection Header */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Select Multiple Days {selectedDays.length > 0 && `(${selectedDays.length} selected)`}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  Select multiple days to apply the same schedule, or configure each day individually.
                </p>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => toggleDaySelection(day.key)}
                      type="button"
                      style={{
                        padding: '8px 16px',
                        border: selectedDays.includes(day.key) ? '2px solid #0d9488' : '2px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: selectedDays.includes(day.key) ? '#f0fdfa' : 'white',
                        color: selectedDays.includes(day.key) ? '#0d9488' : '#6b7280',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: selectedDays.includes(day.key) ? '600' : '500',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedDays.includes(day.key)) {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.borderColor = '#0d9488';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedDays.includes(day.key)) {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }
                      }}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>

                {selectedDays.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#0d9488',
                      fontWeight: '500'
                    }}>
                      {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={applyToSelectedDays}
                      type="button"
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#0d9488',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0f766e';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0d9488';
                      }}
                    >
                      Apply Same Schedule
                    </button>
                    <button
                      onClick={() => setSelectedDays([])}
                      type="button"
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              {/* Weekly Schedule Grid */}
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {daysOfWeek.map((day) => {
                  const daySchedule = weeklySchedule[day.key];
                  const isSelected = selectedDays.includes(day.key);
                  
                  return (
                    <div
                      key={day.key}
                      style={{
                        border: isSelected ? '2px solid #0d9488' : '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        backgroundColor: isSelected ? '#f0fdfa' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {day.label}
                        </h4>
                        
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={daySchedule.available}
                            onChange={() => toggleDayAvailability(day.key)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: '#0d9488'
                            }}
                          />
                          <span style={{
                            fontSize: '14px',
                            color: daySchedule.available ? '#059669' : '#6b7280',
                            fontWeight: '500'
                          }}>
                            {daySchedule.available ? 'Available' : 'Unavailable'}
                          </span>
                        </label>
                      </div>

                      {daySchedule.available && (
                        <div>
                          {daySchedule.timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '12px',
                                padding: '12px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px'
                              }}
                            >
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateDayTimeSlot(day.key, slot.id, 'start', e.target.value)}
                                style={{
                                  padding: '8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                              <span style={{ color: '#6b7280', fontSize: '14px' }}>to</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateDayTimeSlot(day.key, slot.id, 'end', e.target.value)}
                                style={{
                                  padding: '8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px'
                                }}
                              />
                              <button
                                onClick={() => removeTimeSlotFromDay(day.key, slot.id)}
                                type="button"
                                style={{
                                  padding: '6px 10px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  outline: 'none',
                                  WebkitTapHighlightColor: 'transparent',
                                  pointerEvents: 'auto'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#fecaca';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#fee2e2';
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => addTimeSlotToDay(day.key)}
                            type="button"
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#0d9488',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              outline: 'none',
                              WebkitTapHighlightColor: 'transparent',
                              pointerEvents: 'auto'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#0f766e';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#0d9488';
                            }}
                          >
                            Add Time Slot
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div>
              {/* Multi-Select Controls */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={toggleMultiSelectMode}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isMultiSelectMode ? '#0d9488' : 'white',
                        color: isMultiSelectMode ? 'white' : '#0d9488',
                        border: '1px solid #0d9488',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        pointerEvents: 'auto',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMultiSelectMode) {
                          e.currentTarget.style.backgroundColor = '#f0fdfa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMultiSelectMode) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      {isMultiSelectMode ? '✓ Multi-Select ON' : 'Enable Multi-Select'}
                    </button>
                    
                    {isMultiSelectMode && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{
                          fontSize: '14px',
                          color: '#0d9488',
                          fontWeight: '500'
                        }}>
                          {selectedUnavailableDates.length} date(s) selected
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Click dates to select/deselect them for batch operations
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {isMultiSelectMode && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          // Select all available dates in current month
                          const currentMonthDates = calendarDays
                            .filter(date => date.getMonth() === currentMonth.getMonth())
                            .map(date => formatDateString(date))
                            .filter(dateString => !isDateBooked(dateString)); // Don't select dates with appointments
                          setSelectedUnavailableDates(currentMonthDates);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4f46e5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6366f1';
                        }}
                      >
                        Select All Available
                      </button>
                      
                      <button
                        onClick={() => setSelectedUnavailableDates([])}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4b5563';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6b7280';
                        }}
                      >
                        Clear Selection
                      </button>
                      
                      {selectedUnavailableDates.length > 0 && (
                        <>
                          <button
                            onClick={markDatesUnavailable}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              pointerEvents: 'auto',
                              outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#b91c1c';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc2626';
                            }}
                          >
                            Mark Unavailable ({selectedUnavailableDates.length})
                          </button>
                          
                          <button
                            onClick={markDatesAvailable}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              pointerEvents: 'auto',
                              outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#15803d';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#16a34a';
                            }}
                          >
                            Mark Available ({selectedUnavailableDates.length})
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Legend */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f0fdfa',
                      border: '1px solid #0d9488',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Available</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#dbeafe',
                      border: '1px solid #2563eb',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Has Appointments</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #dc2626',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Unavailable</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#fbbf24',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Selected</span>
                  </div>
                </div>
              </div>

              {/* Calendar Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                outline: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              ← Previous
            </button>
            
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827'
            }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                outline: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              Next →
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '32px'
          }}>
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}
              >
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              const dateString = formatDateString(date);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDate === dateString;
              const isToday = dateString === formatDateString(new Date());
              const dateStatus = getDateStatus(dateString);
              const isMultiSelected = selectedUnavailableDates.includes(dateString);
              
              // Determine background color based on status
              let backgroundColor = 'white';
              let textColor = isCurrentMonth ? '#111827' : '#9ca3af';
              let borderColor = 'transparent';
              
              if (isSelected) {
                backgroundColor = '#0d9488';
                textColor = 'white';
              } else if (isMultiSelected) {
                backgroundColor = '#fbbf24';
                textColor = 'white';
              } else if (dateStatus === 'unavailable') {
                backgroundColor = '#fee2e2';
                textColor = '#dc2626';
                borderColor = '#fca5a5';
              } else if (dateStatus === 'booked') {
                backgroundColor = '#dbeafe';
                textColor = '#2563eb';
                borderColor = '#93c5fd';
              } else if (isCurrentMonth) {
                backgroundColor = '#f0fdfa';
                textColor = '#0d9488';
              }
              
              if (isToday) {
                borderColor = '#f59e0b';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!isCurrentMonth}
                  style={{
                    padding: '8px',
                    backgroundColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    cursor: isCurrentMonth ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: isToday ? '600' : '400',
                    transition: 'all 0.2s',
                    borderRadius: '6px',
                    position: 'relative',
                    minHeight: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    outline: 'none',
                    opacity: isCurrentMonth ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (isCurrentMonth && !isSelected && !isMultiSelected) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      if (dateStatus === 'available') {
                        e.currentTarget.style.backgroundColor = '#ecfdf5';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCurrentMonth && !isSelected && !isMultiSelected) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.backgroundColor = backgroundColor;
                    }
                  }}
                  title={
                    !isCurrentMonth ? 'Not in current month' :
                    isMultiSelectMode ? 'Click to select/deselect for batch operation' :
                    dateStatus === 'unavailable' ? 'Doctor unavailable - Click to view details' :
                    dateStatus === 'booked' ? 'Has appointments - Click to view details' :
                    'Available for booking - Click to manage time slots'
                  }
                >
                  <span>{date.getDate()}</span>
                  {dateStatus === 'booked' && (
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#2563eb',
                      borderRadius: '50%',
                      marginTop: '2px'
                    }}></div>
                  )}
                  {dateStatus === 'unavailable' && (
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      marginTop: '2px'
                    }}></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Slots Section */}
          {selectedDate && (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Time Slots for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}
                >
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(slot.id, 'start', e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(slot.id, 'end', e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                  <button
                    onClick={() => removeTimeSlot(slot.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                onClick={addTimeSlot}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  pointerEvents: 'auto',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0f766e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d9488';
                }}
              >
                Add Time Slot
              </button>
            </div>
          )}

            </div>
          )}

          {/* Save Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '16px 32px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f766e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0d9488';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>

      <Footer />
      
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

export default EnhancedAvailability;