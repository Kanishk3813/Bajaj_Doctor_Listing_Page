// src/components/FilterPanel/FilterSection.jsx
const FilterSection = ({ title, children, isOpen = true, toggleOpen, testId }) => {
    return (
      <div className="border-b pb-4 mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer py-2" 
          onClick={toggleOpen}
          data-testid={testId}
        >
          <h3 className="font-medium text-gray-800">{title}</h3>
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        
        {isOpen && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    );
  };
  
  export default FilterSection;