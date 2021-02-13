interface IAnswerWordProps {
  content: string;
  style?: any;
  onMouseDown?: any;
}

interface IWord {
  text: string;
  wordId: number;
  originId: number;
  from: 'waiting' | 'answers';
}

export type { IWord, IAnswerWordProps };
