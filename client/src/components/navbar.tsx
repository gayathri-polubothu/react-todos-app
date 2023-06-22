import {Link, useLocation} from "react-router-dom"
import {
    AppBar,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MenuBook from "@mui/icons-material/MenuBook";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import React, {useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import MenuDrawerComponent from "./MenuDrawer";

export const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement| null>(null);
    const open = Boolean(anchorEl)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()
    const location=useLocation()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement| null>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const logout = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/login")
        navigate(0)
    }

    return (
        <AppBar position={'static'}>
            <Toolbar sx={{backgroundColor: 'main'}}>
                <IconButton size={'large'} edge={'start'} color={'inherit'} aria-label={'logo'}>
                    <MenuBook />
                </IconButton>
                <Typography variant={'h6'} component={'div'} sx={{
                    flexGrow: 1,
                    textAlign: 'left',
                    ml: 4
                }}>
                    My Todos Application
                </Typography>
                {isMobile ? (
                    <MenuDrawerComponent cookies={cookies} logout={logout} />
                ) : (
                    <>
                        <Stack direction={'row'} spacing={2}>
                            {!cookies.access_token ? (
                                   <>
                                       <Link to={'/login'} aria-selected={location.pathname==='login'}>
                                           <Button size="medium" sx={{color: 'white'}}>
                                               Login
                                           </Button>
                                       </Link>
                                       <Link to={'/register'} aria-selected={location.pathname==='register'}>
                                           <Button sx={{color: 'white'}}>
                                               Register
                                           </Button>
                                       </Link>
                                   </>
                            ) : (
                                <>
                                    <Link to={"/todos"}>
                                        <Button sx={{color: 'white'}}>
                                            Home
                                        </Button>
                                    </Link>
                                    <Button color={'inherit'} id={'resources-button'} onClick={handleClick}
                                            aria-controls={open? 'resources-menu': undefined}
                                            aria-haspopup={'true'}
                                            aria-expanded={open ? 'true':  undefined}
                                            endIcon={<KeyboardArrowDown />}
                                    >
                                        Todos
                                    </Button>
                                    <Button variant={'contained'} onClick={logout}>
                                        Logout
                                    </Button>
                                </>
                                )}
                        </Stack>
                        <Menu open={open} id={'resources-menu'} anchorEl={anchorEl}
                              MenuListProps={{
                                  'aria-labelledby': 'resources-button'
                              }}
                              onClose={handleClose}
                              anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal:'right'
                              }}
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right'
                              }}
                        >
                            <MenuItem onClick={handleClose}><Link to={'/all-todos'}>All Todos</Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to={'/add-todo'}>Add Todo</Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to={'/completed-todos'}>Completed Todos</Link></MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}
