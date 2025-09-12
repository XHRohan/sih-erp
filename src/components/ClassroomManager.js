import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Person,
  School
} from '@mui/icons-material';
import TeacherClassroom from './TeacherClassroom';
import StudentClassroom from './StudentClassroom';

const ClassroomManager = ({ 
  data, 
  onBack, 
  initialView = null, // 'teacher' or 'student'
  selectedUser = null 
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedTeacher, setSelectedTeacher] = useState(selectedUser?.role === 'teacher' ? selectedUser : null);
  const [selectedStudent, setSelectedStudent] = useState(selectedUser?.role === 'student' ? selectedUser : null);
  const [showUserSelection, setShowUserSelection] = useState(!initialView);

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setCurrentView('teacher');
    setShowUserSelection(false);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setCurrentView('student');
    setShowUserSelection(false);
  };

  const handleBackToSelection = () => {
    setCurrentView(null);
    setSelectedTeacher(null);
    setSelectedStudent(null);
    setShowUserSelection(true);
  };

  const handleBackToAdmin = () => {
    onBack();
  };

  if (showUserSelection) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={handleBackToAdmin}
              sx={{ mr: 2 }}
            >
              Back to Admin
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Select User for Online Classroom
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Choose a user to access the online classroom
          </Typography>

          {/* Teachers Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              Teachers
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              {data.teachers.map((teacher, index) => (
                <React.Fragment key={teacher.id}>
                  <ListItemButton onClick={() => handleTeacherSelect(teacher)}>
                    <ListItemText
                      primary={teacher.name}
                      secondary={`Subject: ${teacher.subject} | Classes: ${teacher.classes.length}`}
                    />
                  </ListItemButton>
                  {index < data.teachers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Students Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1 }} />
              Students
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider', maxHeight: 400, overflow: 'auto' }}>
              {data.students.map((student, index) => {
                const className = data.classes.find(c => c.id === student.classId)?.name || 'N/A';
                return (
                  <React.Fragment key={student.id}>
                    <ListItemButton onClick={() => handleStudentSelect(student)}>
                      <ListItemText
                        primary={student.name}
                        secondary={`Class: ${className} | Admission: ${student.admissionNumber}`}
                      />
                    </ListItemButton>
                    {index < data.students.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Box>
      </Box>
    );
  }

  if (currentView === 'teacher' && selectedTeacher) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={handleBackToSelection}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Teacher: {selectedTeacher.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TeacherClassroom
            teacher={selectedTeacher}
            classes={data.classes}
            students={data.students}
          />
        </Box>
      </Box>
    );
  }

  if (currentView === 'student' && selectedStudent) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={handleBackToSelection}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Student: {selectedStudent.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <StudentClassroom
            student={selectedStudent}
            availableClasses={data.classes}
            teachers={data.teachers}
          />
        </Box>
      </Box>
    );
  }

  return null;
};

export default ClassroomManager;