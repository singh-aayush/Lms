import { useState } from 'react';
import { Upload, Trash2, Save } from 'lucide-react';

const InstructorSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Riya',
    email: 'riya@gmail.com',
    phone: '+91 (555) 123-4567',
    bio: 'Senior developer with 10 years of experience',
    avatar: 'https://i.pravatar.cc/150',
    expertise: ['JavaScript', 'React', 'Node.js'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/janesmith',
      twitter: 'https://twitter.com/janesmith',
    },
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (previewImage) {
      setFormData((prev) => ({ ...prev, avatar: previewImage }));
    }
    setIsEditing(false);
  };

  const removeImage = () => setPreviewImage(null);

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0">
              <img
                src={previewImage || formData.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{formData.name}</h1>
              <div className="flex gap-6 mt-2 text-sm text-gray-700">
                <div>
                  <span className="font-semibold text-lg">12</span> Courses
                </div>
                <div>
                  <span className="font-semibold text-lg">350</span> Followers
                </div>
              </div>
              {isEditing && previewImage && (
                <button
                  onClick={removeImage}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  <Trash2 className="w-3 h-3 inline mr-1" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="text-center sm:text-right">
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 sm:mt-0 px-5 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <p className="text-gray-800">{formData.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <p className="text-gray-800">{formData.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <p className="text-gray-800">{formData.email}</p>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <p className="text-gray-800">{formData.bio}</p>
            )}
          </div>

          {/* Expertise */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Expertise</label>
            {isEditing ? (
              <>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-grow p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddExpertise}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button type="button" onClick={() => handleRemoveExpertise(idx)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.expertise.map((skill, idx) => (
                  <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">LinkedIn</label>
            {isEditing ? (
              <input
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <a
                href={formData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {formData.socialLinks.linkedin}
              </a>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Twitter</label>
            {isEditing ? (
              <input
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <a
                href={formData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {formData.socialLinks.twitter}
              </a>
            )}
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InstructorSettings;
