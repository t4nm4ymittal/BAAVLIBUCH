// src/components/UserList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css'; // Import the CSS file for styling
import { Link, NavLink } from "react-router-dom";
const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getUsers');
        setUsers(response.data.users);
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  const Navbar = () => {
    return (
      <div className="navbar">
      <Link to="/">Home</Link>
    </div>
    );
  };
  return (
    <div>
    <Navbar/>
    <div className="user-list">
      {users.map((user) => (
        
        <div key={user.id} className="user-card">
          <div className="user-info">
          <div className="user-image">
          {console.log('dff'+user.image)}
          <img src={`http://localhost:3001/images/${user.image}`} alt={`Profile of ${user.id}`} />
          </div>
            <div className="user-heading">
              <h2>{user.id}</h2>
              
            </div>
            <div className="friend-list">
              <strong>Friend List:</strong>
              <ul>
                {user.friendList.map((friendId, index) => (
                  <li key={index}>Friend ID: {friendId}</li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      ))}
    </div>
    </div>
  );
};

export default UserList;
