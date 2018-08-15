/**
 * Constructor for object representing a time duration.
 * @param       {number} min minutes
 * @constructor
 */
function Duration(min) {
  this.min = min;
}
/**
 * Creates a duration object from string.
 * @param  {string} str A string representation of duration (eg 1h30m)
 * @return {Duration}     A Duration object with the correct mins.
 */
function parseDuration(str) {
  var sign,h,m,myStr,matchArray,durFormat;
  durFormat = /^([+-])?(?:(\d+)h)?(?:(\d+)m)?$/;
  myStr = str.replace(/ /g,""); //remove whitespaces
  // now, str should be in format {number}h{number}m.
  // Check if valid format
  if (!durFormat.test(myStr)) {
    throw RangeError("String \"" + str + "\" does not match duration format {number}h{number}m");
  }
  // Store the matching hour and min groups into h and m.
  matchArray = myStr.match(durFormat);
  if (matchArray[1] == null || matchArray[1] == "+") {
    sign = 1;
  } else {
    sign = -1;
  }
  h = matchArray[2] != null ? parseInt(matchArray[2]) : 0;
  m = matchArray[3] != null ? parseInt(matchArray[3]) : 0;
  return new Duration(sign * (h*60+m));
}
/** @type {Boolean} simplifies formatting output by the toString method. */
Duration.prototype.simple = false;
Duration.prototype.toString = function() {
  var h,m,sign,strH,strM,strReturn;
  sign = this.min >= 0 ? "+" : "-";
  h = Math.floor(Math.abs(this.min)/60);
  m = Math.floor(Math.abs(this.min)%60);
  if(this.simple) {
    if(this.min === 0) {
      strReturn = "0m";
    } else {
      var helperH = (h===0) ? "" : h.toString() + "h";
      var helperM = (m===0) ? "" : m.toString() + "m";
      strReturn =  helperH+helperM;
    }
  } else {
    strReturn = m > 9 ? `${h}h${m}m` : `${h}h0${m}m`;
  }
  return sign + strReturn;
};
Duration.prototype.addDuration = function(durationObject) {
  return new Duration((this.min + durationObject.min) % (24*60));
};
/**
 * Get the difference between two durations.
 * @param  {Duration} a First duration to compare.
 * @param  {Duration} b Second duration.
 * @return {Duration}   The difference between the durations.
 */
Duration.compare = function(a,b) {
  return new Duration(b.min - a.min);
};

/**
 * Creates an object that records time in min and displays based on format.
 * @param       {number}  min            minutes
 * @param       {string}  [mode="24h"]   Format to read (12h or 24h)
 * @constructor
 */
function Time(min) {
  if (min > 23*60+59 || min < 0){
    throw new RangeError(min.toString() + "mins not between [0, 23*60+59]");
  }
  this.min = min;
}
/**
 * Creates a Time object from user input string, if it's valid.
 * @param       {string} str The string to interpret as a Time object.
 * @returns     {Time} A time object from string representation.
 */
