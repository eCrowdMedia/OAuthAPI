### global ReadmooAPI: true ###

do ->

  ###*
  #
  # @class Books
  ###
  books = (options) ->

    return {
      ###*
      # @method getBookByBookId
      #  @param {String} options.book_id Book ID
      ###
      getBookByBookId: =>
        if not options.book_id
          throw new TypeError "A book id need provided"

        return @_sp.__a__ "books/#{ options.book_id }"
    }

  hello.utils.extend ReadmooAPI::api, {
    books: books
  }

  return

