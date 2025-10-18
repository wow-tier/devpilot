'use client';
import { useState } from 'react';

interface ApiKeyFormProps {
  onAdd: (userId: number) => Promise<void>;
}

export default function ApiKeyForm({ onAdd }: ApiKeyFormProps) {
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || userId <= 0) {
      alert('Please enter a valid user ID.');
      return;
    }
    setLoading(true);
    try {
      await onAdd(userId);
      setUserId(0);
    } catch (error) {
      console.error('Error adding API key:', error);
      alert('Failed to add API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Enter user ID to generate API key"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Adding...' : 'Generate API Key'}
      </button>
    </form>
  );
}
