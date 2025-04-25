const Layout = ({ children }) => {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 py-4">
          <div className="container mx-auto px-4">
            {children[0]}
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              {children[1]}
            </div>
            <div className="lg:col-span-3">
              {children[2]}
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default Layout;