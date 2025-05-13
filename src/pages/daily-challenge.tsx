import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

const DailyChallenge: React.FC = () => {
  const { userType } = useUser();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [progress, setProgress] = useState({mother: 0, partner: 0});

  useEffect(() => {
    const fetchChallenges = async () => {
      const topics = ['心理健康', '育儿知识', '家庭关系'];
      const newChallenges = await Promise.all(
        topics.map(async (topic) => {
          const res = await fetch('http://localhost:8000/generate-challenge', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              user_type: userType,
              topic,
              seed: Date.now()
            })
          });
          return await res.json();
        })
      );
      setChallenges(newChallenges);
    };

    fetchChallenges();
  }, [userType]);

  const handleSubmit = async (index: number) => {
    // 更新进度状态
    setProgress(prev => ({
      ...prev,
      [userType as 'mother' | 'partner']: prev[userType as keyof typeof prev] + 1
    }));
    
    // 标记挑战为已完成
    setChallenges(prev => 
      prev.map((c, i) => 
        i === index ? {...c, completed: true} : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <h1 className="text-2xl mb-4">每日闯关任务</h1>
      
      {/* 新增迷宫可视化 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg mb-2">家庭迷宫</h3>
        <div className="grid grid-cols-3 gap-2 h-40 relative">
          {Array.from({length: 9}).map((_, i) => (
            <div 
              key={i}
              className={`border rounded flex items-center justify-center
                ${i === Math.floor(progress[userType as 'mother' | 'partner'] * 2.7) ? 
                  'bg-orange-300' : 'bg-gray-100'}`}
            >
              {i === Math.floor(progress[userType as 'mother' | 'partner'] * 2.7) && 
                <span className="text-sm">🏆</span>}
            </div>
          ))}
        </div>
      </div>
      
      {/* 迷宫进度可视化 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h3>母亲进度</h3>
          <div className="h-4 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{width: `${(progress.mother/3)*100}%`}}
            ></div>
          </div>
        </div>
        <div className="border p-4 rounded">
          <h3>伴侣进度</h3>
          <div className="h-4 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{width: `${(progress.partner/3)*100}%`}}
            ></div>
          </div>
        </div>
      </div>

      {/* 挑战列表 */}
      <div className="space-y-6">
        {challenges.map((challenge, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl mb-3">挑战 {index + 1}</h3>
            <div className="whitespace-pre-line mb-4">
              {challenge.challenge}
            </div>
            <button
              onClick={() => handleSubmit(index)}
              className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
              disabled={challenge.completed}
            >
              {challenge.completed ? '已完成' : '提交答案'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenge;