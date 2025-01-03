import { useState } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Static value for now
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">SchoolApp</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <button className="px-3 py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600">
                  Login
                </button>
                <button className="px-3 py-2 rounded-md text-sm font-medium bg-yellow-500 hover:bg-yellow-600">
                  Register
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-green-500 hover:bg-green-600">
                  Login
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-yellow-500 hover:bg-yellow-600">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
