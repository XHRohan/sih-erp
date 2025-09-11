import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Psychology as AIIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const CareerAI = ({ studentGrades, studentName }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    if (!studentGrades || Object.keys(studentGrades).length === 0) {
      setError('No grades available for career analysis');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grades: studentGrades,
          studentName: studentName
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get recommendation (${response.status})`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendation(data.recommendation);
    } catch (err) {
      console.error('Error getting career recommendation:', err);
      setError(err.message || 'Failed to get career recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    handleGetRecommendation();
  };

  const handleClose = () => {
    setOpen(false);
    setRecommendation('');
    setError('');
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AIIcon />}
        onClick={handleOpen}
        fullWidth
        sx={{ mt: 2 }}
      >
        Get AI Career Recommendation
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '400px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon color="secondary" />
          AI Career Recommendation for {studentName}
        </DialogTitle>
        
        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Analyzing your academic performance...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {recommendation && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                Based on Your Academic Performance:
              </Typography>
              
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                {Object.entries(studentGrades).map(([subject, grade]) => (
                  <Typography key={subject} variant="body2" sx={{ mb: 0.5 }}>
                    <strong>{subject}:</strong> {grade}%
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {recommendation}
              </Typography>
            </Box>
          )}

          {!loading && !error && !recommendation && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Click the button above to get your personalized career recommendation.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CareerAI;