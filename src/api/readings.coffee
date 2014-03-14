### global ReadmooAPI: true ###

do ->

  CONST = {
    ORDER_TOUCHED_AT: 'touched_at'
    ORDER_CREATED_AT: 'created_at'
    ORDER_POPULAR: 'popular'
    ORDER_FRIENDS_FIRST: 'friends_first'

    FILTER_FOLLOWINGS: 'followings'

    STATE_INTERESTING: 'interesting'
    STATE_READING: 'reading'
    STATE_FINISHED: 'finished'
    STATE_ABANDONED: 'abandoned'
  }

  ###
  #
  # @class Readings
  ###
  readings = (options) ->

    return {
      ###
      # @method get
      # @param {Object} [options] Options
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
      #   @param {Number} [options.highlights_count[from]] highlights_count[from]
      #     Only include readings which have equal or more highlights.
      #   @param {Number} [options.highlights_count[to]] highlights_count[to]
      #     Only include readings which have less or equal highlights.
      #   @param {String} [options.states] states
      #     Only return readings that are in certain states. Accepts a
      #     comma separated list.
      ###
      get: =>
        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order', 'filter', 'highlights_count[from]',
          'highlights_count[to]', 'states'
        ]

        return @_sp.__a__ "readings", "GET", data

      ###
      #
      # @method getReadingsByUserId
      # @param {Object} [options] Options
      #   @param {String} options.userId user id
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
      getReadingsByUserIdWithMatch: =>

        if not options.userId
          throw new TypeError "An user id need provided"

        data = _util.paramFilter options, [
          'author', 'title', 'identifier', 'book_id'
        ]

        return @_sp.__a__ "users/#{ options.userId }/readings/match", "GET", data

      createReadingByBookId: =>

        state = options['reading[state]']
        bookId = options.book_id

        if not bookId
          throw new TypeError "A book id need to provided"

        if not state or \
          not (state is CONST.STATE_INTERESTING or \
            state is CONST.STATE_READING)

          throw new TypeError "State value must be `interesting` or `reading`"

        data = _util.paramFilter options, [
          'reading[state]', 'reading[private]', 'reading[started_at]',
          'reading[finished_at]', 'reading[abandoned_at]', 'reading[via_id]',
          'reading[recommended]', 'reading[closing_remark]', 'reading[post_to[][id]]'
        ]

        return @_sp.__a__ "books/#{ bookId }/readings", "POST", data

      updateReadingByReadingId: =>
        state = options['reading[state]']
        readingId = options.reading_id

        if not readingId
          throw new TypeError "A book id need to provided"

        if not state
          throw new TypeError "A state need to be provided"

        data = _util.paramFilter options, [
          'reading[state]', 'reading[private]', 'reading[started_at]',
          'reading[finished_at]', 'reading[abandoned_at]', 'reading[via_id]',
          'reading[recommended]', 'reading[closing_remark]', 'reading[post_to[][id]]'
        ]

        return @_sp.__a__ "readings/#{ readingId }", "POST", data

      finishReadingByReadingId: ->
        options['reading[state]'] = CONST.STATE_FINISHED
        options['reading[finished_at]'] = (new Date()).toISOString()
        return @updateReadingByReadingId()

      abandonedReadingByReadingId: ->
        options['reading[state]'] = CONST.STATE_ABANDONED
        options['reading[abandoned_at]'] = (new Date()).toISOString()
        return @updateReadingByReadingId()

    }

  # constant variables
  hello.utils.extend readings, CONST

  hello.utils.extend ReadmooAPI::api, {
    readings: readings
  }

  return

