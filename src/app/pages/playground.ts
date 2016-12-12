(function(angular) {

    const DATE_FORMAT = 'h:mm:ss.sss a';

    const pgModule = angular.module('playground', ['actionEmitter']);

    pgModule.controller('PlaygroundCtrl', class PlaygroundCtrl {
        public event;

        constructor() {
            this.event = 'objectClickedEvent';
        }
    });

    class ConsumerComponent {
        public initializedTime;
        public dateFormat;
        public event;
        private data;

        static $inject = ['ActionEmitterService'];

        constructor(private ActionEmitterService) {
            this.initializedTime = Date.now();
            this.dateFormat = DATE_FORMAT;
        }

        $onInit() {
            if (!this.event) throw 'Event required for consumer component';
            this.ActionEmitterService.subscribe(this.event, this.handleAction.bind(this));
        }

        private handleAction(data) {
            this.data = data;
        }
    }

    class ProducerComponent {
        public initializedTime;
        public dateFormat;
        public event;
        private count;
        // private emitter;

        static $inject = ['ActionEmitterService'];

        constructor(private ActionEmitterService) {
            this.count = 0;
            this.initializedTime = Date.now();
            this.dateFormat = DATE_FORMAT;
        }

        $onInit() {
            if (!this.event) throw 'Event required for producer component';
            this.ActionEmitterService.initialize(this.event);
        }

        triggerAction() {
            // Different ways to trigger action
            this.ActionEmitterService.notifySubscribers(this.event, `Something happened! ${++this.count} - ${this.event}`);
            // this.emitter.doAction(`Something happened! ${++this.count} - ${this.event}`);
        }
    }

    pgModule.component('consumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="consumer bordered green">',
            '<p><code>consumer</code> component subscribed to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '</div>',
        ].join(''),
        controller: ConsumerComponent,
    });

    pgModule.component('producer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="producer bordered blue">',
            '<p><code>producer</code> component, emitting to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '</div>'
        ].join(''),
        controller: ProducerComponent
    });

    pgModule.component('parentConsumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-consumer bordered green">',
            '<p><code>parent-consumer</code> component: </p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '<producer event="{{$ctrl.event}}"></producer>',
            '</div>'
        ].join(''),
        controller: ConsumerComponent
    });

    pgModule.component('parentProducer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-producer bordered blue">',
            '<p><code>parent-producer</code> component subscribed to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '<consumer event="{{$ctrl.event}}"></consumer>',
            '</div>'
        ].join(''),
        controller: ProducerComponent
    });

})((<any>window).angular);