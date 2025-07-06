const Rules = () => {
  const rules = [
    { action: "Run scored", points: "+1" },
    { action: "Boundary bonus", points: "+1" },
    { action: "Six bonus", points: "+2" },
    { action: "Half-century bonus", points: "+4" },
    { action: "Century bonus", points: "+8" },
    { action: "Wicket (excluding run-out)", points: "+25" },
    { action: "4 Wickets Bonus", points: "+4" },
    { action: "5 Wickets Bonus", points: "+8" },
    { action: "Catch Taken", points: "+8" },
    { action: "Stumping/Run-out", points: "+12" },
    { action: "Duck (dismissed for 0)", points: "-2" },
  ];

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center py-10 px-6 text-white">
      <div className="max-w-2xl mx-auto bg-black/80 backdrop-blur p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">📘 Fantasy Rules</h1>

        <p className="text-gray-300 mb-4">
          Here’s how your players will score points in each match:
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="border border-gray-600 p-3 text-left">Action</th>
              <th className="border border-gray-600 p-3 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <td className="border border-gray-600 p-3">{rule.action}</td>
                <td className="border border-gray-600 p-3">{rule.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rules;
