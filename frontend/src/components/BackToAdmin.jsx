import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BackToAdmin = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin")}
      className="flex items-center gap-2 mb-6 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow"
    >
      <FiArrowLeft size={18} />
      Back to Admin Panel
    </button>
  );
};

export default BackToAdmin;