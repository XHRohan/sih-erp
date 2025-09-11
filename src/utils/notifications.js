// Notification utility for lecture reminders
import { getData } from './data';

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send a notification
export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close notification after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  }
};

// Get current day of week
const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Parse time string to minutes (e.g., "09:00" -> 540)
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Get current time in minutes
const getCurrentTimeInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Get student's schedule for today
export const getTodaySchedule = (studentId) => {
  try {
    const data = getData();
    if (!data || !data.timetable) return [];

    // Find student and their class
    const student = data.students.find(s => s.id === studentId);
    if (!student) return [];

    const currentDay = getCurrentDay();
    
    // Skip weekends
    if (currentDay === 'Saturday' || currentDay === 'Sunday') {
      return [];
    }

    const classSchedule = data.timetable.classSchedules[student.classId];
    if (!classSchedule || !classSchedule[currentDay]) return [];

    const todaySchedule = classSchedule[currentDay];
    const timeSlots = data.timetable.timeSlots;

    // Filter out breaks and free periods, add time information
    return todaySchedule
      .filter(lecture => lecture.teacherId !== null)
      .map(lecture => {
        const timeSlot = timeSlots.find(slot => slot.id === lecture.period);
        const teacher = data.teachers.find(t => t.id === lecture.teacherId);
        
        return {
          ...lecture,
          time: timeSlot?.time || 'Unknown',
          startTime: timeSlot?.time?.split('-')[0] || '00:00',
          teacher: teacher?.name || 'Unknown Teacher',
          studentName: student.name
        };
      })
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  } catch (error) {
    console.error('Error getting today schedule:', error);
    return [];
  }
};

// Check for upcoming lectures and send notifications
export const checkUpcomingLectures = (studentId) => {
  const schedule = getTodaySchedule(studentId);
  const currentTime = getCurrentTimeInMinutes();
  
  schedule.forEach(lecture => {
    const lectureStartTime = timeToMinutes(lecture.startTime);
    const timeDiff = lectureStartTime - currentTime;
    
    // Notify 10 minutes before class
    if (timeDiff > 0 && timeDiff <= 10) {
      const notificationKey = `lecture-${lecture.period}-${new Date().toDateString()}`;
      
      // Check if we already sent this notification today
      if (!localStorage.getItem(notificationKey)) {
        sendNotification(
          `📚 Class Starting Soon!`,
          {
            body: `${lecture.subject} with ${lecture.teacher} starts in ${timeDiff} minutes\nRoom: ${lecture.room}`,
            tag: `lecture-${lecture.period}`,
            requireInteraction: true,
            actions: [
              {
                action: 'view',
                title: 'View Schedule'
              }
            ]
          }
        );
        
        // Mark notification as sent
        localStorage.setItem(notificationKey, 'sent');
      }
    }
    
    // Notify when class is starting (0-2 minutes)
    if (timeDiff >= -2 && timeDiff <= 2) {
      const notificationKey = `lecture-starting-${lecture.period}-${new Date().toDateString()}`;
      
      if (!localStorage.getItem(notificationKey)) {
        sendNotification(
          `🔔 Class Starting Now!`,
          {
            body: `${lecture.subject} is starting now in ${lecture.room}`,
            tag: `lecture-starting-${lecture.period}`,
            requireInteraction: false
          }
        );
        
        localStorage.setItem(notificationKey, 'sent');
      }
    }
  });
};

// Start notification service for a student
export const startNotificationService = (studentId) => {
  // Request permission first
  requestNotificationPermission().then(granted => {
    if (granted) {
      console.log('Notification service started for student:', studentId);
      
      // Check immediately
      checkUpcomingLectures(studentId);
      
      // Check every minute
      const interval = setInterval(() => {
        checkUpcomingLectures(studentId);
      }, 60000); // 60 seconds
      
      // Store interval ID for cleanup
      window.notificationInterval = interval;
      
      // Send welcome notification
      setTimeout(() => {
        const schedule = getTodaySchedule(studentId);
        if (schedule.length > 0) {
          sendNotification(
            '🎓 College ERP Notifications Enabled',
            {
              body: `You have ${schedule.length} classes today. You'll be notified before each class starts.`,
              tag: 'welcome'
            }
          );
        }
      }, 2000);
    } else {
      console.log('Notification permission denied');
    }
  });
};

// Stop notification service
export const stopNotificationService = () => {
  if (window.notificationInterval) {
    clearInterval(window.notificationInterval);
    window.notificationInterval = null;
    console.log('Notification service stopped');
  }
};

// Get next upcoming lecture
export const getNextLecture = (studentId) => {
  const schedule = getTodaySchedule(studentId);
  const currentTime = getCurrentTimeInMinutes();
  
  return schedule.find(lecture => {
    const lectureStartTime = timeToMinutes(lecture.startTime);
    return lectureStartTime > currentTime;
  });
};

// Get current ongoing lecture
export const getCurrentLecture = (studentId) => {
  const schedule = getTodaySchedule(studentId);
  const currentTime = getCurrentTimeInMinutes();
  
  return schedule.find(lecture => {
    const lectureStartTime = timeToMinutes(lecture.startTime);
    const lectureEndTime = timeToMinutes(lecture.time.split('-')[1]);
    return currentTime >= lectureStartTime && currentTime <= lectureEndTime;
  });
};