# Implementation Plan

- [x] 1. Set up project dependencies and basic structure





  - Install Material UI and required dependencies (@mui/material, @emotion/react, @emotion/styled)
  - Create minimal globals.css with basic reset styles
  - Set up Next.js layout.js with MUI ThemeProvider and CssBaseline
  - _Requirements: 6.4, 6.5_

- [x] 2. Create centralized data management system





  - Implement data.js utility with getData() and saveData() functions for localStorage operations
  - Create comprehensive mock data structure including users, teachers, students, classes, attendance, grades, notices, alumni, and events
  - Add data initialization function that loads mock data on first app launch
  - Include lecture-based attendance structure (7 lectures per class, teacher assignments)
  - _Requirements: 7.1, 7.2, 7.3, 3.1_

- [x] 3. Build main application page with authentication





  - Create page.js with login/dashboard state management using useState
  - Implement LoginForm component with role selection dropdown and user list
  - Add authentication logic that stores user session in localStorage
  - Handle login/logout functionality with proper state updates
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Create consolidated Dashboard component with shared layout





  - Build Dashboard.js with MUI AppBar, Drawer navigation, and main content area
  - Implement role-based navigation menu that shows different options per user type
  - Add logout functionality in AppBar with user name display
  - Create responsive layout using MUI Grid and Container components
  - _Requirements: 6.1, 8.1, 8.4_

- [x] 5. Implement AdminView functionality within Dashboard





  - Add inline AdminView component with MUI DataGrid tables for teachers, students, classes, alumni
  - Create add new entity dialogs using MUI Dialog components for teachers, students, classes
  - Implement notice posting form with date and message fields
  - Add alumni request management with approve/reject buttons
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 6. Implement TeacherView functionality within Dashboard






  - Add inline TeacherView component showing assigned classes and subject
  - Create lecture selection interface for attendance marking (1-7 lectures per class)
  - Build student roster with checkboxes for attendance marking per lecture
  - Implement grade entry forms for the teacher's assigned subject
  - Save attendance data with date, class, lecture number, and present student IDs
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7. Implement StudentView with profile and academic data






  - Add inline StudentView component displaying complete student profile (name, DOB, admission number, address, phone, email)
  - Create compiled attendance report showing lecture-wise attendance across all subjects
  - Calculate and display overall attendance percentage
  - Show current grades across all subjects in organized format
  - Display notices list for student announcements
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 8. Add automatic badge calculation system






  - Implement badge calculation logic in StudentView (Excellent Attendance ≥90%, Top Performer ≥85% average)
  - Create badge display component using MUI Chip components
  - Add "Outstanding Student" badge for students with ≥95% attendance and ≥90% average grades
  - Ensure badges update automatically when viewing student profile
  - _Requirements: 4.4, 4.6_

- [x] 9. Create AI career recommendation feature






  - Build CareerAI.js component with button to trigger career analysis
  - Create /api/openai API route that accepts student grade data and calls GPT API
  - Implement prompt engineering to send structured grade data and request 2-3 paragraph career recommendation
  - Add loading state and error handling for API calls
  - Display career recommendation in MUI Dialog with formatted text
  - _Requirements: 4.4 (extended functionality)_

- [x] 10. Implement AlumniView functionality within Dashboard






  - Add inline AlumniView component with alumni directory showing graduation years
  - Create upcoming events list displaying alumni events with dates and descriptions
  - Build testimonial submission form for alumni comments
  - Add alumni membership application form with status tracking
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 11. Add form validation and user feedback






  - Implement form validation for all input forms using MUI form components with built-in validation
  - Add MUI Snackbar components for success/error feedback on data operations
  - Create confirmation dialogs for destructive actions (delete entries, logout)
  - Add loading states for data operations and API calls
  - _Requirements: 8.3, 8.5_

- [x] 12. Implement data persistence and error handling






  - Add robust error handling for localStorage operations with try-catch blocks
  - Implement data corruption detection and automatic re-initialization with mock data
  - Ensure all data changes immediately sync to localStorage
  - Add graceful handling of missing or invalid data with fallback values
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 13. Final integration and testing






  - Test all user flows: login for each role, data operations, logout functionality
  - Verify attendance calculation works correctly with lecture-based system
  - Test AI career recommendation with sample grade data
  - Ensure responsive design works across different screen sizes
  - Validate that all mock data displays correctly and relationships work
  - _Requirements: 8.2, 8.4, 8.5_