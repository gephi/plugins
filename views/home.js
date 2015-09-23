'use strict';

angular.module('gephiPluginsFront.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home.html'
  , controller: 'HomeController'
  })
}])

.controller('HomeController', function($scope, PluginsData) {

  $scope.loading = true
  $scope.data // List of plugins
  
  PluginsData.fetch(function(json){
    $scope.loading = false
    $scope.data = json
  })

});