'use client';

import { useState, useEffect } from 'react';
import { Crown, ArrowRight, Loader2 } from 'lucide-react';
import { GlassPanel, AccentButton } from '../../components/ui';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  interval: string;
  features: string[];
  maxRepositories: number;
  maxAIRequests: number;
  maxStorage: number;
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export default function SubscriptionPanel() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Fetch subscription details
        const subResponse = await fetch('/api/admin/users/' + data.user.id + '/subscription', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (subResponse.ok) {
          const subData = await subResponse.json();
          setCurrentPlan(subData.plan);
          setSubscription(subData.subscription);
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassPanel className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-8">
      <h2 className="text-xl font-bold text-cursor-text mb-6 flex items-center gap-3">
        <Crown className="w-5 h-5 text-yellow-500" />
        Subscription & Billing
      </h2>

      {currentPlan ? (
        <div className="space-y-6">
          <div className="p-6 bg-cursor-surface-hover rounded-cursor-md border border-cursor-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-cursor-text mb-1">
                  {currentPlan.displayName}
                </h3>
                <p className="text-cursor-text-secondary text-sm">
                  {currentPlan.description || 'Your current plan'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cursor-text">
                  ${currentPlan.price.toString()}
                </div>
                <div className="text-xs text-cursor-text-muted">
                  per {currentPlan.interval}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-sm">
                <div className="text-cursor-text-muted mb-1">Repositories</div>
                <div className="font-semibold text-cursor-text">
                  {currentPlan.maxRepositories === -1 ? 'Unlimited' : currentPlan.maxRepositories}
                </div>
              </div>
              <div className="text-sm">
                <div className="text-cursor-text-muted mb-1">AI Requests</div>
                <div className="font-semibold text-cursor-text">
                  {currentPlan.maxAIRequests === -1 ? 'Unlimited' : `${currentPlan.maxAIRequests}/mo`}
                </div>
              </div>
              <div className="text-sm">
                <div className="text-cursor-text-muted mb-1">Storage</div>
                <div className="font-semibold text-cursor-text">
                  {currentPlan.maxStorage === -1 ? 'Unlimited' : `${currentPlan.maxStorage}MB`}
                </div>
              </div>
            </div>

            {subscription && (
              <div className="text-xs text-cursor-text-muted pt-4 border-t border-cursor-border">
                {currentPlan.name === 'free' ? (
                  <p>Free plan - active indefinitely</p>
                ) : (
                  <>
                    <p>Status: <span className="text-success font-medium">{subscription.status}</span></p>
                    <p className="mt-1">
                      Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {currentPlan.name === 'free' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="flex-1">
                <AccentButton 
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Upgrade to Pro
                </AccentButton>
              </Link>
              <Link href="/pricing" className="flex-1">
                <AccentButton 
                  variant="secondary"
                  icon={<Crown className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  View All Plans
                </AccentButton>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Crown className="w-12 h-12 mx-auto mb-4 text-cursor-text-muted opacity-50" />
          <p className="text-cursor-text-secondary mb-4">No active subscription</p>
          <Link href="/pricing">
            <AccentButton icon={<ArrowRight className="w-4 h-4" />}>
              Choose a Plan
            </AccentButton>
          </Link>
        </div>
      )}
    </GlassPanel>
  );
}
