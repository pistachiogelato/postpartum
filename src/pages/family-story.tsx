import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useFamilyCode } from '@/contexts/FamilyCodeContext';

const FamilyStory: React.FC = () => {
  // TODO: 与 Sonar 进行多轮对话，生成每日一页"毛线风格"家庭故事
  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <h1 className="text-2xl mb-4">家庭故事集</h1>
      <div className="border p-4 rounded">
        <p>这里展示生成的家庭专属故事</p>
      </div>
      {/* TODO: 365 天坚持激励 + 实体版兑换入口 */}
    </div>
  );
};

export default FamilyStory; 