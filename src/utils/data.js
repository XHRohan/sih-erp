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
  // User accounts for login (all roles) - Expanded to 30+ users
  users: [
    // Admin users
    { id: "admin1", role: "admin", name: "System Admin" },
    { id: "admin2", role: "admin", name: "Dr. Principal Sharma" },
    
    // Teacher users - 8 teachers
    { id: "teacher1", role: "teacher", name: "Dr. Rajesh Kumar", teacherId: 1 },
    { id: "teacher2", role: "teacher", name: "Prof. Priya Sharma", teacherId: 2 },
    { id: "teacher3", role: "teacher", name: "Dr. Amit Patel", teacherId: 3 },
    { id: "teacher4", role: "teacher", name: "Ms. Sunita Verma", teacherId: 4 },
    { id: "teacher5", role: "teacher", name: "Dr. Kiran Joshi", teacherId: 5 },
    { id: "teacher6", role: "teacher", name: "Prof. Neha Singh", teacherId: 6 },
    { id: "teacher7", role: "teacher", name: "Dr. Ravi Gupta", teacherId: 7 },
    { id: "teacher8", role: "teacher", name: "Ms. Pooja Agarwal", teacherId: 8 },
    
    // Student users - 20 students
    { id: "student1", role: "student", name: "Arjun Singh", studentId: 1 },
    { id: "student2", role: "student", name: "Sneha Gupta", studentId: 2 },
    { id: "student3", role: "student", name: "Vikram Reddy", studentId: 3 },
    { id: "student4", role: "student", name: "Ananya Iyer", studentId: 4 },
    { id: "student5", role: "student", name: "Rohit Joshi", studentId: 5 },
    { id: "student6", role: "student", name: "Kavya Nair", studentId: 6 },
    { id: "student7", role: "student", name: "Aditya Sharma", studentId: 7 },
    { id: "student8", role: "student", name: "Priya Mehta", studentId: 8 },
    { id: "student9", role: "student", name: "Karthik Rao", studentId: 9 },
    { id: "student10", role: "student", name: "Divya Patel", studentId: 10 },
    { id: "student11", role: "student", name: "Harsh Agarwal", studentId: 11 },
    { id: "student12", role: "student", name: "Riya Bansal", studentId: 12 },
    { id: "student13", role: "student", name: "Nikhil Kumar", studentId: 13 },
    { id: "student14", role: "student", name: "Sakshi Jain", studentId: 14 },
    { id: "student15", role: "student", name: "Varun Malhotra", studentId: 15 },
    { id: "student16", role: "student", name: "Ishita Sinha", studentId: 16 },
    { id: "student17", role: "student", name: "Aryan Kapoor", studentId: 17 },
    { id: "student18", role: "student", name: "Tanvi Bhatt", studentId: 18 },
    { id: "student19", role: "student", name: "Siddharth Mishra", studentId: 19 },
    { id: "student20", role: "student", name: "Nisha Tiwari", studentId: 20 },
    
    // Alumni users
    { id: "alumni1", role: "alumni", name: "Suresh Menon", alumniId: 1 },
    { id: "alumni2", role: "alumni", name: "Deepika Agarwal", alumniId: 2 },
    { id: "alumni3", role: "alumni", name: "Rahul Khanna", alumniId: 3 }
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
    // Class 1 - BTech CSE 3rd Year A (4 students)
    { id: 1, name: "Arjun Singh", dob: "2003-05-21", admissionNumber: "21CSE001", address: "A-45 Sector 12, Noida, UP", phone: "9876543210", email: "arjun.singh@college.edu.in", classId: 1 },
    { id: 2, name: "Sneha Gupta", dob: "2003-08-15", admissionNumber: "21CSE002", address: "B-23 Model Town, Delhi", phone: "9876543211", email: "sneha.gupta@college.edu.in", classId: 1 },
    { id: 3, name: "Aditya Sharma", dob: "2003-02-10", admissionNumber: "21CSE003", address: "C-12 Vasant Kunj, Delhi", phone: "9876543212", email: "aditya.sharma@college.edu.in", classId: 1 },
    { id: 4, name: "Priya Mehta", dob: "2003-12-05", admissionNumber: "21CSE004", address: "D-78 Gurgaon, Haryana", phone: "9876543213", email: "priya.mehta@college.edu.in", classId: 1 },
    
    // Class 2 - BTech CSE 3rd Year B (3 students)
    { id: 5, name: "Vikram Reddy", dob: "2003-03-10", admissionNumber: "21CSE005", address: "15-2-34 Banjara Hills, Hyderabad", phone: "9876543214", email: "vikram.reddy@college.edu.in", classId: 2 },
    { id: 6, name: "Karthik Rao", dob: "2003-06-18", admissionNumber: "21CSE006", address: "MG Road, Bangalore", phone: "9876543215", email: "karthik.rao@college.edu.in", classId: 2 },
    { id: 7, name: "Harsh Agarwal", dob: "2003-09-22", admissionNumber: "21CSE007", address: "Park Street, Kolkata", phone: "9876543216", email: "harsh.agarwal@college.edu.in", classId: 2 },
    
    // Class 3 - BTech CSE 3rd Year C (3 students)
    { id: 8, name: "Ananya Iyer", dob: "2003-11-30", admissionNumber: "21CSE008", address: "12/A Koramangala, Bangalore", phone: "9876543217", email: "ananya.iyer@college.edu.in", classId: 3 },
    { id: 9, name: "Divya Patel", dob: "2003-04-14", admissionNumber: "21CSE009", address: "Satellite, Ahmedabad", phone: "9876543218", email: "divya.patel@college.edu.in", classId: 3 },
    { id: 10, name: "Nikhil Kumar", dob: "2003-07-08", admissionNumber: "21CSE010", address: "Boring Road, Patna", phone: "9876543219", email: "nikhil.kumar@college.edu.in", classId: 3 },
    
    // Class 4 - BTech IT 3rd Year A (4 students)
    { id: 11, name: "Rohit Joshi", dob: "2003-07-18", admissionNumber: "21IT001", address: "Plot 67 Viman Nagar, Pune", phone: "9876543220", email: "rohit.joshi@college.edu.in", classId: 4 },
    { id: 12, name: "Riya Bansal", dob: "2003-10-25", admissionNumber: "21IT002", address: "Connaught Place, Delhi", phone: "9876543221", email: "riya.bansal@college.edu.in", classId: 4 },
    { id: 13, name: "Varun Malhotra", dob: "2003-01-12", admissionNumber: "21IT003", address: "Sector 17, Chandigarh", phone: "9876543222", email: "varun.malhotra@college.edu.in", classId: 4 },
    { id: 14, name: "Ishita Sinha", dob: "2003-08-30", admissionNumber: "21IT004", address: "Salt Lake, Kolkata", phone: "9876543223", email: "ishita.sinha@college.edu.in", classId: 4 },
    
    // Class 5 - BTech IT 3rd Year B (3 students)
    { id: 15, name: "Kavya Nair", dob: "2003-09-25", admissionNumber: "21IT005", address: "TC 15/234 Pattom, Thiruvananthapuram", phone: "9876543224", email: "kavya.nair@college.edu.in", classId: 5 },
    { id: 16, name: "Sakshi Jain", dob: "2003-05-16", admissionNumber: "21IT006", address: "MI Road, Jaipur", phone: "9876543225", email: "sakshi.jain@college.edu.in", classId: 5 },
    { id: 17, name: "Aryan Kapoor", dob: "2003-11-03", admissionNumber: "21IT007", address: "Linking Road, Mumbai", phone: "9876543226", email: "aryan.kapoor@college.edu.in", classId: 5 },
    
    // Class 6 - BTech ECE 3rd Year (3 students)
    { id: 18, name: "Tanvi Bhatt", dob: "2003-03-28", admissionNumber: "21ECE001", address: "CG Road, Ahmedabad", phone: "9876543227", email: "tanvi.bhatt@college.edu.in", classId: 6 },
    { id: 19, name: "Siddharth Mishra", dob: "2003-12-15", admissionNumber: "21ECE002", address: "Hazratganj, Lucknow", phone: "9876543228", email: "siddharth.mishra@college.edu.in", classId: 6 },
    { id: 20, name: "Nisha Tiwari", dob: "2003-06-07", admissionNumber: "21ECE003", address: "Civil Lines, Nagpur", phone: "9876543229", email: "nisha.tiwari@college.edu.in", classId: 6 }
  ],

  // Classes with 7 lectures each - 6 classes
  classes: [
    { id: 1, name: "BTech CSE 3rd Year A", totalLectures: 7 },
    { id: 2, name: "BTech CSE 3rd Year B", totalLectures: 7 },
    { id: 3, name: "BTech CSE 3rd Year C", totalLectures: 7 },
    { id: 4, name: "BTech IT 3rd Year A", totalLectures: 7 },
    { id: 5, name: "BTech IT 3rd Year B", totalLectures: 7 },
    { id: 6, name: "BTech ECE 3rd Year", totalLectures: 7 }
  ],

  // Comprehensive lecture-based attendance structure (by date, class, lecture, teacher)
  attendance: {
    "2025-09-05": {
      1: { // BTech CSE 3rd Year A
        1: { teacherId: 1, lectureNumber: 1, presentStudents: [1, 2, 3] }, // DSA L1
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [1, 2, 4] }, // DBMS L1
        5: { teacherId: 5, lectureNumber: 1, presentStudents: [2, 3, 4] }  // SE L1
      },
      2: { // BTech CSE 3rd Year B
        1: { teacherId: 1, lectureNumber: 1, presentStudents: [5, 6] },    // DSA L1
        3: { teacherId: 3, lectureNumber: 1, presentStudents: [5, 6, 7] }, // Networks L1
        6: { teacherId: 6, lectureNumber: 1, presentStudents: [6, 7] }     // ML L1
      },
      3: { // BTech CSE 3rd Year C
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [8, 9] },    // DBMS L1
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [8, 9, 10] }, // OS L1
        8: { teacherId: 8, lectureNumber: 1, presentStudents: [9, 10] }    // Mobile L1
      }
    },
    "2025-09-06": {
      1: { // BTech CSE 3rd Year A
        1: { teacherId: 1, lectureNumber: 2, presentStudents: [1, 3, 4] }, // DSA L2
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [1, 2, 3] }, // DBMS L2
        5: { teacherId: 5, lectureNumber: 2, presentStudents: [1, 2, 4] }  // SE L2
      },
      4: { // BTech IT 3rd Year A
        3: { teacherId: 3, lectureNumber: 1, presentStudents: [11, 12, 13] }, // Networks L1
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [11, 14] },     // OS L1
        7: { teacherId: 7, lectureNumber: 1, presentStudents: [12, 13, 14] }  // Web Dev L1
      },
      5: { // BTech IT 3rd Year B
        2: { teacherId: 2, lectureNumber: 1, presentStudents: [15, 16] },     // DBMS L1
        5: { teacherId: 5, lectureNumber: 1, presentStudents: [15, 16, 17] }, // SE L1
        7: { teacherId: 7, lectureNumber: 1, presentStudents: [16, 17] }      // Web Dev L1
      }
    },
    "2025-09-07": {
      2: { // BTech CSE 3rd Year B
        1: { teacherId: 1, lectureNumber: 2, presentStudents: [5, 7] },    // DSA L2
        3: { teacherId: 3, lectureNumber: 2, presentStudents: [5, 6] },    // Networks L2
        6: { teacherId: 6, lectureNumber: 2, presentStudents: [5, 6, 7] }  // ML L2
      },
      6: { // BTech ECE 3rd Year
        4: { teacherId: 4, lectureNumber: 1, presentStudents: [18, 19] },  // OS L1
        6: { teacherId: 6, lectureNumber: 1, presentStudents: [18, 20] },  // ML L1
        8: { teacherId: 8, lectureNumber: 1, presentStudents: [19, 20] }   // Mobile L1
      }
    },
    "2025-09-08": {
      1: { // BTech CSE 3rd Year A
        1: { teacherId: 1, lectureNumber: 3, presentStudents: [1, 2] },    // DSA L3
        2: { teacherId: 2, lectureNumber: 3, presentStudents: [2, 3, 4] }, // DBMS L3
        5: { teacherId: 5, lectureNumber: 3, presentStudents: [1, 3] }     // SE L3
      },
      3: { // BTech CSE 3rd Year C
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [8, 10] },   // DBMS L2
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [8, 9] },    // OS L2
        8: { teacherId: 8, lectureNumber: 2, presentStudents: [9, 10] }    // Mobile L2
      }
    },
    "2025-09-09": {
      4: { // BTech IT 3rd Year A
        3: { teacherId: 3, lectureNumber: 2, presentStudents: [11, 12, 14] }, // Networks L2
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [11, 12, 13] }, // OS L2
        7: { teacherId: 7, lectureNumber: 2, presentStudents: [13, 14] }      // Web Dev L2
      },
      5: { // BTech IT 3rd Year B
        2: { teacherId: 2, lectureNumber: 2, presentStudents: [15, 17] },     // DBMS L2
        5: { teacherId: 5, lectureNumber: 2, presentStudents: [15, 16] },     // SE L2
        7: { teacherId: 7, lectureNumber: 2, presentStudents: [16, 17] }      // Web Dev L2
      }
    },
    "2025-09-10": {
      2: { // BTech CSE 3rd Year B
        1: { teacherId: 1, lectureNumber: 3, presentStudents: [5, 6, 7] }, // DSA L3
        3: { teacherId: 3, lectureNumber: 3, presentStudents: [6, 7] },    // Networks L3
        6: { teacherId: 6, lectureNumber: 3, presentStudents: [5, 7] }     // ML L3
      },
      6: { // BTech ECE 3rd Year
        4: { teacherId: 4, lectureNumber: 2, presentStudents: [18, 19, 20] }, // OS L2
        6: { teacherId: 6, lectureNumber: 2, presentStudents: [18, 19] },     // ML L2
        8: { teacherId: 8, lectureNumber: 2, presentStudents: [20] }          // Mobile L2
      }
    }
  },

  // Comprehensive grades by student and subject
  grades: {
    // Class 1 - BTech CSE 3rd Year A
    1: { "Data Structures & Algorithms": 95, "Database Management Systems": 88, "Software Engineering": 92 },
    2: { "Data Structures & Algorithms": 82, "Database Management Systems": 91, "Software Engineering": 85 },
    3: { "Data Structures & Algorithms": 78, "Database Management Systems": 84, "Software Engineering": 89 },
    4: { "Data Structures & Algorithms": 90, "Database Management Systems": 87, "Software Engineering": 93 },
    
    // Class 2 - BTech CSE 3rd Year B
    5: { "Data Structures & Algorithms": 86, "Computer Networks": 89, "Machine Learning": 91 },
    6: { "Data Structures & Algorithms": 93, "Computer Networks": 85, "Machine Learning": 88 },
    7: { "Data Structures & Algorithms": 79, "Computer Networks": 92, "Machine Learning": 86 },
    
    // Class 3 - BTech CSE 3rd Year C
    8: { "Database Management Systems": 87, "Operating Systems": 90, "Mobile App Development": 85 },
    9: { "Database Management Systems": 94, "Operating Systems": 88, "Mobile App Development": 92 },
    10: { "Database Management Systems": 81, "Operating Systems": 86, "Mobile App Development": 89 },
    
    // Class 4 - BTech IT 3rd Year A
    11: { "Computer Networks": 88, "Operating Systems": 91, "Web Development": 94 },
    12: { "Computer Networks": 92, "Operating Systems": 87, "Web Development": 89 },
    13: { "Computer Networks": 85, "Operating Systems": 93, "Web Development": 86 },
    14: { "Computer Networks": 90, "Operating Systems": 84, "Web Development": 91 },
    
    // Class 5 - BTech IT 3rd Year B
    15: { "Database Management Systems": 89, "Software Engineering": 92, "Web Development": 87 },
    16: { "Database Management Systems": 93, "Software Engineering": 88, "Web Development": 90 },
    17: { "Database Management Systems": 86, "Software Engineering": 91, "Web Development": 94 },
    
    // Class 6 - BTech ECE 3rd Year
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