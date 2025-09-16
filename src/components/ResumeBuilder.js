import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Paper,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AutoAwesome as AIIcon,
  Lightbulb as SuggestionIcon,
  Psychology as BrainIcon
} from '@mui/icons-material';
import { callOpenAI, hasApiKey } from '../utils/openai';

const ResumeBuilder = ({ student, data, onBack }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      objective: ''
    },
    education: [
      {
        id: 1,
        institution: 'Current College',
        degree: data.classes.find(c => c.id === student.classId)?.name || '',
        year: '2021-2025',
        grade: 'Current'
      }
    ],
    experience: [],
    skills: [],
    projects: [],
    achievements: []
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const resumeRef = useRef();

  // Calculate GPA from grades
  const calculateGPA = () => {
    const grades = data.grades[student.id];
    if (!grades || Object.keys(grades).length === 0) return 'N/A';
    
    const gradeValues = Object.values(grades);
    const average = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
    return (average / 10).toFixed(2); // Convert percentage to 10-point scale
  };

  // AI-powered content generation
  const generateAIContent = async (type, context = {}) => {
    if (!hasApiKey()) {
      alert('Please configure your OpenAI API key in the chatbot settings to use AI features.');
      return;
    }

    setAiLoading(true);
    try {
      let prompt = '';
      const studentInfo = {
        name: student.name,
        course: data.classes.find(c => c.id === student.classId)?.name || '',
        gpa: calculateGPA(),
        subjects: Object.keys(data.grades[student.id] || {}),
        year: '2nd Year' // Could be calculated from admission date
      };

      switch (type) {
        case 'objective':
          prompt = `Write a professional career objective for a ${studentInfo.year} ${studentInfo.course} student named ${studentInfo.name} with a GPA of ${studentInfo.gpa}. The objective should be 2-3 sentences, highlighting their academic focus and career aspirations. Make it specific to their field of study.`;
          break;
        
        case 'skills':
          prompt = `Suggest 8-10 relevant technical and soft skills for a ${studentInfo.course} student. Include programming languages, tools, frameworks, and soft skills relevant to their field. Return as a comma-separated list.`;
          break;
        
        case 'project_ideas':
          prompt = `Suggest 3 academic project ideas suitable for a ${studentInfo.year} ${studentInfo.course} student. For each project, provide: project name, brief description (1-2 sentences), and suggested technologies. Format as: "Project Name: Description | Technologies: tech1, tech2, tech3"`;
          break;
        
        case 'improve_description':
          prompt = `Improve this ${context.type} description to be more professional and impactful for a resume: "${context.description}". Make it concise, action-oriented, and highlight achievements. Keep it under 100 words.`;
          break;
        
        case 'experience_description':
          prompt = `Write a professional description for a ${context.position} role at ${context.company} for a ${studentInfo.course} student. Include 2-3 bullet points highlighting responsibilities and achievements. Make it relevant to their field of study.`;
          break;
        
        default:
          return;
      }

      const response = await callOpenAI(
        [{ role: 'user', content: prompt }],
        'student',
        student.name,
        { resumeBuilder: true, studentInfo }
      );

      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI content: ' + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Generate AI suggestions for current section
  const generateSuggestions = async (type) => {
    const suggestions = await generateAIContent(type);
    if (suggestions) {
      setAiSuggestions(suggestions.split('\n').filter(s => s.trim()));
      setShowAiPanel(true);
    }
  };

  // Auto-fill with AI content
  const autoFillWithAI = async (type, targetField) => {
    const content = await generateAIContent(type);
    if (content) {
      if (type === 'objective') {
        handleUpdatePersonalInfo('objective', content.trim());
      } else if (type === 'skills') {
        const skills = content.split(',').map(skill => ({
          id: Date.now() + Math.random(),
          name: skill.trim()
        }));
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, ...skills]
        }));
      }
    }
  };

  // Improve existing content with AI
  const improveWithAI = async (type, currentContent, callback) => {
    const improved = await generateAIContent('improve_description', {
      type,
      description: currentContent
    });
    if (improved && callback) {
      callback(improved.trim());
    }
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSaveItem = () => {
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      ...formData
    };

    setResumeData(prev => {
      const updated = { ...prev };
      
      if (editingItem) {
        // Update existing item
        const index = updated[dialogType].findIndex(item => item.id === editingItem.id);
        if (index !== -1) {
          updated[dialogType][index] = newItem;
        }
      } else {
        // Add new item
        updated[dialogType] = [...updated[dialogType], newItem];
      }
      
      return updated;
    });

    handleCloseDialog();
  };

  const handleDeleteItem = (type, id) => {
    setResumeData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const handleUpdatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const generatePDF = () => {
    // In a real application, you would use a library like jsPDF or react-pdf
    // For now, we'll use the browser's print functionality
    const printWindow = window.open('', '_blank');
    const resumeHTML = generateResumeHTML();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.4; }
            .resume { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .contact { font-size: 12px; color: #666; }
            .section { margin-bottom: 15px; }
            .section-title { font-size: 16px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; margin-bottom: 8px; }
            .item { margin-bottom: 8px; }
            .item-title { font-weight: bold; }
            .item-subtitle { font-style: italic; color: #666; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill { background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${resumeHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const generateResumeHTML = () => {
    return `
      <div class="resume">
        <div class="header">
          <div class="name">${resumeData.personalInfo.name}</div>
          <div class="contact">
            ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.address}
          </div>
        </div>

        ${resumeData.personalInfo.objective ? `
          <div class="section">
            <div class="section-title">OBJECTIVE</div>
            <div>${resumeData.personalInfo.objective}</div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">EDUCATION</div>
          ${resumeData.education.map(edu => `
            <div class="item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-subtitle">${edu.institution} | ${edu.year} | GPA: ${edu.grade}</div>
            </div>
          `).join('')}
        </div>

        ${resumeData.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">EXPERIENCE</div>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.position} - ${exp.company}</div>
                <div class="item-subtitle">${exp.duration}</div>
                <div>${exp.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.projects.length > 0 ? `
          <div class="section">
            <div class="section-title">PROJECTS</div>
            ${resumeData.projects.map(project => `
              <div class="item">
                <div class="item-title">${project.name}</div>
                <div class="item-subtitle">${project.technologies}</div>
                <div>${project.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills.length > 0 ? `
          <div class="section">
            <div class="section-title">SKILLS</div>
            <div class="skills">
              ${resumeData.skills.map(skill => `<span class="skill">${skill.name}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${resumeData.achievements.length > 0 ? `
          <div class="section">
            <div class="section-title">ACHIEVEMENTS</div>
            ${resumeData.achievements.map(achievement => `
              <div class="item">
                <div class="item-title">${achievement.title}</div>
                <div>${achievement.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  };

  const renderFormFields = () => {
    switch (dialogType) {
      case 'education':
        return (
          <>
            <TextField
              fullWidth
              label="Institution"
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Degree/Course"
              value={formData.degree || ''}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Year"
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Grade/GPA"
              value={formData.grade || ''}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              margin="normal"
            />
          </>
        );
      case 'experience':
        return (
          <>
            <TextField
              fullWidth
              label="Position"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Company"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Duration"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              margin="normal"
              placeholder="e.g., June 2023 - August 2023"
            />
            <Box>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<AIIcon />}
                  onClick={async () => {
                    if (formData.position && formData.company) {
                      const description = await generateAIContent('experience_description', {
                        position: formData.position,
                        company: formData.company
                      });
                      if (description) {
                        setFormData({ ...formData, description: description.trim() });
                      }
                    }
                  }}
                  disabled={aiLoading || !formData.position || !formData.company}
                  variant="outlined"
                  color="primary"
                >
                  AI Generate
                </Button>
                {formData.description && (
                  <Button
                    size="small"
                    startIcon={<BrainIcon />}
                    onClick={async () => {
                      const improved = await generateAIContent('improve_description', {
                        type: 'experience',
                        description: formData.description
                      });
                      if (improved) {
                        setFormData({ ...formData, description: improved.trim() });
                      }
                    }}
                    disabled={aiLoading}
                    variant="outlined"
                    color="secondary"
                  >
                    AI Improve
                  </Button>
                )}
              </Box>
            </Box>
          </>
        );
      case 'skills':
        return (
          <TextField
            fullWidth
            label="Skill"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            placeholder="e.g., JavaScript, Python, React"
          />
        );
      case 'projects':
        return (
          <>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Technologies Used"
              value={formData.technologies || ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              margin="normal"
              placeholder="e.g., React, Node.js, MongoDB"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
            />
          </>
        );
      case 'achievements':
        return (
          <>
            <TextField
              fullWidth
              label="Achievement Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
            />
          </>
        );
      default:
        return null;
    }
  };

  if (showPreview) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Resume Preview</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setShowPreview(false)}
              sx={{ mr: 2 }}
            >
              Back to Editor
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={generatePDF}
            >
              Download PDF
            </Button>
          </Box>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            maxWidth: 800, 
            margin: '0 auto',
            minHeight: '11in',
            bgcolor: 'white'
          }}
          ref={resumeRef}
        >
          <div dangerouslySetInnerHTML={{ __html: generateResumeHTML() }} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" gutterBottom>
              Resume Builder
            </Typography>
            {hasApiKey() && (
              <Chip 
                icon={<AIIcon />} 
                label="AI Powered" 
                color="primary" 
                size="small"
                sx={{ mb: 1 }}
              />
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            Create a professional resume for {student.name}
            {hasApiKey() && ' with AI assistance'}
          </Typography>
          {!hasApiKey() && (
            <Alert severity="info" sx={{ mt: 1, maxWidth: 400 }}>
              Configure OpenAI API key in the chatbot to unlock AI features!
            </Alert>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<AIIcon />}
            onClick={async () => {
              if (!hasApiKey()) {
                alert('Please configure your OpenAI API key in the chatbot settings to use AI features.');
                return;
              }
              
              // Auto-generate basic resume content
              setAiLoading(true);
              try {
                // Generate objective if empty
                if (!resumeData.personalInfo.objective) {
                  await autoFillWithAI('objective');
                }
                
                // Generate skills if empty
                if (resumeData.skills.length === 0) {
                  await autoFillWithAI('skills');
                }
                
                alert('AI has enhanced your resume with suggested content!');
              } catch (error) {
                console.error('Smart resume error:', error);
              } finally {
                setAiLoading(false);
              }
            }}
            disabled={aiLoading}
            sx={{ mr: 2 }}
          >
            {aiLoading ? 'Generating...' : 'AI Smart Fill'}
          </Button>
          <Button
            variant="contained"
            startIcon={<PreviewIcon />}
            onClick={() => setShowPreview(true)}
          >
            Preview Resume
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                  <EditIcon />
                </Avatar>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => handleUpdatePersonalInfo('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handleUpdatePersonalInfo('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handleUpdatePersonalInfo('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={resumeData.personalInfo.address}
                    onChange={(e) => handleUpdatePersonalInfo('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      label="Career Objective"
                      multiline
                      rows={3}
                      value={resumeData.personalInfo.objective}
                      onChange={(e) => handleUpdatePersonalInfo('objective', e.target.value)}
                      placeholder="Write a brief career objective or summary..."
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<AIIcon />}
                        onClick={() => autoFillWithAI('objective')}
                        disabled={aiLoading}
                        variant="outlined"
                        color="primary"
                      >
                        {aiLoading ? 'Generating...' : 'AI Generate'}
                      </Button>
                      {resumeData.personalInfo.objective && (
                        <Button
                          size="small"
                          startIcon={<BrainIcon />}
                          onClick={() => improveWithAI('objective', resumeData.personalInfo.objective, 
                            (improved) => handleUpdatePersonalInfo('objective', improved))}
                          disabled={aiLoading}
                          variant="outlined"
                          color="secondary"
                        >
                          AI Improve
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Education */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  Education
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('education')}
                >
                  Add
                </Button>
              </Box>
              <List>
                {resumeData.education.map((edu, index) => (
                  <React.Fragment key={edu.id}>
                    <ListItem>
                      <ListItemText
                        primary={edu.degree}
                        secondary={`${edu.institution} | ${edu.year} | ${edu.grade}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton size="small" onClick={() => handleOpenDialog('education', edu)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteItem('education', edu.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < resumeData.education.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  Experience
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('experience')}
                >
                  Add
                </Button>
              </Box>
              {resumeData.experience.length > 0 ? (
                <List>
                  {resumeData.experience.map((exp, index) => (
                    <React.Fragment key={exp.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${exp.position} - ${exp.company}`}
                          secondary={`${exp.duration} | ${exp.description}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => handleOpenDialog('experience', exp)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('experience', exp.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < resumeData.experience.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No experience added yet. Add internships, part-time jobs, or volunteer work.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ mr: 1 }} />
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<AIIcon />}
                    onClick={() => autoFillWithAI('skills')}
                    disabled={aiLoading}
                    variant="outlined"
                    color="primary"
                  >
                    AI Suggest
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('skills')}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {resumeData.skills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    onDelete={() => handleDeleteItem('skills', skill.id)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {resumeData.skills.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add your technical and soft skills
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Projects */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Projects</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SuggestionIcon />}
                    onClick={() => generateSuggestions('project_ideas')}
                    disabled={aiLoading}
                    variant="outlined"
                    color="primary"
                  >
                    AI Ideas
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('projects')}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              {resumeData.projects.length > 0 ? (
                <List>
                  {resumeData.projects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <ListItem>
                        <ListItemText
                          primary={project.name}
                          secondary={`${project.technologies} | ${project.description}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => handleOpenDialog('projects', project)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('projects', project.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < resumeData.projects.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Add your academic or personal projects
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Achievements & Awards</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('achievements')}
                >
                  Add
                </Button>
              </Box>
              {resumeData.achievements.length > 0 ? (
                <List>
                  {resumeData.achievements.map((achievement, index) => (
                    <React.Fragment key={achievement.id}>
                      <ListItem>
                        <ListItemText
                          primary={achievement.title}
                          secondary={achievement.description}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => handleOpenDialog('achievements', achievement)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem('achievements', achievement.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < resumeData.achievements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Add your achievements, awards, or certifications
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>
          {renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Suggestions Panel */}
      <Dialog open={showAiPanel} onClose={() => setShowAiPanel(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon sx={{ mr: 1 }} />
          AI Suggestions
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Here are AI-generated suggestions based on your profile. Click on any suggestion to use it.
          </Alert>
          <List>
            {aiSuggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={() => {
                    // Handle different types of suggestions
                    if (suggestion.includes('Project Name:')) {
                      // Parse project suggestion
                      const parts = suggestion.split('|');
                      const nameDesc = parts[0].split(':');
                      const techPart = parts[1] ? parts[1].split(':')[1] : '';
                      
                      const projectData = {
                        id: Date.now() + index,
                        name: nameDesc[0].replace('Project Name', '').trim(),
                        description: nameDesc[1] ? nameDesc[1].trim() : '',
                        technologies: techPart.trim()
                      };
                      
                      setResumeData(prev => ({
                        ...prev,
                        projects: [...prev.projects, projectData]
                      }));
                    } else {
                      // Handle other suggestions (copy to clipboard or show in a field)
                      navigator.clipboard.writeText(suggestion);
                    }
                    setShowAiPanel(false);
                  }}
                >
                  <ListItemText 
                    primary={suggestion}
                    secondary="Click to use this suggestion"
                  />
                </ListItem>
                {index < aiSuggestions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAiPanel(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeBuilder;