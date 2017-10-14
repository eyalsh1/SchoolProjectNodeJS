var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'loginCtrl'
    }).state('school', {
        url : '/school',
        templateUrl : 'school.html',
        controller : 'schoolCtrl',
    }).state('administration', {
        url : '/administration',
        templateUrl : 'administration.html',
        controller : 'administrationCtrl'
    }).state('course', {
        url : '/course/:id',
        templateUrl : 'showCourse.html',
        controller : 'courseCtrl'
    }).state('student', {
        url : '/student/:id',
        templateUrl : 'showStudent.html',
        controller : 'studentCtrl'
    }).state('editAdmin', {
        url : '/admin/:id',
        templateUrl : 'addEditAdmin.html',
        controller : 'editAdminCtrl'
    }).state('addAdmin', {
        url : '/administration/add',
        templateUrl : 'addEditAdmin.html',
        controller : 'addAdminCtrl'
    }).state('addStudent', {
        url : '/student/add',
        templateUrl : 'addStudent.html',
        controller : 'addStudentCtrl'
    }).state('addCourse', {
        url : '/course/add',
        templateUrl : 'addCourse.html',
        controller : 'addCourseCtrl'
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
                //console.log(response.data.data);
                $rootScope.loginName = response.data.data[0].name;
                $rootScope.loginRole = response.data.data[0].role;
                $rootScope.loginImage = response.data.data[0].image;
                $state.transitionTo('school');
            }
        }.bind(this));        
    };
});

/*app.controller("myCtrl", function($scope) {
});*/

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

app.controller('studentCtrl', function($scope, $http) {
    //console.log($scope);
    //$scope.msg = "Id = " + $scope.$resolve.$stateParams.id;
    $http({url: '/student/' + $scope.$resolve.$stateParams.id}).then(function (response) {
        //var data = response.data[0];
        $scope.name = response.data[0].name;
        $scope.phone = response.data[0].phone;
        $scope.email = response.data[0].email;
        $scope.image = response.data[0].image;
        $scope.course = response.data[0].course;
        //console.log(data);
    }.bind(this));
});

app.controller('editAdminCtrl', function($scope, $http) {
    //console.log($scope);
    //$scope.msg = "Id = " + $scope.$resolve.$stateParams.id;
    $scope.title = "Edit";
    $scope.deleteBtnVisible = true;
    $http({url: '/admin/' + $scope.$resolve.$stateParams.id}).then(function (response) {
        //console.log(response.data[0]);
        $scope.name = response.data[0][0].name;
        $scope.phone = response.data[0][0].phone;
        $scope.email = response.data[0][0].email;
        $scope.image = response.data[0][0].image;
        $scope.password = response.data[0][0].password;
        $scope.role_id = response.data[0][0].role_id;
        $scope.role_name = response.data[0][0].role;
        $scope.roles = response.data[1];
        //console.log(response.data[1]);
    }.bind(this));

    UploadFile('Admins');
});

app.controller('addAdminCtrl', function($scope, $http) {
    $scope.title = "Add";
    $scope.deleteBtnVisible = false;
    $http({url: '/roles'}).then(function (response) {
        $scope.roles = response.data;
    }.bind(this));

    UploadFile('Admins');
});

app.controller('addStudentCtrl', function($scope, $http) {
    $http({url: '/courses'}).then(function (response) {
        $scope.courses = response.data;
    }.bind(this));
    UploadFile('Students');
});

app.controller('addCourseCtrl', function($scope, $http) {
    UploadFile('Courses');
});

function UploadFile(type) {
    var file = document.querySelector('input.class_img');
    file.addEventListener('change', function (e) {
        var data = new FormData();
        data.append('img', e.target.files[0])

        fetch('upload/' + type, {
            body: data,
            method: "POST"
        }).then(function (response) {
            return response.text()
        }).then(function (body) {
            document.querySelector('img.class_img').src = 'img/' + type + '/' + e.target.files[0].name;
        });
    });
}