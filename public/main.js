var countLabel = document.getElementById("count-label");
var filterButtons = document.getElementById("filter-buttons");
var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var sortMethod = "none";

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
    var countNumberRemaining = 0;
    var countNumberCompleted = false;
    getTodoList(function(todos) {
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            console.log(todo.title);
            var todoFiltered = todoListDisplayFilter(todo, sortMethod);
            if (todoFiltered !== undefined) {
                var listItem = document.createElement("li");
                var deleteButton = document.createElement("button");
                var doneButton = document.createElement("button");
                var editButton = document.createElement("button");
                deleteButton.onclick = deleteTodoItem;
                deleteButton.className = "btn btn-default glyphicon glyphicon-trash right-button";
                deleteButton.setAttribute("id", todoFiltered.id);
                deleteButton.setAttribute("value", todoFiltered.id);
                doneButton.onclick = doneTodoItem;
                doneButton.className = "btn btn-default glyphicon glyphicon-ok left-button";
                doneButton.setAttribute("value", todoFiltered.id);
                editButton.className = "btn btn-default glyphicon glyphicon-pencil right-button";
                editButton.setAttribute("value", todoFiltered.id);
                listItem.textContent = todoFiltered.title;
                console.log(todoFiltered.title + " " + todoFiltered.id + " " + todoFiltered.isComplete);
                listItem.className = "list-group-item";
                if (todoFiltered.isComplete) {
                    listItem.className = "list-group-item list-group-item-success";
                    countNumberCompleted = true;
                }
                else {
                    listItem.appendChild(doneButton);
                    countNumberRemaining++;
                }
                listItem.appendChild(deleteButton);
                listItem.appendChild(editButton);
                todoList.appendChild(listItem);
                countLabel.textContent = "Remaining tasks: " + countNumberRemaining;
            }
        });
        if (countNumberCompleted) {
            var deleteAllButton = document.createElement("button");
            deleteAllButton.className = "btn btn-default delete";
            deleteAllButton.onclick = deleteCompletedTodoItems;
            countLabel.innerText += String.fromCharCode(13) + "Delete all completed tasks ";
            countLabel.appendChild(deleteAllButton);
        }
    });
}

function loadFilterButtons() {
    while (filterButtons.firstChild) {
        filterButtons.removeChild(filterButtons.firstChild);
    }
    var allButton = document.createElement("button");
    var activeButton = document.createElement("button");
    var completedButton = document.createElement("button");
    allButton.onclick = allDisplay;
    allButton.className = "btn btn-default";
    allButton.innerText = "All";
    activeButton.onclick = activeDisplay;
    activeButton.className = "btn btn-default";
    activeButton.innerText = "Active";
    completedButton.onclick = completedDisplay;
    completedButton.className = "btn btn-default";
    completedButton.innerText = "Completed";
    filterButtons.appendChild(allButton);
    filterButtons.appendChild(activeButton);
    filterButtons.appendChild(completedButton);
}

function allDisplay() {
    sortMethod = "none";
    reloadTodoList();
}

function activeDisplay() {
    sortMethod = "active";
    reloadTodoList();
}

function completedDisplay() {
    sortMethod = "completed";
    reloadTodoList();
}

function todoListDisplayFilter(todoParsed, filterType) {
    if (filterType === "none") {
        return todoParsed;
    }
    else if (filterType === "active") {
        if (todoParsed.isComplete === false) {
            return todoParsed;
        }
        else {
            return;
        }
    }
    else if (filterType === "completed") {
        if (todoParsed.isComplete === true) {
            return todoParsed;
        }
        else {
            return;
        }
    }
}

function deleteTodoItem() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", "/api/todo/" + this.value);
    createRequest.send();
    reloadTodoList();
}

function deleteCompletedTodoItems() {
    getTodoList(function(todos) {
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                var createRequest = new XMLHttpRequest();
                createRequest.open("DELETE", "/api/todo/" + todo.id);
                createRequest.send();
            }
        });
        reloadTodoList();
    });
}

function doneTodoItem(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("PUT", "/api/todo/" + this.id);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title : null,
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
