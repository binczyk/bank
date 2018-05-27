app.controller("Page1", ["$http", "globals",
    function ($http, globals) {
        var ctrl = this;
        ctrl.balance = 0;
        ctrl.limit = 0;
        ctrl.recipient = '';
        ctrl.amount = 0;
        ctrl.title = '';

        $http.get("/account").then(function (rep) {
            ctrl.balance = rep.data.balance;
            ctrl.limit = rep.data.limit;
        });

        ctrl.transfer = function () {
            $http.post('/account', {
                recipient: ctrl.recipient,
                amount: ctrl.amount,
                title: ctrl.title
            }).then(function (rep) {
                    ctrl.balance = rep.data.balance;
                    ctrl.recipient = '';
                    ctrl.amount = 0;
                    ctrl.title = '';
                    globals.alert.type = 'success';
                    globals.alert.message = 'Transfered successfully';
                },
                function (err) {
                    globals.alert.type = 'danger';
                    globals.alert.message = 'Transfer failed: ' + err.data.err;
                }
            );
        }
    }
]);