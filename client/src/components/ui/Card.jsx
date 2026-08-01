/**
 * Base surface used for all card-style containers across the app: rounded
 * corners, soft shadow, subtle border. `padded={false}` opts out of the
 * default padding for cards that manage their own inner spacing (e.g. tables).
 */
const Card = ({ children, className = '', padded = true, ...props }) => (
  <div
    className={[
      'rounded-xl border border-slate-200 bg-white shadow-sm',
      padded ? 'p-6' : '',
      className
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {children}
  </div>
);

export default Card;
