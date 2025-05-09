import React, { useState, useEffect } from "react";
import AllMessage from "./AllMessage";
import axios from "../helper/Axios";
import { FaUserCircle } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface AssignedUser {
  user_id: number;
  session_id: string | null;
  name: string | null;
  agent_name: string;
  last_active: string | null;
  assigned: boolean;
}

const Assigned = () => {
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AssignedUser | null>(null);
  const [showAllMessage, setShowAllMessage] = useState(false);

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  useEffect(() => {
    if (assignedUsers.length > 0) {
      // console.log(
      //   "All agent names:",
      //   assignedUsers.map((user) => ({
      //     user_id: user?.user_id,
      //     agent_name: user?.agent_name,
      //     session_id: user?.session_id,
      //   }))
      // );
    }
  }, [assignedUsers]);

  const fetchAssignedUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/assigned_users");
      // console.log("Assigned users data:", response.data);
      setAssignedUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assigned users:", err);
      setError("Failed to load assigned users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    setShowAllMessage(false);
    setSelectedUser(null);
  };

  const filteredUsers: AssignedUser[] = assignedUsers.filter(
    (user) =>
      !searchQuery ||
      (user.user_id && user.user_id.toString().includes(searchQuery)) ||
      (user.session_id && user.session_id.includes(searchQuery)) ||
      (user.agent_name &&
        user.agent_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (showAllMessage && selectedUser) {
    return (
      <AllMessage
        initialSessionId={selectedUser.session_id}
        initialUserName={
          selectedUser.name || `User ID: ${selectedUser.user_id}`
        }
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex gap-8 items-center mb-6">
        <NavLink to={"/"}>
          <button className="cursor-pointer p-2 text-white bg-gray-400 rounded-lg">
            <FaArrowCircleLeft />
          </button>
        </NavLink>
        <h1 className="text-2xl font-bold text-gray-800">Assigned Users</h1>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 border-l-4 border-red-500 rounded-r-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            // console.log(
            //   `Rendering user ${user.user_id} with agent:`,
            //   user.agent_name
            // );
            return (
              <div
                key={user.session_id}
                // onClick={() => handleUserSelect(user)}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">
                      {user.name || `User ID: ${user.user_id || "Guest"}`}
                    </h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Agent:</span>{" "}
                        {user.agent_name || "Unassigned"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {user.last_active
                          ? `Active: ${new Date(
                              user.last_active
                            ).toLocaleTimeString()}`
                          : "Active now"}
                      </span>
                      <span className="bg-green-100 text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        Assigned
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium">No assigned users found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery
                ? "Try different search terms"
                : "All users are currently unassigned"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assigned;
