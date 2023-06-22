import {Button, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import * as Services from "../services/services";
import {useGetUserID} from "../hooks/useGetUserID";
import {useCookieState} from "../hooks/useCookieState";
export const AddTodo = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userID = useGetUserID()
    const navigate = useNavigate()
    // @ts-ignore
  const access_token = useCookieState<any>({key: 'access_token'})
    const handleAddTodo = async(event: React.MouseEvent<HTMLButtonElement>) => {
       event.preventDefault()
        const response = await Services.addTodo({
            name, description, userOwner: userID
        }, access_token)
        if(!response.error) {
            navigate("/todos")
        }
    }
    return (
        <Stack direction={'column'} spacing={2}  sx={{
            backgroundColor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            justifyContent: 'center',
            my: 4,
            minWidth: 400,
            maxWidth: 'auto',
            paddingBottom: 4,
            display: 'inline-block'
        }}>
            <Typography sx={{textAlign: 'center'}} variant={'h5'}>Add Todo</Typography>
            <Stack direction={'column'} spacing={2}>
                <TextField label={'Name'} required
                           helperText={!name ? 'Required': null}
                           variant={'outlined'} value={name} onChange={(e)=> setName(e.target.value)}/>
                <TextField label={'Description'} required type={'textarea'}
                           helperText={!description ? 'Required': null}
                           variant={'outlined'} value={description} onChange={(e)=> setDescription(e.target.value)}/>
                <Button variant="contained" onClick={handleAddTodo} disabled={!name}>Add Todo</Button>

            </Stack>
        </Stack>
    )
}
