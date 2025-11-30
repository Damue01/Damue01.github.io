export interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  gridSpan: number; // 1 or 2 columns
}

export enum Section {
  HERO = 'hero',
  WORK = 'work',
  ABOUT = 'about',
  CONTACT = 'contact'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}