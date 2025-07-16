import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 sm:p-8"
        >
          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Welcome to CRICXI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fantasy cricket platform.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using our services, you agree to the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We collect various types of information to provide and improve our services to you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, payment information</li>
              <li><strong>Game Data:</strong> Teams created, contests joined, transactions, gameplay history</li>
              <li><strong>Device Information:</strong> IP address, browser type, device identifiers, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, interactions with the platform</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis to improve our services</li>
              <li>To monitor usage and detect, prevent technical issues</li>
              <li>To process transactions and send related information</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">4. Data Security</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, perform service-related services, or assist us in analyzing how our services are used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">6. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">7. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <Link to="mailto:privacy@cricxi.com" className="text-yellow-400 hover:underline">privacy@cricxi.com</Link>.
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
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;