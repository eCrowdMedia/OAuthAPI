'use strict';
describe('Readings API test', function () {

    var ReadmooAPI = new readmoo.OAuthAPI('efe60b2afc3447dded5e6df6fd2bd920', 'http://korprulu.ohread.com/test/oauth2/test/'),
        getUserId, userId, bookId, readingId;

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

    it('retrieve readings', function (done) {
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

    it('retrieve readings by user id', function (done) {
        ReadmooAPI.api.readings({userId: userId, count: 5}).getReadingsByUserId().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.items).toBeDefined();
            expect(data.items.length).toEqual(5);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it('retrieve readings by user id and book id', function (done) {
        ReadmooAPI.api.readings({userId: userId, book_id: '210000012000101'}).getReadingsByUserIdWithMatch().success(function (data) {
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


    it('create reading', function (done) {
        var defer,
            options = {
                book_id: bookId
            };

        options['reading[state]'] = ReadmooAPI.api.readings.STATE_READING;

        defer = ReadmooAPI.api.readings(options).createReadingByBookId();
        defer.success(function (data) {

            var reading;

            expect(data).toBeDefined();
            // created
            expect(data.status).toEqual(201);

            reading = data.reading;

            // expect(reading.state).toEqual(ReadmooAPI.api.readings.STATE_READING);
            expect(reading.book.id).toEqual(bookId);
            readingId = reading.id;
            done();

        }).error(function () {
            expect(false).toBeTruthy();
            done();
        });
    });

    it('finish reading', function (done) {
        var defer,
            options = {
                reading_id: readingId
            };

        defer = ReadmooAPI.api.readings(options).finishReadingByReadingId();
        defer.success(function (data) {

            expect(data).toBeDefined();
            // created
            expect(data.status).toEqual(200);
            
            done();

        }).error(function () {
            expect(false).toBeTruthy();
            done();
        });
    });

    it('get readings by book id', function (done) {
        ReadmooAPI.api.readings({bookId: bookId, count: 2}).getReadingsByBookId()
        .success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(data.items).toBeDefined();
            expect(data.items.length).toEqual(2);
            done();
        })
        .error(function () {
            expect(false).toBe(true);
            done();
        });
    });

    it('get reading by reading id', function (done) {
        ReadmooAPI.api.readings({readingId: readingId}).getReadingByReadingId().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(200);
            expect(typeof data.reading).toEqual('object');
            expect(data.reading.id).toEqual(readingId);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });
    
    it('post a ping with reading id', function (done) {
        ReadmooAPI.api.readings({
            readingId: readingId,
            'ping[identifier]': (new Date()).valueOf(),
            'ping[progress]': 0.5,
            'ping[duration]': 300,
            'ping[occurred_at]': (new Date()).toISOString(),
            'ping[cfi]': '/6/4!/8/2'
        }).ping().success(function (data) {
            expect(data).toBeDefined();
            expect(data.status).toEqual(201);
            done();
        }).error(function () {
            expect(false).toBe(true);
            done();
        });
    });
});
