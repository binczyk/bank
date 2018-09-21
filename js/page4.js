app.controller("Page4", ["$http", "common", "globals", function ($http, common, globals) {

    var ctrl = this;

    ctrl.common = common;

    ctrl.nSkip = 0;
    ctrl.nLimit = 5;
    ctrl.numberOfUsers = 0;

    ctrl.newLogin = "";
    ctrl.newLimit = "";
    ctrl.newPassword = "";
    ctrl.newRole = "";

    ctrl.editedLogin = [];
    ctrl.editedLimit = [];
    ctrl.inEdit = [];

    ctrl.getAccounts = function () {
        $http.get('/accounts/' + ctrl.nSkip + "/" + ctrl.nLimit).then(
            function (rep) {
                ctrl.account = rep.data;
                $http.get("/accounts/").then(
                    function (rep) {
                        ctrl.numberOfUsers = rep.data.length;
                    },
                    function (err) {
                        ctrl.numberOfUsers = 0;
                    }
                );
            },
            function (err) {
                ctrl.account = [];
            }
        );
    };

    ctrl.incLimit = function () {
        ctrl.nLimit = ctrl.nLimit + 5;
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
        ctrl.editedLogin[index] = userAccount.login;
        ctrl.editedLimit[index] = userAccount.limit;
    };

    ctrl.save = function (index, userId) {
        ctrl.inEdit[index] = false;

        $http.post('/account/update/', {
            userId: userId,
            newLogin: ctrl.editedLogin[index],
            newLimit: ctrl.editedLimit[index]
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
    };

    ctrl.openDialog = function () {
        $("#createNewUserDialog").modal();
    };

    ctrl.create = function () {
        if (role === "" || role === "employee") {
            ctrl.newLimit = "";
        }
        $http.post("/account/create/", {
            newLogin: ctrl.newLogin,
            newPassword: ctrl.newPassword,
            newRole: ctrl.newRole,
            newLimit: ctrl.newLimit
        }).then(function (rep) {
                    ctrl.getAccounts();
                    globals.alert.message = 'New user has been created: ' + ctrl.newLogin;
                    globals.alert.type = 'success';
                    $("#createNewUserDialog").modal("hide");
                    ctrl.newLogin = "";
                    ctrl.newLimit = "";
                    ctrl.newPassword = "";
                    ctrl.newRole = "";
                },
                function (err) {
                    globals.alert.type = 'danger';
                    globals.alert.message = 'Operation failed! ' + err.data.err;
                });
    };

    ctrl.disableLimit = function (role) {
        return role === "" || role === "employee";
    };

    ctrl.removeLimit = function () {
        ctrl.newLimit = "";
    };
    ctrl.getAccounts();
}]);