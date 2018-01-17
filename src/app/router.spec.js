import { Router } from './router';

describe('router tests', () => {
    const emptyMock = () => {};

    beforeEach(() => {
        Router.routes = [];
    });

    it('should set data on init', () => {
        Router.init('some data');

        expect(Router.routes).toEqual('some data');
    });

    it('should add route on add', () => {
        const expectedValue = [{ re: 'some route', handler: emptyMock }];
        Router.add('some route', emptyMock);

        expect(Router.routes).toEqual(expectedValue);
    });

    it('should parse string on clearSlashes', () => {
        expect(Router.clearSlashes('/productivity-app/fe-lab-starting-kit-2017/coverage/'))
            .toEqual('productivity-app/fe-lab-starting-kit-2017/coverage');
    });

    it('should process routes on check', () => {
        Router.routes = [
            { re: 'some', handler: () => {} },
            { re: 'route', handler: () => {} },
            { re: 'more', handler: () => {} }
        ];

        spyOn(Router.routes[1], 'handler');

        Router.check('route');

        expect(Router.routes[1].handler).toHaveBeenCalled();
    });

    it('should navigage on default route', () => {
        Router.defaultRoute = { re: 'default', handler: () => {} };

        spyOn(Router, 'navigate').and.callFake(emptyMock);

        Router.check('NotARoute');

        expect(Router.navigate).toHaveBeenCalledWith('default');
    });
});
