(function (angular) {
    const debugLog = true;

    const aeModule = angular.module('actionEmitter', []);

    aeModule.factory('ActionEmitterService', [function () {
        var emitters = [];

        const newEmitter = (event) => {
            var listeners = [];
            return {
                event,
                doAction: (data) => {
                    debugLog && console.log('emitter.doAction for', listeners.length, 'listeners with data:', data);
                    listeners.forEach((listener) => listener(data));
                },
                getEvent: () => event,
                subscribe: (callback) => {
                    debugLog && console.log('emitter.subscribe');
                    callback && listeners.push(callback);
                }
            };
        };

        let pendingSubscribers = {};
        const initialize = (event) => {
            const existingList = emitters.filter(e => e.getEvent() === event);
            if (existingList.length) {
                console.log('service.initialize-existing emitter found');
                return existingList[0];
            }
            const emitter = newEmitter(event);
            emitters.push(emitter);
            console.log('service.initialize-new emitter created');
            if (pendingSubscribers[event] && pendingSubscribers[event].length) {
                let debugCount = 0;
                pendingSubscribers[event].forEach(callback => {
                    debugLog && debugCount++;
                    subscribe(event, callback);
                });
                pendingSubscribers[event] = [];
                debugLog && console.log('service.initialize-pending subscriber(s) found', debugCount);
            }
            return emitter;
        };

        const subscribe = (event, callback) => {
            debugLog && console.log('service.subscribe to', event);
            const found = emitters.filter(e => e.getEvent() === event);
            if (found && found.length) {
                found[0].subscribe(callback);
                debugLog && console.log('service.subscribe, emitter found', event);
            } else {
                debugLog && console.log('emitter not found, pending', event);
                if (!pendingSubscribers[event]) {
                    pendingSubscribers[event] = [];
                }
                pendingSubscribers[event].push(callback);
            }
        };
        return {
            initialize,
            subscribe,
        };
    }]);

})((<any>window).angular);
