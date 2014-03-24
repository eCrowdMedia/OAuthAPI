### global ReadmooAPI: true ###

do ->

  ###
  #
  # @class Books
  ###
  feedback = (options) ->

    return {
      ###
      # @method getBookById
      # @param {String} book_id Book ID
      ###
      send: =>

        data = options.data

        return @_sp.__a__ "feedback", "POST", data
    }

  hello.utils.extend ReadmooAPI::api, {
    feedback: feedback
  }

  return

