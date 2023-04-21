import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_THOUGHT } from '../utils/queries';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import UpdateThoughtForm from '../components/UpdateThoughtForm';
import Auth from '../utils/auth';

const SingleThought = () => {
  const { thoughtId } = useParams();
  const { loading, data } = useQuery(QUERY_SINGLE_THOUGHT, {
    variables: { thoughtId: parseInt(thoughtId) },
  });
  const thought = data?.thought || {};
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleUpdate = () => {
    setShowUpdateForm(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {thought.thoughtAuthor} <br />
        <span style={{ fontSize: '1rem' }}>
          had this thought on {thought.createdAt}
        </span>
      </h3>
      <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            border: '2px dotted #1a1a1a',
            lineHeight: '1.5',
          }}
        >
          {thought.thoughtText}
        </blockquote>
      </div>

      <div className="my-5">
        <CommentList comments={thought.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm thoughtId={thought._id} />
      </div>

      {Auth.loggedIn() && (
        <>
          <hr />
          <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
            {!showUpdateForm && (
              <button
                onClick={() => setShowUpdateForm(true)}
                className="btn d-block w-100"
              >
                Edit Thought
              </button>
            )}
            {showUpdateForm && (
              <UpdateThoughtForm
                thoughtId={thought._id}
                initialText={thought.thoughtText}
                onUpdated={handleUpdate}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SingleThought;