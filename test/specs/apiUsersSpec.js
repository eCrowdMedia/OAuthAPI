/* global readmoo: true */

describe('Users API test', function () {

    var ReadmooAPI = readmoo.ReadmooAPI;

    ReadmooAPI.init('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/');
    var callback = function () {
        console.log('already login');
    };
    ReadmooAPI.on('auth.login', callback);
    // ReadmooAPI.login();

    var userId;

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            callback = done;
            ReadmooAPI.login();
        } else {
            done();
        }
    });

    it('me', function (done) {

        ReadmooAPI.api.me().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(!!(data.user && data.user.id)).toBe(true);
            userId = data.user.id;
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });

    });

    it('get user data by id', function (done) {

        ReadmooAPI.api.users(userId).success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.user.id).toEqual(userId);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

});
