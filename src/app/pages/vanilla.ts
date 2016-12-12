(function(angular) {

    const DATE_FORMAT = 'h:mm:ss.sss a';

    const vanillaModule = angular.module('vanilla', []);

    vanillaModule.controller('VanillaCtrl', class VanillaCtrl {
        public event:string;
        public showTimedConsumer:boolean;

        static $inject = [];
        constructor() {
            this.event = 'objectClickedEvent';
        }
    });


    class VanillaConsumerComponent {
        public initializedTime;
        public dateFormat;
        public event;
        private data;

        static $inject = ['$scope'];
        constructor(private $scope) {
            this.initializedTime = Date.now();
            this.dateFormat = DATE_FORMAT;
        }

        $onInit() {
            if (!this.event) throw 'Event required for vconsumer component';
            this.$scope.$on(this.event, (event, data) => this.handleAction(data));
        }

        private handleAction(data) {
            this.data = data;
        }
    }

    class VanillaProducerComponent {
        public initializedTime;
        public dateFormat;
        public event;
        private count;
        // private emitter;

        static $inject = ['$rootScope'];
        constructor(private $rootScope) {
            this.count = 0;
            this.initializedTime = Date.now();
            this.dateFormat = DATE_FORMAT;
        }

        $onInit() {
            if (!this.event) throw 'Event required for vproducer component';
        }

        triggerAction() {
            this.$rootScope.$broadcast(this.event, `Something happened! ${++this.count} - ${this.event}`);
        }
    }

    vanillaModule.component('vconsumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="consumer bordered green">',
            '<p><code>vconsumer</code> component subscribed to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '</div>',
        ].join(''),
        controller: VanillaConsumerComponent,
    });

    vanillaModule.component('vproducer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="producer bordered blue">',
            '<p><code>vproducer</code> component, emitting to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '</div>'
        ].join(''),
        controller: VanillaProducerComponent
    });


    vanillaModule.component('vparentConsumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-consumer bordered green">',
            '<p><code>vparent-consumer</code> component: </p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '<producer event="{{$ctrl.event}}"></producer>',
            '</div>'
        ].join(''),
        controller: VanillaConsumerComponent
    });

    vanillaModule.component('vparentProducer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-producer bordered blue">',
            '<p><code>vparent-producer</code> component subscribed to <code>{{::$ctrl.event}}</code></p>',
            '<p>Initialized at {{::$ctrl.initializedTime | date:$ctrl.dateFormat }}</p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
            '<consumer event="{{$ctrl.event}}"></consumer>',
            '</div>'
        ].join(''),
        controller: VanillaProducerComponent
    });

})((<any>window).angular);