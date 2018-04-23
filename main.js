const axios = require("axios");

const { URL, USERNAME, PASSWORD } = process.env;
if (!URL || !USERNAME || !PASSWORD) {
  console.log("URL, USERNAME, PASSWORD needs to be set as env.var");
  exit(-1);
}

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
      .pause(1000)
      .url("https://www.profixio.com/pamelding/svb_velg_spillere.php")
      .waitForElementVisible("body", 1000)
      .url("https://www.profixio.com/pamelding/svb_sok_spillere.php")
      .waitForElementVisible("body", 1000)
      .setValue("input[type=text]", "Svendby")
      .click("input[type=submit]")
      .execute(
        function(args) {
          return document.getElementsByTagName("option")[0].value;
        },
        [],
        result => {
          console.log(`Result is ${JSON.stringify(result.value)}`);
          player1Id = result.value;
        }
      )
      .url("https://www.profixio.com/pamelding/svb_sok_spillere.php")
      .waitForElementVisible("body", 1000)
      .setValue("input[type=text]", "Tveitan")
      .click("input[type=submit]")
      .execute(
        function(args) {
          return document.getElementsByTagName("option")[0].value;
        },
        [],
        result => {
          console.log(`Result is ${JSON.stringify(result.value)}`);
          player2Id = result.value;
        }
      )
      .getCookies(function callback(result) {
        browserCookies = result.value;
      })
      .url("https://www.profixio.com/pamelding/svb_velg_spillere.php")
      .waitForElementVisible("body", 1000);
    browser
      .perform(function(done) {
        browser.execute(
          function(spiller_id_1, spiller_id_2) {
            var s1_enavn = "Svendby";
            var s1_fnavn = "Sindre Øye";
            var s2_enavn = "Tveitan";
            var s2_fnavn = "Håkon";
            document.getElementsByTagName("input")[0].value = spiller_id_1;
            document.getElementsByTagName("input")[1].value = spiller_id_2;
            document.getElementsByTagName("input")[2].value = s1_enavn;
            document.getElementsByTagName("input")[3].value = s1_fnavn;
            document.getElementsByTagName("input")[4].value = s2_enavn;
            document.getElementsByTagName("input")[5].value = s2_fnavn;
            document.getElementById("subm_btt").disabled = false;
            return args;
          },
          [player1Id, player2Id],
          done
        );
      })
      .click("input#subm_btt")
      .pause(10000)
      .url("https://www.profixio.com/pamelding/svb_reg_lag_form.php?a=new2")
      .waitForElementVisible("input", 1000)
      .click("select option[value=M]")
      .setValue("input[name=lag_kontakt_navn", ".")
      .setValue("input[name=lag_kont_epost", "spam@spam.com")
      .setValue("input[name=lag_kont_mob", "93008598")
      .click("input[type=submit]")
      .pause("1000");

    browser.end();
  }
};
