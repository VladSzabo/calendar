
var app = angular.module("app", ['ngRoute']);
app.service("getInfo", getInfo);

app.controller("calendar", calendar);

var clickedRow, clickedColumn;

function calendar($http, serviceCalendar, serviceUser) {

    var vm = this;
    var date = new Date();


    vm.user = serviceUser;
    vm.zile = [[]];

    vm.selectedYear = date.getFullYear();
    vm.selectedMonth = date.toLocaleString('ro', { month: "long" }).capitalizeFirstLetter();

    //generateDays();
    //requestEvents();

    //Update la select-uri
    vm.update = function () {
        generateDays();
        requestEvents();
    };

    vm.click = function (row, column) {
        clickedRow = row;
        clickedColumn = column;
    }
    
    vm.days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    vm.years = [];
    vm.months = [];

    //initializareDropDown();

    function requestEvents() {
        serviceCalendar.getALLEvents().then((response) => {
            var body = response.data;
            if(body !== false){
                for(var i=0;i<body.days.length;i++){
                    vm.zile[Math.floor(body.days[i].value / 7)][body.days[i].value % 7].events = body.days[i].events;
                }
            }
        });
    }

    function generateDays() {

        var month = getMonthIndex(vm.selectedMonth);
        var startingDay = getStartingDay(vm.selectedYear, month);
        var numberOfDaysInMonth = getDaysInMonth(month + 1, vm.selectedYear);

        for (var k = 0; k < 6; k++) {
            vm.zile[k] = [];
            for (var l = 0; l < 7; l++)
                vm.zile[k][l] = {
                    value: 0,
                    events: []
                };
        }

        for (var k = 0; k < startingDay; k++) {
            vm.zile[0][k].value = 0;
        }

        var currentDay = startingDay;

        while (currentDay <= numberOfDaysInMonth + startingDay - 1) {
            vm.zile[Math.floor(currentDay / 7)][currentDay % 7].value = currentDay - startingDay + 1;
            currentDay++;
        }

    }

    function initializareDropDown() {
        for (var i = 5; i >= -5; i--) {
            vm.years.push(+vm.selectedYear - i);
        }

        date = new Date(2000, 11, 1);
        for (var i = 0; i < 12; i++) {
            date.setMonth(date.getMonth() + 1);
            vm.months.push(date.toLocaleString('ro', { month: "long" }).capitalizeFirstLetter());
        }
    }

}

function getInfo() {

    var service = this;
    var info = JSON.parse(localStorage.getItem("info"));

    service.getCurrentInfo = function () {
        return {
            yearIndex: info.lastYear,
            monthIndex: info.lastMonth,

            year: info.years[info.lastYear].value,
            month: info.years[info.lastYear].months[info.lastMonth].name,
            day: info.years[info.lastYear].months[info.lastMonth].days[clickedRow][clickedColumn]
        }
    }

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

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
