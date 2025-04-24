import React from 'react'

const PublicNavbar = () => {
  return (
    <div>
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">LeaseLink</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              {/* <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a> */}
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
                <a href="/login">Sign In</a>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default PublicNavbar
