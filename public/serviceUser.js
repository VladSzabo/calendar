angular
    .module("app")
    .service("serviceUser", serviceUser);

function serviceUser($http) {

    var vm = this;

    vm.CurrentMonth=localStorage.getItem('CurrentMonth');
    vm.userName = localStorage.getItem('userName');
    vm.loggedIn=localStorage.getItem('logged');

    vm.login = function () {
        var req = {
            method: 'GET',
            url: '/login?user=' + vm.credentials
        }
        return $http(req);
    }
    vm.register=function(){
        var req={
            method:'POST',
            url:'/register?newUser=' + vm.registerData
        }
        return $http(req);
    }
    vm.resetPassword=function(email){
        var req={
            method:'POST',
            url:'/resetPassword?email='+email
        }
        return $http(req);
    }
    vm.Reset=function(token,newPass1,newPass2){
        var req={
            method:'POST',
            url:'/Reset?token='+token,
            headers: {
                'Content-Type': "text/plain"
            },
            data: {
                newPass1: newPass1,
                newPass2: newPass2
            }
        }
        return $http(req);
    }


}