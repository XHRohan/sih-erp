import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  People,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import OnlineClassroom from './OnlineClassroom';
import AIChatbot from './AIChatbot';

const TeacherClassroom = ({ teacher, classes = [], students = [], onBack }) => {
  const [activeClass, setActiveClass] = useState(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    subject: '',
    classId: '',
    description: '',
    duration: 60
  });
  const [ongoingClasses, setOngoingClasses] = useState([]);

  const handleStartClass = () => {
    if (!newClass.title || !newClass.classId) {
      return;
    }

    const classData = {
      id: `class_${Date.now()}`,
      ...newClass,
      teacherId: teacher.id,
      teacherName: teacher.name,
      startTime: new Date(),
      participants: []
    };

    setOngoingClasses(prev => [...prev, classData]);
    setActiveClass(classData);
    setShowStartDialog(false);
    setNewClass({
      title: '',
      subject: '',
      classId: '',
      description: '',
      duration: 60
    });
  };

  const handleJoinClass = (classData) => {
    setActiveClass(classData);
  };

  const handleLeaveClass = () => {
    setActiveClass(null);
  };

  const handleBackToTeacherView = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleEndClass = (classId) => {
    setOngoingClasses(prev => prev.filter(c => c.id !== classId));
    if (activeClass?.id === classId) {
      setActiveClass(null);
    }
  };

  const getStudentsInClass = (classId) => {
    return students.filter(student => student.classId === classId);
  };

  if (activeClass) {
    return (
      <OnlineClassroom
        classId={activeClass.id}
        user={{
          id: teacher.id,
          name: teacher.name,
          role: 'teacher'
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
            Online Classroom - Teacher Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, {teacher.name}. Start or manage your online classes.
          </Typography>
        </Box>
        {onBack && (
          <Button
            variant="outlined"
            onClick={handleBackToTeacherView}
            sx={{ minWidth: 120 }}
          >
            Back to Dashboard
          </Button>
        )}
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoCall sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Start New Class</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Begin a live online session with your students
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setShowStartDialog(true)}
                fullWidth
              >
                Start Class
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Class Statistics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Classes: {classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Students: {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Sessions: {ongoingClasses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ongoing Classes */}
      {ongoingClasses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ongoing Classes
          </Typography>
          <Grid container spacing={2}>
            {ongoingClasses.map((classData) => (
              <Grid item xs={12} md={6} key={classData.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{classData.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {classData.subject}
                        </Typography>
                        <Chip 
                          label="Live" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleJoinClass(classData)}
                        >
                          Join
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Stop />}
                          onClick={() => handleEndClass(classData.id)}
                        >
                          End
                        </Button>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Started: {classData.startTime.toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Participants: {classData.participants.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Available Classes */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Classes
        </Typography>
        <Grid container spacing={2}>
          {classes.map((classItem) => {
            const studentsInClass = getStudentsInClass(classItem.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={classItem.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {classItem.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <People sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {studentsInClass.length} students
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Total Lectures: {classItem.totalLectures || 0}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setNewClass(prev => ({
                          ...prev,
                          classId: classItem.id,
                          subject: classItem.name
                        }));
                        setShowStartDialog(true);
                      }}
                    >
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Start Class Dialog */}
      <Dialog 
        open={showStartDialog} 
        onClose={() => setShowStartDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Start New Online Class</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Class Title"
              value={newClass.title}
              onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2 }}
              required
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={newClass.classId}
                onChange={(e) => {
                  const selectedClass = classes.find(c => c.id === e.target.value);
                  setNewClass(prev => ({ 
                    ...prev, 
                    classId: e.target.value,
                    subject: selectedClass?.name || ''
                  }));
                }}
                required
              >
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Subject/Topic"
              value={newClass.subject}
              onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              multiline
              rows={3}
              value={newClass.description}
              onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={newClass.duration}
              onChange={(e) => setNewClass(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              inputProps={{ min: 15, max: 180 }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              Students will be notified when you start the class. Make sure your camera and microphone are working properly.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartClass}
            variant="contained"
            disabled={!newClass.title || !newClass.classId}
          >
            Start Class
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Chatbot */}
      <AIChatbot 
        user={{
          id: teacher.id,
          name: teacher.name,
          role: 'teacher'
        }} 
        currentPage="teacher-classroom" 
      />
    </Box>
  );
};

export default TeacherClassroom;