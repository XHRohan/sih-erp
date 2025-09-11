import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import {
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { getData, addRecord, updateRecord } from '../utils/data';
import AdminView from './AdminView';
import TeacherView from './TeacherView';
import StudentView from './StudentView';
import AlumniView from './AlumniView';

const Dashboard = ({ user, onLogout }) => {
  const [data, setData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const currentData = getData();
    if (currentData) {
      setData(currentData);
    }
  }, []);

  // Add effect to refresh data when user changes (for testing)
  useEffect(() => {
    const currentData = getData();
    if (currentData) {
      setData(currentData);
    }
  }, [user.id]);



  // Helper functions for admin operations
  const handleOpenDialog = (type, initialData = {}) => {
    setDialogType(type);
    setFormData(initialData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  // Confirmation dialog helper
  const showConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
  };

  // Enhanced logout with confirmation
  const handleLogoutClick = () => {
    showConfirmDialog(
      'Confirm Logout',
      'Are you sure you want to logout? Any unsaved changes will be lost.',
      () => {
        onLogout();
        handleConfirmClose();
      }
    );
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const currentData = getData();
      let success = false;
      let message = '';

      switch (dialogType) {
        case 'teacher':
          const teacherId = currentData.teachers.length + 1;
          const newTeacher = {
            id: teacherId,
            name: formData.name,
            subject: formData.subject,
            classes: formData.classes || []
          };
          
          // Create teacher record
          let teacherResult = addRecord('teachers', newTeacher);
          
          if (teacherResult) {
            // Create user account for the teacher
            const newTeacherUser = {
              id: `teacher${teacherId}`,
              username: formData.username,
              password: formData.password,
              role: 'teacher',
              name: formData.name,
              email: formData.email,
              teacherId: teacherId
            };
            
            const userResult = addRecord('users', newTeacherUser);
            if (userResult) {
              setData(userResult);
              success = true;
              message = 'Teacher and login account created successfully';
            } else {
              success = false;
              message = 'Teacher created but failed to create login account';
            }
          }
          break;
        case 'student':
          const studentId = currentData.students.length + 1;
          const newStudent = {
            id: studentId,
            name: formData.name,
            dob: formData.dob,
            admissionNumber: formData.admissionNumber,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            classId: parseInt(formData.classId),
            totalFees: 120000, // Default fee amount
            feesPaid: 0,
            feesRemaining: 120000
          };
          
          // Create student record
          let studentResult = addRecord('students', newStudent);
          
          if (studentResult) {
            // Create user account for the student
            const newStudentUser = {
              id: `student${studentId}`,
              username: formData.username,
              password: formData.password,
              role: 'student',
              name: formData.name,
              email: formData.email,
              studentId: studentId
            };
            
            const userResult = addRecord('users', newStudentUser);
            if (userResult) {
              setData(userResult);
              success = true;
              message = 'Student and login account created successfully';
            } else {
              success = false;
              message = 'Student created but failed to create login account';
            }
          }
          break;
        case 'class':
          const newClass = {
            id: currentData.classes.length + 1,
            name: formData.name,
            totalLectures: 7
          };
          const classResult = addRecord('classes', newClass);
          if (classResult) {
            setData(classResult);
            success = true;
            message = 'Class added successfully';
          }
          break;
        case 'notice':
          const newNotice = {
            id: currentData.notices.length + 1,
            date: formData.date,
            message: formData.message,
            author: user.name
          };
          console.log('Adding notice:', newNotice);
          const noticeResult = addRecord('notices', newNotice);
          console.log('Notice result:', noticeResult?.notices?.length, 'notices total');
          if (noticeResult) {
            setData(noticeResult);
            success = true;
            message = 'Notice posted successfully';
          }
          break;

      }

      setSnackbar({ open: true, message, severity: success ? 'success' : 'error' });
      if (success) {
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'Error occurred while saving',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniAction = (alumniId, action) => {
    const actionText = action === 'approved' ? 'approve' : 'reject';
    showConfirmDialog(
      `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      `Are you sure you want to ${actionText} this alumni request?`,
      () => {
        setLoading(true);
        try {
          const updatedData = updateRecord('alumni', alumniId, { status: action });
          if (updatedData) {
            setData(updatedData);
            setSnackbar({
              open: true,
              message: `Alumni request ${action}d successfully`,
              severity: 'success'
            });
          } else {
            throw new Error('Failed to update alumni status');
          }
        } catch (error) {
          console.error('Error updating alumni status:', error);
          setSnackbar({
            open: true,
            message: 'Error updating alumni status. Please try again.',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
        handleConfirmClose();
      }
    );
  };

  // Content rendering for different views
  const renderContent = () => {
    if (user.role === 'admin') {
      return <AdminView data={data} handleOpenDialog={handleOpenDialog} handleAlumniAction={handleAlumniAction} />;
    }

    if (user.role === 'teacher') {
      return <TeacherView user={user} data={data} setData={setData} setSnackbar={setSnackbar} />;
    }

    if (user.role === 'student') {
      return <StudentView user={user} data={data} setData={setData} setSnackbar={setSnackbar} />;
    }

    if (user.role === 'alumni') {
      return <AlumniView user={user} data={data} setData={setData} setSnackbar={setSnackbar} />;
    }

    // Default content for other roles
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your dashboard content will appear here.
        </Typography>
      </Box>
    );
  };

  // Form dialog component
  const renderFormDialog = () => {
    const getDialogTitle = () => {
      switch (dialogType) {
        case 'teacher': return 'Add New Teacher';
        case 'student': return 'Add New Student';
        case 'class': return 'Add New Class';
        case 'notice': return 'Post New Notice';
        default: return 'Add New';
      }
    };

    const renderFormFields = () => {
      switch (dialogType) {
        case 'teacher':
          return (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Teacher Name"
                fullWidth
                variant="outlined"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                helperText="Teacher's email address"
              />
              <TextField
                margin="dense"
                label="Username"
                fullWidth
                variant="outlined"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                helperText="Login username (e.g., firstname.lastname)"
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                helperText="Login password (minimum 6 characters)"
              />
              <TextField
                margin="dense"
                label="Subject"
                fullWidth
                variant="outlined"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                helperText="e.g., Mathematics, Physics, Computer Science"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Assign Classes</InputLabel>
                <Select
                  multiple
                  value={formData.classes || []}
                  label="Assign Classes"
                  onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                  renderValue={(selected) => 
                    selected.map(classId => 
                      data?.classes.find(c => c.id === classId)?.name
                    ).join(', ')
                  }
                >
                  {data?.classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select one or more classes for this teacher</FormHelperText>
              </FormControl>
            </>
          );
        case 'student':
          return (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Student Name"
                fullWidth
                variant="outlined"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Admission Number"
                fullWidth
                variant="outlined"
                value={formData.admissionNumber || ''}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    admissionNumber: e.target.value,
                    username: e.target.value // Auto-set username as admission number
                  });
                }}
                required
                helperText="This will be used as the login username"
              />
              <TextField
                margin="dense"
                label="Username"
                fullWidth
                variant="outlined"
                value={formData.username || formData.admissionNumber || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                helperText="Login username (auto-filled from admission number)"
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                helperText="Login password (minimum 6 characters)"
              />
              <TextField
                margin="dense"
                label="Date of Birth"
                type="date"
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                variant="outlined"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.classId || ''}
                  label="Class"
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                >
                  {data?.classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select the class for this student</FormHelperText>
              </FormControl>
            </>
          );
        case 'class':
          return (
            <TextField
              autoFocus
              margin="dense"
              label="Class Name"
              fullWidth
              variant="outlined"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          );
        case 'notice':
          return (
            <>
              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Notice Message"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </>
          );

        default:
          return null;
      }
    };

    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (dialogType === 'notice' ? 'Post' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            College ERP - {user.name} ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogoutClick}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8 // Add margin top to account for fixed AppBar
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderContent()}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Form Dialog */}
      {renderFormDialog()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleConfirmClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;