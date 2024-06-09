const host = "http://127.0.0.1:8080";
const todosContainer = document.querySelector(`.todos-container`);
const authorInput = document.querySelector('.author-input');
const contentInput = document.querySelector('.content-input');
const addTodoBtn = document.querySelector('.add-todo-btn');

function getTodos() {
    axios.get(`${host}/todo`)
        .then(response => {
            console.log(response.data);
            renderTodos(response.data.todos);
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
        });
}

function renderTodos(todos) {
    todosContainer.innerHTML = ''; // todosContainer 초기화
    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        const date = new Date(todo.timestamp);
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        todoDiv.textContent = `${todo.author}, "${todo.content}", ${formattedDate}`;
        todosContainer.appendChild(todoDiv);
        
    // 삭제 버튼 생성 및 이벤트 처리
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'x';

        deleteBtn.addEventListener('click', function () {
            deleteTodo(todo.id);
        });

    // todoDiv에 삭제 버튼 추가
        todoDiv.appendChild(deleteBtn);
    });
}

window.addEventListener('DOMContentLoaded', function () {
    getTodos();
});

addTodoBtn.addEventListener('click', function() {
    addTodo();
});

function addTodo() {
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();
    
    if (author === '' || content === '') return;
    
    let todoData = {
        id: 0,
        author: author,
        content: content
    };

    axios.post(`${host}/todo`, todoData)
        .then(response => {
            authorInput.value = '';
            contentInput.value = '';
            getTodos();
        })
        .catch(error => {
            console.error('Error adding todo:', error);
        });
}

function deleteTodo(todoId) {
    axios.delete(`${host}/todo/${todoId}`)
    .then(function (response) {
        console.log('Todo deleted:', response.data);
        getTodos();
    })
    .catch(function (error) {
        console.error('Error deleting todo:', error);
    });
}