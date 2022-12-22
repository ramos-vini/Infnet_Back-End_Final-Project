import {
    useLocation, useNavigate 
} from 'react-router-dom';
import { Stack, Box, Typography, Grid, Button } from '@mui/material';
import { TextField } from '../components';
import logo from '../assets/img/logo.png';
import { useState, useEffect } from 'react'; 
import { login, userIsLoggedIn } from '../services/auth';

const Login = ({ setCurrentRoute }) => {
    const navigate = useNavigate();
    const location = useLocation();
    setCurrentRoute(location.pathname);

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        userIsLoggedIn(navigate, location.pathname);
    }, []);

    return <Grid container spacing={2}>
                <Grid item xs={0} sm={4}></Grid>
                <Grid item xs={12} sm={4}>
                    <Stack direction={'column'}>
                        <Box sx={{
                            textAlign: 'center'
                        }}>
                            <img style={{
                                height: '80px',
                                width: 'auto',
                                padding: '15px 0'
                            }} src={logo}/>
                            <Typography variant="h4" component="h1" gutterBottom>Entrar</Typography>
                        </Box>
                        <TextField
                            id={'email-user-login'}
                            fullWidth={true}
                            label={'E-mail/Username'}
                            type={'text'}
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            />
                        <TextField
                            id={'password-login'}
                            fullWidth={true}
                            label={'Password'}
                            type={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        <Button
                            size={'large'}
                            onClick={() => {
                                navigate(`/register`)
                            }}>Registrar</Button>
                        <Button
                            size={'large'}
                            variant={'contained'} 
                            onClick={async () => {
                                const response = await login(userEmail, password);
                                if(response.status === 200){
                                    window.localStorage.setItem('user', JSON.stringify(response.data))
                                    navigate('/');
                                }else if(response.status === 404){
                                    alert(response.data.msg)
                                }
                            }}>Entrar</Button>
                    </Stack>
                </Grid>
           </Grid>
}

export default Login;