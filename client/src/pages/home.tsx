import { useState} from "react";
import * as Services from "../services/services";
import TodoCard from '../components/TodoCard'
import {Box, Button, Typography} from "@mui/material";
import {useGetUserID} from "../hooks/useGetUserID";
import {useCookies} from "react-cookie";
import {updateTodo, deleteTodo} from "../services/services";
import List from "@mui/material/List";
import {MuiSnackbar} from "../utils/MuiSnackbar";
import useCustomUseQuery from "../hooks/useCustomUseQuery";
import {useNavigate} from "react-router-dom";
import {containerMiddle} from "../services/common";
import {TodoInterface} from "../global";

const fetchTodos = async() => {
    if(!window.localStorage.getItem('userID')) return []
    try{
        const response = await Services.getAllTodos({userID: window.localStorage.getItem('userID')});
        return response.data
    }catch(err) {
        console.log('Fetch Todos error: ', err)
    }
}
export const Home = ({fromCompletedTodos=false, allTodos=null} : {fromCompletedTodos?: boolean, allTodos?: boolean | null}) => {
    const userID = useGetUserID()
    const {data: fetchResp, isError, invalidateQuery: invalidateFetchTodos} = useCustomUseQuery(['fetch-todos'],
        fetchTodos, {defaultTo: []})
    const todos =allTodos ? fetchResp : fetchResp?.filter((todo: TodoInterface) => fromCompletedTodos ? todo.status : !todo.status)
    const [data, setData] = useState<any>({});
    const [cookies, _] = useCookies(["access_token"])
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const updateAlertObject = (resp: {message?: string, error?: any, todo: any}) => {
            setData(resp.error ? {severity: 'error', message: resp.message || 'Something wrong'}
            : {severity: 'success', message: resp.message})
        setOpen(true)
    }
    const handleUpdateTodo = async(Todo: TodoInterface) => {
        const response = await updateTodo({...Todo, userID}, {headers: {
             authorization: cookies.access_token
            }}, invalidateFetchTodos)
        updateAlertObject(response.data)
    }
    const handleDeleteTodo = async(Todo: TodoInterface) => {
        const response = await deleteTodo({todoID: Todo._id, userID}, {headers: {
                authorization: cookies.access_token
            }}, invalidateFetchTodos)
        updateAlertObject(response.data)
    }
    if(todos?.length === 0) {
        return (
            <Box width={'50vw'} sx={containerMiddle}>
                <Typography variant={'subtitle1'} p={2}>No Todos. Create/Complete One</Typography>
                <Button variant="contained" size={'medium'}
                        onClick={()=> navigate(fromCompletedTodos ? "/todos" : "/add-todo")}>
                    {fromCompletedTodos ? 'View Todos' : 'Add Todo'}
                </Button>
            </Box>
        )
    }
    return (
        <Box p={3}>
            {todos ? (
                <>
                    <Typography sx={{textAlign: 'center'}} variant={'h5'}>{fromCompletedTodos ? 'Completed Todos List' : 'Todos List'}</Typography>
                    <List dense sx={{ width: '100%', maxWidth: '50vw', backgroundColor: 'background.paper',  boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        justifyContent: 'center',
                        my: 3,
                        paddingBottom: 4,
                        display: 'inline-block' }}>
                        {todos?.map((todo: TodoInterface)=> (
                            <TodoCard Todo={todo} key={todo._id} isTodoCompleted={todo.status} handleUpdateTodo={handleUpdateTodo} handleDeleteTodo={handleDeleteTodo}/>
                        ))}
                    </List>
                </>
            ) : (
                <Typography sx={{textAlign: 'center'}} variant={'body2'}> No Todos. </Typography>
                )}
            {open && (
                <MuiSnackbar severity={isError || data?.error ? 'error' : 'success'} message={data?.message} setOpen={setOpen} open={true}/>
            )}
        </Box>
    )
}
