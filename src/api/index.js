export const fetchDoctors = async () => {
    try {
      const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      return Array.isArray(data) ? data.map(doctor => ({
        id: doctor.id || `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: doctor.name || '',
        specialties: doctor.specialities ? doctor.specialities.map(s => s.name) : [],
        specialities: doctor.specialities || [],
        experience: doctor.experience || '',
        experienceYears: doctor.experience ? parseInt(doctor.experience.match(/\d+/) || '0') : 0,
        fees: doctor.fees || '',
        feesValue: doctor.fees ? parseInt(doctor.fees.replace(/[^\d]/g, '')) || 0 : 0,
        videoConsult: doctor.video_consult || false,
        inClinic: doctor.in_clinic || false,
        imageUrl: doctor.photo || null,
        qualification: doctor.qualification || doctor.clinic?.qualification || '',
        clinicName: doctor.clinic?.name || '',
        location: doctor.clinic?.address?.locality || ''
      })) : [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error; 
    }
  };