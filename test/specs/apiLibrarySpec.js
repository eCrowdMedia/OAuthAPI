
describe('Library API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/'),
        libraryId;

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            ReadmooAPI.login(done);
        } else {
            done();
        }
    });

    describe('call library api', function () {

        it('call library compare from library', function (done) {
            ReadmooAPI.api.library().compare().success(function (data) {
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

        xit('call library compare from me', function (done) {
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
        ReadmooAPI.api.library(libraryId).get().success(function (data) {
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
