// src/components/FilterPanel/index.jsx
import { useState } from 'react';
import FilterSection from './FilterSection';

const FilterPanel = ({ filters, setFilters, specialtiesList }) => {
  const [openSections, setOpenSections] = useState({
    speciality: true,
    moc: true,
    sort: true
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleConsultationChange = (type) => {
    setFilters(prev => ({
      ...prev,
      consultationType: prev.consultationType === type ? '' : type
    }));
  };
  
  const handleSpecialtyChange = (specialty) => {
    setFilters(prev => {
      if (prev.specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: prev.specialties.filter(s => s !== specialty)
        };
      } else {
        return {
          ...prev,
          specialties: [...prev.specialties, specialty]
        };
      }
    });
  };
  
  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy: prev.sortBy === sortBy ? '' : sortBy
    }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      searchTerm: filters.searchTerm, 
      consultationType: '',
      specialties: [],
      sortBy: ''
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        {(filters.consultationType || filters.specialties.length > 0 || filters.sortBy) && (
          <button 
            onClick={clearAllFilters}
            className="text-blue-500 text-sm hover:text-blue-700"
            id="clear-all"
          >
            Clear All
          </button>
        )}
      </div>
      
      <FilterSection 
        title="Speciality" 
        isOpen={openSections.speciality}
        toggleOpen={() => toggleSection('speciality')}
        testId="filter-header-speciality"
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {specialtiesList.map((specialty) => (
            <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid={`filter-specialty-${specialty.replace('/', '-')}`}
                checked={filters.specialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                className="form-checkbox text-blue-500"
              />
              <span className="text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      
      <FilterSection 
        title="Consultation Mode" 
        isOpen={openSections.moc}
        toggleOpen={() => toggleSection('moc')}
        testId="filter-header-moc"
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-video-consult"
              checked={filters.consultationType === 'videoConsult'}
              onChange={() => handleConsultationChange('videoConsult')}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-700">Video Consult</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              checked={filters.consultationType === 'inClinic'}
              onChange={() => handleConsultationChange('inClinic')}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-700">In Clinic</span>
          </label>
        </div>
      </FilterSection>
      
      <FilterSection 
        title="Sort" 
        isOpen={openSections.sort}
        toggleOpen={() => toggleSection('sort')}
        testId="filter-header-sort"
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-fees"
              checked={filters.sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-700">Fees: Low to High</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-experience"
              checked={filters.sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              className="form-radio text-blue-500"
            />
            <span className="text-gray-700">Experience: Most Experience first</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;