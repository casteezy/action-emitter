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

})((<any>window).angular);
