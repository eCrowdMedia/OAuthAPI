'use strict';
describe('Highlights API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/'),
        getUserId, userId, readingId, templateHighlightId;

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

    it('call highlight api', function (done) {
        ReadmooAPI.api.highlights().get().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it('get user\'s highlights', function (done) {
        ReadmooAPI.api.highlights({userId: userId}).getHighlightsByUserId().success(function () {
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it('get highlights by reading id', function (done) {

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
    });

    it('create highlights by reading id', function (done) {

        var option = {
            readingId: readingId
        };

        var content = 'test by jasmine',
            locator = {
                position: 0.5,
                mid: content,
                location: '/6/6[ccc.xhtml]!/4/116,/1:0,/1:21'
            };

        option['highlight[content]'] = content;
        option['highlight[locators]'] = locator;

        ReadmooAPI.api.highlights(option).createHighlightByReadingId()
        .success(function (data) {
            var highlight, locators;
            expect(data.status).toBe(201);
            highlight = data.highlight;
            expect(highlight.content).toEqual(content);
            locators = highlight.locators;
            // expect(locators.position).toEqual(locator.position);
            expect(locators.mid).toEqual(locator.mid);
            expect(locators.location).toEqual(locator.location);
            templateHighlightId = highlight.id;
            done();
        })
        .error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it('delete highlight by highlight id', function (done) {

        ReadmooAPI.api.highlights({highlightId: templateHighlightId})
        .deleteHighlightByHighlightId()
        .success(function (data) {
            expect(data.status).toEqual(200);
            done();
        })
        .error(function () {
            expect(false).toBe(true);
            done();
        });
    });

});
