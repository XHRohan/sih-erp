# Design Document

## Overview

The College ERP prototype will be built as a single-page application using Next.js 15 with App Router and Material UI components. The design emphasizes minimal code through shared components, centralized data management, and role-based content rendering. The application will use localStorage for data persistence with comprehensive mock data initialization.

## Architecture

### Application Structure
```
src/
├── app/
│   ├── layout.js          # Root layout with MUI theme provider (~30 lines)
│   ├── page.js            # Main app with login + dashboard (~80 lines)
│   └── globals.css        # Minimal global styles (~10 lines)
├── components/
│   ├── Dashboard.js       # Shared dashboard + all role views (~200 lines)
│   └── CareerAI.js        # AI career recommendation component (~50 lines)
└── utils/
    └── data.js            # Data management + mock data (~150 lines)
```

**File Size Constraints**:
- Maximum 200 lines per file
- Combine related functionality to minimize file count
- Use inline components for simple UI elements
- Consolidate all role views into single Dashboard.js file

### Technology Stack
- **Frontend Framework**: Next.js 15 with App Router
- **UI Library**: Material UI (MUI) v6
- **State Management**: React useState/useEffect hooks
- **Data Storage**: localStorage with JSON serialization
- **Styling**: MUI default theme with minimal customization

## Components and Interfaces

### 1. Main Application (page.js)
**Purpose**: Single entry point that conditionally renders login or dashboard based on authentication state

**Key Features**:
- Manages global authentication state
- Handles user session persistence
- Renders LoginForm or Dashboard based on login status

### 2. LoginForm Component
**Purpose**: Handles role selection and user authentication

**Interface**:
```javascript
// Props
{
  onLogin: (user) => void
}

// State
{
  selectedRole: 'admin' | 'teacher' | 'student' | 'alumni',
  availableUsers: User[],
  selectedUser: User | null
}
```

**Features**:
- Role selection dropdown (Admin, Teacher, Student, Alumni)
- Dynamic user list based on selected role
- Login button with user session storage

### 3. Dashboard Component
**Purpose**: Shared layout template that renders role-specific content

**Interface**:
```javascript
// Props
{
  user: User,
  onLogout: () => void
}

// User Object Structure
{
  id: string,
  role: 'admin' | 'teacher' | 'student' | 'alumni',
  name: string,
  teacherId?: number,
  studentId?: number,
  alumniId?: number
}
```

**Layout Structure**:
- MUI AppBar with user name and logout button
- MUI Drawer for navigation (role-specific menu items)
- Main content area that renders appropriate RoleView component

### 4. Consolidated Dashboard Component
**Purpose**: Single file containing all role-specific views as inline components to minimize code

**Structure**:
```javascript
// Dashboard.js (~200 lines total)
const Dashboard = ({ user, onLogout }) => {
  // Shared state and functions (20 lines)
  
  // Inline AdminView (40 lines)
  const AdminView = () => (/* Admin content */);
  
  // Inline TeacherView (40 lines) 
  const TeacherView = () => (/* Teacher content */);
  
  // Inline StudentView (50 lines)
  const StudentView = () => (/* Student content + AI career button */);
  
  // Inline AlumniView (30 lines)
  const AlumniView = () => (/* Alumni content */);
  
  // Main render with shared layout (20 lines)
  return (/* Shared AppBar + Drawer + role content */);
};
```

### 5. CareerAI Component
**Purpose**: Standalone component for AI career recommendations

**Interface**:
```javascript
// Props
{
  studentGrades: Object,
  studentName: string
}

// Features
- Button to trigger AI analysis
- Loading state during API call
- Display 2-3 paragraph career recommendation
- Error handling for API failures
```

**API Integration**:
```javascript
const getCareerRecommendation = async (grades, name) => {
  const prompt = `Based on these academic grades: ${JSON.stringify(grades)}, 
    provide a 2-3 paragraph career recommendation for student ${name}. 
    Focus on suitable career paths and next steps.`;
    
  // Call OpenAI GPT API
  const response = await fetch('/api/openai', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  
  return response.json();
};
```

## Data Models

