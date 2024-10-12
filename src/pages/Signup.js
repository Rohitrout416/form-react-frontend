import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
    
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }
    
        try {
            const response = await fetch('https://form-react-backend.vercel.app/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo),
            });
    
            const contentType = response.headers.get('content-type');
            const result = contentType && contentType.includes('application/json') 
                ? await response.json() 
                : await response.text();
    
            if (!response.ok) {
                console.error('Error response:', result);
                return handleError(typeof result === 'string' ? result : result.error || 'Signup failed.');
            }
    
            console.log('Success response:', result);
            handleSuccess(typeof result === 'string' ? result : result.message || 'Signup successful');
    
            // Navigate to the login page after a short delay
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            console.error('Fetch failed:', err);
            handleError('An unexpected error occurred.');
        }
    };
    

    return (
        <div className="container">
            <div className="header">
                <div className="text">Signup</div>
                <div className="underline"></div>
            </div>

            <form onSubmit={handleSignup}>
                <div className="inputs">
                    <div className="inp">
                        <AccountCircleOutlinedIcon className="img" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name..."
                            value={signupInfo.name}
                            onChange={handleChange}
                            autoFocus
                            className="Username"
                        />
                    </div>

                    <div className="inp">
                        <EmailOutlinedIcon className="img" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={signupInfo.email}
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
                            value={signupInfo.password}
                            onChange={handleChange}
                            className="Password"
                        />
                    </div>
                </div>

                <div className="submit-container">
                    <button type="submit" className="submit">Signup</button>
                </div>
            </form>

            <div className="forgot-password">
                <div className='forgot-text'>Already have an account?</div>
                <button onClick={() => navigate('/login')} className="submit">Login</button>
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

export default Signup