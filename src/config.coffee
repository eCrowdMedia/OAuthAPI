
hello.utils.extend readmoo, {
  config:
    _clientId: null
    _redirectUri: null
    _scope: ['reading', 'highlight', 'like', 'comment', 'me', 'library']
    _response_type: 'token'
    _display: 'page'

    setClientId: (id) ->
      @_clientId = id

    getClientId: ->
      return @_clientId

    setRedirectUri: (uri) ->
      @_redirectUri = uri

    getRedirectUri: ->
      return @_redirectUri

    setScope: (scope) ->
      @_scope = scope

    getScope: ->
      return @_scope

    setResponseType: (type) ->
      @_response_type = type

    getResponseType: ->
      return @_response_type

    setDisplay: (display) ->
      @_display = display

    getDisplay: ->
      return @_display

    init: ->
      hello.init {readmoo: @getClientId()}, {redirect_uri: @getRedirectUri()}
      return
}
