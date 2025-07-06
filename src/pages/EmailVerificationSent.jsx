import { Link } from "react-router-dom";

const EmailVerificationSent = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-800 to-purple-900 text-white px-4 text-center animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">📧 Verification Email Sent</h1>
        <p className="mb-6 text-sm text-gray-200">
          We've sent you a link to verify your email. Please check your inbox and click the link to activate your account.
        </p>
        <img src="/email-verification.svg" alt="verify email" className="w-32 mx-auto mb-4" />
        <p className="text-sm text-gray-300 mb-2">Already verified?</p>
        <Link to="/auth" className="text-blue-400 hover:underline">Login Now</Link>
      </div>
    </div>
  );
};

export default EmailVerificationSent;
