### global ReadmooAPI: true, hello: true ###
do ->

  me = ->
    return {
      get: =>
        return @_sp.__a__ 'me'
    }

  users = (userId) ->
    return {
      get: =>
        if not userId
          throw new TypeError "An user id need provided"

        return @_sp.__a__ "users/#{ userId }"
    }

  hello.utils.extend ReadmooAPI.prototype.api, {
    me: me
    users: users
  }

