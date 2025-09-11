# College ERP System - Prototype

A comprehensive Educational Resource Planning (ERP) system built with Next.js and Material-UI, featuring role-based dashboards, attendance management, grade tracking, and AI-powered career recommendations.

## 🚀 Features

### 👥 Multi-Role Authentication
- **Admin**: Complete system management and oversight
- **Teacher**: Class management, attendance marking, grade entry
- **Student**: Personal dashboard, attendance tracking, grade viewing
- **Alumni**: Profile management and networking

### 📊 Attendance Management
- **Lecture-based System**: Track attendance for 7 lectures per subject
- **Real-time Calculations**: Automatic percentage calculations
- **Subject-wise Tracking**: Separate attendance for each subject
- **Visual Indicators**: Color-coded attendance levels (Green ≥75%, Yellow ≥50%, Red <50%)

### 📈 Academic Management
- **Grade Tracking**: Subject-wise grade management
- **Performance Analytics**: Average calculations and achievement badges
- **AI Career Recommendations**: OpenAI-powered career guidance based on academic performance

### 🎯 Administrative Features
- **User Management**: Add/edit teachers, students, and classes
- **Notice System**: System-wide announcements and notifications
- **Alumni Management**: Alumni registration approval workflow
- **Data Relationships**: Comprehensive data integrity and relationships

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Material Design**: Clean, intuitive interface using Material-UI
- **Real-time Updates**: Instant feedback and data synchronization
- **Accessibility**: WCAG compliant design patterns

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.3, React 19.1.0
- **UI Framework**: Material-UI (MUI) 7.3.2
- **Data Grid**: MUI X Data Grid 7.22.2
- **Icons**: Material-UI Icons 7.3.2
- **Styling**: Emotion (CSS-in-JS)
- **AI Integration**: OpenAI API for career recommendations
- **Data Storage**: Browser localStorage (prototype)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-erp-prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional - for AI features)
   ```bash
   # Create .env.local file
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production
```bash
npm run build
npm start
```

---

## 👤 User Accounts & Testing

### Admin Accounts
- **System Admin** - Full system access
- **Dr. Principal Sharma** - Administrative oversight

### Teacher Accounts (8 Teachers)
| Name | Subject | Classes |
|------|---------|---------|
| Dr. Rajesh Kumar | Data Structures & Algorithms | CSE 3A, 3B |
| Prof. Priya Sharma | Database Management Systems | CSE 3A, 3C, IT 3B |
| Dr. Amit Patel | Computer Networks | CSE 3B, IT 3A |
| Ms. Sunita Verma | Operating Systems | CSE 3C, IT 3A, ECE 3 |
| Dr. Kiran Joshi | Software Engineering | CSE 3A, IT 3B |
| Prof. Neha Singh | Machine Learning | CSE 3B, ECE 3 |
| Dr. Ravi Gupta | Web Development | IT 3A, 3B, ECE 3 |
| Ms. Pooja Agarwal | Mobile App Development | CSE 3C, ECE 3 |

### Student Accounts (20 Students)
| Class | Students |
|-------|----------|
| BTech CSE 3rd Year A | Arjun Singh, Sneha Gupta, Aditya Sharma, Priya Mehta |
| BTech CSE 3rd Year B | Vikram Reddy, Karthik Rao, Harsh Agarwal |
| BTech CSE 3rd Year C | Ananya Iyer, Divya Patel, Nikhil Kumar |
| BTech IT 3rd Year A | Rohit Joshi, Riya Bansal, Varun Malhotra, Ishita Sinha |
| BTech IT 3rd Year B | Kavya Nair, Sakshi Jain, Aryan Kapoor |
| BTech ECE 3rd Year | Tanvi Bhatt, Siddharth Mishra, Nisha Tiwari |

### Alumni Accounts
- **Suresh Menon** (2015) - Approved
- **Deepika Agarwal** (2018) - Approved  
- **Rahul Khanna** (2020) - Approved

---

## 🧪 Testing Guide

### Quick Testing Flow

1. **Admin Testing**:
   - Login as "System Admin"
   - Add new teacher with subject and class assignments
   - Add new student with complete profile
   - Post system notice
   - Manage alumni approvals

2. **Teacher Testing**:
   - Login as "Dr. Rajesh Kumar"
   - Navigate to "Mark Attendance" tab
   - Select class and lecture number (1-7)
   - Mark students present/absent
   - Switch to "Enter Grades" tab
   - Enter grades for students (0-100)

3. **Student Testing**:
   - Login as "Arjun Singh"
   - View personal profile and achievements
   - Check attendance summary with subject-wise breakdown
   - View grades and average calculation
   - Test AI career recommendation (if OpenAI API configured)
   - Read system notices

4. **Alumni Testing**:
   - Login as "Suresh Menon"
   - View alumni profile and status
   - Browse alumni directory
   - Check alumni events

### Comprehensive Testing

For detailed testing instructions, see:
- **[Attendance Testing Guide](./ATTENDANCE_TESTING_GUIDE.md)** - Complete attendance system testing
- **[Integration Test Checklist](./TESTING_CHECKLIST.md)** - Full system testing checklist
- **[Test Results](./TEST_RESULTS.md)** - Latest test results and status

---

## 📊 System Architecture

### Data Structure
```javascript
{
  users: [],        // Login accounts for all roles
  teachers: [],     // Teacher profiles with subject assignments
  students: [],     // Student profiles with class assignments
  classes: [],      // Class definitions with lecture counts
  alumni: [],       // Alumni profiles and status
  attendance: {},   // Date-based attendance records
  grades: {},       // Student grades by subject
  notices: []       // System announcements
}
```

### Key Relationships
- **Users ↔ Role Data**: Each user account links to specific role data (teacher/student/alumni)
- **Teachers ↔ Classes**: Many-to-many relationship for class assignments
- **Students ↔ Classes**: Each student belongs to one class
- **Attendance**: Links teachers, students, classes, and dates
- **Grades**: Links students to subjects with numerical scores

---

## 🎯 Key Features Deep Dive

### Attendance System
- **7-Lecture Structure**: Each subject supports up to 7 lectures
- **Multi-Class Support**: Teachers can manage multiple classes
- **Real-time Calculations**: Automatic percentage calculations
- **Historical Tracking**: Date-wise attendance records
- **Visual Feedback**: Color-coded attendance indicators

### Grade Management
- **Subject-wise Grades**: Individual grades for each subject
- **Average Calculations**: Automatic GPA calculations
- **Achievement System**: Performance-based badges
- **Progress Tracking**: Historical grade data

### AI Career Recommendations
- **Grade Analysis**: AI analyzes student performance patterns
- **Personalized Suggestions**: Career paths based on strengths
- **Industry Insights**: Current market trends and opportunities
- **Error Handling**: Graceful fallback when API unavailable

---

## 🔧 Configuration

### Environment Variables
```bash
# Optional - for AI career recommendations
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for custom API endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Customization Options

