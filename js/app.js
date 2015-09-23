'use strict';

// Declare app level module which depends on views, and components
angular.module('gephiPluginsFront', [
  'ngRoute'
, 'angucomplete-alt'
, 'gephiPluginsFront.services'
, 'gephiPluginsFront.directives'
, 'gephiPluginsFront.home'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);