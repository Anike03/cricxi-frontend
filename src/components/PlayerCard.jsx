const PlayerCard = ({ name, role, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-lg border ${
        selected ? "bg-green-600" : "bg-black/60"
      } border-gray-700`}
    >
      <h4 className="font-semibold text-white">{name}</h4>
      <p className="text-sm italic text-gray-400">{role || "Unknown Role"}</p>
    </div>
  );
};

export default PlayerCard;
