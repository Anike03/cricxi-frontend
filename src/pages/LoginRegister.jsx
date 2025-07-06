import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, googleProvider, setupRecaptcha } from "../services/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  const navigate = useNavigate();

  // Floating cricket ball animation
  const [balls, setBalls] = useState([]);
  
  useEffect(() => {
    const cricketBalls = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      size: 20 + Math.random() * 30,
    }));
    setBalls(cricketBalls);
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setSuccess(false);
    setActiveTab("email");
    setShowOtpInput(false);
  };

  const syncUser = async (firebaseUser) => {
    try {
      await axios.post("https://cricxi.onrender.com/api/users/sync", {
        email: firebaseUser.email,
        username: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
      });
    } catch (err) {
      console.error("User sync failed", err);
    }
  };

  const handleEmailRegister = async () => {
    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user, {
        url: window.location.origin + "/auth",
      });
      navigate("/email-verification");
    } catch (err) {
      setSuccess(false);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (!userCred.user.emailVerified) {
        setMessage("❗ Please verify your email first.");
        setSuccess(false);
        return;
      }
      await syncUser(userCred.user);
      navigate("/login-success");
    } catch (err) {
      setSuccess(false);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUser(result.user);
      navigate("/login-success");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      await syncUser(result.user);
      navigate("/login-success");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = () => {
    if (!phone.match(/^\+\d{10,15}$/)) {
      setMessage("Enter valid phone number with country code (e.g. +91...)");
      return;
    }

    setIsLoading(true);
    setupRecaptcha("recaptcha-container");
    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOtpInput(true);
        setMessage("📲 OTP sent to your phone.");
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setIsLoading(false));
  };

  const verifyOtp = () => {
    setIsLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        await syncUser(result.user);
        navigate("/login-success");
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setIsLoading(false));
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setMessage("⚠️ Please enter your email first.");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Password reset email sent. Check your inbox!");
      setSuccess(true);
    } catch (err) {
      setMessage(err.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setSuccess(false);
    if (tab !== "phone") {
      setShowOtpInput(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80" 
          alt="Cricket field background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Floating cricket balls */}
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            className="absolute rounded-full bg-white/10 border-2 border-white/20"
            style={{
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              left: `${ball.x}%`,
              top: `${ball.y}%`,
            }}
            initial={{ y: 0 }}
            animate={{
              y: [0, -20, 0, 20, 0],
              x: [0, 10, 0, -10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: ball.duration,
              delay: ball.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="relative w-full max-w-md mx-auto z-10">
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-red-500 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-green-500 opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-center relative overflow-hidden">
            <motion.div 
              className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 5, 0],
                y: [0, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -5, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.h2 
              className="text-3xl font-bold text-white relative z-10 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin ? "LOGIN TO CRICXI" : "JOIN CRICXI"}
            </motion.h2>
            <motion.p 
              className="text-white/80 text-sm mt-2 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isLogin ? "Score big with your account" : "Start your cricket journey"}
            </motion.p>
          </div>

          <div className="p-6 space-y-5">
            {/* Auth type tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => switchTab("email")}
                className={`flex-1 py-2 font-medium text-sm focus:outline-none relative ${activeTab === "email" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {isLogin ? "Email Login" : "Email Register"}
                {activeTab === "email" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                    layoutId="underline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              <button
                onClick={() => switchTab("phone")}
                className={`flex-1 py-2 font-medium text-sm focus:outline-none relative ${activeTab === "phone" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                Phone Login
                {activeTab === "phone" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                    layoutId="underline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/90"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute right-3 top-3 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </motion.div>

                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/90"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute right-3 top-3 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </motion.div>

                  {isLogin ? (
                    <motion.button
                      onClick={handleEmailLogin}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <>
                          <span>Login</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleEmailRegister}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <>
                          <span>Register</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  )}

                  <motion.div 
                    className="relative flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </motion.div>

                  <div className="space-y-3">
                    <motion.button
                      onClick={handleGoogleLogin}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_13183_10121)">
                              <path d="M20.308 10.2303C20.308 9.55056 20.2529 8.86711 20.1355 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.308 13.2728 20.308 10.2303Z" fill="#4285F4"/>
                              <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006Z" fill="#34A853"/>
                              <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169Z" fill="#FBBC04"/>
                              <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805Z" fill="#EA4335"/>
                            </g>
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={handleAnonymousLogin}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-gray-500/30 transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                          Continue as Guest
                        </>
                      )}
                    </motion.button>
                  </div>

                  <motion.div 
                    className="text-center text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isLogin ? (
                      <>
                        <p className="mb-2">
                          New to CRICXI?{" "}
                          <button 
                            onClick={toggleMode} 
                            className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors"
                          >
                            Create an account
                          </button>
                        </p>
                        <p>
                          <button 
                            onClick={forgotPassword} 
                            className="text-red-600 hover:text-red-800 font-semibold hover:underline transition-colors"
                          >
                            Forgot your password?
                          </button>
                        </p>
                      </>
                    ) : (
                      <p>
                        Already have an account?{" "}
                        <button 
                          onClick={toggleMode} 
                          className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <input
                      type="tel"
                      placeholder="Phone (+91...)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/90"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <span className="absolute right-3 top-3 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                  </motion.div>

                  {showOtpInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/90"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <span className="absolute right-3 top-3 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      <motion.button
                        onClick={verifyOtp}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          "Verify OTP"
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {!showOtpInput && (
                    <motion.button
                      onClick={sendOtp}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        "Send OTP"
                      )}
                    </motion.button>
                  )}
                  
                  <div id="recaptcha-container" className="flex justify-center mt-2"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-6 pb-4 text-center text-sm font-semibold ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              <motion.div 
                animate={success ? { 
                  scale: [1, 1.05, 1],
                  transition: { repeat: Infinity, duration: 2 }
                } : {}}
              >
                {message}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginRegister;