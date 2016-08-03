angular
    .module("app")
    .controller("Login",
    function ($location, $http, $routeParams, serviceUser) {
        var vm = this;
        vm.user = serviceUser;
        vm.token = $routeParams.token;
        vm.actions = ['Autentificare', 'Înregistrare'];
        vm.currentAction = vm.actions[0];
        vm.opositeAction = vm.actions[1];

        vm.isReset = false;

        vm.user.loggedIn=false;

        localStorage.clear();

        vm.switchAction = function () {
            var action = vm.currentAction;
            vm.currentAction = vm.opositeAction;
            vm.opositeAction = action;
        }

        vm.doAction = function () {
            if (vm.currentAction === 'Autentificare')
                vm.login();
            else
                vm.register();
        }
        vm.login = function () {
            if ((vm.user.userName) && (vm.user.password)) {
                var credentials = vm.user.userName + "." + vm.user.password;
                vm.user.credentials = credentials;
                vm.user.login().then(function (response) {
                    if (response.data) {
                        localStorage.setItem('token', response.data);
                        localStorage.setItem('userName', vm.user.userName);
                        localStorage.setItem('logged', true);
                        vm.user.loggedIn = true;
                        $location.path("calendar");
                    }
                    else
                        alert("Nume/parolă invalide");
                });
            }
            else
                alert("Introduceți un nume și o parolă");
        }
        vm.register = function () {
            if (vm.user.userName && vm.user.password && vm.user.passwordConfirm && vm.user.email) {
                vm.user.registerData = vm.user.userName + "/" + vm.user.password + "/" + vm.user.passwordConfirm + "/" + vm.user.email;
                vm.user.register().then(function (response) {
                    if (response.data) {
                        vm.user.loggedIn = true;
                        vm.login();
                        $location.path("calendar");
                    }
                    else
                        alert("Datele nu sunt valide.Înregistrare eșuată.");
                });
            }
            else
                alert("Completați toate câmpurile.");
        }
        vm.resetPassword = function () {
            vm.user.resetPassword(vm.user.email).then(function (response) {
                if (response.data)
                    alert("Verificati mail-ul pentru a reseta parola");
                else
                    alert("Nu exista nici un utilizator cu acest mail");
            });
        }
        vm.Reset = function () {
            vm.user.Reset(vm.token, vm.newPass1, vm.newPass2).then(function (response) {
                if (response.data) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userName', response.data.name);
                    localStorage.setItem('logged', true);
                    vm.user.loggedIn = true;
                    $location.path("calendar");
                }
                else
                    alert("Reset failed.");
            });
        }
    });
