/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angularjs/angular-sanitize.d.ts" />
module app {
    angular.module('app', ['ngRoute', 'ngSanitize'])
        .controller('PlaygroundCtrl', [function() {
            var self = this;
            self.count = 0;
            self.btn = () => self.count++;
        }]);
}