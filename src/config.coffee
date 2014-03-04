### global ReadmooAPI: true ###

hello.utils.extend ReadmooAPI, {
  config:
    _clientId: null
    _redirectUri: null
    _scope: ['reading', 'highlight', 'like', 'comment', 'me', 'library']
    _response_type: 'token'
    _display: 'popup'
    _others: null

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

    init: (client_id, redirect_uri) ->

      if client_id
        @setClientId client_id
      if redirect_uri
        @setRedirectUri redirect_uri

      hello.init(
        {readmoo: client_id or @getClientId()}
        {redirect_uri: redirect_uri or @getRedirectUri()}
      )

      return hello('readmoo')
}

