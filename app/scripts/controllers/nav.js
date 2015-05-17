'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.items = [
      {path: '/users', title: 'Users'},
      {path: '/projects', title: 'Projects'},
    ];
    $scope.isActive = function(item) {
      if (item.path == $location.path()) {
        return true;
      }
      return false;
    };
  }]);
