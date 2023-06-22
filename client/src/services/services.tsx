import axios, {AxiosRequestConfig} from "axios";
import {LoginPayload, RegisterPayload, TodoInterface} from "../global";
const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL


//Users Service
const registerUser = async(payload: RegisterPayload) => {
    try {
        const {data} = await axios.post(`${serverBaseUrl}/auth/register`, payload);
        return {message: data?.message || "Registration Successful", status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}
const login = async(payload: LoginPayload) => {
    try {
        const {data} = await axios.post(`${serverBaseUrl}/auth/login`, payload);
        return {data, message: data?.message || "Login Successful", status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}

/*End of user service*/
//Recipes Service
const getAllTodos = async(payload: {userID: string|null }) => {
    try {
        const {data} = await axios.get(`${serverBaseUrl}/todos/${payload.userID}`);
        return {data, status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}
const addTodo = async(payload: TodoInterface, access_token:string) => {
    try {
        const {data} = await axios.post(`${serverBaseUrl}/todos`, payload, {headers: {authorization: access_token}});
        return {data, status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}

//Save Recipe
const updateTodo = async(payload: TodoInterface, headers: AxiosRequestConfig, callBack: Function) => {
    try {
        const {data} = await axios.put(`${serverBaseUrl}/todos/${payload._id}`, payload, headers);
        if(callBack) callBack()
        return {data, status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}
const deleteTodo = async(payload: { todoID: string|undefined , userID: string | null}, headers: AxiosRequestConfig, callBack: Function) => {
    try {
        const {data} = await axios.delete(`${serverBaseUrl}/todos/${payload.todoID}`, headers);
        if(callBack) callBack()
        return {data, status: 200}
    }catch (e: any) {
        return {error: e.message}
    }
}

/*End of recipes service*/

export {registerUser, login, getAllTodos, addTodo, updateTodo, deleteTodo}