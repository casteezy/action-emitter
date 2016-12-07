/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angularjs/angular-sanitize.d.ts" />

(function (angular) {

    const CLICKED_EVENT = 'objectClickedEvent';

    const appModule = angular.module('app', ['actionEmitter']);

    appModule.controller('PlaygroundCtrl', class PlaygroundCtrl {
        public event;

        constructor() {
            this.event = CLICKED_EVENT;
        }
    });

    class ConsumerComponent {
        public event;
        private data;

        static $inject = ['ActionEmitterService'];
        constructor(private ActionEmitterService) {
        }

        $onInit() {
            if (!this.event) throw 'Event required for consumer component';
            this.ActionEmitterService.subscribe(this.event, this.handleAction.bind(this));
        }

        private handleAction(data) {
            this.data = data;
        }
    }
    appModule.component('consumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="consumer bordered green">',
            '<p>Inside <code>consumer</code> component:</p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '</div>',
        ].join(''),
        controller: ConsumerComponent,
    });


    appModule.component('consumerDataSource', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="data-source bordered blue">',
            '<p>Inside <code>data-source</code> component: </p>',
            '<button class="btn btn-default btn-sm" ng-click="$ctrl.click()">Click Me</button>',
            '</div>'
        ].join(''),
        controller: class DataSourceComponent {
            public event;
            private count;
            private emitter;

            static $inject = ['ActionEmitterService'];
            constructor(private ActionEmitterService) {
                this.count = 0;
            }

            $onInit() {
                if (!this.event) throw 'Event required for dataSource component';
                this.emitter = this.ActionEmitterService.initialize(this.event);
            }

            click() {
                this.emitter.doAction(`Clicked: ${++this.count}`);
            }

        }
    });

    appModule.component('parentConsumer', {
        bindings: {
            event: '@'
        },
        template: [
            '<div class="parent-consumer bordered green">',
            '<p>Inside <code>parent-consumer</code> component: </p>',
            '<pre>{{$ctrl.data | json}}</pre>',
            '<consumer-data-source event="{{$ctrl.event}}"></consumer-data-source>',
            '</div>'
        ].join(''),
        controller: ConsumerComponent
    });

})((<any>window).angular);
