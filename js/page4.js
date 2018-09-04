app.controller("Page4", ["$http", "common", "globals", function ($http, common, globals) {

    var ctrl = this;

    ctrl.common = common;

    ctrl.nSkip = 0;
    ctrl.nLimit = 5;
    ctrl.numberOfUsers = 0;

    ctrl.newLogin = "";
    ctrl.newLimit = "";

    ctrl.inEdit = [];

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

    ctrl.editUserAccount = function (index, userAccount) {
        ctrl.inEdit[index] = true;
        ctrl.newLogin = userAccount.login;
        ctrl.newLimit = userAccount.limit;
    };

    ctrl.save = function (index, userId) {
        ctrl.inEdit[index] = false;

        $http.post('/account/update/', {
            userId: userId,
            newLogin: ctrl.newLogin,
            newLimit: ctrl.newLimit
        }).then(function (rep) {
                    ctrl.getAccounts();
                    globals.alert.message = 'Operation successfully';
                    globals.alert.type = 'success';
                },
                function (err) {
                    globals.alert.type = 'danger';
                    globals.alert.message = 'Operation failed!';
                }
        );
    };

    ctrl.cancel = function (index) {
        ctrl.inEdit[index] = false;
        ctrl.newLimit = "";
        ctrl.newLogin = "";
    }

    ctrl.getAccounts();
}]);