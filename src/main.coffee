### global Configuration: true ###
### jshint -W004: true ###

# clientId = 'efe60b2afc3447dded5e6df6fd2bd920'
# redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/'

_ORIGINAL_HREF = "_raoh_"

do ->
  href = localStorage.getItem _ORIGINAL_HREF

  if href
    localStorage.removeItem _ORIGINAL_HREF
    window.location.href = href

  return


class ReadmooAPI
  _inst_: null
  constructor: (clientId, redirectUri, options) ->
    @config = new Configuration(clientId, redirectUri, options)
    @_inst_ = @config._inst_
    @api._sp = @

  login: (callback) ->

    if @config.getRedirectUri() isnt location.href
      localStorage.setItem _ORIGINAL_HREF, location.href

    @_inst_.login 'readmoo', {
      scope: @config.getScope(),
      response_type: @config.getResponseType(),
      display: @config.getDisplay()
    }, callback

    return

  logout: (callback) ->
    @_inst_.logout 'readmoo', callback
    return

  online: ->
    session = @_inst_.getAuthResponse()
    current_time = (new Date()).getTime() / 1000

    return session and session.access_token and session.expires > current_time

  on: ->
    @_inst_.on.apply @_inst_, arguments
    return @

  off: ->
    @_inst_.off.apply @_inst_, arguments
    return @

  # custome api
  __a__: ->
    args = Array.prototype.slice.call arguments
    return @_inst_.api.apply(@_inst_, args)

  api: {}

