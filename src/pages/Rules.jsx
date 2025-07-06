import React from 'react';

function Rules() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <h1 className="text-2xl font-bold mb-4">📜 CricXI Fantasy Rules</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🧠 Team Formation</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>You must create a team of exactly 11 players.</li>
          <li>You can select players from both teams.</li>
          <li>You cannot select more than 7 players from one team.</li>
          <li>Choose a Captain (2x points) and Vice Captain (1.5x points).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📊 Points System</h2>
        <table className="w-full text-left border text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-2 border">Event</th>
              <th className="p-2 border">Points</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr><td className="p-2 border">Run scored</td><td className="p-2 border">+1</td></tr>
            <tr><td className="p-2 border">Boundary (4s)</td><td className="p-2 border">+1</td></tr>
            <tr><td className="p-2 border">Six (6s)</td><td className="p-2 border">+2</td></tr>
            <tr><td className="p-2 border">Wicket (excluding run-out)</td><td className="p-2 border">+25</td></tr>
            <tr><td className="p-2 border">Run-out / Stumping</td><td className="p-2 border">+8</td></tr>
            <tr><td className="p-2 border">Catch</td><td className="p-2 border">+8</td></tr>
            <tr><td className="p-2 border">Maiden over</td><td className="p-2 border">+12</td></tr>
            <tr><td className="p-2 border">Duck (batsmen only)</td><td className="p-2 border">-4</td></tr>
            <tr><td className="p-2 border">Captain multiplier</td><td className="p-2 border">x2</td></tr>
            <tr><td className="p-2 border">Vice Captain multiplier</td><td className="p-2 border">x1.5</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">⚠️ Notes</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Only starting XI players earn points. No points for bench players.</li>
          <li>Points will be updated live as the match progresses.</li>
          <li>In case of tie in leaderboard, prize is split equally.</li>
        </ul>
      </section>
    </div>
  );
}

export default Rules;
