angular.module('myApp').component('administration', {
    bindings: { administration: '<' },
    templateUrl: "templates/administration.html",
    controller: function($scope, $rootScope, $http) {
        $rootScope.IsVisible = true;
        $http({url: '/admins'}).then(function (response) {
            $scope.admins = response.data;
        }.bind(this));
    },  
});