import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6 relative">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 relative">
        <form className="w-full max-w-md p-8 bg-black bg-opacity-80 border border-green-500 rounded-2xl shadow-lg relative z-10 min-h-[500px]">
          <h1 className="text-3xl font-bold text-green-500 text-start mb-8">
            Sign in
          </h1>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-green-400 font-medium"
              >
                Email or mobile phone number
              </label>
              <input
                id="username"
                type="text"
                className="w-full p-3 bg-gray-900 text-green-300 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 rounded-[10px]"
                aria-label="Username"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-[10px] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105 transform transition-transform duration-200 ease-in-out"
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
            <div className="text-xs text-left pt-5 pb-[30px]">
              <a href="#" className="text-white no-underline">
                <li id="browser">Need help?</li>
              </a>
            </div>
          </div>
        </form>
        <div className="relative pt-5 font-sans text-center text-white z-10">
          <h5
            aria-level="5"
            className="inline-block relative px-2 before:content-[''] before:absolute before:top-1/2 before:left-[-80%] before:w-[80%] before:h-[1px] before:bg-white after:content-[''] after:absolute after:top-1/2 after:right-[-80%] after:w-[80%] after:h-[1px] after:bg-white"
          >
            New to ConsoleCraft?
          </h5>
          <Link
            to="/Signin"
            className="block w-full max-w-xs py-3  px-5 text-lg font-semibold text-white bg-green-600 rounded-[10px] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105 transform transition-transform duration-200 ease-in-out text-center my-2.5"
          >
            Create your ConsoleCraft account
          </Link>
        </div>
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
        // Adjust the mouse influence radius
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

export default Login;
