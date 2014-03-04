
describe('Readmoo OAuth API', function () {

    it('should be loaded', function () {
        var readmoo = window.readmoo;
        expect(readmoo).toBeDefined();
        expect(readmoo.OAuthAPI).toBeDefined();
    });

});
