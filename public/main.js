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
    })
    .state('School', {
        url : '/School',
        templateUrl : 'home.html',
        controller : 'HomeController'
    })
    .state('Administration', {
        url : '/Administration',
        templateUrl : 'home.html',
        controller : 'HomeController'
    });
});

app.controller('LoginController', function($scope, $rootScope, $state, $http/*, LoginService*/) {
    $rootScope.IsVisible = false;
    $scope.formSubmit = function() {
        //console.log("LoginController:" + $scope.username + "," + $scope.password);
        //this.books = [];
        $http({
            url: '/login',
            method: "POST",
            data: $.param({ username: $scope.username, password: $scope.password }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            //this.books = response.data;  
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

app.controller('HomeController', function($scope, $state, $rootScope/*LoginService*/) {
    $rootScope.IsVisible = true;
});

app.controller('IndexController', function($scope, $rootScope) {
    $rootScope.IsVisible = false;
});

/*app.factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'pass';
    var isAuthenticated = false;

    return {
        login : function(username, password) {
            isAuthenticated = username === admin && password === pass;
            return isAuthenticated;
        },
        isAuthenticated : function() {
            return isAuthenticated;
        }
    };
});*/


/*var myApp = angular.module('main', ['ui.router']);

myApp.config(function($stateProvider) {
    var helloState = {
        name: 'hello',
        url: '/hello',
        template: '<h3>{{ title }}</h3>'
    }

    var worldState = {
        name: 'world',
        url: '/world',
        templateUrl: "world.html"
    }

    var greetingState = {
        name: 'greeting',
        url: '/greeting',
        component: 'test'
    }

    $stateProvider.state(helloState);
    $stateProvider.state(worldState);
    $stateProvider.state(greetingState);
});

myApp.controller("myCtrl", function($scope, $http) {
    $scope.title = "hello";
});

myApp.component('test', {
    template:  `<ul ng-repeat="book in my.books">
                    <li><a ng-href="/book/{{book.id}}">{{book.name}}</a><img ng-src="{{book.pic}}" alt="book pic" height="42" width="42"></li>
                </ul>`,
    controller: function($http) {
        this.books = [];
        $http({url: '/books'}).then(function (response) {
            console.log(response);
            this.books = response.data;
        }.bind(this))
    },
    controllerAs: "my",
})*/
