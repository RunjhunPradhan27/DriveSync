// Shared class-string builder for anything that should look like a button —
// <button> elements and react-router <Link>s alike — so every CTA in the app
// (Button, LinkButton, icon-only actions) renders from one style source.
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500',
  secondary: 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-indigo-500',
  outline: 'bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50 focus-visible:ring-indigo-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-indigo-500',
  danger: 'bg-white text-red-600 border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-500',
  dangerSolid: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500'
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm'
};

/**
 * Builds the class string for a button-like element.
 * @param {Object} opts
 * @param {keyof VARIANTS} [opts.variant]
 * @param {keyof SIZES} [opts.size]
 * @param {string} [opts.className] - extra classes appended last (can override)
 */
export const buttonClasses = ({ variant = 'primary', size = 'md', className = '' } = {}) =>
  [BASE, VARIANTS[variant] || VARIANTS.primary, SIZES[size] || SIZES.md, className].filter(Boolean).join(' ');
