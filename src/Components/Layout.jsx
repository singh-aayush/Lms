import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar';
import { HiMenu } from 'react-icons/hi'; // Menu icon

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 w-screen relative overflow-hidden">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <div
              className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm backdrop-brightness-90 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative  relative">
        {/* Menu Button on Mobile — fixed positioning to stay on top */}
        <button
          className="md:hidden fixed top-4 left-4 z-30"
          onClick={() => setIsSidebarOpen(true)}
        >
          <HiMenu className="text-2xl text-gray-700" />
        </button>

        {/* Outlet for nested routes */}
        <div className="mt-2 mt-8 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
