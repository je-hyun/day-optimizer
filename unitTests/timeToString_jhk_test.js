//TODO: rewrite tests to use jhk_test.

(function(){
  var activeTestSets, options;
  function test_function(arg_array){
    return arg_array[0].toString();
  }
  activeTestSets = {
      testSet24h: {
        settings: function(){
          Time.prototype.mode = "24h";
          Time.prototype.simple = false;
        },
        midnight: {args:[new Time(0,"12h")], exp:"00:00"},
        noon:  {args:[new Time(12*60)], exp:"12:00"},
        t0:    {args:[new Time(1*60)], exp:"01:00"},
        t1:    {args:[new Time(12*60+59)], exp:"12:59"},
        t2:    {args:[new Time(13*60)], exp:"13:00"},
        t3:    {args:[new Time(23*60+59)], exp:"23:59"}
      },
      testSet24hS: {
        settings: function(){
          Time.prototype.mode = "24h";
          Time.prototype.simple = true;
        },
        midnight: {args:[new Time(0,"12h")], exp:"0:00"},
        noon:  {args:[new Time(12*60,"24h")], exp:"12:00"},
        t0:    {args:[new Time(1*60,"24h")], exp:"1:00"},
        t1:    {args:[new Time(12*60+59,"24h")], exp:"12:59"},
        t2:    {args:[new Time(13*60,"24h")], exp:"13:00"},
        t3:    {args:[new Time(23*60+59,"24h")], exp:"23:59"}
      },
      testSet12h: {
        settings: function(){
          Time.prototype.mode = "12h";
          Time.prototype.simple = false;
        },
        midnight: {args:[new Time(0,"12h")], exp:"12:00am"},
        noon:  {args:[new Time(12*60,"12h")], exp:"12:00pm"},
        t0:    {args:[new Time(1*60,"12h")], exp:"1:00am"},
        t1:    {args:[new Time(12*60+59,"12h")], exp:"12:59pm"},
        t2:    {args:[new Time(13*60,"12h")], exp:"1:00pm"},
        t3:    {args:[new Time(23*60+59,"12h")], exp:"11:59pm"},
        t4:    {args:[new Time(11*60+59,"12h")], exp:"11:59am"}
      },
      testSet12hS: {
        settings: function(){
          Time.prototype.mode = "12h";
          Time.prototype.simple = true;
        },
        midnight: {args:[new Time(0,"12h")], exp:"12am"},
        noon:  {args:[new Time(12*60,"12h")], exp:"12pm"},
        t0:    {args:[new Time(1*60,"12h")], exp:"1am"},
        t1:    {args:[new Time(12*60+59,"12h")], exp:"12:59pm"},
        t2:    {args:[new Time(13*60,"12h")], exp:"1pm"},
        t3:    {args:[new Time(23*60+59,"12h")], exp:"11:59pm"},
        t4:    {args:[new Time(11*60+59,"12h")], exp:"11:59am"}
      }
    };
  options={
    showpass:true,
    showfail:true,
    output:"console"
  };
  run_tests(test_function,activeTestSets,options);
})();
