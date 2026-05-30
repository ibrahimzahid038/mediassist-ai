import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, Mic, MicOff, Trash2, Copy, Sparkles, Clock
} from 'lucide-react';
import { getChatResponse, SUGGESTED_PROMPTS } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { getChatHistory, saveChatMessage } from '../../lib/supabase';
import { cn, formatTime, generateId } from '../../lib/utils';
import type { ChatMessage } from '../../types';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await getChatHistory(user!.id);
      setMessages((data as ChatMessage[]) || []);
    } catch (err) {
      console.error('Failed to load chat history', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      user_id: user?.id || '',
      message: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Save user message to database
    try {
      await saveChatMessage({
        user_id: user?.id || '',
        message: messageText,
        sender: 'user',
      });
    } catch (err) {
      console.error('Failed to save user message', err);
    }

    try {
      const response = await getChatResponse(messageText, messages);
      const aiMessage: ChatMessage = {
        id: generateId(),
        user_id: user?.id || '',
        message: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save AI response to database
      try {
        await saveChatMessage({
          user_id: user?.id || '',
          message: response,
          sender: 'ai',
        });
      } catch (err) {
        console.error('Failed to save AI message', err);
      }
    } catch {
      toast.error('Failed to get response');
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Listening...');
      setTimeout(() => {
        setIsListening(false);
        setInput('How can I improve my sleep quality?');
        toast.success('Voice captured!');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px-4rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl medical-gradient-bg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold font-display">AI Health Assistant</h1>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="btn-ghost text-sm flex items-center gap-1.5 text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl medical-gradient-bg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold font-display mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              Ask me anything about health, symptoms, wellness, or lifestyle. I'm here to provide helpful guidance.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:bg-accent/50 transition-all text-left text-sm"
                >
                  <span className="text-lg">{prompt.icon}</span>
                  <span className="text-muted-foreground">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg medical-gradient-bg flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className="group relative max-w-[75%]">
                <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message.split('\n').map((line, i) => {
                      if (line.startsWith('- ')) {
                        return <div key={i} className="ml-2 flex items-start gap-1"><span>•</span><span>{line.slice(2)}</span></div>;
                      }
                      const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      return <p key={i} className={line === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: boldReplaced }} />;
                    })}
                  </div>
                  <p className={cn(
                    'text-[10px] mt-1.5 flex items-center gap-1',
                    msg.sender === 'user' ? 'text-white/60 justify-end' : 'text-muted-foreground'
                  )}>
                    <Clock className="w-2.5 h-2.5" />
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => copyMessage(msg.message)}
                    className="absolute -right-8 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg medical-gradient-bg flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="chat-bubble-ai flex items-center gap-1.5 py-4">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (when there are messages) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin">
          {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-cyan-300 dark:hover:border-cyan-500/30 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap transition-all"
            >
              <span>{prompt.icon}</span> {prompt.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={toggleVoice}
            className={cn(
              'p-3 rounded-xl border transition-all',
              isListening
                ? 'border-red-300 bg-red-50 dark:bg-red-500/10 text-red-500 animate-pulse'
                : 'border-border hover:bg-accent text-muted-foreground'
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your health question..."
            className="input-field flex-1"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="btn-primary !px-5 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          MediAssist AI provides health information only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
