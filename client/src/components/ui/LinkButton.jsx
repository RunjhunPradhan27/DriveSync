import { Link } from 'react-router-dom';
import { buttonClasses } from './buttonStyles.js';

/**
 * A react-router Link styled identically to Button — used for navigational
 * CTAs like "Create X" / "Add X" so they're real links (not onClick+navigate).
 */
const LinkButton = ({ variant, size, className, children, ...props }) => (
  <Link className={buttonClasses({ variant, size, className })} {...props}>
    {children}
  </Link>
);

export default LinkButton;
