// OpenAI API utilities for the chatbot
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Get API key from environment variables
const getApiKey = () => {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
};

// Set API key in localStorage for client-side usage
export const setApiKey = (apiKey) => {
    localStorage.setItem('openai_api_key', apiKey);
};

// Remove API key
export const removeApiKey = () => {
    localStorage.removeItem('openai_api_key');
};

// Check if API key is available
export const hasApiKey = () => {
    return !!getApiKey();
};

// Generate system prompt based on user role and context
const generateSystemPrompt = (userRole, userName, context = {}) => {
    const basePrompt = `You are an AI assistant for a College ERP (Educational Resource Planning) system. 
You are helping ${userName}, who is a ${userRole} in the college.

Your role is to:
1. Help with ERP-related questions and tasks
2. Provide guidance on academic matters
3. Assist with system navigation and features
4. Answer questions about college policies and procedures
5. Help with online classroom features and technical issues

Keep responses concise, helpful, and professional. Always consider the user's role when providing information.`;

    const roleSpecificPrompts = {
        admin: `
As an administrator, you have access to:
- Student and teacher management
- Fee collection and tracking
- Notice posting and announcements
- Alumni management and approval
- Online classroom oversight
- System analytics and reports

You can help with administrative tasks, policy questions, and system management.`,

        teacher: `
As a teacher, you have access to:
- Class management and student rosters
- Attendance marking and tracking
- Grade entry and management
- Online classroom features (start/manage classes)
- Student performance analytics
- Notice viewing and communication

You can help with teaching-related tasks, classroom management, and student assessment.`,

        student: `
As a student, you have access to:
- Personal academic information
- Attendance and grade viewing
- Fee payment and status
- Notice and announcement viewing
- Online classroom participation (join classes)
- Timetable and schedule information
- Career guidance and recommendations

You can help with academic questions, system navigation, and study-related guidance.`,

        alumni: `
As an alumni, you have access to:
- Alumni network and connections
- Career opportunities and job postings
- College news and updates
- Alumni events and reunions
- Mentorship programs

You can help with career guidance, networking, and staying connected with the college.`
    };

    return basePrompt + (roleSpecificPrompts[userRole] || '');
};

// Call OpenAI API
export const callOpenAI = async (messages, userRole, userName, context = {}) => {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('OpenAI API key not configured. Please set your API key in the chatbot settings.');
    }

    const systemPrompt = generateSystemPrompt(userRole, userName, context);

    const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
    };

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenAI API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (response.status === 402) {
                throw new Error('Insufficient credits. Please check your OpenAI account billing.');
            } else {
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenAI API');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
};

// Predefined quick responses for common questions
export const getQuickResponses = (userRole) => {
    const commonResponses = [
        "How do I navigate the system?",
        "What features are available to me?",
        "How do I contact support?",
        "Tell me about the online classroom"
    ];

    const roleSpecificResponses = {
        admin: [
            "How do I add a new student?",
            "How do I manage teacher accounts?",
            "How do I post notices?",
            "How do I view fee collection reports?"
        ],
        teacher: [
            "How do I mark attendance?",
            "How do I enter grades?",
            "How do I start an online class?",
            "How do I view my class roster?"
        ],
        student: [
            "How do I check my grades?",
            "How do I pay fees?",
            "How do I join online classes?",
            "How do I view my timetable?"
        ],
        alumni: [
            "How do I update my profile?",
            "How do I find job opportunities?",
            "How do I connect with other alumni?",
            "How do I register for events?"
        ]
    };

    return [...commonResponses, ...(roleSpecificResponses[userRole] || [])];
};

export default {
    callOpenAI,
    setApiKey,
    removeApiKey,
    hasApiKey,
    getQuickResponses
};