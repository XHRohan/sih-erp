# College ERP System - Login Credentials

## 🔐 Authentication System

The College ERP now uses **username/password authentication** instead of role-based selection. All users have unique usernames and passwords.

---

## 👤 **Admin Accounts**

| Username | Password | Name | Role |
|----------|----------|------|------|
| `admin` | `admin123` | System Admin | Admin |
| `principal` | `principal123` | Dr. Principal Sharma | Admin |

**Admin Capabilities:**
- Manage all users, teachers, students, classes
- Create new user accounts with username/password
- View fees summary and student financial data
- Post system notices
- Approve alumni registrations

---

## 👨‍🏫 **Teacher Accounts**

| Username | Password | Name | Subject |
|----------|----------|------|---------|
| `rajesh.kumar` | `teacher123` | Dr. Rajesh Kumar | Data Structures & Algorithms |
| `priya.sharma` | `teacher123` | Prof. Priya Sharma | Database Management Systems |
| `amit.patel` | `teacher123` | Dr. Amit Patel | Computer Networks |
| `sunita.verma` | `teacher123` | Ms. Sunita Verma | Operating Systems |
| `kiran.joshi` | `teacher123` | Dr. Kiran Joshi | Software Engineering |
| `neha.singh` | `teacher123` | Prof. Neha Singh | Machine Learning |
| `ravi.gupta` | `teacher123` | Dr. Ravi Gupta | Web Development |
| `pooja.agarwal` | `teacher123` | Ms. Pooja Agarwal | Mobile App Development |

**Teacher Capabilities:**
- View assigned classes and timetable
- Mark attendance based on timetable periods
- Enter grades for students
- View class rosters and student information

---

## 🎓 **Student Accounts**

### CSE Students
| Username | Password | Name | Class |
|----------|----------|------|-------|
| `21CSE001` | `student123` | Arjun Singh | BTech CSE 3rd Year A |
| `21CSE002` | `student123` | Sneha Gupta | BTech CSE 3rd Year A |
| `21CSE003` | `student123` | Aditya Sharma | BTech CSE 3rd Year A |
| `21CSE004` | `student123` | Priya Mehta | BTech CSE 3rd Year A |
| `21CSE005` | `student123` | Vikram Reddy | BTech CSE 3rd Year B |
| `21CSE006` | `student123` | Karthik Rao | BTech CSE 3rd Year B |
| `21CSE007` | `student123` | Harsh Agarwal | BTech CSE 3rd Year B |
| `21CSE008` | `student123` | Ananya Iyer | BTech CSE 3rd Year C |
| `21CSE009` | `student123` | Divya Patel | BTech CSE 3rd Year C |
| `21CSE010` | `student123` | Nikhil Kumar | BTech CSE 3rd Year C |

### IT Students
| Username | Password | Name | Class |
|----------|----------|------|-------|
| `21IT001` | `student123` | Rohit Joshi | BTech IT 3rd Year A |
| `21IT002` | `student123` | Riya Bansal | BTech IT 3rd Year A |
| `21IT003` | `student123` | Varun Malhotra | BTech IT 3rd Year A |
| `21IT004` | `student123` | Ishita Sinha | BTech IT 3rd Year A |
| `21IT005` | `student123` | Kavya Nair | BTech IT 3rd Year B |
| `21IT006` | `student123` | Sakshi Jain | BTech IT 3rd Year B |
| `21IT007` | `student123` | Aryan Kapoor | BTech IT 3rd Year B |

### ECE Students
| Username | Password | Name | Class |
|----------|----------|------|-------|
| `21ECE001` | `student123` | Tanvi Bhatt | BTech ECE 3rd Year |
| `21ECE002` | `student123` | Siddharth Mishra | BTech ECE 3rd Year |
| `21ECE003` | `student123` | Nisha Tiwari | BTech ECE 3rd Year |

**Student Capabilities:**
- View personal profile and academic information
- Check attendance summary with subject-wise breakdown
- View grades and academic performance
- Access weekly timetable
- Make fee payments (mock system)
- Get AI career recommendations
- Read system notices

---

## 🎓 **Alumni Accounts**

| Username | Password | Name | Graduation Year |
|----------|----------|------|-----------------|
| `suresh.menon` | `alumni123` | Suresh Menon | 2015 |
| `deepika.agarwal` | `alumni123` | Deepika Agarwal | 2018 |
| `rahul.khanna` | `alumni123` | Rahul Khanna | 2020 |

**Alumni Capabilities:**
- View alumni profile and status
- Browse alumni directory
- Check alumni events
- Update personal information

---

## 🔧 **Admin User Management**

Admins can create new user accounts with the following process:

### **Creating New Users**
1. **Login as Admin** (admin/admin123)
2. **Navigate to User Account Management** section
3. **Click "Create User Account"**
4. **Fill in the form**:
   - Full Name
   - Username (must be unique)
   - Password (minimum 6 characters)
   - Email
   - Role (Admin/Teacher/Student/Alumni)
5. **Submit** to create the account

### **Username Conventions**
- **Admins**: `firstname.lastname` or descriptive names
- **Teachers**: `firstname.lastname` format
- **Students**: Admission numbers (e.g., `21CSE001`, `21IT002`)
- **Alumni**: `firstname.lastname` format

---

## 🎯 **Quick Test Scenarios**

### **Scenario 1: Admin Login**
- Username: `admin`
- Password: `admin123`
- **Test**: Create a new user account, manage system data

### **Scenario 2: Teacher Login**
- Username: `rajesh.kumar`
- Password: `teacher123`
- **Test**: Mark attendance, enter grades, view timetable

### **Scenario 3: Student Login**
- Username: `21CSE001`
- Password: `student123`
- **Test**: View timetable, check attendance, pay fees

### **Scenario 4: Alumni Login**
- Username: `suresh.menon`
- Password: `alumni123`
- **Test**: View alumni profile, browse directory

---

## 🔒 **Security Features**

- **Password Visibility Toggle**: Click eye icon to show/hide password
- **Form Validation**: Username and password required
- **Error Handling**: Clear error messages for invalid credentials
- **Session Management**: User sessions stored in localStorage
- **Role-based Access**: Different dashboards based on user role

---

## 🎨 **Enhanced Login Design**

- **Modern Gradient Background**: Purple gradient design
- **Material-UI Components**: Clean, professional interface
- **Demo Credentials Display**: Quick reference chips
- **Responsive Design**: Works on all device sizes
- **Loading States**: Visual feedback during authentication

---

## 📝 **Notes for Testing**

1. **Clear Data**: If you encounter issues, clear localStorage and refresh
2. **Case Sensitive**: Usernames are case-sensitive
3. **Demo Mode**: All passwords are simple for demo purposes
4. **Real Implementation**: In production, use proper password hashing and security

---

**Happy Testing! 🚀**

The new authentication system provides a realistic login experience while maintaining the demo-friendly nature of the application.