app.controller("Page2", ["$http", "common", "$scope", function ($http, common, $scope) {

    var ctrl = this;

    ctrl.common = common;

    ctrl.nSkip = 0;
    ctrl.nLimit = 5;
    ctrl.nAll = 0;

    ctrl.getHistory = function () {
        $http.get('/history/' + ctrl.nSkip + "/" + ctrl.nLimit).then(
            function (rep) {
                ctrl.history = rep.data;
            },
            function (err) {
                ctrl.history = [];
            }
        );
    };

    ctrl.incLimit = function () {
        ctrl.nLimit++;
        ctrl.getHistory();
    };

    ctrl.incSkip = function () {
        ctrl.nSkip++;
        ctrl.getHistory();
    };

    $http.get("/history").then(
        function (rep) {
            ctrl.nAll = rep.data.length;
        },
        function (err) {
            ctrl.nAll = 0;
        }
    );

    ctrl.getHistory();

    $scope.$on("update", function () {
        ctrl.getHistory();
        ctrl.nAll++;
    });
}
]);