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
            var guests = [];
            event.guests.forEach(function (element) {
                if (element.check) guests.push(element.name);
            });
        } else {
            var guests = [];
            vm.guests.forEach(function (element) {
                guests.push({ name: element, check: (event.guests.indexOf(element) !== -1) });
            });
        }
        event.guests = guests;
        console.log(event.guests);
        event.isEditing = !event.isEditing;
        if (!event.isEditing)
            serviceCalendar.saveEvent(event, index).then(function (ok) {
                //vm.events.push(item);
            });
    }
    vm.addEvent = function addEvent() {
        var event = { day: vm.day, title: 'New event', description: 'for everyone', guests: [], isEditing: true };
        vm.events.push(event);
        serviceCalendar.addEvent(event).then(function succes(ok) {
            if (ok.data === true)
                vm.events.push(event);
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
