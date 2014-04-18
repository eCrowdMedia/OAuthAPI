### global ReadmooAPI: true ###

do ->
  ###*
  #
  # @class Highlights
  ###
  highlights = (options) ->

    return {
      ###*
      # @method get
      # @param {Object} [options]
      #   @param {Number} [options.count] count
      #     The number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] from
      #     Return results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] to
      #     Return results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] order
      #     Return results sorted on this field.Result are returned in descending order when to is given, and in ascending order when from is given.
      ###
      get: =>

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "highlights", "GET", data

      ###*
      # @method getHighlightsByUserId
      # @param {Object} [options]
      #   @param {String} options.userId The
      #     numerical id of the desire resource.
      #   @param {Number} [options.count] count
      #     The number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] from
      #     Return results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] to
      #     Return results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] order
      #     Return results sorted on this field. Result are returned in descending order when to is given, and in
      #     ascending order when from is given.
      ###
      getHighlightsByUserId: =>

        if not options.userId
          throw new TypeError('An user id must be provided')

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "users/#{ options.userId }/highlights", "GET", data

      ###*
      # @method getHighlightsByReadingId
      # @param {Object} [options]
      #   @param {String} options.readingId The
      #     numerical id of the desire resource.
      #   @param {Number} [options.count] count
      #     The number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] from
      #     Return results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] to
      #     Return results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] order
      #     Return results sorted on this field.Result are returned in descending order when to is given, and in ascending order when from is given.
      ###
      getHighlightsByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/highlights", "GET", data

      ###*
      # @method createHighlightByReadingId
      # @param {Object} [options]
      #   @param {String} options.readingId The
      #     numerical id of the desire resource.
      #   @param {Number} [options.highlight[contet]] highlight[content]
      #     The content of the highlight.
      #   @param {String} [options.highlight[locators]] highlight[locators]
      #     Locators are used to determine the exact location of the highlight in a larger
      #     piece of text. This is a custom JSON structure that contains a few different data points.
      #   @param {String} [options.highlight[position]] highlight[position]
      #     The position in the book where this highlight was made as a value 0.0 - 1.0.
      #   @param {String} [options.highlight[highlighted_at]] highlight[highlighted_at]
      #     The time the highlight was created. This is used to create highlights after they were posted.
      #     Recommended date format is ISO 8601.
      #   @param {String} [options.highlight[post_to[][id]] highlight[post_to[][id]]
      #     This parameter is used for sharing to other networks.
      #   @param {String} [options.comment[content] comment[content]
      #     The comment text.
      ###
      createHighlightByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'highlight[content]', 'highlight[locators]', 'highlight[position]',
          'highlight[highlight_at]', 'highlight[post_to[][id]]', 'comment[content]'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/highlights", "POST", data

      ###*
      # @method deleteHighlightByHighlightId
      # @param {Object} [options]
      #   @param {String} options.highlightId The
      #     numerical id of the desire resource.
      ###
      deleteHighlightByHighlightId: =>

        if not options.highlightId
          throw new TypeError "A highlight id must be provided"

        return @_sp.__a__ "highlights/#{ options.highlightId }", "DELETE"
    }

  hello.utils.extend ReadmooAPI::api, {
    highlights: highlights
  }

  return

