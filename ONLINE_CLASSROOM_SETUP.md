# Online Classroom Setup Guide

## Overview
This guide will help you set up the fully functional online classroom feature with webcam and microphone support for your College ERP system.

## Features Implemented
- ✅ **Teacher Dashboard**: Start and manage online classes
- ✅ **Student Portal**: Join live classes and view schedules  
- ✅ **Video Conferencing**: WebRTC-based peer-to-peer video calls
- ✅ **Audio Support**: Microphone control and audio streaming
- ✅ **Screen Sharing**: Teachers can share their screen
- ✅ **Real-time Controls**: Toggle camera/mic, participant count
- ✅ **Live Class Management**: Start, join, and end classes
- ✅ **User Authentication**: Role-based access (Teacher/Student)

## Architecture
```
Frontend (Next.js + React)
├── OnlineClassroom.js - Main classroom component
├── TeacherClassroom.js - Teacher interface
├── StudentClassroom.js - Student interface  
├── VideoGrid.js - Video layout management
├── ClassroomControls.js - Media controls
└── WebRTC utilities - Peer connections

Backend (Socket.IO Server)
├── Real-time signaling
├── Room management
└── User presence tracking
```

## Setup Instructions

### 1. Install Dependencies
The required packages are already installed:
- `socket.io-client` - Real-time communication
- `simple-peer` - WebRTC peer connections

### 2. Start the Socket.IO Server
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Start the server
npm start
```
The server will run on `http://localhost:3001`

### 3. Start the Next.js Application
```bash
# In the main project directory
npm run dev
```
The app will run on `http://localhost:3000`

### 4. Access the Online Classroom

#### For Administrators:
1. Login as admin (`admin` / `admin123`)
2. Go to the Admin Dashboard
3. Find the "Online Classroom Management" section
4. Click "Open Teacher Portal" or "Open Student Portal"

#### For Teachers:
1. Login as teacher (`rajesh.kumar` / `teacher123`)
2. Access the Teacher Dashboard directly
3. Click "Start Class" to begin a live session
4. Configure class details and start streaming

#### For Students:
1. Login as student (`21CSE001` / `student123`)
2. Access the Student Portal directly
3. Join available live classes
4. View class schedules and participate

## How to Use

### Starting a Class (Teacher)
1. Click "Start Class" button
2. Fill in class details:
   - Class Title
   - Select Class/Subject
   - Description (optional)
   - Duration
3. Click "Start Class"
4. Allow camera/microphone permissions
5. Students can now join your class

### Joining a Class (Student)
1. Look for "Live Classes" section
2. Click "Join" on any active class
3. Confirm joining in the dialog
4. Allow camera/microphone permissions
5. You're now in the classroom!

### Classroom Controls
- **Camera Toggle**: Turn video on/off
- **Microphone Toggle**: Mute/unmute audio
- **Screen Share**: Share your screen (teachers)
- **Leave Class**: Exit the classroom
- **Participant Count**: See who's online

## Technical Details

### WebRTC Configuration
- Uses Google STUN servers for NAT traversal
- Peer-to-peer connections for low latency
- Automatic fallback for connection issues

### Socket.IO Events
- `join-classroom` - User joins a class
- `user-joined` - New participant notification
- `user-left` - Participant left notification
- `signal` - WebRTC signaling data
- `media-state-changed` - Camera/mic status updates

### Browser Requirements
- Modern browsers with WebRTC support
- Camera and microphone permissions
- Secure context (HTTPS in production)

## Production Deployment

### 1. HTTPS Required
WebRTC requires HTTPS in production. Configure SSL certificates for both frontend and backend.

### 2. TURN Server (Optional)
For users behind restrictive firewalls, consider adding TURN servers:
```javascript
config: {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { 
      urls: 'turn:your-turn-server.com:3478',
      username: 'username',
      credential: 'password'
    }
  ]
}
```

### 3. Scaling Considerations
- Use Redis for Socket.IO clustering
- Implement room size limits
- Add bandwidth optimization
- Consider using a media server for large classes

## Troubleshooting

### Common Issues

**Camera/Microphone Not Working**
- Check browser permissions
- Ensure HTTPS in production
- Verify device availability

**Connection Issues**
- Check firewall settings
- Verify STUN/TURN server accessibility
- Test with different networks

**Audio Echo**
- Ensure proper audio routing
- Use headphones
- Check microphone sensitivity

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'socket.io-client:socket');
```

## Future Enhancements

### Planned Features
- 📝 **Chat System**: Text messaging during classes
- 📊 **Recording**: Save class sessions
- 📋 **Whiteboard**: Interactive drawing board
- 👥 **Breakout Rooms**: Small group discussions
- 📈 **Analytics**: Attendance and engagement metrics
- 🔔 **Notifications**: Class reminders and alerts

### Advanced Features
- AI-powered transcription
- Virtual backgrounds
- Hand raising system
- Quiz integration
- File sharing
- Mobile app support

## Support
For technical support or feature requests, please refer to the project documentation or contact the development team.

---

**Note**: This is a basic implementation focused on core video conferencing functionality. Additional features can be added based on specific requirements.