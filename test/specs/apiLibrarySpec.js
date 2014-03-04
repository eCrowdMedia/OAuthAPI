
describe('Library API test', function () {

    var ReadmooAPI = readmoo.OAuthAPI;

    ReadmooAPI.init('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/');
    var callback = function () {};
    ReadmooAPI.on('auth.login', callback);
    // ReadmooAPI.login();

    var libraryId;

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            callback = done;
            ReadmooAPI.login();
        } else {
            done();
        }
    });

    describe('call library api', function () {

        it('call library compare from library', function (done) {
            ReadmooAPI.api.library.compare().success(function (data) {
                expect(data).toBeDefined();
                expect(data.status).toEqual(200);
                expect(data.items instanceof Array).toBeTruthy();
                libraryId = data.items[0].library_item.id;
                done();
            }).error(function () {
                expect(false).toBe(true);
                done();
            });
        });

        it('call library compare from me', function (done) {
            ReadmooAPI.api.me.library().success(function (data) {
                expect(data).toBeDefined();
                expect(data.status).toEqual(200);
                expect(data.items instanceof Array).toBeTruthy();
                libraryId = data.items[0].library_item.id;
                done();
            }).error(function () {
                expect(false).toBe(true);
                done();
            });
        });
    });

    it("retrieve library by id", function (done) {
        ReadmooAPI.api.library(libraryId).success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.library_item).toBeDefined();
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });
});
