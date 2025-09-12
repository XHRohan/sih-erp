import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    VideoCall,
    Mic,
    ScreenShare,
    People,
    Schedule,
    CheckCircle,
    Warning
} from '@mui/icons-material';

const ClassroomDemo = ({ onStartDemo }) => {
    const [serverStatus, setServerStatus] = useState('checking');

    // Check if Socket.IO server is running
    React.useEffect(() => {
        const checkServer = async () => {
            try {
                const response = await fetch('http://localhost:3001');
                setServerStatus('running');
            } catch (error) {
                setServerStatus('offline');
            }
        };

        checkServer();
    }, []);

    const features = [
        {
            icon: <VideoCall color="primary" />,
            title: 'HD Video Conferencing',
            description: 'Crystal clear video calls with multiple participants'
        },
        {
            icon: <Mic color="primary" />,
            title: 'Audio Communication',
            description: 'High-quality audio with noise cancellation'
        },
        {
            icon: <ScreenShare color="primary" />,
            title: 'Screen Sharing',
            description: 'Share your screen for presentations and demos'
        },
        {
            icon: <People color="primary" />,
            title: 'Multi-user Support',
            description: 'Support for multiple students and teachers'
        },
        {
            icon: <Schedule color="primary" />,
            title: 'Real-time Scheduling',
            description: 'Live class management and scheduling'
        }
    ];

    const demoSteps = [
        'Start the Socket.IO server (port 3001)',
        'Login as a teacher to start a class',
        'Login as a student to join the class',
        'Test video, audio, and screen sharing',
        'Experience real-time communication'
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Online Classroom Demo
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Experience the fully functional online classroom with webcam and microphone support
            </Typography>

            {/* Server Status */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        System Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">Socket.IO Server:</Typography>
                        {serverStatus === 'running' ? (
                            <Chip
                                icon={<CheckCircle />}
                                label="Online"
                                color="success"
                                size="small"
                            />
                        ) : serverStatus === 'offline' ? (
                            <Chip
                                icon={<Warning />}
                                label="Offline"
                                color="error"
                                size="small"
                            />
                        ) : (
                            <Chip
                                label="Checking..."
                                color="default"
                                size="small"
                            />
                        )}
                    </Box>

                    {serverStatus === 'offline' && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Socket.IO server is not running. Please start it using:
                            <br />
                            <code>cd server && npm install && npm start</code>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Features */}
            <Typography variant="h5" gutterBottom>
                Features
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {feature.icon}
                                    <Typography variant="h6" sx={{ ml: 1 }}>
                                        {feature.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Demo Steps */}
            <Typography variant="h5" gutterBottom>
                How to Test
            </Typography>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <List>
                        {demoSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Chip
                                            label={index + 1}
                                            size="small"
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={step} />
                                </ListItem>
                                {index < demoSteps.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Demo Credentials */}
            <Typography variant="h5" gutterBottom>
                Demo Credentials
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Teacher Account
                            </Typography>
                            <Typography variant="body2">
                                Username: <code>rajesh.kumar</code>
                            </Typography>
                            <Typography variant="body2">
                                Password: <code>teacher123</code>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Use this to start and manage classes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="success.main" gutterBottom>
                                Student Account
                            </Typography>
                            <Typography variant="body2">
                                Username: <code>21CSE001</code>
                            </Typography>
                            <Typography variant="body2">
                                Password: <code>student123</code>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Use this to join live classes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onStartDemo}
                    disabled={serverStatus !== 'running'}
                    sx={{ mr: 2 }}
                >
                    Start Demo
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    href="http://localhost:3001"
                    target="_blank"
                    disabled={serverStatus !== 'running'}
                >
                    Check Server
                </Button>
            </Box>

            {serverStatus !== 'running' && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    To start the demo, please ensure the Socket.IO server is running on port 3001.
                    You can use the provided batch file: <code>start-classroom.bat</code>
                </Alert>
            )}
        </Box>
    );
};

export default ClassroomDemo;