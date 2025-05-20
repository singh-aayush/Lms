import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '../../utils/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/auth/login',
        formData
      );

      const { token } = res.data.data;
      loginUser(token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissError = () => {
    setError('');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col sm:flex-row">
      {/* Left side image */}
      <div
        className="sm:w-1/2 w-full h-48 sm:h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url('/login_img.jpg')`,
        }}
      >
        <div className="h-full w-full flex items-center justify-center bg-transparent bg-opacity-70 blur-50">
          <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold text-center px-4">
            Welcome Back, Instructor
          </h2>
        </div>
      </div>

      {/* Right side login form */}
      <div className="sm:w-1/2 w-full flex items-center justify-center p-4 sm:p-8 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            Login to Your Account
          </h2>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-xs sm:text-sm flex items-center justify-between">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-xs sm:text-sm flex items-center justify-between">
              {error}
              <button
                onClick={dismissError}
                className="text-red-700 hover:text-red-900"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-xs sm:text-sm"
              aria-describedby="email-error"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-xs sm:text-sm pr-10"
              aria-describedby="password-error"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 sm:top-10 text-gray-500 cursor-pointer hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center text-xs sm:text-sm disabled:opacity-50"
            aria-label="Login"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;