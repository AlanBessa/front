import { WorbbyPage } from './app.po';

describe('abp-zero-template App', function () {
    let page: WorbbyPage;

    beforeEach(() => {
        page = new WorbbyPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        page.getCopyright().then(value => {
            expect(value).toEqual(new Date().getFullYear() + ' © Worbby.');
        });
    });
});
