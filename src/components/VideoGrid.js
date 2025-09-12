import React, { useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  MicOff,
  VideocamOff
} from '@mui/icons-material';

const VideoTile = ({ 
  stream, 
  name, 
  isLocal = false, 
  isMuted = false, 
  isVideoOff = false,
  isTeacher = false 
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'relative',
        aspectRatio: '16/9',
        bgcolor: 'black',
        borderRadius: 2,
        overflow: 'hidden',
        border: isTeacher ? '3px solid #1976d2' : '1px solid #e0e0e0'
      }}
    >
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.800'
          }}
        >
          <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Box>
      )}

      {/* Name and status overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {name} {isLocal && '(You)'}
          </Typography>
          {isTeacher && (
            <Chip
              label="Teacher"
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {isMuted && (
            <MicOff sx={{ color: 'error.main', fontSize: 16 }} />
          )}
          {isVideoOff && (
            <VideocamOff sx={{ color: 'error.main', fontSize: 16 }} />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const VideoGrid = ({ participants, localStream, localUser }) => {
  const getGridColumns = (count) => {
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const participantCount = participants.length + (localStream ? 1 : 0);
  const columns = getGridColumns(participantCount);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 2,
        p: 2,
        height: '100%',
        overflow: 'auto'
      }}
    >
      {/* Local video */}
      {localStream && (
        <VideoTile
          stream={localStream}
          name={localUser?.name || 'You'}
          isLocal={true}
          isMuted={!localUser?.isAudioEnabled}
          isVideoOff={!localUser?.isVideoEnabled}
          isTeacher={localUser?.role === 'teacher'}
        />
      )}

      {/* Remote participants */}
      {participants.map((participant) => (
        <VideoTile
          key={participant.id}
          stream={participant.stream}
          name={participant.name}
          isMuted={!participant.isAudioEnabled}
          isVideoOff={!participant.isVideoEnabled}
          isTeacher={participant.role === 'teacher'}
        />
      ))}
    </Box>
  );
};

export default VideoGrid;