'use strict';

angular.module('gephiPluginsFront.browse', ['ngRoute', 'angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/browse', {
    templateUrl: 'views/browse.html'
  , controller: 'BrowseController'
  })
}])

.controller('BrowseController', function($scope, PluginsData) {

  $scope.loading = true
  $scope.data // List of plugins

  $scope.typeList
  $scope.versionList
  
  PluginsData.fetch(function(json){
    $scope.loading = false
    $scope.data = json
    $scope.typeList = Object.keys( json._index.type )
    $scope.versionList = Object.keys( json._index.version )
  })

});