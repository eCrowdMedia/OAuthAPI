### global hello ###

hello.init
    readmoo:
        name: 'Readmoo',
        uri:
            auth: 'https://readmoo.com/member/oauth'
            me: 'https://api.readmoo.com/me'
            base: 'https://api.readmoo.com/'
        oauth:
            version: '2'
            token: 'https://readmoo.com/member/oauth/access_token'
        scope:
            reading: 'reading'
            highlight: 'highlight'
            like: 'like'
            comment: 'comment'
            library: 'library'
