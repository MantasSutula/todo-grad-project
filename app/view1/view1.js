angular.module("todoList.view1", [
  "ui.router"
])
.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/view1", {
        templateUrl: "view1/view1.html",
        controller: "View1Ctrl"
    });
}])
.controller("View1Ctrl", function(TodoModel, $http) {
    var self = this;

    self.loading = false;
    TodoModel.getTodos()
          .then (function(todos) {
              self.todos = todos;
              self.displayTodos = todos;
          })
          .catch (function(error) {
              self.error = "Failed to get list. Server returned " + error.status + " - " + error.statusText;
          })
          .finally (function() {
              self.message = "Done!";
          });

    self.newTodo = {
        title: "",
        isComplete: "false"
    };

    function getUrl() {
        return "/api/todo/";
    }

    function getUrlForId(todoId) {
        return "/api/todo/" + todoId;
    }

    self.resetForm = function() {
        self.loading = false;
        self.newTodo = {
            title: "",
            isComplete: "false",
            id: ""
        };
    };

    self.createTodo = function (todo, isValid) {
        if (isValid) {
            self.loading = true;
            todo.isComplete = false;
            //todo.id = +self.todos[self.todos.length-1].id + +1;
            self.todos.push(todo);
            $http.post(getUrl(), todo)
                .then(function(response) {
                    extract(response);
                    self.resetForm();
                })
                .catch (function(error) {
                    self.error = "Failed to create item. Server returned " + error.status + " - " + error.statusText;
                });
        }
    };

    self.updateTodo = function (todo, isValid) {
        if (isValid) {
            console.log("Updating TODO " + todo + " title: " + todo.title + " isComplete " + todo.isComplete);
            self.loading = true;

            self.cancelEditing();

            self.todos.forEach(function(item) {
                if (item.id === todo.id) {
                    item.title = todo.title;
                    if (item.isComplete !== todo.isComplete) {
                        item.isComplete = todo.isComplete;
                    }
                }
            });

            return $http.put(getUrlForId(todo.id), todo).then(extract);
        }
    };

    self.updateComplete = function (todo) {
        console.log("Updating " + todo.id + " from completion status: " +
            todo.isComplete + " to completion status " + !todo.isComplete);
        todo.isComplete = !todo.isComplete;
        return $http.put(getUrlForId(todo.id), todo).then(extract);
    };

    self.deleteTodo = function (todoId) {
        console.log("Deleting todo " + todoId);
        self.loading = true;

        self.cancelEditing();

        self.todos = self.todos.filter(function(item) {
            if (item.id !== todoId) {
                return item;
            }
        });
        self.displayTodos = self.displayTodos.filter(function(item) {
            if (item.id !== todoId) {
                return item;
            }
        });
        return $http.delete(getUrlForId(todoId)).then(extract);
    };

    self.deleteAllActiveTodos = function () {
        console.log("Delete completed todos ");

        self.todos.forEach(function (item) {
            if (item.isComplete) {
                self.deleteTodo(item.id);
            }
        });
    };

    self.setEditedTodo = function (todoId, todo) {
        console.log("Editing " + todoId);
        self.editedTodoId = todoId;
        self.editedTodo = angular.copy(todo);
        self.isEditing = true;
    };

    self.isCurrentTodo = function (todoId) {
        return self.editedTodo !== null && self.editedTodoId === todoId;
    };

    self.cancelEditing = function () {
        self.loading = false;
        self.editedTodoId = null;
        self.editedTodo = null;
        self.isEditing = false;
    };

    function extract(result) {
        console.log(result.data);
        if (result.status === 201) {
            self.todos[self.todos.length - 1].id = result.data;
        }
        return result.data;
    }

    self.allNumber = function () {
        return self.todos.length;
    };

    self.activeNumber = function () {
        var activeNo = 0;
        self.todos.forEach(function (item) {
            if (!item.isComplete) {
                activeNo++;
            }
        });
        return activeNo;
    };

    self.completedNumber = function () {
        var completedNo = 0;
        self.todos.forEach(function (item) {
            if (item.isComplete) {
                completedNo++;
            }
        });
        return completedNo;
    };

    self.showAll = function() {
        self.displayTodos = self.todos;
    };

    self.showActive = function() {
        self.displayTodos = self.todos.filter(function (item) {
            if (!item.isComplete) {
                return item;
            }
        });
    };

    self.showCompleted = function() {
        self.displayTodos = self.todos.filter(function (item) {
            if (item.isComplete) {
                return item;
            }
        });
    };
})
.factory("TodoModel", function($http, $q) {
    function extract(result) {
        return result.data;
    }

    function getTodos() {
        return $http.get("/api/todo").then(extract);
    }

    return {
        getTodos: getTodos
    };
});
