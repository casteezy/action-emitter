(function (angular) {
    var CLICKED_EVENT = 'objectClickedEvent';
    var appModule = angular.module('app', ['actionEmitter']);
    appModule.controller('PlaygroundCtrl', [function () {
        }]);
    appModule.directive('sourceComponent', function (ActionEmitterService) {
        return {
            restrict: 'EA',
            scope: {},
            template: [
                '<div class="child"><p class="green">Inside source component: ',
                '<pre>{{ctrl.data}}</pre>',
                '</p></div>',
            ].join(''),
            controllerAs: 'ctrl',
            controller: function () {
                var self = this;
                ActionEmitterService.subscribe(CLICKED_EVENT, function (data) {
                    self.data = data;
                });
            }
        };
    });
    appModule.directive('sourceComponent2', function (ActionEmitterService) {
        return {
            restrict: 'EA',
            scope: true,
            template: [
                '<div class="child"><p class="blue">Inside source component 2: ',
                '<button class="btn" ng-click="click()">Click Me</button></p></div>'
            ].join(''),
            link: function (scope) {
                var emitter = ActionEmitterService.initialize(CLICKED_EVENT);
                var counter = 0;
                scope.click = function () {
                    emitter.doAction('Clicked - ' + ++counter);
                };
            },
        };
    });
})(window.angular);
//# sourceMappingURL=app.js.map