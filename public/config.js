angular
    .module("app")
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/calendar', {
                    templateUrl: 'calendar.html',
                    controller: 'Calendar as vm'
                }).
                when('/theme', {
                    templateUrl: 'theme.html',
                    controller: 'Theme as vm'
                }).
                when('/guests/:event', {
                    templateUrl: 'guests.html',
                    controller: 'Guests as vm'
                }).
                when('/event/:year/:month/:day', {
                    templateUrl: 'event.html',
                    controller: 'Event as vm'
                }).
                when('/login/:token?', {
                    templateUrl: 'login.html',
                    controller: 'Login as vm'
                }).
                otherwise({
                    redirectTo: '/calendar'
                });
        }]);
function httpInterceptor() {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (localStorage.getItem('token')) {
                config.headers.token = localStorage.getItem('token');
            } else {
                if (window.location.href.indexOf('/login') == -1)
                    window.location.href = '/#/login';
            }

            return config;
        },

        requestError: function (config) {
            return config;
        },

        response: function (res) {
            return res;
        },

        responseError: function (res) {

            return res;
        }
    }
}

angular.module('app')
    .factory('httpInterceptor', httpInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    });
