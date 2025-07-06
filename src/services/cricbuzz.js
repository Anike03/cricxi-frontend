import axios from "axios";

const BASE_URL = "https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co";
const API_KEY = "0xc-jxss85b5MB0wi23amN3C8oziUlPmH9jQyMJFepB4RaOPb1";
const HOST = "Cricbuzz-Official-Cricket-API.allthingsdev.co";

const makeHeaders = (endpoint) => ({
  "x-apihub-key": API_KEY,
  "x-apihub-host": HOST,
  "x-apihub-endpoint": endpoint,
});

// 📰 News
export const fetchNews = () =>
  axios.get(`${BASE_URL}/news`, { headers: makeHeaders("b02fb028-fcca-4590-bf04-d0cd0c331af4") });

// ⚡ Live Matches
export const fetchLiveMatches = () =>
  axios.get(`${BASE_URL}/matches/live`, { headers: makeHeaders("e0cb5c72-38e1-435e-8bf0-6b38fbe923b7") });

// 🔎 Search Player
export const searchPlayer = (name) =>
  axios.get(`${BASE_URL}/browse/player?search=${encodeURIComponent(name)}`, { 
    headers: makeHeaders("b0242771-45ea-4c07-be42-a6da38cdec41") 
  });

// 📊 Get Player Info
export const fetchPlayerInfo = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}`, {
    headers: makeHeaders("a055bf38-0796-4fab-8fe3-6f042f04cdba")
  });

// 🏏 Get Player Batting Stats
export const fetchPlayerBattingStats = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}/batting`, {
    headers: makeHeaders("07a4d9b5-092e-4035-adc7-253bc3532a81")
  });

// 🎯 Get Player Bowling Stats
export const fetchPlayerBowlingStats = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}/bowling`, {
    headers: makeHeaders("5ba067de-b9a5-446f-916b-9dfbef717211")
  });



  
// ✅ Admin-defined Matches (from your own backend)
export const fetchBackendUpcomingMatches = () =>
  axios.get("https://cricxi.onrender.com/api/match/upcoming");

export const fetchContestsByMatch = () =>
  axios.get("https://cricxi.onrender.com/api/contests/all");