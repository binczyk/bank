app.controller("Page3", ["$http", "common", function ($http, common) {

    var ctrl = this;

    ctrl.dateFrom;
    ctrl.dateTo;
    ctrl.maxDate;
    ctrl.minDate;

    ctrl.options = {

        chart: {
            type: 'lineChart',
            height: 450,
            margin: {top: 20, right: 90, bottom: 75, left: 50},
            showValues: false,
            x: function (d) {
                return new Date(d.date);
            },
            y: function (d) {
                return d.after;
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Time',
                rotateLabels: 30,
                tickFormat: function (d) {
                    return common.dateFormat(d);
                },
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Balance',
                axisLabelDistance: -10,
                showMaxMin: false
            },
            xScale: d3.time.scale(),
            interpolate: 'step-before',
            clipEdge: false
        }

    };

    ctrl.data = [
        {
            key: 'Account balance',
            values: []
        }
    ];

    $http.get('/history/').then(function (rep) {
        ctrl.data[0].values = rep.data;
        $http.get('/account').then(function (rep) {
            ctrl.data[0].values.unshift({date: new Date().toString(), after: rep.data.balance});
        });
        /* ctrl.minDate = ctrl.data[0].values[0].date.toISOString().split('T')[0];
         var lastValue = ctrl.data[0].values.length - 1;
         ctrl.maxDate = ctrl.data[0].values[lastValue].date.toISOString().split('T')[0];*/
    });

    ctrl.filter = function () {
        ctrl.data[0].values = null;
        $http.get('/history/between/' + ctrl.dateFrom.toISOString().split('T')[0]
                      + '/' + ctrl.dateTo.toISOString().split('T')[0]).then(function (rep) {
            ctrl.data[0].values = rep.data;
            $http.get('/account').then(function (rep) {
                ctrl.data[0].values.unshift({date: ctrl.dateTo.toString(), after: rep.data.balance});
            });
        });
    };

    ctrl.clear = function () {

        ctrl.dateFrom = null;
        ctrl.dateTo = null;

        $http.get('/history/').then(function (rep) {
            ctrl.data[0].values = rep.data;
            $http.get('/account').then(function (rep) {
                ctrl.data[0].values.unshift({date: new Date().toString(), after: rep.data.balance});
            });
        });
    };

}]);