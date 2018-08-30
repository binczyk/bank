app.constant('routes', [
    {route: '/', templateUrl: 'html/home.html', controller: 'Home', controllerAs: 'ctrl', role: ["client", "employee"]},
    {
        route: '/1',
        templateUrl: 'html/page1.html',
        controller: 'Page1',
        controllerAs: 'ctrl',
        menu: 'Transfers',
        onlyLogged: true,
        role: ["client"]
    },
    {
        route: '/2',
        templateUrl: 'html/page2.html',
        controller: 'Page2',
        controllerAs: 'ctrl',
        menu: 'History',
        onlyLogged: true,
        role: ["client"]
    },
    {
        route: '/3',
        templateUrl: 'html/page3.html',
        controller: 'Page3',
        controllerAs: 'ctrl',
        menu: 'Chart',
        onlyLogged: true,
        role: ["client"]
    },
    {
        route: '/4',
        templateUrl: 'html/page4.html',
        controller: 'Page4',
        controllerAs: 'ctrl',
        menu: 'Users',
        onlyLogged: true,
        role: ["employee"]
    }
]);

app.config(['$routeProvider', 'routes', function ($routeProvider, routes) {
    for (var i in routes) {
        $routeProvider.when(routes[i].route, routes[i]);
    }
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.controller('Menu', ['$http', '$location', '$window', '$timeout', '$cookies', 'routes', 'globals', 'ws',
                        function ($http, $location, $window, $timeout, $cookies, routes, globals, ws) {
                            var ctrl = this;

                            ws.init($cookies.session);

                            ctrl.menu = [];

                            ctrl.refreshMenu = function () {
                                ctrl.menu = [];
                                for (var i in routes) {
                                    if (routes[i].menu && (!routes[i].onlyLogged || ctrl.loggedUser) && routes[i].role.indexOf(ctrl.userRole) != -1) {
                                        ctrl.menu.push({route: routes[i].route, title: routes[i].menu});
                                    }
                                }
                            }

                            $http.get('/user').then(
                                function (rep) {
                                    ctrl.loggedUser = rep.data.login;
                                    ctrl.userRole = rep.data.userRole;
                                    ctrl.refreshMenu();
                                },
                                function (err) {
                                    ctrl.loggedUser = '';
                                    ctrl.userRole = '';
                                    ctrl.refreshMenu();
                                }
                            );

                            ctrl.navClass = function (page) {
                                return page === $location.path() ? 'active' : '';
                            }

                            ctrl.logIn = function () {
                                ctrl.loginMsg = '';
                                ctrl.login = '';
                                ctrl.password = '';
                                ctrl.userRole = '';
                                $("#loginDialog").modal();
                            };

                            ctrl.logOut = function () {
                                $http.delete('/user');
                                ctrl.loggedUser = '';
                                ctrl.refreshMenu();
                                ctrl.login = '';
                                ctrl.password = '';
                                ctrl.userRole = '';
                                ctrl.alert.type = 'success';
                                ctrl.alert.message = 'Logout';
                                $timeout(function () {
                                    $window.location.href = '/#/';
                                }, 2000);
                            };

                            ctrl.validateCredentials = function () {
                                $http.post('/user', {login: ctrl.login, password: ctrl.password}).then(
                                    function (rep) {
                                        ctrl.loggedUser = rep.data.login;
                                        ctrl.userRole = rep.data.role;
                                        ctrl.refreshMenu();
                                        $("#loginDialog").modal('hide');
                                        ctrl.alert.type = 'success';
                                        ctrl.alert.message = 'Login successful';
                                        $timeout(function () {
                                            $window.location.href = '/#/';
                                        }, 2000);
                                    },
                                    function (err) {
                                        ctrl.loggedUser = '';
                                        ctrl.refreshMenu();
                                        ctrl.loginMsg = 'failed';
                                    }
                                );
                            }

                            ctrl.closeAlert = function () {
                                ctrl.alert.type = 'info';
                                ctrl.alert.from = '';
                                ctrl.alert.message = '';
                            };

                            ctrl.alert = globals.alert;
                        }
]);