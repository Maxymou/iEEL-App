import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* TopBar - Persistante */}
      <header className="bg-bg-surface border-b border-border-default sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-primary transition-all duration-150">
                <svg className="w-6 h-6 text-bg-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-text-main">iEEL</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-primary bg-bg-elevated'
                    : 'text-text-muted hover:text-text-main hover:bg-bg-elevated/50'
                }`}
              >
                Accueil
              </Link>
              <button
                onClick={() => navigate('/import')}
                className="px-4 py-2 rounded-lg font-medium text-text-muted hover:text-text-main hover:bg-bg-elevated/50 transition-all duration-150"
              >
                Import CSV
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Layout avec Sidebar (Desktop uniquement) */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Desktop uniquement */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] border-r border-border-default bg-bg-surface/50">
          <nav className="sticky top-20 p-4 space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-primary bg-bg-elevated border border-border-subtle'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-elevated/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Accueil</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">
                Outils
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => navigate('/import')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-text-muted hover:text-text-main hover:bg-bg-elevated/50 transition-all duration-150"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Import CSV</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile uniquement */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-default z-40">
        <div className="grid grid-cols-2 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-150 ${
              isActive('/') && location.pathname === '/'
                ? 'text-primary bg-bg-elevated'
                : 'text-text-muted'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Accueil</span>
          </Link>
          <button
            onClick={() => navigate('/import')}
            className="flex flex-col items-center justify-center space-y-1 text-text-muted transition-all duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs font-medium">Import</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
