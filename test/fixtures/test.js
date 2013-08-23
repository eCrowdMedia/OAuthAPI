(function() {
  hello.subscribe('auth.login', function() {
    return console.log('login success');
  });

}).call(this);
