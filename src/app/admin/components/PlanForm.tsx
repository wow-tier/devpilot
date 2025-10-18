'use client';
import { useState } from 'react';

interface PlanFormProps {
  onAdd: (plan: { name: string; price: number }) => Promise<void>;
}

export default function PlanForm({ onAdd }: PlanFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) {
      alert('Please enter a valid name and price.');
      return;
    }
    setLoading(true);
    try {
      await onAdd({ name, price });
      setName('');
      setPrice(0);
    } catch (error) {
      console.error('Error adding plan:', error);
      alert('Failed to add plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="planName">Plan Name:</label>
        <input
          id="planName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Enter plan name"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="planPrice">Price:</label>
        <input
          id="planPrice"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Enter price"
        />
      </div>
      <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        {loading ? 'Adding...' : 'Add Plan'}
      </button>
    </form>
  );
}
