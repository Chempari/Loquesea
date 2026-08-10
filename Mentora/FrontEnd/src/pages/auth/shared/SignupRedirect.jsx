import { Link } from 'react-router-dom';

export function SignupRedirect({ text, linkText, to }) {
  return (
    <div className="signup-redirect">
      {text} <Link to={to}>{linkText}</Link>
    </div>
  );
}
