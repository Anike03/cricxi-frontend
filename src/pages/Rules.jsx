import {  useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Rules() {
  // Floating Cricket Ball Component (matching Profile page)
  function FloatingCricketBall() {
    const ballRef = useRef();
    const speed = 0.5 + Math.random() * 0.5;
    
    useFrame(({ clock }) => {
      if (ballRef.current) {
        const time = clock.getElapsedTime() * speed;
        ballRef.current.position.x = Math.sin(time) * 3;
        ballRef.current.position.y = Math.cos(time * 1.5) * 2;
        ballRef.current.position.z = Math.cos(time * 0.5) * 2;
        ballRef.current.rotation.x = time * 2;
        ballRef.current.rotation.y = time * 1.5;
      }
    });

    return (
      <mesh ref={ballRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.2}
          metalness={0.3}
        />
        <mesh position={[0, 0, 0.3]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#d00" side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    );
  }

  // Stadium Lights Component (matching Profile page)
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
        {[...Array(8)].map((_, i) => (
          <pointLight
            key={i}
            ref={el => lights.current[i] = el}
            position={[
              Math.sin((i / 8) * Math.PI * 2) * 8,
              5,
              Math.cos((i / 8) * Math.PI * 2) * 8
            ]}
            color={i % 2 === 0 ? "#ffcc00" : "#ffffff"}
            intensity={1}
            distance={15}
          />
        ))}
      </>
    );
  }

  // Stadium Seats Component (matching Profile page)
  function StadiumSeats() {
    const seats = useRef();
    const count = 500;
    const positions = useRef([]).current;
    
    if (positions.length === 0) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 5;
        const height = -2 + Math.random() * 4;
        positions.push([
          Math.sin(angle) * radius,
          height,
          Math.cos(angle) * radius
        ]);
      }
    }

    return (
      <group ref={seats}>
        {positions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial 
              color={i % 5 === 0 ? "#ff0000" : "#ffffff"} 
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>
    );
  }

  // Rules Title in 3D (like Profile page)
  function RulesTitle3D() {
    return (
      <Text
        color="#ffcc00"
        anchorX="center"
        anchorY="middle"
        position={[0, 2, -5]}
        fontSize={1}
        letterSpacing={0.1}
        lineHeight={1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        RULES
        <meshStandardMaterial attach="material" color="#ffcc00" />
      </Text>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* 3D Background Canvas (matching Profile page) */}
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
          <StadiumSeats />
          <RulesTitle3D />
          <FloatingCricketBall />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Animated Particles (matching Profile page) */}
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
            GAME RULES
          </h1>
          <p className="text-xl text-green-300">How to play CricXI Fantasy Cricket</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg"
        >
          <motion.section 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
              <span className="mr-2">🧠</span> Team Formation
            </h2>
            <ul className="list-disc pl-6 text-gray-200 space-y-2">
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                You must create a team of exactly 11 players.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                You can select players from both teams.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                You cannot select more than 7 players from one team.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Choose a Captain (2x points) and Vice Captain (1.5x points).
              </motion.li>
            </ul>
          </motion.section>

          <motion.section 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
              <span className="mr-2">📊</span> Points System
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-yellow-600/80 text-black">
                  <tr>
                    <motion.th 
                      whileHover={{ scale: 1.02 }}
                      className="p-3 border border-gray-600"
                    >
                      Event
                    </motion.th>
                    <motion.th 
                      whileHover={{ scale: 1.02 }}
                      className="p-3 border border-gray-600"
                    >
                      Points
                    </motion.th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {[
                    ["Run scored", "+1"],
                    ["Boundary (4s)", "+1"],
                    ["Six (6s)", "+2"],
                    ["Wicket (excluding run-out)", "+25"],
                    ["Run-out / Stumping", "+8"],
                    ["Catch", "+8"],
                    ["Maiden over", "+12"],
                    ["Duck (batsmen only)", "-4"],
                    ["Captain multiplier", "x2"],
                    ["Vice Captain multiplier", "x1.5"]
                  ].map(([event, points], index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.05) }}
                      className="hover:bg-gray-700/50"
                    >
                      <td className="p-3 border border-gray-600">{event}</td>
                      <td className="p-3 border border-gray-600 font-mono">{points}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          <motion.section 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
              <span className="mr-2">⚠️</span> Important Notes
            </h2>
            <ul className="list-disc pl-6 text-gray-200 space-y-2">
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Only starting XI players earn points. No points for bench players.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Points will be updated live as the match progresses.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                In case of tie in leaderboard, prize is split equally.
              </motion.li>
            </ul>
          </motion.section>
        </motion.div>
      </div>

      {/* Global Styles (matching Profile page) */}
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
}

export default Rules;