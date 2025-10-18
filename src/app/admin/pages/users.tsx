import { useState, useEffect } from 'react';
import UsersTable from './../components/UsersTable';
import UserForm from './../components/UserForm';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Replace with your actual API endpoints
const API_URL = 'YOUR_API_URL';

async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Or re-throw the error, or return a default value
  }
}

async function addUser(user: { name: string; email: string; isAdmin: boolean }): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}

async function updateUser(user: User): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

async function deleteUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    fetchUsers();
  }, []);

  const handleAddUser = async (user: { name: string; email: string; isAdmin: boolean }) => {
    const newUser = await addUser(user);
    if (newUser) {
      setUsers([...users, newUser]);
      setIsAdding(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsAdding(false);
  };

  const handleSaveUser = async (user: {
    id?: number;
    name: string;
    email: string;
    isAdmin: boolean;
  }) => {
    if (user.id) {
      // Update existing user
      const updatedUser = await updateUser(user as User);
      if (updatedUser) {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
      }
    } else {
      // Add new user
      await handleAddUser(user);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h1>Users</h1>
      {isAdding || editingUser ? (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelEdit}
        />
      ) : (
        <button onClick={() => setIsAdding(true)}>Add User</button>
      )}
      <UsersTable users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} />
    </div>
  );
}
