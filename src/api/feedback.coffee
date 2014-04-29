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

        data = options.data

        return @_sp.__a__ "feedback", "POST", data

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
      postWordsError: =>
        # console.log('which is this: ' + JSON.stringify(this.api));
        bug = "原文：" + options.data.original + "<br />\n回報：" + options.data.report
        options.data.bug = bug

        # console.log(params.data);
        if options.data.email isnt null and options.data.subject isnt null and options.data.url isnt null
          @send()
        else
          console.error "have missing items in params"
        return
    }

  hello.utils.extend ReadmooAPI::api, {
    feedback: feedback
  }

  return



