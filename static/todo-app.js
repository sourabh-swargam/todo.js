var taskList = []

class Task {
    constructor(name, dueDate, isDone) {
        this.taskId = Date.now();
        this.name = name;
        this.dueDate = dueDate;
        this.isDone = isDone;
    }

    toString() {
        let htmlText = '<li class="task" '
        if (this.isDone == true) {
            htmlText += 'style="color:green;" '
        }
        htmlText += 'id = "'
        htmlText += this.taskId
        htmlText += '"><div>'
        htmlText += this.name
        htmlText += ", " + this.dueDate.getDate() 
                 + "/" + this.dueDate.getMonth();
        htmlText += '<input type="checkbox" name="isDone" id="isDone" onclick="updateTask('
        htmlText += this.taskId
        htmlText += ')">'
        htmlText += '<button onclick="deleteTask(';
        htmlText += this.taskId;
        htmlText += ')">Delete</button>';
        htmlText += '</div></li>';
        return htmlText;
    }
}

function render() {
    const listUI = document.getElementById("todolist")
    listUI.innerHTML = "";
    if (taskList.length === 0) listUI.innerHTML = "No tasks todo :-)"
    taskList.forEach((task) => {
        listUI.innerHTML += task.toString();
    })
}

function deleteTask(taskId) {
    taskList = taskList.filter(
        (t) => {
            if(t.taskId != taskId) {
                return t;
            }
        }
    );
    // call a web api to update the database on the server
    const request = new XMLHttpRequest()
    request.open('POST', `/api/delete?id=${taskId}`)
    request.send()
    request.onload = () => {
        // update the DOM
        render();
        console.log(taskList)        
    }
}

function taskStatus(taskId) {
    let i = 0
    for(i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == taskId) {
            return i
        }
    }
}

function updateTask(taskId) {
    let index = taskStatus(taskId)
    if (taskList[index].isDone == false) taskList[index].isDone = true
    else taskList[index].isDone = false 
    const request = new XMLHttpRequest()
    request.open('POST', `/api/update?id=${taskId}&done=${taskList[index].isDone}`)
    request.send()
    request.onload = () => {
        // update the DOM
        render();
        console.log(taskList)        
    }
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    let dueDate = document.getElementById("dueDate").value;
    dueDate = dueDate.split('-')
    addTask(new Task(taskName, new Date(dueDate[0], dueDate[1], dueDate[2]), false));
}

function addTask(t) {
    taskList.push(t)
    // call a web api to update the database on the server
    const request = new XMLHttpRequest()
    request.open('POST', `/api/add?id=${t.taskId}&name=${t.name}&date=${t.dueDate}&done=${t.isDone}`)
    request.send()
    request.onload = () => {
        render();
        console.log(taskList)        
    }

}

function init() {
    console.log("init called");

    // call a web api to retrieve the task list
    // write a function to send a api request
    // get the JSON
    // assign it to taskList
    // render
    const request = new XMLHttpRequest()
    request.open('POST', '/init')
    request.send()
    request.onload = () => {
        let data = JSON.parse(request.responseText)
        for (var id in data) {
            new_task = new Task(data[id]['name'], new Date(data[id]['date']), data[id]['done']);
            new_task.taskId = data[id]['id']
            if (data[id]['done'] == "true")
                new_task.isDone = true
            else 
                new_task.isDone = false
            taskList.push(new_task)
        }
        console.log(taskList)
        render()
    }
}

init();