**Mock Data**: Modify `src/utils/data.js` to customize:
- User accounts and roles
- Class structures and subjects
- Sample attendance and grade data
- System notices and announcements

**UI Theming**: Update `src/app/layout.js` for:
- Color schemes and branding
- Typography and spacing
- Component styling overrides

**Feature Toggles**: Configure in component files:
- Enable/disable AI recommendations
- Modify attendance lecture counts
- Customize grade calculation methods

---

## 📱 Responsive Design

The system is fully responsive and tested on:

- **Desktop**: 1920x1080+ (Full feature set)
- **Tablet**: 768x1024 (Optimized layouts)
- **Mobile**: 375x667+ (Touch-friendly interface)

### Mobile Optimizations
- Touch-friendly buttons and inputs
- Collapsible navigation menus
- Horizontal scrolling for data tables
- Optimized form layouts
- Gesture-based interactions

---

## 🚀 Deployment

### Development
```bash
npm run dev    # Start development server
```

### Production Build
```bash
npm run build  # Create production build
npm start      # Start production server
```

### Deployment Platforms
- **Vercel**: Automatic deployment with Git integration
- **Netlify**: Static site deployment with serverless functions
- **Docker**: Containerized deployment for any platform

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent code formatting
- **TypeScript**: Add type definitions for new features
- **Testing**: Include tests for new functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Documentation

### Getting Help
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas
- **Documentation**: Comprehensive guides in the `/docs` folder

### Additional Resources
- **[API Documentation](./docs/API.md)** - Backend API reference
- **[Component Guide](./docs/COMPONENTS.md)** - UI component documentation
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

---

## 🎉 Acknowledgments

- **Material-UI Team** - Excellent React component library
- **Next.js Team** - Powerful React framework
- **OpenAI** - AI-powered career recommendation system
- **Contributors** - All developers who helped build this system

---

**Built with ❤️ for educational institutions worldwide**

---

## 📈 Project Status

- ✅ **Core Features**: Complete and tested
- ✅ **UI/UX**: Responsive design implemented
- ✅ **Data Management**: Full CRUD operations
- ✅ **Authentication**: Role-based access control
- ✅ **Testing**: Comprehensive test suite
- 🔄 **AI Integration**: Basic implementation (expandable)
- 🔄 **Performance**: Optimized for prototype use
- 📋 **Production Ready**: Requires backend integration

**Current Version**: 1.0.0 (Prototype)  
**Last Updated**: September 2025