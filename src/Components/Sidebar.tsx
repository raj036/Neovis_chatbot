import React from "react";
import { FaMessage } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setFilterStatus, filterStatus, onClose, isMobile }) => {
  const navigate = useNavigate();
  const linkClass =
    "flex items-center gap-3 px-4 py-2 transition duration-200 rounded-md ";
  const activeClass = "bg-blue-200 font-semibold text-blue-600";
  const inactiveClass = "text-gray-700 hover:bg-gray-100";

  const handleUnassignedClick = () => {
    setFilterStatus("Unassigned");
    navigate("/unassigned"); // Navigate to the Unassigned route
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md flex flex-col z-20 ${
        isMobile ? "md:hidden" : ""
      }`}
    >
      {/* Logo and Close Button */}
      <div className="p-4 border-b mx-auto my-0 border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <img src="Neovis-logo.png" alt="" className="w-[150px]"/>
        </h1>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        <button
          onClick={() => setFilterStatus("all")}
          className={`${linkClass} ${
            filterStatus === "all" ? activeClass : inactiveClass
          } w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>All Messages</span>
          </div>
          <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
            30
          </span>
        </button>

        <button
          onClick={() => setFilterStatus("AI")}
          className={`${linkClass} ${
            filterStatus === "AI" ? activeClass : inactiveClass
          } w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaRobot className="text-lg" />
            <span>AI Messages</span>
          </div>
        </button>

        <button
          onClick={() => setFilterStatus("Assigned")}
          className={`${linkClass} ${
            filterStatus === "Assigned" ? activeClass : inactiveClass
          } w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>Assigned</span>
          </div>
        </button>

        <button
          onClick={handleUnassignedClick}
          className={`${linkClass} ${
            filterStatus === "Unassigned" ? activeClass : inactiveClass
          } w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>Unassigned</span>
          </div>
        </button>

        <button
          onClick={() => setFilterStatus("Urgent")}
          className={`${linkClass} ${
            filterStatus === "Urgent" ? activeClass : inactiveClass
          } w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <RiErrorWarningFill className="text-lg text-red-500" />
            <span>Important</span>
          </div>
        </button>

        <button
          onClick={() => setFilterStatus("Closed")}
          className={`${linkClass} ${
            filterStatus === "Closed" ? activeClass : inactiveClass
          } w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <IoIosCheckmarkCircle className="text-lg" />
            <span>Closed</span>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
