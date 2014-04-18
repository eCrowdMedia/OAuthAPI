### global ReadmooAPI: true ###

do ->

  CONST = {
  }

  ###*
  #
  # @class Comments
  ###
  comments = (options) ->

    return {
      ###*
      # @method getCommentByCommentId
      #   @param {String} options.commentId The numberical id of the desired resource.
      ###
      getCommentByCommentId: =>

        if not options.commentId
          throw new TypeError "A comment id must be provided"

        return @_sp.__a__ "comments/#{ options.commentId }", "GET"
      ###*
      # @method getCommentByCommentId
      #   @param {String} options.commentId The numberical id of the desired resource.
      ###
      deleteCommentByCommentId: =>

        if not options.commentId
          throw new TypeError "A comment id must be provided"

        return @_sp.__a__ "comments/#{ options.commentId }", "DELETE"
      ###*
      # @method getCommentsByHighlightId
      # @param {Object} [options]
      #   @param {String} options.highlightId The
      #     numerical id of the desire resource.
      #   @param {Number} [options.count] count
      #     The number of results to return
      #   @param {Date} [options.from] from
      #     Return results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] to
      #     Return results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] order
      #     Return results sorted on this field.Result are returned in descending order when to is given, and in ascending order when from is given.
      ###
      getCommentsByHighlightId: =>

        if not options.highlightId
          throw new TypeError "A highlight id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "highlights/#{ options.highlightId }/comments", "GET", data
      ###*
      # @method createCommentsByHighlightId
      # @param {Object} [options]
      #   @param {String} options.highlightId The
      #     numerical id of the desire resource.
      #   @param {Sting} [options.comment[content]] comment[content]
      #     The comment text
      #   @param {Date} [options.comment[posted_at]] comment[posted_at]
      #     The time the comment was created. This is used to create comments after they were posted.
      #     Recommended date format is ISO 8601.
      ###
      createCommentByHighlightId: =>

        if not options.highlightId
          throw new TypeError "A highlight id must be provided"

        data = _util.paramFilter options, [
          'comment[content]', 'comment[posted_at]'
        ]

        return @_sp.__a__ "highlights/#{ options.highlightId }/comments", "POST", data

    }

  # constant variables
  hello.utils.extend comments, CONST

  hello.utils.extend ReadmooAPI::api, {
    comments: comments
  }

  return

