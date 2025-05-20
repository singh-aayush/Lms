import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "./Components/Layout";
import MyCourses from "./Components/Instructor_myCourse_component/mycources";
import Home from "./Components/Instructor_home_component/home";
import Assignment from "./Components/Instructor_assignment_component/assignmentPage";
import Settings from "./Components/Instructor_settingPage_component/setting";
import CreateCourse from "./Components/Instructor_createCourse_component/createCourse";
import Login from "./Components/Login_component/login";
import ProtectedRoute from "./Components/protectedRoute";
import CourseEditor from './Components/Instructor_myCourse_component/contents_components/contents';
import AssessmentsList from './Components/Instructor_myCourse_component/contents_components/Instructor_assignmentPage_component/allAssignment'; // Import AssessmentsList
import AssessmentEditor from "./Components/Instructor_myCourse_component/contents_components/Instructor_assignmentPage_component/assignmentEditor";
import { isAuthenticated } from "./utils/auth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route (index) */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="assignments" element={<Assignment />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route
            path="course-editor/:courseId"
            element={<CourseEditor topic={{}} updateTopic={() => {}} />}
          />
          <Route
            path="course-editor/:courseId/assessments"
            element={<AssessmentsList />}
          />
          <Route
            path="course-editor/:courseId/assessments/:assessmentId"
            element={<AssessmentEditor />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;