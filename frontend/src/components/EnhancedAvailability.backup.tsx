import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import { useToast } from './Toast';
import { userStorage } from '../utils/userStorage';
import { appointmentStorage } from '../utils/appointmentStorage';

import {
  TimeSlot,
  WeeklyAvailability,
  UnavailableDate,
  availabilityStorage
} from '../utils/availabilityStorage';

interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
  isUnavailable: boolean;
  unavailableReason?: string;
}

interface RecurringSchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  timeSlots: TimeSlot[];
  enabled: boolean;
}

const EnhancedAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // View modes
  const [viewMode, setViewMode] = useState<'calendar' | 'weekly' | 'settings'>('calendar');

  // Weekly recurring schedule (standard schedule)
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule[]>([
    { dayOfWeek: 0, timeSlots: [], enabled: false }, // Sunday
    { dayOfWeek: 1, timeSlots: [{ id: '1', start: '09:00', end: '17:00' }], enabled: true }, // Monday
    { dayOfWeek: 2, timeSlots: [{ id: '2', start: '09:00', end: '17:00' }], enabled: true }, // Tuesday
    { dayOfWeek: 3, timeSlots: [{ id: '3', start: '09:00', end: '17:00' }], enabled: true }, // Wednesday
    { dayOfWeek: 4, timeSlots: [{ id: '4', start: '09:00', end: '17:00' }], enabled: true }, // Thursday
    { dayOfWeek: 5, timeSlots: [{ id: '5', start: '09:00', end: '17:00' }], enabled: true }, // Friday
    { dayOfWeek: 6, timeSlots: [], enabled: false }, // Saturday
  ]);

  // Specific date overrides
  const [dateOverrides, setDateOverrides] = useState<Map<string, DaySchedule>>(new Map());

  // Unavailable dates (vacations, conferences, etc.)
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isSelectingDates, setIsSelectingDates] = useState(false);
  const [newUnavailableReason, setNewUnavailableReason] = useState('');
  const [newUnavailableType, setNewUnavailableType] = useState<'vacation' | 'sick' | 'conference' | 'other'>('vacation');

  // Time slot editing
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editingTimeSlots, setEditingTimeSlots] = useState<TimeSlot[]>([]);

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalAvailableHours: 0,
    upcomingAppointments: 0,
    unavailableDays: 0,
    bookedAppointments: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        // Check user type (ProtectedRoute already handles authentication)
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
    } else {
      showToast('User data not found', 'error');
      navigate('/login');
    }
    setLoading(false);
  }, [navigate, showToast]);

  const loadDoctorAvailability = (doctorId: string) => {
    // Load existing availability from storage
    const existingAvailability = availabilityStorage.getDoctorAvailability(doctorId);
    if (existingAvailability) {
      // Convert old format to new format if needed
      const convertedRecurring = Object.entries(existingAvailability.weeklySchedule).map(([day, schedule], index) => ({
        dayOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day),
        timeSlots: schedule.timeSlots || [],
        enabled: schedule.available
      }));
      setRecurringSchedule(convertedRecurring);
      setUnavailableDates(existingAvailability.unavailableDates);
    }
    calculateStats(doctorId);
  };

  const calculateStats = (doctorId: string) => {
    if (!doctorId) return;

    // Calculate total available hours per week
    const totalHours = recurringSchedule.reduce((total, day) => {
      if (!day.enabled) return total;
      return total + day.timeSlots.reduce((dayTotal, slot) => {
        const start = availabilityStorage.timeToMinutes(slot.start);
        const end = availabilityStorage.timeToMinutes(slot.end);
        return dayTotal + (end - start) / 60;
      }, 0);
    }, 0);

    // Get upcoming appointments
    const upcoming = appointmentStorage.getUpcomingAppointments(doctorId);
    const booked = appointmentStorage.getDoctorAppointments(doctorId).filter(apt =>
      apt.status === 'confirmed' || apt.status === 'pending'
    );

    setStats({
      totalAvailableHours: totalHours,
      upcomingAppointments: upcoming.length,
      unavailableDays: unavailableDates.length,
      bookedAppointments: booked.length
    });
  };

  // Recalculate stats when data changes
  useEffect(() => {
    if (user) {
      calculateStats(user.id || user.email);
    }
  }, [recurringSchedule, unavailableDates, user]);

  // Calendar helper functions
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

  const getDaySchedule = (date: Date): DaySchedule => {
    const dateString = formatDateString(date);
    const dayOfWeek = date.getDay();

    // Check if date is marked as unavailable
    const unavailable = unavailableDates.find(ud => ud.date === dateString);
    if (unavailable) {
      return {
        date: dateString,
        timeSlots: [],
        isUnavailable: true,
        unavailableReason: unavailable.reason
      };
    }

    // Check for specific date override
    const override = dateOverrides.get(dateString);
    if (override) {
      return override;
    }

    // Use recurring schedule
    const recurringDay = recurringSchedule.find(rs => rs.dayOfWeek === dayOfWeek);
    return {
      date: dateString,
      timeSlots: recurringDay?.enabled ? recurringDay.timeSlots : [],
      isUnavailable: false
    };
  };

  const isDateAvailable = (date: Date): boolean => {
    const schedule = getDaySchedule(date);
    return !schedule.isUnavailable && schedule.timeSlots.length > 0;
  };

  const getBookedAppointments = (date: Date) => {
    if (!user) return [];
    const dateString = formatDateString(date);
    return appointmentStorage.getDoctorAppointmentsByDateAndStatus(
      user.id || user.email,
      dateString
    ).filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
  };

  // Event handlers
  const handleDateClick = (date: Date) => {
    const dateString = formatDateString(date);

    if (isSelectingDates) {
      // Multi-select mode for marking unavailable
      if (selectedDates.includes(dateString)) {
        setSelectedDates(selectedDates.filter(d => d !== dateString));
      } else {
        setSelectedDates([...selectedDates, dateString]);
      }
    } else {
      // Single select mode for editing specific date
      setSelectedDate(dateString);
      const schedule = getDaySchedule(date);
      setEditingTimeSlots([...schedule.timeSlots]);
      setShowTimeSlotModal(true);
    }
  };

  const handleRecurringScheduleChange = (dayOfWeek: number, enabled: boolean) => {
    setRecurringSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, enabled }
          : day
      )
    );
  };

  const handleRecurringTimeSlotChange = (dayOfWeek: number, timeSlots: TimeSlot[]) => {
    setRecurringSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, timeSlots }
          : day
      )
    );
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '17:00'
    };
    setEditingTimeSlots(prev => [...prev, newSlot]);
  };

  const updateTimeSlot = (id: string, field: 'start' | 'end', value: string) => {
    setEditingTimeSlots(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const removeTimeSlot = (id: string) => {
    setEditingTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const saveTimeSlots = () => {
    if (!selectedDate) return;

    const newOverride: DaySchedule = {
      date: selectedDate,
      timeSlots: editingTimeSlots,
      isUnavailable: false
    };

    setDateOverrides(prev => new Map(prev.set(selectedDate, newOverride)));
    setShowTimeSlotModal(false);
    setSelectedDate(null);
    setEditingTimeSlots([]);
    showToast('Time slots updated successfully', 'success');
  };



  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = formatDateString(date);
    return unavailableDates.some(ud => ud.date === dateString);
  };

  const isDateSelected = (date: Date) => {
    const dateString = formatDateString(date);
    return selectedDates.includes(dateString);
  };

  const handleDateClick = (date: Date) => {
    if (!isSelectingDates) return;

    const dateString = formatDateString(date);
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter(d => d !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString]);
    }
  };

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      start: '09:00',
      end: '10:00',
      id: Date.now().toString()
    };

    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, newSlot]
      }
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
  };

  const updateTimeSlot = (day: string, slotId: string, field: 'start' | 'end', value: string) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const toggleDayAvailability = (day: string) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        timeSlots: !prev[day].available ? [{ start: '08:00', end: '17:00', id: Date.now().toString() }] : []
      }
    }));
  };

  const addUnavailableDates = () => {
    if (selectedDates.length === 0 || !newUnavailableReason.trim()) {
      showToast('Please select dates and provide a reason', 'error');
      return;
    }

    const newUnavailable = selectedDates.map(date => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date,
      reason: newUnavailableReason,
      type: newUnavailableType
    }));

    setUnavailableDates(prev => [...prev, ...newUnavailable]);
    setSelectedDates([]);
    setNewUnavailableReason('');
    setIsSelectingDates(false);
    showToast(`Added ${selectedDates.length} unavailable date${selectedDates.length > 1 ? 's' : ''}`, 'success');
  };

  const removeUnavailableDate = (dateId: string) => {
    setUnavailableDates(prev => prev.filter(ud => ud.id !== dateId));
    showToast('Removed unavailable date', 'success');
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Convert new format back to old format for storage
      const weeklyAvailability: WeeklyAvailability = {
        sunday: { available: recurringSchedule[0].enabled, timeSlots: recurringSchedule[0].timeSlots },
        monday: { available: recurringSchedule[1].enabled, timeSlots: recurringSchedule[1].timeSlots },
        tuesday: { available: recurringSchedule[2].enabled, timeSlots: recurringSchedule[2].timeSlots },
        wednesday: { available: recurringSchedule[3].enabled, timeSlots: recurringSchedule[3].timeSlots },
        thursday: { available: recurringSchedule[4].enabled, timeSlots: recurringSchedule[4].timeSlots },
        friday: { available: recurringSchedule[5].enabled, timeSlots: recurringSchedule[5].timeSlots },
        saturday: { available: recurringSchedule[6].enabled, timeSlots: recurringSchedule[6].timeSlots },
      };

      // Save to the availability storage system
      const success = availabilityStorage.saveDoctorAvailability(
        user.id || user.email,
        weeklyAvailability,
        unavailableDates
      );

      if (success) {
        // Also update user data for backward compatibility
        const allUsers = userStorage.getAllUsers();
        const userIndex = allUsers.findIndex(u => u.email === user.email);

        if (userIndex !== -1) {
          allUsers[userIndex] = {
            ...allUsers[userIndex],
            enhancedAvailability: weeklyAvailability,
            unavailableDates: unavailableDates
          } as any;

          localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
          localStorage.setItem('userData', JSON.stringify(allUsers[userIndex]));
        }

        showToast('Availability updated successfully! Changes will be reflected in patient booking immediately.', 'success');
        calculateStats(user.id || user.email);
      } else {
        showToast('Error updating availability', 'error');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      showToast('Error saving availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCalendar = () => {
    if (!user) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // Export 6 months ahead

    const icsContent = availabilityStorage.exportToCalendar(
      user.id || user.email,
      startDate,
      endDate
    );

    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctor-availability-${user.name.replace(/\s+/g, '-').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Calendar exported successfully!', 'success');
    setShowExportModal(false);
  };

  const handleQuickSetup = (preset: 'weekdays' | 'weekends' | 'full-time' | 'part-time') => {
    let newSchedule: WeeklyAvailability;

    switch (preset) {
      case 'weekdays':
        newSchedule = {
          sunday: { available: false, timeSlots: [] },
          monday: { available: true, timeSlots: [{ start: '08:00', end: '17:00', id: Date.now().toString() }] },
          tuesday: { available: true, timeSlots: [{ start: '08:00', end: '17:00', id: (Date.now() + 1).toString() }] },
          wednesday: { available: true, timeSlots: [{ start: '08:00', end: '17:00', id: (Date.now() + 2).toString() }] },
          thursday: { available: true, timeSlots: [{ start: '08:00', end: '17:00', id: (Date.now() + 3).toString() }] },
          friday: { available: true, timeSlots: [{ start: '08:00', end: '17:00', id: (Date.now() + 4).toString() }] },
          saturday: { available: false, timeSlots: [] }
        };
        break;
      case 'weekends':
        newSchedule = {
          sunday: { available: true, timeSlots: [{ start: '09:00', end: '15:00', id: Date.now().toString() }] },
          monday: { available: false, timeSlots: [] },
          tuesday: { available: false, timeSlots: [] },
          wednesday: { available: false, timeSlots: [] },
          thursday: { available: false, timeSlots: [] },
          friday: { available: false, timeSlots: [] },
          saturday: { available: true, timeSlots: [{ start: '09:00', end: '15:00', id: (Date.now() + 1).toString() }] }
        };
        break;
      case 'full-time':
        newSchedule = {
          sunday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: Date.now().toString() }] },
          monday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 1).toString() }] },
          tuesday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 2).toString() }] },
          wednesday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 3).toString() }] },
          thursday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 4).toString() }] },
          friday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 5).toString() }] },
          saturday: { available: true, timeSlots: [{ start: '08:00', end: '20:00', id: (Date.now() + 6).toString() }] }
        };
        break;
      case 'part-time':
        newSchedule = {
          sunday: { available: false, timeSlots: [] },
          monday: { available: true, timeSlots: [{ start: '14:00', end: '18:00', id: Date.now().toString() }] },
          tuesday: { available: false, timeSlots: [] },
          wednesday: { available: true, timeSlots: [{ start: '14:00', end: '18:00', id: (Date.now() + 1).toString() }] },
          thursday: { available: false, timeSlots: [] },
          friday: { available: true, timeSlots: [{ start: '14:00', end: '18:00', id: (Date.now() + 2).toString() }] },
          saturday: { available: false, timeSlots: [] }
        };
        break;
      default:
        return;
    }

    setWeeklyAvailability(newSchedule);
    showToast(`Applied ${preset.replace('-', ' ')} schedule preset`, 'success');
  };

  const getUnavailableTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'sick': return { bg: '#fee2e2', color: '#dc2626' };
      case 'conference': return { bg: '#f3e8ff', color: '#7c3aed' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ fontSize: '18px', color: '#dc2626' }}>Error: User not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Doctor Availability Management
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0
              }}>
                Manage your schedule, set recurring availability, and block time off
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowExportModal(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6366f1';
                }}
              >
                📅 Export Calendar
              </button>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {[
              { key: 'calendar', label: '📅 Calendar View', desc: 'Manage specific dates' },
              { key: 'weekly', label: '📋 Weekly Schedule', desc: 'Set recurring schedule' },
              { key: 'settings', label: '⚙️ Settings', desc: 'Quick presets & export' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setViewMode(tab.key as any)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: viewMode === tab.key ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: viewMode === tab.key ? '#0d9488' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  boxShadow: viewMode === tab.key ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div>{tab.label}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* Statistics Dashboard */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#ecfdf5',
              borderRadius: '12px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#065f46' }}>
                {stats.totalAvailableHours}h
              </div>
              <div style={{ fontSize: '14px', color: '#047857' }}>
                Weekly Available Hours
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
                {stats.upcomingAppointments}
              </div>
              <div style={{ fontSize: '14px', color: '#1d4ed8' }}>
                Upcoming Appointments
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e' }}>
                {stats.unavailableDays}
              </div>
              <div style={{ fontSize: '14px', color: '#b45309' }}>
                Unavailable Days
              </div>
            </div>
          </div>

          {/* Quick Setup Presets */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px'
            }}>
              Quick Setup Presets
            </h3>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'weekdays', label: '📅 Weekdays Only', desc: 'Mon-Fri 8AM-5PM' },
                { key: 'weekends', label: '🏖️ Weekends Only', desc: 'Sat-Sun 9AM-3PM' },
                { key: 'full-time', label: '⏰ Full Time', desc: 'All days 8AM-8PM' },
                { key: 'part-time', label: '⏳ Part Time', desc: 'Mon/Wed/Fri 2PM-6PM' }
              ].map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handleQuickSetup(preset.key as any)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#0d9488';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  title={preset.desc}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr', gap: '32px' }}>
          {/* Weekly Schedule */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px'
            }}>
              Weekly Schedule
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(weeklyAvailability).map(([day, schedule]) => (
                <div key={day} style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: schedule.available ? '16px' : '0'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={() => toggleDayAvailability(day)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#0d9488'
                        }}
                      />
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'capitalize'
                      }}>
                        {day}
                      </span>
                    </label>

                    {schedule.available && (
                      <button
                        onClick={() => addTimeSlot(day)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#0d9488',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
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
                        + Add Time Slot
                      </button>
                    )}
                  </div>

                  {schedule.available && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {schedule.timeSlots.map((slot) => (
                        <div key={slot.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <label style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              From:
                            </label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)}
                              style={{
                                padding: '6px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <label style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              To:
                            </label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)}
                              style={{
                                padding: '6px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            />
                          </div>

                          <button
                            onClick={() => removeTimeSlot(day, slot.id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #dc2626',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              marginLeft: 'auto'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {schedule.timeSlots.length === 0 && (
                        <p style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          margin: 0
                        }}>
                          No time slots added. Click "Add Time Slot" to get started.
                        </p>
                      )}
                    </div>
                  )}

                  {!schedule.available && (
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      fontStyle: 'italic'
                    }}>
                      Not available
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar and Unavailable Dates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Calendar */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Unavailable Dates
                </h3>
                <button
                  onClick={() => setIsSelectingDates(!isSelectingDates)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: isSelectingDates ? '#dc2626' : '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {isSelectingDates ? 'Cancel' : 'Select Dates'}
                </button>
              </div>

              {/* Calendar Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ←
                </button>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  →
                </button>
              </div>

              {/* Calendar Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                marginBottom: '16px'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    {day}
                  </div>
                ))}

                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isUnavailable = isDateUnavailable(date);
                  const isSelected = isDateSelected(date);
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      disabled={!isSelectingDates || isPast}
                      style={{
                        padding: '8px 4px',
                        textAlign: 'center',
                        fontSize: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isSelectingDates && !isPast ? 'pointer' : 'default',
                        backgroundColor:
                          isSelected ? '#0d9488' :
                            isUnavailable ? '#fee2e2' :
                              isToday ? '#f0fdfa' :
                                'transparent',
                        color:
                          isSelected ? 'white' :
                            isUnavailable ? '#dc2626' :
                              isToday ? '#0d9488' :
                                isCurrentMonth ? '#111827' : '#9ca3af',
                        opacity: isPast ? 0.5 : 1
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Add Unavailable Dates Form */}
              {isSelectingDates && selectedDates.length > 0 && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Type
                    </label>
                    <select
                      value={newUnavailableType}
                      onChange={(e) => setNewUnavailableType(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="vacation">Vacation</option>
                      <option value="sick">Sick Leave</option>
                      <option value="conference">Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Reason
                    </label>
                    <input
                      type="text"
                      value={newUnavailableReason}
                      onChange={(e) => setNewUnavailableReason(e.target.value)}
                      placeholder="Enter reason..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <button
                    onClick={addUnavailableDates}
                    style={{
                      width: '100%',
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
                    Add {selectedDates.length} Date{selectedDates.length > 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </div>

            {/* Unavailable Dates List */}
            {unavailableDates.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Scheduled Unavailable Dates
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {unavailableDates
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((unavailable, index) => {
                      const typeStyle = getUnavailableTypeColor(unavailable.type);
                      return (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              {new Date(unavailable.date).toLocaleDateString()}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              {unavailable.reason}
                            </div>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500',
                              textTransform: 'capitalize',
                              backgroundColor: typeStyle.bg,
                              color: typeStyle.color,
                              marginTop: '4px'
                            }}>
                              {unavailable.type}
                            </span>
                          </div>
                          <button
                            onClick={() => removeUnavailableDate(unavailable.id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #dc2626',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '12px 32px',
              backgroundColor: saving ? '#9ca3af' : '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#0f766e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#0d9488';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {saving && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {saving ? 'Saving...' : 'Save & Update Availability'}
          </button>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '12px',
            margin: '12px 0 0 0'
          }}>
            {saving
              ? 'Updating your availability...'
              : 'Your availability and unavailable dates will be reflected in patient booking immediately'
            }
          </p>
        </div>
      </div>

      <Footer />
      <BackToTopButton />

      {/* Export Calendar Modal */}
      {showExportModal && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Export Calendar
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Export your availability schedule to sync with external calendar applications.
              </p>

              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdfa',
                borderRadius: '8px',
                border: '1px solid #5eead4',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0d9488',
                  margin: '0 0 8px 0'
                }}>
                  What will be exported:
                </h4>
                <ul style={{
                  fontSize: '14px',
                  color: '#047857',
                  margin: 0,
                  paddingLeft: '20px'
                }}>
                  <li>Vacation and time-off dates</li>
                  <li>Conference and meeting blocks</li>
                  <li>Sick leave periods</li>
                  <li>Other unavailable dates</li>
                </ul>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#92400e',
                  margin: 0
                }}>
                  📝 <strong>Note:</strong> This exports the next 6 months of unavailable dates.
                  Weekly recurring availability is not included in the export.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExportCalendar}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📅 Export ICS File
              </button>
            </div>
          </div>
        </div>
      )}

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