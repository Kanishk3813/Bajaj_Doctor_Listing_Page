import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, isSameDay } from 'date-fns';
import { fetchDoctors } from '../api';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    isNewPatient: 'yes',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const doctors = await fetchDoctors();
        const foundDoctor = doctors.find(doc => doc.id === doctorId);
        
        if (!foundDoctor) {
          throw new Error('Doctor not found');
        }
        
        setDoctor(foundDoctor);
        
        if (foundDoctor.videoConsult) {
          setConsultationType('videoConsult');
        } else if (foundDoctor.inClinic) {
          setConsultationType('inClinic');
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctor();
  }, [doctorId]);

  const generateTimeSlots = () => {
    const slots = [];
    const currentDate = new Date();
    const isToday = isSameDay(selectedDate, currentDate);

    let startHour = 9;
    
    if (isToday) {
      startHour = Math.max(startHour, currentDate.getHours() + 1);
    }
    
    for (let hour = startHour; hour <= 17; hour++) {
      const isPast = isToday && hour <= currentDate.getHours();
      
      for (const minutes of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const isAvailable = !isPast && Math.random() > 0.3; 
        
        slots.push({
          time: timeString,
          available: isAvailable
        });
      }
    }
    
    return slots;
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for visit is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime || !consultationType) {
        alert('Please select a date, time and consultation type');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (validateForm()) {
        setStep(3);
      }
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reference = `APT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setBookingReference(reference);
      setBookingComplete(true);
      
      console.log('Appointment booked:', {
        doctor,
        patientDetails: formData,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        consultationType,
        reference
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('There was an error booking your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateOptions = [];
  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    dateOptions.push(date);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="ml-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Doctor Not Found</h2>
          <p className="text-red-600 mb-4">We couldn't find the doctor you're looking for.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Back to Doctor Listing
          </button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-500 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Appointment Confirmed!</h2>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600">Thank you for booking your appointment with</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{doctor.name}</p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg inline-block">
                <p className="text-blue-800 font-semibold">Booking Reference: {bookingReference}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Consultation Type</p>
                  <p className="font-medium">{consultationType === 'videoConsult' ? 'Video Consultation' : 'In-Clinic Visit'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-medium">{doctor.location || 'Online'}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
                {consultationType === 'videoConsult' ? (
                  <p className="text-sm text-gray-700">
                    You will receive an email with instructions on how to join the video consultation.
                    Please ensure you have a stable internet connection and a device with a camera and microphone.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    Please arrive 15 minutes before your appointment time.
                    Don't forget to bring your ID and insurance card if applicable.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => navigate('/')}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50"
              >
                Back to Doctor Listing
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Doctor Listing
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">Book an Appointment</h1>
          </div>
          
          <div className="p-6">
            <div className="flex items-start mb-6">
              <div className="mr-4">
                <img 
                  src={doctor.imageUrl || "/api/placeholder/80/80"} 
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialties ? doctor.specialties.join(', ') : 'General Practitioner'}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">{doctor.qualification || 'MBBS'}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{doctor.experience || '5 yrs exp.'}</span>
                </div>
                {doctor.clinicName && (
                  <p className="text-sm text-gray-600 mt-1">{doctor.clinicName}</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-6 pt-6">
              <div className="flex mb-6">
                <div className="w-1/3">
                  <div className={`flex items-center ${step === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${step === 1 ? 'bg-blue-100 text-blue-600' : step > 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
                      {step > 1 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <span>1</span>
                      )}
                    </div>
                    <span className="font-medium">Select Date & Time</span>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${step === 2 ? 'bg-blue-100 text-blue-600' : step > 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
                      {step > 2 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <span>2</span>
                      )}
                    </div>
                    <span className="font-medium">Patient Details</span>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className={`flex items-center ${step === 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${step === 3 ? 'bg-blue-100 text-blue-600' : step > 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
                      <span>3</span>
                    </div>
                    <span className="font-medium">Confirm</span>
                  </div>
                </div>
              </div>
              
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Appointment Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {doctor.videoConsult && (
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${consultationType === 'videoConsult' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        onClick={() => setConsultationType('videoConsult')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${consultationType === 'videoConsult' ? 'border-blue-500' : 'border-gray-300'}`}>
                            {consultationType === 'videoConsult' && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span className="font-medium">Video Consultation</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-7">Consult with doctor via video call</p>
                      </div>
                    )}
                    
                    {doctor.inClinic && (
                      <div 
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${consultationType === 'inClinic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        onClick={() => setConsultationType('inClinic')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${consultationType === 'inClinic' ? 'border-blue-500' : 'border-gray-300'}`}>
                            {consultationType === 'inClinic' && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <span className="font-medium">In-Clinic Visit</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-7">Visit doctor at the clinic</p>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                  <div className="flex overflow-x-auto pb-4 mb-6 -mx-2">
                    {dateOptions.map((date, index) => {
                      const formattedDate = format(date, 'EEE, MMM d');
                      const isSelected = isSameDay(date, selectedDate);
                      
                      return (
                        <div key={index} className="px-2">
                          <button 
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`w-36 py-3 px-4 text-center rounded-lg transition-colors ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="text-sm">{format(date, 'EEEE')}</div>
                            <div className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                              {format(date, 'MMM d')}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Select Time</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                    {generateTimeSlots().map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-2 px-3 rounded-lg text-center transition-colors ${
                          selectedTime === slot.time ? 'bg-blue-600 text-white' : 
                          slot.available ? 'bg-white border border-gray-200 hover:border-blue-300' : 
                          'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.reason ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                      ></textarea>
                      {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Are you a new patient?</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isNewPatient"
                            value="yes"
                            checked={formData.isNewPatient === 'yes'}
                            onChange={handleInputChange}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isNewPatient"
                            value="no"
                            checked={formData.isNewPatient === 'no'}
                            onChange={handleInputChange}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className={`form-checkbox mt-1 ${errors.agreeToTerms ? 'text-red-500' : 'text-blue-600'}`}
                        />
                        <span className="ml-2 text-gray-700 text-sm">
                          I agree to the terms and conditions and give consent to share my health information 
                          with the doctor for the purpose of this consultation.
                        </span>
                      </label>
                      {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}
                    </div>
                  </form>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Confirm Your Appointment</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium">{doctor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Consultation Type</p>
                        <p className="font-medium">{consultationType === 'videoConsult' ? 'Video Consultation' : 'In-Clinic Visit'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 my-6 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">New Patient</p>
                        <p className="font-medium">{formData.isNewPatient === 'yes' ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 my-6 pt-6">
                    <h3 className="text-lg font-semibold mb-2">Reason for Visit</h3>
                    <p className="text-gray-700">{formData.reason}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-800">Important Information</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          By confirming this appointment, you agree to the cancellation policy and 
                          {consultationType === 'videoConsult' ? ' understand that you will need a stable internet connection for the video consultation.' : ' understand that you should arrive 15 minutes before your appointment time.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between border-t border-gray-200 pt-6">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={handlePreviousStep}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    type="submit"
                    onClick={handleSubmit}
                    className="ml-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : 'Confirm Appointment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;