import React, {useState} from "react";
import {useCookies } from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AuthForm} from "./authForm";
import * as Services from "../services/services";
import {MuiSnackbar} from "../utils/MuiSnackbar";

export const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<any>({})
    const [_, setCookies]=useCookies(["access_token"])
    const navigate = useNavigate()
    const handleSubmit = async(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const response = await Services.login({username, password})
        if(response.error || !response.data.token) {
            setData({
                    message: response.message || 'Login Failed!',
                    severity: 'error'
                }
            )
        } else {
            setCookies("access_token", response.data.token)
            window.localStorage.setItem("user", response.data)
            window.localStorage.setItem("userID", response.data.userID)
            navigate("/todos")
            navigate(0)
        }
        setOpen(true)
        setUsername('');
        setPassword('')

    }
    return (
        <>
            <AuthForm
                username={username} password={password}
                setUsername={setUsername} setPassword={setPassword}
                handleSubmit={handleSubmit}
                label={'Login'}/>
            {open && (
                <MuiSnackbar severity={data.severity} message={data.message} setOpen={setOpen} open={true}/>
            )}
        </>
    )
}
