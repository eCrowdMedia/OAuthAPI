(function() {
    var readmoo = {},
        hash = location.hash;

    if (hash) {
        if (hash[0] === '#') {
            hash = hash.substr(1);
        }

        location.hash.replace(/(^token|&token)=/, function (match) {
            return (match[0] === '&' ? '&' : '') + 'access_token=';
        });
    }
