import { useState, useEffect } from 'react';
import ApiKeysTable from './../components/ApiKeysTable';
import ApiKeyForm from './../components/ApiKeyForm';

interface ApiKey {
  id: number;
  key: string;
  userId: number;
}

// Replace with your actual API endpoints
const API_URL = 'YOUR_API_URL';

async function getApiKeys(): Promise<ApiKey[]> {
  try {
    const response = await fetch(`${API_URL}/api-keys`);
    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return []; // Or re-throw the error, or return a default value
  }
}

async function addApiKey(userId: number): Promise<ApiKey | null> {
  try {
    const response = await fetch(`${API_URL}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      throw new Error('Failed to add API key');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding API key:', error);
    return null;
  }
}

async function deleteApiKey(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api-keys/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
  }
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchApiKeys() {
      const fetchedApiKeys = await getApiKeys();
      setApiKeys(fetchedApiKeys);
    }
    fetchApiKeys();
  }, []);

  const handleAddApiKey = async (userId: number) => {
    const newApiKey = await addApiKey(userId);
    if (newApiKey) {
      setApiKeys([...apiKeys, newApiKey]);
      setIsAdding(false);
    }
  };

  const handleDeleteApiKey = async (id: number) => {
    await deleteApiKey(id);
    setApiKeys(apiKeys.filter((apiKey) => apiKey.id !== id));
  };

  return (
    <div>
      <h1>API Keys</h1>
      {isAdding && <ApiKeyForm onAdd={handleAddApiKey} />}
      {!isAdding && (
        <button onClick={() => setIsAdding(true)}>Add API Key</button>
      )}
      <ApiKeysTable apiKeys={apiKeys} onDelete={handleDeleteApiKey} />
    </div>
  );
}
