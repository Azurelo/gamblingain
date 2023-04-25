import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const ThoughtForm = () => {
  const [thoughtText, setThoughtText] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      try {
        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: { thoughts: [addThought, ...thoughts] },
        });
      } catch (e) {
        console.error(e);
      }

      const data = cache.readQuery({ query: QUERY_ME });

      if (data && data.me) {
        const { me } = data;
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      }

    },

  });
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);
// added profile picture option with an upload it also saves to local storage
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64ImageData = reader.result;
        setProfileImage(base64ImageData);
        localStorage.setItem('profileImage', base64ImageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addThought({
        variables: {
          thoughtText,
          thoughtAuthor: Auth.getProfile().data.username,
        },
      });

      setThoughtText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'thoughtText' && value.length <= 280) {
      setThoughtText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>Push your friends</h3>

      {Auth.loggedIn() ? (
        <>
        {profileImage && (
            <div className="profile-picture-container">
              <img src={profileImage} alt="Profile" style={{ width: '150px', borderRadius: '50%' }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="thoughtText"
                placeholder="Here's a new thought..."
                value={thoughtText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Thought
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your thoughts. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default ThoughtForm;
