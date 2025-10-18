interface ApiKey {
  id: number;
  key: string;
  userId: number;
}

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onDelete: (id: number) => void;
}

export default function ApiKeysTable({ apiKeys, onDelete }: ApiKeysTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Key</th>
          <th>User ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((apiKey) => (
          <tr key={apiKey.id}>
            <td>{apiKey.id}</td>
            <td>{apiKey.key}</td>
            <td>{apiKey.userId}</td>
            <td>
              <button onClick={() => onDelete(apiKey.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>
    </table>
  );
}
