import { useState } from "react";
import axios from 'axios';

const RequestPage = () => {
  const [formData, setFormData] = useState({
    orderId: "",
    condition: "Like New",
    returnReason: "Damaged",
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + formData.files.length > 4) {
      setUploadError("You can only upload up to 4 files.");
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      ["image/", "video/"].some((type) => file.type.startsWith(type))
    );

    if (validFiles.length !== selectedFiles.length) {
      setUploadError("Only images and videos are allowed.");
      return;
    }

    setUploadError("");
    setFormData({ ...formData, files: [...formData.files, ...validFiles] });
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.orderId.trim()) newErrors.orderId = "Order ID is required";
    if (formData.files.length === 0) newErrors.files = "At least one file is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("order_id", formData.orderId);
    formDataToSend.append("client_id", 1)
    formDataToSend.append("condition", formData.condition);
    formDataToSend.append("reason", formData.returnReason);

    formData.files.forEach((file) => {
        formDataToSend.append("files", file);
    });

    try {
        const response = await axios.post('http://127.0.0.1:5000/ask_gemini', formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.status === 200) {
            setShowModal(true);
        }
    } catch (error) {
        console.log("error");
    }
    setTimeout(() => {
        setShowModal(true);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-start text-white min-h-screen flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 p-4 z-0">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gradient-start via-gradient-middle via-gradient-middle-2 to-gradient-end bg-[length:200%_200%] animate-smooth z-0"
        style={{ backgroundSize: "200% 200%", animation: "smoothGradient 15s linear infinite", willChange: "background-position" }}
      ></div>

      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-blue-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
      <div className="absolute top-1/5 right-1/5 w-64 h-64 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full h-full">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold text-white">Request Accepted!</h2>
            <p className="text-gray-400 mt-2">Your request has been successfully confirmed, and is available to track.</p>
            <button onClick={() => setShowModal(false)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-start space-y-6 bg-black bg-opacity-40 p-6 rounded-lg shadow-lg backdrop-blur-sm w-full max-w-md">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
          Select Your Item
        </h2>

        <select
          name="selectedItem"
          value={formData.selectedItem}
          onChange={handleInputChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select an Item --</option>
          <option value="Laptop">Laptop</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Tablet">Tablet</option>
          <option value="Headphones">Headphones</option>
        </select>
        {errors.selectedItem && <p className="text-red-500 text-sm">{errors.selectedItem}</p>}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
          Submit your request to get an immediate verdict:
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6 bg-black bg-opacity-40 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          
          <div className="space-y-2">
            <label htmlFor="orderId" className="block text-gray-300">Order ID</label>
            <input
              type="orderId"
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
              className={`w-full p-3 bg-gray-900 border ${errors.orderId ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.orderId}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300">Upload Files (Up to 4 images/videos)</label>
            <input
              type="file"
              multiple
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none"
            />
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
            {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}

            {formData.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg text-sm">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="returnReason" className="block text-gray-300">Return Reason</label>
            <select
              id="returnReason"
              name="returnReason"
              value={formData.returnReason}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Damaged">Damaged</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Item not as described">Not as Described</option>
              <option value="Missing parts/accessories">Missing Parts/Accessories</option>
              <option value="wrong size">Wrong Size</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="condition" className="block text-gray-300">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <button 
            onClick={handleSubmit}
            type="submit"
            className="w-full mt-4 px-8 py-3 text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPage;
