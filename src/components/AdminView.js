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
  Close as CloseIcon
} from '@mui/icons-material';

const AdminView = ({ data, handleOpenDialog, handleAlumniAction }) => {
  if (!data) return <Typography>Loading...</Typography>;

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
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { 
      field: 'classId', 
      headerName: 'Class', 
      width: 100,
      renderCell: (params) => {
        const className = data.classes.find(c => c.id === params.value)?.name || 'N/A';
        return className;
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