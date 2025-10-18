'use client';
import { useState, useEffect } from 'react';
import AdminLayout from './layout';
import UserForm from './components/UserForm';
import UsersTable from './components/UsersTable';
import PlanForm from './components/PlanForm';
import PlansTable from './components/PlansTable';
import ApiKeyForm from './components/ApiKeyForm';
import ApiKeysTable from './components/ApiKeysTable';

// Replace with your actual API base URL
const API_URL = 'YOUR_API_URL';

// ----------------- TYPES -----------------
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface Plan {
  id: number;
  name: string;
  price: number;
}

interface ApiKey {
  id: number;
  key: string;
  owner_id: number;
  created_at: string;
}

// ----------------- API FUNCTIONS -----------------
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...options, credentials: 'include' });
    if (!res.ok) throw new Error(`Failed request: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// USERS
const getUsers = () => fetchJSON<User[]>(`${API_URL}/api/users`);
const addUser = (user: { name: string; email: string; isAdmin: boolean }) =>
  fetchJSON<User>(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
const updateUser = (user: User) =>
  fetchJSON<User>(`${API_URL}/api/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
const deleteUser = (id: number) =>
  fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE', credentials: 'include' });

// PLANS
const getPlans = () => fetchJSON<Plan[]>(`${API_URL}/api/plans`);
const addPlan = (plan: { name: string; price: number }) =>
  fetchJSON<Plan>(`${API_URL}/api/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  });
const deletePlan = (id: number) =>
  fetch(`${API_URL}/api/plans/${id}`, { method: 'DELETE', credentials: 'include' });

// API KEYS
const getApiKeys = () => fetchJSON<ApiKey[]>(`${API_URL}/api/api-keys`);
const addApiKey = (owner_id: number) =>
  fetchJSON<ApiKey>(`${API_URL}/api/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner_id }),
  });
const deleteApiKey = (id: number) =>
  fetch(`${API_URL}/api/api-keys/${id}`, { method: 'DELETE', credentials: 'include' });

// CURRENT USER (ADMIN CHECK)
async function getCurrentUser(): Promise<User | null> {
  return fetchJSON<User>(`${API_URL}/api/me`);
}

// ----------------- ADMIN PAGE -----------------
export default function AdminIndex() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isAddingPlan, setIsAddingPlan] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAddingApiKey, setIsAddingApiKey] = useState(false);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoadingUser(false);

      if (user?.isAdmin) {
        const [u, p, k] = await Promise.all([getUsers(), getPlans(), getApiKeys()]);
        if (u) setUsers(u);
        if (p) setPlans(p);
        if (k) setApiKeys(k);
      }
    }
    loadData();
  }, []);

  if (loadingUser) return <p>Loading...</p>;
  if (!currentUser || !currentUser.isAdmin) return <p>You do not have permission to access the Admin Panel.</p>;

  // ----------------- HANDLERS -----------------
  const handleSaveUser = async (user: { id?: number; name: string; email: string; isAdmin: boolean }) => {
    if (user.id) {
      const updated = await updateUser(user as User);
      if (updated) setUsers(users.map(u => (u.id === updated.id ? updated : u)));
    } else {
      const created = await addUser(user);
      if (created) setUsers([...users, created]);
    }
    setEditingUser(null);
    setIsAddingUser(false);
  };
  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };
  const handleAddPlan = async (plan: { name: string; price: number }) => {
    const newPlan = await addPlan(plan);
    if (newPlan) {
      setPlans([...plans, newPlan]);
      setIsAddingPlan(false);
    }
  };
  const handleDeletePlan = async (id: number) => {
    await deletePlan(id);
    setPlans(plans.filter(p => p.id !== id));
  };
  const handleAddApiKey = async (owner_id: number) => {
    const newKey = await addApiKey(owner_id);
    if (newKey) {
      setApiKeys([...apiKeys, newKey]);
      setIsAddingApiKey(false);
    }
  };
  const handleDeleteApiKey = async (id: number) => {
    await deleteApiKey(id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  // ----------------- STYLES -----------------
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '10px',
    background: '#f9f9f9',
  };
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  return (
    <AdminLayout>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Panel</h1>

      <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* USERS */}
        <section style={cardStyle}>
          <h2>Users</h2>
          {isAddingUser || editingUser ? (
            <UserForm
              user={editingUser ?? undefined}
              onSave={handleSaveUser}
              onCancel={() => {
                setEditingUser(null);
                setIsAddingUser(false);
              }}
            />
          ) : (
            <button style={buttonStyle} onClick={() => setIsAddingUser(true)}>Add User</button>
          )}
          <UsersTable users={users} onEdit={setEditingUser} onDelete={handleDeleteUser} />
        </section>

        {/* PLANS */}
        <section style={cardStyle}>
          <h2>Plans</h2>
          {isAddingPlan ? (
            <PlanForm onAdd={handleAddPlan} />
          ) : (
            <button style={buttonStyle} onClick={() => setIsAddingPlan(true)}>Add Plan</button>
          )}
          <PlansTable plans={plans} onDelete={handleDeletePlan} />
        </section>

        {/* API KEYS */}
        <section style={cardStyle}>
          <h2>API Keys</h2>
          {isAddingApiKey ? (
            <ApiKeyForm onAdd={handleAddApiKey} />
          ) : (
            <button style={buttonStyle} onClick={() => setIsAddingApiKey(true)}>Add API Key</button>
          )}
          <ApiKeysTable apiKeys={apiKeys} onDelete={handleDeleteApiKey} />
        </section>
      </div>
    </AdminLayout>
  );
}
