import { Link } from 'react-router-dom';

const VARIANTS = {
  default: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  danger: 'text-slate-500 hover:bg-red-50 hover:text-red-600'
};

export const iconButtonClasses = ({ variant = 'default', className = '' } = {}) =>
  [
    'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
    VARIANTS[variant] || VARIANTS.default,
    className
  ].join(' ');

/**
 * Small square icon-only button used for compact row actions (e.g. an edit
 * icon in a table that doesn't navigate). For a navigational icon action,
 * use IconLinkButton instead — nesting a <button> inside a <Link>'s <a> is
 * invalid HTML.
 */
const IconButton = ({ icon: Icon, variant = 'default', className = '', label, ...props }) => (
  <button type="button" aria-label={label} title={label} className={iconButtonClasses({ variant, className })} {...props}>
    <Icon className="h-4 w-4" strokeWidth={2} />
  </button>
);

/**
 * Same visual treatment as IconButton, but renders a react-router Link (a
 * real <a>) for row actions that navigate, e.g. an "Edit" icon in a table.
 */
export const IconLinkButton = ({ icon: Icon, variant = 'default', className = '', label, ...props }) => (
  <Link aria-label={label} title={label} className={iconButtonClasses({ variant, className })} {...props}>
    <Icon className="h-4 w-4" strokeWidth={2} />
  </Link>
);

export default IconButton;
