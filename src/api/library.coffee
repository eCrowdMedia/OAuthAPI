### global ReadmooAPI: true ###

do ->

  library = (libraryId) ->

    data = {}

    return {
      ###
      # @param {Object} [options] Options
      #   @param {Number} [options.count] The number of result to return Default is 20, max 100
      #   @param {Number} [options.from] Return results whose order field is larger or equal to this parameter 
      #   @param {String} [options.to] Return results whose order field is smaller or equal to this parameter
      #   @param {String} [options.order] Return results sorted on this field
      #   @param {String} [option.price_segments] Filter books by price segments
      ###
      get: =>
        if not libraryId
          throw new TypeError('A library id need provided')

        return @_sp.__a__ "me/library/#{ libraryId }"
      
      ###
      # @param {Object} [options] Options
      #   @param {String} [options.author] The name of the author
      #   @param {String} [options.title] The title of the book
      #   @param {String} [options.identifier] A unique identifier of the book
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
