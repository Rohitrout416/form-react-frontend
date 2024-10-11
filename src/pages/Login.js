import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `http://localhost:8080/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>

            <form onSubmit={handleLogin}>
                <div className="inputs">
                    <div className="inp">
                        <EmailOutlinedIcon className="img" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
                            onChange={handleChange}
                            className="Email"
                        />
                    </div>

                    <div className="inp">
                        <LockOutlinedIcon className="img" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="Password"
                        />
                    </div>
                </div>

                <div className="submit-container">
                    <button type="submit" className="submit">Login</button>
                </div>
            </form>

            <div className="forgot-password">
                <div className='forgot-text'>Don't have an account?</div>
                <button onClick={() => navigate('/signup')} className="submit">Signup</button>
            </div>

            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light" // you can use "dark" or "colored" themes too
            />
        </div>


    )
}

export default Login