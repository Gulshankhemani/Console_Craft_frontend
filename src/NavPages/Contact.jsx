import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import Button from '../Components/Button.jsx';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "f3489914-9d39-4ff0-9d05-9e403981371e");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6"
      }).then(() => {
        navigate('/');
      });
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".form-container",
      { opacity: 0, scale: 0.9, rotateX: 10 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".form-input",
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.4 }
    );
    gsap.fromTo(
      ".form-label",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: "power2.out", delay: 0.6 }
    );
    gsap.fromTo(
      ".submit-btn",
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)", delay: 1 }
    );
    gsap.fromTo(
      ".title-underline",
      { width: 0 },
      { width: "4rem", duration: 0.8, ease: "power3.out", delay: 1.2 }
    );
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <img
        src="./img/ghost.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="form-container relative max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl bg-black bg-opacity-50 backdrop-blur-lg text-white z-10">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-50 relative">
          Get in Touch
          <span className="title-underline block w-16 h-1 bg-blue-50 mx-auto mt-2 rounded-full" />
        </h1>

        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="form-label block text-sm font-medium text-teal-100 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input w-full p-3 rounded-lg border border-blue-50 bg-gray-800 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-transparent transition-all duration-300 placeholder-blue-50 hover:bg-gray-700 hover:shadow-md"
              placeholder="Your Name"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="form-label block text-sm font-medium text-teal-100 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input w-full p-3 rounded-lg border border-blue-50 bg-gray-800 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-transparent transition-all duration-300 placeholder-blue-50 hover:bg-gray-700 hover:shadow-md"
              placeholder="Your Email"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="message" className="form-label block text-sm font-medium text-blue-50 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-input w-full p-3 rounded-lg border border-blue-50 bg-gray-800 text-blue-50 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-transparent transition-all duration-300 placeholder-blue-50 hover:bg-gray-700 hover:shadow-md"
              placeholder="Your Message"
            />
          </div>

          <Button
            name="Send Message"
            containerClass="submit-btn w-full text-lg"
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
};

export default Contact;