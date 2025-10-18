import { Trash2, Mail, Calendar, Database, Key, FolderGit2 } from 'lucide-react';
import { GlassPanel } from '../../components/ui';

interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  githubUsername?: string;
  _count?: {
    repositories: number;
    subscriptions: number;
    apiKeys: number;
  };
}

interface UsersTableProps {
  users: User[];
  onDelete: (id: string) => void;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  const handleDelete = (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
      onDelete(id);
    }
  };

  if (users.length === 0) {
    return (
      <GlassPanel className="p-8 text-center">
        <div className="text-4xl mb-3 opacity-50">👥</div>
        <p className="text-cursor-text-secondary">No users found</p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <GlassPanel key={user.id} className="p-5 hover:border-accent-blue/30 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-cursor-text">
                    {user.name || 'Unnamed User'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-cursor-text-muted">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {user.githubUsername && (
                  <div className="flex items-center gap-2 text-cursor-text-secondary">
                    <Database className="w-4 h-4" />
                    <span>@{user.githubUsername}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-cursor-text-secondary">
                  <FolderGit2 className="w-4 h-4" />
                  <span>{user._count?.repositories || 0} repos</span>
                </div>
                <div className="flex items-center gap-2 text-cursor-text-secondary">
                  <Key className="w-4 h-4" />
                  <span>{user._count?.apiKeys || 0} keys</span>
                </div>
                <div className="flex items-center gap-2 text-cursor-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(user.id, user.email)}
              className="p-2 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
