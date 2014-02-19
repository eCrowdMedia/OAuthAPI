
initConfig =
  readmoo:
    name: 'Readmoo OAuth API'
    oauth:
      version: 2
      auth: 'https://readmoo.com/member/oauth'
      logout: 'https://readmoo.com/member/oauth/sign_out'
    scope:
      reading: 'reading'
      highlight: 'highlight'
      like: 'like'
      comment: 'comment'
      library: 'library'
    logout: (opt) ->
      callback = opt.callback

      xhr = new XMLHttpRequest()

      xhr.onreadystatechange = ->

        if xhr.readyState is xhr.DOME
          switch xhr.status
            when 200
              callback(true)
            else
              callback(false)

        return

      xhr.open 'GET', @oauth.logout, true
      xhr.send()

hello.init initConfig

