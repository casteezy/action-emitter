/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angularjs/angular-sanitize.d.ts" />

(function (angular) {

    const CLICKED_EVENT = 'objectClickedEvent';

    const appModule = angular.module('app', ['actionEmitter']);
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
                const self = this;
                ActionEmitterService.subscribe(CLICKED_EVENT, function (data) {
                    self.data = data;
                });
            }
        }
    });

    appModule.directive('sourceComponent2', function (ActionEmitterService) {
        return {
            restrict: 'EA',
            scope: true,
            template: [
                '<div class="child"><p class="blue">Inside source component 2: ',
                '<button class="btn" ng-click="click()">Click Me</button></p></div>'
            ].join(''),
            link: (scope) => {
                const emitter = ActionEmitterService.initialize(CLICKED_EVENT);
                let counter = 0;
                scope.click = function () {
                    emitter.doAction('Clicked - ' + ++counter);
                }
            },
        };

    });

})((<any>window).angular);
