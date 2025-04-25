import { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterPanel = ({ filters, setFilters, specialtiesList }) => {
  const [openSections, setOpenSections] = useState({
    speciality: true,
    moc: true,
    sort: true
  });
  
  const [specialtySearch, setSpecialtySearch] = useState('');
  
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
  
  const filteredSpecialties = specialtiesList.filter(specialty => 
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );
  
  const activeFilterCount = 
    (filters.consultationType ? 1 : 0) + 
    filters.specialties.length + 
    (filters.sortBy ? 1 : 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center p-5 border-b">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {(filters.consultationType || filters.specialties.length > 0 || filters.sortBy) && (
          <button 
            onClick={clearAllFilters}
            className="flex items-center text-blue-600 text-sm hover:text-blue-800"
            id="clear-all"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="border-b">
        <div className="p-5">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('sort')}
            data-testid="filter-header-sort"
          >
            <h3 className="font-medium text-gray-800">Sort by</h3>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-500 transition-transform ${openSections.sort ? 'transform rotate-180' : ''}`}
            />
          </div>
          
          {openSections.sort && (
            <div className="mt-4 space-y-3">
              <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.sortBy === 'fees' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  data-testid="sort-fees"
                  checked={filters.sortBy === 'fees'}
                  onChange={() => handleSortChange('fees')}
                  className="form-radio text-blue-600"
                />
                <span className={`ml-2 text-sm ${filters.sortBy === 'fees' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                  Price: Low to High
                </span>
              </label>
              
              <label className={`flex items-center p-2 rounded-lg cursor-pointer ${filters.sortBy === 'experience' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  data-testid="sort-experience"
                  checked={filters.sortBy === 'experience'}
                  onChange={() => handleSortChange('experience')}
                  className="form-radio text-blue-600"
                />
                <span className={`ml-2 text-sm ${filters.sortBy === 'experience' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                  Experience: Most Experienced First
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-b">
        <div className="p-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('speciality')}
            data-testid="filter-header-speciality"
          >
            <h3 className="font-medium text-gray-800">Specialities</h3>
            <svg 
              className={`w-5 h-5 transition-transform ${openSections.speciality ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {openSections.speciality && (
            <div className="mt-3">
              <div className="relative mb-3">
                <div className="flex items-center border rounded-md">
                  <span className="pl-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={specialtySearch}
                    onChange={(e) => setSpecialtySearch(e.target.value)}
                    className="w-full py-2 px-2 text-sm focus:outline-none"
                    data-testid="specialty-search"
                  />
                </div>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        data-testid={`filter-specialty-${specialty.replace('/', '-')}`}
                        checked={filters.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="form-checkbox text-blue-500"
                      />
                      <span className="text-gray-700 text-sm">{specialty}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No specialties found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-b">
        <div className="p-4">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleSection('moc')}
            data-testid="filter-header-moc"
          >
            <h3 className="font-medium text-gray-800">Mode of consultation</h3>
            <svg 
              className={`w-5 h-5 transition-transform ${openSections.moc ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {openSections.moc && (
            <div className="mt-3 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="filter-video-consult"
                  checked={filters.consultationType === 'videoConsult'}
                  onChange={() => handleConsultationChange('videoConsult')}
                  className="form-radio text-blue-500"
                />
                <span className="text-gray-700 text-sm">Video Consultation</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="filter-in-clinic"
                  checked={filters.consultationType === 'inClinic'}
                  onChange={() => handleConsultationChange('inClinic')}
                  className="form-radio text-blue-500"
                />
                <span className="text-gray-700 text-sm">In-clinic Consultation</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!filters.consultationType}
                  onChange={() => handleConsultationChange('')}
                  className="form-radio text-blue-500"
                />
                <span className="text-gray-700 text-sm">All</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;