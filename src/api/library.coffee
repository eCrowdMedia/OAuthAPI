### global ReadmooAPI: true ###

do ->
  ###*
  #
  # @class Library
  ###
  library = (libraryId) ->

    data = {}

    return {
      ###*
      # @method get
      # @param {String} libraryId
      #   The numerical id of the desired resource.
      ###
      get: =>
        if not libraryId
          throw new TypeError('A library id need provided')

        return @_sp.__a__ "me/library/#{ libraryId }"

      ###*
      #  @method compare
      #   @param {String} local_ids
      #     A comma separate list of library item id's that the client has locally.
      ###
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
