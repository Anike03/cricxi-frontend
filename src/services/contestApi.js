import api from "./api";

// Get user balance by UID (with fallback to email)
export const getUserBalance = async (uid, email) => {
  try {
    const res = await api.get(`/users/${uid}/balance`);
    return res.data.balance;
  } catch (err) {
    console.warn("Primary balance fetch failed, trying email fallback:", err);
    if (email) {
      try {
        const emailRes = await api.get(`/users/get-by-email?email=${email}`);
        return emailRes.data.walletBalance || 0;
      } catch (emailErr) {
        console.error("Email fallback also failed:", emailErr);
        return 0;
      }
    }
    return 0;
  }
};

// Deduct balance
export const deductBalance = async (userId, amount, description) => {
  const payload = { userId, amount, description };
  try {
    const res = await api.post("/users/deduct-balance", payload);
    return res.data; // { success: true, newBalance: number }
  } catch (err) {
    console.error("Deduct balance error:", err);
    throw err;
  }
};

// Join contest
export const joinContest = async (contestId, userId, teamId, entryFee) => {
  const payload = { contestId, userId, teamId, entryFee };
  try {
    const res = await api.post("/contests/join", payload);
    return res.data; // { success: true, message: "..." }
  } catch (err) {
    console.error("Join contest error:", err);
    throw err;
  }
};

// Get contest details
export const getContestById = async (contestId) => {
  try {
    const res = await api.get(`/contests/${contestId}`);
    return res.data;
  } catch (err) {
    console.error("Get contest details error:", err);
    throw err;
  }
};