### Core Data Structure (localStorage)
```javascript
{
  // User accounts for login
  users: [
    {
      id: "admin",
      role: "admin",
      name: "System Admin"
    },
    {
      id: "teacher1",
      role: "teacher", 
      name: "Dr. John Smith",
      teacherId: 1
    },
    // ... more users
  ],

  // Teacher information
  teachers: [
    {
      id: 1,
      name: "Dr. John Smith",
      subject: "Mathematics",
      classes: [1, 2] // Max 2-3 classes
    }
  ],

  // Student information  
  students: [
    {
      id: 1,
      name: "Alice Johnson",
      dob: "2004-05-21",
      admissionNumber: "A2023001",
      address: "123 College Street",
      phone: "9876543210",
      email: "alice@example.com",
      classId: 1
    }
  ],

  // Class information
  classes: [
    {
      id: 1,
      name: "Class 10A",
      totalLectures: 7
    }
  ],

  // Attendance tracking (by date, class, lecture, teacher)
  attendance: {
    "2025-09-11": {
      classId: 1,
      teacherId: 1,
      lectureNumber: 1,
      presentStudents: [1, 3, 5] // student IDs
    }
  },

  // Grades by student and subject
  grades: {
    1: { // studentId
      "Mathematics": 95,
      "Science": 88
    }
  },

  // System notices
  notices: [
    {
      id: 1,
      date: "2025-09-11",
      message: "Mid-term exams start next week",
      author: "Admin"
    }
  ],

  // Alumni data
  alumni: [
    {
      id: 1,
      name: "Mark Lee",
      gradYear: 2015,
      status: "approved",
      comment: "Great learning environment!"
    }
  ],

  // Alumni events
  alumniEvents: [
    {
      id: 1,
      date: "2025-12-10",
      title: "Annual Alumni Meet",
      description: "Networking and celebration"
    }
  ]
}
```

### Badge Calculation Logic
```javascript
// Automatic badge assignment rules
const calculateBadges = (studentId) => {
  const attendancePercentage = calculateAttendancePercentage(studentId);
  const averageGrade = calculateAverageGrade(studentId);
  
  const badges = [];
  
  if (attendancePercentage >= 90) {
    badges.push("Excellent Attendance");
  }
  
  if (averageGrade >= 85) {
    badges.push("Top Performer");
  }
  
  if (attendancePercentage >= 95 && averageGrade >= 90) {
    badges.push("Outstanding Student");
  }
  
  return badges;
};
```

## Error Handling

### Data Validation
- Form input validation using MUI form components with built-in validation
- Data type checking before localStorage operations
- Graceful handling of corrupted localStorage data with re-initialization

### User Experience
- Loading states for data operations
- Success/error feedback using MUI Snackbar
- Confirmation dialogs for destructive actions (delete, logout)

### Error Recovery
```javascript
// Robust data initialization
const initializeData = () => {
  try {
    const existingData = localStorage.getItem('erpData');
    return existingData ? JSON.parse(existingData) : getDefaultMockData();
  } catch (error) {
    console.warn('Data corruption detected, reinitializing...');
    return getDefaultMockData();
  }
};
```

## Testing Strategy

### Component Testing
- Unit tests for utility functions (data.js)
- Component rendering tests for each role view
- Form submission and validation testing
- Badge calculation logic testing

### Integration Testing
- End-to-end user flows for each role
- Data persistence across browser sessions
- Role-based access control verification

### Mock Data Testing
- Comprehensive mock data covering all scenarios
- Edge cases (empty classes, perfect attendance, etc.)
- Data relationships integrity (teacher-class assignments, student-class enrollment)

## Performance Considerations

### Code Optimization
- Shared component architecture reduces bundle size
- Minimal MUI component imports (tree-shaking)
- Efficient localStorage operations with batched updates

### Data Management
- Lazy loading of large data sets
- Efficient attendance percentage calculations
- Memoized badge calculations to prevent unnecessary re-computation

### User Experience
- Instant feedback for all user actions
- Optimistic UI updates with localStorage sync
- Responsive design using MUI's built-in breakpoint system

## Security Considerations

### Data Protection
- Client-side only application (no sensitive data transmission)
- Input sanitization for all form submissions
- Safe JSON parsing with error handling

### Access Control
- Role-based view restrictions
- Session management through localStorage
- Logout functionality to clear sensitive data

## Implementation Notes

### Code Minimization Strategy
- **Inline Components**: Use inline functional components within Dashboard.js instead of separate files
- **Shared Logic**: Extract common patterns into utility functions
- **MUI Defaults**: Rely heavily on MUI's built-in styling and behavior
- **Conditional Rendering**: Use ternary operators and logical AND for view switching
- **Compact Syntax**: Use arrow functions, destructuring, and modern JS features

### File Organization
- **Total Files**: 6 files maximum
- **Line Limits**: No file exceeds 200 lines
- **Consolidation**: Combine related functionality aggressively
- **Mock Data**: Generate comprehensive but compact mock data

### MUI Integration
- Use MUI's default theme exclusively
- Leverage MUI components: DataGrid, AppBar, Drawer, Card, Dialog, Snackbar, Button
- No custom CSS files beyond globals.css
- Use sx prop for minimal styling adjustments

### AI Career Recommendation
- **API Route**: Create `/api/openai` endpoint for GPT integration
- **Environment Variable**: Use `OPENAI_API_KEY` for authentication
- **Prompt Engineering**: Send structured grade data with optimized prompt
- **Error Handling**: Graceful fallback if API fails
- **UI Integration**: Simple button in student view with modal display

### Development Workflow
1. Set up data structure and utility functions (data.js)
2. Create consolidated Dashboard component with all role views
3. Add AI career recommendation feature
4. Implement form handling and validation
5. Add error handling and loading states