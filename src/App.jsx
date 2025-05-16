import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from './Components/Layout';
import MyCourses from './Components/Instructor_myCourse_component/mycources';
import Home from './Components/Instructor_home_component/home';
import Assignment from './Components/Instructor_assignment_component/assignmentPage';
import Settings from './Components/Instructor_settingPage_component/setting'
// import Addassignments from './Components/Instructor_addAssignments_component/addAssignments';
import CreateCourse from './Components/Instructor_createCourse_component/createCourse';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="assignments" element={<Assignment />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="add-assignments" element={<Addassignments />} /> */}
          <Route path="create-course" element={<CreateCourse />} />

         
          {/* <Route path="logout" element={<Logout />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
