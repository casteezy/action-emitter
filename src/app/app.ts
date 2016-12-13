/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angularjs/angular-sanitize.d.ts" />

(function (angular) {

    const appModule = angular.module('app', [
        'ngRoute',
        'app.producers',
        'app.consumers',
    ]);

    appModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                // templateUrl: 'app/pages/playground.html'
                templateUrl: 'app/pages/demo.html'
            })
            .when('/two', {
                templateUrl: 'app/pages/vanilla.html'
            });
    }]);

    class NavbarComponent {
        static $inject = ['$location'];
        constructor(public $location) {
        }
    }
    appModule.component('navbar', {
        template: [
            '<ul class="nav nav-tabs">',
            '<li ng-class="{ \'active\' : $ctrl.$location.url() === \'/\'}">',
            '<a href="#/">Action Emitter</a></li>',
            '<li ng-class="{ \'active\' : $ctrl.$location.url() === \'/two\'}">',
            '<a href="#/two">Angular Events</a></li>',
            '</ul>',
        ].join(''),
        controller: NavbarComponent
    });

    appModule.controller('PageCtrl', class PageCtrl {
        public event = 'EVENT_1';
        public event2 = 'EVENT_2';
        public scopeConsumerList = [];
        public aeConsumerList = [];

        constructor() { }
    });

})((<any>window).angular);
