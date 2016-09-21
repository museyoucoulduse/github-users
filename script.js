// Code goes here
(function () {
  'use strict';

  var MainCtrl = function ($scope, $http) {

    $scope.message = "Hallo, Big Boss!";

    var onError = function (err) {
      $scope.error = err.message;
      console.log(err.message);
    }

    var onReposResponse = function (res) {
      $scope.repos = res.data;
      console.log($scope.repos);
    }

    var onUserResponse = function (res) {
      $scope.data = res.data;
      console.log($scope.data);
      $http.get($scope.data.repos_url.toString()).then(onReposResponse, onError);
    }

    // It's me!
    $http.get('https://api.github.com/users/museyoucoulduse')
      .then(onUserResponse, onError)

    // Who else can do the job better?
    $scope.search = function (login) {
      $http.get('https://api.github.com/users/' + login).then(onUserResponse, onError);
    };
  };

  MainCtrl.$inject = ['$scope', '$http'];
  angular.module('lol', []).controller('MainCtrl', MainCtrl);

})();