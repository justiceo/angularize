import Ajax from './ajax-service';
import ToolbarService from './toolbar-service';
import Toolbar from './toolbar-component';
import MockService from './mock-service';
import RestApi from './rest-api-service';

let angularizeCore = angular.module('angularizeCore', [])

angularizeCore
  .component('toolbar', Toolbar)
  .service('Ajax', Ajax)
  .service('ToolbarService', ToolbarService)
  .service('RestApi', RestApi)
  .service('MockService', MockService)
  .factory('httpRequestInterceptor', function ($q, MockService) {
    return {
      request: function (config) {
        if(window.angularize_server)        
          config.headers['X-WP-Nonce'] = window.angularize_server.nonce;
        return config;
      },
      responseError: function(rejection) {
        // if it's 404 due to running on webpack instead of as WordPress plugin, mock the response.
        if(rejection.status == 404 && MockService.isDev){
          return MockService.resolve(rejection)        
        }

        return $q.reject(rejection)
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('$q', 'MockService', 'httpRequestInterceptor');
  });

  export default angularizeCore.name;