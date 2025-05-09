import React, { useEffect, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from '../helper/Axios';

const Sidebar = ({ setFilterStatus, filterStatus, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assignedCount, setAssignedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [unassignedCount, setUnassignedCount] = useState(0);
  
  const linkClass = "flex items-center gap-3 px-4 py-2 transition duration-200 rounded-md ";
  const activeClass = "bg-blue-200 font-semibold text-blue-600";
  const inactiveClass = "text-gray-700 hover:bg-gray-100";

  // Determine if we're on assigned route
  const isOnAssignedRoute = location.pathname === '/assigned';
  
  useEffect(() => {
    // If we're on the assigned route, update the filter status
    if (isOnAssignedRoute && filterStatus !== 'Assigned') {
      setFilterStatus('Assigned');
    }
    
    // Fetch counts for badge numbers
    fetchMessageCounts();
  }, [isOnAssignedRoute]);
  
  const fetchMessageCounts = async () => {
    try {
      // Replace these with your actual API endpoints
      // const totalResponse = await axios.get('/message/count');
      // const assignedResponse = await axios.get('/assigned_users/count');
      // const unassignedResponse = await axios.get('/unassigned/count');
      
      // setTotalCount(totalResponse.data.count || 0);
      // setAssignedCount(assignedResponse.data.count || 0);
      // setUnassignedCount(unassignedResponse.data.count || 0);
    } catch (error) {
      console.error("Error fetching message counts:", error);
    }
  };

  const handleNavigate = (route, status) => {
    setFilterStatus(status);
    navigate(route);
    
    // Close sidebar on mobile after navigation
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleAllMessagesClick = () => {
    handleNavigate('/', 'all');
  };

  const handleAssignedClick = () => {
    handleNavigate('/assigned', 'Assigned');
  };

  const handleUnassignedClick = () => {
    handleNavigate('/unassigned', 'Unassigned');
  };

  const handleUrgentClick = () => {
    handleNavigate('/', 'Urgent');
  };

  const handleClosedClick = () => {
    handleNavigate('/', 'Closed');
  };

  const handleAIClick = () => {
    handleNavigate('/', 'AI');
  };

  return (
    <div className={`fixed left-0  top-0 h-screen w-64 bg-white shadow-md flex flex-col z-20 ${isMobile ? 'md:hidden' : ''}`}>
      {/* Logo and Close Button */}
      <div className="p-4 mx-auto my-0 border-b border-gray-200 flex justify-between items-center">
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
          onClick={handleAllMessagesClick}
          className={`${linkClass} ${filterStatus === 'all' && !isOnAssignedRoute ? activeClass : inactiveClass} w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>All Messages</span>
          </div>
          {totalCount > 0 && (
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
              {totalCount}
            </span>
          )}
        </button>

        <button
          onClick={handleAIClick}
          className={`${linkClass} ${filterStatus === 'AI' ? activeClass : inactiveClass} w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaRobot className="text-lg" />
            <span>AI Messages</span>
          </div>
        </button>

        <button
          onClick={handleAssignedClick}
          className={`${linkClass} ${isOnAssignedRoute || filterStatus === 'Assigned' ? activeClass : inactiveClass} w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>Assigned</span>
          </div>
          {assignedCount > 0 && (
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
              {assignedCount}
            </span>
          )}
        </button>

        <button
          onClick={handleUnassignedClick}
          className={`${linkClass} ${filterStatus === 'Unassigned' ? activeClass : inactiveClass} w-full justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <FaMessage className="text-lg" />
            <span>Unassigned</span>
          </div>
          {unassignedCount > 0 && (
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
              {unassignedCount}
            </span>
          )}
        </button>

        <button
          onClick={handleUrgentClick}
          className={`${linkClass} ${filterStatus === 'Urgent' ? activeClass : inactiveClass} w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <RiErrorWarningFill className="text-lg text-red-500" />
            <span>Important</span>
          </div>
        </button>

        <button
          onClick={handleClosedClick}
          className={`${linkClass} ${filterStatus === 'Closed' ? activeClass : inactiveClass} w-full cursor-pointer`}
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