scope = ['reading', 'highlight', 'like', 'comment', 'me', 'library']
redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/'
clientSecret = 'b4c5026fcd9d9eeec642d09e8402036f'
clientId =
    readmoo: 'efe60b2afc3447dded5e6df6fd2bd920'

options =
    redirect_uri: redirectUri
    client_secret: clientSecret
    scope: scope.join()
    response_type: 'code'
    display: 'page'

hello.init clientId, options

window.readmoo = readmoo = {}
readmoo.login = ->
    hello.login 'readmoo'
