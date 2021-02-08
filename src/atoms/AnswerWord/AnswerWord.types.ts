interface AnswerWordPropsType {
  content: string;
  style?: any;
  onMouseDown?: any;
}

type WordElementType = {
  text: string;
  wordId: number;
  originId: number;
  from: string;
};

export type { WordElementType, AnswerWordPropsType };
