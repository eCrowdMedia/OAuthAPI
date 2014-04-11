'use strict';
describe('Books API test', function () {

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

    it('get book by book id', function (done) {
        ReadmooAPI.api.books({book_id: bookId}).getBookByBookId().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.book).toBeDefined();
            expect(data.book.id).toEqual(bookId);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

});
