import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_THOUGHT } from '../../utils/mutations';

const UpdateThoughtForm = ({ thoughtId, initialText, onUpdated }) => {
  const [text, setText] = useState(initialText);
  const [updateThought, { error }] = useMutation(UPDATE_THOUGHT);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateThought({
        variables: { _id: thoughtId, text },
      });

      setText('');
      onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Update Thought</h4>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows="3"
        ></textarea>
        <button type="submit">Update Thought</button>
      </form>

      {error && <p>Error updating thought</p>}
    </div>
  );
};

export default UpdateThoughtForm;