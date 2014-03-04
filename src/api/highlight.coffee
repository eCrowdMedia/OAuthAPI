### global ReadmooAPI: true ###

do ->

  library = (libraryId) ->
    return ReadmooAPI.__a__ "me/library/#{ libraryId }"

  library.compare = (local_ids) ->

    if local_ids and not local_ids instanceof Array
      local_ids = [local_ids]

    return ReadmooAPI.__a__(
      "me/library/compare"
      "GET"
      {local_ids: if local_ids then local_ids.join(',') else ""}
    )

  hello.utils.extend ReadmooAPI.api, {
    library: library
  }

  return
