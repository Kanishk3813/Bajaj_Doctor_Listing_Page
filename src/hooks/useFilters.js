import { useState, useEffect } from 'react';
import { filterDoctors } from '../utils/filterUtils';
import { sortDoctors } from '../utils/sortUtils';
import { useUrlParams } from './useUrlParams';

export const useFilters = (allDoctors) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    consultationType: '',
    specialties: [],
    sortBy: ''
  });
  
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  useEffect(() => {
    if (!allDoctors) return;
    
    let result = filterDoctors(allDoctors, filters);
    result = sortDoctors(result, filters.sortBy);
    
    setFilteredDoctors(result);
  }, [allDoctors, filters]);
  
  useUrlParams(filters, setFilters);
  
  return {
    filters,
    setFilters,
    filteredDoctors
  };
};