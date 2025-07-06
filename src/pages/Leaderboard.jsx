// src/pages/Leaderboard.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("https://cricxi.onrender.com/api/LeaderboardApi");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Floating Trophy Component
  function FloatingTrophy() {
    const trophyRef = useRef();
    const speed = 0.3 + Math.random() * 0.3;
    
    useFrame(({ clock }) => {
      if (trophyRef.current) {
        const time = clock.getElapsedTime() * speed;
        trophyRef.current.position.x = Math.sin(time) * 2;
        trophyRef.current.position.y = Math.cos(time * 1.2) * 1.5;
        trophyRef.current.rotation.y = time * 1.5;
      }
    });

    return (
      <mesh ref={trophyRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial 
          color="#ffd700" 
          roughness={0.2}
          metalness={1.0}
          emissive="#ffd700"
          emissiveIntensity={0.5}
        />
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
          <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.1} />
        </mesh>
      </mesh>
    );
  }

  // Stadium Lights Component
  function StadiumLights() {
    const lights = useRef([]);
    
    useFrame(({ clock }) => {
      const time = clock.getElapsedTime();
      lights.current.forEach((light, i) => {
        if (light) {
          light.intensity = 0.5 + Math.sin(time * 2 + i) * 0.5;
        }
      });
    });

    return (
      <>
        {[...Array(6)].map((_, i) => (
          <pointLight
            key={i}
            ref={el => lights.current[i] = el}
            position={[
              Math.sin((i / 6) * Math.PI * 2) * 6,
              4,
              Math.cos((i / 6) * Math.PI * 2) * 6
            ]}
            color={i % 2 === 0 ? "#ffcc00" : "#ffffff"}
            intensity={1}
            distance={12}
          />
        ))}
      </>
    );
  }

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <Canvas 
          camera={{ position: [0, 2, 10], fov: 50 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              console.warn('WebGL context lost');
              e.preventDefault();
            }, false);
          }}
        >
          <Environment preset="night" />
          <StadiumLights />
          <ambientLight intensity={0.3} />
          <FloatingTrophy />
          <Text
            color="#ffcc00"
            anchorX="center"
            anchorY="middle"
            position={[0, 3, -5]}
            fontSize={1}
            letterSpacing={0.1}
            lineHeight={1}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            LEADERBOARD
            <meshStandardMaterial attach="material" color="#ffcc00" />
          </Text>
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              LEADERBOARD
            </h1>
            <p className="text-xl text-green-300">Top performers in cricket fantasy</p>
          </motion.div>

          {/* Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg"
          >
            {error ? (
              <div className="text-center text-red-500 p-8">{error}</div>
            ) : data.length === 0 ? (
              <div className="text-center text-gray-300 p-8">No leaderboard data available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white table-auto border-collapse">
                  <thead>
                    <tr className="bg-yellow-600/80 text-black">
                      <motion.th 
                        className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        Rank
                      </motion.th>
                      <motion.th 
                        className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        Player
                      </motion.th>
                      <motion.th 
                        className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        Contests
                      </motion.th>
                      <motion.th 
                        className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        Score
                      </motion.th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.map((entry, index) => (
                      <motion.tr 
                        key={index} 
                        className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'} hover:bg-gray-700/70`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                              }`}>
                                <span className="font-bold text-black">{index + 1}</span>
                              </div>
                            ) : (
                              <span className="ml-4">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full border border-yellow-500/30"
                                src={`https://ui-avatars.com/api/?name=${entry.username}&background=random`}
                                alt={entry.username}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-yellow-300">{entry.username}</div>
                              <div className="text-xs text-gray-400">{entry.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="text-center">
                            <span className="px-2 py-1 rounded-full bg-blue-900/50 text-blue-300">
                              {entry.joinedContests}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-right pr-4">
                            <span className="text-xl font-bold text-green-400">
                              {entry.score || 0}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(10px) translateX(-10px); }
            75% { transform: translateY(-10px) translateX(15px); }
          }
        `}
      </style>
    </div>
  );
};

export default Leaderboard;