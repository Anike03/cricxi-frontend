import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// 3D Background Component
const ThreeDBackground = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0005;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#f59e0b" />
    </>
  );
};

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ThreeDBackground />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 min-h-screen bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-black/90 text-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 sm:p-8"
          >
            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                By accessing or using the CRICXI fantasy cricket platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                2. Eligibility
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Be at least 18 years of age or the legal age of majority in your jurisdiction
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Reside in a jurisdiction where participation in fantasy sports is legal
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Not be restricted by us from using the services
                </li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                3. Account Registration
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                You must provide accurate and complete information when creating an account. You are solely responsible for maintaining the confidentiality of your account and password.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                4. Game Rules
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                All contests are governed by specific game rules that will be displayed within the application. By entering a contest, you agree to abide by these rules.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                5. Payments and Winnings
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                All entry fees must be paid in advance. Winnings will be credited to your account within 24 hours of contest completion. We reserve the right to withhold payments if fraudulent activity is suspected.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                6. User Conduct
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Use the Service for any unlawful purpose
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Create multiple accounts to gain unfair advantage
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Use automated means to interact with the Service
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Engage in any form of cheating or collusion
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2"></span>
                  Harass, threaten, or abuse other users
                </li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                7. Intellectual Property
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The Service and its original content, features, and functionality are owned by CRICXI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                8. Termination
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                9. Limitation of Liability
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                In no event shall CRICXI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the Service.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                10. Governing Law
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
              </p>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                11. Changes to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;