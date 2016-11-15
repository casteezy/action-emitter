var app;
(function (app) {
    angular.module('app', ['ngRoute', 'ngSanitize'])
        .controller('PlaygroundCtrl', [function () {
            var self = this;
            self.count = 0;
            self.btn = function () { return self.count++; };
        }]);
})(app || (app = {}));
//# sourceMappingURL=app.js.map