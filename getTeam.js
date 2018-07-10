const log = require("debug")("getTeam");
require("dotenv").config();
const { API_URL } = process.env;

const axios = require("axios");

async function apiGetTournament(id) {
  log(`request URL: ${API_URL}/tournaments/${id}`);
  const result = await axios.get(`${API_URL}/tournaments/${id}`);
  const data = getData(result);
  return data;
}

function getData(result) {
  if (result.status !== 200) {
    log(`Did not get a 200 response from API, details: ${result}`);
    throw new Error(`Did not get a 200 response from API, details: ${result}`);
  }
  return result.data;
}

async function apiGetPlayer(id) {
  const players = await apiGetPlayers();
  const playersArray = players.filter(({ SpillerId }) => SpillerId == id);

  if (playersArray.length === 0) {
    return { noSuchPlayer: "No such player id" };
  }
  return playersArray[0];
}

let players = false;
async function apiGetPlayers() {
  if (!players) {
    const result = await axios.get(`${API_URL}/players`);
    players = getData(result);
  }
  return players;
}

async function main() {
  const result = await apiGetTournament(process.env.API_TOURNAMENT_ID);
  const classes = result["classes"];
  for (var index = 0; index < classes.length; index++) {
    const { klasse, teams } = classes[index];
    log(`${klasse}: ${JSON.stringify(teams)}`);
    for (var index2 = 0; index2 < teams.length; index2++) {
      const team = teams[index2];
      log(`Team: ${JSON.stringify(team)}`);
      await outputRegisterTeam(klasse, team);
    }
  }
}

async function outputRegisterTeam(klasse, team) {
  const { Spiller_1, Spiller_2, Lagnavn } = team;
  const p1 = await apiGetPlayer(Spiller_1);
  const { ProfixioId: profixioIdSpiller1 } = p1;

  const p2 = await apiGetPlayer(Spiller_2);
  const { ProfixioId: profixioIdSpiller2 } = p2;
  const spiller1Navn = Lagnavn.split("/")[0].trim();
  const spiller2Navn = Lagnavn.split("/")[1].trim();
  const firstName1 = getFirstname(spiller1Navn);
  const firstName2 = getFirstname(spiller2Navn);
  const lastName1 = getLastName(spiller1Navn);
  const lastName2 = getLastName(spiller2Navn);
  await runNightwatch({
    klasse,
    profixioIdSpiller1,
    profixioIdSpiller2,
    firstName1,
    firstName2,
    lastName1,
    lastName2
  });
}

// Lastname is the last name, everything else is part of the firstname
function getFirstname(fullname) {
  const firstName = fullname
    .split(" ")
    .reverse()
    .slice(1)
    .reverse()
    .join(" ")
    .trim();
  return firstName;
}

// lastname is always just the last word.
function getLastName(fullname) {
  const lastname = fullname
    .split(" ")
    .reverse()[0]
    .trim();
  return lastname;
}

const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function runNightwatch(args) {
  const {
    klasse,
    profixioIdSpiller1,
    profixioIdSpiller2,
    firstName1,
    firstName2,
    lastName1,
    lastName2
  } = args;

  const command = `-s "${klasse}" -s "${profixioIdSpiller1}" -s "${firstName1}" -s "${lastName1}" -s "${profixioIdSpiller2}" -s "${firstName2}" -s "${lastName2}"`;
  try {
    console.log(`./node_modules/.bin/nightwatch main.js ${command}`);
    //const { stdout, stderr } = await exec(`nightwatch main.js ${command}`);
    //console.log('stdout:', stdout);
    //console.log('stderr:', stderr);
  } catch (err) {
    console.log(`Catch error on ${lastName1} ${lastName2} continue with next`);
  }
}

main();
