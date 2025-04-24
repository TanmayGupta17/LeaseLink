"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // The array of phrases to display sequentially
  const phrases = [
    "From Search",
    "To Settlement",
    "Seek. Sign. Settle"
  ];
  
  useEffect(() => {
    if (currentPhrase < phrases.length) {
      const currentText = phrases[currentPhrase];
      
      // Typing mode
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          // Type the current character of the current phrase
          const timeout = setTimeout(() => {
            setDisplayText(prevText => prevText + currentText[currentIndex]);
            setCurrentIndex(prevIndex => prevIndex + 1);
          }, 70); // Adjust timing for typing speed
          
          return () => clearTimeout(timeout);
        } else {
          // Current phrase is complete, pause before starting to delete
          const pauseTimeout = setTimeout(() => {
            // If not the last phrase, start deleting
            if (currentPhrase < phrases.length - 1) {
              setIsDeleting(true);
            } else {
              // Final phrase is complete
              setIsTypingComplete(true);
            }
          }, 1000); // 1 second pause before deleting
          
          return () => clearTimeout(pauseTimeout);
        }
      } 
      // Deleting mode
      else {
        if (currentIndex > 0) {
          // Delete one character at a time
          const timeout = setTimeout(() => {
            setDisplayText(prevText => prevText.slice(0, -1));
            setCurrentIndex(prevIndex => prevIndex - 1);
          }, 60); // Faster deletion speed
          
          return () => clearTimeout(timeout);
        } else {
          // Deletion complete, move to next phrase
          const pauseTimeout = setTimeout(() => {
            setIsDeleting(false);
            setCurrentPhrase(prevPhrase => prevPhrase + 1);
          }, 500); // Small pause after deletion
          
          return () => clearTimeout(pauseTimeout);
        }
      }
    }
  }, [currentIndex, currentPhrase, isDeleting]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 relative inline-block">
            {displayText}
            <span className={`${!isTypingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 absolute -right-4 top-0`}>|</span>
          </h1>
          
          <div className={`mt-8 mx-auto w-24 h-1 bg-blue-600 rounded transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <h2 className={`mt-8 text-2xl text-gray-700 font-light max-w-3xl mx-auto transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
            Welcome to LeaseLink
          </h2>
          
          <div className={`mt-6 text-lg text-gray-600 max-w-4xl mx-auto transition-all duration-1000 ease-in-out ${isTypingComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
            <p className="mb-4">
              Your ultimate destination for hassle-free rental management! Say goodbye to paperwork nightmares and hello to seamless renting with our intuitive platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                <a href="/signup">Get Started</a>
              </button>
              <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-medium py-3 px-8 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Streamlined Rental Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">For Landlords</h3>
              <p className="text-gray-600">Effortlessly list your properties with captivating descriptions and stunning visuals to attract the perfect tenants. Our tenant screening tools ensure peace of mind.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">For Tenants</h3>
              <p className="text-gray-600">Apply with ease and sign leases online in a snap. With automated rent collection and convenient maintenance requests, renting has never been smoother.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Management</h3>
              <p className="text-gray-600">Stay connected with built-in communication tools and access detailed financial reports on-the-go. Manage your properties efficiently from anywhere.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">List Property</h3>
              <p className="text-gray-600">Create attractive listings with photos and detailed descriptions</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Screen Tenants</h3>
              <p className="text-gray-600">Verify applications with our comprehensive screening tools</p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">E-Sign Docs</h3>
              <p className="text-gray-600">Complete paperwork digitally with secure e-signatures</p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Easily</h3>
              <p className="text-gray-600">Collect rent and handle maintenance requests seamlessly</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section
      <section className="bg-blue-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">LeaseLink: where renting meets simplicity.</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of property managers and tenants who've simplified their rental experience.</p>
          <button className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section> */}
    
    </div>
  );
}