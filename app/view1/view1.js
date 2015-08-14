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
      isComplete: 'false'
    };

      function getUrl() {
        return '/api/todo/';
      }

      function getUrlForId(todoId) {
        return '/api/todo/' + todoId;
      }

    main.resetForm = function() {
      main.loading = false;
      main.newTodo = {
        title: '',
        isComplete: 'false',
        id: ''
      }
    };

    main.createTodo = function (todo, isValid) {
      if (isValid) {
        main.loading = true;
        todo.isComplete = false;
        //todo.id = +main.todos[main.todos.length-1].id + +1;
        main.todos.push(todo);
        $http.post(getUrl(), todo)
            .then(function(response) {
              extract(response);
              main.resetForm();
            });
      };
    };

    main.updateTodo = function (todo, isValid) {
      if (isValid) {
        console.log("Updating TODO " + todo + " title: " + todo.title + " isComplete " + todo.isComplete);
        main.loading = true;

        main.cancelEditing();

        main.todos.forEach(function(item) {
          if (item.id === todo.id) {
            item.title = todo.title;
            if (item.isComplete !== todo.isComplete)
            {
              item.isComplete = todo.isComplete;
            }
          }
        });

        return $http.put(getUrlForId(todo.id), todo).then(extract);
      }
    };

    main.updateComplete = function (todo) {
      console.log("Updating " + todo.id + " from completion status: "+ todo.isComplete + " to completion status " + !todo.isComplete);
      todo.isComplete = !todo.isComplete;
      return $http.put(getUrlForId(todo.id), todo).then(extract);
    }


    main.deleteTodo = function (todoId) {
      console.log("Deleting todo " + todoId);
      main.loading = true;

      main.cancelEditing();

      main.todos = main.todos.filter(function(item) {
        if (item.id !== todoId) {
          return item;
        }
      })
      return $http.delete(getUrlForId(todoId)).then(extract);
    };

    main.deleteAllActiveTodos = function () {
      console.log("Delete completed todos ");

      main.todos.forEach(function (item) {
        if (item.isComplete) {
          main.deleteTodo(item.id);
        }
      });
    };

    main.setEditedTodo = function (todoId, todo) {
      //console.log("Updating TODO " + todo)
      //if (isValid) {
      //  return $http.put(getUrl() + todoId, todo).then(extract);
      console.log("Editing " + todoId);
        main.editedTodoId = todoId;
        main.editedTodo = angular.copy(todo);
        main.isEditing = true;
      //}
    };

    main.isCurrentTodo = function (todoId) {
      return main.editedTodo !== null && main.editedTodoId === todoId;
    };

    main.cancelEditing = function () {
      main.loading = false;
      main.editedTodoId = null;
      main.editedTodo = null;
      main.isEditing = false;
    };

      function extract(result) {
        console.log(result.data);
        if (result.status === 201) {
          main.todos[main.todos.length - 1].id = result.data;
        }
        return result.data;
      };

      main.allNumber = function () {
        //main.todos = TodoModel.getTodos;
        return main.todos.length;
      };

      main.activeNumber = function () {
        var activeNo = 0;
        main.todos.forEach(function (item) {
          if (!item.isComplete) {
            activeNo++;
          }
        });
        return activeNo;
      };

      main.completedNumber = function () {
        var completedNo = 0;
        main.todos.forEach(function (item) {
          if (item.isComplete) {
            completedNo++;
          }
        });
        return completedNo;
      };

      main.showAll = function() {
        //main.todos = TodoModel.getTodos;
      };

      main.showActive = function() {
        main.todos = main.todos.filter(function (item) {
          if (!item.isComplete) {
            return item;
          }
        });
      };
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