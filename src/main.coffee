### global readmoo: true ###

SCOPE = ['reading', 'highlight', 'like', 'comment', 'me', 'library']
# clientId = 'efe60b2afc3447dded5e6df6fd2bd920'
# redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/'

hello.on 'auth.login', ->
  console.log arguments

hello.utils.extend readmoo, {
  login: (clientId, redirectUri, options) ->

    if clientId
      @config.setClientId clientId

    if redirectUri
      @config.setRedirectUri redirectUri

    if options
      for k, v of options
        if options.hasOwnProperty k
          switch k
            when 'scope'
              @config.setScope v
            when 'responseType'
              @config.setResponseType v
            when 'display'
              @config.setDisplay v

    if clientId or redirectUri
      @config.init()

    hello.login 'readmoo', {
      scope: @config.getScope(),
      response_type: @config.getResponseType(),
      display: @config.getDisplay()
    }

    return

  logout: (callback) ->
    hello.logout 'readmoo', callback

  init: ->
    @config.init()
    return

  # custome api
  api: ->
    return hello.api
}

