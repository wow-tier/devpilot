import React, { useState, useEffect } from 'react';

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  onSave: (user: {
    id?: number;
    name: string;
    email: string;
  }) => void;
  onCancel?: () => void;
}

export default function UserForm({
  user,
  onSave,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(!!user);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(!!user);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: user?.id, // Keep the ID if editing
      name,
      email,
    });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      <style jsx>{`
        form {
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        div {
          margin-bottom: 10px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input[type="text"], input[type="email"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
          margin-right: 10px;
        }
        button[type="button"] {
          background-color: #ccc;
          color: black;
        }
      `}</style>
    </form>
  );
}
