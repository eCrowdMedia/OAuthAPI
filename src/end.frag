    if (typeof define === 'function' && define.amd) {
        define('readmoo_oauth', [], function() {
            return ReadmooAPI;
        });
    } else {
        var readmoo = window.readmoo;

        if (!readmoo) {
            readmoo = {};
        }

        readmoo.ReadmooAPI = ReadmooAPI;
        window.readmoo = readmoo;
    }
})();
