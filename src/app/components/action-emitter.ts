(function (angular) {
    const debugMode = true;

    const debugLog = (...messages) => {
        debugMode && console.log(messages.join(' '));
    };

    const aeModule = angular.module('actionEmitter', []);

    interface IActionEmitterPayload {
        dataType?: string;
        data: any;
    }

    class ActionEmitter {
        private listeners: Function[];
        private data: any;

        constructor(private event,
                    private dataType) {
            this.listeners = [];
        }

        public doTypedAction(payload: IActionEmitterPayload) {
            debugLog('emitter.doTypedAction of type', payload.dataType);
            if (this.dataType && this.dataType !== payload.dataType) {
                throw 'payload data does not match expected data type';
            }
            this.doAction(payload.data);
        }

        public doAction(data: any) {
            debugLog('emitter.doAction for', this.listeners.length, 'listeners with data:', data);
            this.data = data;
            this.listeners.forEach((listener) => listener(data));
        }

        public getEvent(): string {
            return this.event;
        }

        public subscribe(listener: Function):number {
            if (listener) {
                this.listeners.push(listener);
                listener(this.data);
                return this.listeners.length - 1;
            }
            return -1;
        }
    }

    class ActionEmitterService {
        private emitters: {
            [event: string]: ActionEmitter;
        };
        private pendingSubscribers: {
            [event: string]: ((data?: any) => any)[];
        };

        constructor() {
            this.emitters = {};
            this.pendingSubscribers = {};
        }

        public initialize(event: string, dataType?: string) {
            if (this.emitters[event]) {
                debugLog('service.initialize-existing emitter found,', event);
            } else {
                debugLog('service.initialize-new emitter created,', event);
                this.emitters[event] = new ActionEmitter(event, dataType);
                this.updatePendingSubscribers(event);
            }
        };

        private updatePendingSubscribers(event: string) {
            if (this.pendingSubscribers[event]) {
                let debugCount = 0;
                this.pendingSubscribers[event].forEach(callback => {
                    debugCount++;
                    this.subscribe(event, callback);
                });
                debugLog('service.initialize-pending subscriber(s) found,', debugCount);
            }
            delete this.pendingSubscribers[event];
        }

        // FIXME: not pending, already subcribed needs to be edited

        public subscribe(event: string, callback: (data?: any) => any):Function {
            const found = this.emitters[event];
            let subscribedIndex = -1;

            if (found) {
                debugLog('service.subscribe-emitter found,', event);
                subscribedIndex = found.subscribe(callback);
            } else {
                debugLog('service.subscribe-emitter not found, pending,', event);
                if (!this.pendingSubscribers[event]) {
                    this.pendingSubscribers[event] = [];
                }
                this.pendingSubscribers[event].push(callback);
                subscribedIndex = this.pendingSubscribers[event].length;
            }

            let subscribed = true;
            return () => {
                // one-time unsubscription
                if (subscribed) {
                    this.unsubscribe(event, subscribedIndex);
                    subscribed = false;
                }
            }
        };

        public unsubscribe(event:string, index:number) {
            if (index >= 0 && this.pendingSubscribers[event].length > index) {
                this.pendingSubscribers[event].splice(index, 1);
            }
        }

        public notifySubscribers(event: string, data: any) {
            if (this.emitters[event]) {
                this.emitters[event].doAction(data);
            }
        }

        public notifySubscribersTyped(event: string, payload: IActionEmitterPayload) {
            if (this.emitters[event]) {
                this.emitters[event].doTypedAction(payload);
            }
        }
    }

    aeModule.service('ActionEmitterService', ActionEmitterService);

})((<any>window).angular);
