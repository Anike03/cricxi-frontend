import api from "./api";

export const syncFirebaseUser = async (firebaseUser) => {
  if (!firebaseUser?.uid || !firebaseUser?.email) return null;

  try {
    const payload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
    };

    const res = await api.post("/users/sync", payload);
    return res.data;
  } catch (err) {
    console.error("User sync failed:", err);
    return null;
  }
};
