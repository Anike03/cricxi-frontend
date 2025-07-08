import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  fetchNews, 
  fetchLiveMatches, 
  searchPlayer,
  fetchPlayerInfo,
  fetchPlayerBattingStats,
  fetchPlayerBowlingStats
} from "../services/cricbuzz.js";

// Cricket Ball Component
function CricketBall() {
  const ballRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      'cricket-ball-texture.jpg',
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      () => {
        loader.load('fallback-ball-texture.png', setTexture);
      }
    );
  }, []);

  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      ballRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={ballRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.4} 
        metalness={0.3}
        color={!texture ? "#ffffff" : undefined}
      />
    </mesh>
  );
}

// Stadium Environment Component
function StadiumEnvironment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

// Player Stats Modal Component
const PlayerModal = ({ player, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [battingStats, setBattingStats] = useState(null);
  const [bowlingStats, setBowlingStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const loadBattingStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetchPlayerBattingStats(player.id);
      setBattingStats(res.data);
    } catch (err) {
      console.error("Error loading batting stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, [player?.id]);

  const loadBowlingStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetchPlayerBowlingStats(player.id);
      setBowlingStats(res.data);
    } catch (err) {
      console.error("Error loading bowling stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, [player?.id]);

  useEffect(() => {
    if (player && activeTab === 'batting' && !battingStats) {
      loadBattingStats();
    }
    if (player && activeTab === 'bowling' && !bowlingStats) {
      loadBowlingStats();
    }
  }, [activeTab, player, battingStats, bowlingStats, loadBattingStats, loadBowlingStats]);

  const formatDate = (dob) => {
    if (!dob) return 'N/A';
    const date = new Date(dob);
    return isNaN(date) ? dob : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <Motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Player Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900/50 to-green-900/50 border-b border-gray-700">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img 
                src={player.image || 'https://via.placeholder.com/150'} 
                alt={player.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{player.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-600/30 text-sm rounded-full">{player.role}</span>
                <span className="px-3 py-1 bg-green-600/30 text-sm rounded-full">{player.bat}</span>
                <span className="px-3 py-1 bg-yellow-600/30 text-sm rounded-full">{player.bowl}</span>
                <span className="px-3 py-1 bg-purple-600/30 text-sm rounded-full">{player.intlTeam}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                  {formatDate(player.DoBFormat)}
                </div>
                <div className="flex items-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {player.birthPlace || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 font-medium relative ${activeTab === 'info' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              Player Info
              {activeTab === 'info' && (
                <Motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400"
                  layoutId="modalUnderline"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('batting')}
              className={`px-6 py-4 font-medium relative ${activeTab === 'batting' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
            >
              Batting Stats
              {activeTab === 'batting' && (
                <Motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-green-400"
                  layoutId="modalUnderline"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bowling')}
              className={`px-6 py-4 font-medium relative ${activeTab === 'bowling' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
            >
              Bowling Stats
              {activeTab === 'bowling' && (
                <Motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"
                  layoutId="modalUnderline"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <Motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Player Information</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Teams</h4>
                  <div className="flex flex-wrap gap-2">
                    {player.teamNameIds?.map((team, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-800/50 text-sm rounded-full">
                        {team.teamName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">ICC Rankings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Batting</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Test</span>
                          <span className="font-medium">{player.rankings?.bat?.testBestRank || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">ODI</span>
                          <span className="font-medium">{player.rankings?.bat?.odiRank || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">T20</span>
                          <span className="font-medium">{player.rankings?.bat?.t20Rank || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Bowling</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Test</span>
                          <span className="font-medium">{player.rankings?.bowl?.testBestRank || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">ODI</span>
                          <span className="font-medium">{player.rankings?.bowl?.odiRank || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">T20</span>
                          <span className="font-medium">{player.rankings?.bowl?.t20Rank || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">All-Rounder</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-300">ODI</span>
                          <span className="font-medium">{player.rankings?.all?.odiRank || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">T20</span>
                          <span className="font-medium text-yellow-400">{player.rankings?.all?.t20Rank || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Biography</h4>
                  <div 
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: player.bio || 'No biography available' }}
                  />
                </div>
              </Motion.div>
            )}

            {activeTab === 'batting' && (
              <Motion.div
                key="batting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Batting Statistics</h3>
                
                {loadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : battingStats ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          {battingStats.headers.map((header, i) => (
                            <th 
                              key={i} 
                              className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                i === 0 ? 'text-gray-300' : 'text-gray-400'
                              }`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {battingStats.values.map((row, i) => (
                          <tr key={i}>
                            {row.values.map((cell, j) => (
                              <td 
                                key={j} 
                                className={`px-4 py-3 whitespace-nowrap text-sm ${
                                  j === 0 ? 'text-gray-300 font-medium' : 'text-gray-400'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Failed to load batting statistics
                  </div>
                )}
              </Motion.div>
            )}

            {activeTab === 'bowling' && (
              <Motion.div
                key="bowling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Bowling Statistics</h3>
                
                {loadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : bowlingStats ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          {bowlingStats.headers.map((header, i) => (
                            <th 
                              key={i} 
                              className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                i === 0 ? 'text-gray-300' : 'text-gray-400'
                              }`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {bowlingStats.values.map((row, i) => (
                          <tr key={i}>
                            {row.values.map((cell, j) => (
                              <td 
                                key={j} 
                                className={`px-4 py-3 whitespace-nowrap text-sm ${
                                  j === 0 ? 'text-gray-300 font-medium' : 'text-gray-400'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Failed to load bowling statistics
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Motion.div>
    </div>
  );
};

const Home = () => {
  const [news, setNews] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetchNews();
        setNews(res?.data?.storyList?.slice(0, 4) || []);
      } catch (err) {
        console.error("Error loading news", err);
      } finally {
        setIsLoading(false);
      }
    };

    const loadLiveMatches = async () => {
      try {
        const res = await fetchLiveMatches();
        const allMatches = res?.data?.typeMatches?.flatMap(typeMatch => 
          typeMatch.seriesMatches?.flatMap(seriesMatch => 
            seriesMatch.seriesAdWrapper?.matches || []
          ) || []
        ) || [];
        
        const liveMatches = allMatches.filter(match => 
          match.matchInfo?.state === "In Progress"
        ).slice(0, 4);
        
        setLiveMatches(liveMatches);
      } catch (err) {
        console.error("Error loading live matches", err);
      }
    };

    loadNews();
    loadLiveMatches();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setIsLoading(true);
      const res = await searchPlayer(searchTerm);
      setSearchResults(res?.data?.player || []);
    } catch (err) {
      console.error("Search error", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerSelect = async (playerId) => {
    try {
      setIsLoading(true);
      const res = await fetchPlayerInfo(playerId);
      setSelectedPlayer(res.data);
    } catch (err) {
      console.error("Error loading player info", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMatchStatus = (match) => {
    if (!match.matchInfo) return "Match in progress";
    const status = match.matchInfo.status || "";
    return status.includes(":") ? status.split(":")[1].trim() : status;
  };

  const getTeamScore = (team, match) => {
    if (!match.matchScore) return "-";
    
    const teamId = team.teamId;
    const scoreKey = `team${teamId === match.matchInfo.team1.teamId ? '1' : '2'}Score`;
    const score = match.matchScore[scoreKey];
    
    if (!score) return "-";
    
    if (match.matchInfo.matchFormat === "TEST") {
      const innings = Object.values(score).find(inn => inn.inningsId);
      return innings ? `${innings.runs}/${innings.wickets}` : "-";
    }
    
    const innings = score.inngs1;
    return innings ? `${innings.runs}/${innings.wickets}` : "-";
  };

  const getMatchProgress = (match) => {
    if (!match.matchInfo) return 50;
    if (match.matchInfo.matchFormat === "TEST") {
      const start = new Date(parseInt(match.matchInfo.startDate));
      const end = new Date(parseInt(match.matchInfo.endDate));
      const now = new Date();
      const total = end - start;
      const elapsed = now - start;
      return Math.min(95, Math.max(5, (elapsed / total) * 100));
    }
    return 50;
  };

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
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10 h-screen w-full" ref={canvasRef}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              console.warn('WebGL context lost');
              e.preventDefault();
            }, false);
          }}
        >
          <StadiumEnvironment />
          <CricketBall />
          <DreiOrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-green-900/80 via-gray-900/90 to-black/90 -z-10" />

      {/* Floating Cricket Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2"/>
              <path d="M12 2 L12 22 M2 12 L22 12" stroke="#15803d" strokeWidth="1.5"/>
              <path d="M5 5 L19 19 M5 19 L19 5" stroke="#15803d" strokeWidth="1.5"/>
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              CRICXI <span className="text-white">ARENA</span>
            </h1>
            <p className="text-xl text-green-300">Your ultimate cricket fantasy experience</p>
          </Motion.div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 py-3 font-medium text-lg relative ${activeTab === "news" ? "text-yellow-400" : "text-gray-400 hover:text-white"}`}
            >
              Latest News
              {activeTab === "news" && (
                <Motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"
                  layoutId="underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("players")}
              className={`px-6 py-3 font-medium text-lg relative ${activeTab === "players" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
            >
              Player Search
              {activeTab === "players" && (
                <Motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400"
                  layoutId="underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "news" ? (
              <Motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12"
              >
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl h-48 animate-pulse"></div>
                  ))
                ) : news.length > 0 ? (
                  news.map((item, idx) => (
                    <Motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-yellow-500 text-xs font-bold rounded-full mb-3">
                          {item?.story?.category || "Cricket"}
                        </span>
                        <h3 className="text-xl font-bold text-yellow-300 mb-2">{item?.story?.headline}</h3>
                        <p className="text-sm text-gray-300 italic mb-3">{item?.story?.context}</p>
                        {item?.story?.intro && (
                          <p className="text-white text-sm line-clamp-2">{item.story.intro}</p>
                        )}
                      </div>
                    </Motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 col-span-2">
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
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      No news available
                    </h3>
                    <p className="text-gray-500">
                      Could not fetch the latest cricket news
                    </p>
                  </div>
                )}
              </Motion.div>
            ) : (
              <Motion.div
                key="players"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                {/* Search Bar */}
                <div className="relative mb-8">
                  <input
                    type="text"
                    placeholder="Search players (e.g. Virat Kohli, Rohit Sharma)"
                    className="w-full px-6 py-4 rounded-full bg-gray-800/70 backdrop-blur-sm border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 text-white placeholder-gray-400 outline-none transition-all pr-16"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Search Results */}
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-xl h-32 animate-pulse"></div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((player, idx) => (
                      <Motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg overflow-hidden relative group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img 
                              src={player.image || `https://ui-avatars.com/api/?name=${player.name}&background=random`}
                              alt={player.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${player.name}&background=random`;
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{player.name}</h3>
                            <p className="text-sm text-blue-300 mb-1">
                              {player.role || "Player"}
                            </p>
                            <p className="text-xs text-gray-400">{player.intlTeam || "N/A"}</p>
                            <div className="mt-3 flex space-x-2">
                              <button 
                                onClick={() => handlePlayerSelect(player.id)}
                                className="px-3 py-1 bg-blue-600/50 text-xs rounded-full hover:bg-blue-600 transition-colors"
                              >
                                View Stats
                              </button>
                              <button className="px-3 py-1 bg-green-600/50 text-xs rounded-full hover:bg-green-600 transition-colors">
                                Add to Team
                              </button>
                            </div>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      No players found
                    </h3>
                    <p className="text-gray-500">
                      Try searching for a player name or check your spelling
                    </p>
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Live Matches Section */}
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-red-500">●</span> Live Matches
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {liveMatches.length > 0 ? (
                liveMatches.map((match, idx) => (
                  <div key={idx} className="bg-gray-900/70 p-4 rounded-xl border border-green-500/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-1 bg-red-500 text-xs rounded-full">LIVE</span>
                      <span className="text-sm text-gray-400">
                        {match.matchInfo?.matchFormat} • {match.matchInfo?.status?.split(':')[0] || ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-xs font-bold">
                          {match.matchInfo?.team1?.teamSName || 'T1'}
                        </div>
                        <span className="font-medium">{match.matchInfo?.team1?.teamName || "Team A"}</span>
                      </div>
                      <span className="font-bold">
                        {getTeamScore(match.matchInfo?.team1, match)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full mr-2 flex items-center justify-center text-xs font-bold">
                          {match.matchInfo?.team2?.teamSName || 'T2'}
                        </div>
                        <span className="font-medium">{match.matchInfo?.team2?.teamName || "Team B"}</span>
                      </div>
                      <span className="font-bold">
                        {getTeamScore(match.matchInfo?.team2, match)}
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 text-sm text-gray-400">
                      <p>{formatMatchStatus(match)}</p>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${getMatchProgress(match)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
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
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    No live matches currently
                  </h3>
                  <p className="text-gray-500">
                    Check back later for live cricket action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player Modal */}
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}

      {/* Global Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;