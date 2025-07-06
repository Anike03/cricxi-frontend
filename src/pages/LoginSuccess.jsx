import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Successful | CricXI";

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRedirect = () => {
    navigate('/');
  };

  // Stadium crowd cheering effect
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-people-cheering-464.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Auto-play prevented:", e));
    
    return () => {
      audio.pause();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-green-900 via-gray-900 to-green-900">
      {/* Animated background with stadium image */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Cricket stadium background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/70 to-green-900/90"></div>
      </div>

      {/* Floating cricket elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotate: [0, 180, 360],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2"/>
            <path d="M12 2 L12 22 M2 12 L22 12" stroke="#15803d" strokeWidth="1.5"/>
            <path d="M5 5 L19 19 M5 19 L19 5" stroke="#15803d" strokeWidth="1.5"/>
          </svg>
        </motion.div>
      ))}

      {/* Confetti celebration */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#4ade80', '#facc15', '#f97316', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 5)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: [0, window.innerHeight],
            x: [0, (Math.random() - 0.5) * 200],
            opacity: [1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 0.5,
            ease: "linear",
          }}
        />
      ))}

      {/* Main content */}
      <motion.div 
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated checkmark */}
        <motion.div 
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
        >
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to <span className="text-green-400">CricXI</span>!
        </motion.h1>
        
        <motion.p 
          className="text-2xl text-green-200 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Login Successful
        </motion.p>

        {/* Progress bar */}
        <motion.div 
          className="relative pt-1 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-green-300">Redirecting in 5s</span>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/20">
            <motion.div
              className="progress-bar shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-green-300 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Dashboard button */}
        <motion.button
          onClick={handleRedirect}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="relative z-10 flex items-center">
            Take Me to Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
          <motion.span
            className="absolute inset-0 bg-green-400/20"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-white/80">Preparing your dashboard...</p>
        </motion.div>
      </motion.div>

      {/* Stadium crowd effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-900/70 via-green-900/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-900/30 backdrop-blur-sm flex items-center justify-center space-x-8">
          {[...Array(30)].map((_, i) => (
            <motion.div 
              key={`crowd-${i}`}
              className="w-3 h-3 bg-white rounded-full"
              style={{ 
                opacity: 0.5 + Math.random() * 0.5,
                y: Math.random() > 0.5 ? 0 : 5 
              }}
              animate={{ 
                y: [0, 5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 0.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating scoreboard animation */}
      <motion.div
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-white font-bold text-lg mb-2">WELCOME!</div>
        <div className="text-green-300 text-sm">You're now part of CricXI</div>
      </motion.div>

      {/* Trophy animation */}
      <motion.div
        className="absolute bottom-1/4 left-8 w-16 h-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M19 5H5C5 7.20914 6.79086 9 9 9H15C17.2091 9 19 7.20914 19 5Z" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V15" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 15H9V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V15Z" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
};

export default LoginSuccess;