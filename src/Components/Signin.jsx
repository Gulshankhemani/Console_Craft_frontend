import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import login_image from "../Assets/login_image.jpg";

const Signin = () => {
  const [formData, setFormData] = useState({
    Fullname: "",
    Username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [avatarName, setAvatarName] = useState("");
  const [coverImageName, setCoverImageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));

    if (type === "file") {
      if (name === "avatar") {
        setAvatarName(files[0] ? files[0].name : "");
      } else if (name === "coverImage") {
        setCoverImageName(files[0] ? files[0].name : "");
      }
    }

    console.log(`${name}:`, type === "file" ? files[0]?.name : value);
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
    if (formData.coverImage)
      formDataToSend.append("coverImage", formData.coverImage);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);

      // Store the token in localStorage (assuming the backend returns a token)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "Signup failed, please try again."
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
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md text-white border border-white/20">
        <h2 className="text-3xl font-semibold text-center mb-8">Create Account</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              onChange={handleChange}
              name="Fullname"
              placeholder="Full Name"
              className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl focus:outline-none focus:border-white text-lg text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 text-xl">👤</span>
          </div>
          <div className="relative">
            <input
              type="text"
              onChange={handleChange}
              name="Username"
              placeholder="Username"
              className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl focus:outline-none focus:border-white text-lg text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 text-xl">👤</span>
          </div>
          <div className="relative">
            <input
              type="email"
              onChange={handleChange}
              name="email"
              placeholder="Email Address"
              className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl focus:outline-none focus:border-white text-lg text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 text-xl">✉️</span>
          </div>
          <div className="relative">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              placeholder="Password (At least 6 characters)"
              className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl focus:outline-none focus:border-white text-lg text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 text-xl">🔒</span>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-white/70 mb-2">
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
              <div className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl flex items-center text-white text-lg">
                <span className="flex-1 truncate">
                  {avatarName || "Choose Avatar"}
                </span>
                <span className="text-white opacity-70 text-xl">📷</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Upload Cover Image
            </label>
            <div className="relative">
              <input
                type="file"
                name="coverImage"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                disabled={isLoading}
              />
              <div className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl flex items-center text-white text-lg">
                <span className="flex-1 truncate">
                  {coverImageName || "Choose Cover Image"}
                </span>
                <span className="text-white opacity-70 text-xl">🖼️</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`font-['Amazon_Ember',Arial,sans-serif] opacity-100 w-full p-2 text-white rounded-[10px] hover:scale-105 transform transition-transform duration-200 ease-in-out overflow-visible mt-8 ${
              isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing up...
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-white/70">
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