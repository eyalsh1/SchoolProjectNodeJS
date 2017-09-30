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

app.controller('LoginController', function($scope, $state, $http, LoginService) {
    $scope.formSubmit = function() {
        console.log("LoginController:" + $scope.username + "," + $scope.password);
        this.users = [];
        $http({
            url: '/login',
            method: "POST"
        }).then(function (response) {
          this.users = response.data;  

          console.log("users=" + response.data + "," + $scope.username + "," + $scope.password);
          if (LoginService.login($scope.username, $scope.password)) {
              $scope.error = '';
              $scope.username = '';
              $scope.password = '';
              $state.transitionTo('home');
          } else {
              $scope.error = "Incorrect username/password !";
          }   

        }.bind(this));

        
    };
});

app.controller('HomeController', function($scope, $state, LoginService) {
});

app.factory('LoginService', function() {
    var isAuthenticated = false;
   
    return {
        login : function(username, password) {
            
            return isAuthenticated;
        }        
    };
});

