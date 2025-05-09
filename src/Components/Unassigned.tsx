import React, { useState, useEffect } from "react";
import AllMessage from "./AllMessage";
import axios from "../helper/Axios";
import { FaUserCircle } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";

const Unassigned = () => {
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [getagent, setGetagent] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  // New state for popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetchUnassignedUsers();
    GetAgent();
  }, []);

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const fetchUnassignedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/unassigned-users");

      if (Array.isArray(response.data)) {
        setUnassignedUsers(response.data);
      } else {
        setUnassignedUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching unassigned users:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load unassigned users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const GetAgent = async () => {
    try {
      const response = await axios.get("/agent_info");
      if (Array.isArray(response.data)) {
        setGetagent(response.data);
      } else {
        setGetagent([]);
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = unassignedUsers.filter(
    (user) =>
      (user.user_id?.toString() || "").includes(searchQuery) ||
      (user.session_id?.toString() || "").includes(searchQuery)
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleRefresh = () => {
    fetchUnassignedUsers();
  };

  // Custom popup function
  const showSuccessPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleAssign = async (user) => {
    const agentId = selectedAgents[user.session_id];

    if (!agentId) {
      showSuccessPopup("Please select an agent before assigning.");
      return;
    }

    // Find the selected agent to get their name
    const selectedAgent = getagent.find(
      (agent) => agent.agent_id.toString() === agentId.toString()
    );
    const agentName = selectedAgent
      ? selectedAgent.agent_name
      : "Unknown Agent";

    const requestData = {
      session_id: user.session_id,
      agent_id: agentId,
      agent_name: agentName,
      user_id: user.user_id,
    };

    console.log("Assignment request data:", requestData);

    try {
      const response = await axios.post("/transfer", requestData);
      console.log("Assignment successful:", response.data);

      // Update UI
      setUnassignedUsers((prev) =>
        prev.filter((u) => u.session_id !== user.session_id)
      );
      setSelectedAgents((prev) => {
        const updated = { ...prev };
        delete updated[user.session_id];
        return updated;
      });

      // Show success popup instead of alert
      showSuccessPopup(`User successfully assigned to ${agentName}`);
    } catch (err) {
      console.error("Assignment failed:", err);
      // Show error popup instead of alert
      showSuccessPopup(
        `Error: ${
          err.response?.data?.message || err.message || "Assignment failed"
        }`
      );
    }
  };

  if (selectedUser) {
    return (
      <AllMessage
        initialSessionId={selectedUser.session_id}
        initialUserName={`User ID: ${selectedUser.user_id}`}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-fade-in-down flex items-center">
          <div
            className={`mr-3 ${
              popupMessage.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {popupMessage.includes("Error") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <IoMdCheckmarkCircle className="h-6 w-6" />
            )}
          </div>
          <p
            className={`${
              popupMessage.includes("Error") ? "text-red-600" : "text-gray-800"
            }`}
          >
            {popupMessage}
          </p>
        </div>
      )}

      <div className="flex gap-6 items-center mb-6">
        <NavLink to={"/"}>
          <button className="cursor-pointer p-2 text-white bg-gray-400 rounded-lg">
            <FaArrowCircleLeft />
          </button>
        </NavLink>
        <h1 className="text-2xl font-bold">Unassigned Users</h1>
      </div>

      {/* <div className="mb-6 relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div className="px-3 text-gray-500">
            <IoSearchSharp className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by user ID or session ID..."
            className="w-full p-2 focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div> */}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600 border-l-4 border-red-500">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          {searchQuery ? (
            <p className="text-gray-500 text-lg">No users match your search</p>
          ) : (
            <p className="text-gray-500 text-lg">No unassigned users found</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li
                key={user.session_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center p-4 space-x-4">
                  <div className="relative">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800">
                      User ID: {user.user_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Session: {user.session_id}
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    {/* <button
                      className="text-blue-500 hover:text-blue-700 font-medium"
                      onClick={() => handleUserSelect(user)}
                    >
                      View Chat
                    </button> */}
                    <select
                      className="p-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
                      value={selectedAgents[user.session_id] || ""}
                      onChange={(e) => {
                        const agentId = e.target.value;
                        console.log(
                          `Selected agent ID: ${agentId} for session ${user.session_id}`
                        );
                        setSelectedAgents((prev) => ({
                          ...prev,
                          [user.session_id]: agentId,
                        }));
                      }}
                    >
                      <option value="">Select agent</option>
                      {getagent.map((agent) => (
                        <option key={agent.agent_id} value={agent.agent_id}>
                          {agent.agent_name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => handleAssign(user)}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Unassigned;
