### global ReadmooAPI: true ###

do ->

  ###*
  #
  # @class Readings
  ###
  bookmarks = (options) ->

    return {
      ###*
      # Get popular bookmarks.
      #
      # @method get
      # @param {Object} [options] Options
      #   @param {Number} [options.count] The
      #     number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] Return
      #     results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] Return
      #     results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] Return
      #     results sorted on this field. Defaults to created_at.Results are returned in descending order
      #     when to is given, and in ascending order when from is given.
      ###
      get: =>

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "/bookmarks", "GET", data

      ###*
      # Get bookmarks by reading id.
      #
      # @method getBookmarksByReadingId
      # @param {Object} options Options
      #   @param {String} options.readingId Reading id.
      #   @param {Number} [options.count] The
      #     number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] Return
      #     results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] Return
      #     results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] Return
      #     results sorted on this field. Defaults to created_at.Results are returned in descending order
      #     when to is given, and in ascending order when from is given.
      ###
      getBookmarksByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/bookmarks", "GET", data

      ###*
      # Get bookmarks by user id.
      #
      # @method getBookmarksByUserId
      # @param {Object} options Options
      #   @param {String} options.userId User id
      #   @param {Number} [options.count] The
      #     number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] Return
      #     results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] Return
      #     results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] Return
      #     results sorted on this field. Defaults to created_at.Results are returned in descending order
      #     when to is given, and in ascending order when from is given.
      ###
      getBookmarksByUserId: =>

        if not options.userId
          throw new TypeError "An user id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "users/#{ options.userId }/bookmarks", "GET", data

      ###*
      # Create bookmark by reading id.
      #
      # @method createBookmarkByReadingId
      # @param {Object} options Options
      #   @param {String} options.readingId Reading id
      #   @param {String} options.bookmark[content〕 Bookmark
      #     content.
      #   @param {Object} options.bookmark[locators〕 Bookmark
      #     locators
      #     @param {String} options.bookmark[locators〕.cfi Bookmark
      #       CFI position.
      #     @param {Number} options.bookmark[locators〕.position Bookmark
      #       position percent number.
      #     @param {String} options.bookmark[locators〕.title Bookmark
      #       title.
      #   @param {Number} options.bookmark[position〕 Bookmark
      #     position percent number.
      ###
      createBookmarkByReadingId: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided."

        data = _util.paramFilter options, [
          'bookmark[content]', 'bookmark[locators]',
          'bookmark[position]', 'bookmark[bookmarked_at]',
          'bookmark[device]'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/bookmarks", "POST", data

      ###*
      # Delete bookmark by bookmark id.
      #
      # @method deleteBookmarkByBookmarkId
      # @param {Object} [options]
      #   @param {String} options.highlightId The
      #     numerical id of the desire resource.
      ###
      deleteBookmarkByBookmarkId: =>

        if not options.bookmarkId
          throw new TypeError "A bookmark id must be provided"

        return @_sp.__a__ "bookmarks/#{ options.bookmarkId }", "DELETE"

    }

  hello.utils.extend ReadmooAPI::api, {
    bookmarks: bookmarks
  }

  return

