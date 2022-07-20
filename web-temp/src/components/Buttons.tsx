import { VFC } from "react";

type ColoredButtonProps = {
  lable: string;
  action: () => void;
};

export const ColoredButton: VFC<ColoredButtonProps> = ({ lable, action }) => (
  <button type="button" onClick={action}>
    {lable}
  </button>
);

type CrossButtonProps = {
  action: () => void;
};

export const CrossButton: VFC<CrossButtonProps> = ({ action }) => (
  <>
    <button type="button" onClick={action}>
      <svg width="24" height="24" viewBox="0 0 24 24" />
    </button>
    <button type="button" onClick={action}>
      <svg width="24" height="24" viewBox="0 0 24 24" />
    </button>
    <button type="button" onClick={action}>
      <svg width="24" height="24" viewBox="0 0 24 24" />
    </button>
    <button type="button" onClick={action}>
      <svg width="24" height="24" viewBox="0 0 24 24" />
    </button>
  </>
);
