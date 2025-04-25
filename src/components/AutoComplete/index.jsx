import { useState, useEffect, useRef } from 'react';

const AutoComplete = ({ doctors, searchTerm, onSearchChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchTermLower = searchTerm.toLowerCase();
      const matches = doctors
        .filter(doctor => doctor.name.toLowerCase().includes(searchTermLower))
        .slice(0, 3);
      
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);
  
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };
  
  const handleSelectSuggestion = (name) => {
    onSearchChange(name);
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };
  
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative w-full" ref={inputRef}>
      <div className="flex items-center relative">
        <input
          type="text"
          data-testid="autocomplete-input"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4 pr-10"
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-3">
          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute w-full bg-white mt-1 border rounded-lg shadow-lg z-10">
          {suggestions.map((doctor, index) => (
            <div
              key={index}
              data-testid="suggestion-item"
              className="p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
              onClick={() => handleSelectSuggestion(doctor.name)}
            >
              {doctor.imageUrl && (
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-medium">{doctor.name}</div>
                <div className="text-gray-500">{doctor.specialties[0]}</div>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;