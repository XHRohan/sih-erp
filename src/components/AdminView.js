import React from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  VideoCall as VideoCallIcon,
  School as SchoolIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const AdminView = ({ data, handleOpenDialog, handleAlumniAction, onOpenTeacherClassroom, onOpenStudentClassroom, onDisciplineAction }) => {
  if (!data) return <Typography>Loading...</Typography>;

  // Handle discipline badge actions
  const handleAddDisciplineBadge = (student) => {
    handleOpenDialog('discipline', { 
      studentId: student.id, 
      studentName: student.name,
      action: 'add'
    });
  };

  const handleRemoveDisciplineBadge = (studentId) => {
    if (onDisciplineAction) {
      onDisciplineAction(studentId, 'remove');
    }
  };

  const teacherColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'subject', headerName: 'Subject', width: 250 },
    { 
      field: 'classes', 
      headerName: 'Classes', 
      width: 150,
      renderCell: (params) => params.value.length
    }
  ];

  const studentColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'admissionNumber', headerName: 'Admission No.', width: 130 },
    { field: 'email', headerName: 'Email', width: 180 },
    { 
      field: 'classId', 
      headerName: 'Class', 
      width: 100,
      renderCell: (params) => {
        const className = data.classes.find(c => c.id === params.value)?.name || 'N/A';
        return className;
      }
    },
    { 
      field: 'discipline', 
      headerName: 'Discipline', 
      width: 120,
      renderCell: (params) => {
        const disciplineBadge = data.disciplineBadges?.[params.row.id];
        return disciplineBadge?.hasBadDiscipline ? (
          <Chip 
            label="Bad Discipline" 
            color="error" 
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        ) : (
          <Chip 
            label="Good" 
            color="success" 
            size="small"
            variant="outlined"
          />
        );
      }
    },
    { 
      field: 'totalFees', 
      headerName: 'Total Fees', 
      width: 110,
      renderCell: (params) => `₹${params.value?.toLocaleString() || '0'}`
    },
    { 
      field: 'feesPaid', 
      headerName: 'Paid', 
      width: 100,
      renderCell: (params) => `₹${params.value?.toLocaleString() || '0'}`
    },
    { 
      field: 'feesRemaining', 
      headerName: 'Remaining', 
      width: 110,
      renderCell: (params) => (
        <Chip 
          label={`₹${params.value?.toLocaleString() || '0'}`}
          color={params.value === 0 ? 'success' : params.value > 50000 ? 'error' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Discipline Actions',
      width: 180,
      renderCell: (params) => {
        const disciplineBadge = data.disciplineBadges?.[params.row.id];
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {disciplineBadge?.hasBadDiscipline ? (
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={() => handleRemoveDisciplineBadge(params.row.id)}
              >
                Remove Badge
              </Button>
            ) : (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleAddDisciplineBadge(params.row)}
              >
                Add Badge
              </Button>
            )}
          </Box>
        );
      }
    }
  ];

  const classColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Class Name', width: 200 },
    { field: 'totalLectures', headerName: 'Total Lectures', width: 130 },
    { 
      field: 'studentCount', 
      headerName: 'Students', 
      width: 100,
      renderCell: (params) => {
        const count = data.students.filter(s => s.classId === params.row.id).length;
        return count;
      }
    }
  ];

  const alumniColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'gradYear', headerName: 'Graduation Year', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'approved' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.status === 'pending' ? (
          <Box>
            <IconButton 
              size="small" 
              color="success"
              onClick={() => handleAlumniAction(params.row.id, 'approved')}
            >
              <CheckIcon />
            </IconButton>
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleAlumniAction(params.row.id, 'rejected')}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : null
      )
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Teachers Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Teachers Management"
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('teacher')}
              >
                Add Teacher
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={data.teachers}
                columns={teacherColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Students Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Students Management"
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('student')}
              >
                Add Student
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={data.students}
                columns={studentColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Classes Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Classes Management"
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('class')}
              >
                Add Class
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={data.classes}
                columns={classColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Alumni Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Alumni Management" />
          <CardContent>
            <Box sx={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={data.alumni}
                columns={alumniColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Fees Summary Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Fees Summary" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    ₹{data.students.reduce((sum, student) => sum + (student.totalFees || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="white">Total Fees</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    ₹{data.students.reduce((sum, student) => sum + (student.feesPaid || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="white">Fees Collected</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    ₹{data.students.reduce((sum, student) => sum + (student.feesRemaining || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="white">Fees Pending</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    {Math.round((data.students.reduce((sum, student) => sum + (student.feesPaid || 0), 0) / data.students.reduce((sum, student) => sum + (student.totalFees || 0), 0)) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="white">Collection Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Online Classroom Management */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Online Classroom Management" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <VideoCallIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" color="white" gutterBottom>
                    Teacher Dashboard
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ mb: 2 }}>
                    Start and manage online classes
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={onOpenTeacherClassroom}
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    Open Teacher Portal
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
                  <SchoolIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" color="white" gutterBottom>
                    Student Portal
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ mb: 2 }}>
                    Join live classes and view schedules
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={onOpenStudentClassroom}
                    sx={{ bgcolor: 'white', color: 'success.main', '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    Open Student Portal
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Notice Posting Section */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Post Notice"
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('notice', { date: new Date().toISOString().split('T')[0] })}
              >
                Post Notice
              </Button>
            }
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Recent notices posted by administrators
            </Typography>
            {data.notices.slice().reverse().slice(0, 3).map((notice) => (
              <Box key={notice.id} sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {notice.date} - {notice.author}
                </Typography>
                <Typography variant="body1">{notice.message}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminView;