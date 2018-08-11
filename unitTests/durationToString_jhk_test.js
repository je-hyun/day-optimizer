(function(){
  var activeTestSets, options;
  function test_function(arg_array){
    return arg_array[0].toString().slice(1);
  }
  activeTestSets = activeTestSets = {
    testSetDur: {
      settings: function(){Duration.prototype.simple = false;},
      noon:    {args:[new Duration(12*60)], exp:"12h00m"},
      t0:      {args:[new Duration(1*60)], exp:"1h00m"},
      t1:      {args:[new Duration(12*60+59)], exp:"12h59m"},
      t2:      {args:[new Duration(13*60)], exp:"13h00m"},
      t3:      {args:[new Duration(23*60+59)], exp:"23h59m"},
      t4:      {args:[new Duration(11*60+59)], exp:"11h59m"},
      t5:      {args:[new Duration(1)], exp:"0h01m"}
    },
    testSetDurS: {
      settings: function(){Duration.prototype.simple = true;},
      noon:    {args:[new Duration(12*60)], exp:"12h"},
      t0:      {args:[new Duration(1*60)], exp:"1h"},
      t1:      {args:[new Duration(12*60+59)], exp:"12h59m"},
      t2:      {args:[new Duration(13*60)], exp:"13h"},
      t3:      {args:[new Duration(23*60+59)], exp:"23h59m"},
      t4:      {args:[new Duration(11*60+59)], exp:"11h59m"},
      t5:      {args:[new Duration(1)], exp:"1m"},
      t6:      {args:[new Duration(0)], exp:"0m"}
    }
  };
  options={
    showpass:false,
    showfail:true,
    output:"console"
  };
  run_tests(test_function,activeTestSets,options);
})();
