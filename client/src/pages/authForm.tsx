import { Button, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {containerMiddle} from "../services/common";

interface AuthFormProps {
  username: string,
  password: string,
  email?: string | null,
  phoneNumber?: string | null,
  setUsername: Function,
  setPassword: Function,
  setEmail?: Function | null,
  setPhoneNumber?: Function | null,
  label: string,
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>
}
export const AuthForm = ({username, password, setUsername, setPassword, label, email ,setEmail, phoneNumber, setPhoneNumber, handleSubmit}: AuthFormProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isValidEmail = email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    return (
        <Stack direction={'column'} spacing={4} m={8} sx={containerMiddle}>
            <Typography sx={{textAlign: 'center'}} variant={'h5'}>{label}</Typography>
            <Stack direction='column' spacing={2}>
                <TextField label={'User Name'} required
                           helperText={!username ? 'Required': null}
                           variant={'outlined'} value={username} onChange={(e)=> setUsername(e.target.value)}/>
                <TextField label={'Password'} required value={password} onChange={(e)=> setPassword(e.target.value)}
                           type={showPassword ? 'text': 'password'}
                           InputProps={{endAdornment: !showPassword ? <Visibility onClick={()=>setShowPassword(true)}/> : <VisibilityOff onClick={()=>setShowPassword(false)}/>}}
                           helperText={!password ?  'Required' : label === 'Register' ? 'Do not share your password to anyone': null}
                           variant={'outlined'}/>
                {(email === '' || email )&&(
                    <>
                        <TextField label={'Email'} variant={'outlined'} value={email} required
                                   onChange={(e)=> setEmail && setEmail(e.target.value)}
                                   helperText={!isValidEmail ? 'Invalid Email Address' : null}
                        />
                        <TextField
                            value={phoneNumber}
                            fullWidth
                            label='Phone Number'
                            variant='outlined'
                            onChange={(e)=>setPhoneNumber && setPhoneNumber(e.target.value)}
                        />
                    </>
                )}
                <Button variant="contained"
                        onClick={handleSubmit} disabled={!username || !password || (email ? !isValidEmail : false)}>{label}</Button>
            </Stack>
        </Stack>
    )
}
