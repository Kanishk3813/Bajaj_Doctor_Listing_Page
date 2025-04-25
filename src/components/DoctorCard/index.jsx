// src/components/DoctorCard/index.jsx
const DoctorCard = ({ doctor }) => {
    const yearsExp = doctor.experience ? 
      (typeof doctor.experience === 'string' ? 
        parseInt(doctor.experience.match(/\d+/)?.[0] || '0') : 
        doctor.experience) : 0;
    
    return (
      <div 
        data-testid="doctor-card" 
        className="bg-white p-4 rounded-lg shadow-sm mb-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={doctor.imageUrl || "/api/placeholder/80/80"} 
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <h3 data-testid="doctor-name" className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
            <p data-testid="doctor-specialty" className="text-sm text-gray-600">{Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : doctor.specialties}</p>
            <p className="text-sm text-gray-500">{doctor.qualification || 'MBBS'}</p>
            <p data-testid="doctor-experience" className="text-sm text-gray-500">{yearsExp} yrs exp.</p>
          </div>
          
          <div className="flex flex-col items-end">
            <span data-testid="doctor-fee" className="text-lg font-semibold">{doctor.fees ? `₹ ${doctor.fees}` : ''}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            {doctor.clinicName && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                {doctor.clinicName}
              </div>
            )}
            
            {doctor.location && (
              <div className="flex items-center text-xs text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {doctor.location}
              </div>
            )}
          </div>
          
          <button className="mt-3 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
            Book Appointment
          </button>
        </div>
      </div>
    );
  };
  
  export default DoctorCard;