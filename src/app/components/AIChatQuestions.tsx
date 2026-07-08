import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'motion/react';
import { quickQuestions } from './constants/aiChatConstants';

interface AIChatQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export default function AIChatQuestions({ onQuestionSelect }: AIChatQuestionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">快速提问</h3>
        <p className="text-muted-foreground">选择感兴趣的话题，开始智能对话</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickQuestions.map((category) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: quickQuestions.indexOf(category) * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="capitalize">
                      {category.category === 'cpp' ? 'C++ 编程' :
                       category.category === 'backend' ? '后端开发' :
                       category.category === 'learning' ? '学习方法' : '开发工具'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.questions.map((question, index) => (
                    <motion.button
                      key={question}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onQuestionSelect(question)}
                      className="w-full text-left p-3 text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors duration-200"
                    >
                      {question}
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}