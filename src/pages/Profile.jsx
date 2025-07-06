import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

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

  if (loading) return <div className="text-white text-center p-8">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  const isBanned =
    userData.isBannedUntil && new Date(userData.isBannedUntil) > new Date();

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center text-white px-6 py-10">
      <div className="max-w-xl mx-auto bg-black/70 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">My Profile</h1>

        <div className="space-y-3">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Wallet Balance:</strong> ₹{userData.walletBalance.toFixed(2)}</p>
          <p>
            <strong>Status:</strong>{" "}
            {isBanned ? (
              <span className="text-red-400">
                Banned until {new Date(userData.isBannedUntil).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-green-400">Active</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
