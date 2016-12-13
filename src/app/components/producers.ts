import IController = angular.IController;
(function (angular) {

    const module = angular.module('app.producers', ['actionEmitter']);

    const DATE_FORMAT = 'h:mm:ss.sss a';

    interface IProducerComponent {
        initializedTime: string;
        event: string;
        message: string;
        title: string;
    }

    const producerComponentOptions = (componentCtrl:string) => {
        return {
            transclude: true,
            bindings: {
                event: '@'
            },
            template: [
                '<div class="producer panel panel-info">',
                '<div class="panel-heading">{{::$ctrl.title}}</div>',
                '<div class="panel-body">',
                '<p><code>producer</code> component, emitting to <code ng-bind="::$ctrl.event"></code></p>',
                '<p>Initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
                '<form>',
                '<div class="form-group">',
                '<label for="message">Message</label>',
                '<input id="message" type="text" ng-model="$ctrl.message" class="form-control">',
                '</div>',
                '<button type="submit" class="btn btn-primary btn-sm" ng-click="$ctrl.triggerAction()">Click Me</button>',
                '</form>',
                '<ng-transclude></ng-transclude>',
                '</div>',
                '</div>',
            ].join(''),
            controller: componentCtrl
        };
    };


    class ActionEmitterProducerComponent implements IProducerComponent, IController {
        public initializedTime;
        public event;
        public message: string;
        public title: string = 'Producer via Action Emitter';

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

    class ScopeEventProducerComponent implements IProducerComponent, IController {
        public initializedTime;
        public event;
        public message: string;
        public title: string = 'Producer via $rootScope';

        static $inject = ['$rootScope', '$filter'];

        constructor(private $rootScope, private $filter) {
            this.initializedTime = $filter('date')(Date.now(), DATE_FORMAT);
            this.message = 'Hello world';
        }

        $onInit() {
            if (!this.event) throw 'Event required for vproducer component';
        }

        triggerAction() {
            this.$rootScope.$broadcast(this.event, {
                message: this.message,
                submittedTime: this.$filter('date')(Date.now(), DATE_FORMAT)
            });
        }
    }


    module.controller('ActionEmitterProducerComponent', ActionEmitterProducerComponent);
    module.component('actionEmitterProducer', producerComponentOptions('ActionEmitterProducerComponent'));

    module.controller('ScopeEventProducerComponent', ScopeEventProducerComponent);
    module.component('scopeEventProducer', producerComponentOptions('ScopeEventProducerComponent'));

})((<any>window).angular);