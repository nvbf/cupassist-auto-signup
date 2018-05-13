const nwrun = require("nwrun");

const profixioTurneringsId = 23590;
const shortName = "rt_master_oslo_18";
const password = "5511";

function registerNightwatch({
  matchId,
  setHome,
  setAway,
  set1HomePoints,
  set1AwayPoints,
  set2HomePoints,
  set2AwayPoints,
  set3HomePoints,
  set3AwayPoints,
  homeTeamWon
}) {
  process.env.password = password;
  process.env.shortName = shortName;
  process.env.turneringsId = profixioTurneringsId;
  process.env.matchId = matchId;
  process.env.setHome = setHome;
  process.env.setAway = setAway;
  process.env.set1HomePoints = set1HomePoints;
  process.env.set1AwayPoints = set1AwayPoints;
  process.env.set2HomePoints = set2HomePoints;
  process.env.set2AwayPoints = set2AwayPoints;
  process.env.set3HomePoints = set3HomePoints;
  process.env.set3AwayPoints = set3AwayPoints;
  process.env.homeTeamWon = homeTeamWon;

  nwrun(
    {
      // argv: argv,
      // force: argv.force,
      // target: argv.target,
      // standalone: argv.standalone,
      src_folders: process.cwd() + "/tests",
      output_folder: process.cwd() + "/reports",
      target: "default"
      // config_path: __dirname + "/nightwatch.json"
    },
    function(success) {
      if (!success) {
        console.log("Registered ");
        return false;
      }
      return true;
    }
  );
}

module.exports = registerNightwatch;
