import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../utils/auth';

const Header = () => {
  const [dailyThoughts, setDailyThoughts] = useState('');

  useEffect(() => {
    const storedThoughts = localStorage.getItem('dailyThoughts');
    if (storedThoughts) {
      setDailyThoughts(storedThoughts);
    }
  }, []);

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const handleThoughtsChange = (event) => {
    setDailyThoughts(event.target.value);
  };

  const saveDailyThoughts = () => {
    localStorage.setItem('dailyThoughts', dailyThoughts);
  };

  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0">Encourage Friends</h1>
          </Link>
          <p className="m-0">Get into the best shape of your life.</p>
        </div>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/me">
                {Auth.getProfile().data.username}'s profile
              </Link>
              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
        {Auth.loggedIn() && (
          <div className="daily-thoughts-container" style={{ marginLeft: 'auto' }}>
            <textarea
              placeholder="Type your daily thoughts here..."
              value={dailyThoughts}
              onChange={handleThoughtsChange}
              style={{ resize: 'none', width: '750px', height: '120px' }}
            ></textarea>
            <button
              className="btn btn-sm btn-info mt-2"
              onClick={saveDailyThoughts}
            >
              Save Thoughts
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
