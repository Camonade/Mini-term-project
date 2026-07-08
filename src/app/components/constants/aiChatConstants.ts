import { Code, Database, Coffee, BookOpen } from 'lucide-react';

export interface Message {
  id: string; content: string; sender: 'user' | 'ai';
  timestamp: Date; type?: 'text' | 'code' | 'suggestion';
}

export interface ChatHistory {
  id: string; title: string; lastMessage: string;
  timestamp: Date; messageCount: number;
}

export const initialMessages: Message[] = [{
  id: '1',
  content: '你好！我是 AI 助手。我可以帮你解答 C++ 编程、数据库设计、后端开发等问题，有什么可以帮你的吗？',
  sender: 'ai', timestamp: new Date(), type: 'text',
}];

export const quickQuestions = [
  {
    category: 'cpp', icon: Code, color: 'bg-blue-500',
    questions: [
      'C++ 智能指针的最佳实践有哪些？',
      'Crow 框架如何处理路由和中间件？',
      'C++ 编译优化技巧分享',
      '如何用 CMake 管理 C++ 项目？',
    ],
  },
  {
    category: 'backend', icon: Database, color: 'bg-green-500',
    questions: [
      'SQLite 数据库设计最佳实践',
      'RESTful API 设计原则',
      'JWT 鉴权的实现思路',
      '后端性能优化的核心要点',
    ],
  },
  {
    category: 'learning', icon: Coffee, color: 'bg-orange-500',
    questions: [
      '如何平衡学习和项目？',
      '提高编程效率的方法',
      '大学生编程学习路线',
      '培养阅读技术文档的习惯',
    ],
  },
  {
    category: 'tools', icon: BookOpen, color: 'bg-purple-500',
    questions: [
      '推荐的 C++ 开发工具',
      'Git 工作流最佳实践',
      'Markdown 写作技巧',
      '如何写好技术博客？',
    ],
  },
];

export const chatHistory: ChatHistory[] = [
  { id: '1', title: 'C++ 智能指针讨论', lastMessage: '谢谢你的详细解答！', timestamp: new Date('2026-07-08T10:30:00'), messageCount: 15 },
  { id: '2', title: 'SQLite 表结构设计', lastMessage: '这个方案很清晰，感谢！', timestamp: new Date('2026-07-07T20:15:00'), messageCount: 8 },
  { id: '3', title: 'Crow 框架入门', lastMessage: '你的建议让我更有方向了', timestamp: new Date('2026-07-06T14:45:00'), messageCount: 23 },
];
