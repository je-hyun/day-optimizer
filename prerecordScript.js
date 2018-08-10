/* Title:           Time Optimizer
 * Description:     A client-side activity logger designed for the user to
 *                  easily track their time usage and compare it against their
 *                  their planned schedules.
 * Version:         0.1.0
 * Date Created:    7.10.2018
 * Copyright:       Je Hyun Kim
 * License:         MIT License
 **/
/* jshint globalstrict: true */
"use strict";

// ~~~~~~ Document Initialization ~~~~~~
$(document).ready(function() {
  // -- Useful Variables --
  // ~~~~~~ Add event listeners for the form ~~~~~~
  // listeners for autofill current time buttons:
  $("#entry-start-autofill").click(function(){
    $("#entry-start").val(prettyTime());
  });
  $("#entry-end-autofill").click(function(){
    $("#entry-end").val(prettyTime());
  });
  $("#button-submit-log-entry").click(function(){
    handleSubmitLog();
  });
  setupEntryEndPlaceholderTimer();
  updateEntryStart();
});
// -- Input-Handler Functions --
function handleSubmitLog() {
  /*TODO: Look at these problems and also unit test writing. Test the
  validators and formatters with unit test.*/
  let newLogEntry =
    {"start":     "implt startParser, prettyTime for array of hour/minutes and startValidator",
    "end":        "implt endParser and endValidator",
    "duration":   "implt durationParser and durationValidator",
    "compare":    "implt compareParser and compareValidator",
    "label":      "implt labelParser and labelValidator"};
  $(createRow(newLogEntry)).insertAfter($("#entry-row"));
}

// ~~~~~~ Utility or Helper Functions ~~~~~~
function prettyTime(myDate = new Date()) {
  /*Returns readable time string from date object*/
  let rawHours = myDate.getHours();
  let rawMinutes = myDate.getMinutes();
  let hours;
  if (rawHours > 12) {
    hours = rawHours - 12;
  } else if(rawHours === 0) {
    hours = 12;
  } else {
    hours = rawHours;
  }
  let minutes = rawMinutes < 10 ? "0" + String(rawMinutes) : rawMinutes;
  let seconds = myDate.getSeconds();
  let amOrPm = parseInt(rawHours) < 12 ? "am" : "pm";
  return hours + (rawMinutes != 0 ? ":" + minutes : "") + " " + amOrPm;
}

function createRow(newLogEntry) {
  /* Takes object newLogEntry and returns an html tr element with log contents
  newLogEntry will have attributes: start, end, duration, compare, label */
  let newRow = document.createElement("tr");
  let newTd;
  for(let x in newLogEntry){
    newTd = document.createElement("td");
    newRow.appendChild(newTd);
    newTd.innerHTML = String(newLogEntry[x]);
  }
  return newRow;
}

/*Testing purposes: user exceptions*/
function JeException(message) {
  this.message = message;
  this.name = "UserException";
}

function newEntry(start, end, duration, compare, label) {
  if (start === undefined) {
    throw "Start undefined";
  }
  if (end === undefined) {
    throw "End undefined";
  }
  if (duration === undefined) {
    throw new JeException("Duration undefined");
  }
  if (label === undefined) {

  }
}

// ~~~~~~ Styling Functions ~~~~~~
function setupEntryEndPlaceholderTimer() {
  /* Makes a timer which updates entry-end's placeholder to the current time
  every minute*/
  let now = new Date();
  let intervalDelay = 60000; //one minute
  let start = intervalDelay - (now.getSeconds()*1000 + now.getMilliseconds());
  function _updateEntryEnd() {
    $("#entry-end").attr("placeholder",prettyTime());
  }
  setTimeout(function() {
    setInterval(_updateEntryEnd, intervalDelay);
    _updateEntryEnd();
  }, start);
  _updateEntryEnd();
}

function updateEntryStart() {
  /*Sets entry-start's placeholder to the last logged start time, if it exists.
  If there are no logged start times, default to time user loaded page.*/
  if ($("#entry-start").attr("placeholder") === "") {
    $("#entry-start").attr("placeholder",prettyTime());
  } else {

  }
}
// -- misc notes: --
/*
log object format:
{"start", "end", "duration", "compare", "label"}
*/
/*
e.g. valid time inputs (after removing whitespace):
130am, 1230am         *If no colon with am/pm, 3 chars 1st is hour. 4 char, 1 and 2 is hour.
1:23                  *If prev log exists, infer least difference time
12:01:00
13:00-23:59

e.g. invalid time inputs:
any string with letters not in [0-9 a m p A M P :]
13:30am               *first check availability of am/pm. Then, military time is not possible.

*/
