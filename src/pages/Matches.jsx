import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Thunderstorm Rivalry Background Component
function ThunderstormRivalry() {
  const groupRef = useRef();
  const [lightning, setLightning] = useState(false);
  const rainCount = 1000;
  const rainRef = useRef();

  // Create rain particles
  useEffect(() => {
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    rainRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, []);

  // Animate rain and lightning
  useFrame(() => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.5 + Math.random() * 0.5;
        if (positions[i] < -10) positions[i] = 20;
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Random lightning flashes
    if (Math.random() > 0.98) {
      setLightning(true);
      setTimeout(() => setLightning(false), 100);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={lightning ? 1 : 0.2} color={0x555555} />
      <pointLight 
        position={[0, 20, 0]} 
        intensity={lightning ? 10 : 2} 
        color={lightning ? 0xffffff : 0x444488}
      />
      
      {/* Rain particles */}
      <points ref={rainRef}>
        <bufferGeometry attach="geometry" />
        <pointsMaterial 
          attach="material" 
          size={0.1} 
          color={0xaaaaaa} 
          transparent 
          opacity={0.6} 
        />
      </points>
      
      {/* Rivalry lightning effect */}
      {lightning && (
        <mesh position={[0, 10, -10]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color={0xffffff} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Aggressive VS Animation Component
function VSAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/src/assets/audio/explosion.mp3');
    audioRef.current.volume = 0.3;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setExplosion(true);
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
      
      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setExplosion(false), 300);
      }, 800);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
      <motion.div
        initial={{ scale: 1, opacity: 0.9 }}
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
          opacity: isAnimating ? [0.9, 1, 0.9] : 0.9,
          textShadow: isAnimating 
            ? [
                "0 0 10px #ff0000, 0 0 20px #ff0000", 
                "0 0 40px #ff0000, 0 0 60px #ff0000, 0 0 80px #ff0000",
                "0 0 10px #ff0000, 0 0 20px #ff0000"
              ]
            : "0 0 20px #ff0000, 0 0 40px #ff0000"
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="font-bold text-5xl md:text-6xl flex items-center justify-center relative"
      >
        <span className="text-white drop-shadow-lg">VS</span>
        
        {/* Lightning strike effect */}
        <AnimatePresence>
          {isAnimating && (
            <>
              <motion.div 
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 h-full w-1 bg-white"
                style={{ 
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 20px #ffffff, 0 0 40px #ffffff'
                }}
              />
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white rounded-full"
                style={{ 
                  boxShadow: '0 0 50px #ffffff, 0 0 100px #ffffff'
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Thunder effect */}
        <AnimatePresence>
          {explosion && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0,
                    y: 0,
                    rotate: Math.random() * 360,
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    rotate: Math.random() * 360,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    delay: Math.random() * 0.3
                  }}
                  className="absolute w-1 h-8 bg-white"
                  style={{
                    left: '50%',
                    top: '50%',
                    boxShadow: '0 0 10px #ffffff',
                    transformOrigin: 'center bottom'
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thunder, setThunder] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef();
  const thunderIntervalRef = useRef(null);

  useEffect(() => {
    const getMatches = async () => {
      try {
        // Fetch from both APIs in parallel
        const [cricbuzzResponse, backendResponse] = await Promise.all([
          // Cricbuzz API call
          axios({
            method: 'get',
            url: 'https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/matches/upcoming',
            headers: { 
              'x-apihub-key': 'Ep4-fJnRh4dtxTMUGIEoofzyBprqNun3DeI0n7OjYqyOhSCE3H', 
              'x-apihub-host': 'Cricbuzz-Official-Cricket-API.allthingsdev.co', 
              'x-apihub-endpoint': '1943a818-98e9-48ea-8d1c-1554e116ef44'
            }
          }),
          // Your backend API call
          axios.get('https://your-render-backend-url.com/api/matches/upcoming')
        ]);

        // Process Cricbuzz matches
        const cricbuzzMatches = [];
        cricbuzzResponse.data.typeMatches.forEach(typeMatch => {
          typeMatch.seriesMatches.forEach(seriesMatch => {
            if (seriesMatch.seriesAdWrapper?.matches) {
              seriesMatch.seriesAdWrapper.matches.forEach(match => {
                cricbuzzMatches.push({
                  matchId: match.matchInfo.matchId,
                  cricbuzzId: match.matchInfo.matchId,
                  matchDesc: match.matchInfo.matchDesc,
                  team1: match.matchInfo.team1.teamName,
                  team2: match.matchInfo.team2.teamName,
                  startDate: match.matchInfo.startDate,
                  venue: match.matchInfo.venueInfo?.ground || "Venue not specified",
                  matchFormat: match.matchInfo.matchFormat,
                  seriesName: match.matchInfo.seriesName,
                  source: 'cricbuzz'
                });
              });
            }
          });
        });

        // Process backend matches (assuming similar structure)
        const backendMatches = backendResponse.data.data.map(match => ({
          matchId: match.matchId,
          cricbuzzId: match.cricbuzzId,
          matchDesc: match.matchDesc,
          team1: match.team1,
          team2: match.team2,
          startDate: match.startDate,
          venue: match.venue,
          matchFormat: match.matchFormat,
          seriesName: match.seriesName || "Custom Match",
          source: 'backend'
        }));

        // Combine and deduplicate matches (prioritizing backend matches if IDs conflict)
        const combinedMatches = [...backendMatches];
        const backendMatchIds = new Set(backendMatches.map(m => m.matchId));
        
        cricbuzzMatches.forEach(match => {
          if (!backendMatchIds.has(match.matchId)) {
            combinedMatches.push(match);
          }
        });

        // Sort by date and limit to 10 matches
        const sortedMatches = combinedMatches
          .sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))
          .slice(0, 10);

        setMatches(sortedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
        // If one API fails, try to continue with the other
        try {
          // Fallback to just Cricbuzz API
          const cricbuzzResponse = await axios({
            method: 'get',
            url: 'https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/matches/upcoming',
            headers: { 
              'x-apihub-key': 'Ep4-fJnRh4dtxTMUGIEoofzyBprqNun3DeI0n7OjYqyOhSCE3H', 
              'x-apihub-host': 'Cricbuzz-Official-Cricket-API.allthingsdev.co', 
              'x-apihub-endpoint': '1943a818-98e9-48ea-8d1c-1554e116ef44'
            }
          });

          const cricbuzzMatches = [];
          cricbuzzResponse.data.typeMatches.forEach(typeMatch => {
            typeMatch.seriesMatches.forEach(seriesMatch => {
              if (seriesMatch.seriesAdWrapper?.matches) {
                seriesMatch.seriesAdWrapper.matches.forEach(match => {
                  cricbuzzMatches.push({
                    matchId: match.matchInfo.matchId,
                    cricbuzzId: match.matchInfo.matchId,
                    matchDesc: match.matchInfo.matchDesc,
                    team1: match.matchInfo.team1.teamName,
                    team2: match.matchInfo.team2.teamName,
                    startDate: match.matchInfo.startDate,
                    venue: match.matchInfo.venueInfo?.ground || "Venue not specified",
                    matchFormat: match.matchInfo.matchFormat,
                    seriesName: match.matchInfo.seriesName,
                    source: 'cricbuzz'
                  });
                });
              }
            });
          });

          const sortedMatches = cricbuzzMatches
            .sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))
            .slice(0, 10);

          setMatches(sortedMatches);
        } catch (fallbackError) {
          console.error("Fallback fetch failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getMatches();

    // Initialize audio
    audioRef.current = new Audio('/src/assets/audio/rivalry.mp3');
    audioRef.current.volume = 0.5;

    // Setup thunder interval
    thunderIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7 && matches.length > 0) {
        setThunder(true);
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
        setTimeout(() => setThunder(false), 300);
      }
    }, 10000);

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (thunderIntervalRef.current) {
        clearInterval(thunderIntervalRef.current);
      }
    };
  }, [matches.length]);

  // Team Badge with full team name
  const TeamBadge = ({ team, color, position }) => (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={`absolute ${position} w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg z-10`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}`
      }}
    >
      <div className="text-center px-1">
        {team.split(' ').map((word, i) => (
          <div key={i}>{word}</div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Full-screen background image */}
      <div 
        className="fixed inset-0 -z-20 w-full h-full"
        style={{ 
          backgroundImage: "url('/src/assets/stadium.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Thunderstorm Rivalry Background Canvas */}
      <div className="fixed inset-0 -z-10 h-screen w-full opacity-70" ref={canvasRef}>
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
          <ThunderstormRivalry />
        </Canvas>
      </div>

      {/* Lightning Flash Effect */}
      <AnimatePresence>
        {thunder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
              RIVALRY SHOWDOWN
            </h1>
            <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-transparent w-1/2 mx-auto"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-black/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm max-w-md mx-auto"
            >
              <h3 className="text-xl font-medium text-yellow-400 mb-2">
                THE BATTLEGROUND IS EMPTY
              </h3>
              <p className="text-gray-300">
                No scheduled clashes... for now
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matches.map((match, idx) => (
                <motion.div
                  key={`${match.source}-${match.matchId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 p-6 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden relative"
                >
                  {/* Source indicator */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                    match.source === 'cricbuzz' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {match.source === 'cricbuzz' ? 'Official' : 'Custom'}
                  </div>
                  
                  {/* Rivalry team badges */}
                  <div className="relative h-36 mb-6 -mx-6 -mt-6 bg-gradient-to-r from-blue-900/30 to-red-900/30">
                    <TeamBadge team={match.team1} color="#3b82f6" position="left-6 top-1/2 transform -translate-y-1/2" />
                    <TeamBadge team={match.team2} color="#ef4444" position="right-6 top-1/2 transform -translate-y-1/2" />
                    
                    {/* Aggressive VS Animation */}
                    <VSAnimation />
                  </div>

                  {/* Match details with team names */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-center text-yellow-400 mb-3">
                      {match.matchDesc}
                    </h3>
                    <p className="text-sm text-center text-gray-400 mb-2">{match.seriesName}</p>
                    
                    {/* Team names display */}
                    <div className="flex justify-between items-center mb-4 px-4">
                      <span className="font-medium text-blue-300 text-sm text-center">
                        {match.team1}
                      </span>
                      <span className="mx-2 text-white font-bold">vs</span>
                      <span className="font-medium text-red-300 text-sm text-center">
                        {match.team2}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center text-sm text-gray-300 mb-2">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {match.venue}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {new Date(parseInt(match.startDate)).toLocaleString("en-IN", {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-6">
                    <Link
                      to={`/contests/${match.matchId}`}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm rounded-lg text-center transition-all hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      JOIN CONTEST
                    </Link>
                    <Link
                     to={`/create-team/${match.cricbuzzId}?internalId=${match.matchId}`}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold text-sm rounded-lg text-center transition-all border border-gray-600"
                    >
                      CREATE TEAM
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;