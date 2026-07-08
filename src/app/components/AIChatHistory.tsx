import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { chatHistory } from './constants/aiChatConstants';

interface AIChatHistoryProps {
  onLoadChat: (chatId: string) => void;
}

export default function AIChatHistory({ onLoadChat }: AIChatHistoryProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">对话历史</h3>
        <p className="text-muted-foreground">查看和管理您的历史对话记录</p>
      </div>

      <div className="space-y-4">
        {chatHistory.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-medium line-clamp-1">{chat.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(chat.timestamp)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {chat.messageCount} 条消息
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoadChat(chat.id)}
                    >
                      加载
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {chatHistory.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">暂无历史对话记录</p>
        </div>
      )}
    </div>
  );
}