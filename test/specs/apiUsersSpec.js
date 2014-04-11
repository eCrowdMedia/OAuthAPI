'use strict';
/* global readmoo: true */

describe('Users API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/');

    var userId;

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            ReadmooAPI.login(done);
        } else {
            done();
        }
    });

    it('me', function (done) {

        ReadmooAPI.api.me().get().success(function (data) {
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

        ReadmooAPI.api.users(userId).get().success(function (data) {
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
