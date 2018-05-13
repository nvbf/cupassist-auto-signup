require("dotenv").config();
const firebase = require("firebase");

const firebaseTournamentId = 888140;
const registrerMatch = require("./run-register-tournaments");
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "beachvolleyball-scoreboard.firebaseapp.com",
  databaseURL: "https://beachvolleyball-scoreboard.firebaseio.com",
  projectId: "beachvolleyball-scoreboard",
  storageBucket: "beachvolleyball-scoreboard.appspot.com"
};

firebase.initializeApp(config);

const ref = firebase
  .database()
  .ref(`/tournament_matches/${firebaseTournamentId}/`);

async function attachedToAllLiveMatches(ref) {
  const snapshot = await ref.once("value");
  var matches = snapshot.val();
  if (!matches) {
    console.log("No matches");
  }
  matches.forEach(match => {
    if (match && !match.isFinished) {
      console.log("Monitor" + JSON.stringify(match));
      const ref = firebase
        .database()
        .ref(`/tournament_matches/${firebaseTournamentId}/${match.matchId}`);
      ref.on("value", monitor.bind(null, ref));
    }
  });
}

function monitor(ref, matchRef) {
  const updatedMatch = matchRef.val();
  if (updatedMatch && updatedMatch.isFinished) {
    console.log("matchRef", matchRef);
    const {
      scoreInCompletedSet,
      setsWonByAwayTeam,
      setsWonByHomeTeam,
      winner,
      matchId
    } = updatedMatch;
    const sets = scoreInCompletedSet.split(",");
    const splittedSets = sets.map(set => {
      const both = set.split("-").map(score => score.trim());
      return { home: both[0], away: both[1] };
    });
    console.log(splittedSets);
    registrerMatch({
      matchId,
      setHome: setsWonByHomeTeam,
      setAway: setsWonByAwayTeam,
      set1HomePoints: splittedSets[0]["home"],
      set1AwayPoints: splittedSets[0]["away"],
      set2HomePoints: splittedSets[1]["home"],
      set2AwayPoints: splittedSets[1]["away"],
      set3HomePoints: splittedSets[2] ? splittedSets[2]["home"] : 0,
      set3AwayPoints: splittedSets[2] ? splittedSets[2]["away"] : 0,
      homeTeamWon: winner === "HOMETEAM"
    });

    ref.off();
  } else {
    console.log("not finished yet", updatedMatch);
  }
}

//TODO! implement this
// ref.on("child_added", function(data) {
//   //console.log("Track new match" + JSON.stringify(data));
//   monitor(data);
// });

attachedToAllLiveMatches(ref);
