// src/services/cricbuzz.js
import axios from "axios";

const BASE_URL = "https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co";
const API_KEY = "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar";
const HOST = "Cricbuzz-Official-Cricket-API.allthingsdev.co";

// 🛠️ Headers factory
const makeHeaders = (endpoint) => ({
  "x-apihub-key": API_KEY,
  "x-apihub-host": HOST,
  "x-apihub-endpoint": endpoint,
});

// 📰 News
export const fetchNews = () =>
  axios.get(`${BASE_URL}/news`, {
    headers: makeHeaders("b02fb028-fcca-4590-bf04-d0cd0c331af4"),
  });

// ⚡ Live Matches
export const fetchLiveMatches = () =>
  axios.get(`${BASE_URL}/matches/live`, {
    headers: makeHeaders("e0cb5c72-38e1-435e-8bf0-6b38fbe923b7"),
  });

// ⏳ Upcoming Matches
export const fetchUpcomingMatches = () =>
  axios.get(`${BASE_URL}/matches/upcoming`, {
    headers: makeHeaders("1943a818-98e9-48ea-8d1c-1554e116ef44"),
  });

// 🔍 Search Player
export const searchPlayer = (name) =>
  axios.get(`${BASE_URL}/browse/player?search=${encodeURIComponent(name)}`, {
    headers: makeHeaders("b0242771-45ea-4c07-be42-a6da38cdec41"),
  });

// 👤 Player Info
export const fetchPlayerInfo = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}`, {
    headers: makeHeaders("a055bf38-0796-4fab-8fe3-6f042f04cdba"),
  });

// 📊 Batting Stats
export const fetchPlayerBattingStats = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}/batting`, {
    headers: makeHeaders("07a4d9b5-092e-4035-adc7-253bc3532a81"),
  });

// 🎯 Bowling Stats
export const fetchPlayerBowlingStats = (playerId) =>
  axios.get(`${BASE_URL}/browse/player/${playerId}/bowling`, {
    headers: makeHeaders("5ba067de-b9a5-446f-916b-9dfbef717211"),
  });

// 🎽 Match Squads
export const getMatchSquads = (matchId) =>
  axios.get(`${BASE_URL}/match/${matchId}/squads`, {
    headers: makeHeaders("e1d1b32d-222a-430c-8069-b3a51f8997a3"),
  });

// 🏆 Series Info
export const fetchSeriesInfo = (seriesId) =>
  axios.get(`${BASE_URL}/series/${seriesId}`, {
    headers: makeHeaders("be37c2f5-3a12-44bd-8d8b-ba779eb89279"),
  });

// 🧠 Match Info
export const fetchMatchInfo = (matchId) =>
  axios.get(`${BASE_URL}/match/${matchId}`, {
    headers: makeHeaders("ac951751-d311-4d23-8f18-353e75432353"),
  });

// 🏠 Home Page Data
export const fetchHomeData = () =>
  axios.get(`${BASE_URL}/home`, {
    headers: makeHeaders("95df5edd-bd8b-4881-a12b-1a40e519b693"),
  });

// 👥 Team Players
export const fetchTeamPlayers = (teamId) =>
  axios.get(`${BASE_URL}/team/${teamId}/players`, {
    headers: makeHeaders("2b298a5d-fb51-4e29-aa15-c5385291fcd8"),
  });

// 📋 Series Squads
export const fetchSeriesSquads = (seriesId) =>
  axios.get(`${BASE_URL}/series/${seriesId}/squads`, {
    headers: makeHeaders("038d223b-aca5-4096-8eb1-184dd0c09513"),
  });

// ✅ Upcoming Matches from your backend
export const fetchBackendUpcomingMatches = () =>
  axios.get("https://cricxi.onrender.com/api/match/upcoming");

// 🧠 Resolve internal -> cricbuzz match ID
export const getCricbuzzMatchId = (matchId) =>
  axios.get(`https://cricxi.onrender.com/api/match/${matchId}/cricbuzz-id`);

// 🎮 Fetch all contests
export const fetchContestsByMatch = () =>
  axios.get("https://cricxi.onrender.com/api/contests/all");