// app/playwonline/page.jsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PlayWOnline() {
  const [roomLink, setRoomLink] = useState('');
  const router = useRouter();

  const springBootBaseUrl = 'https://2cea-152-59-119-61.ngrok-free.app/api/rooms'; // Spring Boot backend

  // Function to create a new chess room
  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(`${springBootBaseUrl}/create`, {
        creator: 'Player1', // Replace with dynamic user info
      });
      const roomId = response.data.roomId;
      const ngrokUrl = `${window.location.origin.replace('localhost', 'https://chess-frontend-six.vercel.app/')}/chessroom/${roomId}`;
      setRoomLink(ngrokUrl); // Set the link to be displayed and shared
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // Function to join a room using the room link
  const handleJoinRoom = () => {
    const roomId = prompt('Enter the room ID or link:');
    if (roomId) {
      router.push(`/chessroom/${roomId}`);
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h1>Play Chess Online</h1>
      <button onClick={handleCreateRoom} style={buttonStyle}>
        Create Room
      </button>
      <button onClick={handleJoinRoom} style={buttonStyle}>
        Join Room
      </button>

      {roomLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Share this link with a friend to join the game:</p>
          <a href={roomLink}>{roomLink}</a>
        </div>
      )}
    </div>
  );
}

// Styling for buttons
const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '18px',
  cursor: 'pointer',
};
