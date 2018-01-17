/**
 * @module Router
 */
/** app router */
export const Router = {
    routes: [],
    root: '/',
    defaultRoute: '',

    /**
     * gets current location
     * @member getFragment
     * @type {Function}
     */
    getFragment () {
        let fragment = '';
        const match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';

        return this.clearSlashes(fragment);
    },

    /**
     * parses url to proper value
     * @member clearSlashes
     * @type {Function}
     * @param {string} path - url
    */
    clearSlashes (path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },

    /**
     * inits router data with routes
     * @member init
     * @type {Function}
     * @param {object} data - [{re, handler}, ...]
     */
    init (data) {
        this.routes = data;
    },

    /**
     * add new route to router data
     * @member add
     * @type {Function}
     * @param {String/RegExp} re - url path
     * @param {Function} handler - calls on url match
     */
    add (re, handler) {
        this.routes.push({ re, handler });
        return this;
    },
    /**
     * calls handler on routing
     * @member check
     * @type {Function}
     * @param {string} f - fragment of current url
     */
    check (f) {
        const fragment = f || this.getFragment();


        for (let i = 0; i < this.routes.length; i++) {
            let match = fragment.match(this.routes[i].re);

            if (match) {
                match = match.input.split('/');
                match.shift();

                this.routes[i].handler.apply({}, match);
                return this;
            }
        }

        if (this.defaultRoute) {
            this.navigate(this.defaultRoute.re);
        }
        return this;
    },

    /**
     * handles location change
     * @member listen
     * @type {Function}
     */
    listen () {
        const self = this;
        let current = self.getFragment();

        const fn = function () {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        };

        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    },

    /**
     * navigates to specific url
     * @member navigate
     * @type {Function}
     * @param {string} path - url navigate to
     */
    navigate (path) {
        path = path || this.defaultRoute.re;

        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;

        return this;
    }
};

