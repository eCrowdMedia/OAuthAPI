
describe('Readings API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/'),
        getUserId, userId, bookId;

    bookId = '210000012000101';

    getUserId = function (done) {
        ReadmooAPI.api.me().get().success(function (data) {
            userId = data.user.id;
            done();
        }).error(function () {
            console.error('me');
            done();
        });
    };

    beforeEach(function (done) {
        if (!ReadmooAPI.online()) {
            ReadmooAPI.login(getUserId);
        } else {
            if (!userId) {
                getUserId(done);
            } else {
                done();
            }
        }

    });

    it("retrieve readings", function (done) {
        ReadmooAPI.api.readings({count: 1}).get().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.items).toBeDefined();
            expect(data.items.length).toEqual(1);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it("retrieve readings by userId", function (done) {
        ReadmooAPI.api.readings({userId: userId, book_id: '210000012000101'}).getReadingsByUserId().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.items).toBeDefined();
            expect(data.items instanceof Array).toEqual(true);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });
});
