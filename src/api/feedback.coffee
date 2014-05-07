### global ReadmooAPI: true ###

do ->

  ###*
  #
  # @class Feedback
  ###
  feedback = (options) ->

    return {
      ###*
      # Send feedback data to the BackEnd License Server
      # @method send
      ###
      send: =>
        return @_sp.__a__ "feedback", "POST", options

      ###*
      # Send Error Words data to the BackEnd License Server
      # @method postWordsError
      # @params {Object} options
      #   @params {String} email User's
      #     email address
      #   @params {String} subject The
      #     reason for this feedback
      #   @params {String} original The
      #     words need to be fixed
      #   @params {String} report The
      #     correct words
      #   @params {String} url The
      #     url belong to location of error words in the epub book
      #
      ###
      postWordsError: ->
        options.bug = "原文:" + options.original + "  回報:" + options.report

        if options.email and options.subject and options.url
          return @send()
        else
          throw new Error "Have missing items in options"
        return
    }

  hello.utils.extend ReadmooAPI::api, {
    feedback: feedback
  }

  return



