### global ReadmooAPI: true ###

do ->
  # clientId = 'efe60b2afc3447dded5e6df6fd2bd920'
  # redirectUri = 'http://korprulu.ohread.com/test/oauth2/test/'

  originalHref = "_raoh_"

  hello.on 'auth.login', ->
    href = localStorage.getItem originalHref
    
    if href
      localStorage.removeItem originalHref
      window.location.href = href

    return


  hello.utils.extend ReadmooAPI, {
    _inst_: null
    login: (clientId, redirectUri, options) ->

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

      @config.init(clientId, redirectUri)

      if redirectUri isnt location.href
        localStorage.setItem originalHref, location.href

      @_inst_.login 'readmoo', {
        scope: @config.getScope(),
        response_type: @config.getResponseType(),
        display: @config.getDisplay()
      }

      return

    logout: (callback) ->
      @_inst_.logout 'readmoo', callback
      return

    online: ->
      session = @_inst_.getAuthResponse()
      current_time = (new Date()).getTime() / 1000

      return session and session.access_token and session.expires > current_time

    init: ->
      @_inst_ = @config.init.apply @config, arguments
      return

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
  }

  return

