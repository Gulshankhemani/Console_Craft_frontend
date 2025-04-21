import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Ghost from '/img/ghost.png'; // Update path based on actual location

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
        title: "Good job!",
        text: "Your message has been sent successfully",
        icon: "success"
      }).then(() => {
        navigate('/');
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${Ghost})` }}
    >
     
      <div className="max-w-xl mx-auto my-12 p-8 rounded-xl shadow-xl text-white text-center bg-black bg-opacity-50 animate-fade-in transition-transform">
        <h1 className="text-3xl font-bold mb-6 animate-slide-down relative">
          Get in touch
          <span className="block w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full animate-slide-in" />
        </h1>

        <form onSubmit={onSubmit}>
          <div className="mb-6 text-left animate-fade-up">
            <label htmlFor="name" className="block font-semibold text-sm mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 text-black rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition"
            />
          </div>

          <div className="mb-6 text-left animate-fade-up">
            <label htmlFor="email" className="block font-semibold text-sm mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 text-black rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition"
            />
          </div>

          <div className="mb-6 text-left animate-fade-up">
            <label htmlFor="message" className="block font-semibold text-sm mb-2">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 text-black rounded-lg border border-white min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white rounded-lg bg-gradient-to-br from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-900 transform hover:-translate-y-1 transition shadow-lg relative overflow-hidden"
          >
            Send Message
            <span className="absolute inset-0 bg-white bg-opacity-20 scale-0 group-hover:scale-100 transition-transform rounded-full duration-700"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
