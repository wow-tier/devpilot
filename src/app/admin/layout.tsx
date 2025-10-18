import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <ul>
          <li>
            <a href="/admin/users">Users</a>
          </li>
          <li>
            <a href="/admin/plans">Plans</a>
          </li>
          <li>
            <a href="/admin/api-keys">API Keys</a>
          </li>
        </ul>
      </nav>
      <main className="admin-main">{children}</main>
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-nav {
          width: 200px;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .admin-nav ul {
          list-style: none;
          padding: 0;
        }
        .admin-nav li {
          margin-bottom: 10px;
        }
        .admin-main {
          flex-grow: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
