### global ReadmooAPI: true ###

do ->

  highlights = (options) ->

    data = {}

    for k, v of options
      switch k
        when 'count'
          data.count = count
        when 'from'
          data.from = from
        when 'to'
          data.to = to
        when 'order'
          data.order = order
        when 'userId'
          break
        else
          data[k] = v

    return {
      ###
      # @param {Object} [options]
      #   @param {Number} [options.count] The number of results to return
      #   @param {String} [options.from] Return results whose order field is larger or equal to this parameter
      #   @param {String} [options.to] Return results whose order field is smaller or equal to this parameter
      #   @param {String} [options.order] Return results sorted on this field.Result are returned in descending order when to is given, and in ascending order when from is given.
      ###
      get: =>
        return @_sp.__a__ "highlights", "GET", data

      ###
      #  @param {Object} [options]
      #    @param {Number} options.id The numerical id of the desired resource
      #    @param {Number} [options.count] The number of results to return. Default is 20, max 100
      #    @param {String} [options.from] Return results whose order field is larger or equal to this parameter
      #    @param {String} [options.to] Return results whose order field is smaller or equal to this parameter
      #    @param {String} [options.order] Return results sorted on this field
      ###
      getHighlightsByUserId: =>

        if not options.userId
          throw new TypeError('An user id must be provided')

        return @_sp.__a__ "users/#{ options.userId }/highlights", "GET", data

      ###
      #  @param {Object} [options]
      #    @param {Number} options.id The numerical id of the desired resource
      #    @param {Number} [options.count] The number of results to return. Default is 20, max 100
      #    @param {String} [options.from] Return results whose order field is larger or equal to this parameter
      #    @param {String} [options.to] Return results whose order field is smaller or equal to this parameter
      #    @param {String} [options.order] Return results sorted on this field
      ###
      getHighlightsByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/highlights", "GET", data
    }

  hello.utils.extend ReadmooAPI::api, {
    highlights: highlights
  }

  return

