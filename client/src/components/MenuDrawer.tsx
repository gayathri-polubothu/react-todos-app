import { useState } from "react";
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Menu from '@mui/icons-material/Menu'
import Home from '@mui/icons-material/Home'
import ExitToApp from '@mui/icons-material/ExitToApp'

import {Link, useLocation} from "react-router-dom";

interface MenuDrawerProps {
  cookies: any,
  logout: Function
}
function MenuDrawerComponent({cookies, logout}: MenuDrawerProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const location=useLocation()
    return (
        <>
            <Drawer
                sx={{
                    color: 'primary.main'
                }}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List
                    aria-labelledby="My Todos App Menu"
                    subheader={
                        <ListSubheader component="div" id="My Todos App Menu">
                            My Todos App Menu
                        </ListSubheader>
                    }
                >
                    {cookies.access_token ? (
                        <>
                            <ListItem onClick={() => setOpenDrawer(false)} button
                                      selected={location.pathname === '/todos'}>
                                <ListItemIcon>
                                    <Home />
                                </ListItemIcon>
                                <ListItemText>
                                    <Link to="/todos">Home</Link>
                                </ListItemText>
                            </ListItem>
                            <Divider />
                            <ListItem onClick={() => setOpenDrawer(false)}>
                                <ListItemText>
                                    <Link to="/todos">Todos</Link>
                                    <List>
                                        <ListItem>
                                            <ListItemText>
                                                <Link to="/all-todos">All Todos</Link>
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem selected={location.pathname === '/add-todo'}>
                                            <ListItemText>
                                                <Link to="/add-todo">Add Todo</Link>
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem  selected={location.pathname === '/completed-todos'}>
                                            <ListItemText>
                                                <Link to="/completed-todos">Completed Todos</Link>
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </ListItemText>
                            </ListItem>
                            <Divider />
                            <Button
                                sx={{m:2}}
                                startIcon={<ExitToApp />}
                                variant={'contained'} onClick={()=>{
                                logout()
                                setOpenDrawer(false)
                            }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <ListItem onClick={() => setOpenDrawer(false)}>
                                <ListItemText>
                                    <Link to="/">Login</Link>
                                </ListItemText>
                            </ListItem>
                            <Divider />
                            <ListItem onClick={() => setOpenDrawer(false)}>
                                <ListItemText>
                                    <Link to="/register">Register</Link>
                                </ListItemText>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                <Menu />
            </IconButton>
        </>
    );
}
export default MenuDrawerComponent;