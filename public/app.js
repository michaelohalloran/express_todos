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
    //add class for styles
    listItem.classList.add('task');
    //make and append delete span
    let deleteX = makeDomElement('span');
    addDeleteListener(deleteX);
    deleteX.innerHTML = 'X';
    listItem.appendChild(deleteX);
    return listItem;
}


const addDbTodos = (todos) => {
    // console.log('todos: ', todos);
    todos.map(todo=> {
        //create li for each todo
        let dbTodo = createListItem(todo, todo._id);
        //if todo is completed, add done styling
        todo.completed && dbTodo.classList.add('done');
        //append each todo to the ul list
        displayTodo(dbTodo);
    })

    //ALTERNATIVE:

    // todos.map(todo => {
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
        console.dir(e.target);
        //update the view w/ strike-through
        e.target.classList.toggle('done');

        //update completed boolean status in DB
        updateTodo(e.target, e.target.id);
    })
}

function updateTodo(todo, id) {
    console.log('todo data clicked: ', todo);
    const updates = {
        method: 'put',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({completed: true}),
    }
    fetch(`${baseUrl}/${id}`, updates)
    .then(res => res.json())
    .then(updatedTodo => console.log('updatedTodo: ', updatedTodo))
    .catch(err => console.log('Update error: ', err));
}


//********************************************* */
//DELETE FUNCTIONALITY
//fire deleteTodo when clicking deleteBtn for a todo
function addDeleteListener(btn) {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        let itemToDelete = e.target.parentNode;
        let idToDelete = e.target.parentNode.id;
        deleteTodo(itemToDelete, idToDelete);

    })
}

//remove todo from DB
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