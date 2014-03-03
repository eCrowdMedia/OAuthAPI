    if (typeof define === 'function' && define.amd) {
        define('readmoo_oauth', [], function() {
            return ReadmooAPI;
        });
    } else {
        window.ReadmooAPI = ReadmooAPI;
    }
})();
