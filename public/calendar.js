angular
    .module("app")
    .controller("Calendar", ["$location", "serviceCalendar", "serviceUser",
        function ($location, serviceCalendar, serviceUser) {
            var vm = this;
            vm.user = serviceUser;

            var date = new Date();
            //xczx
            if (!vm.user.selectedYear) {
                vm.user.selectedYear = date.getFullYear();
                vm.user.selectedMonth = date.toLocaleString('ro', { month: "long" }).capitalizeFirstLetter();
            }
            if (localStorage.getItem("userName")) {
                vm.user.userName = localStorage.getItem("userName");
            }

            vm.user.CurrentMonth = vm.user.selectedYear + '-' + getMonthIndex(vm.user.selectedMonth);
            localStorage.setItem('CurrentMonth', vm.user.CurrentMonth);
            vm.user.currentDay = date.getDate();
            vm.years = [];
            vm.months = [];
            initializareDropDown();
            vm.latime = screen.width;
            vm.daysInWeek = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
            vm.daysInWeekFisrtLetter = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
            
            

            vm.redirect = function () {
                $location.path("login");
            }
            vm.update = function () {
                vm.days = serviceCalendar.getDays(vm.user.selectedYear, vm.user.selectedMonth);
                var data = vm.user.selectedYear + '-' + getMonthIndex(vm.user.selectedMonth);

                serviceCalendar.getALLEvents(data).then((response) => {

                    var body = response.data;
                    var month = getMonthIndex(vm.user.selectedMonth);
                    var startingDay = getStartingDay(vm.user.selectedYear, month);
                    
                    if (body != false) {

                        var newDay=0;
                        for (var i = 0; i < body.length; i++) { 
                            var day=body[i].day.substr(8);
                            var index = +day + startingDay -1;
                            vm.days[Math.floor(index / 7)][index%7].events.push(body[i].title);
                        }
                    }
                });
            };
            
            vm.update();
            serviceCalendar.getTheme();


            vm.newEvent = function newEvent(day) {
                $location.path("event/" + vm.user.selectedYear + "/" + vm.user.selectedMonth + "/" + day);
            }

            function initializareDropDown() {
                for (var i = 5; i >= -5; i--) {
                    vm.years.push(+vm.user.selectedYear - i);
                }

                date = new Date(2000, 11, 1);
                for (var i = 0; i < 12; i++) {
                    date.setMonth(date.getMonth() + 1);
                    vm.months.push(date.toLocaleString('ro', { month: "long" }).capitalizeFirstLetter());
                }
            }

            function getStartingDay(year, month) {

                var startingDay = new Date(year, month).getDay();
                if (startingDay == 0) return 6;
                else return (startingDay - 1);
            }

            function getMonthIndex(val) {

                var luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
                var index = '0';
                for (var i = 0; i < 12; i++) {

                    if (luni[i] == val.capitalizeFirstLetter()) {

                        if (i < 10)
                            index = index + i;
                        else
                            index = i;
                        return index;
                    }
                }

            }

        }]);

