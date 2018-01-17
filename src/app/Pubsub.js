/**
 * @module PubSub
 */
/**
 * event emiter
 * @type {object}
 */
export const PubSub = {
    handlers: [],

    /**
     * publishes event
     * @member publish
     * @type {Function}
     * @param {String} eventName - event name
     * @param {any} param - params to subscribers
     */
    publish (eventName, param) {
        this.handlers.filter(handler => handler.eventName === eventName)
            .forEach((handler) => {
                handler.handlerFn(param);
            });
    },

    /**
     * subscribe on event
     * @member subscribe
     * @type {Function}
     * @param {String} eventName - event name
     * @param {Function}  handlerFn - func that calls on event
     */
    subscribe (eventName, handlerFn) {
        this.handlers.push({
            eventName,
            handlerFn
        });
    }
};

