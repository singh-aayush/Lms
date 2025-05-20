import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

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

function AddAssignments({ courseId }) {
  const [courseName, setCourseName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [passingScore, setPassingScore] = useState(80);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctOption: '', points: 2 },
  ]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Fetch course name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showNotification("Please log in to fetch course details.");
          return;
        }

        const response = await axios.get(
          `https://lms-backend-flwq.onrender.com/api/v1/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourseName(response.data.data.title || 'Unknown Course');
      } catch (error) {
        console.error("Error fetching course name:", error);
        showNotification("Failed to fetch course name.");
      }
    };

    fetchCourseName();
  }, [courseId]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctOption = value;
    setQuestions(updated);
  };

  const handlePointsChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].points = Number(value);
    setQuestions(updated);
  };

  const addAnotherQuestion = () => {
    if (questions.length >= 5) {
      showNotification('You can only add up to 5 questions.');
      return;
    }
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '', points: 2 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate questions
    for (const q of questions) {
      if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correctOption.trim()) {
        showNotification("Please fill in all question fields.");
        return;
      }
      if (!q.options.includes(q.correctOption)) {
        showNotification("Correct option must match one of the provided options.");
        return;
      }
      if (q.points <= 0) {
        showNotification("Points per question must be greater than 0.");
        return;
      }
    }

    // Format payload
    const payload = {
      title,
      description,
      type: "quiz",
      questions: questions.map(q => ({
        questionText: q.question,
        questionType: "multiple_choice",
        options: q.options.map(opt => ({
          text: opt,
          isCorrect: opt === q.correctOption,
        })),
        points: q.points,
      })),
      passingScore,
      dueDate: dueDate ? dueDate.toISOString() : null,
      timeLimit,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Please log in to submit assignment.");
        return;
      }

      await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPassingScore(80);
      setTimeLimit(30);
      setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '', points: 2 }]);
      showNotification("Assignment submitted successfully!", "success");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      showNotification("Failed to submit assignment.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <h1 className="!text-[1.5rem] sm:text-2xl md:text-3xl font-bold text-slate-800 text-center mb-4 sm:mb-6">
          Add New Assignment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-sm sm:text-base">
          {/* Course & Title */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                Assignment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              placeholder="Write a short description..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none resize-none text-sm sm:text-base"
            ></textarea>
          </div>

          {/* Due Date, Passing Score, Time Limit */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                Due Date
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                placeholderText="Select due date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                required
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
                min="0"
                max="100"
                placeholder="Enter passing score"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                required
                min="1"
                placeholder="Enter time limit"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Questions Section */}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-3 sm:p-4 border rounded-md bg-gray-50 space-y-4">
              <div>
                <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                  placeholder="Type your question"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex}>
                    <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                      Option {optIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                      required
                      placeholder={`Option ${optIndex + 1}`}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                    Correct Option
                  </label>
                  <select
                    value={q.correctOption}
                    onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
                  >
                    <option value="">-- Select Correct Option --</option>
                    {q.options.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        Option {idx + 1}: {opt || '(empty)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="font-medium text-slate-700 mb-1 block text-sm sm:text-base">
                    Points
                  </label>
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                    required
                    min="1"
                    placeholder="Enter points"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={addAnotherQuestion}
              disabled={questions.length >= 5}
              className={`${
                questions.length >= 5 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
              } text-gray-800 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base`}
            >
              + Add Another Question
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#49BBBD] hover:bg-[#3a9a9b] text-white font-semibold py-2 sm:py-2.5 rounded-md transition duration-300 text-sm sm:text-base"
            >
              Submit Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssignments;