import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Typography
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare
} from '@mui/icons-material';

const ClassroomControls = ({
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onLeaveClass,
  participantCount = 0
}) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 1000,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 3
      }}
    >
      <Typography variant="body2" color="white" sx={{ mr: 2 }}>
        {participantCount} participant{participantCount !== 1 ? 's' : ''}
      </Typography>

      <Tooltip title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
        <IconButton
          onClick={onToggleVideo}
          sx={{
            bgcolor: isVideoEnabled ? 'success.main' : 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: isVideoEnabled ? 'success.dark' : 'error.dark'
            }
          }}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}>
        <IconButton
          onClick={onToggleAudio}
          sx={{
            bgcolor: isAudioEnabled ? 'success.main' : 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: isAudioEnabled ? 'success.dark' : 'error.dark'
            }
          }}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
        <IconButton
          onClick={onToggleScreenShare}
          sx={{
            bgcolor: isScreenSharing ? 'primary.main' : 'grey.600',
            color: 'white',
            '&:hover': {
              bgcolor: isScreenSharing ? 'primary.dark' : 'grey.700'
            }
          }}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Leave class">
        <IconButton
          onClick={onLeaveClass}
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            ml: 2,
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
        >
          <CallEnd />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default ClassroomControls;