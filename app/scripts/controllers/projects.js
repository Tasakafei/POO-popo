'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('ProjectsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
      .success(function (data) {
        $scope.projects = data.data;
      });

    $scope.deleteProject = function (idProject) {
      var index = -1;
      var comArr = eval($scope.projects);
      for (var i = 0; i < comArr.length; i++) {
        if (comArr[i].id == idProject) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        alert("Something gone wrong");
      } else {
        $scope.projects.splice(index, 1);
        $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + idProject).success(function (data) {
          $scope.state = data.status;
        });
      }
    };

    /*$scope.addUser = function (data) {
     var toSend;
     toSend.name = data.name;
     toSend.surname = data.surname;
     toSend.email = data.email;
     toSend.website = data.website;
     $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Users/',toSend).success(function (data) {
     $scope.status = data.status;
     });
     };*/

    $scope.editProjectView = function (data) {
      $scope.activeProjectEdit = data;
    };

    var updateProjects = function (id, data) {
      console.log("appel updateProjects");
      var index2 = -1;
      var comArr2 = eval($scope.projects);
      for (var i = 0; i < comArr2.length; i++) {
        if (comArr2[i].id == id) {
          index2 = i;
          break;
        }
      }
      if (index2 == -1) {
        alert("Something gone wrong");
      } else {
        $scope.projects.splice(index2, 1, data);
      }
    };
// TODO PENSER A CLEAR LES VALEURS SINON DUPLICATE ERROR
    $scope.saveEditProjectChanged = function (data2) {
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.activeProjectEdit, data2).success(function (data) {
        if (data.status == "success") {
          $scope.editStatus = true;
          updateProjects($scope.activeProjectEdit, data2);
        }
      });
    };


    $scope.closeParamsEdit = function () {
      $scope.editStatus = false;
      $scope.activeProjectEdit = "";
    };

    if ($routeParams.projectId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId)
        .success(function (data) {
          if (data.status == "success") {
            $scope.currentProject = data.data;
            $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId + '/Users')
              .success(function (data) {
                if (data.status == "success") {
                  $scope.team = data.data;
                }
              });
          }
        });
    }
  }]);
