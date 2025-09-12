import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    List,
    ListItem,
    Avatar,
    Fab,
    Collapse,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Chat as ChatIcon,
    Send as SendIcon,
    Close as CloseIcon,
    SmartToy as BotIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Clear as ClearIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { callOpenAI, hasApiKey, setApiKey, removeApiKey, getQuickResponses } from '../utils/openai';

const AIChatbot = ({ user, currentPage = 'dashboard' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize with welcome message
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage = {
                id: Date.now(),
                role: 'assistant',
                content: `Hello ${user.name}! 👋 I'm your AI assistant for the College ERP system. I'm here to help you with any questions about the system, your academic information, or general guidance. How can I assist you today?`,
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [user.name, messages.length]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chatbot opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Check if API key is configured
        if (!hasApiKey()) {
            setError('Please configure your OpenAI API key in settings first.');
            setShowSettings(true);
            return;
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare context for the AI
            const context = {
                currentPage,
                userRole: user.role,
                userName: user.name
            };

            // Get conversation history (last 10 messages for context)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Add the new user message
            conversationHistory.push({ role: 'user', content: userMessage.content });

            const aiResponse = await callOpenAI(conversationHistory, user.role, user.name, context);

            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setError(error.message);

            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `I apologize, but I encountered an error: ${error.message}. Please try again or check your API key configuration.`,
                timestamp: new Date(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickResponse = (question) => {
        setInputMessage(question);
        setTimeout(() => handleSendMessage(), 100);
    };

    const handleSaveApiKey = () => {
        if (apiKeyInput.trim()) {
            setApiKey(apiKeyInput.trim());
            setShowSettings(false);
            setApiKeyInput('');
            setError(null);
        }
    };

    const handleRemoveApiKey = () => {
        removeApiKey();
        setShowSettings(false);
        setApiKeyInput('');
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content);
    };

    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const quickResponses = getQuickResponses(user.role);

    return (
        <>
            {/* Floating Action Button */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* Chat Window */}
            <Collapse in={isOpen}>
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 20,
                        width: 380,
                        height: 500,
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BotIcon sx={{ mr: 1 }} />
                            <Box>
                                <Typography variant="h6">AI Assistant</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Support
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Tooltip title="Settings">
                                <IconButton
                                    size="small"
                                    onClick={() => setShowSettings(true)}
                                    sx={{ color: 'white', mr: 1 }}
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Clear Chat">
                                <IconButton
                                    size="small"
                                    onClick={clearChat}
                                    sx={{ color: 'white' }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ m: 1 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            p: 1,
                            bgcolor: 'grey.50'
                        }}
                    >
                        <List sx={{ p: 0 }}>
                            {messages.map((message) => (
                                <ListItem
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                                            width: 32,
                                            height: 32,
                                            mx: 1
                                        }}
                                    >
                                        {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                                    </Avatar>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1.5,
                                            maxWidth: '75%',
                                            bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                                            color: message.role === 'user' ? 'white' : 'text.primary',
                                            borderRadius: 2,
                                            position: 'relative',
                                            ...(message.isError && {
                                                bgcolor: 'error.light',
                                                color: 'error.contrastText'
                                            })
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {message.content}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.7,
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {formatTimestamp(message.timestamp)}
                                            </Typography>
                                            {message.role === 'assistant' && (
                                                <Tooltip title="Copy message">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => copyMessage(message.content)}
                                                        sx={{
                                                            color: 'inherit',
                                                            opacity: 0.7,
                                                            '&:hover': { opacity: 1 }
                                                        }}
                                                    >
                                                        <CopyIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Paper>
                                </ListItem>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <ListItem sx={{ justifyContent: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={16} />
                                        <Typography variant="caption" color="text.secondary">
                                            AI is thinking...
                                        </Typography>
                                    </Box>
                                </ListItem>
                            )}
                        </List>
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Quick Responses */}
                    {messages.length <= 1 && (
                        <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Quick questions:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {quickResponses.slice(0, 4).map((question, index) => (
                                    <Chip
                                        key={index}
                                        label={question}
                                        size="small"
                                        onClick={() => handleQuickResponse(question)}
                                        sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Input */}
                    <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                ref={inputRef}
                                fullWidth
                                size="small"
                                placeholder="Ask me anything about the ERP system..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                multiline
                                maxRows={3}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Collapse>

            {/* Settings Dialog */}
            <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
                <DialogTitle>AI Chatbot Settings</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        To use the AI chatbot, you need to provide your OpenAI API key. This key is stored locally in your browser and is not shared with anyone.
                    </Typography>

                    <TextField
                        fullWidth
                        label="OpenAI API Key"
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="sk-..."
                        helperText="Get your API key from https://platform.openai.com/api-keys"
                        sx={{ mb: 2 }}
                    />

                    <Alert severity="info" sx={{ mb: 2 }}>
                        Your API key is stored securely in your browser's local storage and is only used to communicate with OpenAI's servers.
                    </Alert>

                    {hasApiKey() && (
                        <Alert severity="success">
                            API key is configured and ready to use!
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    {hasApiKey() && (
                        <Button onClick={handleRemoveApiKey} color="error">
                            Remove Key
                        </Button>
                    )}
                    <Button onClick={() => setShowSettings(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveApiKey} variant="contained" disabled={!apiKeyInput.trim()}>
                        Save Key
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AIChatbot;