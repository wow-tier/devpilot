interface Plan {
  id: number;
  name: string;
  price: number;
}

interface PlansTableProps {
  plans: Plan[];
  onDelete?: (id: number) => Promise<void>;
}

export default function PlansTable({ plans, onDelete }: PlansTableProps) {
  return (
    <div>
      {plans.length === 0 ? (
        <p>No plans yet.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              {plan.name} - ${plan.price}
              {onDelete && (
                <button onClick={() => onDelete(plan.id)} className="ml-2 text-red-500">
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
