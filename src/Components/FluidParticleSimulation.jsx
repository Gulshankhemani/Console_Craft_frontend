import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Login = () => {
  return (
    <div className="flex items-center justify-start min-h-screen bg-black p-6 relative">
      <form className="w-full max-w-md p-8 bg-gradient-to-r from-green-900 via-green-600 to-green-900 border-2 border-green-500 rounded-lg shadow-lg ml-10 relative z-10">
        <h1 className="text-2xl font-bold text-green-500 text-center mb-6">LOGIN</h1>
        
        <div className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Username"
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Password"
          />
          
          <button
            type="submit"
            className="w-full p-4 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </div>
      </form>
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-96 h-96">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} className="w-full h-full">
          <Particles />
        </Canvas>
      </div>
    </div>
  );
};

const Particles = () => {
  const mesh = useRef(null);
  const { size, mouse, viewport } = useThree();
  const numParticles = 5000;
  const radius = 10;
  const mouseRadius = 0.5;

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    const velocities = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
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

      const distanceFromCenter = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2);
      if (distanceFromCenter > radius) {
        const angle = Math.atan2(positions[i3 + 1], positions[i3]);
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;

        const normalX = positions[i3] / distanceFromCenter;
        const normalY = positions[i3 + 1] / distanceFromCenter;
        const dot = velocities[i3] * normalX + velocities[i3 + 1] * normalY;
        velocities[i3] -= 2 * dot * normalX;
        velocities[i3 + 1] -= 2 * dot * normalY;
      }

      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      if (distToMouse < mouseRadius) {
        const force = ((mouseRadius - distToMouse) / mouseRadius) * 0.05;
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
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
};

export default Login;
