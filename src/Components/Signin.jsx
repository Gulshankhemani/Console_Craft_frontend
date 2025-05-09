import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import login_image from "../Assets/login_image.jpg";
import Button from "../Components/Button.jsx";

const Signin = () => {
  const [formData, setFormData] = useState({
    Fullname: "",
    Username: "",
    email: "",
    password: "",
    avatar: null,
    // coverImage: null,
  });

  const [avatarName, setAvatarName] = useState("");
  // const [coverImageName, setCoverImageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));

    if (type === "file" && name === "avatar") {
      setAvatarName(files[0] ? files[0].name : "");
    }
    // else if (type === "file" && name === "coverImage") {
    //   setCoverImageName(files[0] ? files[0].name : "");
    // }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("Username", formData.Username);
    formDataToSend.append("Fullname", formData.Fullname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
    // if (formData.coverImage) formDataToSend.append("coverImage", formData.coverImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const token = response.data.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage:", token);
      } else {
        console.warn("No accessToken found in response:", response.data);
        // Optionally proceed without token if cookies are sufficient
      }

      navigate("/"); // Always navigate on successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${login_image})` }}
    >
      <div className="w-full max-w-md p-8 bg-black/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Create Account
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="Fullname"
              value={formData.Fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full h-12 px-4 bg-transparent border border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
              👤
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full h-12 px-4 bg-transparent border border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
              👤
            </span>
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-12 px-4 bg-transparent border border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
              ✉️
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (At least 8 characters)"
              className="w-full h-12 px-4 bg-transparent border border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048-.502 5.053-4.765 9.067-9.95 9.067s-9.448-4.014-9.95-9.067c.502-5.034 4.765-9.048 9.95-9.048zm0 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                  />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3l18 18M9.75 9.75a2.25 2.25 0 013 3m5.137 5.138C16.586 19.367 14.405 20.25 12 20.25c-5.185 0-9.448-4.014-9.95-9.048.502-5.034 4.765-9.048 9.95-9.048 2.405 0 4.586.883 5.887 2.362"
                  />
                </svg>
              )}
            </span>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-white/70 mb-1">
              Upload Avatar
            </label>
            <div className="relative">
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                disabled={isLoading}
              />
              <div className="w-full h-12 px-4 bg-transparent border border-white/30 rounded-xl flex items-center text-white">
                <span className="flex-1 truncate">
                  {avatarName || "Choose Avatar"}
                </span>
                <span className="text-white/70">📷</span>
              </div>
            </div>
          </div>
          <Button
            name={
              isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
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
                  Signing up...
                </span>
              ) : (
                "Continue"
              )
            }
            containerClass={`w-full py-3 text-white rounded-xl transition-all duration-200 `}
            onClick={handleSubmit} 
          />
        </form>
        <div className="mt-6 text-center text-white/70 text-sm space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p>
            By continuing, you agree to ConsoleCraft{" "}
            <a href="#" className="text-white hover:underline">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-white hover:underline">
              Privacy Notice
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;