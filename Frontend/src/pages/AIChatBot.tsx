import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Send,
  Upload,
  FileText,
  Bot,
  User,
  X,
  Paperclip,
  Menu,
  Plus,
  MessageSquare,
  Trash2,
  AlertCircle,
  Languages,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import TypingDots from '../components/TypingDots';
import AnimatedCursor from '../components/AnimatedCursor';

// --- Constants ---
const API_URL = 'http://localhost:8000';

// --- Type Definitions ---

/**
 * @interface Message
 * Defines the structure for a single chat message within a session.
 */
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

/**
 * @interface ChatSession
 * Defines the structure for a complete chat session, including its metadata and message history.
 */
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

/**
 * @component AIChatBot
 * This is the primary component for the AI-powered chat interface. It manages all state,
 * handles API communication with the backend, and renders the entire chat UI including
 * the chat history sidebar, message display area, and input form.
 */
const AIChatBot: React.FC = () => {
  // --- State Management ---

  /** The currently authenticated user object from AuthContext. */
  const { user } = useAuth();
  /** For UI string translations. */

  /** The ID of the currently active chat session. */
  const [currentSessionId, setCurrentSessionId] = useState<string>('initial-session');

  /** An array holding all chat sessions for the user. */
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'initial-session',
      title: 'New Chat',
      lastUpdated: new Date(),
      messages: [
        {
          id: 'welcome-message',
          type: 'assistant',
          content: "Hello! I'm your AI Document Assistant. I can help you understand documents, verify their authenticity, and explain complex legal terms. How can I assist you today?",
          timestamp: new Date(),
        },
      ],
    },
  ]);

  /** The current text content of the user input field. */
  const [inputMessage, setInputMessage] = useState<string>('');
  /** A boolean flag indicating if the app is waiting for an API response. */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /** A boolean flag to control the visibility of the chat history sidebar. */
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  /** A string to hold and display any errors from the API communication. */
  const [apiError, setApiError] = useState<string | null>(null);
  /** The file object that the user has selected for upload. */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  /** The target language for the AI's response. */
  const [targetLanguage, setTargetLanguage] = useState<string>('English');

  // --- Refs ---

  /** A ref to the hidden file input element for programmatic triggering. */
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** A ref to an empty div at the end of the message list to enable smooth scrolling. */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Memoized Values ---

  /** Memoized calculation to find the current chat session object. */
  const currentSession = useMemo(() =>
    chatSessions.find(session => session.id === currentSessionId),
    [chatSessions, currentSessionId]
  );

  /** Memoized calculation to get the messages of the current session. */
  const messages = useMemo(() => currentSession?.messages || [], [currentSession]);


  // --- Core API Communication ---

  /**
   * Handles the entire process of sending a message (text and/or file) to the backend API.
   * This function is designed to be the single point of contact with the server.
   */
  const handleSendMessage = useCallback(async () => {
    // Prevent sending empty messages or if a request is already in progress.
    if ((!inputMessage.trim() && !selectedFile) || isLoading) return;
    if (!user) {
      setApiError("You must be logged in to use the chat.");
      return;
    }

    const prompt = inputMessage.trim() || `Analyze this file: ${selectedFile?.name}`;
    const fileToSend = selectedFile;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
      attachments: fileToSend ? [{
        name: fileToSend.name,
        type: fileToSend.type,
        size: (fileToSend.size / 1024).toFixed(1) + ' KB',
      }] : undefined,
    };

    // --- UI Update (Optimistic) ---
    // Update the UI immediately with the user's message for a responsive feel.
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              lastUpdated: new Date(),
              title: session.title === 'New Chat' ? (fileToSend?.name || prompt.slice(0, 30) + '...') : session.title,
            }
          : session
      )
    );
    
    // Clear inputs after capturing their values
    setInputMessage('');
    setSelectedFile(null);
    setIsLoading(true);
    setApiError(null);

    // --- Form Data Preparation ---
    const formData = new FormData();
    formData.append('user_id', user.uid);
    formData.append('prompt', prompt);
    formData.append('target_language', targetLanguage);
    if (fileToSend) {
      formData.append('file', fileToSend);
    }

    // --- API Call ---
    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An unknown error occurred on the server.');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      // Update the session with the AI's actual response.
      setChatSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, aiResponse] }
            : session
        )
      );
    } catch (error: any) {
      console.error("API Communication Error:", error);
      setApiError(error.message);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'm sorry, but I encountered an error: ${error.message}`,
        timestamp: new Date()
      };
      setChatSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, errorResponse] }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, inputMessage, selectedFile, currentSessionId, targetLanguage, chatSessions]);

  // --- Event Handlers ---

  /**
   * Triggered by the file input's onChange event. It updates the `selectedFile` state
   * but does not send the file.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    if (event.target) {
      event.target.value = ''; // Reset to allow re-selecting the same file
    }
  };

  /** Programmatically clicks the hidden file input. */
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  /** Handles the Enter key press for sending messages. */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // --- Chat Session Management ---

  /** Creates a new, empty chat session and sets it as the active one. */
  const createNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [
        {
          id: `welcome-${newSessionId}`,
          type: 'assistant',
          content: "Hello! How can I assist you with your documents today?",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false);
  };

  /**
   * Deletes a chat session from the state.
   * @param {React.MouseEvent} e - The click event.
   * @param {string} sessionId - The ID of the session to delete.
   */
  const deleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setChatSessions(prev => {
      const filtered = prev.filter(session => session.id !== sessionId);
      if (sessionId === currentSessionId && filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
      } else if (filtered.length === 0) {
        createNewChat();
      }
      return filtered;
    });
  };

  /**
   * Switches the active chat session.
   * @param {string} sessionId - The ID of the session to switch to.
   */
  const switchChat = (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
  };

  // --- Effects ---

  /** Effect to automatically scroll to the latest message. */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // --- Render Method ---
  return (
    <PageTransition>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <AnimatedCursor />
        <div className="flex h-[calc(100vh-12rem)] bg-white/95 dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">

          {/* Sidebar for Chat History */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
                className="flex flex-col border-r w-80 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Chat History</h3>
                    <motion.button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 lg:hidden"
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={createNewChat}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Chat</span>
                  </motion.button>
                </div>

                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {chatSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      layout
                      className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        session.id === currentSessionId
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => switchChat(session.id)}
                      whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1 space-x-2">
                            <MessageSquare className="flex-shrink-0 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <h4 className="text-sm font-medium truncate text-slate-900 dark:text-white">{session.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{session.lastUpdated.toLocaleDateString()} • {session.messages.length} messages</p>
                        </div>
                        <motion.button
                          onClick={(e) => deleteChat(e, session.id)}
                          className="p-1 transition-all duration-200 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
                          whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <main className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 transition-colors rounded-lg hover:bg-white/10"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
                <motion.div
                  className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bot className="w-6 h-6" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">AI Document Assistant</h1>
                </div>
              </div>
              <div className="relative group">
                <div className="flex items-center space-x-2 text-white/80">
                  <Languages className="w-5 h-5"/>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="pr-4 font-medium text-white bg-transparent rounded-md appearance-none cursor-pointer focus:ring-0 focus:outline-none"
                  >
                    <option className="text-black" value="English">English</option>
                    <option className="text-black" value="Hindi">Hindi</option>
                    <option className="text-black" value="Tamil">Tamil</option>
                    <option className="text-black" value="Telugu">Telugu</option>
                    <option className="text-black" value="Marathi">Marathi</option>
                    <option className="text-black" value="Bengali">Bengali</option>
                    <option className="text-black" value="Sanskrit">Sanskrit</option>
                  </select>
                </div>
                <div className="absolute right-0 p-2 mb-2 text-xs text-white transition-opacity duration-300 rounded opacity-0 pointer-events-none -bottom-8 w-max bg-slate-800 group-hover:opacity-100">
                  Select AI response language
                </div>
              </div>
            </header>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id} layout
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start max-w-3xl space-x-3">
                    {message.type === 'assistant' && (<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500"><Bot className="w-5 h-5 text-white" /></div>)}
                    <motion.div
                      className={`rounded-2xl p-4 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'}`}
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: 'spring', stiffness: 150 }}
                    >
                      <div className="leading-relaxed whitespace-pre-line">{message.content}</div>
                      {message.attachments && (<div className="mt-3 space-y-2">{message.attachments.map((attachment, idx) => (<div key={idx} className="flex items-center p-2 space-x-2 rounded-lg bg-black/10"><FileText className={`w-4 h-4 ${message.type === 'user' ? 'text-white/80' : 'text-slate-500'}`} /><span className="text-sm">{attachment.name}</span><span className="text-xs opacity-70">({attachment.size})</span></div>))}</div>)}
                    </motion.div>
                    {message.type === 'user' && (<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-600"><User className="w-5 h-5 text-slate-700 dark:text-slate-300" /></div>)}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {isLoading && (<motion.div className="flex justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><div className="flex items-start space-x-3"><div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500"><Bot className="w-5 h-5 text-white" /></div><div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl"><TypingDots /></div></div></motion.div>)}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 border-t border-slate-200 dark:border-slate-700">
              {apiError && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 mb-4 space-x-2 text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300"><AlertCircle className="w-5 h-5" /><span className="text-sm">{apiError}</span></motion.div>)}
              <AnimatePresence>
                {selectedFile && (<motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-between p-2 mb-3 bg-blue-100 rounded-lg dark:bg-blue-900/40"><div className="flex items-center space-x-2 text-sm text-blue-800 truncate dark:text-blue-200"><Paperclip className="flex-shrink-0 w-4 h-4" /><span className="truncate">{selectedFile.name}</span><span className="text-xs opacity-70">({(selectedFile.size / 1024).toFixed(1)} KB)</span></div><button onClick={() => setSelectedFile(null)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><X className="w-4 h-4 text-blue-800 dark:text-blue-200" /></button></motion.div>)}
              </AnimatePresence>
              <div className="flex items-center space-x-4">
                <motion.button onClick={handleFileUploadClick} className="p-3 transition-colors bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl" title="Upload Document" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" /></motion.button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedFile ? "Add a message for your file..." : "Ask me anything..."}
                    className="w-full px-4 py-3 transition-colors border bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  />
                </div>
                <motion.button onClick={handleSendMessage} disabled={(!inputMessage.trim() && !selectedFile) || isLoading} className="p-3 text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Send className="w-5 h-5" /></motion.button>
              </div>
              <input ref={fileInputRef} type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" />
            </footer>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default AIChatBot;