// Declare app level module which depends on views, and components
angular.module("todoList", [
  "ngRoute",
  "todoList.view1"
]).
config(["$routeProvider", function($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/view1"});
}]);
