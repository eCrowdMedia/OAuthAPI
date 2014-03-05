(function() {
    var hash = location.hash;

    if (hash) {
        if (hash[0] === '#') {
            hash = hash.substr(1);
        }
        hash = hash.replace(/(^token|&token)=/, function (match) {
            return (match[0] === '&' ? '&' : '') + 'access_token=';
        });
        location.hash = hash;
    }
