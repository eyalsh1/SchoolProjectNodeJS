angular.module('myApp').component('login', {
    bindings: { login: '<' },
    templateUrl: "templates/login.html",
    controller: function($scope, $rootScope, $state, $http) {
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
    },  
});