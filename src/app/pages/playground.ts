(function (angular) {

    const DATE_FORMAT = 'h:mm:ss.sss a';

    const pgModule = angular.module('playground', ['actionEmitter']);

    class ConsumerComponent {
        public initializedTime;
        public event;
        private data;

        static $inject = ['ActionEmitterService', '$filter'];
        constructor(private ActionEmitterService, $filter) {
            this.initializedTime = $filter('date')(Date.now(), DATE_FORMAT);
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
        public event;
        public message: string;

        static $inject = ['ActionEmitterService', '$filter'];
        constructor(private ActionEmitterService, private $filter) {
            this.initializedTime = $filter('date')(Date.now(), DATE_FORMAT);
            this.message = 'Hello world';
        }

        $onInit() {
            if (!this.event) throw 'Event required for producer component';
            this.ActionEmitterService.initialize(this.event);
        }

        triggerAction() {
            // Different ways to trigger action
            this.ActionEmitterService.notifySubscribers(this.event, {
                message: this.message,
                submittedTime: this.$filter('date')(Date.now(), DATE_FORMAT)
            });
        }
    }

    pgModule.component('consumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="consumer bordered green">',
            '<p><code>consumer</code> component subscribed to <code ng-bind="::$ctrl.event"></code></p>',
            '<p>Initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
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
            '<p><code>producer</code> component, emitting to <code ng-bind="::$ctrl.event"></code></p>',
            '<p>Initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
            '<form>',
            '<div class="form-group">',
            '<label for="message">Message</label>',
            '<input id="message" type="text" ng-model="$ctrl.message" class="form-control">',
            '</div>',
            '<button type="submit" class="btn btn-primary btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '</form>',
            '</div>'
        ].join(''),
        controller: ProducerComponent
    });



    // TODO: investigate using existing `producer` and `consumer` components for below

    pgModule.component('parentConsumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-consumer bordered green">',
            '<p><code>parent-consumer</code> component: </p>',
            '<p>Initialized at <code>{{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</code></p>',
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
            '<p>Initialized at <code>{{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</code></p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '<consumer event="{{$ctrl.event}}"></consumer>',
            '</div>'
        ].join(''),
        controller: ProducerComponent
    });

})((<any>window).angular);