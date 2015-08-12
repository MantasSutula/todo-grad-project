//var countLabel = document.getElementById("count-label");
var filterButtons = document.getElementById("filter-buttons");
var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var header = document.getElementById("header");
var sortMethod = "none";

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title) {
    fetch("/api/todo", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            isComplete: false
        })
    })
    .then(function(response) {
            if (response.status === 201) {
                reloadTodoList();
            }
            else {
                error.textContent = "Failed to create item. Server returned " + response.status +
                " - " + response.statusText;
            }
        })
    .catch(function(err) {
            error.textContent = "Failed to create item. Server returned " + err.status +
            " - " + err.statusText;
        });
}

function getTodoList(callback) {
    fetch("/api/todo")
    .then(
    function(response) {
        if (response.status !== 200) {
            error.textContent = ("Failed to get list. Server returned " + response.status +
            " - " + response.statusText);
        }

        response.json().then(function(data) {
            callback(data);
        });
    })
    .catch(function(err) {
        error.textContent = ("Failed to get list. Server returned " + err.status +
        " - " + err.statusText);
    });
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    var countNumberRemaining = 0;
    var countNumberCompleted = false;
    getTodoList(function(todos) {
        countNumberRemaining = todos.length;
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                countNumberRemaining--;
            }
            var todoFiltered = todoListDisplayFilter(todo, sortMethod);
            if (todoFiltered !== undefined) {
                var listItem = document.createElement("li");
                var deleteButton = document.createElement("button");
                var doneButton = document.createElement("button");
                var editButton = document.createElement("button");
                listItem.textContent = todoFiltered.title;
                listItem.className = "list-group-item";
                deleteButton.onclick = deleteTodoItem;
                deleteButton.className = "btn btn-default glyphicon glyphicon-trash right-button";
                deleteButton.setAttribute("id", "delete-todo");
                deleteButton.setAttribute("value", todoFiltered.id);
                doneButton.onclick = doneTodoItem;
                doneButton.className = "btn btn-default glyphicon glyphicon-ok left-button";
                doneButton.setAttribute("id", "done-todo");
                doneButton.setAttribute("value", todoFiltered.id);
                doneButton.setAttribute("isComplete", "false");
                editButton.onclick = editTodoItem;
                editButton.className = "btn btn-default glyphicon glyphicon-pencil right-button";
                editButton.setAttribute("id", "edit-todo");
                editButton.setAttribute("value", todoFiltered.id);
                editButton.setAttribute("currentText", todoFiltered.title);
                if (todoFiltered.isComplete) {
                    listItem.className = "list-group-item list-group-item-success";
                    doneButton.setAttribute("isComplete", "true");
                    countNumberCompleted = true;
                }
                listItem.appendChild(deleteButton);
                listItem.appendChild(doneButton);
                listItem.appendChild(editButton);
                todoList.appendChild(listItem);
            }
        });
        if (countNumberCompleted) {
            var deleteAllButton = document.createElement("button");
            deleteAllButton.className = "btn btn-default delete";
            deleteAllButton.onclick = deleteCompletedTodoItems;
            //countLabel.innerText += String.fromCharCode(13) + "Delete all completed tasks ";
            //countLabel.appendChild(deleteAllButton);
        }
        if (todos.length > 0) {
            loadFilterButtons(true);
        }
        else {
            loadFilterButtons(false);
        }
        setHeader(countNumberRemaining);
    });
}

function setHeader(countNumberRemaining) {
    while (header.firstChild) {
        header.removeChild(header.firstChild);
    }
    var headerTitle = document.createElement("h1");
    var remainingText = document.createElement("h4");
    headerTitle.textContent = "TODO List";
    remainingText.textContent = "Remaining tasks: " + countNumberRemaining;
    remainingText.className = "header-remaining";
    header.appendChild(headerTitle);
    header.appendChild(remainingText);
}

function loadFilterButtons(ifLoad) {
    while (filterButtons.firstChild) {
        filterButtons.removeChild(filterButtons.firstChild);
    }
    if (ifLoad) {
        var tableRow = document.createElement("tr");
        var allText = document.createElement("textField");
        var activeText = document.createElement("textField");
        var completeText = document.createElement("textField");
        var allButton = document.createElement("button");
        var activeButton = document.createElement("button");
        var completedButton = document.createElement("button");
        allText.className = "table-text";
        allText.textContent = "Hello";
        activeText.className = "table-text";
        activeText.textContent = "Hello";
        completeText.className = "table-text";
        completeText.textContent = "Hello";
        allButton.onclick = allDisplay;
        allButton.className = "btn btn-default";
        allButton.innerText = "All";
        activeButton.onclick = activeDisplay;
        activeButton.className = "btn btn-default";
        activeButton.innerText = "Active";
        completedButton.onclick = completedDisplay;
        completedButton.className = "btn btn-default";
        completedButton.innerText = "Completed";
        tableRow.appendChild(allButton);
        tableRow.appendChild(allText);
        tableRow.appendChild(activeButton);
        tableRow.appendChild(activeText);
        tableRow.appendChild(completedButton);
        tableRow.appendChild(completeText);
        filterButtons.appendChild(tableRow);
    }
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
    }
    else if (filterType === "completed") {
        if (todoParsed.isComplete === true) {
            return todoParsed;
        }
    }
}

function deleteTodoItem() {
    fetch("/api/todo/" + this.value, {
        method: "delete"
    })
        .then(function(response) {
            if (response.status === 200) {
                reloadTodoList();
            }
            else {
                error.textContent = "Failed to delete item. Server returned " + response.status +
                " - " + response.statusText;
            }
        })
        .catch(function(err) {
            error.textContent = "Failed to delete item. Server returned " + err.status +
            " - " + err.statusText;
        });
}

function deleteCompletedTodoItems() {
    getTodoList(function(todos) {
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                fetch("/api/todo/" + todo.id, {
                    method: "delete"
                })
                    .then(function(response) {
                        if (response.status === 200) {

                        }
                        else {
                            error.textContent = "Failed to delete item. Server returned " + response.status +
                            " - " + response.statusText;
                        }
                    })
                    .catch(function(err) {
                        error.textContent = "Failed to delete item. Server returned " + err.status +
                        " - " + err.statusText;
                    });
            }
        });
        reloadTodoList();
    });
}

function doneTodoItem() {
    var isCompleteBoolean = true;
    if (this.getAttribute("isComplete") === "true") {
        isCompleteBoolean = false;
    }
    fetch("/api/todo/" + this.value, {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isComplete: isCompleteBoolean
        })
    })
        .then(function(response) {
            if (response.status === 200 || response.status === 201) {
                reloadTodoList();
            }
            else {
                error.textContent = "Failed to update item. Server returned " + response.status +
                " - " + response.statusText;
            }
        })
        .catch(function(err) {
            error.textContent = "Failed to update item. Server returned " + err.status +
            " - " + err.statusText;
        });
}

function editTodoItem() {
    var todoTitle = window.prompt("Enter the new title", this.getAttribute("currentText"));
    if (todoTitle) {
        fetch("/api/todo/" + this.value, {
            method: "put",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: todoTitle
            })
        })
            .then(function (response) {
                if (response.status === 200 || response.status === 201) {
                    reloadTodoList();
                }
                else {
                    error.textContent = "Failed to update item. Server returned " + response.status +
                        " - " + response.statusText;
                }
            })
            .catch(function (err) {
                error.textContent = "Failed to update item. Server returned " + err.status +
                    " - " + err.statusText;
            });
    }
}

reloadTodoList();
//setInterval(reloadTodoList, 10000);
