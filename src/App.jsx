import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AutoComplete from './components/AutoComplete';
import FilterPanel from './components/FilterPanel';
import DoctorCard from './components/DoctorCard';
import BookAppointment from './pages/BookAppointment';
import { fetchDoctors } from './api';
import { useFilters } from './hooks/useFilters';

function DoctorListing() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  
  const { filters, setFilters, filteredDoctors } = useFilters(doctors);
  
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
        
        const allSpecialties = new Set();
        if (Array.isArray(data)) {
          data.forEach(doctor => {
            if (doctor && doctor.specialities && Array.isArray(doctor.specialities)) {
              doctor.specialities.forEach(specialty => {
                if (specialty && specialty.name) {
                  allSpecialties.add(specialty.name);
                }
              });
            }
            else if (doctor && doctor.specialties && Array.isArray(doctor.specialties)) {
              doctor.specialties.forEach(specialty => {
                if (specialty) {
                  allSpecialties.add(specialty);
                }
              });
            }
          });
        }
        
        setSpecialtiesList(Array.from(allSpecialties).sort());
      } catch (err) {
        console.error('Error in getDoctors:', err);
        setError('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    getDoctors();
  }, []);
  
  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };
  
  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;
    
    const buttons = [];
    
    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-blue-500 hover:bg-blue-50'
        } border`}
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    );
    
    const pageNumbers = [];
    
    pageNumbers.push(1);
    
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    if (currentPage > 2) {
      pageNumbers.push(currentPage - 1);
    }
    
    if (currentPage !== 1 && currentPage !== totalPages) {
      pageNumbers.push(currentPage);
    }
    
    if (currentPage < totalPages - 1) {
      pageNumbers.push(currentPage + 1);
    }
    
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    pageNumbers.forEach((number, index) => {
      if (number === '...') {
        buttons.push(
          <span 
            key={`ellipsis-${index}`} 
            className="px-3 py-1 text-gray-500"
          >
            ...
          </span>
        );
      } else {
        buttons.push(
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 border rounded mx-1 ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 hover:bg-blue-50'
            }`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        );
      }
    });
    
    buttons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-blue-500 hover:bg-blue-50'
        } border`}
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    );
    
    return buttons;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-4xl">
            <AutoComplete 
              doctors={doctors}
              searchTerm={filters.searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          <div className="w-full md:w-1/4">
            <FilterPanel 
              filters={filters}
              setFilters={setFilters}
              specialtiesList={specialtiesList}
            />
          </div>
          
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading doctors...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                {error}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-gray-50 p-10 rounded-lg text-center">
                <p className="text-lg text-gray-500">No doctors found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({
                    searchTerm: '',
                    consultationType: '',
                    specialties: [],
                    sortBy: ''
                  })}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-600">
                    Found {filteredDoctors.length} doctors
                  </span>
                  <span className="text-gray-500 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                {currentDoctors.map((doctor, index) => (
                  <DoctorCard key={index} doctor={doctor} />
                ))}
                
                {filteredDoctors.length > doctorsPerPage && (
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1 items-center">
                      {renderPaginationButtons()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorListing />} />
        <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;