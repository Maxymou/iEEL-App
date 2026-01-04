import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-apple-gray border-b border-apple-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-apple-blue rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">iE</span>
              </div>
              <span className="text-xl font-semibold text-apple-text">iEEL</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-apple-text-secondary hover:text-apple-text transition-colors font-medium"
              >
                Accueil
              </Link>
              <button
                onClick={() => navigate('/import')}
                className="text-apple-text-secondary hover:text-apple-text transition-colors font-medium"
              >
                Import CSV
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-apple-gray border-t border-apple-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-apple-text-secondary text-sm">
            © 2024 iEEL - Gestion d'inventaire de matériel électrique
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
