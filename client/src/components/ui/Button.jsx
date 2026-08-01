import { buttonClasses } from './buttonStyles.js';

/**
 * Standard button. For a nav-style CTA that navigates (e.g. "Create X"),
 * use LinkButton instead so it renders as a real <a> via react-router.
 */
const Button = ({ variant, size, className, children, ...props }) => (
  <button className={buttonClasses({ variant, size, className })} {...props}>
    {children}
  </button>
);

export default Button;
