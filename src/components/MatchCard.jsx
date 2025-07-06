import { Link } from "react-router-dom";

const MatchCard = ({ match }) => {
  const { team1, team2, matchDesc, status, matchId } = match;

  return (
    <div className="bg-black/70 text-white p-4 rounded-lg shadow-md border border-gray-600">
      <h2 className="text-yellow-400 font-semibold mb-2">{matchDesc}</h2>
      <div className="flex justify-between mb-2">
        <p>{team1?.teamName}</p>
        <p>vs</p>
        <p>{team2?.teamName}</p>
      </div>
      <p className="text-sm text-green-400 italic mb-2">{status}</p>
      <Link
        to={`/create-team/${matchId}`}
        className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Create Team
      </Link>
    </div>
  );
};

export default MatchCard;
