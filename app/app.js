'use strict';

// Declare app level module which depends on views, and components
angular.module('todoList', [
  'ngRoute',
  'todoList.view1',
  'todoList.view2',
  'todoList.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
