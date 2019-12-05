var username = '';
const todayDate = new Date();

function getUserData(name) {
    $.ajax({
        url: "http://localhost:3000/users/" + name
    }).then(function (data) {
        $('.error').text('');
        username = name;
        processUserData(data[0]);
    }).catch(function (error) {
        username = '';
        $('.error').append(error.statusText);
    });
}

function processUserData(data) {

    function getHtmlFormattedTask(task) {
        if (task.d !== '') {
            return `<article class="col-4 col-12-xsmall"><div class="work-item">${task.n} (${task.d})</div></article>`;
        } else {
            return `<article class="col-4 col-12-xsmall"><div class="work-item">${task.n}</div></article>`;
        }
    }

    function getHtmlFormattedTasks(tasks) {
        let html = '';
        tasks.forEach(task => {
            html = html + getHtmlFormattedTask(task);
        });
        return html;
    }

    function filterDoneTasks(task) {
        return task.d === ''; // no date means finish
    }

    function filterTodoTasks(task) {
        return task.d !== '' && new Date(task.d) > todayDate;
    }

    function filterOverTasks(task) {
        return task.d !== '' && new Date(task.d) < todayDate;
    }

    let tasks = data.t,
        doneTasks = tasks.filter(filterDoneTasks),
        todoTasks = tasks.filter(filterTodoTasks),
        overTasks = tasks.filter(filterOverTasks);

    $('.done-tasks-content').html(getHtmlFormattedTasks(doneTasks));
    $('.todo-tasks-content').html(getHtmlFormattedTasks(todoTasks));
    $('.late-tasks-content').html(getHtmlFormattedTasks(overTasks));
}

function addTaskToUser(username, taskname, taskdate) {
    if (username === '') {
        $('.error').html('choose user.');
        return;
    }
    $.ajax({
        url: `http://localhost:3000/addtask/${username}/${taskname}/${encodeURIComponent(taskdate)}`
    }).then(function (data) {
        if (data !== 0) {
            $('.error').text('Task Added!');
            getUserData(username);
        }
    }).catch(function (error) {
        $('.error').append(error.statusText);
    });
}

$(document).ready(function () {
    $("#submitTaskButton").click(function () {
        addTaskToUser(username, $('#taskname').val(), $('#taskdate').val());
    });

    $("#submitUserButton").click(function () {
        getUserData($('#username').val());
    });
});
