### global ReadmooAPI: true ###

do ->

  highlights = (count, from, to, order) ->

    data = {}

    if count
      data.count = count
    if from
      data.from = from
    if to
      data.to = to
    if order
      datta.order = order

    return ReadmooAPI.__a__ "highlights", "GET", data

  hello.utils.extend ReadmooAPI.api, {
    highlights: highlights
  }

  return
