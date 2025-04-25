import { useEffect, useState } from 'react';

export const useUrlParams = (filters, setFilters) => {
  const [searchParams, setLocalSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );
  
  const setSearchParams = (params) => {
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    setLocalSearchParams(params);
  };
  
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.set('search', filters.searchTerm);
    }
    
    if (filters.consultationType) {
      params.set('consultation', filters.consultationType);
    }
    
    if (filters.specialties && filters.specialties.length > 0) {
      params.set('specialties', filters.specialties.join(','));
    }
    
    if (filters.sortBy) {
      params.set('sort', filters.sortBy);
    }
    
    setSearchParams(params);
  }, [filters]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search') || '';
    const consultation = urlParams.get('consultation') || '';
    const specialties = urlParams.get('specialties') ? 
      urlParams.get('specialties').split(',') : [];
    const sort = urlParams.get('sort') || '';
    
    setFilters(prev => ({
      ...prev,
      searchTerm: search,
      consultationType: consultation,
      specialties,
      sortBy: sort
    }));
    
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      setLocalSearchParams(newParams);
      
      const newSearch = newParams.get('search') || '';
      const newConsultation = newParams.get('consultation') || '';
      const newSpecialties = newParams.get('specialties') ? 
        newParams.get('specialties').split(',') : [];
      const newSort = newParams.get('sort') || '';
      
      setFilters(prev => ({
        ...prev,
        searchTerm: newSearch,
        consultationType: newConsultation,
        specialties: newSpecialties,
        sortBy: newSort
      }));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setFilters]);
};