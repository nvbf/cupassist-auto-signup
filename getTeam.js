
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


const testID = 193
const osloRT = 198

async function main() {
    const result = await apiGetTournament(osloRT)
    
    const kvinneKlassen = result["Klasser"][0]["Lag"]
    const gutteKlassen = result["Klasser"][1]["Lag"]
    log(`K: ${kvinneKlassen}`)
    log(`G: ${gutteKlassen}`)
    for (let team of gutteKlassen) {
        const {Klasse, Spiller_1, Spiller_2, Lagnavn} = team
        const spiller1Navn = Lagnavn.split("/")[0].trim()
        const spiller2Navn = Lagnavn.split("/")[1].trim()
        const firstName1 = spiller1Navn.split(" ").reverse().slice(1).reverse().join(" ").trim()
        const firstName2 = spiller2Navn.split(" ").reverse().slice(1).reverse().join(" ").trim()
        const lastName1 = spiller1Navn.split(" ").reverse()[0].trim()
        const lastName2 = spiller2Navn.split(" ").reverse()[0].trim()
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
            Spiller_1,
            Spiller_2,
            firstName1,
            firstName2,
            lastName1,
            lastName2
        })
    }

}

main()


const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runNightwatch(args) {
    const  {    
        Klasse,
        Spiller_1,
        Spiller_2,
        firstName1,
        firstName2,
        lastName1,
        lastName2
    } = args

  const command = `-s "${Klasse}" -s "${Spiller_1}" -s "${firstName1}" -s "${lastName1}" -s "${Spiller_2}" -s "${firstName2}" -s "${lastName2}"`
  try {
        console.log(`nightwatch main.js ${command}`)
        //const { stdout, stderr } = await exec(`nightwatch main.js ${command}`);
        //console.log('stdout:', stdout);
        //console.log('stderr:', stderr);
  } catch(err) {
      console.log(`Catch error on ${spiller1Navn} ${spiller2Navn} continue with next` )
  }
 }