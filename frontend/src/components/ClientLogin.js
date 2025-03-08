import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ClientLogin = (props) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
            ...errors,
            [name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
  
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username: formData.username,
                password: formData.password,
            })
            if (response.status === 200) {
                props.setToken(response.data.access_token)
                navigate('/home');
            }
        } catch (error) {
            if (error.response) {
                newErrors.username = error.response.data.message;
                setErrors(newErrors);
            }
        }
    }

    return (
        <div className="relative overflow-hidden bg-gradient-start text-white min-h-screen flex flex-col items-center justify-center space-y-8 p-4 z-0">
            <div 
                className="absolute inset-0 bg-gradient-to-r from-gradient-start via-gradient-middle via-gradient-middle-2 to-gradient-end bg-[length:200%_200%] animate-smooth z-0"
                style={{
                    backgroundSize: "200% 200%",
                    animation: "smoothGradient 15s linear infinite",
                    willChange: "background-position"
                }}
            ></div>

            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blue-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
            <div className="absolute top-1/5 right-1/5 w-56 h-56 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-8 text-center">
                    Welcome Back
                </h1>

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-black bg-opacity-40 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                    
                    <div className="space-y-2">
                    <label htmlFor="username" className="block text-gray-300">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-3 bg-gray-900 border ${errors.username ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                    <label htmlFor="password" className="block text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-3 bg-gray-900 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button 
                    type="submit"
                    className="w-full mt-6 px-8 py-3 text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
                    >
                        Login
                    </button>
                </form>
            </div>    
        </div>
    )
}

export default ClientLogin;