function parseTime(str) {
  // strip all whitespaces
  var s, m, h, ampm, f24h, f12h, f12hSimple, matchArray;
  if (str == null) {
    return null;
  }
  s = str.replace(/ /g,"").toLowerCase();
  f24h = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  f12h = /^(1[0-2]|0?[1-9]):([0-5]?[0-9])([ap]m)$/;
  f12hSimple = /^(1[0-2]|0?[1-9])([ap]m)$/;
  if(f24h.test(s)) {
    matchArray = s.match(f24h);
    h = matchArray[1];
    m = matchArray[2];
  } else if(f12h.test(s)) {
    matchArray = s.match(f12h);
    h = matchArray[1];
    m = matchArray[2];
    ampm = matchArray[3];
  } else if(f12hSimple.test(s)) {
    matchArray = s.match(f12hSimple);
    h = matchArray[1];
    m = 0;
    ampm = matchArray[2];
  } else {
    throw new RangeError("String '" + str.toString() + "' is not in correct time format.");
  }
  h = parseInt(h);
  m = parseInt(m);
  if(ampm === undefined) {
    return new Time(60*h+m);
  } else {
    return new Time(60*(h === 12 ? 0 : h)+m + (ampm === "pm" ? 12*60 : 0));
  }
}
/** @type {Boolean} simplifies formatting output by the toString method. */
Time.prototype.simple = false;
Time.prototype.mode = "24h";
Time.prototype.toString = function() {
  var h,m,ampm,strH,strM;
  if (this.min === undefined) {
    return undefined;
  }
  h = Math.floor(this.min/60);
  m = Math.floor(this.min%60);
  if(this.mode === "24h") {
    if(this.simple) {
      strH = h.toString();
    } else {
      strH = h > 9 ? h.toString() : "0" + h.toString();
    }
    strM = m > 9 ? m.toString() : "0" + m.toString();
    return strH+":"+strM;
  } else if (this.mode === "12h") {
    h = h < 13 ? h : h - 12;
    h = h===0?12:h;
    ampm = this.min < 12*60 ? "am" : "pm";
    if(m === 0 && this.simple) {
      return h.toString() + ampm;
    }
    return (m > 9 ? `${h}:${m}` : `${h}:0${m}`) + ampm;
  } else {
    throw new RangeError("Expected value of 24h or 12h. Instead, got " + this.mode);
  }
};
Time.now = function() {
  var currentDateObject = new Date();
  return new Time(currentDateObject.getHours()*60+currentDateObject.getMinutes());
};
Time.compare = function(a,b,signed=false) {
  if(signed) {
    return new Duration(b.min-a.min);
  } else {
    if (b.min > a.min) {
      return new Duration(b.min - a.min);
    } else if (b.min < a.min) {
      return new Duration((24*60)-a.min+b.min);
    } else {
      return new Duration(0);
    }
  }
};
Time.prototype.addDuration = function(durationObject) {
  return new Time((this.min + durationObject.min) % (24*60));
};
/**
 * Holds data for a single activity's log entry, to be used in a record.
 * @param       {Time} start the start time of the activity
 * @param       {Time} stop the stop time of the activity
 * @param       {string} label a description of the activity
 * @constructor
 */
function Entry(start, stop, label) {
  this.start = start;
  this.stop = stop;
  this.label = label;
}

function Record() {
  this.entries = [];
}
//TODO: implement compare property [for exp/actual record times] (after loading record works)
Record.prototype.add_entry = function(new_entry) {
  var entry, curDate;
  entry = new Entry(new_entry.start,new_entry.stop,new_entry.label);
  // apply defaults to start, stop, and label.
  // start default: previous stop time
  if(entry.start == null) {
    if (this.entries.length > 0) {
      entry.start = this.entries[this.entries.length-1].stop;
    } else {
      //TODO: decide case for when entries is empty and first entry doesn't have start.
      // for now, let's just keep it at the current time.
      entry.start = Time.now();
    }
  }
  // stop default: current time
  if(entry.stop == null) {
    curDate = new Date();
    entry.stop = Time.now();
  }
  // label default: (not implt yet. Should be top of "activity stack")
  if(entry.label == null || entry.label === "") {
    //TODO: change the default to the top lbl of schedule's stack.
    entry.label = "~";
  }
  entry.duration = Time.compare(entry.start,entry.stop);
  this.entries.push(entry);
  return this.entries[this.entries.length-1];
};
Record.prototype.toString = function() {
  var returner = "";
  for(let i in this.entries) {
    returner+= '[';
    for (let j in this.entries[i]) {
      returner += `${j}=${this.entries[i][j]}, `;
    }
    if(returner.length > 2)
      returner = returner.slice(0, returner.length - 2);
    returner+= '], ';
  }
  if(returner.length > 2)
    returner = returner.slice(0, returner.length -2);
  return returner;
};
/**
 * Edit an already existing entry in a record.
 * @param  {number} entry_number The number entry, e.g. 0 is first entry.
 * @param  {string} key          The type (start, stop, label)
 * @param  {object} val          A value corresponding to key (Time or string)
 */
Record.prototype.edit_entry = function(entry_number,key,val) {
  this.entries[entry_number][key] = val;
};
