
describe('Highlights API test', function () {

    var ReadmooAPI = readmoo.OAuthAPI;
    ReadmooAPI.init('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/');

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            callback = done;
            ReadmooAPI.login();
        } else {
            done();
        }
    });

    it("call highlight api", function (done) {
        ReadmooAPI.api.highlights().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });
});
