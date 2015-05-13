'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('UsersCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
      .success(function(data) {
        $scope.users = data.data;
      });

    $scope.deleteUser = function (idUser) {
      var index = -1;
      var comArr = eval( $scope.users );
      for( var i = 0; i < comArr.length; i++ ) {
        if( comArr[i].id == idUser ) {
          index = i;
          break;
        }
      }
      if( index === -1 ) {
        alert( "Something gone wrong" );
      } else {
        $scope.users.splice(index, 1);
        $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + idUser).success(function (data) {
          $scope.state = data.status;
        });
      }
    };

    $scope.addUser = function (data) {
      var toSend;
      toSend.name = data.name;
      toSend.surname = data.surname;
      toSend.email = data.email;
      toSend.website = data.website;
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Users/',toSend).success(function (data) {
        $scope.status = data.status;
      });
    };

    $scope.editUserView = function (data) {
      $scope.activeEdit = data;
    };
    var updateUsers = function(data) {
      console.log("appel updateUsers");
      var index2 = -1;
      var comArr2 = eval( $scope.users );
      var goodOne;
      for( var i = 0; i < comArr2.length; i++ ) {
        if( comArr2[i].id == data ) {
          index2 = i;
          goodOne = comArr2[i];
          break;
        }
      }
      if( index2 == -1 ) {
        alert( "Something gone wrong" );
      } else {
        $scope.users.splice(index2, 1, goodOne);
        console.log(goodOne);
        console.log(index2);
      }
    }

    $scope.saveEditUserChanged = function (data) {
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/'+$scope.activeEdit, data).success(function(data) {
        if (data.status == "success") {
          $scope.editStatus = true;
          updateUsers($scope.activeEdit);
        }
      });
    };


    $scope.closeParamsEdit = function () {
      $scope.editStatus = false;
    };

    if($routeParams.userId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId)
      .success(function(data) {
        if (data.status == "success") {
          $scope.currentUser = data.data;
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId + '/Projects')
            .success(function(data) {
            if (data.status == "success") {
              $scope.projectsUser = data.data;
            }
          });
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId + '/Roles')
            .success(function(data) {
              if (data.status == "success") {
                $scope.projectsUser.role = data.data
              }
            });

        }
      });
    }
  }]);
