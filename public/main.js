var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
    })
    .state('home', {
        url : '/home',
        templateUrl : 'home.html',
        controller : 'HomeController'
    });
});

app.controller('LoginController', function($scope, $state, $http/*, LoginService*/) {
    $scope.formSubmit = function() {
        $http({
            url: '/login',
            method: "POST",
            data: $.param({ username: $scope.username, password: $scope.password }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            //console.log("response" + JSON.stringify(response));
            //console.log("code=" + response.data.code + "," + "success=" + response.data.success);
            //if (LoginService.login($scope.username, $scope.password)) {
            if (response.data.code != 200)
            {
                $scope.error = response.data.success;
            } else {
                //$scope.error = '';
                //$scope.username = '';
                //$scope.password = '';
                $state.transitionTo('home');
            }
        }.bind(this));     
    };
});

app.controller('HomeController', function($scope, $state/*, LoginService*/) {
});

/*app.factory('LoginService', function() {
    var isAuthenticated = false;
   
    return {
        login : function(username, password) {
            
            return isAuthenticated;
        }        
    };
});*/