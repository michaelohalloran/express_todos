const baseUrl = '/api/todos';

//GLOBALS:
const list = document.getElementsByClassName('list')[0];

function displayTodo(todo) {
    list.appendChild(todo);
}

function makeDomElement(name) {
    return document.createElement(name);
}

function setId(el, id) {
    el.id = id;
}

function createListItem(item, itemId) {
    //make li
    let listItem = makeDomElement('LI');
    //set li id:
    setId(listItem, itemId);
    //append text
    let text = item.name ? document.createTextNode(item.name) : null;
    listItem.appendChild(text);
    addDoneListener(listItem);
    //make and append deleteBtn
    let deleteBtn = makeDomElement('button');
    addDeleteListener(deleteBtn);
    deleteBtn.innerHTML = 'Delete';
    listItem.appendChild(deleteBtn);
    return listItem;
}


const addDbTodos = (todos) => {
    console.log('todos: ', todos);
    todos.map(todo=> {
        //create li for each todo name
        // let dbTodo = document.createElement('LI');
        // let text = document.createTextNode(todo.name);
        // let deleteBtn = document.createElement('button');
        // addDeleteListener(deleteBtn);
        // deleteBtn.innerHTML = 'Delete';
        // dbTodo.appendChild(text);
        // dbTodo.appendChild(deleteBtn);
        // console.log('dbTodo: ', dbTodo);
        //if the todo is completed, add a "done" class for strikethrough styles
        let dbTodo = createListItem(todo, todo._id);
        //if todo is completed, add done styling
        todo.completed && dbTodo.classList.add('done');
        //append each todo to the ul list
        displayTodo(dbTodo);
    })

    //ALTERNATIVE:

    // todos.map(todo => {
    //     //get ul
    //     const list = document.getElementsByClassName('list')[0];
    //     //add lis with each todo and strikethrough (conditionally)
    //     list.innerHTML += `<li class="task ${todo.completed && 'done'}">${todo.name}</li>`;
    // })
}

//LISTENERS
const input = document.getElementById('todoInput');
input.addEventListener('keypress', addNewTodo);

function addNewTodo(e) {
    if(e.which == 13) {
        const todo = {name: e.target.value};
        //must specify headers, stringify todo, pass in name field
        const postObj = {
            method: 'post',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo),
        }
        fetch(baseUrl, postObj)
        .then(res => {
            if(!res.ok) {
                throw Error('Error');
            }
            return res.json();
        })
        //fire displayTodo function here
        .then(data => {
            let newTodo = createListItem(data, data._id);
            displayTodo(newTodo);
        })
        .catch(err => console.log(err));
    }
}

//when clicking a todo, apply or remove done styles
function addDoneListener(todo) {
    todo.addEventListener('click', e => {
        console.log('clicked todo from addDoneListener', e.target);
        e.target.classList.toggle('done');
    })
}

//fire deleteTodo when clicking deleteBtn for a todo
function addDeleteListener(btn) {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        let itemToDelete = e.target.parentNode;
        let idToDelete = e.target.parentNode.id;
        deleteTodo(itemToDelete, idToDelete);

    })
}

function deleteTodo(todo, todoId) {
    // console.log('todo id: ', todo.id);
    fetch(`${baseUrl}/${todoId}`, {
        method: 'delete'
    })
    removeTodoFromDom(todo);
}

function removeTodoFromDom(todo) {
    list.removeChild(todo);
    return list;
}


const loadTodos = () => {
    fetch(baseUrl)
        .then(todos => todos.json())
        .then(addDbTodos)
        .catch(err => console.log(err));
}

loadTodos();