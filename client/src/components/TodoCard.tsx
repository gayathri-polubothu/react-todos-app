import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import {TodoInterface} from '../global'

interface TodoCardProps {
  Todo: TodoInterface,
  isTodoCompleted?: boolean | undefined,
  handleUpdateTodo? : Function,
  handleDeleteTodo?: Function
}
export default function TodoCard({Todo, isTodoCompleted, handleUpdateTodo=()=> {}, handleDeleteTodo=()=>{}} :TodoCardProps) {
    const {name, description, created_at}: TodoInterface = Todo

    return (
        <>
            <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={()=>handleDeleteTodo(Todo)}>
                        <Tooltip title={'Delete Todo'}>
                        <DeleteIcon />
                        </Tooltip>
                    </IconButton>
                }
            >
                <Tooltip title="Mark as completed">
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={isTodoCompleted}
                            tabIndex={-1}
                            disableRipple
                            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleUpdateTodo({...Todo, status: e.target.checked})}
                            inputProps={{ 'aria-labelledby': `checkbox-list-label-${name}` }}
                        />
                    </ListItemIcon>
                </Tooltip >
                <ListItemText
                    primary={name}
                    secondary={description ? description : null}

                />
                <Typography variant={'subtitle2'}>{new Date(created_at).toLocaleDateString("en", {
                    year: "numeric",
                    day: "2-digit",
                    month: "long",
                })}</Typography>
            </ListItem>
        </>
    );
}