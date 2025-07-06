const NewsCard = ({ story }) => {
  const { headline, intro, context, imageId } = story;

  return (
    <div className="bg-black/70 text-white p-4 rounded-lg shadow-md border border-gray-600">
      <img
        src={`https://www.cricbuzz.com/a/img/v1/600x400/${imageId}.jpg`}
        alt={headline}
        className="rounded mb-3"
      />
      <h3 className="text-yellow-400 font-bold mb-2">{headline}</h3>
      {intro && <p className="text-sm text-gray-300">{intro}</p>}
      {context && <p className="text-xs italic text-gray-500 mt-1">{context}</p>}
    </div>
  );
};

export default NewsCard;
