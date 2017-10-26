export const duration = 800;
export const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ${duration}ms ease-in-out `,
    opacity: 0
};
export const transitionStyles = {
    entering: { opacity: 0},
    entered: { opacity: 1},
    exiting: { opacity: 1},
    exited: { opacity: 0, transform: 'translateX(-100%)'}
};