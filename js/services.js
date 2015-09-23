'use strict';

/* Services */

angular.module('gephiPluginsFront.services', [])
  
  .factory('PluginsData', function($timeout, $http) {

    var ns = {} // namespace
      , json    // json cache

    ns.fetch = function( callback ) {

      if ( json === undefined ) {

        $http.get('plugins.json')
          .then(function(response) {

            // this callback will be called asynchronously
            // when the response is available

            json = response.data
            callback(json)

          }, function(response) {
            
            // called asynchronously if an error occurs
            // or server returns response with an error status.

          })

      } else {

        $timeout(callback, 0, true, json)

      }

    }

    return ns
  })