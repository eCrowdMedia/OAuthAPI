### jshint -W004: true ###

class Configuration
  _inst_: null
  _clientId: null
  _redirectUri: null
  _scope: ['reading', 'highlight', 'like', 'comment', 'me', 'library'].join(',')
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
    if scope instanceof Array
      _scope = scope.join(',')
    else
      _scope = scope

    @_scope = _scope

  getScope: ->
    return @_scope.split(',')

  setResponseType: (type) ->
    @_response_type = type

  getResponseType: ->
    return @_response_type

  setDisplay: (display) ->
    @_display = display

  getDisplay: ->
    return @_display

  constructor: (@_clientId, @_redirectUri, options) ->

    if options
      if options.scope
        @setScope options.scope
      if options.display
        @setDisplay options.display
      if options.responseType
        @setResponseType options.responseType

    hello.init(
      {readmoo: @_clientId}
      {redirect_uri: @_redirectUri}
    )

    @_inst_ = hello('readmoo')

