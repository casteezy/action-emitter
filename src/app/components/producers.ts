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

    const producerComponentOptions = ({controller, title}) => {
        return {
            controller,
            transclude: true,
            bindings: {
                event: '@'
            },
            template: [
                '<div class="producer panel panel-info">',
                `<div class="panel-heading">${title || 'Producer'}</div>`,
                '<div class="panel-body">',
                '<p>emitting to <code ng-bind="::$ctrl.event"></code>, ',
                'initialized at <code ng-bind="::$ctrl.initializedTime"></code></p>',
                '<form>',
                '<div class="form-group">',
                '<label for="message">Message</label>',
                '<input id="message" type="text" ng-model="$ctrl.message" class="form-control">',
                '</div>',
                '<button type="submit" class="btn btn-primary" ng-click="$ctrl.triggerAction()">Submit</button>',
                '</form>',
                '</div>',
                '<ng-transclude></ng-transclude>',
                '</div>',
            ].join(''),
        };
    };

    interface IFooPayloadDataType {

    }

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
            this.ActionEmitterService.initialize(this.event, 'IFooPayloadDataType');
        }

        triggerAction() {
            // Different ways to trigger action
            this.ActionEmitterService.notifySubscribersTyped(this.event, {
                data: {
                    message: this.message,
                    submittedTime: this.$filter('date')(Date.now(), DATE_FORMAT)
                },
                 dataType: 'IFooPayloadDataType'
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

    module.component('actionEmitterProducer', producerComponentOptions({
        controller: 'ActionEmitterProducerComponent',
        title: 'Producer via ActionEmitter'
    }));

    module.controller('ScopeEventProducerComponent', ScopeEventProducerComponent);

    module.component('scopeEventProducer', producerComponentOptions({
        controller: 'ScopeEventProducerComponent',
        title: 'Producer via ActionEmitter'
    }));

})((<any>window).angular);