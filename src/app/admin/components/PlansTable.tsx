interface Plan {
  id: number;
  name: string;
  price: number;
}

interface PlansTableProps {
  plans: Plan[];
  onDelete: (id: number) => void;
}

export default function PlansTable({ plans, onDelete }: PlansTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan.id}>
            <td>{plan.id}</td>
            <td>{plan.name}</td>
            <td>${plan.price}</td>
            <td>
              <button onClick={() => onDelete(plan.id)}>Delete</button>
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
