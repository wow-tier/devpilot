import React, { useState } from 'react';

interface ApiKeyFormProps {
  onAdd: (userId: number) => void;
}

export default function ApiKeyForm({ onAdd }: ApiKeyFormProps) {
  const [userId, setUserId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId !== null) {
        onAdd(userId);
        setUserId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="number"
          id="userId"
          value={userId === null ? '' : userId}
          onChange={(e) => setUserId(parseInt(e.target.value, 10))}
        />
      </div>
      <button type="submit">Add API Key</button>
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
        input[type="number"] {
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
        }
      `}</style>
    </form>
  );
}
