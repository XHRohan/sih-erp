import React from 'react';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button
} from '@mui/material';
import { payFees } from '../utils/data';
import {
    Person as PersonIcon,
    Grade as GradeIcon,
    Assignment as AssignmentIcon,
    Announcement as AnnouncementIcon
} from '@mui/icons-material';
import CareerAI from './CareerAI';

const StudentView = ({ user, data, setData, setSnackbar }) => {
    if (!data) return <Typography>Loading...</Typography>;
    
    // Debug log to check notices
    console.log('StudentView received notices:', data.notices?.length, 'notices');

    // Get current student data
    const currentStudent = data.students.find(s => s.id === user.studentId);
    if (!currentStudent) return <Typography>Student data not found</Typography>;

    // Get student's class
    const studentClass = data.classes.find(c => c.id === currentStudent.classId);

    // Calculate attendance data
    const calculateAttendanceData = () => {
        const attendanceData = {};
        let totalLectures = 0;
        let attendedLectures = 0;

        // Get all teachers who teach this student's class
        const classTeachers = data.teachers.filter(t => t.classes.includes(currentStudent.classId));

        // Initialize attendance data for each subject
        classTeachers.forEach(teacher => {
            attendanceData[teacher.subject] = {
                teacher: teacher.name,
                lecturesAttended: 0,
                totalLectures: 0,
                percentage: 0
            };
        });

        // Process attendance records
        Object.entries(data.attendance).forEach(([date, dateAttendance]) => {
            if (dateAttendance[currentStudent.classId]) {
                const classAttendance = dateAttendance[currentStudent.classId];

                Object.entries(classAttendance).forEach(([lectureKey, lectureData]) => {
                    const teacher = data.teachers.find(t => t.id === lectureData.teacherId);
                    if (teacher && attendanceData[teacher.subject]) {
                        attendanceData[teacher.subject].totalLectures++;
                        totalLectures++;

                        if (lectureData.presentStudents.includes(currentStudent.id)) {
                            attendanceData[teacher.subject].lecturesAttended++;
                            attendedLectures++;
                        }
                    }
                });
            }
        });

        // Calculate percentages
        Object.keys(attendanceData).forEach(subject => {
            const subjectData = attendanceData[subject];
            if (subjectData.totalLectures > 0) {
                subjectData.percentage = Math.round((subjectData.lecturesAttended / subjectData.totalLectures) * 100);
            }
        });

        const overallPercentage = totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 0;

        return { attendanceData, overallPercentage, totalLectures, attendedLectures };
    };

    // Get student grades
    const studentGrades = data.grades[currentStudent.id] || {};

    // Calculate average grade
    const calculateAverageGrade = () => {
        const grades = Object.values(studentGrades);
        if (grades.length === 0) return 0;
        return Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length);
    };

    // Calculate badges
    const calculateBadges = () => {
        const { overallPercentage } = calculateAttendanceData();
        const averageGrade = calculateAverageGrade();
        const badges = [];

        if (overallPercentage >= 90) {
            badges.push({ label: "Excellent Attendance", color: "success" });
        }

        if (averageGrade >= 85) {
            badges.push({ label: "Top Performer", color: "primary" });
        }

        if (overallPercentage >= 95 && averageGrade >= 90) {
            badges.push({ label: "Outstanding Student", color: "error" });
        }

        return badges;
    };

    const { attendanceData, overallPercentage, totalLectures, attendedLectures } = calculateAttendanceData();
    const averageGrade = calculateAverageGrade();
    const badges = calculateBadges();

    return (
        <Grid container spacing={3}>
            {/* Student Profile */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title="My Profile"
                        avatar={<PersonIcon />}
                    />
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>{currentStudent.name}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Admission Number:</strong> {currentStudent.admissionNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Date of Birth:</strong> {new Date(currentStudent.dob).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Class:</strong> {studentClass?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Email:</strong> {currentStudent.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Phone:</strong> {currentStudent.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Address:</strong> {currentStudent.address}
                            </Typography>
                        </Box>

                        {/* Badges */}
                        {badges.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Achievements</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {badges.map((badge, index) => (
                                        <Chip
                                            key={index}
                                            label={badge.label}
                                            color={badge.color}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Attendance Summary */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title="Attendance Summary"
                        avatar={<AssignmentIcon />}
                    />
                    <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="h4" color="primary" gutterBottom>
                                {overallPercentage}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Overall Attendance ({attendedLectures}/{totalLectures} lectures)
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>Subject-wise Attendance</Typography>
                        {Object.entries(attendanceData).map(([subject, data]) => (
                            <Box key={subject} sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">{subject}</Typography>
                                    <Chip
                                        label={`${data.percentage}%`}
                                        color={data.percentage >= 75 ? 'success' : data.percentage >= 50 ? 'warning' : 'error'}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    {data.lecturesAttended}/{data.totalLectures} lectures • {data.teacher}
                                </Typography>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Grid>

            {/* Grades */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title="My Grades"
                        avatar={<GradeIcon />}
                    />
                    <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="h4" color="primary" gutterBottom>
                                {averageGrade}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Average Grade
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Subject</TableCell>
                                        <TableCell align="right">Grade</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(studentGrades).map(([subject, grade]) => (
                                        <TableRow key={subject}>
                                            <TableCell>{subject}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${grade}%`}
                                                    color={grade >= 85 ? 'success' : grade >= 70 ? 'primary' : grade >= 50 ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {Object.keys(studentGrades).length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No grades available yet
                            </Typography>
                        )}

                        {/* AI Career Recommendation */}
                        {Object.keys(studentGrades).length > 0 && (
                            <CareerAI 
                                studentGrades={studentGrades} 
                                studentName={currentStudent.name} 
                            />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Fees Information */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title="Fee Status"
                        avatar={<PersonIcon />}
                    />
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Total Fees: ₹{currentStudent.totalFees?.toLocaleString() || '0'}
                            </Typography>
                            <Typography variant="body1" color="success.main" gutterBottom>
                                Paid: ₹{currentStudent.feesPaid?.toLocaleString() || '0'}
                            </Typography>
                            <Typography variant="body1" color={currentStudent.feesRemaining > 0 ? "error.main" : "success.main"} gutterBottom>
                                Remaining: ₹{currentStudent.feesRemaining?.toLocaleString() || '0'}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {currentStudent.feesRemaining > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    // Mock payment - simulate payment process
                                    const paymentAmount = Math.min(currentStudent.feesRemaining, 25000); // Pay up to 25k
                                    const updatedData = payFees(currentStudent.id, paymentAmount);
                                    
                                    if (updatedData && setData && setSnackbar) {
                                        setData(updatedData);
                                        setSnackbar({
                                            open: true,
                                            message: `Payment successful! ₹${paymentAmount.toLocaleString()} paid.`,
                                            severity: 'success'
                                        });
                                    } else {
                                        // Fallback - refresh page if callbacks not available
                                        window.location.reload();
                                    }
                                }}
                                sx={{ mt: 1 }}
                            >
                                Pay Fees (₹{Math.min(currentStudent.feesRemaining, 25000).toLocaleString()})
                            </Button>
                        )}

                        {currentStudent.feesRemaining === 0 && (
                            <Chip
                                label="All Fees Paid ✓"
                                color="success"
                                sx={{ width: '100%', height: 40 }}
                            />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Weekly Timetable */}
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Weekly Timetable"
                        avatar={<PersonIcon />}
                        subheader={`Class: ${studentClass?.name}`}
                    />
                    <CardContent>
                        {data.timetable && data.timetable.classSchedules[currentStudent.classId] ? (
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Time</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Monday</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Tuesday</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Wednesday</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Thursday</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Friday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.timetable.timeSlots.map(timeSlot => (
                                            <tr key={timeSlot.id}>
                                                <td style={{ border: '1px solid #ddd', padding: '12px', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">{timeSlot.period}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{timeSlot.time}</Typography>
                                                    </Box>
                                                </td>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                                                    const daySchedule = data.timetable.classSchedules[currentStudent.classId][day];
                                                    const lecture = daySchedule?.find(l => l.period === timeSlot.id);
                                                    const teacher = lecture?.teacherId ? data.teachers.find(t => t.id === lecture.teacherId) : null;
                                                    
                                                    return (
                                                        <td key={day} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                            {lecture ? (
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="medium" color="primary">
                                                                        {lecture.subject}
                                                                    </Typography>
                                                                    {teacher && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {teacher.name}
                                                                        </Typography>
                                                                    )}
                                                                    {lecture.room && (
                                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                                            {lecture.room}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    -
                                                                </Typography>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                Timetable not available
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Notices */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader
                        title="Notices & Announcements"
                        avatar={<PersonIcon />}
                    />
                    <CardContent>
                        <List dense>
                            {data.notices.slice().reverse().slice(0, 5).map((notice, index) => (
                                <React.Fragment key={notice.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={notice.message}
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(notice.date).toLocaleDateString()} • {notice.author}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < Math.min(data.notices.length - 1, 4) && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>

                        {data.notices.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No notices available
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default StudentView;