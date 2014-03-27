
describe('Comments API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI(
            'efe60b2afc3447dded5e6df6fd2bd920',
            'http://korprulu.ohread.com/test/oauth2/test/'
        ),
        getUserId, userId, bookId, readingId, highlightId, commentId,
        templateCommentId;

    bookId = '210000012000101';
    readingId = '4929';
    highlightId = '15574';

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

    it("get comments by highlight id", function (done) {
        ReadmooAPI.api.comments({highlightId: highlightId})
        .getCommentsByHighlightId().success(function (data) {

            expect(data.status).toEqual(200);
            expect(data.items instanceof Array).toBeTruthy();
            var comment = data.items[0].comment;
            expect(comment).toBeDefined();
            commentId = comment.id;
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it("get comments by comment id", function (done) {
        ReadmooAPI.api.comments({commentId: commentId})
        .getCommentByCommentId().success(function (data) {

            expect(data.status).toEqual(200);
            expect(data.comment.id).toEqual(commentId);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    xit("create comments by highlight id", function (done) {
        var option = {
            highlightId: highlightId
            },
            content = "create comments by highlight id test 123455";

        option['comment[content]'] = content;

        ReadmooAPI.api.comments(option)
        .createCommentByHighlightId().success(function (data) {

            expect(data.status).toEqual(200);
            expect(data.comment.content).toEqual(content);
            expect(data.comment.highlight.id).toEqual(highlightId);
            templateCommentId = data.comment.id;
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    xit("delete comment by comment id", function (done) {
        var option = {
            commentId: templateCommentId
            };

        ReadmooAPI.api.comments(option)
        .deleteCommentByCommentId().success(function (data) {
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

});
