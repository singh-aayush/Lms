import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar';
import { HiMenu } from 'react-icons/hi';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 w-screen relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-lg transform transition-transform duration-300 z-[100] 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm backdrop-brightness-90 z-[90] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        {/* Menu Button on Mobile — hidden when sidebar is open */}
        <button
          className={`md:hidden fixed top-4 left-4 z-[80] p-2 rounded-md bg-white shadow-md ${
            isSidebarOpen ? 'hidden' : 'block'
          }`}
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <HiMenu className="text-xl sm:text-2xl text-gray-700" />
        </button>

        {/* Outlet for nested routes */}
        <div className="mt-12 sm:mt-14 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}