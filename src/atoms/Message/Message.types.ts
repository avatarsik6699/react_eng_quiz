interface IMessageProps {
  content: string | null;
  isError: boolean | null;
}

interface IStyledMessagepProps {
  isShow: boolean;
}

interface IMessageTextProps {
  isError: boolean | null;
}

export type { IMessageProps, IStyledMessagepProps, IMessageTextProps };
