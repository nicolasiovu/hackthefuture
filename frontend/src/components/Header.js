import { useNavigate, useLocation } from "react-router-dom";

const Header = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (location.pathname === '/home') {
            navigate("/clients");
        } else if (location.pathname === '/dashboard') {
            props.removeToken();
            navigate("/home");
        } else {
            navigate("/home");
        }
    }

    const handleLogo = () => {
        props.removeToken();
        navigate("/home");
    }

    return (
        <header className="bg-[#0d0d0d] sticky top-0 shadow-md p-4 flex justify-between items-center z-50">
            <div className="flex items-center">
            <img 
                src={"/logo-revolve.png"} 
                alt="ReVolve Logo" 
                className="h-8 pr-4" 
                onClick={handleLogo} 
                style={{ cursor: 'pointer' }} 
            />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                    ReVolve
                </h1>
            </div>
            <button onClick={handleClick}className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold shadow-lg 
                         hover:bg-cyan-400 transition-all 
                         shadow-purple-500/50 hover:shadow-purple-400/70">
                {location.pathname === '/home' ? "Client Login": location.pathname === '/dashboard' ? "Log out": "Return Home"}
            </button>
        </header>
    );
}

export default Header;
