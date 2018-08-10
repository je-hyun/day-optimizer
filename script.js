/* Title:           Time Optimizer
 * Description:     An activity logger designed to help track your
 *                  time usage and compare it against plans.
 * Version:         0.1.0
 * Date Created:    7.10.2018
 * Copyright:       Je Hyun Kim
 * License:         MIT License
 **/
/* jshint globalstrict: true */
/* globals Time, Duration, Entry, Record, strToTime */
/* globals console */
//TODO: add functionality for settings, stats, download, and upload.
//TODO: rearrange html and adjust createRow
"use strict";
// the only salvageable code is the document ready and the timer stuff atm.
// ~~~~~~ Document Initialization ~~~~~~
var logRecord = new Record();

//TODO: make settings set change also update the display.
var settings = {
  set timeMode(mode) {
    Time.prototype.mode = mode;
  },
  get timeMode() {
    return Time.prototype.mode;
  },
  set timeSimple(bool) {
    Time.prototype.simple = bool;
  },
  get timeSimple() {
    return Time.prototype.simple;
  },
  set durationSimple(bool) {
    Duration.prototype.simple = bool;
  },
  get durationSimple() {
    return Duration.prototype.simple;
  }
};

$(document).ready(function() {
  // -- Useful Variables --
  //Time.prototype.mode = "12h";
  settings.timeMode = "12h";
  settings.timeSimple = true;
  settings.durationSimple = true;
  // ~~~~~~ Add event listeners for the form ~~~~~~
  // listeners for autofill current time buttons:
  $("#entry-start-autofill").click(function() {
    $("#entry-start").val(Time.now().toString());
    $("#entry-start").addClass("highlight-input");
  });
  $("#entry-start").on("animationend",function(){
        $("#entry-start").removeClass("highlight-input");
      });
  $("#entry-stop-autofill").click(function() {
    $("#entry-stop").val(Time.now().toString());
    $("#entry-stop").addClass("highlight-input");
  });
  $("#entry-stop").on("animationend",function(){
        $("#entry-stop").removeClass("highlight-input");
      });
  $("#button-submit-log-entry").click(function() {
    handleSubmitLog();
  });
  $("#top-button").click(function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
  // hide scrolltop button on scrolll.
  window.onscroll = function(){
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("top-button").style.display = "block";
    } else {
        document.getElementById("top-button").style.display = "none";
    }
  };
  setupEntryEndPlaceholderTimer();
  $("#entry-start").attr("placeholder",Time.now());
});


// -- Input-Handler Functions --
function getInput() {
  var rawStart,rawStop,rawLabel;
  function _emptyStringToNull(someStr,defaulter=null) {
    return someStr === "" ? defaulter : someStr;
  }
  rawStart = $("#entry-start").val();
  rawStop = $("#entry-stop").val();
  rawLabel = $("#entry-label").val();

  return {
    start: _emptyStringToNull(rawStart),
    stop: _emptyStringToNull(rawStop),
    label: _emptyStringToNull(rawLabel)
  };
}

function handleSubmitLog() {
  var start,stop,duration,compare,label,curEntry,curEntryAdded,entryInput;
  entryInput = getInput();
  // check if user input is salvageable as an entry:
  try {
    start = strToTime(entryInput.start);
  } catch (err) {
    displayError(err.message);
  }
  try {
    stop = strToTime(entryInput.stop);
  } catch (err) {
    displayError(err.message);
  }
  label = entryInput.label;
  // create entry object with inputs
  curEntry = new Entry(start,stop,label);
  curEntryAdded = logRecord.add_entry(curEntry);
  // add entry to global record object.
  $(createRow(curEntryAdded)).insertAfter($("#entry-row"));
  // Reset input fields
  $("#entry-start").attr("placeholder",curEntryAdded.stop);
  $("#entry-start").val("");
  $("#entry-stop").val("");
  $("#entry-label").val("");
  $("entry-start").focus();
  document.getElementById("entry-label").focus();
}

// ~~~~~~ Utility or Helper Functions ~~~~~~
function displayError(strMsg) {
  console.log("ERROR: " + strMsg);
}
function createRow(newLogEntry) {
  /* Takes object newLogEntry and returns an html tr element with log contents
  newLogEntry will have attributes: start, end, duration, compare, label */
  var newRow, newTd;
  var properties = ["start","stop","duration","compare","label"];
  newRow = document.createElement("tr");
  newRow.class = "log-entry";
  // Create each data entry element and add to the newRow
  // start
  newTd = document.createElement("td");
  newTd.classList.add("start-cell");
  newRow.appendChild(newTd);
  newTd.innerHTML = newLogEntry.start;
  // stop
  newTd = document.createElement("td");
  newTd.classList.add("stop-cell");
  newRow.appendChild(newTd);
  newTd.innerHTML = newLogEntry.stop;
  // duration
  newTd = document.createElement("td");
  newTd.classList.add("duration-cell");
  newRow.appendChild(newTd);
  newTd.innerHTML = newLogEntry.duration.toString().slice(1);
  // compare
  newTd = document.createElement("td");
  newTd.classList.add("compare-cell");
  newRow.appendChild(newTd);
  newTd.innerHTML = newLogEntry.compare;
  // label
  newTd = document.createElement("td");
  newTd.classList.add("label-cell");
  newRow.appendChild(newTd);
  newTd.innerHTML = newLogEntry.label;
  return newRow;
}

// ~~~~~~ Styling Functions ~~~~~~
function setupEntryEndPlaceholderTimer() {
  /* Makes a timer which updates end-stop's placeholder to the current time
  every minute*/
  let now = new Date();
  let intervalDelay = 60000; //one minute
  let start = intervalDelay - (now.getSeconds()*1000 + now.getMilliseconds());
  function _updateEntryEnd() {
    $("#entry-stop").attr("placeholder",Time.now());
  }
  setTimeout(function() {
    setInterval(_updateEntryEnd, intervalDelay);
    _updateEntryEnd();
  }, start);
  _updateEntryEnd();
}
