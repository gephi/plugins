'use strict';

angular.module('gephiPluginsFront.plugin', ['ngRoute', 'angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plugin/:pluginId', {
    templateUrl: 'views/plugin.html'
  , controller: 'PluginController'
  })
}])

.controller('PluginController', function($scope, $location, $routeParams, PluginsData) {

  $scope.loading = true
  $scope.data // List of plugins
  $scope.osInfo = 'for ' + Detectizr.os.name.toUpperCase() + ' ' + Detectizr.os.version.toUpperCase()

  $scope.plugin

  PluginsData.fetch(function(json){
    $scope.loading = false
    $scope.data = json
    $scope.plugin = $scope.data._index.id[$routeParams['pluginId']]
  })

});