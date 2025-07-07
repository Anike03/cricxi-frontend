import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const CreateTeam = () => {
  const { matchId } = useParams(); // Cricbuzz match ID used to fetch squad
  const internalId = new URLSearchParams(window.location.search).get('internalId'); // MongoDB match ID for saving
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;


  // State
  const [squad, setSquad] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch squad data from Cricbuzz API
  useEffect(() => {
    const fetchSquad = async () => {
      try {
        setLoading(true);
        setError('');
        console.log(`Fetching squad for matchId: ${matchId}`);

        const response = await axios.get(
          `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/match/${matchId}/squads`,
          {
            headers: {
              'x-apihub-key': 'Ep4-fJnRh4dtxTMUGIEoofzyBprqNun3DeI0n7OjYqyOhSCE3H',
              'x-apihub-host': 'Cricbuzz-Official-Cricket-API.allthingsdev.co',
              'x-apihub-endpoint': 'be37c2f5-3a12-44bd-8d8b-ba779eb89279'
            }
          }
        );

        console.log('Squad API response:', response.data);

        if (!response.data.team1 || !response.data.team2) {
          setError('Squad data not yet available for this match.');
          return;
        }

        const team1Players = response.data.team1.players["playing XI"].concat(response.data.team1.players.bench || []);
        const team2Players = response.data.team2.players["playing XI"].concat(response.data.team2.players.bench || []);

        setSquad([
          ...team1Players.map(p => ({ ...p, team: 'TEAM_A' })),
          ...team2Players.map(p => ({ ...p, team: 'TEAM_B' }))
        ]);
      } catch (err) {
        setError(`Failed to load squad: ${err.message}`);
        console.error('Error details:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchSquad();
  }, [matchId]);

  // Toggle player selection
  const togglePlayer = (player) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    
    if (isSelected) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
      if (captainId === player.id) setCaptainId(null);
      if (viceCaptainId === player.id) setViceCaptainId(null);
    } else {
      // Validate before adding
      if (selectedPlayers.length >= 11) {
        setError('Maximum 11 players allowed');
        return;
      }

      // Check team balance (max 7 from one team)
      const teamCount = selectedPlayers.filter(p => p.team === player.team).length;
      if (teamCount >= 7) {
        setError(`Maximum 7 players from ${player.team === 'TEAM_A' ? 'Team A' : 'Team B'}`);
        return;
      }

      setSelectedPlayers(prev => [...prev, player]);
      setError('');
    }
  };

  // Submit team to backend
  const handleSubmit = async () => {
    if (selectedPlayers.length !== 11) {
      setError('Please select exactly 11 players');
      return;
    }

    if (!captainId || !viceCaptainId) {
      setError('Please select captain and vice-captain');
      return;
    }

    if (!isRoleValid()) {
      setError('Please ensure your team meets the role requirements');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = await user.getIdToken();
      const response = await axios.post(
        'https://cricxi.onrender.com/api/team/create',
        {
          matchId: internalId || matchId,
          teamName: teamName || `My Team ${new Date().toLocaleTimeString()}`,
          players: selectedPlayers.map(p => ({
            playerId: p.id,
            name: p.name,
            role: p.role,
            team: p.team,
            isCaptain: p.id === captainId,
            isViceCaptain: p.id === viceCaptainId
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Team created successfully:', response.data);
      setSuccess('Team created successfully!');
      setTimeout(() => navigate(`/contests/${matchId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save team');
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  // Role counts for validation
  const roleCounts = {
    'WK-Batter': selectedPlayers.filter(p => p.role === 'WK-Batter').length,
    'Batter': selectedPlayers.filter(p => p.role === 'Batter').length,
    'Bowling Allrounder': selectedPlayers.filter(p => p.role === 'Bowling Allrounder').length,
    'Bowler': selectedPlayers.filter(p => p.role === 'Bowler').length
  };

  // Check if role constraints are met
  const isRoleValid = () => {
    return (
      roleCounts['WK-Batter'] >= 1 && roleCounts['WK-Batter'] <= 4 &&
      roleCounts['Batter'] >= 3 && roleCounts['Batter'] <= 5 &&
      roleCounts['Bowling Allrounder'] >= 1 && roleCounts['Bowling Allrounder'] <= 3 &&
      roleCounts['Bowler'] >= 3 && roleCounts['Bowler'] <= 5
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Team for Match {matchId}</h1>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

      {loading && squad.length === 0 ? (
        <div className="text-center py-4">Loading squad data...</div>
      ) : squad.length === 0 ? (
        <div className="text-center py-4">
          No squad data available yet. Please check back closer to the match time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player Selection */}
          <div className="md:col-span-2 bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Select Players ({selectedPlayers.length}/11)</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Team Composition Rules</h3>
              <ul className="text-sm space-y-1">
                <li>Total Players: 11</li>
                <li>Maximum 7 players from one team</li>
                <li>WK-Batter: 1-4 (Current: {roleCounts['WK-Batter']})</li>
                <li>Batter: 3-5 (Current: {roleCounts['Batter']})</li>
                <li>Allrounder: 1-3 (Current: {roleCounts['Bowling Allrounder']})</li>
                <li>Bowler: 3-5 (Current: {roleCounts['Bowler']})</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {squad.map(player => (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player)}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedPlayers.some(p => p.id === player.id)
                      ? player.id === captainId
                        ? 'bg-yellow-100 border-yellow-500'
                        : player.id === viceCaptainId
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-green-100 border-green-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium">{player.name}</h3>
                  <p className="text-sm text-gray-600">{player.role} • {player.team === 'TEAM_A' ? 'Team A' : 'Team B'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Summary */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Your Team</h2>
            
            {selectedPlayers.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Captain</label>
                    <select
                      value={captainId || ''}
                      onChange={(e) => setCaptainId(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Captain</option>
                      {selectedPlayers.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Vice Captain</label>
                    <select
                      value={viceCaptainId || ''}
                      onChange={(e) => setViceCaptainId(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Vice Captain</option>
                      {selectedPlayers
                        .filter(p => p.id !== captainId)
                        .map(player => (
                          <option key={player.id} value={player.id}>
                            {player.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Team Composition</h3>
                  <ul className="text-sm space-y-1">
                    <li className={roleCounts['WK-Batter'] < 1 || roleCounts['WK-Batter'] > 4 ? 'text-red-500' : ''}>
                      WK-Batter: {roleCounts['WK-Batter']} (1-4)
                    </li>
                    <li className={roleCounts['Batter'] < 3 || roleCounts['Batter'] > 5 ? 'text-red-500' : ''}>
                      Batter: {roleCounts['Batter']} (3-5)
                    </li>
                    <li className={roleCounts['Bowling Allrounder'] < 1 || roleCounts['Bowling Allrounder'] > 3 ? 'text-red-500' : ''}>
                      Allrounder: {roleCounts['Bowling Allrounder']} (1-3)
                    </li>
                    <li className={roleCounts['Bowler'] < 3 || roleCounts['Bowler'] > 5 ? 'text-red-500' : ''}>
                      Bowler: {roleCounts['Bowler']} (3-5)
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Selected Players</h3>
                  <ul className="text-sm space-y-1 max-h-60 overflow-y-auto">
                    {selectedPlayers.map(player => (
                      <li key={player.id} className="flex justify-between items-center">
                        <span>
                          {player.name} 
                          {player.id === captainId && ' (C)'}
                          {player.id === viceCaptainId && ' (VC)'}
                        </span>
                        <span className="text-gray-500">{player.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedPlayers.length !== 11 || !isRoleValid() || !captainId || !viceCaptainId}
                  className={`w-full py-2 rounded font-medium ${
                    selectedPlayers.length === 11 && isRoleValid() && captainId && viceCaptainId
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Saving...' : 'Submit Team'}
                </button>
              </>
            ) : (
              <p className="text-gray-500">Select players from the left panel</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTeam;