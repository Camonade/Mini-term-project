import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { MessageSquare, Send, Bot, User, Plus, Trash2, Settings, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { initialMessages, Message, chatHistory } from './constants/aiChatConstants';
import { generateAIResponse, formatTime, exportChatHistory } from './utils/aiChatUtils';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
  isActive?: boolean;
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1', title: 'C++ 智能指针讨论',
    lastMessage: '感谢你的详细解答，终于搞懂了！',
    timestamp: new Date('2026-07-08T10:30:00'),
    messages: [
      { id: '1', content: '你好！我想了解 unique_ptr 和 shared_ptr 区别', sender: 'user', timestamp: new Date('2026-07-08T10:25:00') },
      { id: '2', content: '关于 C++ 智能指针：unique_ptr 独占所有权...', sender: 'ai', timestamp: new Date('2026-07-08T10:26:00') },
    ],
  },
  {
    id: '2', title: 'SQLite 数据库设计',
    lastMessage: '这个表结构方案很清晰！',
    timestamp: new Date('2026-07-07T20:15:00'),
    messages: [
      { id: '1', content: '博客系统的数据库表应该怎么设计？', sender: 'user', timestamp: new Date('2026-07-07T20:10:00') },
    ],
  },
  {
    id: '3', title: 'Crow 框架入门',
    lastMessage: '你的建议让我更有方向感了',
    timestamp: new Date('2026-07-06T14:45:00'),
    messages: [
      { id: '1', content: 'C++ 有哪些适合写 Web 后端的框架？', sender: 'user', timestamp: new Date('2026-07-06T14:40:00') },
    ],
  },
];

export default function AIChatSection() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>('1');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = chatSessions.find(session => session.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages.length > 0 ? currentSession.messages : initialMessages);
    }
  }, [currentSessionId, currentSession]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(messageToSend),
        sender: 'ai',
        timestamp: new Date(),
        type: messageToSend.includes('代码') || messageToSend.includes('编程') ? 'code' : 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // 更新当前会话
      if (currentSessionId) {
        setChatSessions(prev => prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: [...messages, userMessage, aiResponse],
                lastMessage: aiResponse.content.slice(0, 50) + '...',
                timestamp: new Date()
              }
            : session
        ));
      }
    }, 1000 + Math.random() * 2000);
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatSession = {
      id: newChatId,
      title: '新对话',
      lastMessage: '开始新的对话...',
      timestamp: new Date(),
      messages: []
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentSessionId(newChatId);
    setMessages(initialMessages);
    toast.success('已创建新对话');
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentSessionId === chatId) {
      const remaining = chatSessions.filter(session => session.id !== chatId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        setCurrentSessionId(null);
        setMessages(initialMessages);
      }
    }
    toast.success('对话已删除');
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          AI对话助手
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          智能对话，随时为你解答问题，提供帮助与建议
        </motion.p>
      </div>

      {/* Main Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="h-[800px] grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full border-0 shadow-md flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">对话列表</CardTitle>
                <Button size="sm" onClick={createNewChat}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索对话..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1">
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setCurrentSessionId(session.id)}
                    className={`p-4 cursor-pointer transition-colors duration-200 border-b border-muted/50 group ${
                      currentSessionId === session.id 
                        ? 'bg-primary/10 border-l-4 border-l-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-medium text-sm truncate">
                            {session.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {session.lastMessage}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(session.timestamp)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredSessions.length === 0 && (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">暂无对话记录</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages Area */}
        <div className="lg:col-span-3">
          <Card className="h-full border-0 shadow-md flex flex-col">
            {currentSession ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{currentSession.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">AI助手 • 在线</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <div className={`w-full h-full rounded-full flex items-center justify-center ${
                              message.sender === 'user' 
                                ? 'bg-blue-500' 
                                : 'bg-gradient-to-br from-orange-500 to-red-500'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </Avatar>

                          <div className="space-y-1">
                            <div className={`p-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-muted border'
                            }`}>
                              <div className="text-sm whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground px-2">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-start space-x-3"
                      >
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        </Avatar>
                        <div className="bg-muted border p-3 rounded-2xl">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-muted-foreground rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="输入消息..."
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">选择对话开始聊天</h3>
                    <p className="text-muted-foreground">
                      从左侧选择一个对话，或创建新的对话开始与AI助手交流
                    </p>
                  </div>
                  <Button onClick={createNewChat}>
                    <Plus className="w-4 h-4 mr-2" />
                    开始新对话
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}