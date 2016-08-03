// https://bootswatch.com/cerulean/
// src="cerulean/thumbnail.png"
// https://bootswatch.com/cerulean/bootstrap.min.css
angular
    .module("app")
    .controller("Theme", function ($location, serviceCalendar) {
        var vm = this;
        vm.themes = ['cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal', 'lumen', 'paper', 'readable', 'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti'];
        vm.setTheme = function name(theme) {
            var el = document.getElementById("app-theme");
            el.href = 'https://bootswatch.com/' + theme + '/bootstrap.min.css';

            serviceCalendar.changeTheme(theme).then( function success(response){
                console.log("Schimbat tema cu succes");
            });

            $location.path('/calendar');
        }
    });

