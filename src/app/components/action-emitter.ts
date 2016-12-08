(function (angular) {
    const debugMode = true;

    function debugLog(...messages) {
        debugMode && console.log(messages);
    }

    const aeModule = angular.module('actionEmitter', []);

    class ActionEmitter {
        private listeners;

        constructor(private event) {
            this.listeners = [];
        }

        public doAction(data: any) {
            debugLog('emitter.doAction for', this.listeners.length, 'listeners with data:', data);
            this.listeners.forEach((listener) => listener(data));
        }

        public getEvent(): string {
            return this.event;
        }

        public subscribe(callback: Function) {
            callback && this.listeners.push(callback);
        }
    }

    class ActionEmitterService {
        private emitters: {
            [event: string]: ActionEmitter;
        };
        private pendingSubscribers: {
            [event: string]: Function[];
        };

        constructor() {
            this.emitters = {};
            this.pendingSubscribers = {};
        }

        public initialize(event: string): ActionEmitter {
            if (this.emitters[event]) {
                debugLog('service.initialize-existing emitter found', event);
                return this.emitters[event];
            }

            debugLog('service.initialize-new emitter created', event);
            this.emitters[event] = new ActionEmitter(event);
            this.updatePendingSubscribers(event);

            return this.emitters[event];
        };

        private updatePendingSubscribers(event:string) {
            if (this.pendingSubscribers[event]) {
                let debugCount = 0;
                this.pendingSubscribers[event].forEach(callback => {
                    debugCount++;
                    this.subscribe(event, callback);
                });
                debugLog('service.initialize-pending subscriber(s) found', debugCount);
            }
            delete this.pendingSubscribers[event];
        }

        public subscribe(event: string, callback: Function) {
            const found = this.emitters[event];
            if (found) {
                debugLog('service.subscribe-emitter found', event);
                found.subscribe(callback);
            } else {
                debugLog('service.subscribe-emitter not found, pending', event);
                if (!this.pendingSubscribers[event]) {
                    this.pendingSubscribers[event] = [];
                }
                this.pendingSubscribers[event].push(callback);
            }
        };

        public notifySubscribers(event:string, data:any) {
            if (this.emitters[event]) {
                this.emitters[event].doAction(data);
            }
        }
    }

    aeModule.service('ActionEmitterService', ActionEmitterService);

})((<any>window).angular);
