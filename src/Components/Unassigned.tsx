import React, { useState, useEffect } from 'react';
import AllMessage from './AllMessage';
import axios from '../helper/Axios';
import { FaUserCircle } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { FaArrowCircleLeft } from "react-icons/fa";

const Unassigned = () => {
  const [unassignedUsers, setUnassignedUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUnassignedUsers();
  }, []);

  const fetchUnassignedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/unassigned-users');
      
      if (Array.isArray(response.data)) {
        setUnassignedUsers(response.data);
      } else {
        setUnassignedUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching unassigned users:', err);
      setError(err.response?.data?.message || 
              err.message || 
              'Failed to load unassigned users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = unassignedUsers.filter(user => 
    // Filter by user_id or session_id since the API doesn't return name or email
    (user.user_id?.toString() || '').includes(searchQuery) || 
    (user.session_id?.toString() || '').includes(searchQuery)
  );

  const handleUserSelect = (user:any) => {
    setSelectedUser(user);
  };

  const handleRefresh = () => {
    fetchUnassignedUsers();
  };

  if (selectedUser) {
    return <AllMessage 
      initialSessionId={selectedUser.session_id} 
      initialUserName={`User ID: ${selectedUser.user_id}`}
      onBack={() => setSelectedUser(null)}
    />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <div className="flex gap-6 items-center mb-6">
        <NavLink to={'/'}>
      <button className='cursor-pointer p-2 text-white bg-gray-400 rounded-lg'>
          <FaArrowCircleLeft/>
        </button>
        </NavLink>
        <h1 className="text-2xl font-bold">Unassigned Users</h1>
        {/* <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button> */}
        
      </div>
      
      {/* Search Bar */}
      {/* <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by user ID or session ID..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={handleSearch}
        />
        <IoSearchSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      </div> */}

      {/* Users List */}
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
                key={user.id || user.session_id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center p-4 space-x-4">
                  <div className="relative">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800">User ID: {user.user_id}</h3>
                    <p className="text-sm text-gray-500 truncate">Session: {user.session_id}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {user.status || 'Unassigned'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Unassigned;