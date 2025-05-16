import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function GeneralInfo({
  author, setAuthor,
  instructor, setInstructor,
  category, setCategory,
  language, setLanguage,
  description, setDescription,
  startDate, setStartDate,
  endDate, setEndDate,
  lessons, setLessons,
  duration, setDuration,
   onPreview,
  onSave
}) {
  return (
    <div className="space-y-6 mt-6">

      
      {/* Author & Instructor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Type in a name"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Instructor</label>
          <select
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select from list</option>
            <option>Shyam</option>
            <option>Ram</option>
          </select>
        </div>
      </div>

      {/* Category & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">No category selected</option>
            <option>Programming</option>
            <option>Design</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write course description..."
          rows={4}
          className="w-full border rounded-md px-3 py-2 resize-none"
        />
      </div>

      {/* Start Date, End Date, Lessons, Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(date) => setStartDate(date?.toISOString() || '')}
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={(date) => setEndDate(date?.toISOString() || '')}
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Select end date"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lessons</label>
            <input
              type="number"
              value={lessons}
              onChange={(e) => setLessons(Number(e.target.value))}
              min={1}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hrs)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Action button */}
       <div className="flex justify-end gap-3 pt-4 mt-6">
        <button
          type="button"
          onClick={onPreview}
          className="border border-gray-300 px-4 py-2 rounded-md hover:bg-[#49BBBD] cursor-pointer"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={onSave}
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-[#49BBBD] cursor-pointer"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default GeneralInfo;
