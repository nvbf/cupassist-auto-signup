require("dotenv").config();
const firebase = require("firebase");

const {
  TX_TURNERING_ID,
  TX_SHORTNAME,
  TX_PASSWORD,
  FIREBASE_API_KEY
} = process.env;

if (!FIREBASE_API_KEY || !TX_TURNERING_ID || !TX_SHORTNAME || !TX_PASSWORD) {
  console.log(
    "FIREBASE_API_KEY, TX_TURNERING_ID, TX_SHORTNAME  and TX_PASSWORD  all needs to be set as env.var"
  );
  process.exit(-1);
}

const firebaseTournamentId = 762510;
const registrerMatch = require("./register-tournaments-internal");
//https://console.firebase.google.com/u/1/project/<name>/settings/general/ -> webapikey
const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "beachvolleyball-scoreboard.firebaseapp.com",
  databaseURL: "https://beachvolleyball-scoreboard.firebaseio.com",
  projectId: "beachvolleyball-scoreboard",
  storageBucket: "beachvolleyball-scoreboard.appspot.com"
};

firebase.initializeApp(config);

const ref = firebase
  .database()
  .ref(`/tournament_matches/${firebaseTournamentId}/`);

function monitor(ref, matchRef) {
  const updatedMatch = matchRef.val();
  if (updatedMatch && updatedMatch.isFinished) {
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
    const arguments = {
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
    };
    registrerMatch(arguments);
    ref.off();
  }
}

ref.on("child_added", function(snapshot) {
  // monitor(match);
  const match = snapshot.val();
  if (match && !match.isFinished) {
    console.log("Track new match" + match.matchId);
    const ref = firebase
      .database()
      .ref(`/tournament_matches/${firebaseTournamentId}/${match.matchId}`);
    ref.on("value", monitor.bind(null, ref));
  }
});
