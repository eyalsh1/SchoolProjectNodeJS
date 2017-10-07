var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'loginCtrl'
    })
    .state('school', {
        url : '/school',
        templateUrl : 'school.html',
        controller : 'schoolCtrl',
    })
    .state('administration', {
        url : '/administration',
        templateUrl : 'administration.html',
        controller : 'adminCtrl'
    });
});

app.controller('loginCtrl', function($scope, $rootScope, $state, $http/*, LoginService*/) {
    $rootScope.IsVisible = false;
    $scope.username = 'eyal.shalom@gmail.com';
    $scope.password = '1234';
    $scope.formSubmit = function() {
        //console.log("loginCtrl:" + $scope.username + "," + $scope.password);
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
                $state.transitionTo('school');
            }
        }.bind(this));        
    };
});

/*app.controller("myCtrl", function() {});*/

app.controller('schoolCtrl', function($scope, $rootScope, $state, $http/*LoginService*/) {
    //console.log("schoolCtrl");
    $rootScope.IsVisible = true;

    $http({url: '/school'}).then(function (response) {
        //console.log(response);
        $scope.courses = response.data;
        /*response.data.forEach(function(element) {
            console.log(element.name);
        }, this);*/
    }.bind(this))
});

app.controller('adminCtrl', function($scope, $state, $rootScope/*LoginService*/) {
    //console.log("adminCtrl");
    //$rootScope.IsVisible = true;
});

/*app.component('school', {
    template: `<ul ng-repeat="book in my.books">
                    <li><a ng-href="/book/{{book.id}}">{{book.name}}</a><img ng-src="{{book.pic}}" alt="book pic" height="42" width="42"></li>
               </ul>`,
    controller: function($http) {
        this.books = [];
        $http({url: '/school'}).then(function (response) {
            console.log(response);
            this.books = response.data;
        }.bind(this))
    },
    controllerAs: "my",
})*/

