import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Alert,
  Paper,
  FormHelperText
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Today as TodayIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import TeacherClassroom from './TeacherClassroom';
import { getData, saveData } from '../utils/data';

const TeacherView = ({ user, data, setData, setSnackbar }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [gradeData, setGradeData] = useState({});
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [showOnlineClassroom, setShowOnlineClassroom] = useState(false);

  // Get current teacher data (moved before useEffect)
  const currentTeacher = data?.teachers?.find(t => t.id === user.teacherId);

  // Get teacher's assigned classes (moved before useEffect)
  const teacherClasses = data?.classes?.filter(cls => currentTeacher?.classes?.includes(cls.id)) || [];

  // Get students for selected class (moved before useEffect)
  const getStudentsForClass = (classId) => {
    return data?.students?.filter(student => student.classId === classId) || [];
  };

  // Get teacher's lectures for selected date and class
  const getTeacherLecturesForDate = () => {
    if (!selectedDate || !selectedClass || !data?.timetable) {
      return [];
    }

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const classId = parseInt(selectedClass);
    const classSchedule = data.timetable.classSchedules[classId];
    const timeSlots = data.timetable.timeSlots;

    // Check if it's a weekend
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
      return [];
    }

    if (!classSchedule || !classSchedule[dayOfWeek]) {
      return [];
    }

    // Filter lectures for current teacher only
    const teacherLectures = classSchedule[dayOfWeek].filter(lecture =>
      lecture.teacherId === currentTeacher?.id
    );

    // Add time information to lectures
    return teacherLectures.map(lecture => ({
      ...lecture,
      time: timeSlots.find(slot => slot.id === lecture.period)?.time || 'Unknown'
    }));
  };

  // Load existing attendance data (moved before useEffect)
  const loadExistingAttendance = () => {
    if (!data) return;

    const currentData = getData();
    const dateAttendance = currentData.attendance[selectedDate];

    if (dateAttendance && dateAttendance[selectedClass] && dateAttendance[selectedClass][selectedLecture]) {
      const existingRecord = dateAttendance[selectedClass][selectedLecture];
      setExistingAttendance(existingRecord);

      // Pre-populate attendance data based on existing records
      const students = getStudentsForClass(parseInt(selectedClass));
      const newAttendanceData = {};

      students.forEach(student => {
        newAttendanceData[student.id] = existingRecord.presentStudents.includes(student.id);
      });

      setAttendanceData(newAttendanceData);
    } else {
      setExistingAttendance(null);
      setAttendanceData({});
    }
  };

  // Load existing attendance when date, class, or lecture changes
  useEffect(() => {
    if (selectedDate && selectedClass && selectedLecture && data) {
      loadExistingAttendance();
    }
  }, [selectedDate, selectedClass, selectedLecture, data]);

  // Early returns after all hooks
  if (!data) return <Typography>Loading...</Typography>;
  if (!currentTeacher) return <Typography>Teacher data not found</Typography>;

  // Handle attendance marking
  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  // Get attendance statistics
  const getAttendanceStats = () => {
    const totalStudents = getStudentsForClass(parseInt(selectedClass)).length;
    const presentCount = Object.values(attendanceData).filter(Boolean).length;
    const absentCount = totalStudents - presentCount;
    const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return { totalStudents, presentCount, absentCount, percentage };
  };

  // Save attendance data
  const saveAttendance = async () => {
    if (!selectedClass || !selectedLecture || !selectedDate) {
      setSnackbar({ open: true, message: 'Please select date, class and lecture', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const presentStudents = Object.entries(attendanceData)
        .filter(([_, isPresent]) => isPresent)
        .map(([studentId, _]) => parseInt(studentId));

      const currentData = getData();
      if (!currentData.attendance[selectedDate]) {
        currentData.attendance[selectedDate] = {};
      }
      if (!currentData.attendance[selectedDate][selectedClass]) {
        currentData.attendance[selectedDate][selectedClass] = {};
      }

      // Get the lecture details from timetable
      const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
      const classSchedule = data.timetable?.classSchedules[selectedClass];
      const lectureDetails = classSchedule?.[dayOfWeek]?.find(l => l.period === parseInt(selectedLecture));

      currentData.attendance[selectedDate][selectedClass][selectedLecture] = {
        teacherId: user.teacherId,
        lectureNumber: parseInt(selectedLecture),
        subject: lectureDetails?.subject || currentTeacher.subject,
        room: lectureDetails?.room || 'Unknown',
        presentStudents: presentStudents,
        markedAt: new Date().toISOString(),
        markedBy: currentTeacher.name
      };

      if (saveData(currentData)) {
        setData(currentData);
        const stats = getAttendanceStats();
        const isUpdate = existingAttendance !== null;
        setSnackbar({
          open: true,
          message: `Attendance ${isUpdate ? 'updated' : 'saved'} successfully! ${stats.presentCount}/${stats.totalStudents} students present (${stats.percentage}%)`,
          severity: 'success'
        });
        setExistingAttendance(currentData.attendance[selectedDate][selectedClass][selectedLecture]);
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

  // Handle online classroom
  const handleBackFromClassroom = () => {
    setShowOnlineClassroom(false);
  };

  // Show online classroom if requested
  if (showOnlineClassroom) {
    return (
      <TeacherClassroom
        teacher={{
          id: currentTeacher.id,
          name: currentTeacher.name,
          subject: currentTeacher.subject
        }}
        classes={teacherClasses}
        students={data.students}
        onBack={handleBackFromClassroom}
      />
    );
  }

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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant={activeTab === 'classes' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('classes')}
            startIcon={<ClassIcon />}
          >
            My Classes
          </Button>
          <Button
            variant={activeTab === 'attendance' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('attendance')}
            startIcon={<TodayIcon />}
          >
            Mark Attendance
          </Button>
          <Button
            variant={activeTab === 'grades' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('grades')}
            startIcon={<PersonIcon />}
          >
            Enter Grades
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowOnlineClassroom(true)}
            startIcon={<VideoCallIcon />}
            sx={{ ml: 'auto' }}
          >
            Online Classroom
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

      {/* Enhanced Attendance Marking */}
      {activeTab === 'attendance' && (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Mark Attendance"
              avatar={<TodayIcon />}
              subheader="Select date, class, and lecture to mark or update attendance"
            />
            <CardContent>
              {/* Selection Controls */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Select Date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setAttendanceData({});
                        setExistingAttendance(null);
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <TodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                      }}
                      helperText={selectedDate === new Date().toISOString().split('T')[0] ? "Today's date" : "Past/Future date"}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Select Class</InputLabel>
                      <Select
                        value={selectedClass}
                        label="Select Class"
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setAttendanceData({});
                          setExistingAttendance(null);
                        }}
                        startAdornment={<ClassIcon sx={{ mr: 1, color: 'primary.main' }} />}
                      >
                        {teacherClasses.map(cls => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                        startAdornment={<ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />}
                      >
                        {getTeacherLecturesForDate().length > 0 ? (
                          getTeacherLecturesForDate().map(lecture => (
                            <MenuItem key={lecture.period} value={lecture.period}>
                              Period {lecture.period} ({lecture.time}) - {lecture.subject}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            {!selectedClass ? 'Select a class first' :
                              new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6 ? 'No classes on weekends' :
                                'No lectures scheduled for this day'}
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>
                        {selectedDate && selectedClass ?
                          `${getTeacherLecturesForDate().length} period(s) available for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}` :
                          'Select date and class to see available periods'
                        }
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              {/* Attendance Status Alert */}
              {selectedClass && selectedLecture && selectedDate && (
                <Alert
                  severity={existingAttendance ? "info" : "success"}
                  sx={{ mb: 3 }}
                  icon={existingAttendance ? <CheckCircleIcon /> : <TodayIcon />}
                >
                  {existingAttendance ? (
                    <Box>
                      <Typography variant="body2">
                        <strong>Attendance already marked</strong> for {teacherClasses.find(c => c.id == selectedClass)?.name} -
                        Lecture {selectedLecture} on {new Date(selectedDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(existingAttendance.markedAt).toLocaleString()} by {existingAttendance.markedBy}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2">
                      <strong>New attendance record</strong> for {teacherClasses.find(c => c.id == selectedClass)?.name} -
                      Lecture {selectedLecture} on {new Date(selectedDate).toLocaleDateString()}
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Student Attendance List */}
              {selectedClass && selectedLecture && selectedDate && (
                <>
                  {/* Attendance Statistics */}
                  {Object.keys(attendanceData).length > 0 && (
                    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="white">
                              {getAttendanceStats().presentCount}
                            </Typography>
                            <Typography variant="caption" color="white">Present</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="white">
                              {getAttendanceStats().absentCount}
                            </Typography>
                            <Typography variant="caption" color="white">Absent</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="white">
                              {getAttendanceStats().totalStudents}
                            </Typography>
                            <Typography variant="caption" color="white">Total</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="white">
                              {getAttendanceStats().percentage}%
                            </Typography>
                            <Typography variant="caption" color="white">Attendance</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}

                  {/* Student List */}
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Student Roster - {teacherClasses.find(c => c.id == selectedClass)?.name}
                  </Typography>

                  <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
                    {getStudentsForClass(parseInt(selectedClass)).map((student, index) => (
                      <React.Fragment key={student.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: attendanceData[student.id] ? 'success.main' : 'grey.400' }}>
                              {attendanceData[student.id] ? <CheckCircleIcon /> : <CancelIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight="medium">
                                  {student.name}
                                </Typography>
                                <Chip
                                  label={student.admissionNumber}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Status:
                                </Typography>
                                <Chip
                                  label={attendanceData[student.id] ? "Present" : "Absent"}
                                  size="small"
                                  color={attendanceData[student.id] ? "success" : "error"}
                                  variant="filled"
                                />
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              checked={attendanceData[student.id] || false}
                              onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                              color="success"
                              size="medium"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < getStudentsForClass(parseInt(selectedClass)).length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const students = getStudentsForClass(parseInt(selectedClass));
                        const allPresentData = {};
                        students.forEach(student => {
                          allPresentData[student.id] = true;
                        });
                        setAttendanceData(allPresentData);
                      }}
                      startIcon={<CheckCircleIcon />}
                    >
                      Mark All Present
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        const students = getStudentsForClass(parseInt(selectedClass));
                        const allAbsentData = {};
                        students.forEach(student => {
                          allAbsentData[student.id] = false;
                        });
                        setAttendanceData(allAbsentData);
                      }}
                      startIcon={<CancelIcon />}
                    >
                      Mark All Absent
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={saveAttendance}
                      disabled={Object.keys(attendanceData).length === 0 || loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? 'Saving...' : existingAttendance ? 'Update Attendance' : 'Save Attendance'}
                    </Button>
                  </Box>
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