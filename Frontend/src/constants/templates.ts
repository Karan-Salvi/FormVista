import { type BlockType } from '@/types/form'

export interface TemplateBlock {
  type: BlockType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  content?: string
  level?: 1 | 2 | 3
}

export interface Template {
  id: string
  title: string
  description: string
  icon: string
  blocks: TemplateBlock[]
  primaryColor?: string
}

export const templates: Template[] = [
  {
    id: 'contact-form',
    title: 'Contact Form',
    description:
      'Get in touch with your visitors with this simple contact form.',
    icon: 'mail',
    primaryColor: 'blue',
    blocks: [
      {
        type: 'heading',
        label: 'Contact Us',
        content: 'We would love to hear from you!',
        level: 1,
      },
      {
        type: 'short-text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
      },
      {
        type: 'email',
        label: 'Email Address',
        placeholder: 'john@example.com',
        required: true,
      },
      {
        type: 'short-text',
        label: 'Subject',
        placeholder: 'How can we help?',
      },
      {
        type: 'long-text',
        label: 'Message',
        placeholder: 'Type your message here...',
        required: true,
      },
    ],
  },
  {
    id: 'event-registration',
    title: 'Event Registration',
    description: 'Register attendees for your next big event or workshop.',
    icon: 'calendar',
    primaryColor: 'purple',
    blocks: [
      {
        type: 'heading',
        label: 'Event Registration',
        content: 'Join us for an unforgettable experience.',
        level: 1,
      },
      {
        type: 'short-text',
        label: 'First Name',
        placeholder: 'Jane',
        required: true,
      },
      {
        type: 'short-text',
        label: 'Last Name',
        placeholder: 'Smith',
        required: true,
      },
      {
        type: 'email',
        label: 'Email Address',
        required: true,
      },
      {
        type: 'multiple-choice',
        label: 'Which session will you attend?',
        options: ['Morning Session', 'Afternoon Session', 'Full Day'],
        required: true,
      },
      {
        type: 'checkbox',
        label: 'Dietary Requirements',
        options: ['Vegetarian', 'Vegan', 'Gluten Free', 'Nut Allergy', 'None'],
      },
    ],
  },
  {
    id: 'customer-feedback',
    title: 'Feedback Form',
    description:
      'Collect valuable insights from your customers to improve your service.',
    icon: 'message-square',
    primaryColor: 'green',
    blocks: [
      {
        type: 'heading',
        label: 'Customer Feedback',
        content: 'Your feedback helps us grow.',
        level: 1,
      },
      {
        type: 'multiple-choice',
        label: 'Overall Satisfaction',
        options: [
          'Very Satisfied',
          'Satisfied',
          'Neutral',
          'Dissatisfied',
          'Very Dissatisfied',
        ],
        required: true,
      },
      {
        type: 'long-text',
        label: 'What did you like most about our service?',
        placeholder: 'Tell us your thoughts...',
      },
      {
        type: 'long-text',
        label: 'What can we improve?',
        placeholder: 'Any suggestions?',
      },
      {
        type: 'toggle',
        label: 'Would you recommend us?',
        content: 'We appreciate your support!',
      },
    ],
  },
  {
    id: 'simple-survey',
    title: 'Market Survey',
    description: 'Conduct quick market research or internal company surveys.',
    icon: 'align-left',
    primaryColor: 'orange',
    blocks: [
      {
        type: 'heading',
        label: 'Market Research Survey',
        content: 'A few questions to understand the market better.',
        level: 1,
      },
      {
        type: 'dropdown',
        label: 'Age Group',
        options: ['Under 18', '18-24', '25-34', '35-44', '45+'],
        required: true,
      },
      {
        type: 'short-text',
        label: 'Current Occupation',
        placeholder: 'e.g., Software Engineer',
      },
      {
        type: 'multiple-choice',
        label: 'How often do you use our products?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        required: true,
      },
    ],
  },
  {
    id: 'job-application',
    title: 'Job Application',
    description:
      'Streamline your hiring process with a structured application form.',
    icon: 'briefcase',
    primaryColor: 'indigo',
    blocks: [
      {
        type: 'heading',
        label: 'Join Our Team',
        content: 'Tell us about yourself and why you want to work with us.',
        level: 1,
      },
      {
        type: 'short-text',
        label: 'Full Name',
        placeholder: 'Jane Doe',
        required: true,
      },
      {
        type: 'email',
        label: 'Email',
        required: true,
      },
      {
        type: 'phone',
        label: 'Phone Number',
        required: true,
      },
      {
        type: 'short-text',
        label: 'LinkedIn Profile',
        placeholder: 'https://linkedin.com/in/username',
      },
      {
        type: 'file',
        label: 'Resume/CV',
        required: true,
      },
      {
        type: 'long-text',
        label: 'Cover Letter',
        placeholder: 'Tell us your story...',
      },
    ],
  },
  {
    id: 'bug-report',
    title: 'Bug Report',
    description:
      'Track issues and improve your software with detailed bug reporting.',
    icon: 'bug',
    primaryColor: 'rose',
    blocks: [
      {
        type: 'heading',
        label: 'Report an Issue',
        content: 'Help us make our products better.',
        level: 1,
      },
      {
        type: 'short-text',
        label: 'Issue Title',
        placeholder: 'e.g., App crashes on login',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'Severity',
        options: ['Critical', 'Major', 'Minor', 'Trivial'],
        required: true,
      },
      {
        type: 'long-text',
        label: 'Steps to Reproduce',
        placeholder: '1. Open app\n2. Click login...',
        required: true,
      },
      {
        type: 'short-text',
        label: 'Browser/OS',
        placeholder: 'e.g., Chrome on Windows 11',
      },
      {
        type: 'image',
        label: 'Screenshot of the issue',
      },
    ],
  },
  {
    id: 'newsletter',
    title: 'Newsletter Signup',
    description: 'Grow your audience and keep them updated with ease.',
    icon: 'bell',
    primaryColor: 'cyan',
    blocks: [
      {
        type: 'heading',
        label: 'Subscribe to Our Newsletter',
        content: 'Stay in the loop with the latest updates and offers.',
        level: 1,
      },
      {
        type: 'short-text',
        label: 'First Name',
        placeholder: 'Your name',
      },
      {
        type: 'email',
        label: 'Email Address',
        required: true,
      },
      {
        type: 'checkbox',
        label: 'Interests',
        options: ['Product Updates', 'Company News', 'Weekly Digest'],
      },
    ],
  },
  {
    id: 'quiz',
    title: 'Quick Quiz',
    description: 'Engage your audience with interactive questions.',
    icon: 'help-circle',
    primaryColor: 'pink',
    blocks: [
      {
        type: 'heading',
        label: 'FormVista Trivia',
        content: 'Test your knowledge!',
        level: 1,
      },
      {
        type: 'multiple-choice',
        label: 'Which of these is NOT a block type?',
        options: ['Heading', 'Rocket Ship', 'Email', 'Multiple Choice'],
        required: true,
      },
      {
        type: 'multiple-choice',
        label: 'What is the best way to build forms?',
        options: ['Manual Coding', 'FormVista', 'Paper & Pen', 'Screaming'],
        required: true,
      },
    ],
  },
]
