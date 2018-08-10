(function(){
  var activeTestSets, options;
  var end = 23*60+59, noon=12*60;
  function test_function(arg_array){
    if (arg_array.length === 2){
      return (Time.compare(new Time(arg_array[0]),new Time(arg_array[1]))).toString();
    }
    return (Time.compare(new Time(arg_array[0]),new Time(arg_array[1]),arg_array[2])).toString();
  }
  activeTestSets = {
    unsigned: {
      settings: function() {Duration.prototype.simple = false;},
      minute:         {args:[60, 61], exp:"+0h01m"},
      edgeMidnight:   {args:[end,0],exp:"+0h01m"},
      wrap:           {args:[0,end],exp:"+23h59m"},
    },
    signed: {
      settings: function() {},
      negminute:      {args:[12*60+1, 12*60,true], exp:"-0h01m"},
    }
  };
  options={
    showpass:false,
    showfail:true,
    output:"console"
  };
  run_tests(test_function,activeTestSets,options);
})();
