import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import login_image from "../Assets/login_image.jpg";
import Button from "../Components/Button.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Login Response:", response.data);

      // Store the token in localStorage
      const token = response.data.message.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage:", token);
      } else {
        console.error("No token found in response");
        setErrorMessage("Login successful, but no token received.");
      }

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "Login failed, please try again."
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
        <h2 className="text-3xl font-semibold text-center mb-8">Sign In</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              type={showPassword ? "text" : "password"} // Dynamically set type
              onChange={handleChange}
              name="password"
              placeholder="Password"
              className="w-full h-14 p-4 bg-transparent border border-white/30 rounded-2xl focus:outline-none focus:border-white text-lg text-white placeholder-white/70"
              required
              disabled={isLoading}
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 text-xl cursor-pointer"
              onClick={togglePasswordVisibility} // Toggle on click
            >
              {showPassword ? "👁️" : "👁️‍🗨️"} {/* Eye icon changes based on state */}
            </span>
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )
            }
            containerClass={`opacity-100 w-full text-white rounded-[10px] hover:scale-105 transform transition-transform duration-200 ease-in-out overflow-visible mt-8`}
            onClick={handleSubmit} // Note: onClick is not strictly needed since form handles submission
            // disabled={isLoading}
          />
        </form>
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link to="/signin" className="font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;