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

    var updateUsers = function (id, data) {
      console.log("appel updateUsers");
      var index2 = -1;
      var comArr2 = eval( $scope.users );
      var goodOne;
      for( var i = 0; i < comArr2.length; i++ ) {
        if (comArr2[i].id == id) {
          index2 = i;
          goodOne = comArr2[i];
          break;
        }
      }
      if( index2 == -1 ) {
        alert( "Something gone wrong" );
      } else {
        $scope.users.splice(index2, 1, data);
      }
    };
// TODO PENSER A CLEAR LES VALEURS SINON DUPLICATE ERROR
    $scope.saveEditUserChanged = function (data2) {
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.activeEdit, data2).success(function (data) {
        if (data.status == "success") {
          $scope.editStatus = true;
          updateUsers($scope.activeEdit, data2);
        }
      });
    };


    $scope.closeParamsEdit = function () {
      $scope.editStatus = false;
      $scope.activeEdit = "";
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
                $scope.roles = data.data

                // Maintenant on bind chaque role avec son projet correspondant (on aurait pu utiliser la recherche en
                // passant l'id du projet en paramètre dans http mais je n'aurais pas "controlé" mes données. Je ne sais
                // pas si c'est plus performant que ça. (surtout que entre temps les données ont pu être modifiées).
                for (var i = 0; i < $scope.roles.length; i++) {
                  for (var j = 0; j < $scope.projectsUser.length; j++) {
                    if ($scope.roles[i].ProjectId == $scope.projectsUser[j].id) {
                      $scope.projectsUser[j].role = $scope.roles[i];
                      break;
                    }
                  }
                }
              }
            });

        }
      });
    }
  }]);
