var app = angular.module("app");

app.controller("Event", event);

function event($routeParams, $window, serviceCalendar, serviceUser) {
    var vm = this;
    vm.day = serviceUser.CurrentMonth + '-' + (($routeParams.day < 9) ? '0' + $routeParams.day : $routeParams.day);
    vm.guests = [];
    vm.events = [];
    serviceCalendar.getEvents(vm.day).then(function (events) {
        vm.events = events.data;
    });

    serviceCalendar.getAllGuests().then(function (guests) {
        vm.guests = guests.data;
    });

    vm.goBack = function goBack() {
        $window.history.back();
    };

    vm.saveEvent = function saveEvent(event, index) {
        if (event.isEditing) {
            for (var i = event.guests.length; i--;) {
                if (event.guests[i].status || event.guests[i].check)
                    event.guests[i].status = event.guests[i].status || 'fa-hourglass';
                else
                    event.guests.splice(i, 1);
            }
        } else {
            vm.guests.forEach(function (name) {
                var found = false;
                event.guests.forEach(function (guest) {
                    if (guest.name == name) found = true;
                });
                if (!found) event.guests.push({ name: name });
            });
        }

        event.isEditing = !event.isEditing;
        if (!event.isEditing)
            serviceCalendar.saveEvent(event, index).then(function (ok) {
                //vm.events.push(item);
            });
    }
    vm.addEvent = function addEvent() {
        var event = { day: vm.day, title: 'New event', description: 'for everyone', guests: [] };
        vm.saveEvent(event, vm.events.length);
        vm.events.push(event);
        serviceCalendar.addEvent(event).then(function succes(ok) {
            //if (ok.data === true)
                //vm.events.push(event);
        });
    }

    vm.deleteEvent = function deleteEvent(index, day) {
        vm.events.splice(index, 1);
        serviceCalendar.deleteEvent(index, day).then(function (ok) {
            if (ok.data === true)
                vm.events.splice(index, 1);
        });
    }
}
