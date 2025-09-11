import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { getData, saveData } from '../utils/data';

const TeacherView = ({ user, data, setData, setSnackbar }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [gradeData, setGradeData] = useState({});
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(false);

  if (!data) return <Typography>Loading...</Typography>;

  // Get current teacher data
  const currentTeacher = data.teachers.find(t => t.id === user.teacherId);
  if (!currentTeacher) return <Typography>Teacher data not found</Typography>;

  // Get teacher's assigned classes
  const teacherClasses = data.classes.filter(cls => currentTeacher.classes.includes(cls.id));

  // Get students for selected class
  const getStudentsForClass = (classId) => {
    return data.students.filter(student => student.classId === classId);
  };

  // Handle attendance marking
  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  // Save attendance data
  const saveAttendance = async () => {
    if (!selectedClass || !selectedLecture) {
      setSnackbar({ open: true, message: 'Please select class and lecture', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const presentStudents = Object.entries(attendanceData)
        .filter(([_, isPresent]) => isPresent)
        .map(([studentId, _]) => parseInt(studentId));

      const currentData = getData();
      if (!currentData.attendance[today]) {
        currentData.attendance[today] = {};
      }
      if (!currentData.attendance[today][selectedClass]) {
        currentData.attendance[today][selectedClass] = {};
      }

      currentData.attendance[today][selectedClass][selectedLecture] = {
        teacherId: user.teacherId,
        lectureNumber: parseInt(selectedLecture),
        presentStudents: presentStudents
      };

      if (saveData(currentData)) {
        setData(currentData);
        setSnackbar({ open: true, message: 'Attendance saved successfully', severity: 'success' });
        setAttendanceData({});
      } else {
        throw new Error('Failed to save attendance data');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setSnackbar({ open: true, message: 'Error saving attendance. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle grade entry
  const handleGradeChange = (studentId, grade) => {
    setGradeData(prev => ({
      ...prev,
      [studentId]: grade
    }));
  };

  // Save grades
  const saveGrades = async () => {
    setLoading(true);
    try {
      const currentData = getData();
      
      Object.entries(gradeData).forEach(([studentId, grade]) => {
        if (grade && grade >= 0 && grade <= 100) {
          if (!currentData.grades[studentId]) {
            currentData.grades[studentId] = {};
          }
          currentData.grades[studentId][currentTeacher.subject] = parseFloat(grade);
        }
      });

      if (saveData(currentData)) {
        setData(currentData);
        setSnackbar({ open: true, message: 'Grades saved successfully', severity: 'success' });
        setGradeData({});
      } else {
        throw new Error('Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      setSnackbar({ open: true, message: 'Error saving grades', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Teacher Info Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title={`Welcome, ${currentTeacher.name}`}
            subheader={`Subject: ${currentTeacher.subject}`}
          />
          <CardContent>
            <Typography variant="body1">
              You are assigned to {teacherClasses.length} classes: {teacherClasses.map(cls => cls.name).join(', ')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Navigation Tabs */}
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Button 
            variant={activeTab === 'classes' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('classes')}
            sx={{ mr: 1 }}
          >
            My Classes
          </Button>
          <Button 
            variant={activeTab === 'attendance' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('attendance')}
            sx={{ mr: 1 }}
          >
            Mark Attendance
          </Button>
          <Button 
            variant={activeTab === 'grades' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('grades')}
          >
            Enter Grades
          </Button>
        </Box>
      </Grid>

      {/* Classes Overview */}
      {activeTab === 'classes' && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Class Overview" />
            <CardContent>
              {teacherClasses.map(cls => {
                const students = getStudentsForClass(cls.id);
                return (
                  <Box key={cls.id} sx={{ mb: 3, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                    <Typography variant="h6">{cls.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students: {students.length} | Total Lectures: {cls.totalLectures}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Students: {students.map(s => s.name).join(', ')}
                    </Typography>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Attendance Marking */}
      {activeTab === 'attendance' && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Mark Attendance" />
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      value={selectedClass}
                      label="Select Class"
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setAttendanceData({});
                      }}
                    >
                      {teacherClasses.map(cls => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Lecture</InputLabel>
                    <Select
                      value={selectedLecture}
                      label="Select Lecture"
                      onChange={(e) => {
                        setSelectedLecture(e.target.value);
                        setAttendanceData({});
                      }}
                      disabled={!selectedClass}
                    >
                      {Array.from({ length: 7 }, (_, i) => i + 1).map(lectureNum => (
                        <MenuItem key={lectureNum} value={lectureNum}>
                          Lecture {lectureNum}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {selectedClass && selectedLecture && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Student Roster - {teacherClasses.find(c => c.id == selectedClass)?.name} - Lecture {selectedLecture}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {getStudentsForClass(parseInt(selectedClass)).map(student => (
                      <Box key={student.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={attendanceData[student.id] || false}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <label htmlFor={`student-${student.id}`} style={{ cursor: 'pointer' }}>
                          {student.name} ({student.admissionNumber})
                        </label>
                      </Box>
                    ))}
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={saveAttendance}
                    disabled={Object.keys(attendanceData).length === 0 || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Saving...' : 'Save Attendance'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Grade Entry */}
      {activeTab === 'grades' && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title={`Enter Grades - ${currentTeacher.subject}`} />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter grades (0-100) for your subject across all assigned classes
              </Typography>
              
              {teacherClasses.map(cls => {
                const students = getStudentsForClass(cls.id);
                return (
                  <Box key={cls.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{cls.name}</Typography>
                    <Grid container spacing={2}>
                      {students.map(student => {
                        const currentGrade = data.grades[student.id]?.[currentTeacher.subject] || '';
                        return (
                          <Grid item xs={12} md={6} key={student.id}>
                            <TextField
                              fullWidth
                              label={`${student.name} (${student.admissionNumber})`}
                              type="number"
                              inputProps={{ min: 0, max: 100 }}
                              value={gradeData[student.id] || currentGrade}
                              onChange={(e) => handleGradeChange(student.id, e.target.value)}
                              helperText={currentGrade ? `Current: ${currentGrade}` : 'No grade entered'}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                );
              })}
              
              <Button 
                variant="contained" 
                onClick={saveGrades}
                disabled={Object.keys(gradeData).length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Grades'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default TeacherView;