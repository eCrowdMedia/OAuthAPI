
_util =
  paramFilter: (options = {}, includes) ->

    data = {}

    for n in includes
      if options.hasOwnProperty n
        v = options[n]
        if typeof v is 'object'
          v = JSON.stringify v

        data[n] = v

    return data

