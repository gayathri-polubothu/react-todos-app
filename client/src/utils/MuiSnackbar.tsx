import {Snackbar, Alert, AlertProps, AlertColor} from "@mui/material";
import {forwardRef} from "react";

interface SnackbarProps {
  message: string,
  severity: AlertColor | undefined,
  open: boolean,
  setOpen: Function
}
const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
    function SnackbarAlert(props, ref){
      return <Alert elevation={6} ref={ref} {...props}/>
    }
)
export const MuiSnackbar = ({message, severity, setOpen, open}: SnackbarProps) => {
    const handleClose = (event: React.SyntheticEvent| Event, reason?: string)=> {
      if(reason==='clickaway') return
      setOpen(false)
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <SnackbarAlert onClose={handleClose} severity={severity}>
                    {message}
                </SnackbarAlert>
            </Snackbar>
        </>
    )
}