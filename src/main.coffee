### global readmoo: true ###

if location.hash
    location.hash = location.hash.replace /(^token|&token)=/, (match) ->
        return "#{ if /^&/.test match then '&' : '' }access_token="

SCOPE = ['reading', 'highlight', 'like', 'comment', 'me', 'library']
# clientId = 'efe60b2afc3447dded5e6df6fd2bd920'
# redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/'

readmoo.scope = SCOPE
readmoo.login = (clientId, redirectUrl, scope = SCOPE.join(','), callback) ->

    _clientId = clientId
    _redirectUrl = redirectUrl

    if not _clientId
      throw new Error 'Need "Client ID"'

    if not _redirectUrl
      throw new Error 'Need "Redirect URL"'

    hello.init {readmoo: _clientId}, {redirect_uri: _redirectUrl}

    if callback
      hello.on 'auth.login', (auth) ->
        callback hello(auth.network).api
        return

    hello.login 'readmoo', {
      scope: scope,
      response_type: 'token',
      display: 'page'
    }
    return

readmoo.logout = (callback) ->

    if callback
      hello.on('auth.logout', callback)

    hello('readmoo').logout()

readmoo.api = ->
    return hello('readmoo').api

