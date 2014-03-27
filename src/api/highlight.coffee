### global ReadmooAPI: true ###

do ->

  highlights = (options) ->

    return {
      ###
      # @param {Object} [options]
      #   @param {Number} [options.count] The number of results to return
      #   @param {String} [options.from] Return results whose order field is larger or equal to this parameter
      #   @param {String} [options.to] Return results whose order field is smaller or equal to this parameter
      #   @param {String} [options.order] Return results sorted on this field.Result are returned in descending order when to is given, and in ascending order when from is given.
      ###
      get: =>

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

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

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

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

      createHighlightByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'highlight[content]', 'highlight[locators]', 'highlight[position]',
          'highlight[highlight_at]', 'highlight[post_to[][id]]', 'comment[content]'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/highlights", "POST", data
        

      deleteHighlightByHighlightId: =>

        if not options.highlightId
          throw new TypeError "A highlight id must be provided"

        return @_sp.__a__ "highlights/#{ options.highlightId }", "DELETE"
    }

  hello.utils.extend ReadmooAPI::api, {
    highlights: highlights
  }

  return

