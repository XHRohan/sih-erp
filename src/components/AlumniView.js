import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { updateRecord, addRecord } from '../utils/data';

const AlumniView = ({ user, data, setData, setSnackbar }) => {
  const [testimonialText, setTestimonialText] = useState('');
  const [loading, setLoading] = useState(false);
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    gradYear: '',
    email: '',
    phone: '',
    currentJob: ''
  });

  if (!data) return <Typography>Loading...</Typography>;

  // Get current alumni data
  const currentAlumni = data.alumni.find(a => a.id === user.alumniId);
  if (!currentAlumni) return <Typography>Alumni data not found</Typography>;

  const handleTestimonialSubmit = async () => {
    if (!testimonialText.trim()) return;
    
    setLoading(true);
    try {
      const updatedData = updateRecord('alumni', currentAlumni.id, { 
        comment: testimonialText 
      });
      if (updatedData) {
        setData(updatedData);
        setTestimonialText('');
        setSnackbar({
          open: true,
          message: 'Testimonial submitted successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to submit testimonial');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting testimonial',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipSubmit = async () => {
    setLoading(true);
    try {
      const newAlumni = {
        id: data.alumni.length + 1,
        name: membershipForm.name,
        gradYear: parseInt(membershipForm.gradYear),
        status: 'pending',
        comment: '',
        email: membershipForm.email,
        phone: membershipForm.phone,
        currentJob: membershipForm.currentJob
      };
      
      const result = addRecord('alumni', newAlumni);
      if (result) {
        setData(result);
        setMembershipForm({ name: '', gradYear: '', email: '', phone: '', currentJob: '' });
        setSnackbar({
          open: true,
          message: 'Membership application submitted successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting application',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Alumni Profile */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Alumni Profile" />
          <CardContent>
            <Typography variant="h6">{currentAlumni.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Graduation Year: {currentAlumni.gradYear}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {currentAlumni.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {currentAlumni.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Alumni Directory */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Alumni Directory" />
          <CardContent>
            {data.alumni.filter(a => a.status === 'approved').map((alumni) => (
              <Box key={alumni.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1">{alumni.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Class of {alumni.gradYear}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {alumni.email}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Events */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Upcoming Alumni Events" />
          <CardContent>
            <Grid container spacing={2}>
              {data.alumniEvents.map((event) => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      {event.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Testimonial Submission */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Share Your Testimonial" />
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your testimonial about the college"
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={handleTestimonialSubmit}
              disabled={!testimonialText.trim() || loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
            {currentAlumni.comment && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2">Your Current Testimonial:</Typography>
                <Typography variant="body2">{currentAlumni.comment}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Alumni Membership Application */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Alumni Membership Application" />
          <CardContent>
            <TextField
              fullWidth
              label="Full Name"
              value={membershipForm.name}
              onChange={(e) => setMembershipForm({ ...membershipForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Graduation Year"
              type="number"
              value={membershipForm.gradYear}
              onChange={(e) => setMembershipForm({ ...membershipForm, gradYear: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={membershipForm.email}
              onChange={(e) => setMembershipForm({ ...membershipForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={membershipForm.phone}
              onChange={(e) => setMembershipForm({ ...membershipForm, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Current Job/Position"
              value={membershipForm.currentJob}
              onChange={(e) => setMembershipForm({ ...membershipForm, currentJob: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={handleMembershipSubmit}
              disabled={!membershipForm.name || !membershipForm.gradYear || !membershipForm.email || loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AlumniView;