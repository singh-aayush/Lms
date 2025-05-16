import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaBookOpen,
  FaPlusCircle,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function Sidebar() {
  const linkClass =
    'flex items-center gap-3 p-2 rounded-md text-black hover:bg-gray-100';
  const activeClass = 'bg-gray-200 font-semibold';

  return (
    <div className="w-64 bg-white text-black border-r h-full flex flex-col justify-between rounded-xl shadow-md p-4 border-none">
      <div>
        <div className="flex items-center justify-left pl-[1rem] mb-8">
          <div className="text-xl font-bold text-cyan-600">LMS</div>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 mb-6 border rounded-md focus:outline-none focus:ring text-black"
        />
        <nav className="space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaHome /> Dashboard
          </NavLink>
          <NavLink
            to="/my-courses"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaBookOpen /> Courses
          </NavLink>
          <NavLink
            to="/create-course"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaPlusCircle /> Create Course
          </NavLink>
          <NavLink
            to="/assignments"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaClipboardList /> Assignments
          </NavLink>
          {/* <NavLink
            to="/add-assignments"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaPlusCircle /> Add Assignments
          </NavLink> */}
        </nav>
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-3">
          <img src="https://i.pravatar.cc/40" alt="Instructor" className="rounded-full w-10 h-10" />
          <div>
            <p className="text-sm font-semibold text-black">Riya</p>
            <span className="text-xs text-black bg-green-200 px-2 py-1 rounded-md">Instructor</span>
          </div>
        </div>
        <div className="mt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaCog /> Settings
          </NavLink>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaSignOutAlt /> Log out
          </NavLink>
        </div>
      </div>
    </div>
  );
}
