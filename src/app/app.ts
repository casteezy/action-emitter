/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angularjs/angular-sanitize.d.ts" />

(function (angular) {

    const appModule = angular.module('app', ['ngRoute', 'playground', 'vanilla']);

    appModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/pages/playground.html'
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

})((<any>window).angular);
