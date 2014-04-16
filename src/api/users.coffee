### global ReadmooAPI: true, hello: true ###
do ->
  ###*
  #
  # @class me
  ###
  me = ->
    return {
      ###*
      #
      #@method get
      ###
      get: =>
        return @_sp.__a__ 'me'
    }

  ###*
  #
  # @class users
  ###
  users = (userId) ->
    return {
      ###*
      #
      # @method get
      # @param {String} userId user id.
      ###
      get: =>
        if not userId
          throw new TypeError "An user id need provided"

        return @_sp.__a__ "users/#{ userId }"
    }

  hello.utils.extend ReadmooAPI.prototype.api, {
    me: me
    users: users
  }

