import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (location.pathname === '/home') {
            navigate("/clients");
        } else {
            navigate("/home");
        }
    }

    return (
        <header className="bg-[#0d0d0d] sticky top-0 shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                ReVolve
            </h1>
            <button onClick={handleClick}className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold shadow-lg 
                         hover:bg-cyan-400 transition-all 
                         shadow-purple-500/50 hover:shadow-purple-400/70">
                {location.pathname === '/home' ? "Client Login": "Return Home"}
            </button>
        </header>
    );
}

export default Header;
