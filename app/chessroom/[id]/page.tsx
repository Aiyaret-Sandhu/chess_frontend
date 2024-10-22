// app/chessroom/[id]/page.jsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChessBoard from './_components/ChessBoard'

export default function ChessRoom() {
  const params = useParams();
  const id = params.id as string; // Get the room ID from the URL
  const [roomStatus, setRoomStatus] = useState('Joining room...');
  
  const springBootBaseUrl = 'https://2cea-152-59-119-61.ngrok-free.app/api/rooms'; // Spring Boot backend

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await axios.get(`${springBootBaseUrl}/${id}`);
        setRoomStatus(response.data);
      } catch (error) {
        setRoomStatus('Room not found or failed to join.');
      }
    };

    if (id) {
      joinRoom();
    }
  }, [id]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Chess Room: {id}</h1>
      <p>{roomStatus}</p>

      
      <div style={{ marginTop: '50px' }}>
      <ChessBoard />
      </div>
    </div>
  );
}
