(function() {
  var clientId, clientSecret, getToken, options, readmoo, redirectUri, scope;

  scope = ['reading', 'highlight', 'like', 'comment', 'me', 'library'];

  redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/';

  clientSecret = 'b4c5026fcd9d9eeec642d09e8402036f';

  clientId = {
    readmoo: 'efe60b2afc3447dded5e6df6fd2bd920'
  };

  options = {
    redirect_uri: 'http://korprulu.ohread.com/test/oauth2/test/',
    scope: scope.join()
  };

  hello.init(clientId, scope);

  getToken = function() {
    console.log('login success');
    console.log(arguments);
    return hello.login('readmoo', {
      'redirect_uri': redirectUri,
      'response_type': 'token',
      'client_secret': clientSecret
    });
  };

  window.readmoo = readmoo = {};

  readmoo.login = function() {
    return hello.login('readmoo', {
      'response_type': 'code'
    }, getToken);
  };

}).call(this);
