require("dotenv").config();
const axios = require("axios");
const { URL, USERNAME, PASSWORD } = process.env;
if (!URL || !USERNAME || !PASSWORD) {
  console.log("URL, USERNAME, PASSWORD needs to be set as env.var");
}

const klasse = process.argv[4]

const player1id = process.argv[6]

const firstName1 = process.argv[8]
const lastName1 = process.argv[10]

const player2id = process.argv[12]
const firstName2 = process.argv[14]
const lastName2 = process.argv[16]

console.log(`Args: ${klasse} ${player1id} ${firstName1} ${lastName1} ${player2id} ${firstName2} ${lastName2}`)

module.exports = {
  // get a session, that tell cupassist which tournament we want to interact with
  beforeEach: function(browser) {
    browser.url(process.env.URL);
  },

  login: function(browser) {
    let browserCookies = false;
    browser
      .url("https://www.profixio.com/pamelding/reg_login_form.php")
      .waitForElementVisible("body", 1000)
      .assert.visible("input#brukernavn")
      .assert.visible("input#pwdinput")
      .assert.visible("input#pwdinput")
      .assert.visible("input[type=submit]")
      .setValue("input#brukernavn", process.env.USERNAME)
      .setValue("input#pwdinput", process.env.PASSWORD)
      .click("input[type=submit]")
      .assert.visible("input")
      .click("input")
      .pause(2000)
    .url("https://www.profixio.com/pamelding/svb_velg_spillere.php")
    .waitForElementVisible("body", 2000);
    browser
      .perform(function(done) {
        browser.execute(
          function(player1id, player2id, lastName1, lastName2, firstName1, firstName2) {
            document.getElementsByTagName("input")[0].value = player1id;
            document.getElementsByTagName("input")[1].value = player2id;
            document.getElementsByTagName("input")[2].value = lastName1;
            document.getElementsByTagName("input")[3].value = firstName1;
            document.getElementsByTagName("input")[4].value = lastName2;
            document.getElementsByTagName("input")[5].value = firstName2;
            document.getElementById("subm_btt").disabled = false;
            return true;
          },
          [player1id, player2id, lastName1, lastName2, firstName1, firstName2],
          done
        );
      })
      .click("input#subm_btt")     
      .pause(45000)
      // .click(`select option[value=${klasse}]`)
      // .setValue("input[name=lag_kontakt_navn", ".")
      // .setValue("input[name=lag_kont_epost", "post@osvb.no")
      // .setValue("input[name=lag_kont_mob", "93008598")
      // .click("input[type=submit]");

    browser.end();
  }
};


// document.getElementsByTagName("input")[0].value = "2530";
// document.getElementsByTagName("input")[1].value = "2822";
// document.getElementsByTagName("input")[2].value = "Iversen";
// document.getElementsByTagName("input")[3].value = "Ragnar";
// document.getElementsByTagName("input")[4].value = "Tveitan";
// document.getElementsByTagName("input")[5].value = "Håkon";
// document.getElementById("subm_btt").disabled = false;

// var domNode = document.getElementById("subm_btt")

// var newEmailInput1 = document.createElement('input');
// newEmailInput1.setAttribute("type", "text");
// newEmailInput1.setAttribute("name", "epost1");
// newEmailInput1.setAttribute("value", "post@osvb.no");

// var newEmailInput2 = document.createElement('input');
// newEmailInput2.setAttribute("type", "text");
// newEmailInput2.setAttribute("name", "epost2");
// newEmailInput2.setAttribute("value", "post@osvb.no");

// domNode.parentNode.insertBefore(newEmailInput1, domNode.nextSibling);  
// domNode.parentNode.insertBefore(newEmailInput2, domNode.nextSibling);  