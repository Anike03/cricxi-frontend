import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Floating Cricket Ball Component
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

// Stadium Seats Component
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

// Cricket Trophy Component
function CricketTrophy() {
  const trophyRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/src/assets/trophy-texture.jpg',
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      () => {
        loader.load('/src/assets/fallback-trophy-texture.png', setTexture);
      }
    );
  }, []);

  useFrame(({ clock }) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={trophyRef} position={[0, 0, 0]}>
      {/* Trophy base */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Trophy stem */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.4, 32]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Trophy cup */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 1.5, 32]} />
        <meshStandardMaterial 
          map={texture}
          color={!texture ? "#d4af37" : undefined}
          roughness={0.4} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Trophy handles */}
      <mesh position={[0.9, 0.5, 0]} rotation={[0, 0, Math.PI/4]}>
        <torusGeometry args={[0.5, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      <mesh position={[-0.9, 0.5, 0]} rotation={[0, 0, -Math.PI/4]}>
        <torusGeometry args={[0.5, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredContest, setHoveredContest] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const fetchAllContests = async () => {
      try {
        const res = await axios.get("https://cricxi.onrender.com/api/contests/all");
        setContests(res.data || []);
      } catch (err) {
        console.error("Error loading contests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContests();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (canvasRef.current) {
        const yPos = window.scrollY * 0.5;
        canvasRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10 h-screen w-full" ref={canvasRef}>
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
          <CricketTrophy />
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              CONTESTS <span className="text-white">ARENA</span>
            </h1>
            <p className="text-xl text-green-300">Compete for glory and win amazing prizes</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-12 bg-black/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm max-w-md mx-auto">
              <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-yellow-400 mb-2">
                NO CONTESTS AVAILABLE
              </h3>
              <p className="text-gray-300">
                Check back later for exciting competitions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onHoverStart={() => setHoveredContest(idx)}
                  onHoverEnd={() => setHoveredContest(null)}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 p-6 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden relative group"
                >
                  {/* Prize glow effect */}
                  <AnimatePresence>
                    {hoveredContest === idx && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Contest header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-yellow-400 mb-1">{contest.name}</h2>
                      <p className="text-sm text-gray-400">
                        {contest.teamA} vs {contest.teamB}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-600/30 text-xs font-bold rounded-full">
                      ₹{contest.totalPrize}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Participants</span>
                      <span>{contest.joined}/{contest.maxParticipants}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(contest.joined / contest.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Contest details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Entry Fee</p>
                      <p className="font-bold text-white">₹{contest.entryFee}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Starts At</p>
                      <p className="text-sm text-white">
                        {new Date(contest.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        <br />
                        {new Date(contest.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Join button */}
                  <Link
                    to={`/join/${contest.id}`}
                    className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30"
                  >
                    Join Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  {/* Floating trophy on hover */}
                  <AnimatePresence>
                    {hoveredContest === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="absolute -top-8 -right-8 w-16 h-16 z-10 pointer-events-none"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                          <path 
                            d="M12 2L15 6H21V8H18L19 12H22V14H19L20 21H4L5 14H2V12H5L6 8H3V6H9L12 2Z" 
                            fill="#d4af37"
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
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

export default Contests;