# Requirements

Chrome and yarn.
(we uses the chromedriver and skip selenium so java is not needed)

## Chrome version

v66

If you have a older version, please upgrade. If you have a newer version check out
http://chromedriver.chromium.org/ and update `package.json` to the corresponding chromedriver that works with your chrome.

## How it works

this setup uses chrome and a chromedriver to automaticlly browse a page and do actions.

More specifically we login into cupassist with our users and automaticly signups the players
that we get from our database.

# Setup

## Dependencies

Run `yarn` to install what is nedded.

## Enviroment variables

you need to copy the `.env.sample` and create a `.env` file.

the `USERNAME` and `PASSWORD` should be the username and passord you login to profixio with on the web to signup on a tournament.

`API_URL` should be the url to the api. included http but excluding a trailing /.

e.g `http:///127.0.0.1:16000`

`URL` - this is the url to the profixi tournament.

e.g `https://www.profixio.com/pamelding/redirect.php?tknavn=<profixio-short-name-here>`

`API_TOURNAMENT_ID` - the tournament id from the API (not profixio).

# Run

to make this as easy as possible and make sure you can rerun parts fast. it's split into two parts.

1.  `node getTeam.js`

This should give one line for each team so that you can run the signup process for that team one more time.

The second part is just to run the lines you get as output.

2.  nightwatch main.js -s "<class>" -s "<player1-id>" -s "<firstname-player1>" -s "<lastname-player1" -s "player2-id" -s "<player2-lastname>" -s "<player2-firstname>"

run the lines from part1. You can do it line by line, or just and insert dem into your cli all at once and
the terminal will just run them in sequence and you do not need to do anything more then watch the output and fix the ids that do not work.

Red means problems ;)

## Know problems

* some of the players in the database do not have a profixio id, then we can not sign the player up.
* some of the players have duplicates entries, this could lead to a problem.
* the tournament needs to be open for ppl to signup. So if this fails, check if you are able to sign someone up manually
