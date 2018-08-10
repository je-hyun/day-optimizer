(function(){
  var activeTestSets, options;


  function test_function(arg_array){
    return Duration.compare(arg_array[0],arg_array[1]).toString();
  }
  activeTestSets = activeTestSets = {
    durCompare: {
      settings: function(){Duration.prototype.simple = true;},
      t0:    {args:[new Duration(0), new Duration(0)], exp:"+0m"},
      t1:    {args:[new Duration(0), new Duration(1)], exp:"+1m"},
      t2:    {args:[new Duration(0), new Duration(-1)], exp:"-1m"},
      t3:    {args:[new Duration(23*60+59), new Duration(0)], exp:"-23h59m"},
    }
  };
  options={
    showpass:true,
    showfail:true,
    output:"console"
  };
  run_tests(test_function,activeTestSets,options);
})();
