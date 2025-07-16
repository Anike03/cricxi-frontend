// services/fantasyCalculator.js
export const calculateFantasyPoints = (player, matchData, isCaptain = false, isViceCaptain = false) => {
  let points = 0;
  const battingPoints = calculateBattingPoints(player);
  const bowlingPoints = calculateBowlingPoints(player);
  const fieldingPoints = calculateFieldingPoints(player);
  
  points = battingPoints + bowlingPoints + fieldingPoints;
  
  // Apply multipliers
  if (isCaptain) points *= 2;
  if (isViceCaptain) points *= 1.5;
  
  return points;
};

const calculateBattingPoints = (player) => {
  let points = 0;
  // Runs
  points += player.runs;
  // Boundary bonus
  points += player.fours * 1;
  points += player.sixes * 2;
  // Half-century/century bonus
  if (player.runs >= 50) points += 8;
  if (player.runs >= 100) points += 16;
  // Strike rate bonus (for min 10 balls faced)
  if (player.balls >= 10) {
    const sr = (player.runs / player.balls) * 100;
    if (sr > 170) points += 6;
    else if (sr > 150) points += 4;
    else if (sr > 130) points += 2;
  }
  // Dismissal penalty
  if (player.outDesc && player.outDesc !== "not out") points -= 2;
  
  return points;
};

const calculateBowlingPoints = (player) => {
  let points = 0;
  // Wickets
  points += player.wickets * 25;
  // 3+ wicket haul
  if (player.wickets >= 3) points += 8;
  // 5+ wicket haul
  if (player.wickets >= 5) points += 16;
  // Economy rate (for min 2 overs bowled)
  if (player.overs >= 2) {
    const economy = player.runs / player.overs;
    if (economy < 5) points += 6;
    else if (economy < 6) points += 4;
    else if (economy < 7) points += 2;
  }
  // Maiden over
  points += player.maidens * 12;
  
  return points;
};

const calculateFieldingPoints = (player) => {
  let points = 0;
  // Catch
  points += player.catches * 8;
  // Stumping/Run out
  points += player.stumpings * 12;
  points += player.runOuts * 6;
  
  return points;
};