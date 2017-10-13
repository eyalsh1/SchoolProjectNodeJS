var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
        controller : 'administrationCtrl'
    })
    .state('course', {
        url : '/course/:id',
        templateUrl : 'showCourse.html',
        controller : 'courseCtrl'
    })
    .state('student', {
        url : '/student/:id',
        templateUrl : 'showStudent.html',
        controller : 'studentCtrl'
    })
    .state('admin', {
        url : '/admin/:id',
        templateUrl : 'showAdmin.html',
        controller : 'adminCtrl'
    });

    $locationProvider.html5Mode(true);
});

app.controller('loginCtrl', function($scope, $rootScope, $state, $http) {
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

app.controller('schoolCtrl', function($scope, $rootScope, $http) {
    //console.log("schoolCtrl");
    $rootScope.IsVisible = true;

    $http({url: '/courses'}).then(function (response) {
        //console.log(response.data);
        $scope.courses = response.data;
        /*response.data.forEach(function(element) {
            console.log(element.name);
        }, this);*/
    }.bind(this));

    $http({url: '/students'}).then(function (response) {
        $scope.students = response.data;
    }.bind(this));
});

app.controller('administrationCtrl', function($scope, $rootScope, $http) {
    //console.log("adminCtrl");
    $rootScope.IsVisible = true;
    $http({url: '/admins'}).then(function (response) {
        $scope.admins = response.data;
    }.bind(this));
});

app.controller('courseCtrl', function($scope, $rootScope, $http) {
    //console.log($scope);
    //$scope.msg = "Id = " + $scope.$resolve.$stateParams.id;
    $http({url: '/course/' + $scope.$resolve.$stateParams.id}).then(function (response) {
        //console.log(response.data[0]);
        $scope.name = response.data[0][0].name;
        $scope.description = response.data[0][0].description;
        $scope.image = response.data[0][0].image;
        //console.log(response.data[1]);
        $scope.students = response.data[1];
    }.bind(this)); 
});

app.controller('studentCtrl', function($scope, $rootScope, $http) {
    //console.log($scope);
    //$scope.msg = "Id = " + $scope.$resolve.$stateParams.id;
    $http({url: '/student/' + $scope.$resolve.$stateParams.id}).then(function (response) {
        //var data = response.data[0];
        $scope.id = response.data[0].id;
        $scope.phone = response.data[0].phone;
        $scope.email = response.data[0].email;
        $scope.image = response.data[0].image;
        $scope.course_id = response.data[0].course_id;
        //console.log(data);
    }.bind(this));
});

app.controller('adminCtrl', function($scope, $rootScope, $http) {
    //console.log($scope);
    //$scope.msg = "Id = " + $scope.$resolve.$stateParams.id;
    $http({url: '/admin/' + $scope.$resolve.$stateParams.id}).then(function (response) {
        //var data = response.data[0];
        $scope.id = response.data[0].id;
        $scope.name = response.data[0].name;
        $scope.phone = response.data[0].phone;
        $scope.email = response.data[0].email;
        $scope.image = response.data[0].image;
        $scope.role = response.data[0].role; 
        //console.log(data);
    }.bind(this));
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

