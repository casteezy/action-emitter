(function(angular) {

    const vanillaModule = angular.module('vanilla', []);

    vanillaModule.controller('VanillaCtrl', class VanillaCtrl {
        constructor() {
        }
    });

})((<any>window).angular);