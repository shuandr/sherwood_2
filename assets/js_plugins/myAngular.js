var app = angular.module('shrwd', ['ngRoute', 'ngLocale', 'ngSanitize', 'ngAnimate', 'slickCarousel']);



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

app.controller('shrwdCtrl', function($scope, $http, $timeout) {

    $scope.langs = ["UA", "EN"];
    $scope.selectedLang = "UA";
    $scope.lngData = {};
    $scope.data = {};
    $scope.dataLoaded = true;

    $scope.changeLang = function(lang) {
        if (lang == "UA") {
            $scope.lngData = $scope.dataUA;
            $scope.selectedLang = "UA";
            $scope.book = $scope.dataUA.booking;

            $scope.dataLoaded = false;
            $timeout(function() {
                $scope.dataLoaded = true;
            }, 20);

        } else {
            $scope.lngData = $scope.dataEN;
            $scope.selectedLang = "EN";
            $scope.book = $scope.dataEN.booking;

            $scope.dataLoaded = false;
            $timeout(function() {
                $scope.dataLoaded = true;
            }, 20);
            // console.log(lang);
        }
    };

    $http.get("assets/data/common.json").then(function(response) {
        $scope.data = response.data;

    });
    $http.get("assets/data/UA.json").then(function(response) {
        $scope.dataUA = response.data;
        if ($scope.selectedLang == "UA") {
            $scope.lngData = $scope.dataUA;
        }
    });

    $http.get("assets/data/EN.json").then(function(response) {
        $scope.dataEN = response.data;
        if ($scope.selectedLang == "EN") {
            $scope.lngData = $scope.dataEN;

        }
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

    // FORM-SUBMISSION-HANDLER

    // get all data in form and return object
    function getFormData() {
        var elements = document.getElementById("gform").elements; // all form elements
        var fields = Object.keys(elements).map(function(k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
                // special case for Edge's html collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function(item, pos, self) {
            return self.indexOf(item) == pos && item;
        });
        var data = {};
        fields.forEach(function(k) {
            data[k] = elements[k].value;
            if (elements[k].type === "checkbox") {
                data[k] = elements[k].checked;
                // special case for Edge's html collection
            } else if (elements[k].length) {
                for (var i = 0; i < elements[k].length; i++) {
                    if (elements[k].item(i).checked) {
                        data[k] = elements[k].item(i).value;
                    }
                }
            }
        });
        console.log(data);
        return data;
    }

    $scope.formSubmit = function() { // handles form submit withtout any jquery
        // event.preventDefault(); // we are submitting via xhr below
        var data = getFormData(); // get the values submitted in the form

        // var url = event.target.action; //
        var url = "https://script.google.com/macros/s/AKfycbxCReput38Lmh2tpLKCaM2c-YZUbjwkHDJypof6hO-lsuLRS14/exec"; //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            console.log(xhr.status, xhr.statusText)
            console.log(xhr.responseText);
            // document.getElementById('gform').style.display = 'none'; // hide form
            document.getElementById('thankyou_message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
        // }
    }
    // END of FORM-SUBMISSION-HANDLER
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