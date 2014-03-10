### global ReadmooAPI: true ###

do ->

  CONST = {
    ORDER_TOUCHED_AT: 'touched_at'
    ORDER_CREATED_AT: 'created_at'
    ORDER_POPULAR: 'popular'
    ORDER_FRIENDS_FIRST: 'friends_first'
    FILTER_FOLLOWINGS: 'followings'
    STATES_INTERESTING: 'interesting'
    STATES_READING: 'reading'
    STATES_FINISHED: 'finished'
    STATES_ABANDONED: 'abandoned'
  }

  ###
  #
  # @class Readings
  ###
  readings = (options) ->

    data = {}

    for k, v of options
      switch k
        when 'highlights_count_from'
          data['highlights_count[from]'] = v
        when 'highlights_count_to'
          data['highlights_count[to]'] = v
        when 'userId'
          break
        else
          data[k] = v

    return {
      ###
      # @method get
      # @param {Object} [options] Options
      #   @param {String} [options.userId] user id
      #   @param {Number} [options.count] count
      #     The number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] from
      #     Return results whose order field is larger or equal to
      #     this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] to
      #     Return results whose order field is smaller or equal to
      #     this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] order
      #     Return results sorted on this field. Defaults to created_at.
      #     Results are returned in descending order when to is given,
      #     and in ascending order when from is given.
      #   @param {String} [options.filter] filter
      #     Filter a set of readings in different ways.
      #   @param {Number} [options.highlights_count_from] highlights_count[from]
      #     Only include readings which have equal or more highlights.
      #   @param {Number} [options.highlights_count_to] highlights_count[to]
      #     Only include readings which have less or equal highlights.
      #   @param {String} [options.states] states
      #     Only return readings that are in certain states. Accepts a
      #     comma separated list.
      ###
      get: =>
        return @_sp.__a__ "readings", "GET", data

      ###
      #
      # @method getReadingsByUserId
      # @param {Object} options Options
      #   @param {String} options.userId User ID
      #   @param {String} [options.author] Author
      #   @param {String} [options.title] Title
      #   @param {String} [options.identifier] Identifier
      #   @param {String} [options.book_id] Book ID
      ###
      getReadingsByUserId: =>

        if not options.userId
          throw new TypeError "An user id need provided"

        return @_sp.__a__ "users/#{ options.userId }/readings/match", "GET", data

    }

  # constant variables
  hello.utils.extend readings, CONST

  hello.utils.extend ReadmooAPI::api, {
    readings: readings
  }

  return

