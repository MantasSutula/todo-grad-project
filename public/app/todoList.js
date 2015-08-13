"use strict";

angular.module("todoList", [
    "ui.router",
    'ngAnimate',
    'firebase'
])
    .constant("ENDPOINT_URI", "http://localhost:8080")
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/todos");

        $stateProvider
            .("todos", {
            url:"/todos",
            templateUrl: "app/todos/todos.tmpl.html",
            controller: "todosCtrl",
            controllerAs: "todos"
        })
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            event.preventDefault();
            if (error === 'AUTH_REQUIRED') {
                $state.go('todos');
            }
        });
    })
;