import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBookOpen,
  FaPlusCircle,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import axios from 'axios';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } transition-opacity duration-300 z-[110] max-w-[90%] sm:max-w-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-4 text-white hover:text-gray-200"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default function Sidebar({ onLinkClick }) {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState({ firstName: '', lastName: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  const linkClass =
    'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md text-black hover:bg-gray-100';
  const activeClass = 'bg-gray-200 font-semibold';

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Fetch instructor profile
  useEffect(() => {
    const fetchInstructorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Please log in to fetch profile.');
          navigate('/');
          return;
        }

        const response = await axios.get(
          'https://lms-backend-flwq.onrender.com/api/v1/instructors/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setInstructor({
            firstName: response.data.data.firstName || '',
            lastName: response.data.data.lastName || '',
          });
        } else {
          showNotification('Failed to load instructor profile.');
        }
      } catch (error) {
        console.error('Error fetching instructor profile:', error);
        if (error.response?.status === 401) {
          showNotification('Session expired or invalid. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          showNotification('Failed to fetch instructor profile.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.get(
        'https://lms-backend-flwq.onrender.com/api/v1/auth/logout',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('token');
      navigate('/');
      onLinkClick();
    } catch (error) {
      console.error('Logout failed:', error);
      showNotification('Logout failed. Please try again.');
    }
  };

  return (
    <div className="w-60 sm:w-60 bg-white text-black h-full flex flex-col justify-between rounded-xl shadow-md p-3 sm:p-4">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <div>
        {/* <div className="flex items-center justify-left pl-2 sm:pl-4 mb-6 sm:mb-8">
          <div className="text-lg sm:text-xl font-bold text-cyan-600">LMS</div>
        </div> */}
        <nav className="space-y-1 sm:space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
            onClick={onLinkClick}
          >
            <FaHome className="text-base sm:text-lg" /> Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/my-courses"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
            onClick={onLinkClick}
          >
            <FaBookOpen className="text-base sm:text-lg" /> Courses
          </NavLink>
          <NavLink
            to="/dashboard/create-course"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
            onClick={onLinkClick}
          >
            <FaPlusCircle className="text-base sm:text-lg" /> Create Course
          </NavLink>
          <NavLink
            to="/dashboard/assignments"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
            onClick={onLinkClick}
          >
            <FaClipboardList className="text-base sm:text-lg" /> Assignments
          </NavLink>
        </nav>
      </div>
      <div className="mt-4 sm:mt-6">
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4">
          <img
            src="https://i.pravatar.cc/40"
            alt="Instructor avatar"
            className="rounded-full w-8 sm:w-10 h-8 sm:h-10"
          />
          <div>
            {isLoading ? (
              <p className="text-xs sm:text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-semibold text-black truncate">
                  {instructor.firstName} {instructor.lastName}
                </p>
                <span className="text-xs bg-green-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                  Instructor
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
            onClick={onLinkClick}
          >
            <FaCog className="text-base sm:text-lg" /> Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className={`${linkClass} w-full text-left`}
          >
            <FaSignOutAlt className="text-base sm:text-lg" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}