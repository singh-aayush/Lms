import React, { useState, useEffect } from "react";
import UnitSidebar from "./sidebar";
import TopicEditor from "./contentEditor";
import AddAssignments from "../../Instructor_addAssignments_component/addAssignments";
import { Menu } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Notification Component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } transition-opacity duration-300 z-[1000] max-w-[90%] sm:max-w-md`}
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500 p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl">Something went wrong.</h1>
          <p className="text-sm sm:text-base">
            {this.state.error?.message || "Please try again later."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Contents = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [displayCourseTitle, setDisplayCourseTitle] = useState(null);
  const [status, setStatus] = useState("draft");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showAssignments, setShowAssignments] = useState(false);

  const { state } = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const initialCourseTitle = state?.courseTitle || "Course Title";

  // Show notification
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Initialize displayCourseTitle and fetch curriculum
  useEffect(() => {
    setDisplayCourseTitle(initialCourseTitle);
    if (!showAssignments) {
      fetchCurriculum();
    }
  }, [initialCourseTitle, showAssignments]);

  // Fetch curriculum and status from backend
  const fetchCurriculum = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to fetch curriculum.");
      }

      const response = await axios.get(
        `https://lms-backend-flwq.onrender.com/api/v1/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const curriculum = Array.isArray(response.data.data.curriculum)
        ? response.data.data.curriculum
        : [];

      const mappedUnits = curriculum.map((section) => ({
        id: section._id,
        name: section.sectionTitle,
        topics: Array.isArray(section.lectures)
          ? section.lectures.map((lecture) => ({
              id: lecture._id,
              name: lecture.title,
              title: lecture.title,
              type: lecture.type || "Theory",
              description: lecture.description || "",
              resources: lecture.resources || [],
              thumbnail: lecture.thumbnail || null,
              duration: lecture.duration || 0,
              isPreview: lecture.isPreview || false,
            }))
          : [],
      }));

      setUnits(mappedUnits);
      setShowCurriculum(mappedUnits.length > 0);

      const courseStatus = response.data.data.status || "draft";
      setStatus(courseStatus);

      if (selectedUnitId && !mappedUnits.find((unit) => unit.id === selectedUnitId)) {
        setSelectedUnitId(null);
        setSelectedTopicId(null);
      } else if (
        selectedTopicId &&
        !mappedUnits
          .find((unit) => unit.id === selectedUnitId)
          ?.topics.find((topic) => topic.id === selectedTopicId)
      ) {
        setSelectedTopicId(null);
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to fetch curriculum.");
    }
  };

  // Add a new unit (section)
  const addUnit = async () => {
    if (!unitName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const newSection = {
        sectionTitle: unitName,
        lectures: [],
      };
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        {
          curriculum: [
            ...units.map((unit) => ({
              sectionTitle: unit.name,
              lectures: unit.topics.map((topic) => ({
                title: topic.name,
                description: topic.description,
                duration: topic.duration || 0,
                isPreview: topic.isPreview || false,
                type: topic.type || "Theory",
                resources: topic.resources || [],
              })),
            })),
            newSection,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCurriculum();
      setUnitName("");
      setIsUnitModalOpen(false);
      setShowCurriculum(true);
      showNotification("Section added successfully!", "success");
    } catch (error) {
      console.error("Error adding unit:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to add section.");
    }
  };

  // Add a new lecture (topic)
  const addTopic = async () => {
    if (!selectedUnitId || !topicName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const newLecture = {
        title: topicName,
        description: "",
        duration: 0,
        isPreview: false,
        type: "Theory",
        resources: [],
      };
      const updatedCurriculum = units.map((unit) => ({
        sectionTitle: unit.name,
        lectures:
          unit.id === selectedUnitId
            ? [
                ...unit.topics.map((topic) => ({
                  title: topic.name,
                  description: topic.description,
                  duration: topic.duration || 0,
                  isPreview: topic.isPreview || false,
                  type: topic.type || "Theory",
                  resources: topic.resources || [],
                })),
                newLecture,
              ]
            : unit.topics.map((topic) => ({
                title: topic.name,
                description: topic.description,
                duration: topic.duration || 0,
                isPreview: topic.isPreview || false,
                type: topic.type || "Theory",
                resources: topic.resources || [],
              })),
      }));
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        { curriculum: updatedCurriculum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCurriculum();
      setTopicName("");
      setIsTopicModalOpen(false);
      showNotification("Lecture added successfully!", "success");
    } catch (error) {
      console.error("Error adding lecture:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to add lecture.");
    }
  };

  // Delete a unit
  const deleteUnit = async (unitId) => {
    try {
      const token = localStorage.getItem("token");
      const updatedCurriculum = units
        .filter((unit) => unit.id !== unitId)
        .map((unit) => ({
          sectionTitle: unit.name,
          lectures: unit.topics.map((topic) => ({
            title: topic.name,
            description: topic.description,
            duration: topic.duration || 0,
            isPreview: topic.isPreview || false,
            type: topic.type || "Theory",
            resources: topic.resources || [],
          })),
        }));
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        { curriculum: updatedCurriculum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
      if (selectedUnitId === unitId) {
        setSelectedUnitId(null);
        setSelectedTopicId(null);
      }
      showNotification("Section deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting unit:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to delete section.");
    }
  };

  // Delete a lecture
  const deleteTopic = async (unitId, topicId) => {
    try {
      const token = localStorage.getItem("token");
      const updatedCurriculum = units.map((unit) => ({
        sectionTitle: unit.name,
        lectures:
          unit.id === unitId
            ? unit.topics
                .filter((topic) => topic.id !== topicId)
                .map((topic) => ({
                  title: topic.name,
                  description: topic.description,
                  duration: topic.duration || 0,
                  isPreview: topic.isPreview || false,
                  type: topic.type || "Theory",
                  resources: topic.resources || [],
                }))
            : unit.topics.map((topic) => ({
                title: topic.name,
                description: topic.description,
                duration: topic.duration || 0,
                isPreview: topic.isPreview || false,
                type: topic.type || "Theory",
                resources: topic.resources || [],
              })),
      }));
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        { curriculum: updatedCurriculum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                topics: unit.topics.filter((topic) => topic.id !== topicId),
              }
            : unit
        )
      );
      if (selectedTopicId === topicId) {
        setSelectedTopicId(null);
      }
      showNotification("Lecture deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to delete lecture.");
    }
  };

  // Update topic (lecture) details
  const updateTopic = async (unitId, topicId, updatedData) => {
    try {
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                topics: unit.topics.map((topic) =>
                  topic.id === topicId ? { ...topic, ...updatedData } : topic
                ),
              }
            : unit
        )
      );
      showNotification("Lecture updated successfully!", "success");
    } catch (error) {
      console.error("Error updating lecture locally:", error);
      showNotification("Failed to update lecture locally.");
    }
  };

  // Update course title
  const handleUpdateTitle = async () => {
    if (!newCourseTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        { title: newCourseTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDisplayCourseTitle(newCourseTitle);
      setNewCourseTitle("");
      setIsTitleModalOpen(false);
      showNotification("Course title updated successfully!", "success");
    } catch (error) {
      console.error("Error updating course title:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to update course title.");
    }
  };

  // Update course status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(newStatus);
      showNotification(`Course status updated to "${newStatus}" successfully!`, "success");
    } catch (error) {
      console.error("Error updating course status:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to update course status.");
    }
  };

  // Navigate to assessments list
  const handleViewAssessments = () => {
    navigate(`/dashboard/course-editor/${courseId}/assessments`);
  };

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);
  const selectedTopic =
    selectedUnit?.topics?.find((topic) => topic.id === selectedTopicId) || null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
        <h1 className="!text-[2rem] md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 text-left">
          Update your courses
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pl-1 sm:pl-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800">
              {displayCourseTitle}
            </h2>
            <span className="text-xs sm:text-sm md:text-base text-gray-600">
              (Status: {status})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => setIsTitleModalOpen(true)}
              className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
            >
              Edit Title
            </button>
            <select
              value={status}
              onChange={handleStatusChange}
              className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] outline-none border-none text-white text-sm sm:text-base hover:bg-[#3a9a9b] transition cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] transition cursor-pointer"
            >
              {showAssignments ? "Add Content" : "Add Assignments"}
            </button>
            <button
              onClick={handleViewAssessments}
              className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] transition cursor-pointer"
            >
              All Assessments
            </button>
          </div>
        </div>

        {showAssignments ? (
          <AddAssignments courseId={courseId} />
        ) : !showCurriculum ? (
          <div className="w-full relative mx-auto rounded-lg p-4 sm:p-6 bg-white shadow-md">
            <button
              onClick={() => setShowCurriculum(true)}
              className="py-1.5 px-3 sm:px-4 rounded absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] transition cursor-pointer"
            >
              Add Curriculum
            </button>
          </div>
        ) : (
          <div className="max-w-full sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative flex flex-col lg:flex-row h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] border-2 rounded-[11px]">
              <div className="lg:hidden flex justify-between items-center p-3 sm:p-4 bg-white z-20 rounded-[11px]">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-[#49BBBD] rounded hover:bg-[#3a9a9b] text-white"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div
                className={`fixed inset-y-0 left-0 z-30 transform bg-white w-64 sm:w-72 shadow-lg transition-transform rounded-[11px] duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:shadow-none`}
              >
                <UnitSidebar
                  units={units}
                  selectedUnitId={selectedUnitId}
                  selectedTopicId={selectedTopicId}
                  setSelectedUnitId={setSelectedUnitId}
                  setSelectedTopicId={setSelectedTopicId}
                  deleteUnit={deleteUnit}
                  deleteTopic={deleteTopic}
                  onAddUnitClick={() => {
                    setIsUnitModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  onAddTopicClick={() => {
                    setIsTopicModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  closeSidebar={() => setIsSidebarOpen(false)}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                {selectedTopic ? (
                  <TopicEditor
                    topic={selectedTopic}
                    lectureId={selectedTopicId}
                    sectionId={selectedUnitId}
                    updateTopic={(data) =>
                      updateTopic(selectedUnitId, selectedTopicId, data)
                    }
                  />
                ) : (
                  <div className="text-center text-gray-500 mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base md:text-lg">
                    Select a topic to start editing
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isTitleModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Edit Course Title
              </h3>
              <input
                className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded mb-3 sm:mb-4 text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                placeholder="Enter new course title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={handleUpdateTitle}
                  disabled={!newCourseTitle.trim()}
                  className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setNewCourseTitle("");
                    setIsTitleModalOpen(false);
                  }}
                  className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isUnitModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Add Section
              </h3>
              <input
                className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded mb-3 sm:mb-4 text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                placeholder="Enter Section Name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
              />
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={addUnit}
                  disabled={!unitName.trim()}
                  className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsUnitModalOpen(false)}
                  className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isTopicModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Add Lecture
              </h3>
              <input
                className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded mb-3 sm:mb-4 text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                placeholder="Enter Lecture Name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={addTopic}
                  disabled={!topicName.trim()}
                  className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsTopicModalOpen(false)}
                  className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Contents;