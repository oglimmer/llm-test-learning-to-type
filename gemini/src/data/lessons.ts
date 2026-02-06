export interface Lesson {
  id: string;
  title: string;
  text: string;
  mode: 'beginner' | 'advanced';
}

export const LESSONS: Lesson[] = [
  {
    id: 'b1',
    title: 'Home Row (ASDF JKL;)',
    text: 'asdf jkl; asdf jkl; asdf jkl;',
    mode: 'beginner'
  },
  {
    id: 'b2',
    title: 'Home Row Words',
    text: 'sad dad lad fad ads fad salsa flask alfalfa',
    mode: 'beginner'
  },
  {
    id: 'b3',
    title: 'Top Row (QWER UIOP)',
    text: 'qwer uiop qwer uiop qwer uiop',
    mode: 'beginner'
  },
  {
    id: 'b4',
    title: 'Top Row Words',
    text: 'power tree root quiet upper write pepper',
    mode: 'beginner'
  },
  {
    id: 'b5',
    title: 'Bottom Row (ZXCV M,./)',
    text: 'zxcv m,./ zxcv m,./ zxcv m,./',
    mode: 'beginner'
  },
  {
    id: 'a1',
    title: 'Common Pangram',
    text: 'The quick brown fox jumps over the lazy dog.',
    mode: 'advanced'
  },
  {
    id: 'a2',
    title: 'Tech Philosophy',
    text: 'Move fast and break things. Unless you are breaking the speed of light.',
    mode: 'advanced'
  },
  {
    id: 'a3',
    title: 'Web Development',
    text: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
    mode: 'advanced'
  },
  {
    id: 'a4',
    title: 'Nature Quote',
    text: 'The clearest way into the Universe is through a forest wilderness.',
    mode: 'advanced'
  }
];