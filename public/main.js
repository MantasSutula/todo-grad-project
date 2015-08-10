var countLabel = document.getElementById("count-label");
var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title: title,
        isComplete: false
    }));
    createRequest.onload = function() {
        if (this.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getTodoList(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("GET", "/api/todo");
    createRequest.onload = function() {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else {
            error.textContent = "Failed to get list. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    var countNumber = 0;
    getTodoList(function(todos) {
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            var countField = document.createTextNode("Hello World");
            var listItem = document.createElement("li");
            var deleteButton = document.createElement("button");
            var doneButton = document.createElement("button");
            deleteButton.onclick = deleteTodoItem;
            deleteButton.className = "delete";
            deleteButton.setAttribute("id", todo.id);
            doneButton.onclick = doneTodoItem;
            doneButton.className = "complete";
            doneButton.setAttribute("id", todo.id);
            listItem.textContent = todo.title;
            if (todo.isComplete) {
                listItem.className = "completedTask";
            }
            else {
                listItem.appendChild(doneButton);
                countNumber++;
            }
            listItem.appendChild(deleteButton);
            todoList.appendChild(listItem);
            countLabel.textContent = "Remaining tasks: " + countNumber;
        });
    });
}

function deleteTodoItem() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", "/api/todo/" + this.id);
    createRequest.send();
    reloadTodoList();
}

function doneTodoItem(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("PUT", "/api/todo/" + this.id);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        isComplete: true
    }));
    createRequest.onload = function() {
        if (this.status === 200 || this.status === 201) {

        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
    reloadTodoList();
}

reloadTodoList();
