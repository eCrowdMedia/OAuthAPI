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
      #   @param {Number} [options.count]
      #   @param {String} [options.from]
      #   @param {String} [options.to]
      #   @param {String} [options.order]
      ###
      get: =>
        return @_sp.__a__ "highlights", "GET", data

      getHighlightsByUserId: =>

        if not options.userId
          throw new TypeError('An user id must be provided')

        return @_sp.__a__ "users/#{ options.userId }/highlights", "GET", data

      getHighlightsByReadingId: =>
        #
    }

  hello.utils.extend ReadmooAPI::api, {
    highlights: highlights
  }

  return

