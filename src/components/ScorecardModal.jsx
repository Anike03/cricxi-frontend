// src/components/ScorecardModal.jsx
import React from "react";

const ScorecardModal = ({ scorecardData, onClose }) => {
  if (!scorecardData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-6">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 border border-green-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Match Scorecard</h2>

        {scorecardData?.scoreCard?.map((innings, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Inning {innings.inningsId}: {innings.batTeamDetails.batTeamName}
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Total: {innings.scoreDetails.runs}/{innings.scoreDetails.wickets} in {innings.scoreDetails.overs} overs
            </p>

            {/* Batting Table */}
            <h4 className="text-lg text-yellow-300 mt-4 mb-2">Batting</h4>
            <table className="w-full mb-4 text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="text-left p-2">Name</th>
                  <th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>How Out</th>
                </tr>
              </thead>
              <tbody>
                {innings.batTeamDetails.batsmenData.map((bat, i) => (
                  <tr key={i} className="border-b border-gray-800 text-gray-400">
                    <td className="p-2">{bat.batName}</td>
                    <td>{bat.runs}</td>
                    <td>{bat.balls}</td>
                    <td>{bat.fours}</td>
                    <td>{bat.sixes}</td>
                    <td>{bat.strikeRate}</td>
                    <td>{bat.outDesc || "Not Out"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bowling Table */}
            <h4 className="text-lg text-blue-300 mt-4 mb-2">Bowling</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="text-left p-2">Name</th>
                  <th>O</th><th>R</th><th>W</th><th>Eco</th>
                </tr>
              </thead>
              <tbody>
                {innings.bowlTeamDetails.bowlersData.map((bowl, i) => (
                  <tr key={i} className="border-b border-gray-800 text-gray-400">
                    <td className="p-2">{bowl.bowlName}</td>
                    <td>{bowl.overs}</td>
                    <td>{bowl.runs}</td>
                    <td>{bowl.wickets}</td>
                    <td>{bowl.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardModal;
