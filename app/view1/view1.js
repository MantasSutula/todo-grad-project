'use strict';

angular.module('todoList.view1', [
  'ui.router'
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', function(TodoModel, $http) {
    var main = this;

    main.loading = false;
    TodoModel.getTodos()
        .then (function(todos) {
          main.todos = todos;
        })
        .catch (function(error) {
          main.error = error;
        })
        .finally (function() {
          main.message = 'Done!';
        });

    main.newTodo = {
      title: '',
      isComplete: false
    };

      function getUrl() {
        return '/api/todo';
      }

    main.resetForm = function() {
      main.loading = false;
      main.newTodo = {
        title: '',
        isComplete: false
      }
    };

    main.createTodo = function (todo, isValid) {
      if (isValid) {
        main.loading = true;

        return $http.post(getUrl(), todo).then(extract);
      };
    };

    main.updateTodo = function (todoId, todo, isValid) {
      if (isValid) {
        main.loading = true;
        // UPDATE TODO
        main.cancelEditing();
      }
    };


    main.deleteTodo = function (todoId) {
      main.loading = true;
      // DELETE TODO
      main.cancelEditing();
    };

    main.setEditedTodo = function (todoId, todo) {
      main.editedTodoId = todoId;
      main.editedTodo = angular.copy(todo);
      main.isEditing = true;
    };

    main.isCurrentTodo = function (todoId) {
      return main.editedTodo !== null && main.editedTodoId === todoId;
    };

    main.cancelEditing = function () {
      main.loading = false;
      main.editedTodoId = null;
      main.editedTodo = null;
      main.isEditing = false;
    }

      function extract(result) {
        return result.data;
      }
  })
  .factory('TodoModel', function($http, $q) {
    var todos = [
      {
        title: 'Scare Mantas',
        isComplete: true
      },
      {
        title: 'Paint the bucket',
        isComplete: false
      },
      {
        title: 'Another Todo',
        isComplete: false
      }
    ];

    function extract(result) {
      return result.data;
    }

    function getTodos() {
      //var deferred = $q.defer();
      //
      //deferred.resolve(todos);
      ////deferred.reject('No todos');
      //
      //return deferred.promise;
      return $http.get('/api/todo').then(extract);
    }

    return {
      getTodos: getTodos
    }
  })
;