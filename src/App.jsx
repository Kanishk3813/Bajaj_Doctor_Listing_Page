// src/App.jsx 
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AutoComplete from './components/AutoComplete';
import FilterPanel from './components/FilterPanel';
import DoctorCard from './components/DoctorCard';
import { fetchDoctors } from './api';
import { useFilters } from './hooks/useFilters';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  
  const { filters, setFilters, filteredDoctors } = useFilters(doctors);
  
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
                <div className="mb-4 text-gray-600">
                  Found {filteredDoctors.length} doctors
                </div>
                {filteredDoctors.map((doctor, index) => (
                  <DoctorCard key={index} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;