import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } transition-opacity duration-300 z-[1000] max-w-[90%] sm:max-w-md`}
    >
      <div className='flex items-center justify-between'>
        <span className="text-sm sm:text-base">{message}</span>
        <button
          onClick={onClose}
          className='ml-2 sm:ml-4 text-white hover:text-gray-200'
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

function AssessmentEditor() {
  const { courseId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    type: 'quiz',
    questions: [],
    passingScore: 0,
    timeLimit: 0,
    isPublished: false,
  });
  const [courseName, setCourseName] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Fetch course name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Please log in to fetch course details.');
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
        console.error('Error fetching course name:', error);
        showNotification('Failed to fetch course name.');
      }
    };

    fetchCourseName();
  }, [courseId]);

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Please log in to fetch assessment details.');
          return;
        }

        const response = await axios.get(
          `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments/${assessmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.data;
          setAssessment({
            title: data.title || '',
            description: data.description || '',
            type: data.type || 'quiz',
            questions: data.questions.map((q) => ({
              questionText: q.questionText || '',
              questionType: q.questionType || 'multiple_choice',
              options: q.options.map((o) => ({
                text: o.text || '',
                isCorrect: o.isCorrect || false,
              })) || [],
              points: q.points || 0,
            })) || [],
            passingScore: data.passingScore || 0,
            timeLimit: data.timeLimit || 0,
            isPublished: data.isPublished || false,
          });
        } else {
          showNotification('Failed to load assessment data.');
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
        if (error.response?.status === 401) {
          showNotification('Session expired or invalid. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        showNotification('Failed to fetch assessment.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [courseId, assessmentId, navigate]);

  // Handle input changes for top-level fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAssessment((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle question changes
  const handleQuestionChange = (index, field, value) => {
    setAssessment((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Handle option changes
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setAssessment((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
      updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: updatedOptions };
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Add new question
  const addQuestion = () => {
    setAssessment((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          questionType: 'multiple_choice',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
          points: 0,
        },
      ],
    }));
  };

  // Remove question
  const removeQuestion = (index) => {
    setAssessment((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // Add new option to a question
  const addOption = (questionIndex) => {
    setAssessment((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options.push({ text: '', isCorrect: false });
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Remove option from a question
  const removeOption = (questionIndex, optionIndex) => {
    setAssessment((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
        (_, i) => i !== optionIndex
      );
      return { ...prev, questions: updatedQuestions };
    });
  };

  // Update assessment
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please log in to update assessment.');
        return;
      }

      const payload = {
        title: assessment.title,
        description: assessment.description,
        type: assessment.type,
        questions: assessment.questions,
        passingScore: parseInt(assessment.passingScore, 10),
        timeLimit: parseInt(assessment.timeLimit, 10),
        isPublished: assessment.isPublished,
      };

      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments/${assessmentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification('Assessment updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating assessment:', error);
      if (error.response?.status === 401) {
        showNotification('Session expired or invalid. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
      showNotification('Failed to update assessment.');
    }
  };

  return (
    <div className='min-h-screen w-full bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8'>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <div className='w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8'>
        <h1 className='!text-[2rem] sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 text-center mb-4 sm:mb-6 md:mb-8'>
          Edit Assessment for {courseName}
        </h1>

        {isLoading ? (
          <p className='text-center text-gray-600 text-sm sm:text-base md:text-lg'>
            Loading assessment...
          </p>
        ) : (
          <div className='space-y-4 sm:space-y-6'>
            <div>
              <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                name='title'
                value={assessment.title}
                onChange={handleInputChange}
                className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                placeholder='Enter assessment title'
              />
            </div>

            <div>
              <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                Description
              </label>
              <textarea
                name='description'
                value={assessment.description}
                onChange={handleInputChange}
                className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                rows='3'
                placeholder='Enter assessment description'
              />
            </div>

            <div>
              <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                Type
              </label>
              <select
                name='type'
                value={assessment.type}
                onChange={handleInputChange}
                className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
              >
                <option value='quiz'>Quiz</option>
                <option value='assignment'>Assignment</option>
                <option value='exam'>Exam</option>
              </select>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              <div>
                <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                  Passing Score (%)
                </label>
                <input
                  type='number'
                  name='passingScore'
                  value={assessment.passingScore}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                  placeholder='Enter passing score'
                  min='0'
                  max='100'
                />
              </div>
              <div>
                <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                  Time Limit (minutes)
                </label>
                <input
                  type='number'
                  name='timeLimit'
                  value={assessment.timeLimit}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                  placeholder='Enter time limit'
                  min='0'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                Questions
              </label>
              <div className='space-y-4 sm:space-y-6'>
                {assessment.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className='p-3 sm:p-4 bg-gray-50 border rounded-md space-y-3 sm:space-y-4'
                  >
                    <div className='flex justify-between items-center'>
                      <h3 className='text-sm sm:text-base font-medium text-slate-700'>
                        Question {qIndex + 1}
                      </h3>
                      <button
                        onClick={() => removeQuestion(qIndex)}
                        className='text-red-500 hover:text-red-600 text-sm sm:text-base'
                        title="Remove Question"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type='text'
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'questionText', e.target.value)
                      }
                      className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                      placeholder='Enter question text'
                    />
                    <div>
                      <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                        Points
                      </label>
                      <input
                        type='number'
                        value={question.points}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'points', parseInt(e.target.value, 10) || 0)
                        }
                        className='w-full border border-gray-300 outline-none p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                        placeholder='Enter points'
                        min='0'
                      />
                    </div>
                    <div>
                      <label className='block text-sm sm:text-base font-medium text-slate-700 mb-1'>
                        Options
                      </label>
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2'
                        >
                          <input
                            type='text'
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, 'text', e.target.value)
                            }
                            className='w-full flex-1 border border-gray-300 outline-none p-2 sm:p-2 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition text-sm sm:text-base'
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <div className='flex flex-row justify-between w-full px-2'>
                          <label className='flex items-center'>
                            <input
                              type='checkbox'
                              checked={option.isCorrect}
                              onChange={(e) =>
                                handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)
                              }
                              className='mr-2 sm:mr-2 h-4 w-4 text-[#49BBBD] focus:ring-[#49BBBD] border-gray-300 rounded'
                            />
                            <span className='text-sm sm:text-base'>Correct</span>
                          </label>
                          <button
                            onClick={() => removeOption(qIndex, oIndex)}
                            className='text-red-500 hover:text-red-600 text-sm sm:text-base'
                            title="Remove Option"
                          >
                            ✕
                          </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(qIndex)}
                        className='mt-2 text-sm sm:text-base text-[#49BBBD] hover:text-[#3AA8AA]'
                        title="Add Option"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addQuestion}
                  className='mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#49BBBD] text-white font-semibold rounded-md hover:bg-[#3AA8AA] transition duration-300 text-sm sm:text-base'
                  title="Add Question"
                >
                  Add Question
                </button>
              </div>
            </div>

            <div className='flex flex-wrap justify-end mt-6 sm:mt-8 gap-2 sm:gap-3'>
              <button
                onClick={() =>
                  navigate(`/dashboard/course-editor/${courseId}/assessments`)
                }
                className='px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-300 text-sm sm:text-base'
                title="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className='px-4 sm:px-6 py-1.5 sm:py-2 bg-[#49BBBD] text-white font-semibold rounded-md hover:bg-[#3AA8AA] transition duration-300 text-sm sm:text-base'
                title="Update Assessment"
              >
                Update Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssessmentEditor;