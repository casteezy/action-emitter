import IComponentOptions = angular.IComponentOptions;
(function(angular) {

    const module = angular.module('app.consumers', ['actionEmitter']);

    const DATE_FORMAT = 'h:mm:ss.sss a';

    interface IConsumerComponent {
        initializedTime: string;
        event: string;
        data: any;
        title: string;
    }

    const consumerComponentOptions = (componentCtrl:string):IComponentOptions => {
        return {
            transclude: true,
            bindings: {
                event: '@'
            },
            template: [
                '<div class="consumer panel panel-success">',
                '<div class="panel-heading">{{::$ctrl.title}}</div>',
                '<div class="panel-body">',
                '<p><code>consumer</code> component subscribed to <code ng-bind="::$ctrl.event"></code></p>',
                '<p>Initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
                '<pre>{{$ctrl.data | json}}</pre>',
                '<ng-transclude></ng-transclude>',
                '</div>',
                '</div>',
            ].join(''),
            controller: componentCtrl
        };
    };

    class ActionEmitterConsumerComponent implements IConsumerComponent, IController {
        public initializedTime;
        public event;
        public data;
        public title = 'Consumer via Action Emitter';

        static $inject = ['ActionEmitterService', '$filter'];

        constructor(private ActionEmitterService, $filter) {
            this.initializedTime = $filter('date')(Date.now(), DATE_FORMAT);
        }

        $onInit() {
            if (!this.event) throw 'Event required for action-emitter-consumer component';
            this.ActionEmitterService.subscribe(this.event, this.handleAction.bind(this));
        }

        private handleAction(data) {
            this.data = data;
        }
    }

    class ScopeEventConsumerComponent implements IConsumerComponent, IController {
        public initializedTime;
        public event;
        public data;
        public title = 'Consumer via $scope';

        static $inject = ['$scope', '$filter'];

        constructor(private $scope, $filter) {
            this.initializedTime = $filter('date')(Date.now(), DATE_FORMAT);
        }

        $onInit() {
            if (!this.event) throw 'Event required for scope-event-consumer component';
            this.$scope.$on(this.event, (event, data) => this.handleAction(data));
        }

        private handleAction(data) {
            this.data = data;
        }
    }

    module.controller('ActionEmitterConsumerComponent', ActionEmitterConsumerComponent);
    module.component('actionEmitterConsumer', consumerComponentOptions('ActionEmitterConsumerComponent'));

    module.controller('ScopeEventConsumerComponent', ScopeEventConsumerComponent);
    module.component('scopeEventConsumer', consumerComponentOptions('ScopeEventConsumerComponent'));

})((<any>window).angular);