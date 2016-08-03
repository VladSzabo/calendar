angular
    .module("app")
    .service("serviceCalendar", serviceCalendar);

function serviceCalendar($http, serviceUser) {

    var service = this;

    service.getDays = function (anul, luna) {
        var month = getMonthIndex(luna);
        var startingDay = getStartingDay(anul, month);
        var numberOfDaysInMonth = getDaysInMonth(month + 1, anul);
        var zile = [[]];
        for (var k = 0; k < 6; k++) {
            zile[k] = [];
            for (var l = 0; l < 7; l++)
                zile[k][l] = {
                    value: 0,
                    events: []
                };
        }

        for (var k = 0; k < startingDay; k++) {
            zile[0][k].value = 0;
        }

        var currentDay = startingDay;

        while (currentDay <= numberOfDaysInMonth + startingDay - 1) {
            zile[Math.floor(currentDay / 7)][currentDay % 7].value = currentDay - startingDay + 1;
            currentDay++;
        }
        return zile;
    }

    service.getEvents = function (day) {
        var promise = $http({
            method: 'GET',
            url: '/getEvents?day=' + day
        });
        promise.then(function successCallback(response) {
            console.warn(response);
        }, function errorCallback(response) {
        });
        return promise;
    }

    service.getAllGuests = function () {
        var promise = $http({
            method: 'GET',
            url: '/getAllGuests'
        });
        promise.then(function successCallback(response) {
            console.warn(response);
        }, function errorCallback(response) {
        });
        return promise;
    }

    service.getALLEvents = function (date) {
        var promise = $http({
            method: 'GET',
            url: '/getALLEvents?date=' + date
        });
        promise.then(function successCallback(response) {
            console.warn(response);
        }, function errorCallback(response) {
        });
        return promise;
    }

    service.addEvent = function (event) {
        var req = {
            method: 'POST',
            url: 'addEvent',
            headers: {
                'Content-Type': "text/plain"
            },
            data: event
        }
        return $http(req);
    }
    service.saveEvent = function (event, index) {
        var req = {
            method: 'POST',
            url: 'saveEvent',
            headers: {
                'Content-Type': "text/plain"
            },
            data: {
                index: index,
                event: event
            }
        }
        return $http(req);
    }
    service.deleteEvent = function (index, day) {
        var req = {
            method: 'POST',
            url: 'deleteEvent',
            headers: {
                'Content-Type': "text/plain"
            },
            data: {
                index: index,
                day: day
            }
        }
        return $http(req);
    }

    service.changeTheme = function (theme) {
        var req = {
            method: 'POST',
            url: 'changeTheme',
            headers: {
                'Content-Type': "text/plain"
            },
            data: {
                theme: theme
            }
        }
        return $http(req);
    }

    service.getTheme = function () {
        var promise = $http({
            method: 'GET',
            url: '/getTheme'
        });

        promise.then(function (response) {
            var theme = response.data;
            if (!theme) {
                theme = 'darkly';
                console.log("DEFAULT");
            }
            var el = document.getElementById("app-theme");
            el.href = 'https://bootswatch.com/' + theme + '/bootstrap.min.css';
        });
    }

    function getMonthIndex(val) {

        var luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

        for (var i = 0; i < 12; i++) {

            if (luni[i] == val.capitalizeFirstLetter())
                return i;
        }

    }

    function getStartingDay(year, month) {
        var startingDay = new Date(year, month).getDay();
        if (startingDay == 0) return 6;
        else return (startingDay - 1);
    }

    function getDaysInMonth(m, y) {
        return /8|3|5|10/.test(--m) ? 30 : m == 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31;
    }

}

