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
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
      .success(function(data) {
        $scope.allUsers = data.data;
      });
    $scope.selectionAddMember = [];
    $scope.selectionAddMemberRole = [];
    $scope.selectionEditMember = [];
    $scope.selectionEditMemberRole = [];
    $scope.toggleSelectionAddMember = function(user) {
      if ($scope.selectionAddMember == null) {
        $scope.selectionAddMember.push(user);
      } else {
        var index = $scope.selectionAddMember.indexOf(user);
        // is currently selected
        if (index > -1) {
          $scope.selectionAddMember.splice(index, 1);
        }
        // is newly selected
        else {
          $scope.selectionAddMember.push(user);
        }
      }

    };
    $scope.closeParamsAddMember = function() {
      $scope.selectionAddMember = [];
    };
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
    $scope.addProject = function (data3) {
      for (var j = 0; j < $scope.selectionAddMemberRole.length ; ++j) {
        console.log($scope.selectionAddMemberRole[j]);
      }
      console.log("Appel de addProject");
      console.log("Data3.title : " + data3.title);
      console.log("Data3.description : " + data3.description);
      console.log("Data3.year : " + data3.year);
      var toSend = {title : data3.title, description : data3.description, year : data3.year};
      console.log(toSend);
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/',toSend).success(function (data2) {
        if (data2.status == "success") {
          console.log("Success ajout projet");
          console.log("taille team : " + $scope.selectionAddMember.length);
          console.log("ID PROJET : " + data2.data.id);
          for (var i = 0; i < $scope.selectionAddMember.length; ++i) {
            var roleToAdd = {name: $scope.selectionAddMemberRole[i], UserId: $scope.selectionAddMember[i].id, ProjectId: data2.data.id};
            console.log(roleToAdd);
           // console.log("Nom du role à ajouter : " + $scope.selectionAddMemberRole[i] + " " + roleToAdd.userId + " " + roleToAdd.ProjectId);
            $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/', roleToAdd).success(function (data) {
              $scope.status = data.status;
            });
          }
          $scope.projects.splice(0, 0, data2.data);
        }
      });
    };
    $scope.editProjectView = function (data) {
      $scope.activeProjectEdit = data;
      loadMembers(data);

    };
    var loadMembers = function (id) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + id + '/Users')
        .success(function (data) {
          if (data.status == "success") {
            $scope.editTeam = data.data;

            // Récupération des rôles
            $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + id + '/Roles')
              .success(function(data) {
                if (data.status == "success") {
                  var roles = data.data
                  // Maintenant on bind chaque role avec son projet correspondant (on aurait pu utiliser la recherche en
                  // passant l'id du projet en paramètre dans http mais je n'aurais pas "controlé" mes données. Je ne sais
                  // pas si c'est plus performant que ça. (surtout que entre temps les données ont pu être modifiées).
                  for (var i = 0; i < $scope.editTeam.length; i++) {
                    for (var j = 0; j < roles.length; j++) {
                      if (roles[j].UserId == $scope.editTeam[i].id) {
                        $scope.selectionEditMemberRole[i] = roles[j];
                        break;
                      }
                    }
                  }
                }
              });
          }
        });
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

                  // Récupération des rôles
                  $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId + '/Roles')
                    .success(function(data) {
                      if (data.status == "success") {
                        var roles = data.data
                        // Maintenant on bind chaque role avec son projet correspondant (on aurait pu utiliser la recherche en
                        // passant l'id du projet en paramètre dans http mais je n'aurais pas "controlé" mes données. Je ne sais
                        // pas si c'est plus performant que ça. (surtout que entre temps les données ont pu être modifiées).
                        for (var i = 0; i < $scope.team.length; i++) {
                          for (var j = 0; j < roles.length; j++) {
                            if (roles[j].UserId == $scope.team[i].id) {
                              $scope.team[i].role = roles[j];

                            }
                          }
                        }
                      }
                    });
                }
              });
          }
        });
    }
  }]);
