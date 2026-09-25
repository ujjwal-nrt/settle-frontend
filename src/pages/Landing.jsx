import { Link } from "react-router-dom";
import { ArrowRight, Plane, UsersRound, House, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Skip */}
      <Link to="/login" className="skip-button">
        Skip
      </Link>

      {/* Main content */}
      <main className="landing-content">
        {/* Logo */}
        <div className="landing-logo">
          <div className="landing-logo-mark">
            <span></span>
            <span></span>
          </div>

          <span className="app-name">
            Settle<span>G</span>
          </span>
        </div>

        {/* Heading */}
        <div className="landing-heading">
          <h1>
            Split Smarter.
            <br />
            Together.
          </h1>

          <p>
            Track, Split and SettleG Expenses
            <br />
            with friends — in your language.
          </p>
        </div>

        {/* Illustration */}
        <div className="landing-illustration">
          <div className="people-image">
            <img src="/images/settle-friends.png" alt="Friends using SettleG" />
          </div>
        </div>

        {/* Categories */}
        <div className="landing-categories">
          <div className="landing-category">
            <div className="category-icon travel">
              <Plane size={18} />
            </div>

            <span>Travel</span>
          </div>

          <div className="landing-category">
            <div className="category-icon friends">
              <UsersRound size={18} />
            </div>

            <span>Friends</span>
          </div>

          <div className="landing-category">
            <div className="category-icon home">
              <House size={18} />
            </div>

            <span>Home</span>
          </div>

          <div className="landing-category">
            <div className="category-icon office">
              <BarChart3 size={18} />
            </div>

            <span>Office</span>
          </div>
        </div>

        {/* CTA */}
        <div className="landing-footer">
          <Link to="/register" className="landing-get-started">
            <span>Get Started</span>

            <ArrowRight size={19} />
          </Link>

          {/* Login */}
          <div className="landing-login">
            <span>Already have an account?</span>

            <Link to="/login">Log in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
