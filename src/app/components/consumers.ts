import IComponentOptions = angular.IComponentOptions;
(function (angular) {

    const module = angular.module('app.consumers', ['actionEmitter']);

    const DATE_FORMAT = 'h:mm:ss.sss a';

    interface IConsumerComponent {
        initializedTime: string;
        event: string;
        data: any;
    }

    const consumerComponentOptions = ({controller, title}): IComponentOptions => {
        return {
            controller,
            transclude: true,
            bindings: {
                event: '@'
            },
            template: [
                '<div class="consumer panel panel-success">',
                `<div class="panel-heading">${title || 'Consumer'}</div>`,
                '<div class="panel-body">',
                '<p>subscribed to <code ng-bind="::$ctrl.event"></code>, ',
                'initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
                '<pre>{{$ctrl.data | json}}</pre>',
                '<ng-transclude></ng-transclude>',
                '</div>',
                '</div>',
            ].join(''),
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

    module.component('actionEmitterConsumer', consumerComponentOptions({
        controller: 'ActionEmitterConsumerComponent',
        title: 'Consumer via ActionEmitter'
    }));

    module.controller('ScopeEventConsumerComponent', ScopeEventConsumerComponent);

    module.component('scopeEventConsumer', consumerComponentOptions({
        controller: 'ScopeEventConsumerComponent',
        title: 'Consumer via $scope'
    }));

})((<any>window).angular);