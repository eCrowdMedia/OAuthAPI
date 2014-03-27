
_util =
  paramFilter: (options = {}, includes) ->

    data = {}

    for n in includes
      if options.hasOwnProperty n
        v = options[n]
        if v instanceof Object or v instanceof Array
          v = JSON.stringify v

        data[n] = v

    return data

