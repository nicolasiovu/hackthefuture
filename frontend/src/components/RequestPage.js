import { useState } from "react";

const RequestPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    selectedItem: "",
    condition: "Like new",
    returnReason: "damaged",
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.files.length === 0) newErrors.files = "At least one file is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Submitting Request:", formData);
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
            <label htmlFor="email" className="block text-gray-300">Email (Used on Client's Website)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
              <option value="damaged">Damaged</option>
              <option value="wrong item">Wrong Item</option>
              <option value="not as described">Not as Described</option>
              <option value="missing parts/accessories">Missing Parts/Accessories</option>
              <option value="wrong size">Wrong Size</option>
            </select>
          </div>

          <button 
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
