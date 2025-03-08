import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClientRegister = () => {

    const [formData, setFormData] = useState({
    brandName: "",
    username: "",
    password: "",
    confirmPassword: "",
    databaseAPI: ""
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.brandName.trim()) newErrors.brandName = "Brand name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.databaseAPI.trim()) newErrors.databaseAPI = "Database API is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    }

    return (
        <div className="relative overflow-hidden bg-gradient-start text-white min-h-screen flex flex-col items-center justify-center space-y-8 p-4 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end bg-[length:400%_400%] animate-water z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-8 text-center">
                    Join The Future of Returns
                </h1>
                
                <form onSubmit={handleSubmit} className="w-full space-y-4 bg-black bg-opacity-40 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="space-y-2">
                    <label htmlFor="brandName" className="block text-gray-300">Brand Name</label>
                    <input
                        type="text"
                        id="brandName"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleChange}
                        className={`w-full p-3 bg-gray-900 border ${errors.brandName ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName}</p>}
                    </div>
                    
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
                    
                    <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-3 bg-gray-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                    
                    <div className="space-y-2">
                    <label htmlFor="databaseAPI" className="block text-gray-300">Database API</label>
                    <input
                        type="text"
                        id="databaseAPI"
                        name="databaseAPI"
                        value={formData.databaseAPI}
                        onChange={handleChange}
                        className={`w-full p-3 bg-gray-900 border ${errors.databaseAPI ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.databaseAPI && <p className="text-red-500 text-sm">{errors.databaseAPI}</p>}
                    </div>
                    
                    <button 
                    type="submit"
                    className="w-full mt-6 px-8 py-3 text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
        );
};

export default ClientRegister;