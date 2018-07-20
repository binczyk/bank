app.controller("Page4", ["$http", "common", function ($http, common) {

    var ctrl = this;

    ctrl.common = common;

    ctrl.nSkip = 0;
    ctrl.nLimit = 5;
    ctrl.numberOfUsers = 0;

    ctrl.getAccounts = function () {
        $http.get('/accounts/' + ctrl.nSkip + "/" + ctrl.nLimit).then(
            function (rep) {
                ctrl.account = rep.data;
            },
            function (err) {
                ctrl.account = [];
            }
        );
    };

    ctrl.incLimit = function () {
        ctrl.nLimit++;
        ctrl.getAccounts();
    };

    ctrl.incSkip = function () {
        ctrl.nSkip++;
        ctrl.getAccounts();
    };

    $http.get("/accounts/").then(
        function (rep) {
            ctrl.numberOfUsers = rep.data.length;
        },
        function (err) {
            ctrl.numberOfUsers = 0;
        }
    );

    ctrl.getAccounts();
}]);