(function() {
  hello.subscribe('auth.login', function() {
    return console.log(arguments);
  });

}).call(this);
