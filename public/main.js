var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url : '/login',
        component: 'login'
    }).state('school', {
        url : '/school',
        component: 'school'
    }).state('administration', {
        url : '/administration',
        component: 'administration'
    }).state('course', {
        url : '/course/:id',
        templateUrl : 'templates/showCourse.html',
        controller : 'courseCtrl'
    }).state('student', {
        url : '/student/:id',
        templateUrl : 'templates/showStudent.html',
        controller : 'studentCtrl'
    }).state('addAdmin', {
        url : '/administration/add',
        templateUrl : 'templates/addEditAdmin.html',
        controller : 'addAdminCtrl'
    }).state('editAdmin', {
        url : '/admin/:id',
        templateUrl : 'templates/addEditAdmin.html',
        controller : 'editAdminCtrl'
    }).state('addStudent', {
        url : '/student/add',
        templateUrl : 'templates/addEditStudent.html',
        controller : 'addStudentCtrl'
    }).state('editStudent', {
        templateUrl : 'templates/addEditStudent.html',
        controller : 'editStudentCtrl'
    }).state('addCourse', {
        url : '/course/add',
        templateUrl : 'templates/addEditCourse.html',
        controller : 'addCourseCtrl'
    }).state('editCourse', {
        templateUrl : 'templates/addEditCourse.html',
        controller : 'editCourseCtrl'
    });

    $locationProvider.html5Mode(true);
});

/*app.controller("myCtrl", function($scope) {
});*/

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
        $scope.course_id = response.data[0].course_id;
        $scope.course_name = response.data[0].course_name;
        //console.log(data);
    }.bind(this));
});

app.controller('addAdminCtrl', function($scope, $http, $state) {
    $scope.title = "Add";
    $scope.deleteBtnVisible = false;
    $http({url: '/roles'}).then(function (response) {
        $scope.roles = response.data;
    }.bind(this));

    UploadFile('Admins');

    $scope.saveClick = function() {
        if ($scope.name != undefined) {
            var img = document.querySelector('img.class_img').src.split("/");
            $http({
                url: '/addAdmin',
                method: "POST",
                data: $.param({ name: $scope.name, phone: $scope.phone, email: $scope.email, password: $scope.password, role_id: $scope.role_id, image: img[img.length-1] }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $state.transitionTo('administration');
            }.bind(this));
        }
    }
});

app.controller('editAdminCtrl', function($scope, $http, $state) {
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

    $scope.saveClick = function() {
        var img = document.querySelector('img.class_img').src.split("/");
        $http({
            url: '/editAdmin',
            method: "POST",
            data: $.param({ name: $scope.name, phone: $scope.phone, email: $scope.email, password: $scope.password, role_id: $scope.role_id, image: img[img.length-1] }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('administration');
        }.bind(this));
    };

    $scope.deleteClick = function() {
        $http({
            url: '/deleteAdmin',
            method: "POST",
            data: $.param({ admin_id: $scope.$resolve.$stateParams.id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('administration');
        }.bind(this));
    };
});

app.controller('addCourseCtrl', function($scope, $http, $state) {
    $scope.title = "Add";
    $scope.deleteBtnVisible = false;
    UploadFile('Courses');

    $scope.saveClick = function() {
        if ($scope.name != undefined) {
            var img = document.querySelector('img.class_img').src.split("/");
            //console.log("addCourseCtrl:" + $scope.name + "," + $scope.description + "," + img[img.length-1]);
            $http({
                url: '/addCourse',
                method: "POST",
                data: $.param({ name: $scope.name, description: $scope.description, image: img[img.length-1] }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $state.transitionTo('school');
            }.bind(this));
        }
    }
});

app.controller('editCourseCtrl', function($scope, $http, $state, $location) {
    $scope.title = "Edit";
    $scope.deleteBtnVisible = true;
    var url = $location.$$url.split("/");
    var course_id = url[url.length-1];
    //console.log(course_id);

    UploadFile('Courses');

    $http({url: '/course/' + course_id}).then(function (response) {
        $scope.name = response.data[0][0].name;
        $scope.description = response.data[0][0].description;
        $scope.image = response.data[0][0].image;
        $scope.students = response.data[1];
    }.bind(this)); 

    $scope.saveClick = function() {
        var img = document.querySelector('img.class_img').src.split("/");
        //console.log("editCourseCtrl:" + $scope.name + "," + $scope.description + "," + img[img.length-1]);
        $http({
            url: '/editCourse',
            method: "POST",
            data: $.param({ name: $scope.name, description: $scope.description, image: img[img.length-1], course_id: course_id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('school');
        }.bind(this));
    };

    $scope.deleteClick = function() {
        //console.log("delete was pressed");
        $http({
            url: '/deleteCourse',
            method: "POST",
            data: $.param({ course_id: course_id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('school');
        }.bind(this));
    };
});

app.controller('addStudentCtrl', function($scope, $http, $state) {
    $scope.title = "Add";
    $scope.deleteBtnVisible = false;
    $http({url: '/courses'}).then(function (response) {
        $scope.courses = response.data;
    }.bind(this));

    UploadFile('Students');
    
    $scope.saveClick = function() {  
        if ($scope.name != undefined) {  
            var img = document.querySelector('img.class_img').src.split("/");
            //console.log("addStudentCtrl:" + $scope.name + "," + $scope.phone + "," + $scope.email + "," + $scope.courses.userChoice + "," + img[img.length-1]);
            $http({
                url: '/addStudent',
                method: "POST",
                data: $.param({ name: $scope.name, phone: $scope.phone, email: $scope.email, course_id: $scope.courses.userChoice, image: img[img.length-1] }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                $state.transitionTo('school');
            }.bind(this));
        }
    }
});

app.controller('editStudentCtrl', function($scope, $http, $state, $location) {
    $scope.title = "Edit";
    $scope.deleteBtnVisible = true;
    var url = $location.$$url.split("/");
    var student_id = url[url.length-1];
    //console.log(student_id);

    $http({url: '/courses'}).then(function (response) {
        $scope.courses = response.data;
    }.bind(this));
    
    UploadFile('Students');

    $http({url: '/student/' + student_id}).then(function (response) {
        //var data = response.data[0];
        $scope.name = response.data[0].name;
        $scope.phone = response.data[0].phone;
        $scope.email = response.data[0].email;
        $scope.image = response.data[0].image;
        $scope.course_id = response.data[0].course_id;
        $scope.course_name = response.data[0].course_name;
        $scope.courses.userChoice = response.data[0].course_id;
    }.bind(this));

    $scope.saveClick = function() {
        var img = document.querySelector('img.class_img').src.split("/");
        //console.log("editStudentCtrl:" + $scope.name + "," + $scope.description + "," + img[img.length-1]);
        $http({
            url: '/editStudent',
            method: "POST",
            data: $.param({ name: $scope.name, phone: $scope.phone, email: $scope.email, course_id: $scope.courses.userChoice, image: img[img.length-1], student_id: student_id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('school');
        }.bind(this));
    };

    $scope.deleteClick = function() {
        //console.log("delete was pressed");
        $http({
            url: '/deleteStudent',
            method: "POST",
            data: $.param({ student_id: student_id }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $state.transitionTo('school');
        }.bind(this));
    };
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