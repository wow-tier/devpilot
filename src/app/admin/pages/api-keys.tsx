import { useState, useEffect } from 'react';
import ApiKeysTable from './../components/ApiKeysTable';
import ApiKeyForm from './../components/ApiKeyForm';

interface ApiKey {
  id: number;
  key: string;
  owner_id: number;
  created_at: string;
}

// Replace with your actual API endpoints
const API_URL = 'YOUR_API_URL';
const API_KEYS_API_ENDPOINT = `${API_URL}/api/api-keys`;

async function getApiKeys(): Promise<ApiKey[]> {
  try {
    const response = await fetch(API_KEYS_API_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching API keys:', error);
    // TODO: Handle the error appropriately
    return [];
  }
}

async function addApiKey(userId: number): Promise<ApiKey | null> {
  try {
    const response = await fetch(API_KEYS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner_id: userId }), // Assuming owner_id is the user ID
    });
    if (!response.ok) {
      throw new Error('Failed to add API key');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding API key:', error);
    // TODO: Handle the error appropriately
    return null;
  }
}

async function deleteApiKey(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_KEYS_API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    // TODO: Handle the error appropriately
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
