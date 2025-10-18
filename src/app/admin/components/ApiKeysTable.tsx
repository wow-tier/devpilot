import { ApiKey } from '../pages/api-keys';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onDelete?: (id: number) => Promise<void>; // optional if you don't always need delete
}

export default function ApiKeysTable({ apiKeys, onDelete }: ApiKeysTableProps) {
  return (
    <div>
      {apiKeys.length === 0 ? (
        <p>No API keys yet.</p>
      ) : (
        <ul>
          {apiKeys.map((key) => (
            <li key={key.id}>
              {key.key}
              {onDelete && (
                <button
                  onClick={() => onDelete(key.id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
