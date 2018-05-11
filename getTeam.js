const log = require("debug")("getTeam");
require("dotenv").config();
const { API_URL } = process.env;

const axios = require("axios");

async function apiGetTournament(id) {
  const tournaments = await apiGetTournaments(`?TurneringsId=${id}&Lag=True`);
  const tournamentArray = tournaments.filter(
    ({ TurneringsId }) => TurneringsId == id
  );
  if (tournamentArray.length === 0) {
    return { noSuchTournament: "No such tournamentID" };
  }
  return tournamentArray[0];
}

async function apiGetTournaments(extraQueryString = "") {
  log(`request URL: ${API_URL}/tournaments${extraQueryString}`);
  const result = await axios.get(`${API_URL}/tournaments${extraQueryString}`);
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
  const kvinneKlassen = result["Klasser"][0]["Lag"];
  const gutteKlassen = result["Klasser"][1]["Lag"];
  log(`K: ${kvinneKlassen}`);
  log(`G: ${gutteKlassen}`);
  const both = gutteKlassen.concat(kvinneKlassen);
  for (let team of both) {
    const { Klasse, Spiller_1, Spiller_2, Lagnavn } = team;
    const p1 = await apiGetPlayer(Spiller_1);
    const { ProfixioId: profixioIdSpiller1 } = p1;

    const p2 = await apiGetPlayer(Spiller_2);
    const { ProfixioId: profixioIdSpiller2 } = p2;
    const spiller1Navn = Lagnavn.split("/")[0].trim();
    const spiller2Navn = Lagnavn.split("/")[1].trim();
    const firstName1 = spiller1Navn
      .split(" ")
      .reverse()
      .slice(1)
      .reverse()
      .join(" ")
      .trim();
    const firstName2 = spiller2Navn
      .split(" ")
      .reverse()
      .slice(1)
      .reverse()
      .join(" ")
      .trim();
    const lastName1 = spiller1Navn
      .split(" ")
      .reverse()[0]
      .trim();
    const lastName2 = spiller2Navn
      .split(" ")
      .reverse()[0]
      .trim();
    // log("------")
    // log(Klasse)
    // log(Spiller_1)
    // log(spiller1Navn)
    // log(lastName1)
    // log(Spiller_2)
    // log(spiller2Navn)
    // log(lastName2)
    await runNightwatch({
      Klasse,
      profixioIdSpiller1,
      profixioIdSpiller2,
      firstName1,
      firstName2,
      lastName1,
      lastName2
    });
  }
}

main();

const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function runNightwatch(args) {
  const {
    Klasse,
    profixioIdSpiller1,
    profixioIdSpiller2,
    firstName1,
    firstName2,
    lastName1,
    lastName2
  } = args;

  const command = `-s "${Klasse}" -s "${profixioIdSpiller1}" -s "${firstName1}" -s "${lastName1}" -s "${profixioIdSpiller2}" -s "${firstName2}" -s "${lastName2}"`;
  try {
    console.log(`nightwatch main.js ${command}`);
    //const { stdout, stderr } = await exec(`nightwatch main.js ${command}`);
    //console.log('stdout:', stdout);
    //console.log('stderr:', stderr);
  } catch (err) {
    console.log(`Catch error on ${lastName1} ${lastName2} continue with next`);
  }
}
