
_util =
  paramFilter: (options, includes) ->

    data = {}

    for n in includes
      if options.hasOwnProperty n
        data[n] = options[n]

    return data

