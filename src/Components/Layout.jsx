import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar';
import { HiMenu } from 'react-icons/hi';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 w-screen relative overflow-hidden">
      {/* Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-md flex items-center justify-between px-4 z-[100]">
        <div className="text-lg font-bold text-cyan-600">LMS</div>
        <button
          className="p-2 rounded-md bg-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <HiMenu className="text-xl sm:text-2xl text-gray-700" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-14 md:top-0 left-0 h-[calc(100%-3.5rem)] md:h-full w-60 bg-white shadow-lg transform transition-transform duration-300 z-[100] 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <Sidebar
          onLinkClick={() => setIsSidebarOpen(false)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm backdrop-brightness-90 z-[90] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative pt-14 md:pt-0 md:ml-60">
        {/* Outlet for nested routes */}
        <div className="p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}