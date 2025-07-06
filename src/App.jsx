// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Contests from "./pages/Contests";
import CreateTeam from "./pages/CreateTeam";
import Profile from "./pages/Profile";
import Rules from "./pages/Rules";
import Leaderboard from "./pages/Leaderboard";
import LoginRegister from "./pages/LoginRegister";
import EmailVerificationSent from "./pages/EmailVerificationSent";
import LoginSuccess from "./pages/LoginSuccess";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hideLayout = location.pathname === "/email-verification";

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading...</div>;

  // 🔒 Not logged in → allow only auth or email verification page
  if (
    !user &&
    !["/auth", "/email-verification"].includes(location.pathname)
  ) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 🔒 Logged in but not verified → force to verification page
  if (
    user &&
    !user.emailVerified &&
    location.pathname !== "/email-verification"
  ) {
    return <Navigate to="/email-verification" replace />;
  }

  // ✅ After verified login → force to LoginSuccess once
  if (
    user &&
    user.emailVerified &&
    location.pathname === "/auth"
  ) {
    return <Navigate to="/login-success" replace />;
  }

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Open routes */}
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/email-verification" element={<EmailVerificationSent />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          {/* Protected (verified only) */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/contests/:matchId" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
          <Route path="/create-team/:matchId" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
