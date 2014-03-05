do (hello) ->
  readmooInit =
    readmoo:
      name: 'Readmoo'
      base: 'https://api.readmoo.com/'
      oauth:
        version: 2
        auth: 'https://readmoo.com/member/oauth'
        logout: 'https://readmoo.com/member/oauth/sign_out'
      scope:
        me: 'me'
        reading: 'reading'
        highlight: 'highlight'
        like: 'like'
        comment: 'comment'
        library: 'library'

      get:
        'me': 'me'

      xhr: (p) ->

        if not localStorage.hello
          return false

        hello = JSON.parse localStorage.hello

        if not hello.readmoo or not hello.readmoo.client_id
          return false

        p.headers = {
          'Authorization': 'Client ' + hello.readmoo.client_id
        }

        return true

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

  hello.init readmooInit
