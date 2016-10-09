var app = angular.module('vetApp', ['ngResource','ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    .when('/doctors', {
      templateUrl: 'templates/doctorTableTemplate.html',
      controller: 'DoctorCtrl'
    })
    .when('/doctors/full', {
      templateUrl: 'templates/doctorTableTemplateFull.html',
      controller: 'DoctorCtrl'
    })
    .when('/doctor/full/:id', {
      templateUrl: 'templates/doctorTableTemplateFullInfo.html',
      controller: 'DoctorCtrl'
    })
    .when('/doctor/filter/:id', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    .when('/pets', {
      templateUrl: 'templates/petTableTemplate.html',
      controller: 'PetCtrl'
    })
    .when('/pets/full', {
      templateUrl: 'templates/petTableTemplateFull.html',
      controller: 'PetCtrl'
    })
    .when('/pet/full/:id', {
      templateUrl: 'templates/petTableTemplateFullInfo.html',
      controller: 'PetCtrl'
    })
     .when('/pet/filter/:id', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    .when('/owners', {
      templateUrl: 'templates/petsOwnerTableTemplate.html',
      controller: 'PetsOwnerCtrl'
    })
    .when('/owners/full', {
      templateUrl: 'templates/petsOwnerTableTemplateFull.html',
      controller: 'PetsOwnerCtrl'
    })
    .when('/visits', {
      templateUrl: 'templates/petsVisitTableTemplate.html',
      controller: 'PetsVisitCtrl'
    })
    .when('/visits/full', {
      templateUrl: 'templates/petsVisitTableTemplateFull.html',
      controller: 'PetsVisitCtrl'
    })
}]);

app.directive('tablePetDirective', [function () {
  return {
    restrict: 'A',
    templateUrl: 'templates/petTableTemplate.html'
  };
}]);
app.directive('tableDoctorDirective', [function () {
  return {
    restrict: 'A',
    templateUrl: 'templates/doctorTableTemplate.html'
  };
}]);
app.directive('tablePetsOwnerDirective', [function () {
  return {
    restrict: 'A',
    templateUrl: 'templates/petsOwnerTableTemplate.html'
  };
}]);
app.directive('tablePetsVisitDirective', [function () {
  return {
    restrict: 'A',
    templateUrl: 'templates/petsVisitTableTemplate.html'
  };
}]);

app.controller('MainCtrl', ['$scope','$routeParams','bindDataService','$rootScope', function ($scope, $routeParams, bindDataService, $rootScope) {
    if ($rootScope.checkedFilterFlag) {
      $scope.checkboxModel = {
       switchToFilter : $rootScope.checkedFilterFlag
      };
    } else {
      $scope.checkboxModel = {
       switchToFilter : false
      };
    }
   $scope.checkedFilter = function () {
    if ($scope.checkboxModel.switchToFilter) {
      $scope.$emit('switchToFilter', $scope.checkboxModel.switchToFilter);
      $rootScope.checkedFilterFlag =  $scope.checkboxModel.switchToFilter;
    } else {
      $scope.$emit('switchToFilter', $scope.checkboxModel.switchToFilter);
      $rootScope.checkedFilterFlag =  $scope.checkboxModel.switchToFilter;
    }
   }
   if ($routeParams.id) {
    var visitUrl = '/visits';
    bindDataService.getData(visitUrl).$promise.then(function (response) {
      $scope.visits = response;
      var currentObj = bindDataService.getObjData($scope.visits, $routeParams.id);
      $scope.$emit('filterData', currentObj);
    });
   }
   $scope.checkedFilter();
}]);
app.controller('DoctorCtrl', ['$scope','bindDataService','$routeParams','$filter','$rootScope', function ($scope, bindDataService, $routeParams, $filter, $rootScope) {
  var doctorsUrl = '/doctors';
  $rootScope.$on('switchToFilter', function (e, data) {
    $scope.switchFilter = data;
    bindDataService.getData(doctorsUrl).$promise.then(function (response) {
      if ($routeParams.id) {
        $scope.doctors = $filter('filter')(response, $routeParams.id);
      } else {
        $scope.doctors = response;
      }
    });
  });
  bindDataService.getData(doctorsUrl).$promise.then(function (response) {
    if($routeParams.id) {
      $scope.doctors = $filter('filter')(response, $routeParams.id);
    } else {
       $scope.doctors = response;
    }
  });
  $rootScope.$on('filterData', function (e, currentObj) {
    bindDataService.getData(doctorsUrl).$promise.then(function (response) {
      $scope.doctors = $filter('filter')(response, currentObj.doctorId);
    });
  });
}]);
app.controller('PetCtrl', ['$scope','bindDataService','$routeParams','$filter','$rootScope', function ($scope, bindDataService, $routeParams, $filter, $rootScope) {
  var petsUrl = '/pets';
  $rootScope.$on('switchToFilter', function (e, data) {
    $scope.switchFilter = data;
    bindDataService.getData(petsUrl).$promise.then(function (response) {
      if ($routeParams.id) {
        $scope.pets = $filter('filter')(response, $routeParams.id);
      } else {
        $scope.pets = response;
      }
    });
  });
  bindDataService.getData(petsUrl).$promise.then(function (response) {
    if($routeParams.id) {
      $scope.pets = $filter('filter')(response, $routeParams.id);
    } else {
       $scope.pets = response;
    }
  });
  $rootScope.$on('filterData', function (e, currentObj) {
    bindDataService.getData(petsUrl).$promise.then(function (response) {
      $scope.pets = $filter('filter')(response, currentObj.petId);
    });
  });
}]);
app.controller('PetsOwnerCtrl', ['$scope','bindDataService','$rootScope','$filter', function ($scope, bindDataService, $rootScope, $filter) {
  var ownerUrl = '/owners';
  bindDataService.getData(ownerUrl).$promise.then(function (response) {
    $scope.owners = response;
  });
  $rootScope.$on('filterData', function (e, currentObj) {
    bindDataService.getData(ownerUrl).$promise.then(function (response) {
      $scope.owners = $filter('filter')(response, currentObj.ownerId);
    });
  });
}]);
app.controller('PetsVisitCtrl', ['$scope','bindDataService','$rootScope','$filter', function ($scope, bindDataService, $rootScope, $filter) {
  var visitUrl = '/visits';
  $rootScope.$on('filterData', function (e, currentObj) {
    bindDataService.getData(visitUrl).$promise.then(function (response) {
      $scope.visits = $filter('filter')(response, currentObj.visitedAt);
    });
  });
  bindDataService.getData(visitUrl).$promise.then(function (response) {
    $scope.visits = response;
  });
}]);

app.service('bindDataService', ['$resource', function ($resource) {
  this.getData = function (url) {
    return $resource(url).query();
  }
  this.getObjData = function (array, id) {
    var filteredObj = {};

    angular.forEach(array, function(value, key) {
      angular.forEach(value, function(item, key) {
        if (value[key] === id) {
          filteredObj = value;
        }
      });      
    });
    return filteredObj;
  }
}]);