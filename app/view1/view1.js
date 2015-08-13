'use strict';

angular.module('todoList.view1', [
  'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function(TodoModel) {
    var main = this;

      main.loading = false;

      main.newTodo = {
        title: '',
        isComplete: false
      };

      main.resetForm = function() {
        main.loading = false;
        main.newTodo = {
          title: '',
          isComplete: false
        }
      };

      main.getTodos = function() {
        main.todos = {
          1: {
            title: 'Scare Mantas',
            isComplete: true
          },
          2: {
            title: 'Paint the bucket',
            isComplete:false
          },
          3: {
            title: 'Another Todo',
            isComplete:false
          }
        }
      };

      main.createTodo = function (todo, isValid) {
        if (isValid) {
          main.loading = true;

          main.todos[4] = todo;

          main.resetForm();
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

      main.getTodos();
}]);