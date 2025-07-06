import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.email) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://cricxi.onrender.com/api/users/get-by-email?email=${user.email}`
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError("Error fetching user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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

  // Player Name in 3D
  function PlayerName3D({ name }) {
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
        {name}
        <meshStandardMaterial attach="material" color="#ffcc00" />
      </Text>
    );
  }

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen text-red-500 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      {error}
    </div>
  );

  const isBanned = userData.isBannedUntil && new Date(userData.isBannedUntil) > new Date();

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
          <StadiumSeats />
          {userData && <PlayerName3D name={userData.username} />}
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              PLAYER PROFILE
            </h1>
            <p className="text-xl text-green-300">Your cricket fantasy dashboard</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Player Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={userData.photoURL || `https://ui-avatars.com/api/?name=${userData.username}&background=random`}
                    alt={userData.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500/50 shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${userData.username}&background=random`;
                    }}
                  />
                  {isBanned ? (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-600 text-xs font-bold rounded-full">
                      BANNED
                    </div>
                  ) : (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-green-600 text-xs font-bold rounded-full">
                      ACTIVE
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">{userData.username}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Account Details</h3>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{userData.email}</span>
                      </p>
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>₹{userData.walletBalance?.toFixed(2) || '0.00'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Account Status</h3>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{isBanned ? "Restricted" : "Verified"}</span>
                      </p>
                      {isBanned && (
                        <p className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Until {new Date(userData.isBannedUntil).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Fantasy Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">0</div>
                      <div className="text-xs text-gray-400">Teams</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">0</div>
                      <div className="text-xs text-gray-400">Matches</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">0</div>
                      <div className="text-xs text-gray-400">Winnings</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    Change Password
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add Funds
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button> */}
                </div>
              </div>
            </div>
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

export default Profile;