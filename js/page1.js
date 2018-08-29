app.controller("Page1", ["$http", "globals", "$scope",
                         function ($http, globals, $scope) {
                             var ctrl = this;
                             ctrl.balance = 0;
                             ctrl.limit = 0;
                             ctrl.recipient = '';
                             ctrl.amount = 0;
                             ctrl.title = '';
                             ctrl.recentRecipients = [];

                             $http.get("/account").then(function (rep) {
                                 ctrl.balance = rep.data.balance;
                                 ctrl.limit = rep.data.limit;
                             });

                             $http.get("/recent").then(function (rep) {
                                 for (var itr in rep.data) {
                                     ctrl.recentRecipients[itr] = rep.data[itr]._id;
                                 }
                             });

                             ctrl.transfer = function () {
                                 $http.post('/account', {
                                     recipient: ctrl.recipient,
                                     amount: ctrl.amount,
                                     title: ctrl.title
                                 }).then(function (rep) {
                                             globals.alert.message = ctrl.title + ' transferred successfully';
                                             ctrl.balance = rep.data.balance;
                                             ctrl.recipient = '';
                                             ctrl.amount = 0;
                                             ctrl.title = '';
                                             globals.alert.type = 'success';
                                         },
                                         function (err) {
                                             globals.alert.type = 'danger';
                                             globals.alert.message = ctrl.title + ' transfer failed: ' + err.data.err;
                                         }
                                 );
                             };

                             $scope.$on("update", function () {
                                 $http.get("/account").then(function (rep) {
                                     ctrl.balance = rep.data.balance;
                                     ctrl.limit = rep.data.limit;
                                 });

                                 $http.get("/recent").then(function (rep) {
                                     for (var itr in rep.data) {
                                         ctrl.recentRecipients[itr] = rep.data[itr]._id;
                                     }
                                 });
                             });
                         }
]);
