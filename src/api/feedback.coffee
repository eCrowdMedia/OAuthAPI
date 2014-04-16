### global ReadmooAPI: true ###

do ->

  ###*
  #
  # @class Feedback
  ###
  feedback = (options) ->

    return {
      ###*
      # @method send
      ###
      send: =>

        data = options.data

        return @_sp.__a__ "feedback", "POST", data
    }

  hello.utils.extend ReadmooAPI::api, {
    feedback: feedback
  }

  return

