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

  ###*
  #
  # @class Readings
  ###
  readings = (options) ->

    return {
      ###*
      # @method get
      # @param {Object} [options] Options
      #   @param {Number} [options.count] The
      #     number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] Return
      #     results whose order field is larger or equal to
      #     this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] Return
      #     results whose order field is smaller or equal to
      #     this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] Return
      #     results sorted on this field. Defaults to created_at.
      #     Results are returned in descending order when to is given,
      #     and in ascending order when from is given.
      #   @param {String} [options.filter] Filter
      #     a set of readings in different ways.
      #   @param {Number} [options.highlights_count[from]] Only
      #     include readings which have equal or more highlights.
      #   @param {Number} [options.highlights_count[to]] Only
      #     include readings which have less or equal highlights.
      #   @param {String} [options.states] Only
      #     return readings that are in certain states. Accepts a
      #     comma separated list.
      ###
      get: =>
        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order', 'filter', 'highlights_count[from]',
          'highlights_count[to]', 'states'
        ]

        return @_sp.__a__ "readings", "GET", data

      ###*
      # @method getReadingsByUserIdWithMatch
      # @param {Object} [options] Options
      #   @param {String} options.userId user id
      #   @param {Number} [options.author] The
      #     name of the author
      #   @param {Date} [options.title] The
      #     title of the book
      #   @param {Date} [options.identifier] A
      #     unique identifier of the book.It is currently validated as an ISBN, though were are
      #     looking into opening up to more generic identifiers like URLs or any arbitrary string
      #   @param {String} [options.book_id] The
      #     id of the book
      ###
      getReadingsByUserIdWithMatch: =>

        if not options.userId
          throw new TypeError "An user id need provided"

        data = _util.paramFilter options, [
          'author', 'title', 'identifier', 'book_id'
        ]

        return @_sp.__a__ "users/#{ options.userId }/readings/match", "GET", data

      ###*
      # @method getReadingByReadingId
      # @param {Object} options Options
      #   @param {String} options.readingId reading id
      ###
      getReadingByReadingId: =>

        if not options.readingId
          throw new TypeError "An user id must be provided"

        return @_sp.__a__ "readings/#{ options.readingId }"

      ###*
      # @method getReadingsByUserId
      # @param {Object} options Options
      #   @param {String} options.userId user id
      #   @param {Number} [options.count] The
      #     number of results to return. Default is 20, max 100.
      #   @param {Date} [options.from] Return
      #     results whose order field is larger or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {Date} [options.to] Return
      #     results whose order field is smaller or equal to this parameter. For dates, the format is ISO 8601.
      #   @param {String} [options.order] Return
      #     results sorted on this field. Defaults to created_at.Results are returned in descending order
      #     when to is given, and in ascending order when from is given.
      #   @param {String} [options.filter] Filter
      #     a set of readings in different ways.
      #   @param {Number} [options.highlights_count[from]] Only
      #     include readings which have equal or more highlights.
      #   @param {Number} [options.highlights_count[to]] Only
      #     include readings which have less or equal highlights.
      #   @param {String} [options.states] Only
      #     return readings that are in certain states. Accepts a
      #     comma separated list.
      ###
      getReadingsByUserId: =>

        if not options.userId
          throw new TypeError "A book id must be provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order', 'filter', 'highlights_count[from]',
          'highlights_count[to]', 'states'
        ]

        return @_sp.__a__ "users/#{ options.userId }/readings", "GET", data

      ###*
      # @method createReadingByBookId
      # @param {Object} options Options
      #   @param {String} options.bookId book id.
      #   @param {String} options.reading[state］ The
      #     state of the reading.
      #   @param {Boolean} [options.reading[private]] readinfFlag
      #     to indicate if the reading is private or public.
      #   @param {Date} [options.reading[started_at]] Date
      #     which says when this reading was started. Mainly for use
      #     when readings are added after they happened. This parameter can only
      #     be used if the state of the reading is reading.
      #   @param {Date} [options.reading[finished_at]] Date
      #     which says when this reading was started. Mainly for use
      #     when readings are added after they happened. This parameter can only
      #     be used if the state of the reading is finished.
      #   @param {String} [options.reading[abandoned_at]] Date
      #     which says when this reading was abandoned. Mainly for use
      #     when readings are added after they happened. This parameter can only
      #     be used if the state of the reading is abandoned.
      #   @param {Number} [options.reading[vid_id]] If
      #     the reading was recommended by another user you can credit them by
      #     including their user id.
      #   @param {Number} [options.reading[recommended]] Flag
      #     to indicate if the reader recommands the book.
      #   @param {String} [options.reading[closing_remark]] A
      #     closing remark of the book. Only visible if book is finished or abandoned.
      #   @param {String} [options.reading[post_to[][id]] This
      #     paraeter is used for sharing to other networks.
      ###
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

      ###*
      # @method updateReadingByReadingId
      # @param {Object} options Options
      #   @param {String} options.reading_id reading id
      #   @param {String} [options.reading[state]] The
      #     state of the reading
      #   @param {Boolean} [options.reading[private]] Flag
      #     to indicate if the reading is private or public
      #   @param {Date} [options.reading[started_at]] Date
      #     which says when this reading was started. Mainly for use when readings are added after they happened.
      #     This parameter can only be used if the state of the reading is reading.
      #   @param {Date} [options.reading[finished_at]] Date
      #     which says when this reading was finished. Mainly for use when readings are added after they happened.
      #     This parameter can only be used if the state of the reading is finished.
      #   @param {Date} [options.reading[abandoned_at]] Date
      #     which says when this reading was abandoned. Mainly for use when readings are added after they happened.
      #     This date can only be used if the state of the reading is abandoned.
      #   @param {String} [options.reading[via_id]] If
      #     the reading was recommended by another user you can credit them by including their user id.
      #   @param {Boolean} [options.reading[recommended]] Flag
      #     to indicate if the reader recommends the book
      #   @param {String} [options.reading[closing_remark]] A
      #     closing remark of the book. Only visible if book is finished or abandoned
      #   @param {String} [options.reading_post_to()(id)] This
      #     parameter is used for sharing to other networks
      ###
      updateReadingByReadingId: =>
        state = options['reading[state]']
        readingId = options.reading_id

        if not readingId
          throw new TypeError "A reading id need to provided"

        if not state
          throw new TypeError "A state need to be provided"

        data = _util.paramFilter options, [
          'reading[state]', 'reading[private]', 'reading[started_at]',
          'reading[finished_at]', 'reading[abandoned_at]', 'reading[via_id]',
          'reading[recommended]', 'reading[closing_remark]', 'reading[post_to[][id]]'
        ]

        return @_sp.__a__ "readings/#{ readingId }", "PUT", data

      ###*
      # @method finishReadingByReadingId
      ###
      finishReadingByReadingId: ->
        options['reading[state]'] = CONST.STATE_FINISHED
        options['reading[finished_at]'] = (new Date()).toISOString()
        return @updateReadingByReadingId()

      ###*
      # @method abandonedReadingByReadingId
      ###
      abandonedReadingByReadingId: ->
        options['reading[state]'] = CONST.STATE_ABANDONED
        options['reading[abandoned_at]'] = (new Date()).toISOString()
        return @updateReadingByReadingId()

      ###*
      # @method getReadingByBookId
      # @param {Object} options Options
      #   @param {String} options.bookId book id
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
      #   @param {Number} [options.highlights_count[from] highlights_count[from]
      #     Only include readings which have equal or more highlights.
      #   @param {Number} [options.highlights_count[to]] highlights_count[to]
      #     Only include readings which have less or equal highlights.
      #   @param {String} [options.states] states
      #     Only return readings that are in certain states. Accepts a
      #     comma separated list.
      ###
      getReadingsByBookId: =>

        if not options.bookId
          throw new TypeError "A book id need provided"

        data = _util.paramFilter options, [
          'count', 'from', 'to', 'order', 'filter',
          'highlights_count[from]', 'highlights_count[to]',
          'states'
        ]

        return @_sp.__a__ "books/#{ options.bookId }/readings", "GET", data


      ###*
      # @method ping
      # @param {Object} options Options
      #   @param {String} options.readingId reading id.
      #   @param {String} options.ping[identifier］ A
      #     unique identifier that is used to group pings together to the same period when processed.
      #   @param {Number} options.ping[progress］ The
      #     progress of the reading session. In percent, between 0.0 and 1.0.
      #   @param {String} options.ping[cfi］ The
      #     cfi info of the reading.
      #   @param {Number} options.ping[duration］ The
      #     duration of the reading session. In seconds.
      #   @param {Date} [options.ping[occurred_at]] When
      #     the session occured. Recommended date format is ISO 8601.
      #   @param {Number} [options.ping[lat]] The
      #     latitute coordinates of the position when reading.
      #   @param {Number} [options.ping[lng]] The
      #     longitude coordinates of the position when reading.
      ###
      ping: =>

        if not options.readingId
          throw new TypeError "A reading id must be provided"

        data = _util.paramFilter options, [
          'ping[identifier]', 'ping[progress]', 'ping[duration]',
          'ping[occurred_at]', 'ping[lat]', 'ping[lng]', 'ping[cfi]'
        ]

        return @_sp.__a__ "readings/#{ options.readingId }/ping", "POST", data
    }

  # constant variables
  hello.utils.extend readings, CONST

  hello.utils.extend ReadmooAPI::api, {
    readings: readings
  }

  return

