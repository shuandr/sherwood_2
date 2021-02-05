var app = angular.module('shrwd', ['ngRoute', 'ngLocale', 'ngSanitize', 'slickCarousel']);



app.config(['$compileProvider', "$routeProvider", "$interpolateProvider",

    function($compileProvider, $routeProvider, $interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|viber|tel|mailto|chrome-extension):/);
        $routeProvider
            .when('/', {
                templateUrl: 'main.html'
            })
            .when('/hotel', {
                templateUrl: 'hotel.html'
            })
            .when('/hall', {
                templateUrl: 'hall.html'
            })
            .when('/menu', {
                templateUrl: 'menu.html'
            })
            .when('/alco-menu', {
                templateUrl: 'alco-menu.html'
            })
            .when('/breakfast', {
                templateUrl: 'breakfast.html'
            })
            .when('/booking', {
                templateUrl: 'booking.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

app.controller('shrwdCtrl', function($scope, $http) {



    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;
        $scope.book = $scope.data.booking;
    });

    $http.get("assets/data/menu.json").then(function(response) {
        $scope.sherMenu = response.data;

    });

    $http.get("assets/data/alco_menu.json").then(function(response) {
        $scope.sherAlcoMenu = response.data;

    });

    $http.get("assets/data/brkfst_2.json").then(function(response) {
        $scope.brkfst = response.data;

    });

    $http.get("assets/data/brkfst_add_2.json").then(function(response) {
        $scope.brkfstAdd = response.data;

    });


    $scope.smallSlickConfig = {
        arrows: false,
        autoplay: true,
        pauseOnHover: false,
        autoplaySpeed: 2400,
        speed: 1200
    };

    $scope.mainSlickConfig = {
        arrows: false,
        autoplay: true,
        pauseOnHover: false,
        autoplaySpeed: 2000,
        speed: 1200,
        fade: true,
    };


});

app.directive('angularMask', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            isModelValueEqualViewValues: '='
        },
        link: function($scope, el, attrs, model) {
            $scope.$watch(function() { return attrs.angularMask; }, function(value) {
                if (model.$viewValue != null) {
                    model.$viewValue = mask(String(model.$viewValue).replace(/\D/g, ''));
                    el.val(model.$viewValue);
                }
            });

            model.$formatters.push(function(value) {
                return value === null ? '' : mask(String(value).replace(/\D/g, ''));
            });

            model.$parsers.push(function(value) {
                model.$viewValue = mask(value);
                var modelValue = $scope.isModelValueEqualViewValues ? model.$viewValue : String(value).replace(/\D/g, '');
                el.val(model.$viewValue);
                return modelValue;
            });

            function mask(val) {
                var format = attrs.angularMask,
                    arrFormat = format.split('|');

                if (arrFormat.length > 1) {
                    arrFormat.sort(function(a, b) {
                        return a.length - b.length;
                    });
                }

                if (val === null || val == '') {
                    return '';
                }
                var value = String(val).replace(/\D/g, '');
                if (arrFormat.length > 1) {
                    for (var a in arrFormat) {
                        if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
                            format = arrFormat[a];
                            break;
                        }
                    }
                }
                var newValue = '';
                for (var nmI = 0, mI = 0; mI < format.length;) {
                    if (!value[nmI]) {
                        break;
                    }
                    if (format[mI].match(/\D/)) {
                        newValue += format[mI];
                    } else {
                        newValue += value[nmI];
                        nmI++;
                    }
                    mI++;
                }
                return newValue;
            }
        }
    };
});