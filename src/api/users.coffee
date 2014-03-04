### global ReadmooAPI: true, hello: true ###
do ->

  me = ->
    return ReadmooAPI.__a__ 'me'

  me.library = ->
    return ReadmooAPI.api.library.compare()

  users = (id) ->
    return ReadmooAPI.__a__ "users/#{ id }"

  hello.utils.extend ReadmooAPI.api, {
    me: me
    users: users
  }

