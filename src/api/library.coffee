### global ReadmooAPI: true ###

do ->

  library = (libraryId) ->

    data = {}

    return {
      get: =>
        if not libraryId
          throw new TypeError('A library id need provided')

        return @_sp.__a__ "me/library/#{ libraryId }"

      compare: (local_ids) =>

        if not local_ids
          local_ids = []

        if not local_ids instanceof Array
          local_ids = [local_ids]

        data.local_ids = if local_ids then local_ids.join(',') else ''

        return @_sp.__a__ "me/library/compare", "GET", data
    }

  hello.utils.extend ReadmooAPI::api, {
    library: library
  }

  return
