do (hello) ->
  readmooInit =
    readmoo:
      name: 'Readmoo'
      base: 'https://api.readmoo.com/'
      oauth:
        version: 2
        auth: 'https://member.readmoo.com/oauth'
        logout: 'https://member.readmoo.com/oauth/sign_out'
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

        oa = localStorage.getItem('__oa__')
        if not oa
          return false

        oa = JSON.parse oa

        if not oa.readmoo or not oa.readmoo.client_id
          return false

        p.data = p.data or {}
        p.data.client_id = oa.readmoo.client_id

        if /^(?:post|put|delete)$/i.test p.method
          p.data = p.data or {}
          p.data['access_token'] = oa.readmoo.access_token

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
