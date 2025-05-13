import { Question } from './QuestionTypes';

export const partnerQuestions: Question[] = [
  {
    id: 'stress-visualization',
    text: "Your recent stress feels most like which weather?",
    type: 'radio',
    clinicalMapping: 'PC-PTSD Stress Severity Index',
    options: [
      { 
        label: "🌦️ Drizzling Clouds (Manageable stress)", 
        value: "drizzle", 
        score: 1 
      },
      { 
        label: "⛈️ Gathering Storm (Overwhelming stress)", 
        value: "storm", 
        score: 3 
      },
      { 
        label: "🌞 Clear Sky (Little stress)", 
        value: "clear", 
        score: 2 
      }
    ]
  },
  {
    id: 'support-role',
    text: "What felt tool best describes your support style?",
    type: 'radio',
    clinicalMapping: 'EPDS Partner Support Subscale',
    options: [
      { 
        label: "🧰 Steady Ladder (Practical help: diapering, night shifts)", 
        value: "ladder", 
        score: 2 
      },
      { 
        label: "🫂 Comfort Pillow (Emotional support: listening, validation)", 
        value: "pillow", 
        score: 3 
      },
      { 
        label: "📱 Smart Assistant (Flexible help: on-demand tasks)", 
        value: "assistant", 
        score: 1 
      }
    ]
  },
  {
    id: 'time-commitment',
    text: "Drag blocks to allocate daily support time (morning/noon/evening):",
    type: 'drag',
    clinicalMapping: 'Parenting Participation Scale',
    options: [
      { label: "🕗 Morning Help (6–9 AM)", value: "morning", type: 'time-block' },
      { label: "🕛 Noon Check-in (12–3 PM)", value: "noon", type: 'time-block' },
      { label: "🕣 Evening Care (6–12 PM)", value: "evening", type: 'time-block' }
    ]
  },
  {
    id: 'communication-frequency',
    text: "How often do you check in with your partner about their feelings?",
    type: 'radio',
    clinicalMapping: 'Communication Frequency Scale',
    options: [
      { label: "Daily", value: "daily", score: 3 },
      { label: "Weekly", value: "weekly", score: 2 },
      { label: "Rarely", value: "rarely", score: 1 }
    ]
  },
  {
    id: 'self-care',
    text: "Select activities you've done for yourself in the past week:",
    type: 'checkbox',
    clinicalMapping: 'Self-Care Inventory',
    options: [
      { label: "Exercise", value: "exercise" },
      { label: "Socializing", value: "social" },
      { label: "Hobbies", value: "hobbies" },
      { label: "Alone time", value: "alone" }
    ]
  },
  {
    id: 'confidence-level',
    text: "Rate your confidence in parenting (0-100%):",
    type: 'slider',
    clinicalMapping: 'Parenting Confidence Scale',
    options: []
  }
];
