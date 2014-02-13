    if (typeof define === 'function' && define.amd) {
        define('readmoo_oauth', [], function() {
            return readmoo;
        });
    } else {
        window.readmoo = readmoo;
    }
})();
