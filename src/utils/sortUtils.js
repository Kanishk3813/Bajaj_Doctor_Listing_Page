export const sortDoctors = (doctors, sortBy) => {
    if (!doctors || !sortBy) return doctors;
    
    const sortedDoctors = [...doctors];
    
    if (sortBy === 'fees') {
      return sortedDoctors.sort((a, b) => {
        const aFees = typeof a.fees === 'string' ? parseInt(a.fees.replace(/[^\d]/g, '')) || 0 : a.fees || 0;
        const bFees = typeof b.fees === 'string' ? parseInt(b.fees.replace(/[^\d]/g, '')) || 0 : b.fees || 0;
        return aFees - bFees;
      });
    } else if (sortBy === 'experience') {
      return sortedDoctors.sort((a, b) => {
        const aExp = typeof a.experience === 'string' ? parseInt(a.experience.match(/\d+/) || '0') : a.experience || 0;
        const bExp = typeof b.experience === 'string' ? parseInt(b.experience.match(/\d+/) || '0') : b.experience || 0;
        return bExp - aExp;
      });
    }
    
    return sortedDoctors;
  };