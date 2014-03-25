
describe('Highlights API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/'),
        getUserId, userId, readingId;

    readingId = 4929;

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

    it("call highlight api", function (done) {
        ReadmooAPI.api.highlights().get().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it("get user's highlights", function (done) {
        ReadmooAPI.api.highlights({userId: userId}).getHighlightsByUserId().success(function (data) {
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it("get highlights by reading id", function (done) {

        ReadmooAPI.api.highlights({readingId: readingId}).getHighlightsByReadingId()
        .success(function (data) {
            expect(data.status).toEqual(200);
            expect(!!data.items.length).toBeTruthy();
            done();
        })
        .error(function () {
            expect(false).toBe(true);
            done();
        });
        // ReadmooAPI.api.highlights({userId: userId}).getHighlightsByUserId().success(function (data) {
        //     done();
        // }).error(function () {
        //     expect(false).toBe(true);
        //     done();
        // });
    });
});
