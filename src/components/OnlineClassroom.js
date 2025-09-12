import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import io from 'socket.io-client';
import WebRTCManager from '../utils/webrtc';
import VideoGrid from './VideoGrid';
import ClassroomControls from './ClassroomControls';
import AIChatbot from './AIChatbot';

const OnlineClassroom = ({ 
  classId, 
  user, 
  onLeave,
  socketUrl = 'ws://localhost:3002' // You'll need to set up a Socket.IO server
}) => {
  const [webrtc] = useState(() => new WebRTCManager());
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Initialize classroom
  useEffect(() => {
    const initializeClassroom = async () => {
      try {
        // Initialize media
        const stream = await webrtc.initializeMedia();
        setLocalStream(stream);

        // Connect to socket server
        const socketConnection = io(socketUrl, {
          query: { classId, userId: user.id, userName: user.name, userRole: user.role }
        });

        socketConnection.on('connect', () => {
          console.log('Connected to classroom server');
          setSocket(socketConnection);
          
          // Join the classroom
          socketConnection.emit('join-classroom', {
            classId,
            userId: user.id,
            userName: user.name,
            userRole: user.role
          });
          
          setIsLoading(false);
        });

        socketConnection.on('user-joined', (userData) => {
          setNotification(`${userData.name} joined the class`);
          handleUserJoined(userData, socketConnection, stream);
        });

        socketConnection.on('user-left', (userData) => {
          setNotification(`${userData.name} left the class`);
          handleUserLeft(userData);
        });

        socketConnection.on('signal', (data) => {
          handleSignal(data);
        });

        socketConnection.on('existing-users', (users) => {
          users.forEach(userData => {
            handleUserJoined(userData, socketConnection, stream);
          });
        });

        socketConnection.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setError('Failed to connect to classroom server');
          setIsLoading(false);
        });

      } catch (err) {
        console.error('Failed to initialize classroom:', err);
        setError('Failed to access camera/microphone. Please check permissions.');
        setIsLoading(false);
      }
    };

    initializeClassroom();

    return () => {
      cleanup();
    };
  }, [classId, user]);

  const handleUserJoined = useCallback((userData, socketConnection, stream) => {
    const peer = webrtc.createPeer(true, stream, userData.socketId);
    
    peer.on('signal', (signal) => {
      socketConnection.emit('signal', {
        signal,
        to: userData.socketId,
        from: socketConnection.id
      });
    });

    peer.on('stream', (remoteStream) => {
      setParticipants(prev => [
        ...prev.filter(p => p.id !== userData.id),
        {
          id: userData.id,
          name: userData.name,
          role: userData.role,
          stream: remoteStream,
          socketId: userData.socketId,
          isAudioEnabled: true,
          isVideoEnabled: true
        }
      ]);
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

  }, [webrtc]);

  const handleUserLeft = useCallback((userData) => {
    webrtc.removePeer(userData.socketId);
    setParticipants(prev => prev.filter(p => p.id !== userData.id));
  }, [webrtc]);

  const handleSignal = useCallback((data) => {
    const peer = webrtc.peers.get(data.from);
    if (peer) {
      peer.signal(data.signal);
    } else {
      // Create peer for incoming connection
      const newPeer = webrtc.createPeer(false, localStream, data.from);
      
      newPeer.on('signal', (signal) => {
        socket?.emit('signal', {
          signal,
          to: data.from,
          from: socket.id
        });
      });

      newPeer.on('stream', (remoteStream) => {
        // Find user data and update participants
        setParticipants(prev => {
          const existingIndex = prev.findIndex(p => p.socketId === data.from);
          const participant = {
            id: data.from,
            name: 'Unknown User',
            role: 'student',
            stream: remoteStream,
            socketId: data.from,
            isAudioEnabled: true,
            isVideoEnabled: true
          };
          
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], stream: remoteStream };
            return updated;
          }
          return [...prev, participant];
        });
      });

      newPeer.signal(data.signal);
    }
  }, [webrtc, localStream, socket]);

  const handleToggleVideo = useCallback(() => {
    const enabled = webrtc.toggleVideo();
    setIsVideoEnabled(enabled);
    
    // Notify other participants
    socket?.emit('media-state-changed', {
      userId: user.id,
      video: enabled,
      audio: isAudioEnabled
    });
  }, [webrtc, socket, user.id, isAudioEnabled]);

  const handleToggleAudio = useCallback(() => {
    const enabled = webrtc.toggleAudio();
    setIsAudioEnabled(enabled);
    
    // Notify other participants
    socket?.emit('media-state-changed', {
      userId: user.id,
      video: isVideoEnabled,
      audio: enabled
    });
  }, [webrtc, socket, user.id, isVideoEnabled]);

  const handleToggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        webrtc.getPeers().forEach(peer => {
          const sender = peer._pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        setIsScreenSharing(true);
        
        videoTrack.onended = () => {
          handleToggleScreenShare();
        };
      } else {
        // Switch back to camera
        const cameraStream = await webrtc.initializeMedia();
        const videoTrack = cameraStream.getVideoTracks()[0];
        
        webrtc.getPeers().forEach(peer => {
          const sender = peer._pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        setLocalStream(cameraStream);
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Screen share error:', err);
      setError('Failed to share screen');
    }
  }, [isScreenSharing, webrtc]);

  const handleLeaveClass = useCallback(() => {
    cleanup();
    onLeave();
  }, [onLeave]);

  const cleanup = useCallback(() => {
    webrtc.cleanup();
    socket?.disconnect();
  }, [webrtc, socket]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Joining classroom...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Please check your camera and microphone permissions and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          Online Classroom - Class {classId}
        </Typography>
        <Typography variant="body2">
          {user.role === 'teacher' ? 'Teaching' : 'Attending'} as {user.name}
        </Typography>
      </Box>

      {/* Video Grid */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <VideoGrid
          participants={participants}
          localStream={localStream}
          localUser={{
            name: user.name,
            role: user.role,
            isVideoEnabled,
            isAudioEnabled
          }}
        />
      </Box>

      {/* Controls */}
      <ClassroomControls
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        isScreenSharing={isScreenSharing}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        onToggleScreenShare={handleToggleScreenShare}
        onLeaveClass={handleLeaveClass}
        participantCount={participants.length + 1}
      />

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        message={notification}
      />

      {/* AI Chatbot */}
      <AIChatbot user={user} currentPage="online-classroom" />
    </Box>
  );
};

export default OnlineClassroom;