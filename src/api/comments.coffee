### global ReadmooAPI: true ###

do ->

  CONST = {
  }

  ###
  #
  # @class Comments
  ###
  comments = (options) ->

    return {
      getCommentByCommentId: =>

        if not options.commentId
          throw new TypeError "A comment id must be provided"

        return @_sp.__a__ "comments/#{ options.commentId }", "GET"

      deleteCommentByCommentId: =>

        if not options.commentId
          throw new TypeError "A comment id must be provided"

        return @_sp.__a__ "comments/#{ options.commentId }", "DELETE"

      getCommentsByHighlightId: =>

        if not options.highlightId
          throw new TypeError "A highlight id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order'
        ]

        return @_sp.__a__ "highlights/#{ options.highlightId }/comments", "GET", data

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

