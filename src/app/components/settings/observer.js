
export const SettingsPubsub = (function () {
    const observers = [];
    const addObserver = function (o) {
        if (typeof o !== 'function') {
            throw new Error('observer must be a function');
        }
        for (let i = 0, ilen = observers.length; i < ilen; i += 1) {
            const observer = observers[i];
            if (observer === o) {
                throw new Error('observer already in the list');
            }
        }
        observers.push(o);
    };
    const removeObserver = function (o) {
        for (let i = 0, ilen = observers.length; i < ilen; i += 1) {
            const observer = observers[i];
            if (observer === o) {
                observers.splice(i, 1);
                return;
            }
        }
        throw new Error('could not find observer in list of observers');
    };
    const notifyObservers = function (data) {
    // Make a copy of observer list in case the list
    // is mutated during the notifications.
        const observersSnapshot = observers.slice(0);
        for (let i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
            observersSnapshot[i](data);
        }
    };
    return {
        addObserver,
        removeObserver,
        notifyObservers,
        notify: notifyObservers
    };
})();
