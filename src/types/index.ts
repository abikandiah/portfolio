
export type ClickEvent<E> = React.MouseEvent<E> | React.TouchEvent<E>;
export type onClickCallback<E> = (event: ClickEvent<E>) => void;

