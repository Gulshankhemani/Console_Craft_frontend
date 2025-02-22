import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Link } from "react-router-dom";
import axios from "axios";


const Signin = () => {

  const [formData, setFormData] = useState({
    Fullname: "",
    Username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setFormData((prevState) => ({
        ...prevState,
        [name]: type === "file" ? files[0] : value, // Store file object
    }));

    console.log(`${name}:`, type === "file" ? files[0].name : value);
};


const handleSubmit = async (event) => {
  event.preventDefault();
  const formDataToSend = new FormData();

  // Append text fields
  formDataToSend.append("Username", formData.Username);
  formDataToSend.append("Fullname", formData.Fullname);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);

  // Append files (if selected)
  if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
  if (formData.coverImage) formDataToSend.append("coverImage", formData.coverImage);

  try {
      const response = await fetch("/register", {
          method: "POST",
          body: formDataToSend,
      });
      const data = await response.json();
      console.log("Response:", data);
  } catch (error) {
      console.error("Error:", error);
  }
};

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6 relative">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 relative">
        <form className="w-full max-w-md p-6 bg-black bg-opacity-80 border border-green-500 rounded-2xl shadow-lg relative z-10 min-h-[500px]">
          <h2 className="text-3xl font-bold text-green-500 text-start mb-8">
            Create account
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-green-400">Name</label>
              <input
                type="text"
                onChange={handleChange}
                name="Fullname"
                placeholder="First and last name"
                className="bg-gray-900 shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] w-full box-border border p-2 rounded-[10px] border-t-[#949494] border-solid border-[#a6a6a6] text-green-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-400">UserName</label>
              <input
                name="Username"
                onChange={handleChange}
                placeholder="First and last name"
                className="bg-gray-900 shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] w-full box-border border p-2 rounded-[10px] border-t-[#949494] border-solid border-[#a6a6a6] text-green-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-400">Enter Email Address</label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                name="email"
                aria-label="First and last name"
                className="bg-gray-900 shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] w-full box-border border p-2 rounded-[10px] border-t-[#949494] border-solid border-[#a6a6a6] text-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-400">Password</label>
              <input
                type="text"
                name="password"
                onChange={handleChange}
                className="bg-gray-900 shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] w-full box-border border p-2 rounded-[10px] border-t-[#949494] border-solid border-[#a6a6a6] text-green-300"
                placeholder="At Least 6 characters"
                required
              />
              <p className="text-white text-left text-xs pt-[5px]">
                Passwords must be at least 6 characters
              </p>
            </div>
            <button
              type="submit"
              onSubmit={handleSubmit}

              className="font-['Amazon_Ember',_Arial,_sans-serif] opacity-100 w-full p-2 text-white bg-green-600 rounded-[10px] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105 transform transition-transform duration-200 ease-in-out overflow-visible "
            >
              Continue
            </button>
            <p className="text-sm pt-[30px] text-center text-green-400">
              By continuing, you agree to ConsoleCraft{" "}
              <a href="#" className="text-white">
                Conditions of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-white">
                Privacy Notice
              </a>
            </p>
            <hr className="border-t border-white my-4" />
            <div className="text-[13px] text-green-400">
              <p>
                Already have an account?{""}
                <Link to="/login">
                  <a href="#" className="text-white text-[13px] ml-2.5">
                    Sign in
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          className="w-full h-full"
        >
          <Particles />
        </Canvas>
      </div>
    </div>
  );
};

const Particles = () => {
  const mesh = useRef(null);
  const { size, mouse, viewport } = useThree();
  const numParticles = 70000;

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    const velocities = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 100;
      const r = Math.sqrt(Math.random()) * 30;
      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = r * Math.sin(angle);
      positions[i * 3 + 2] = 0;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = 0;
    }

    return [positions, velocities];
  }, []);

  useFrame(() => {
    if (!mesh.current) return;

    const positionAttribute = mesh.current.geometry.getAttribute("position");
    const positions = positionAttribute.array;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];

      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      if (distToMouse < 0.5) {
        const force = ((0.5 - distToMouse) / 0.5) * 0.05;
        velocities[i3] += dx * force;
        velocities[i3 + 1] += dy * force;
      }

      velocities[i3] += (Math.random() - 0.5) * 0.0005;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.0005;

      velocities[i3] *= 0.99;
      velocities[i3 + 1] *= 0.99;
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3aa14e"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default Signin;
