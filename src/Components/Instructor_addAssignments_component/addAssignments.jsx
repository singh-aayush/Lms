import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiUploadCloud } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';

function AddAssignments() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [mode, setMode] = useState('upload');

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctOption: '' },
  ]);

  const courses = ['Math 101', 'Science 202', 'History 303', 'Physics 404'];

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    setFile(e.dataTransfer.files[0]);
  };

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

 const addAnotherQuestion = () => {
  if (questions.length >= 5) {
    alert('You can only add up to 5 questions.');
    return;
  }
  setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '' }]);
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'upload') {
      console.log({ selectedCourse, title, description, dueDate, file });
    } else {
      console.log({
        selectedCourse,
        title,
        description,
        dueDate,
        questions,
      });
    }

    // Reset
    setSelectedCourse('');
    setTitle('');
    setDescription('');
    setDueDate(null);
    setFile(null);
    setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
    setMode('upload');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-full bg-white rounded-xl py-6 px-0 md:p-6 lg:p-6 md:p-10">
       <h1 className="!text-[2rem] md:text-[3rem] lg:text-2xl font-bold text-slate-800 text-center mb-6">Add New Assignment
</h1>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-full border border-gray-300">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-5 py-2 rounded-full font-medium transition cursor-pointer text-[12px] md:text-4 ${
                mode === 'upload'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setMode('question')}
              className={`px-5 py-2 rounded-full font-medium transition cursor-pointer text-[12px] md:text-4 ${
                mode === 'question'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-gray-200'
              }`}
            >
              Write Question
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Course & Title */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="font-medium text-slate-700 mb-1 block">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="font-medium text-slate-700 mb-1 block">Assignment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-slate-700 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              placeholder="Write a short description..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Due Date */}
          <div>
            <label className="font-medium text-slate-700 mb-1 block">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Select due date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              required
            />
          </div>

          {/* Mode Specific Section */}
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed ${
                dragActive ? 'border-cyan-600 bg-cyan-50' : 'border-gray-300'
              } rounded-md p-6 text-center cursor-pointer transition duration-200 hover:shadow-inner`}
            >
              <label className="flex flex-col items-center text-gray-600 space-y-2">
                <FiUploadCloud className="w-8 h-8 text-cyan-500" />
                <span className="text-base font-medium">
                  {file ? `Selected File: ${file.name}` : 'Drag & drop or click to upload'}
                </span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-md bg-gray-50 space-y-4">
                  <div>
                    <label className="font-medium text-slate-700 mb-1 block">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      required
                      placeholder="Type your question"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex}>
                        <label className="font-medium text-slate-700 mb-1 block">
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
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 mb-1 block">Correct Option</label>
                    <select
                      value={q.correctOption}
                      onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      <option value="">-- Select Correct Option --</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          Option {idx + 1}: {opt || '(empty)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <div>
               <button
  type="button"
  onClick={addAnotherQuestion}
  disabled={questions.length >= 5}
  className={`${
    questions.length >= 5 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
  } text-gray-800 font-medium px-4 py-2 rounded-md`}
>
  + Add Another Question
</button>

              </div>
            </>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-md transition duration-300"
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
