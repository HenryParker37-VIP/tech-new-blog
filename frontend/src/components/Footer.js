import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">TechPulse</span>
            <p className="text-sm mt-1">Automated tech news, updated every 6 hours.</p>
          </div>
          <div className="text-sm">
            <p>Sources: HackerNews, Dev.to, TechCrunch</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} TechPulse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
