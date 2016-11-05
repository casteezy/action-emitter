angular.module('app', ['ngRoute', 'ngSanitize'])
    .controller('PlaygroundCtrl', [function() {
        var self = this;
        self.count = 0;
        self.btn = () => self.count++;
    }]) // end playground ctrl
;
