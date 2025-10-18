'use client';
import { useState, useEffect } from 'react';
import PlansTable from './../components/PlansTable';
import PlanForm from './../components/PlanForm';

interface Plan {
  id: number;
  name: string;
  price: number;
}

// Replace with your actual API endpoints
const API_URL = 'YOUR_API_URL';
const PLANS_API_ENDPOINT = `${API_URL}/api/plans`;

async function getPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(PLANS_API_ENDPOINT);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function addPlan(plan: { name: string; price: number }): Promise<Plan | null> {
  try {
    const response = await fetch(PLANS_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Failed to add plan');
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function deletePlan(id: number): Promise<void> {
  try {
    const response = await fetch(`${PLANS_API_ENDPOINT}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete plan');
  } catch (error) {
    console.error(error);
  }
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);

  // Now handleAddPlan accepts a single object
 const handleAddPlan = async (plan: { name: string; price: number }) => {
  const newPlan = await addPlan(plan);
  if (newPlan) {
    setPlans([...plans, newPlan]);
    setIsAdding(false);
  }
};

  const handleDeletePlan = async (id: number) => {
    await deletePlan(id);
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  return (
    <div>
      <h1>Plans</h1>
      {isAdding ? (
        <PlanForm onAdd={handleAddPlan} />
      ) : (
        <button onClick={() => setIsAdding(true)}>Add Plan</button>
      )}
      <PlansTable plans={plans} onDelete={handleDeletePlan} />
    </div>
  );
}
