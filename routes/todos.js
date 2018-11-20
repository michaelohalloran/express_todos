const express = require('express');
const router = express.Router();
const db = require('../models');
const helpers = require('../helpers/todos');

//@ api/todos
//GET all todos, POST todo
router.route('/')
    .get(helpers.getTodos)
    .post(helpers.createTodo);



//@ /api/todos/:todoId
//GET, PUT, DELETE individual todo
router.route('/:todoId')
    .get(helpers.getTodo)
    .put(helpers.updateTodo)
    .delete(helpers.deleteTodo)


module.exports = router;