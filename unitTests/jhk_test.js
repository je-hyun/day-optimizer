/**
 * Checks if test_function(args), where args is an array of arguments, is equal
 * to expectation with a set of args and expectations supplied by
 * activeTestSets and returns a report (string) with formatted information.
 * Usage Tips
 *      Make a separate js file with your tests. In a closure, create the
 *      test_function, testSet, and options, and call run_tests.
 *      Remember to load THIS file before a specific test file in html.
 *
 * @param  {function} test_function  func with code to test, which
 *                                   should take an array arg
 * @param  {Object} activeTestSets   the set of tests cases.
 *                                   egActiveTestSets = {
 *                                     set1 : {
 *                                       settings: function(){},
 *                                       test1name: {args:[0,1,2],exp:"0"}
 *                                     }
 *                                   };
 * @param  {Object} [options=null]   Options flags [showpass, showfail, output]
 * @return {string}                  the output of the test results.
 */
function run_tests(test_function, activeTestSets,options={}){
  if (options.output === undefined) {
    options.output = "console";
  }
  var results,str_out="";
  /** @type {Object} holds the total and failed test counts */
  results = {
    total:0,
    fail:0,
    failedLabels:[],
    passedLabels:[]
  };
  /**
   * Test a case for a function and if it fails, log in console and results.results.failedLabels
   * @param  {array} args                   args to apply to myfunc
   * @param  {value} expected               expected results
   * @param  {string} [label=results.total] label to refer to test if failed
   */
  function test(args, expected, label=results.total) {
    var actual = test_function(args);
    if(actual !== expected) {
      results.fail++;
      if (options.showfail !== false) {
        str_out += "#"+results.total+ " FAIL (" +label+ ")" + ". "+ expected.toString() + " expected, but got " + actual + "\n";
      }
      results.failedLabels.push({num:results.total, "lbl":label});
    } else {
      if (options.showpass !== false) {
        str_out += "#"+results.total+ " PASS (" +label+ ")" + ". "+ expected.toString() + " === "+ actual + "\n";
      }
      results.passedLabels.push({num:results.total, "lbl":label});
    }
    results.total++;
  }
  for (let ts in activeTestSets) {
    for (let i in activeTestSets[ts]) {
      if(i==="settings") {
        activeTestSets[ts][i]();
      } else {
        test(activeTestSets[ts][i].args, activeTestSets[ts][i].exp, `${ts}_${i}`);
      }
    }
  }

  /* Print the summary to console */
  str_out +=
  (()=>{
    let summary = "\n___Summary ("+(results.total - results.fail) + "/" + results.total + " passed)"+"___";
    summary += "\nPassed: " + (results.passedLabels.length === 0 ? "None" : "");
    for(let i in results.passedLabels) {
      summary += `${results.passedLabels[i].num})${results.passedLabels[i].lbl}, `;
    }
    if (results.passedLabels.length !== 0) {
      summary = summary.substring(0,summary.length-2);
    }

    summary += "\nFailed: " + (results.failedLabels.length === 0 ? "None" : "");
    for(let i in results.failedLabels) {
      summary += `${results.failedLabels[i].num})${results.failedLabels[i].lbl}, `;
    }
    if (results.failedLabels.length !== 0) {
      summary = summary.substring(0,summary.length-2);
    }
    return summary;
  })() + "\n";
  if (options.output === "console") {
    console.log(str_out);
  }
  return str_out;
}
