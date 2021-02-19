interface IButtonProps {
  content: string;
  onclickHandler: any;
  isMove: boolean;
}

interface IStyledButtonProps {
  isMove: boolean;
}

export type { IButtonProps, IStyledButtonProps };
