
var myapp = angular.module('myapp',['ui.router']);
myapp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/doctor");
    $stateProvider
        .state("doctor", {
            url: "/doctor",
            templateUrl: "doctor.html"
        })
});
