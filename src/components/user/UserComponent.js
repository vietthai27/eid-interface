import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { changeUsername, changePassword, changeAuthToken, changeRequestId, changeShowPassword } from '../../userSlice'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"

function UserComponent() {

    const userData = useSelector(state => state.userData)
    const dispatch = useDispatch()

    const login = () => {
        axios.post(userData.hostbase + '/login', {
            username: userData.username,
            password: userData.password
        })
            .then(response => {
                const status = response.data.status
                if (status === 200) {
                    dispatch(changeAuthToken(response.data.accessToken))
                    toast.success("Get token success !!!")
                } else {
                    toast.error("Get token error !!!")
                    console.error('Login failed:', response.data);
                }
            })
            .catch(error => {
                toast.error("Get token error !!!")
                console.error('Login failed:', error);
            });
    }

    const generateId = () => {
        const requestId = crypto.randomUUID();
        dispatch(changeRequestId(requestId))
    }

    const handleClickShowPassword = () => {
        dispatch(changeShowPassword(!userData.showPassword))
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <Box
                display="flex" justifyContent="center" mt={2}
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => dispatch(changeUsername(e.target.value))} />

                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        onChange={(e) => dispatch(changePassword(e.target.value))}
                        id="outlined-adornment-password"
                        type={userData.showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        userData.showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {userData.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                <TextField InputLabelProps={{ shrink: true }} id="outlined-basic" label="Token" value={userData.authToken} variant="outlined" />
                <Stack spacing={2} direction="row">
                    <Button onClick={() => login()} variant="contained">
                        Get token
                    </Button>
                </Stack>
                <TextField InputLabelProps={{ shrink: true }} id="outlined-basic" label="Request ID" value={userData.requestId} variant="outlined" />
                <Stack spacing={2} direction="row">
                    <Button onClick={() => generateId()} variant="contained">
                        Generate ID
                    </Button>
                </Stack>
            </Box>
        </div>
    )
}

export default UserComponent