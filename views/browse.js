'use strict';

angular.module('gephiPluginsFront.browse', ['ngRoute', 'angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/browse', {
    templateUrl: 'views/browse.html'
  , controller: 'BrowseController'
  })
  $routeProvider.when('/browse/:filterKey/:filterValue', {
    templateUrl: 'views/browse.html'
  , controller: 'BrowseController'
  })
}])

.controller('BrowseController', function($scope, PluginsData, $routeParams, $location) {

  $scope.loading = true
  $scope.data // List of plugins

  $scope.typeList
  $scope.versionList

  $scope.query

  $scope.filterActive = $routeParams.filterKey && $routeParams.filterValue
  $scope.filterString = $routeParams.filterKey + ': ' + $routeParams.filterValue
  
  PluginsData.fetch(function(json){
    $scope.loading = false
    $scope.data = json
    $scope.typeList = Object.keys( json._index.type )
    $scope.versionList = Object.keys( json._index.version )

    $scope.plugins = filterPlugins(json.plugins)

  })

  $scope.search = function() {
    $location.path('/browse/search/' + $scope.query)
  }

  // Filtering process
  function filterPlugins(plugins){
    if ( $scope.filterActive ) {
      if ( $routeParams.filterKey == 'type' ) {
        return plugins.filter(function(p){
            return (p.types || []).some(function(t){ return t == $routeParams.filterValue })
          })
      } else if ( $routeParams.filterKey == 'version' ) {
        return plugins.filter(function(p){
            return (p._versions || []).some(function(v){ return v.version == $routeParams.filterValue })
          })
      } else if ( $routeParams.filterKey == 'search' ) {
        return plugins.filter(function(p){
            return (p.name || '').toLowerCase().indexOf($routeParams.filterValue.toLowerCase()) >= 0
                || (p.description || '').toLowerCase().indexOf($routeParams.filterValue.toLowerCase()) >= 0
          })
      }
    } else {
      return plugins
    }
  }

});