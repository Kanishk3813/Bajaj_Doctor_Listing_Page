export const filterDoctors = (doctors, filters) => {
    if (!doctors || !Array.isArray(doctors)) return [];
    
    let filteredDoctors = [...doctors];
    
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTermLower)
      );
    }
  
    if (filters.consultationType) {
      filteredDoctors = filteredDoctors.filter(doctor => {
        if (filters.consultationType === 'videoConsult') {
          return doctor.videoConsult === true || doctor.video_consult === true;
        } else if (filters.consultationType === 'inClinic') {
          return doctor.inClinic === true || doctor.in_clinic === true;
        }
        return true;
      });
    }
    
    if (filters.specialties && filters.specialties.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => {
        if (doctor.specialities && Array.isArray(doctor.specialities)) {
          const doctorSpecialtyNames = doctor.specialities.map(s => s.name.toLowerCase());
          return filters.specialties.some(specialty => 
            doctorSpecialtyNames.includes(specialty.toLowerCase())
          );
        }
        else if (doctor.specialties && Array.isArray(doctor.specialties)) {
          return filters.specialties.some(specialty => 
            doctor.specialties.map(s => s.toLowerCase()).includes(specialty.toLowerCase())
          );
        }
        return false;
      });
    }
    
    return filteredDoctors;
  };