// services/fantasyPoints.js
export const calculateFantasyPoints = (scorecard, fantasyTeam) => {
  if (!scorecard || !fantasyTeam) return 0;

  const points = {
    run: 1,
    boundary: 1,
    six: 2,
    wicket: 25,
    catch: 8,
    runOutStumping: 8,
    maidenOver: 12,
    duck: -4
  };

  let totalPoints = 0;
  const playerPoints = {};

  // Process batting points
  scorecard.scoreCard.forEach(innings => {
    innings.batTeamDetails.batsmenData.forEach(batsman => {
      const player = fantasyTeam.players.find(p => p.id === batsman.batId);
      if (player) {
        let playerPoint = 0;
        
        // Batting points
        playerPoint += batsman.runs * points.run;
        playerPoint += batsman.fours * points.boundary;
        playerPoint += batsman.sixes * points.six;
        
        // Duck out
        if (batsman.runs === 0 && batsman.outDesc) {
          playerPoint += points.duck;
        }

        // Captain/vice-captain multiplier
        if (player.isCaptain) {
          playerPoint *= 2;
        } else if (player.isViceCaptain) {
          playerPoint *= 1.5;
        }

        playerPoints[batsman.batId] = (playerPoints[batsman.batId] || 0) + playerPoint;
      }
    });

    // Process bowling points
    innings.bowlTeamDetails.bowlersData.forEach(bowler => {
      const player = fantasyTeam.players.find(p => p.id === bowler.bowlerId);
      if (player) {
        let playerPoint = 0;
        
        // Bowling points
        playerPoint += bowler.wickets * points.wicket;
        
        // Maiden over
        if (bowler.maidens > 0) {
          playerPoint += bowler.maidens * points.maidenOver;
        }

        // Captain/vice-captain multiplier
        if (player.isCaptain) {
          playerPoint *= 2;
        } else if (player.isViceCaptain) {
          playerPoint *= 1.5;
        }

        playerPoints[bowler.bowlerId] = (playerPoints[bowler.bowlerId] || 0) + playerPoint;
      }
    });

    // Process fielding points (catches)
    innings.batTeamDetails.batsmenData.forEach(batsman => {
      if (batsman.wicketCode === "CAUGHT" && batsman.fielderId1) {
        const fielder = fantasyTeam.players.find(p => p.id === batsman.fielderId1);
        if (fielder) {
          let playerPoint = points.catch;
          
          if (fielder.isCaptain) {
            playerPoint *= 2;
          } else if (fielder.isViceCaptain) {
            playerPoint *= 1.5;
          }

          playerPoints[batsman.fielderId1] = (playerPoints[batsman.fielderId1] || 0) + playerPoint;
        }
      }
    });
  });

  // Sum all player points
  totalPoints = Object.values(playerPoints).reduce((sum, points) => sum + points, 0);

  return totalPoints;
};