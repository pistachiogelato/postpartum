import { Question } from './QuestionTypes';

export const motherQuestions: Question[] = [
  {
    id: 'emotional-mapping',
    text: "When your baby first grasped your finger, which sunlight scenario best reflects how you hoped to feel?",
    type: 'radio',
    clinicalMapping: 'EPDS Q1 (Joyfulness)',
    options: [
      { 
        label: "🌻 Golden Sunflower Field (Vivid, Energetic)", 
        value: "sunflower", 
        score: 3 
      },
      { 
        label: "🌫️ Misty Dawn Glow (Soft, Calm)", 
        value: "misty", 
        score: 2 
      },
      { 
        label: "💡 Warm Nightlight Halo (Cozy, Quiet)", 
        value: "nightlight", 
        score: 1 
      }
    ]
  },
  {
    id: 'time-allocation',
    text: "Drag to divide the 24-hour felt clock into three segments (past 7 days):",
    type: 'drag',
    clinicalMapping: 'PHQ-9 Q4 (Energy Drain)',
    options: [
      { label: "💤 Sleep", value: "sleep", type: 'drag-segment' },
      { label: "👶 Infant Care", value: "care", type: 'drag-segment' },
      { label: "🌸 Me Time", value: "me", type: 'drag-segment' }
    ]
  },
  {
    id: 'support-system',
    text: "Which felt nest best represents your support network in the past week?",
    type: 'radio',
    clinicalMapping: 'EPDS Q8 (Social Support)',
    options: [
      { 
        label: "👨👩👧👦 Family Embrace (Immediate family support)", 
        value: "family", 
        score: 0 
      },
      { 
        label: "🤝 Partner Haven (Spouse/partner support)", 
        value: "partner", 
        score: 0 
      },
      { 
        label: "🌱 Community Garden (Friends/community support)", 
        value: "community", 
        score: 1 
      }
    ]
  },
  {
    id: 'mood-intensity',
    text: "Slide to show today's emotional fluctuations (0% = calm, 100% = intense):",
    type: 'slider',
    clinicalMapping: 'HAMD Mood Dimension (Reference Only)',
    options: [] 
  },
  {
    id: 'body-awareness',
    text: "Which area needs comfort most due to recent discomfort?",
    type: 'radio',
    clinicalMapping: 'PHQ-9 Somatic Symptoms',
    options: [
      { 
        label: "🦴 Soothing Back (Aches/pains)", 
        value: "back", 
        score: 1 
      },
      { 
        label: "🌀 Gentle Head Massage (Headaches/fatigue)", 
        value: "head", 
        score: 1 
      },
      { 
        label: "😴 Full-body Cocoon (Overall exhaustion)", 
        value: "full-body", 
        score: 2 
      }
    ]
  },
  {
    id: 'future-vision',
    text: "Select felt stickers for your 3-month goals (multiple choices allowed):",
    type: 'checkbox',
    clinicalMapping: 'Hope Scale (Goal Orientation)',
    options: [
      { 
        label: "👗 Dress (Resume personal style)", 
        value: "dress", 
        score: 1 
      },
      { 
        label: "🏖️ Beach (Short family trip)", 
        value: "beach", 
        score: 1 
      },
      { 
        label: "📚 Book (Read daily)", 
        value: "book", 
        score: 1 
      },
      { 
        label: "🎨 Palette (New Hobby)", 
        value: "palette", 
        score: 1 
      }
    ]
  }
];