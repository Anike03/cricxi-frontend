import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore"; 
import { db } from "../services/firebase";

const CreateTeam = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const teamToEdit = location.state?.teamToEdit;
  const matchData = location.state?.matchData; 
  const { user } = useAuth();
  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);

  // Fetch squad data
  useEffect(() => {
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    // In your fetchSquad function in CreateTeam.jsx:

const fetchSquad = async () => {
  try {
    setLoading(true);
    setError(null);
    
    if (!matchData) {
      throw new Error("Match data not available");
    }

    // First try to fetch match-specific squad (works for live matches)
    try {
      const response = await axios.get(
        `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/match/${matchId}/squads`,
        {
          headers: {
            "x-apihub-key": "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar",
            "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
            "x-apihub-endpoint": "be37c2f5-3a12-44bd-8d8b-ba779eb89279"
          }
        }
      );
      
      // Format the squad data
      const formattedSquad = {
        team1: {
          team: matchData.team1,
          players: {
            "playing XI": response.data?.team1?.players?.["playing XI"]?.map(player => 
              normalizePlayer(player, matchData.team1.teamId)
            ) || [],
            bench: response.data?.team1?.players?.bench?.map(player => 
              normalizePlayer(player, matchData.team1.teamId)
            ) || []
          }
        },
        team2: {
          team: matchData.team2,
          players: {
            "playing XI": response.data?.team2?.players?.["playing XI"]?.map(player => 
              normalizePlayer(player, matchData.team2.teamId)
            ) || [],
            bench: response.data?.team2?.players?.bench?.map(player => 
              normalizePlayer(player, matchData.team2.teamId)
            ) || []
          }
        }
      };
      
      setSquad(formattedSquad);
      return;
    } catch (_matchSquadError) {
      console.log("Match squad not available, trying series squad");
    }

    // For upcoming matches, use the series squad approach
    if (matchData?.seriesId) {
      try {
        // 1. First get all squads for the series
        const seriesSquadsResponse = await axios.get(
          `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/series/${matchData.seriesId}/squads`,
          {
            headers: {
              "x-apihub-key": "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar",
              "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
              "x-apihub-endpoint": "038d223b-aca5-4096-8eb1-184dd0c09513"
            }
          }
        );

        // 2. Determine which squad type to use based on match format
        const squadType = matchData.matchFormat.includes('T20') ? 'T20' : 
                          matchData.matchFormat.includes('ODI') ? 'ODI' : 'TEST';
        
        // 3. Find the relevant squad IDs for both teams
        const team1Squad = seriesSquadsResponse.data?.squads?.find(
          s => s.teamId === matchData.team1.teamId && s.squadType?.includes(squadType)
        );
        const team2Squad = seriesSquadsResponse.data?.squads?.find(
          s => s.teamId === matchData.team2.teamId && s.squadType?.includes(squadType)
        );

        if (!team1Squad || !team2Squad) {
          throw new Error("Could not find squads for both teams");
        }

        // 4. Fetch both team squads in parallel
        const [team1Response, team2Response] = await Promise.all([
          axios.get(
            `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/series/${matchData.seriesId}/squads/${team1Squad.squadId}`,
            {
              headers: {
                "x-apihub-key": "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar",
                "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
                "x-apihub-endpoint": "c4b3ccd2-0bb1-4d94-98c9-b31f389480be"
              }
            }
          ),
          axios.get(
            `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/series/${matchData.seriesId}/squads/${team2Squad.squadId}`,
            {
              headers: {
                "x-apihub-key": "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar",
                "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
                "x-apihub-endpoint": "c4b3ccd2-0bb1-4d94-98c9-b31f389480be"
              }
            }
          )
        ]);

        // 5. Format the squad data
        const formattedSquad = {
          team1: {
            team: matchData.team1,
            players: {
              "playing XI": team1Response.data?.players?.map(player => 
                normalizePlayer(player, matchData.team1.teamId)
              ) || [],
              bench: [] // Empty bench for series squad
            }
          },
          team2: {
            team: matchData.team2,
            players: {
              "playing XI": team2Response.data?.players?.map(player => 
                normalizePlayer(player, matchData.team2.teamId)
              ) || [],
              bench: [] // Empty bench for series squad
            }
          }
        };

        setSquad(formattedSquad);
        return;
      } catch (seriesError) {
        console.error("Error fetching series squad:", seriesError);
        
        // Fallback to match info if available
        try {
          const matchInfoResponse = await axios.get(
            `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/match/${matchId}`,
            {
              headers: {
                "x-apihub-key": "T7-xiJYNyjX581-Zl-84gr4Z8hXo6H8Z7Ci9LeYd6E0fYJKqar",
                "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
                "x-apihub-endpoint": "ac951751-d311-4d23-8f18-353e75432353"
              }
            }
          );

          const matchInfo = matchInfoResponse.data?.matchInfo;
          if (!matchInfo) throw new Error("No match info found");
          
          const formattedSquad = {
            team1: {
              team: matchData.team1,
              players: {
                "playing XI": matchInfo.team1?.playerDetails
                  ?.filter(p => !p.substitute)
                  ?.map(player => normalizePlayer(player, matchData.team1.teamId)) || [],
                bench: matchInfo.team1?.playerDetails
                  ?.filter(p => p.substitute)
                  ?.map(player => normalizePlayer(player, matchData.team1.teamId)) || []
              }
            },
            team2: {
              team: matchData.team2,
              players: {
                "playing XI": matchInfo.team2?.playerDetails
                  ?.filter(p => !p.substitute)
                  ?.map(player => normalizePlayer(player, matchData.team2.teamId)) || [],
                bench: matchInfo.team2?.playerDetails
                  ?.filter(p => p.substitute)
                  ?.map(player => normalizePlayer(player, matchData.team2.teamId)) || []
              }
            }
          };

          setSquad(formattedSquad);
          return;
        } catch (matchInfoError) {
          console.error("Error fetching match info:", matchInfoError);
          throw new Error("Could not fetch squad from match info");
        }
      }
    }

    // If no squad available at all
    throw new Error("Squad information not yet available for this match");
    
  } catch (err) {
    console.error("Error fetching squad:", err);
    setError(err.message || "Failed to load squad data. Please try again later.");
    setSquad(null);
  } finally {
    setLoading(false);
  }
};


































    fetchSquad();
  }, [matchId, matchData]);

  // Helper function to normalize player data from different API responses
  const normalizePlayer = (player, teamId) => {
    // Handle different API response structures
    const playerId = player.id || player.playerId;
    const fullName = player.fullName || player.name;
    const name = player.name || player.fullName;
    const role = player.role || player.type || "Player";
    
    return {
      id: playerId,
      name: name,
      fullName: fullName,
      role: role,
      teamId: teamId,
      captain: player.captain || false,
      keeper: player.keeper || role.includes('WK') || false,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle
    };
  };

  // Handle player selection
  const togglePlayerSelection = (player) => {
    if (selectedPlayers.some(p => p.id === player.id)) {
      // Remove player if already selected
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      if (captainId === player.id) setCaptainId(null);
      if (viceCaptainId === player.id) setViceCaptainId(null);
    } else if (selectedPlayers.length < 11) {
      // Add player if less than 11 selected
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Check if team is valid (11 players, 1 captain, 1 vice-captain)
  const isTeamValid = () => {
    const hasValidRoles = 
      countPlayersByRole('Batter') >= 1 &&
      (countPlayersByRole('WK') >= 1 || countPlayersByRole('WK-Batter') >= 1) &&
      countPlayersByRole('Allrounder') >= 1 &&
      countPlayersByRole('Bowler') >= 3;
    
    return selectedPlayers.length === 11 && 
           captainId && 
           viceCaptainId && 
           teamName.trim() &&
           hasValidRoles;
  };

  // Count players by role
  const countPlayersByRole = (role) => {
    return selectedPlayers.filter(p => p.role.includes(role)).length;
  };

  // Count players by team
  const countPlayersByTeam = (teamId) => {
    return selectedPlayers.filter(p => p.teamId === teamId).length;
  };










  // Submit team
const handleSubmit = async () => {
    if (!isTeamValid() || !user) return;
    setLoading(true);

    const teamData = {
      uid: user.uid,
      email: user.email,
      matchId,
      teamName,
      players: selectedPlayers.map(player => ({
        id: player.id,
        name: player.name,
        role: player.role,
        teamId: player.teamId,
        isCaptain: player.id === captainId,
        isViceCaptain: player.id === viceCaptainId
      })),
      matchMeta: matchData,
      updatedAt: new Date()
    };

    // In the handleSubmit function, replace the success handling with:
try {
  if (teamToEdit?.id) {
    await updateDoc(doc(db, "fantasyTeams", teamToEdit.id), teamData);
    alert("Team updated successfully!");
  } else {
    await addDoc(collection(db, "fantasyTeams"), {
      ...teamData,
      createdAt: new Date()
    });
  }
  
  // Navigate with state to trigger success message
  navigate("/my-teams", { 
    state: { teamCreated: true } 
  });
} catch (err) {
  console.error("Error saving team:", err);
  alert("Failed to save team. Please try again.");
} finally {
  setLoading(false);
}
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-red-900/50 rounded-lg max-w-md">
          <h3 className="text-xl font-bold mb-2">Error Loading Squad</h3>
          <p className="mb-4">{error}</p>
          <Link 
            to="/matches" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-gray-800/50 rounded-lg max-w-md">
          <h3 className="text-xl font-bold mb-2">No Squad Available</h3>
          <p className="mb-4">Squad information is not available for this match yet.</p>
          <Link 
            to="/matches" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            CREATE YOUR TEAM
          </h1>
          <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-transparent w-1/2 mx-auto mb-4"></div>
          
          {/* Team name input */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              maxLength={30}
            />
          </div>
        </div>

        {/* Team selection summary */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Selected Players: {selectedPlayers.length}/11
            </h2>
            {selectedPlayers.length > 0 && (
              <button 
                onClick={() => {
                  setSelectedPlayers([]);
                  setCaptainId(null);
                  setViceCaptainId(null);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear Team
              </button>
            )}
          </div>

          {/* Team distribution */}
          <div className="flex justify-between mb-4 text-sm">
            <div>
              {squad.team1.team.teamSName || squad.team1.team.teamName}: {countPlayersByTeam(squad.team1.team.teamId)}
            </div>
            <div>
              {squad.team2.team.teamSName || squad.team2.team.teamName}: {countPlayersByTeam(squad.team2.team.teamId)}
            </div>
          </div>

          {/* Role constraints */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className={`p-2 rounded text-center ${countPlayersByRole('Batter') >= 1 ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              Batters: {countPlayersByRole('Batter')} (Min 1)
            </div>
            <div className={`p-2 rounded text-center ${(countPlayersByRole('WK') + countPlayersByRole('WK-Batter')) >= 1 ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              WK: {countPlayersByRole('WK') + countPlayersByRole('WK-Batter')} (Min 1)
            </div>
            <div className={`p-2 rounded text-center ${countPlayersByRole('Allrounder') >= 1 ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              Allrounders: {countPlayersByRole('Allrounder')} (Min 1)
            </div>
            <div className={`p-2 rounded text-center ${countPlayersByRole('Bowler') >= 3 ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              Bowlers: {countPlayersByRole('Bowler')} (Min 3)
            </div>
          </div>

          {/* Selected players list */}
          {selectedPlayers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {selectedPlayers.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${
                    player.id === captainId 
                      ? 'border-yellow-500 bg-yellow-900/20' 
                      : player.id === viceCaptainId 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-gray-700'
                  } bg-gray-700/30`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium truncate">{player.name}</span>
                    <span className="text-xs bg-gray-600 px-1 rounded">{player.role}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCaptainId(player.id === captainId ? null : player.id);
                        if (player.id === viceCaptainId) setViceCaptainId(null);
                      }}
                      className={`px-2 py-1 rounded ${
                        player.id === captainId 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      C
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViceCaptainId(player.id === viceCaptainId ? null : player.id);
                        if (player.id === captainId) setCaptainId(null);
                      }}
                      className={`px-2 py-1 rounded ${
                        player.id === viceCaptainId 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      VC
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              Select players from the squads below
            </div>
          )}
        </div>

        {/* Teams and squads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team 1 */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">
                {squad.team1.team.teamSName || squad.team1.team.teamName}
              </h2>
              <span className="ml-auto text-sm bg-blue-500 px-2 py-1 rounded">
                {countPlayersByTeam(squad.team1.team.teamId)} selected
              </span>
            </div>

            <h3 className="font-medium mb-2 text-yellow-400">Playing XI</h3>
            <div className="grid grid-cols-1 gap-2">
              {squad.team1.players["playing XI"].map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => togglePlayerSelection(player)}
                  className={`p-2 rounded-lg cursor-pointer flex items-center ${
                    selectedPlayers.some(p => p.id === player.id) 
                      ? 'bg-green-900/50' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{player.name}</div>
                    <div className="text-xs text-gray-300">{player.role}</div>
                  </div>
                  {player.captain && (
                    <span className="ml-2 text-xs bg-yellow-600 px-1 rounded">CAP</span>
                  )}
                  {player.keeper && (
                    <span className="ml-2 text-xs bg-blue-600 px-1 rounded">WK</span>
                  )}
                </motion.div>
              ))}
            </div>

            {squad.team1.players.bench.length > 0 && (
              <>
                <h3 className="font-medium mb-2 mt-4 text-yellow-400">Bench</h3>
                <div className="grid grid-cols-1 gap-2">
                  {squad.team1.players.bench.map((player) => (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => togglePlayerSelection(player)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center ${
                        selectedPlayers.some(p => p.id === player.id) 
                          ? 'bg-green-900/50' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{player.name}</div>
                        <div className="text-xs text-gray-300">{player.role}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Team 2 */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">
                {squad.team2.team.teamSName || squad.team2.team.teamName}
              </h2>
              <span className="ml-auto text-sm bg-blue-500 px-2 py-1 rounded">
                {countPlayersByTeam(squad.team2.team.teamId)} selected
              </span>
            </div>

            <h3 className="font-medium mb-2 text-yellow-400">Playing XI</h3>
            <div className="grid grid-cols-1 gap-2">
              {squad.team2.players["playing XI"].map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => togglePlayerSelection(player)}
                  className={`p-2 rounded-lg cursor-pointer flex items-center ${
                    selectedPlayers.some(p => p.id === player.id) 
                      ? 'bg-green-900/50' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{player.name}</div>
                    <div className="text-xs text-gray-300">{player.role}</div>
                  </div>
                  {player.captain && (
                    <span className="ml-2 text-xs bg-yellow-600 px-1 rounded">CAP</span>
                  )}
                  {player.keeper && (
                    <span className="ml-2 text-xs bg-blue-600 px-1 rounded">WK</span>
                  )}
                </motion.div>
              ))}
            </div>

            {squad.team2.players.bench.length > 0 && (
              <>
                <h3 className="font-medium mb-2 mt-4 text-yellow-400">Bench</h3>
                <div className="grid grid-cols-1 gap-2">
                  {squad.team2.players.bench.map((player) => (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => togglePlayerSelection(player)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center ${
                        selectedPlayers.some(p => p.id === player.id) 
                          ? 'bg-green-900/50' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{player.name}</div>
                        <div className="text-xs text-gray-300">{player.role}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm p-4 border-t border-gray-700">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-300">
                Players: {selectedPlayers.length}/11
              </div>
              <div className="text-sm text-gray-300">
                {captainId ? "Captain selected" : "Select captain"}
                {viceCaptainId ? ", Vice-captain selected" : ", Select vice-captain"}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isTeamValid()}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                isTeamValid() 
                  ? 'bg-yellow-600 hover:bg-yellow-500' 
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {isTeamValid() ? 'SAVE TEAM' : 'SELECT 11 PLAYERS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;