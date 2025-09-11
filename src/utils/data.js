// Centralized data management for College ERP
const ERP_DATA_KEY = 'erpData';

// Validate basic data structure
const validateDataStructure = (data) => {
  if (!data || typeof data !== 'object') return false;
  const required = ['users', 'teachers', 'students', 'classes', 'attendance', 'grades', 'notices', 'alumni', 'alumniEvents'];
  return required.every(key => data.hasOwnProperty(key));
};

// Get data from localStorage with error handling
export const getData = () => {
  try {
    const data = localStorage.getItem(ERP_DATA_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return validateDataStructure(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

// Save data to localStorage with immediate sync
export const saveData = (data) => {
  try {
    if (!validateDataStructure(data)) {
      console.error('Invalid data structure');
      return false;
    }

    localStorage.setItem(ERP_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Initialize data with mock data if needed
export const initializeData = () => {
  try {
    const existingData = getData();
    if (existingData) return existingData;

    const mockData = getDefaultMockData();
    saveData(mockData);
    return mockData;
  } catch (error) {
    console.error('Error initializing data:', error);
    return getDefaultMockData();
  }
};

// Generate comprehensive mock data structure
const getDefaultMockData = () => ({
  // User accounts for login with username/password authentication
  users: [
    // Admin users
    { id: "admin1", username: "admin", password: "admin123", role: "admin", name: "System Admin", email: "admin@college.edu.in" },
    { id: "admin2", username: "principal", password: "principal123", role: "admin", name: "Dr. Principal Sharma", email: "principal@college.edu.in" },

    // Teacher users - 8 teachers
    { id: "teacher1", username: "rajesh.kumar", password: "teacher123", role: "teacher", name: "Dr. Rajesh Kumar", teacherId: 1, email: "rajesh.kumar@college.edu.in" },
    { id: "teacher2", username: "priya.sharma", password: "teacher123", role: "teacher", name: "Prof. Priya Sharma", teacherId: 2, email: "priya.sharma@college.edu.in" },
    { id: "teacher3", username: "amit.patel", password: "teacher123", role: "teacher", name: "Dr. Amit Patel", teacherId: 3, email: "amit.patel@college.edu.in" },
    { id: "teacher4", username: "sunita.verma", password: "teacher123", role: "teacher", name: "Ms. Sunita Verma", teacherId: 4, email: "sunita.verma@college.edu.in" },
    { id: "teacher5", username: "kiran.joshi", password: "teacher123", role: "teacher", name: "Dr. Kiran Joshi", teacherId: 5, email: "kiran.joshi@college.edu.in" },
    { id: "teacher6", username: "neha.singh", password: "teacher123", role: "teacher", name: "Prof. Neha Singh", teacherId: 6, email: "neha.singh@college.edu.in" },
    { id: "teacher7", username: "ravi.gupta", password: "teacher123", role: "teacher", name: "Dr. Ravi Gupta", teacherId: 7, email: "ravi.gupta@college.edu.in" },
    { id: "teacher8", username: "pooja.agarwal", password: "teacher123", role: "teacher", name: "Ms. Pooja Agarwal", teacherId: 8, email: "pooja.agarwal@college.edu.in" },

    // Student users - 20 students (using admission numbers as usernames)
    { id: "student1", username: "21CSE001", password: "student123", role: "student", name: "Arjun Singh", studentId: 1, email: "arjun.singh@college.edu.in" },
    { id: "student2", username: "21CSE002", password: "student123", role: "student", name: "Sneha Gupta", studentId: 2, email: "sneha.gupta@college.edu.in" },
    { id: "student3", username: "21CSE003", password: "student123", role: "student", name: "Aditya Sharma", studentId: 3, email: "aditya.sharma@college.edu.in" },
    { id: "student4", username: "21CSE004", password: "student123", role: "student", name: "Priya Mehta", studentId: 4, email: "priya.mehta@college.edu.in" },
    { id: "student5", username: "21CSE005", password: "student123", role: "student", name: "Vikram Reddy", studentId: 5, email: "vikram.reddy@college.edu.in" },
    { id: "student6", username: "21CSE006", password: "student123", role: "student", name: "Karthik Rao", studentId: 6, email: "karthik.rao@college.edu.in" },
    { id: "student7", username: "21CSE007", password: "student123", role: "student", name: "Harsh Agarwal", studentId: 7, email: "harsh.agarwal@college.edu.in" },
    { id: "student8", username: "21CSE008", password: "student123", role: "student", name: "Ananya Iyer", studentId: 8, email: "ananya.iyer@college.edu.in" },
    { id: "student9", username: "21CSE009", password: "student123", role: "student", name: "Divya Patel", studentId: 9, email: "divya.patel@college.edu.in" },
    { id: "student10", username: "21CSE010", password: "student123", role: "student", name: "Nikhil Kumar", studentId: 10, email: "nikhil.kumar@college.edu.in" },
    { id: "student11", username: "21IT001", password: "student123", role: "student", name: "Rohit Joshi", studentId: 11, email: "rohit.joshi@college.edu.in" },
    { id: "student12", username: "21IT002", password: "student123", role: "student", name: "Riya Bansal", studentId: 12, email: "riya.bansal@college.edu.in" },
    { id: "student13", username: "21IT003", password: "student123", role: "student", name: "Varun Malhotra", studentId: 13, email: "varun.malhotra@college.edu.in" },
    { id: "student14", username: "21IT004", password: "student123", role: "student", name: "Ishita Sinha", studentId: 14, email: "ishita.sinha@college.edu.in" },
    { id: "student15", username: "21IT005", password: "student123", role: "student", name: "Kavya Nair", studentId: 15, email: "kavya.nair@college.edu.in" },
    { id: "student16", username: "21IT006", password: "student123", role: "student", name: "Sakshi Jain", studentId: 16, email: "sakshi.jain@college.edu.in" },
    { id: "student17", username: "21IT007", password: "student123", role: "student", name: "Aryan Kapoor", studentId: 17, email: "aryan.kapoor@college.edu.in" },
    { id: "student18", username: "21ECE001", password: "student123", role: "student", name: "Tanvi Bhatt", studentId: 18, email: "tanvi.bhatt@college.edu.in" },
    { id: "student19", username: "21ECE002", password: "student123", role: "student", name: "Siddharth Mishra", studentId: 19, email: "siddharth.mishra@college.edu.in" },
    { id: "student20", username: "21ECE003", password: "student123", role: "student", name: "Nisha Tiwari", studentId: 20, email: "nisha.tiwari@college.edu.in" },

    // Alumni users
    { id: "alumni1", username: "suresh.menon", password: "alumni123", role: "alumni", name: "Suresh Menon", alumniId: 1, email: "suresh.menon@gmail.com" },
    { id: "alumni2", username: "deepika.agarwal", password: "alumni123", role: "alumni", name: "Deepika Agarwal", alumniId: 2, email: "deepika.agarwal@gmail.com" },
    { id: "alumni3", username: "rahul.khanna", password: "alumni123", role: "alumni", name: "Rahul Khanna", alumniId: 3, email: "rahul.khanna@gmail.com" }
  ],

  // Teachers with subject assignments and classes - 8 teachers
  teachers: [
    { id: 1, name: "Dr. Rajesh Kumar", subject: "Data Structures & Algorithms", classes: [1, 2] },
    { id: 2, name: "Prof. Priya Sharma", subject: "Database Management Systems", classes: [1, 3, 5] },
    { id: 3, name: "Dr. Amit Patel", subject: "Computer Networks", classes: [2, 4] },
    { id: 4, name: "Ms. Sunita Verma", subject: "Operating Systems", classes: [3, 4, 6] },
    { id: 5, name: "Dr. Kiran Joshi", subject: "Software Engineering", classes: [1, 5] },
    { id: 6, name: "Prof. Neha Singh", subject: "Machine Learning", classes: [2, 6] },
    { id: 7, name: "Dr. Ravi Gupta", subject: "Web Development", classes: [4, 5, 6] },
    { id: 8, name: "Ms. Pooja Agarwal", subject: "Mobile App Development", classes: [3, 6] }
  ],

  // Students with complete profile information - 20 students across 6 classes
  students: [
    // Class 1 - BTech CSE 2nd Year A (4 students)
    { id: 1, name: "Arjun Singh", dob: "2003-05-21", admissionNumber: "21CSE001", address: "A-45 Sector 12, Noida, UP", phone: "9876543210", email: "arjun.singh@college.edu.in", classId: 1, totalFees: 120000, feesPaid: 85000, feesRemaining: 35000 },
    { id: 2, name: "Sneha Gupta", dob: "2003-08-15", admissionNumber: "21CSE002", address: "B-23 Model Town, Delhi", phone: "9876543211", email: "sneha.gupta@college.edu.in", classId: 1, totalFees: 120000, feesPaid: 120000, feesRemaining: 0 },
    { id: 3, name: "Aditya Sharma", dob: "2003-02-10", admissionNumber: "21CSE003", address: "C-12 Vasant Kunj, Delhi", phone: "9876543212", email: "aditya.sharma@college.edu.in", classId: 1, totalFees: 120000, feesPaid: 45000, feesRemaining: 75000 },
    { id: 4, name: "Priya Mehta", dob: "2003-12-05", admissionNumber: "21CSE004", address: "D-78 Gurgaon, Haryana", phone: "9876543213", email: "priya.mehta@college.edu.in", classId: 1, totalFees: 120000, feesPaid: 0, feesRemaining: 120000 },

    // Class 2 - BTech CSE 2nd Year B (3 students)
    { id: 5, name: "Vikram Reddy", dob: "2003-03-10", admissionNumber: "21CSE005", address: "15-2-34 Banjara Hills, Hyderabad", phone: "9876543214", email: "vikram.reddy@college.edu.in", classId: 2, totalFees: 120000, feesPaid: 75000, feesRemaining: 45000 },
    { id: 6, name: "Karthik Rao", dob: "2003-06-18", admissionNumber: "21CSE006", address: "MG Road, Bangalore", phone: "9876543215", email: "karthik.rao@college.edu.in", classId: 2, totalFees: 120000, feesPaid: 120000, feesRemaining: 0 },
    { id: 7, name: "Harsh Agarwal", dob: "2003-09-22", admissionNumber: "21CSE007", address: "Park Street, Kolkata", phone: "9876543216", email: "harsh.agarwal@college.edu.in", classId: 2, totalFees: 120000, feesPaid: 60000, feesRemaining: 60000 },

    // Class 3 - BTech CSE 2nd Year C (3 students)
    { id: 8, name: "Ananya Iyer", dob: "2003-11-30", admissionNumber: "21CSE008", address: "12/A Koramangala, Bangalore", phone: "9876543217", email: "ananya.iyer@college.edu.in", classId: 3, totalFees: 120000, feesPaid: 90000, feesRemaining: 30000 },
    { id: 9, name: "Divya Patel", dob: "2003-04-14", admissionNumber: "21CSE009", address: "Satellite, Ahmedabad", phone: "9876543218", email: "divya.patel@college.edu.in", classId: 3, totalFees: 120000, feesPaid: 120000, feesRemaining: 0 },
    { id: 10, name: "Nikhil Kumar", dob: "2003-07-08", admissionNumber: "21CSE010", address: "Boring Road, Patna", phone: "9876543219", email: "nikhil.kumar@college.edu.in", classId: 3, totalFees: 120000, feesPaid: 25000, feesRemaining: 95000 },

    // Class 4 - BTech IT 2nd Year A (4 students)
    { id: 11, name: "Rohit Joshi", dob: "2003-07-18", admissionNumber: "21IT001", address: "Plot 67 Viman Nagar, Pune", phone: "9876543220", email: "rohit.joshi@college.edu.in", classId: 4, totalFees: 115000, feesPaid: 115000, feesRemaining: 0 },
    { id: 12, name: "Riya Bansal", dob: "2003-10-25", admissionNumber: "21IT002", address: "Connaught Place, Delhi", phone: "9876543221", email: "riya.bansal@college.edu.in", classId: 4, totalFees: 115000, feesPaid: 70000, feesRemaining: 45000 },
    { id: 13, name: "Varun Malhotra", dob: "2003-01-12", admissionNumber: "21IT003", address: "Sector 17, Chandigarh", phone: "9876543222", email: "varun.malhotra@college.edu.in", classId: 4, totalFees: 115000, feesPaid: 40000, feesRemaining: 75000 },
    { id: 14, name: "Ishita Sinha", dob: "2003-08-30", admissionNumber: "21IT004", address: "Salt Lake, Kolkata", phone: "9876543223", email: "ishita.sinha@college.edu.in", classId: 4, totalFees: 115000, feesPaid: 115000, feesRemaining: 0 },

    // Class 5 - BTech IT 2nd Year B (3 students)
    { id: 15, name: "Kavya Nair", dob: "2003-09-25", admissionNumber: "21IT005", address: "TC 15/234 Pattom, Thiruvananthapuram", phone: "9876543224", email: "kavya.nair@college.edu.in", classId: 5, totalFees: 115000, feesPaid: 80000, feesRemaining: 35000 },
    { id: 16, name: "Sakshi Jain", dob: "2003-05-16", admissionNumber: "21IT006", address: "MI Road, Jaipur", phone: "9876543225", email: "sakshi.jain@college.edu.in", classId: 5, totalFees: 115000, feesPaid: 55000, feesRemaining: 60000 },
    { id: 17, name: "Aryan Kapoor", dob: "2003-11-03", admissionNumber: "21IT007", address: "Linking Road, Mumbai", phone: "9876543226", email: "aryan.kapoor@college.edu.in", classId: 5, totalFees: 115000, feesPaid: 115000, feesRemaining: 0 },

    // Class 6 - BTech ECE 2nd Year (3 students)
    { id: 18, name: "Tanvi Bhatt", dob: "2003-03-28", admissionNumber: "21ECE001", address: "CG Road, Ahmedabad", phone: "9876543227", email: "tanvi.bhatt@college.edu.in", classId: 6, totalFees: 125000, feesPaid: 50000, feesRemaining: 75000 },
    { id: 19, name: "Siddharth Mishra", dob: "2003-12-15", admissionNumber: "21ECE002", address: "Hazratganj, Lucknow", phone: "9876543228", email: "siddharth.mishra@college.edu.in", classId: 6, totalFees: 125000, feesPaid: 125000, feesRemaining: 0 },
    { id: 20, name: "Nisha Tiwari", dob: "2003-06-07", admissionNumber: "21ECE003", address: "Civil Lines, Nagpur", phone: "9876543229", email: "nisha.tiwari@college.edu.in", classId: 6, totalFees: 125000, feesPaid: 30000, feesRemaining: 95000 }
  ],

  // Classes with 7 lectures each - 6 classes
  classes: [
    { id: 1, name: "BTech CSE 2nd Year A", totalLectures: 7 },
    { id: 2, name: "BTech CSE 2nd Year B", totalLectures: 7 },
    { id: 3, name: "BTech CSE 2nd Year C", totalLectures: 7 },
    { id: 4, name: "BTech IT 2nd Year A", totalLectures: 7 },
    { id: 5, name: "BTech IT 2nd Year B", totalLectures: 7 },
    { id: 6, name: "BTech ECE 2nd Year", totalLectures: 7 }
  ],

  // Comprehensive lecture-based attendance structure (by date, class, lecture, teacher)
  attendance: {
    "2025-09-05": {
      1: { // BTech CSE 2nd Year A
        1: { teacherId: 1, lectureNumber: 1, presentStudents: [1, 2, 3] }, // DSA L1
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [1, 2, 4] }, // DBMS L1
        5: { teacherId: 5, lectureNumber: 1, presentStudents: [2, 3, 4] }  // SE L1
      },
      2: { // BTech CSE 2nd Year B
        1: { teacherId: 1, lectureNumber: 1, presentStudents: [5, 6] },    // DSA L1
        3: { teacherId: 3, lectureNumber: 1, presentStudents: [5, 6, 7] }, // Networks L1
        6: { teacherId: 6, lectureNumber: 1, presentStudents: [6, 7] }     // ML L1
      },
      3: { // BTech CSE 2nd Year C
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [8, 9] },    // DBMS L1
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [8, 9, 10] }, // OS L1
        8: { teacherId: 8, lectureNumber: 1, presentStudents: [9, 10] }    // Mobile L1
      }
    },
    "2025-09-06": {
      1: { // BTech CSE 2nd Year A
        1: { teacherId: 1, lectureNumber: 2, presentStudents: [1, 3, 4] }, // DSA L2
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [1, 2, 3] }, // DBMS L2
        5: { teacherId: 5, lectureNumber: 2, presentStudents: [1, 2, 4] }  // SE L2
      },
      4: { // BTech IT 2nd Year A
        3: { teacherId: 3, lectureNumber: 1, presentStudents: [11, 12, 13] }, // Networks L1
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [11, 14] },     // OS L1
        7: { teacherId: 7, lectureNumber: 1, presentStudents: [12, 13, 14] }  // Web Dev L1
      },
      5: { // BTech IT 2nd Year B
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [15, 16] },     // DBMS L1
        5: { teacherId: 5, lectureNumber: 1, presentStudents: [15, 16, 17] }, // SE L1
        7: { teacherId: 7, lectureNumber: 1, presentStudents: [16, 17] }      // Web Dev L1
      }
    },
    "2025-09-07": {
      2: { // BTech CSE 2nd Year B
        1: { teacherId: 1, lectureNumber: 2, presentStudents: [5, 7] },    // DSA L2
        3: { teacherId: 3, lectureNumber: 2, presentStudents: [5, 6] },    // Networks L2
        6: { teacherId: 6, lectureNumber: 2, presentStudents: [5, 6, 7] }  // ML L2
      },
      6: { // BTech ECE 2nd Year
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [18, 19] },  // OS L1
        6: { teacherId: 6, lectureNumber: 1, presentStudents: [18, 20] },  // ML L1
        8: { teacherId: 8, lectureNumber: 1, presentStudents: [19, 20] }   // Mobile L1
      }
    },
    "2025-09-08": {
      1: { // BTech CSE 2nd Year A
        1: { teacherId: 1, lectureNumber: 3, presentStudents: [1, 2] },    // DSA L3
        2: { teacherId: 2, lectureNumber: 3, presentStudents: [2, 3, 4] }, // DBMS L3
        5: { teacherId: 5, lectureNumber: 3, presentStudents: [1, 3] }     // SE L3
      },
      3: { // BTech CSE 2nd Year C
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [8, 10] },   // DBMS L2
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [8, 9] },    // OS L2
        8: { teacherId: 8, lectureNumber: 2, presentStudents: [9, 10] }    // Mobile L2
      }
    },
    "2025-09-09": {
      4: { // BTech IT 2nd Year A
        3: { teacherId: 3, lectureNumber: 2, presentStudents: [11, 12, 14] }, // Networks L2
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [11, 12, 13] }, // OS L2
        7: { teacherId: 7, lectureNumber: 2, presentStudents: [13, 14] }      // Web Dev L2
      },
      5: { // BTech IT 2nd Year B
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [15, 17] },     // DBMS L2
        5: { teacherId: 5, lectureNumber: 2, presentStudents: [15, 16] },     // SE L2
        7: { teacherId: 7, lectureNumber: 2, presentStudents: [16, 17] }      // Web Dev L2
      }
    },
    "2025-09-10": {
      2: { // BTech CSE 2nd Year B
        1: { teacherId: 1, lectureNumber: 3, presentStudents: [5, 6, 7] }, // DSA L3
        3: { teacherId: 3, lectureNumber: 3, presentStudents: [6, 7] },    // Networks L3
        6: { teacherId: 6, lectureNumber: 3, presentStudents: [5, 7] }     // ML L3
      },
      6: { // BTech ECE 2nd Year
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [18, 19, 20] }, // OS L2
        6: { teacherId: 6, lectureNumber: 2, presentStudents: [18, 19] },     // ML L2
        8: { teacherId: 8, lectureNumber: 2, presentStudents: [20] }          // Mobile L2
      }
    }
  },

  // Comprehensive grades by student and subject
  grades: {
    // Class 1 - BTech CSE 2nd Year A
    1: { "Data Structures & Algorithms": 95, "Database Management Systems": 88, "Software Engineering": 92 },
    2: { "Data Structures & Algorithms": 82, "Database Management Systems": 91, "Software Engineering": 85 },
    3: { "Data Structures & Algorithms": 78, "Database Management Systems": 84, "Software Engineering": 89 },
    4: { "Data Structures & Algorithms": 90, "Database Management Systems": 87, "Software Engineering": 93 },

    // Class 2 - BTech CSE 2nd Year B
    5: { "Data Structures & Algorithms": 86, "Computer Networks": 89, "Machine Learning": 91 },
    6: { "Data Structures & Algorithms": 93, "Computer Networks": 85, "Machine Learning": 88 },
    7: { "Data Structures & Algorithms": 79, "Computer Networks": 92, "Machine Learning": 86 },

    // Class 3 - BTech CSE 2nd Year C
    8: { "Database Management Systems": 87, "Operating Systems": 90, "Mobile App Development": 85 },
    9: { "Database Management Systems": 94, "Operating Systems": 88, "Mobile App Development": 92 },
    10: { "Database Management Systems": 81, "Operating Systems": 86, "Mobile App Development": 89 },

    // Class 4 - BTech IT 2nd Year A
    11: { "Computer Networks": 88, "Operating Systems": 91, "Web Development": 94 },
    12: { "Computer Networks": 92, "Operating Systems": 87, "Web Development": 89 },
    13: { "Computer Networks": 85, "Operating Systems": 93, "Web Development": 86 },
    14: { "Computer Networks": 90, "Operating Systems": 84, "Web Development": 91 },

    // Class 5 - BTech IT 2nd Year B
    15: { "Database Management Systems": 89, "Software Engineering": 92, "Web Development": 87 },
    16: { "Database Management Systems": 93, "Software Engineering": 88, "Web Development": 90 },
    17: { "Database Management Systems": 86, "Software Engineering": 91, "Web Development": 94 },

    // Class 6 - BTech ECE 2nd Year
    18: { "Operating Systems": 87, "Machine Learning": 89, "Mobile App Development": 85 },
    19: { "Operating Systems": 91, "Machine Learning": 86, "Mobile App Development": 88 },
    20: { "Operating Systems": 84, "Machine Learning": 92, "Mobile App Development": 90 }
  },

  // System notices
  notices: [
    {
      id: 1,
      date: "2025-09-11",
      message: "Mid-term exams will begin next week. Please prepare accordingly.",
      author: "System Admin"
    },
    {
      id: 2,
      date: "2025-09-10",
      message: "Library will remain open until 8 PM during exam period.",
      author: "System Admin"
    },
    {
      id: 3,
      date: "2025-09-09",
      message: "Sports day registration is now open. Contact your class teacher.",
      author: "System Admin"
    }
  ],

  // Weekly timetable for all classes
  timetable: {
    // Time slots for the day
    timeSlots: [
      { id: 1, time: "09:00-10:00", period: "Period 1" },
      { id: 2, time: "10:00-11:00", period: "Period 2" },
      { id: 3, time: "11:15-12:15", period: "Period 3" }, // 15 min break after period 2
      { id: 4, time: "12:15-13:15", period: "Period 4" },
      { id: 5, time: "14:00-15:00", period: "Period 5" }, // Lunch break
      { id: 6, time: "15:00-16:00", period: "Period 6" },
      { id: 7, time: "16:00-17:00", period: "Period 7" }
    ],

    // Class schedules - each class has a weekly schedule
    classSchedules: {
      // BTech CSE 2nd Year A (Class ID: 1)
      1: {
        Monday: [
          { period: 1, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 2, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 3, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 6, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 2, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 3, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 6, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 2, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 3, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 6, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 2, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 3, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 6, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "CS-102" },
          { period: 2, teacherId: 5, subject: "Software Engineering", room: "CS-103" },
          { period: 3, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-101" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "CS-Lab1" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "CS-Lab1" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      },

      // BTech CSE 2nd Year B (Class ID: 2)
      2: {
        Monday: [
          { period: 1, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 2, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 3, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 6, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 2, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 3, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 6, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 2, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 3, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 6, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 2, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 3, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 6, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 6, subject: "Machine Learning", room: "CS-203" },
          { period: 2, teacherId: 1, subject: "Data Structures & Algorithms", room: "CS-201" },
          { period: 3, teacherId: 3, subject: "Computer Networks", room: "CS-202" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "CS-Lab2" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "CS-Lab2" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      },

      // BTech CSE 2nd Year C (Class ID: 3)
      3: {
        Monday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 2, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 3, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 6, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 2, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 3, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 6, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 2, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 3, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 6, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 2, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 3, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 6, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 4, subject: "Operating Systems", room: "CS-302" },
          { period: 2, teacherId: 8, subject: "Mobile App Development", room: "CS-303" },
          { period: 3, teacherId: 2, subject: "Database Management Systems", room: "CS-301" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "CS-Lab3" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "CS-Lab3" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      },

      // BTech IT 2nd Year A (Class ID: 4)
      4: {
        Monday: [
          { period: 1, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 2, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 3, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 6, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 2, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 3, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 6, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 2, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 3, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 6, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 2, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 3, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 6, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 7, subject: "Web Development", room: "IT-103" },
          { period: 2, teacherId: 3, subject: "Computer Networks", room: "IT-101" },
          { period: 3, teacherId: 4, subject: "Operating Systems", room: "IT-102" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "IT-Lab1" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "IT-Lab1" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      },

      // BTech IT 2nd Year B (Class ID: 5)
      5: {
        Monday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 2, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 3, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 6, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 2, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 3, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 6, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 2, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 3, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 6, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 2, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 3, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 6, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 5, subject: "Software Engineering", room: "IT-202" },
          { period: 2, teacherId: 7, subject: "Web Development", room: "IT-203" },
          { period: 3, teacherId: 2, subject: "Database Management Systems", room: "IT-201" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "IT-Lab2" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "IT-Lab2" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      },

      // BTech ECE 2nd Year (Class ID: 6)
      6: {
        Monday: [
          { period: 1, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 2, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 3, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 6, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Tuesday: [
          { period: 1, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 2, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 3, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 6, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Wednesday: [
          { period: 1, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 2, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 3, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 6, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Thursday: [
          { period: 1, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 2, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 3, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 6, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ],
        Friday: [
          { period: 1, teacherId: 6, subject: "Machine Learning", room: "ECE-102" },
          { period: 2, teacherId: 8, subject: "Mobile App Development", room: "ECE-103" },
          { period: 3, teacherId: 4, subject: "Operating Systems", room: "ECE-101" },
          { period: 4, teacherId: null, subject: "Break", room: null },
          { period: 5, teacherId: null, subject: "Lab Session", room: "ECE-Lab1" },
          { period: 6, teacherId: null, subject: "Lab Session", room: "ECE-Lab1" },
          { period: 7, teacherId: null, subject: "Free Period", room: null }
        ]
      }
    }
  },

  // Alumni data with graduation years and status
  alumni: [
    {
      id: 1,
      name: "Suresh Menon",
      gradYear: 2015,
      status: "approved",
      comment: "Great learning environment! The faculty was excellent and industry-focused.",
      email: "suresh.menon@gmail.com"
    },
    {
      id: 2,
      name: "Deepika Agarwal",
      gradYear: 2018,
      status: "approved",
      comment: "Excellent technical foundation and placement support. Now working at Google!",
      email: "deepika.agarwal@gmail.com"
    },
    {
      id: 3,
      name: "Rahul Khanna",
      gradYear: 2020,
      status: "approved",
      comment: "The college provided excellent opportunities for research and innovation.",
      email: "rahul.khanna@gmail.com"
    },
    {
      id: 4,
      name: "Karthik Krishnan",
      gradYear: 2021,
      status: "pending",
      comment: "",
      email: "karthik.k@gmail.com"
    },
    {
      id: 5,
      name: "Meera Joshi",
      gradYear: 2019,
      status: "pending",
      comment: "",
      email: "meera.joshi@gmail.com"
    }
  ],

  // System notices
  notices: [
    {
      id: 1,
      date: "2025-09-11",
      message: "Mid-semester examinations will be conducted from September 25th to October 5th. Please check the detailed schedule on the notice board.",
      author: "Academic Office"
    },
    {
      id: 2,
      date: "2025-09-10",
      message: "Annual Tech Fest 'TechnoVision 2025' registrations are now open. Students can register for various technical competitions and workshops.",
      author: "Student Activities Committee"
    },
    {
      id: 3,
      date: "2025-09-09",
      message: "Library will remain open 24/7 during examination period. Students are requested to carry their ID cards for entry after 10 PM.",
      author: "Library Administration"
    },
    {
      id: 4,
      date: "2025-09-08",
      message: "Placement drive by TCS will be conducted on September 20th. Eligible students should submit their resumes by September 15th.",
      author: "Placement Cell"
    },
    {
      id: 5,
      date: "2025-09-07",
      message: "Workshop on 'Machine Learning and AI' by industry experts scheduled for September 18th-19th. Limited seats available.",
      author: "Department of CSE"
    }
  ],

  // Alumni events with dates and descriptions
  alumniEvents: [
    {
      id: 1,
      date: "2025-12-10",
      title: "Annual Alumni Meet 2025",
      description: "Join us for networking, dinner, and celebration of achievements. Guest speaker: CTO of Infosys."
    },
    {
      id: 2,
      date: "2025-11-15",
      title: "Tech Career Guidance Workshop",
      description: "Alumni from FAANG companies will share insights about software engineering careers and interview preparation."
    },
    {
      id: 3,
      date: "2026-01-20",
      title: "Alumni Cricket Tournament",
      description: "Annual cricket tournament with teams from different graduation batches. Prizes and refreshments included."
    }
  ]
});

// Utility functions for data operations

// Update data with immediate sync
export const updateData = (updates) => {
  const currentData = getData() || getDefaultMockData();
  const updatedData = { ...currentData, ...updates };
  return saveData(updatedData) ? updatedData : currentData;
};

// Add record with immediate sync
export const addRecord = (collection, record) => {
  try {
    const currentData = getData() || getDefaultMockData();
    if (!currentData[collection]) currentData[collection] = [];

    // Check for duplicate IDs
    if (currentData[collection].find(item => item.id === record.id)) {
      console.warn(`Record with id ${record.id} already exists`);
      return null;
    }

    currentData[collection].push(record);
    return saveData(currentData) ? currentData : null;
  } catch (error) {
    console.error('Error adding record:', error);
    return null;
  }
};

// Authentication function
export const authenticateUser = (username, password) => {
  try {
    const currentData = getData() || getDefaultMockData();
    const user = currentData.users.find(u => u.username === username && u.password === password);

    if (user) {
      console.log('Authentication successful for:', user.name);
      return user;
    } else {
      console.log('Authentication failed for username:', username);
      return null;
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
};

// Pay fees function
export const payFees = (studentId, amount) => {
  try {
    const currentData = getData() || getDefaultMockData();
    const studentIndex = currentData.students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
      console.error('Student not found');
      return null;
    }

    const student = currentData.students[studentIndex];
    const paymentAmount = Math.min(amount, student.feesRemaining);

    if (paymentAmount <= 0) {
      console.warn('No fees remaining to pay');
      return currentData;
    }

    // Update student fees
    currentData.students[studentIndex] = {
      ...student,
      feesPaid: student.feesPaid + paymentAmount,
      feesRemaining: student.feesRemaining - paymentAmount
    };

    console.log(`Payment processed: ₹${paymentAmount} for student ${student.name}`);
    return saveData(currentData) ? currentData : null;
  } catch (error) {
    console.error('Error processing payment:', error);
    return null;
  }
};

// Update record with immediate sync
export const updateRecord = (collection, id, updates) => {
  try {
    const currentData = getData() || getDefaultMockData();
    if (!currentData[collection]) return null;

    const index = currentData[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    currentData[collection][index] = { ...currentData[collection][index], ...updates };
    return saveData(currentData) ? currentData : null;
  } catch (error) {
    console.error('Error updating record:', error);
    return null;
  }
};

// Delete record with immediate sync
export const deleteRecord = (collection, id) => {
  try {
    const currentData = getData() || getDefaultMockData();
    if (!currentData[collection]) return null;

    currentData[collection] = currentData[collection].filter(item => item.id !== id);
    return saveData(currentData) ? currentData : null;
  } catch (error) {
    console.error('Error deleting record:', error);
    return null;
  }
};