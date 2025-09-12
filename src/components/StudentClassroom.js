import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  Person,
  PlayArrow,
  AccessTime,
  School
} from '@mui/icons-material';
import OnlineClassroom from './OnlineClassroom';
import AIChatbot from './AIChatbot';

const StudentClassroom = ({ student, availableClasses = [], teachers = [], onBack, data }) => {
  const [activeClass, setActiveClass] = useState(null);
  const [liveClasses, setLiveClasses] = useState([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);

  // Get student's subjects based on their timetable
  useEffect(() => {
    if (data?.timetable && student.classId) {
      const classSchedule = data.timetable.classSchedules[student.classId];
      const subjects = new Set();
      
      if (classSchedule) {
        // Get all subjects from the student's weekly schedule
        Object.values(classSchedule).forEach(daySchedule => {
          if (Array.isArray(daySchedule)) {
            daySchedule.forEach(lecture => {
              if (lecture.subject) {
                subjects.add(lecture.subject);
              }
            });
          }
        });
      }
      
      setStudentSubjects(Array.from(subjects));
    }
  }, [data?.timetable, student.classId]);

  // Get live classes that are relevant to this student
  useEffect(() => {
    // In a real application, this would come from a WebSocket or API
    // For now, we'll create realistic live classes based on the student's subjects and teachers
    const generateLiveClasses = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      // Only show classes during school hours (9 AM to 5 PM)
      if (currentHour < 9 || currentHour >= 17) {
        return [];
      }

      const relevantTeachers = teachers.filter(teacher => 
        teacher.classes && teacher.classes.includes(student.classId) &&
        studentSubjects.includes(teacher.subject)
      );

      const liveClassesData = [];

      // Generate live classes for teachers who teach this student
      relevantTeachers.forEach((teacher, index) => {
        // Simulate some teachers having started classes
        const hasStartedClass = Math.random() > 0.6; // 40% chance of having a live class
        
        if (hasStartedClass) {
          const startMinutesAgo = Math.floor(Math.random() * 30) + 5; // Started 5-35 minutes ago
          const participants = Math.floor(Math.random() * 20) + 8; // 8-28 participants
          const duration = [45, 60, 90][Math.floor(Math.random() * 3)]; // 45, 60, or 90 minutes
          
          liveClassesData.push({
            id: `live_${teacher.id}_${Date.now()}`,
            title: `${teacher.subject} - Live Session`,
            subject: teacher.subject,
            teacherId: teacher.id,
            teacherName: teacher.name,
            classId: student.classId,
            startTime: new Date(Date.now() - startMinutesAgo * 60 * 1000),
            participants: participants,
            duration: duration,
            room: `Room ${Math.floor(Math.random() * 20) + 101}` // Random room number
          });
        }
      });

      return liveClassesData;
    };

    const liveClassesData = generateLiveClasses();
    setLiveClasses(liveClassesData);

    // Update live classes every 30 seconds
    const interval = setInterval(() => {
      const updatedLiveClasses = generateLiveClasses();
      setLiveClasses(updatedLiveClasses);
    }, 30000);

    return () => clearInterval(interval);
  }, [student.classId, teachers, studentSubjects]);

  const handleJoinClass = (classData) => {
    setSelectedClass(classData);
    setShowJoinDialog(true);
  };

  const confirmJoinClass = () => {
    setActiveClass(selectedClass);
    setShowJoinDialog(false);
  };

  const handleLeaveClass = () => {
    setActiveClass(null);
  };

  const handleBackToStudentView = () => {
    if (onBack) {
      onBack();
    }
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
  };

  const getClassDuration = (startTime) => {
    const now = new Date();
    const diff = Math.floor((now - startTime) / (1000 * 60));
    return diff;
  };

  if (activeClass) {
    return (
      <OnlineClassroom
        classId={activeClass.id}
        user={{
          id: student.id,
          name: student.name,
          role: 'student'
        }}
        onLeave={handleLeaveClass}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Online Classroom - Student Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, {student.name}. Join your live classes or view upcoming sessions.
          </Typography>
        </Box>
        {onBack && (
          <Button
            variant="outlined"
            onClick={handleBackToStudentView}
            sx={{ minWidth: 120 }}
          >
            Back to Dashboard
          </Button>
        )}
      </Box>

      {/* Student Info Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Student Info</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Name: {student.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Admission No: {student.admissionNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Class: {availableClasses.find(c => c.id === student.classId)?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {student.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoCall sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Live Classes</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {liveClasses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes happening now
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Today's Schedule</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Check your timetable for upcoming classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Live Classes */}
      {liveClasses.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VideoCall sx={{ mr: 1, color: 'success.main' }} />
            Live Classes for Your Subjects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing only classes for subjects you are enrolled in: {studentSubjects.join(', ')}
          </Typography>
          <Grid container spacing={2}>
            {liveClasses.map((classData) => (
              <Grid item xs={12} md={6} key={classData.id}>
                <Card sx={{ border: '2px solid', borderColor: 'success.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{classData.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {classData.teacherName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label="LIVE" 
                            color="success" 
                            size="small" 
                            sx={{ animation: 'pulse 2s infinite' }}
                          />
                          <Chip 
                            label={classData.subject} 
                            color="primary" 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<PlayArrow />}
                        onClick={() => handleJoinClass(classData)}
                      >
                        Join
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        Started {getClassDuration(classData.startTime)} minutes ago
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {classData.participants} students joined
                      </Typography>
                    </Box>
                    
                    {classData.room && (
                      <Typography variant="body2" color="text.secondary">
                        {classData.room} • Duration: {classData.duration} minutes
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Alert severity="info">
            No live classes at the moment for your subjects ({studentSubjects.length > 0 ? studentSubjects.join(', ') : 'Loading subjects...'}).
            {studentSubjects.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Your teachers will appear here when they start live sessions during school hours (9 AM - 5 PM).
              </Typography>
            )}
          </Alert>
        </Box>
      )}

      {/* Your Subjects */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Schedule sx={{ mr: 1, color: 'primary.main' }} />
          Your Subjects & Teachers
        </Typography>
        <Grid container spacing={2}>
          {studentSubjects.map((subject) => {
            const teacher = teachers.find(t => t.subject === subject && t.classes?.includes(student.classId));
            const studentClass = availableClasses.find(c => c.id === student.classId);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={subject}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <School sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">{subject}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Teacher: {teacher ? teacher.name : 'Not assigned'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Class: {studentClass?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {teacher ? 'Available for online classes' : 'Teacher not available'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          
          {studentSubjects.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">
                No subjects found in your timetable. Please contact the administration to ensure your class schedule is properly configured.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Join Class Confirmation Dialog */}
      <Dialog 
        open={showJoinDialog} 
        onClose={() => setShowJoinDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Join Live Class</DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedClass.title}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Teacher" 
                    secondary={selectedClass.teacherName} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duration" 
                    secondary={`${getClassDuration(selectedClass.startTime)} minutes elapsed`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VideoCall />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Participants" 
                    secondary={`${selectedClass.participants} students joined`} 
                  />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Alert severity="info">
                Make sure your camera and microphone are working properly before joining the class.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmJoinClass}
            variant="contained"
            startIcon={<PlayArrow />}
          >
            Join Class
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* AI Chatbot */}
      <AIChatbot 
        user={{
          id: student.id,
          name: student.name,
          role: 'student'
        }} 
        currentPage="student-classroom" 
      />
    </Box>
  );
};

export default StudentClassroom;