'use strict';

angular.module('gephiPluginsFront.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/home.html'
  , controller: 'HomeController'
  })
}])

.controller('HomeController', function($scope, PluginsData, $location) {

  var inhibateSearch = false

  $scope.loading = true
  $scope.data // List of plugins
  $scope.osInfo = 'for ' + (Detectizr.os.name || '').toUpperCase()

  $scope.typeList
  $scope.versionList

  $scope.query
  
  PluginsData.fetch(function(json){
    $scope.loading = false
    $scope.data = json
    $scope.typeList = Object.keys( json._index.type )
    $scope.versionList = Object.keys( json._index.version )
  })

  $scope.pluginSelected = function(selectedItem) {
    inhibateSearch = true
    $location.path('/plugin/' + selectedItem.originalObject.id)
  }

  $scope.queryChanged = function(query) {
    $scope.query = query
  }

  $scope.search = function() {
    if ( !inhibateSearch ) {
      $location.path('/browse/search/' + $scope.query)
    }
  }

});