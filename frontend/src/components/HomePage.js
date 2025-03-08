import Select from "react-select";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const sampleOptions = [
    { value: 'company1', label: 'Company 1' },
    { value: 'company2', label: 'Company 2' },
    { value: 'company3', label: 'Company 3' },
    { value: 'company4', label: 'Company 4' }
  ];

const HomePage = () => {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [options, setOptions] = useState(sampleOptions);
    const [error, setError] = useState("");

    const handleSelectChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
        setError(""); 
    };

    const handleClick = () => {
        if (!selectedCompany) {
            setError("Please make a selection.");
            return;
        }

        navigate("/request");
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

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
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                Welcome to ReVolve
                </h1>
                <p className="text-2xl font-semibold text-gray-400">Select a brand to evaluate your return.</p>
                <Select
                options={options}
                className="w-80 mt-4"
                classNamePrefix="react-select"
                placeholder="Select a brand"
                isSearchable
                value={selectedCompany}
                onChange={handleSelectChange}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                    ...theme.colors,
                    primary: "#4b6bfb", 
                    neutral0: "#1a1a1a", 
                    neutral5: "#bbb", 
                    neutral10: "#fff", 
                    neutral20: "#444", 
                    neutral50: "#fff", 
                    neutral80: "#bbb", 
                    },
                })}
                styles={{
                    control: (provided) => ({
                    ...provided,
                    backgroundColor: "#1a1a1a", 
                    borderColor: "#444", 
                    color: "#fff", 
                    padding: "10px",
                    borderRadius: "8px",
                    }),
                    option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#2c3e50" : "", 
                    color: "#fff", 
                    cursor: "pointer",
                    }),
                    singleValue: (provided) => ({
                    ...provided,
                    color: "#fff", 
                    }),
                    input: (provided) => ({
                    ...provided,
                    color: "#fff", 
                    }),
                    placeholder: (provided) => ({
                    ...provided,
                    color: "#bbb", 
                    }),
                }}
                />
                {error && (
                    <p className="text-red-400 mt-2">{error}</p>
                )}
                <button onClick={handleClick} className="mt-8 px-8 py-3 text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">
                Go
                </button>
            </div>
        </div>
    )
}

export default HomePage;