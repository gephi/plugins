'use strict';

/* Services */

angular.module('gephiPluginsFront.services', [])
  
  .factory('PluginsData', function($timeout, $http) {

    var ns = {} // namespace
      , json    // json cache

    ns.fetch = function( callback ) {

      if ( json === undefined ) {

        // $http.get('plugins.json')
        $http.get('http://gephi.org/gephi-plugins/plugins/plugins.json')
          .then(function(response) {

            // this callback will be called asynchronously
            // when the response is available

            json = response.data
            consolidateJson(json)
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


    function consolidateJson(json) {

      var index = {
            type: {}
          , version: {}
          , id: {}
          }
        , v // version iterator

      json.plugins.forEach(function(p, i){
        
        // Ensure there is an id

        if ( !p.id || p.id == '' ) {

          // Generate an id
          if ( p.name ) {
            p.id = p.name.toLowerCase().replace(/[^a-z0-9\-\.]*/gi, '')
            console.log('Plugin "' + p.name + '": no ID, we created one from name: "' + p.id + '"' )
          } else {
            p.id = i
            console.log('Plugin "' + p.name + '": no ID and no name, we generated an ID: "' + p.id + '"' )
          }
          
        } else {

          var validId = p.id.toLowerCase().replace(/[^a-z0-9\-\.]*/gi, '') || i
          if ( validId != p.id ) {
            console.log('Plugin "' + p.name + '": ID "' + p.id + '" is not valid, we modified it to a valid version: "' + validId + '"' )
            p.id = validId
          }

        }

        // Check that the id does not already exist
        if ( index.id[p.id] === undefined ) {

          index.id[p.id] = p

        } else {
          
          while ( index.id[p.id] !== undefined ) {
            p.id = p.id + '-alt'
          }

          console.log('Plugin "' + p.name + '": ID already existing, we modified it to a valid version: "' + p.id + '"' )
          index.id[p.id] = p

        }

        // Compatibility alternatives
        // catchphrase <- short_description
        // description <- long_description
        // category -> types
        if ( p.catchphrase === undefined && p.short_description ) {
          p.catchphrase = p.short_description
        }

        if ( p.description === undefined && p.long_description ) {
          p.description = p.long_description
          console.log( 'Plugin description for test:\n', p.description )
        }

        if ( p.types === undefined && p.category ) {
          p.types = [p.category]
        }


        // Identify a valid url for the main image

        if ( p.images && p.images[0] ) {

          var url

          if ( p.images[0].constructor == String ) {
            url = p.images[0]
          } else if ( p.images[0].constructor == Object ) {
            url = p.images[0].thumbnail || p.images[0].image

            if ( url.indexOf('imgs/') == 0 ) {
              url = 'http://gephi.github.io/gephi-plugins/plugins/' + url
            }
          }

          if ( validateURL(url) ) {
            p.image = url
          }
          
        }

        if ( !p.image ) {
          console.log('Plugin "' + p.name + '": no valid image')
        }


        // Ensure each version is on the form {url:'', last_update:''}

        if ( p.versions && p.versions.constructor == Object ) {
          for ( v in p.versions ) {
            if ( p.versions[v].constructor == String ) {
              p.versions[v] = {url: p.versions[v]}
            }
          }
        }


        // Types: trim and to lower case

        if ( p.types && p.types.constructor == Array ) {
          p.types = p.types.map( function(d) {

            return d.trim().toLowerCase()

          } )
        }


        // Index types, version

        if ( p.types && p.types.constructor == Array ) {
          p.types.forEach( function(t) {

            index.type[t] = ( index.type[t] || 0 ) + 1

          } )
        }

        if ( p.versions && p.versions.constructor == Object ) {
          for ( var v in p.versions ) {

            index.version[v] = ( index.version[v] || 0 ) + 1

          }
        }

        json._index = index


        // Fix if there is one image instead of many

        if ( p.image && p.images === undefined ) {
          p.images = [p.image]
        }


        // Fix if there is one type instead of many

        if ( p.type && p.types === undefined ) {
          p.types = p.type // Unique to array fixed below
        }


        // Fix if "types" is a String instead of an Array

        if ( p.types && p.types.constructor == String ) {
          p.types = [p.types]
        }
        

        // Build a flat "version" array

        p._versions = []
        for ( v in p.versions ) {
          p._versions.push({version:v, url:p.versions[v].url, last_update:p.versions[v].last_update})
        }

      })


    }

    function validateURL(url) {

      // From https://gist.github.com/dperini/729294
      var re_weburl = new RegExp(
          "^" +
            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
              // IP address exclusion
              // private & local networks
              "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
              "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
              "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
              // IP address dotted notation octets
              // excludes loopback network 0.0.0.0
              // excludes reserved space >= 224.0.0.0
              // excludes network & broacast addresses
              // (first & last IP address of each class)
              "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
              "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
              "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
              // host name
              "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
              // domain name
              "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
              // TLD identifier
              "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
              // TLD may end with dot
              "\\.?" +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" +
          "$", "i"
        );
      
      return re_weburl.test(url)
    }

  })
