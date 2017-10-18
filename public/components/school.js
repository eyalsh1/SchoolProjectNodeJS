angular.module('myApp').component('school', {
    bindings: { school: '<' },
    templateUrl: "templates/school.html",
    controller: function($scope, $rootScope, $http) {
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
    },  
});