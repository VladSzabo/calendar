angular
    .module("app")
    .controller("Navbar", function (serviceUser) {
        var vm = this;
        vm.user = serviceUser;
        
    });
