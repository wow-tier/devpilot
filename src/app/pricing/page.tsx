'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Code2, Check, ArrowRight, Sparkles, Crown, Rocket
} from 'lucide-react';
import { GlassPanel, AccentButton } from '../components/ui';

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
  isActive: boolean;
  highlighted?: boolean;
  icon: React.ReactNode;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  useEffect(() => {
    loadPlans();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans');
      if (response.ok) {
        const data = await response.json();
        // Add icons and features to plans
        const enhancedPlans = data.plans.map((plan: Plan) => ({
          ...plan,
          features: getFeatures(plan.name),
          icon: getIcon(plan.name),
          highlighted: plan.name === 'pro'
        }));
        setPlans(enhancedPlans);
      } else {
        // Set default plans if API fails
        setPlans(getDefaultPlans());
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans(getDefaultPlans());
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name: string): React.ReactNode => {
    switch (name.toLowerCase()) {
      case 'free':
        return <Code2 className="w-6 h-6" />;
      case 'pro':
        return <Rocket className="w-6 h-6" />;
      case 'enterprise':
        return <Crown className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free':
        return [
          'Up to 3 repositories',
          '100 AI requests/month',
          '1GB storage',
          'Basic code editor',
          'Git integration',
          'Community support'
        ];
      case 'pro':
        return [
          'Unlimited repositories',
          '1,000 AI requests/month',
          '10GB storage',
          'Advanced code editor',
          'Git integration',
          'Priority support',
          'AI code review',
          'Custom themes',
          'Team collaboration'
        ];
      case 'enterprise':
        return [
          'Unlimited everything',
          'Custom AI requests',
          'Unlimited storage',
          'Enterprise features',
          'Dedicated support',
          'SLA guarantee',
          'Custom integrations',
          'Advanced security',
          'Team management',
          'SSO integration'
        ];
      default:
        return [];
    }
  };

  const getDefaultPlans = (): Plan[] => [
    {
      id: '1',
      name: 'free',
      displayName: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      features: getFeatures('free'),
      maxRepositories: 3,
      maxAIRequests: 100,
      maxStorage: 1000,
      isActive: true,
      icon: getIcon('free')
    },
    {
      id: '2',
      name: 'pro',
      displayName: 'Pro',
      description: 'For professional developers',
      price: 19,
      interval: 'month',
      features: getFeatures('pro'),
      maxRepositories: -1,
      maxAIRequests: 1000,
      maxStorage: 10000,
      isActive: true,
      highlighted: true,
      icon: getIcon('pro')
    },
    {
      id: '3',
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For large teams',
      price: 99,
      interval: 'month',
      features: getFeatures('enterprise'),
      maxRepositories: -1,
      maxAIRequests: -1,
      maxStorage: -1,
      isActive: true,
      icon: getIcon('enterprise')
    }
  ];

  return (
    <div className="min-h-screen bg-cursor-base relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-cursor-border bg-cursor-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-cursor-text">AI Code Agent</h1>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-cursor-text-muted hover:text-cursor-text transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
              <Link href="/login?signup=true">
                <AccentButton icon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </AccentButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-cursor-text mb-6 tracking-tight">
              Choose Your Plan
            </h2>
            
            <p className="text-lg md:text-xl text-cursor-text-secondary max-w-3xl mx-auto mb-10">
              Start free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-cursor-surface-hover rounded-cursor-md border border-cursor-border">
              <button
                onClick={() => setBillingInterval('month')}
                className={`px-4 py-2 rounded-cursor-sm text-sm font-medium transition-all ${
                  billingInterval === 'month'
                    ? 'bg-accent-blue text-white shadow-cursor-sm'
                    : 'text-cursor-text-muted hover:text-cursor-text'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                className={`px-4 py-2 rounded-cursor-sm text-sm font-medium transition-all relative ${
                  billingInterval === 'year'
                    ? 'bg-accent-blue text-white shadow-cursor-sm'
                    : 'text-cursor-text-muted hover:text-cursor-text'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-success text-white text-xs rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-cursor-text-secondary">Loading plans...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans
                .filter(plan => plan.isActive)
                .map((plan) => {
                  const yearlyPrice = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price * 12;
                  const displayPrice = billingInterval === 'year' ? yearlyPrice / 12 : plan.price;

                  return (
                    <GlassPanel
                      key={plan.id}
                      className={`p-8 relative ${
                        plan.highlighted
                          ? 'border-accent-blue shadow-accent-blue/10 shadow-2xl scale-105'
                          : ''
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="px-4 py-1 bg-accent-gradient text-white text-xs font-bold rounded-full shadow-cursor-md">
                            MOST POPULAR
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 rounded-cursor-md flex items-center justify-center ${
                          plan.highlighted
                            ? 'bg-accent-gradient text-white'
                            : 'bg-cursor-surface-hover text-accent-blue'
                        }`}>
                          {plan.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-cursor-text">{plan.displayName}</h3>
                          {plan.description && (
                            <p className="text-sm text-cursor-text-muted">{plan.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-5xl font-bold text-cursor-text">
                            ${Math.round(displayPrice)}
                          </span>
                          <span className="text-cursor-text-muted">/{billingInterval}</span>
                        </div>
                        {billingInterval === 'year' && plan.price > 0 && (
                          <p className="text-sm text-success">
                            Save ${Math.round(plan.price * 12 * 0.2)}/year
                          </p>
                        )}
                      </div>

                      <Link href="/login?signup=true">
                        <AccentButton
                          className="w-full mb-6"
                          variant={plan.highlighted ? 'primary' : 'secondary'}
                          icon={<ArrowRight className="w-4 h-4" />}
                        >
                          {plan.price === 0 ? 'Start Free' : 'Get Started'}
                        </AccentButton>
                      </Link>

                      <div className="space-y-3 pt-6 border-t border-cursor-border">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-cursor-text-secondary">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-cursor-text mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-cursor-text-secondary">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Our Free plan is available forever with no credit card required. Pro and Enterprise plans have a 14-day free trial.'
              },
              {
                q: 'What happens if I exceed my limits?',
                a: "You'll be notified when you approach your limits. You can upgrade anytime to get more resources."
              }
            ].map((faq, index) => (
              <GlassPanel key={index} className="p-6">
                <h4 className="text-lg font-semibold text-cursor-text mb-2">{faq.q}</h4>
                <p className="text-cursor-text-secondary">{faq.a}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cursor-border bg-cursor-surface/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-sm text-cursor-text-muted">
            <p>© 2025 AI Code Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
