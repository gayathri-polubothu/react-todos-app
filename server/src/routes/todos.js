const express = require('express');
const todosRouter = express.Router();
const TodoModel = require('../models/Todos')
const UserModel = require("../models/Users");
const verifyToken = require('./common')
// Get all todos
todosRouter.get('/:userID', async(req, res)=>{
    try{
        const response = await TodoModel.find({userOwner: req.params.userID})
        res.status(200).json(response)
    }catch(e) {
        res.json(e)
    }
})
// Create New Todo
todosRouter.post('/', verifyToken ,async(req, res)=>{
    const todo = new TodoModel(req.body)
    todo.created_at = new Date()
    todo.completed_at = null
    todo.status = false
    try{
        const response = await todo.save()
        res.status(200).json(response)
    }catch(e) {
        res.json(e)
    }
})

// Update Todo to User Todos
todosRouter.put('/:todoID', verifyToken, async(req, res)=>{
     try{
         const todo = req.body
         if(todo.status) {
             todo.completed_at = new Date()
         }
         todo.updated_at = new Date()
         const user = await UserModel.findById(req.body.userID)
         user.savedTodos.push(todo);
         await user.save()
         const updatedTodo = await TodoModel.updateOne({_id: req.body._id}, {$set: {...todo}})
        res.status(200).json({todo:updatedTodo, message: 'Todo updated sucessfully'})
    }catch(e) {
        res.json(e)
    }
})

// Delete Todo to User Todos
todosRouter.delete('/:todoID', verifyToken, async(req, res)=>{
    try{
        const todo = await TodoModel.deleteOne({_id: req.params.todoID})
        res.status(200).json({message: 'Todo deleted successfully', todo})
    }catch(e) {
        res.json(e)
    }
})

todosRouter.get('/completedTodos/ids/:userID', async(req, res)=>{
    try{
        const user = await UserModel.findById(req.params.userID);
        res.json({savedTodos: user?.savedTodos})
    }catch (e) {
        res.json(e)
    }
})
//Get completed todos for given user id
todosRouter.get('/completedTodo/:userID', async(req, res)=>{
    try{
        const user = await UserModel.findById(req.params.userID);
        const savedTodos = await TodoModel.find({
            _id: {$in: user.savedTodos}
        })
        res.json({ savedTodos })
    }catch (e) {
        res.json(e)
    }
})
module.exports=todosRouter;