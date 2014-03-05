### global ReadmooAPI: true ###

do ->

  highlights = (count, from, to, order) ->

    data = {}

    if count
      data.count = count
    if from
      data.from = from
    if to
      data.to = to
    if order
      data.order = order

    return {
      get: =>
        return @_sp.__a__ "highlights", "GET", data

      users: (userId) =>

        if not userId
          throw new TypeError('An user id must be provided')

        return @_sp.__a__ "users/#{ userId }/highlights", "GET", data
    }

  hello.utils.extend ReadmooAPI::api, {
    highlights: highlights
  }

  return

