angular
    .module("app")
    .service("serviceUser", serviceUser)
    .run(
    function ($rootScope) {
        if ((localStorage.getItem('userName')) && (localStorage.getItem('logged')))
            $rootScope.$broadcast('Logged In', { name: localStorage.getItem('userName') });
    }
    )

function serviceUser($http, $rootScope) {

    var vm = this;

    vm.CurrentMonth = localStorage.getItem('CurrentMonth');
    vm.userName = localStorage.getItem('userName');
    vm.loggedIn = localStorage.getItem('logged');

    /*   vm.themeReset = function () {
           if ((vm.userName) && (vm.loggedIn)) {
               $rootScope.$broadcast('Logged In', { name: vm.userName });
           }
       }
       vm.themeReset();*/

    vm.login = function () {
        var req = {
            method: 'GET',
            url: '/login?user=' + vm.credentials
        }
        var promise = $http(req);
        promise.then(function (params) {
            $rootScope.$broadcast('Logged In', { name: vm.userName });
        });

        return promise;
    }
    vm.register = function () {
        var req = {
            method: 'POST',
            url: '/register?newUser=' + vm.registerData
        }
        var promise = $http(req);
        promise.then(function (params) {
            $rootScope.$broadcast('Logged In', { name: vm.userName });
        });
        return promise;
    }
    vm.resetPassword = function (email) {
        var req = {
            method: 'POST',
            url: '/resetPassword?email=' + email
        }
        return $http(req);
    }
    vm.Reset = function (token, newPass1, newPass2) {
        var req = {
            method: 'POST',
            url: '/Reset?token=' + token,
            headers: {
                'Content-Type': "text/plain"
            },
            data: {
                newPass1: newPass1,
                newPass2: newPass2
            }
        }
        var promise = $http(req);
        promise.then(function (params) {
            $rootScope.$broadcast('Logged In', { name: vm.userName });
        });
        return promise;
    }


}