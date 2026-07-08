import { toast } from 'sonner';
import type { Message } from '../constants/aiChatConstants';

export function generateAIResponse(userInput: string): string {
  const lower = userInput.toLowerCase();
  if (lower.includes('c++') || lower.includes('智能指针') || lower.includes('指针'))
    return '关于 C++ 智能指针：\n\n1. **unique_ptr**：独占所有权，不可拷贝\n2. **shared_ptr**：共享所有权，引用计数\n3. **weak_ptr**：不增加引用计数，打破循环引用\n\n推荐用 make_unique / make_shared 安全创建。';
  if (lower.includes('crow') || lower.includes('后端') || lower.includes('web'))
    return 'C++ Crow 框架：Header-only，语法类似 Flask。\n\n🐦 路由定义简洁\n📦 支持中间件\n⚡ 基于 Boost.ASIO 高并发\n\n推荐配合 CMake + nlohmann/json 使用。';
  if (lower.includes('sqlite') || lower.includes('数据库') || lower.includes('sql'))
    return 'SQLite 设计要点：\n\n📋 从 API 文档反推表结构\n🔑 INTEGER PRIMARY KEY 自增主键\n📊 为 WHERE/JOIN 字段建索引\n\n适合博客、工具等场景。';
  if (lower.includes('学习') || lower.includes('方法') || lower.includes('路线'))
    return '编程学习建议：\n\n📚 先精通一门语言\n🗂️ 项目驱动，边做边学\n✍️ 写技术博客巩固知识\n\n比速度更重要的是持续。';
  const responses = [
    '这是个好问题！从技术角度分析...\n\n你有什么具体的应用场景吗？',
    '很好的问题！建议先理解核心概念再动手实践。',
    '这确实值得深入探讨。方便说说具体疑问吗？',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function exportChatHistory(messages: Message[]): void {
  const content = messages.map((m) =>
    `${m.sender === 'user' ? '❓' : '🤖'} (${m.timestamp.toLocaleString()}):\n${m.content}\n`
  ).join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `对话记录_${new Date().toLocaleDateString()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success('对话记录已导出');
}
