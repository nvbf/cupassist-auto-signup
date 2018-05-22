require("dotenv").config();
const axios = require("axios");
const { URL, USERNAME, PASSWORD } = process.env;
if (!URL || !USERNAME || !PASSWORD) {
  console.log("URL, USERNAME, PASSWORD needs to be set as env.var");
}

const klasse = process.argv[4];

const player1id = process.argv[6];

const firstName1 = process.argv[8];
const lastName1 = process.argv[10];

const player2id = process.argv[12];
const firstName2 = process.argv[14];
const lastName2 = process.argv[16];

console.log(
  `Args: ${klasse} ${player1id} ${firstName1} ${lastName1} ${player2id} ${firstName2} ${lastName2}`
);

module.exports = {
  // get a session, that tell cupassist which tournament we want to interact with
  beforeEach: function(browser) {
    browser.url(process.env.URL);
  },

  login: function(browser) {
    let player1Id = false;
    let player2Id = false;
    let browserCookies = false;
    browser
      .url("https://www.profixio.com/pamelding/reg_login_form.php")
      .waitForElementVisible("body", 3000)
      .assert.visible("input#brukernavn")
      .assert.visible("input#pwdinput")
      .assert.visible("input#pwdinput")
      .assert.visible("input[type=submit]")
      .setValue("input#brukernavn", process.env.USERNAME)
      .setValue("input#pwdinput", process.env.PASSWORD)
      .click("input[type=submit]")
      .assert.visible("input")
      .click("input")
      .url("https://www.profixio.com/pamelding/svb_velg_spillere.php")
      .waitForElementVisible("input#subm_btt", 3000)
      .perform(function(done) {
        browser.execute(
          function(id1, id2, lastName1, firstName1, lastName2, firstName2) {
            document.getElementsByTagName("input")[0].value = id1;
            document.getElementsByTagName("input")[1].value = id2;
            document.getElementsByTagName("input")[2].value = lastName1;
            document.getElementsByTagName("input")[3].value = firstName1;
            document.getElementsByTagName("input")[4].value = lastName2;
            document.getElementsByTagName("input")[5].value = firstName2;
            document.getElementById("subm_btt").disabled = false;
            return args;
          },
          [player1id, player2id, lastName1, firstName1, lastName2, firstName2],
          done
        );
      })
      .click("input#subm_btt")
      .url("https://www.profixio.com/pamelding/svb_reg_lag_form.php?a=new2")
      .waitForElementVisible("input", 3000)
      .click(`select option[value=${klasse}]`)
      .setValue("input[name=lag_kontakt_navn", ".")
      .setValue("input[name=lag_kont_epost", "spam@spam.com")
      .setValue("input[name=lag_kont_mob", "93008598")
      .click("input[type=submit]");

    browser.end();
  }
};
