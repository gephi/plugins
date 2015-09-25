'use strict';

// Declare app level module which depends on views, and components
angular.module('gephiPluginsFront', [
  'ngRoute'
, 'angucomplete-alt'
, 'gephiPluginsFront.services'
, 'gephiPluginsFront.directives'
, 'gephiPluginsFront.home'
, 'gephiPluginsFront.browse'
, 'gephiPluginsFront.plugin'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);