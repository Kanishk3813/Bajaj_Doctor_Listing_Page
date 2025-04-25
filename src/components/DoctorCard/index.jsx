import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();
  
  const yearsExp = doctor.experience ? 
    (typeof doctor.experience === 'string' ? 
      parseInt(doctor.experience.match(/\d+/)?.[0] || '0') : 
      doctor.experience) : 0;
  
  const locationCoords = doctor.clinic?.address?.location?.split(',').map(coord => parseFloat(coord)) || null;
  const hasValidLocation = locationCoords && locationCoords.length === 2 && !isNaN(locationCoords[0]) && !isNaN(locationCoords[1]);
  
  const openMap = (e) => {
    e.preventDefault();
    if (hasValidLocation) {
      setShowMapModal(true);
    } else if (doctor.location) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.location)}`, '_blank');
    }
  };
  
  const openExternalMap = () => {
    if (hasValidLocation) {
      const [longitude, latitude] = locationCoords;
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
      setShowMapModal(false);
    }
  };
  
  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };
  
  return (
    <div 
      data-testid="doctor-card" 
      className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200 h-64"
    >
      <div className="flex items-start h-full flex-col">
        <div className="flex w-full">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={doctor.imageUrl || "/api/placeholder/80/80"} 
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start w-full">
              <h3 data-testid="doctor-name" className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
              <span data-testid="doctor-fee" className="text-lg font-semibold text-blue-600">{doctor.fees || ''}</span>
            </div>
            <p data-testid="doctor-specialty" className="text-sm text-gray-600 font-medium">
              {Array.isArray(doctor.specialties) && doctor.specialties.length > 0 
                ? doctor.specialties.join(', ') 
                : 'General Practitioner'}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{doctor.qualification || 'MBBS'}</p>
              <span className="text-gray-300">•</span>
              <p data-testid="doctor-experience" className="text-sm text-gray-500 font-medium">{yearsExp} yrs exp.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 w-full border-t border-gray-100 pt-3 flex-grow">
          <div className="flex flex-col gap-2">
            {doctor.clinicName && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                {doctor.clinicName}
              </div>
            )}
            
            {doctor.location && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{doctor.location}</span>
                {(doctor.location || hasValidLocation) && (
                  <button 
                    onClick={openMap}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                  >
                    View on Map
                  </button>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-3 mt-1 text-sm">
              {doctor.videoConsult && (
                <span className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Video Consult
                </span>
              )}
              
              {doctor.inClinic && (
                <span className="flex items-center text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  In-Clinic
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-auto w-full">
          <button 
            onClick={handleBookAppointment}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors font-medium"
          >
            Book Appointment
          </button>
        </div>
      </div>
      
      {showMapModal && hasValidLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{doctor.clinicName || doctor.name}</h3>
              <button 
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p>Map Preview</p>
                <p className="text-sm text-gray-500">Location: {locationCoords.join(', ')}</p>
                <button 
                  onClick={openExternalMap}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Open in Google Maps
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-gray-600">
              <p>{doctor.clinic?.address?.address_line1}</p>
              <p>{doctor.location}</p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowMapModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg mr-2"
              >
                Close
              </button>
              <button 
                onClick={openExternalMap}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;