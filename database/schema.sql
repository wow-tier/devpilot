-- ============================================
-- AI Code Agent - Complete Database Schema
-- Database: devpilot
-- ============================================

-- Create database (run this first)
-- CREATE DATABASE devpilot;
-- \c devpilot;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- User Management
-- ============================================

CREATE TABLE "User" (
    id VARCHAR(30) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    "githubId" VARCHAR(100) UNIQUE,
    "githubUsername" VARCHAR(100),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_github ON "User"("githubId");

CREATE TABLE "Session" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "userAgent" VARCHAR(500),
    "ipAddress" VARCHAR(45),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_session_user ON "Session"("userId");
CREATE INDEX idx_session_token ON "Session"(token);

-- ============================================
-- Subscription & Billing
-- ============================================

CREATE TABLE "Plan" (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    "displayName" VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    interval VARCHAR(20) NOT NULL,
    features JSONB,
    "maxRepositories" INTEGER DEFAULT 5,
    "maxAIRequests" INTEGER DEFAULT 100,
    "maxStorage" INTEGER DEFAULT 1000,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_name ON "Plan"(name);

-- Insert default plans
INSERT INTO "Plan" (id, name, "displayName", description, price, interval, features, "maxRepositories", "maxAIRequests", "maxStorage") VALUES
('plan_free', 'free', 'Free', 'Perfect for trying out', 0.00, 'month', '{"aiRequests": 100, "repositories": 5, "support": "community"}', 5, 100, 1000),
('plan_pro', 'pro', 'Pro', 'For professional developers', 29.00, 'month', '{"aiRequests": 10000, "repositories": 50, "support": "email", "priority": true}', 50, 10000, 10000),
('plan_enterprise', 'enterprise', 'Enterprise', 'For teams and organizations', 99.00, 'month', '{"aiRequests": -1, "repositories": -1, "support": "24/7", "priority": true, "customModels": true}', -1, -1, -1);

CREATE TABLE "Subscription" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    "planId" VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    "currentPeriodStart" TIMESTAMP NOT NULL,
    "currentPeriodEnd" TIMESTAMP NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
    "stripeCustomerId" VARCHAR(100),
    "stripeSubscriptionId" VARCHAR(100) UNIQUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY ("planId") REFERENCES "Plan"(id)
);

CREATE INDEX idx_subscription_user ON "Subscription"("userId");
CREATE INDEX idx_subscription_plan ON "Subscription"("planId");
CREATE INDEX idx_subscription_status ON "Subscription"(status);

CREATE TABLE "Payment" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(20) NOT NULL,
    "stripePaymentId" VARCHAR(100) UNIQUE,
    description TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_user ON "Payment"("userId");
CREATE INDEX idx_payment_status ON "Payment"(status);
CREATE INDEX idx_payment_created ON "Payment"("createdAt");

-- ============================================
-- Repository Management
-- ============================================

CREATE TABLE "Repository" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255),
    url VARCHAR(500) NOT NULL,
    "gitUrl" VARCHAR(500),
    "sshUrl" VARCHAR(500),
    "defaultBranch" VARCHAR(100) DEFAULT 'main',
    description TEXT,
    language VARCHAR(50),
    "isPrivate" BOOLEAN DEFAULT false,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    "githubId" VARCHAR(100) UNIQUE,
    "lastSyncedAt" TIMESTAMP,
    "lastAccessedAt" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_repository_user ON "Repository"("userId");
CREATE INDEX idx_repository_github ON "Repository"("githubId");
CREATE INDEX idx_repository_active ON "Repository"("isActive");

CREATE TABLE "Branch" (
    id VARCHAR(30) PRIMARY KEY,
    "repositoryId" VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sha VARCHAR(40) NOT NULL,
    "isDefault" BOOLEAN DEFAULT false,
    protected BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("repositoryId") REFERENCES "Repository"(id) ON DELETE CASCADE,
    UNIQUE("repositoryId", name)
);

CREATE INDEX idx_branch_repository ON "Branch"("repositoryId");

CREATE TABLE "Commit" (
    id VARCHAR(30) PRIMARY KEY,
    "repositoryId" VARCHAR(30) NOT NULL,
    sha VARCHAR(40) UNIQUE NOT NULL,
    message TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    "authorEmail" VARCHAR(255),
    branch VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("repositoryId") REFERENCES "Repository"(id) ON DELETE CASCADE
);

CREATE INDEX idx_commit_repository ON "Commit"("repositoryId");
CREATE INDEX idx_commit_sha ON "Commit"(sha);

-- ============================================
-- AI & Code Modifications
-- ============================================

CREATE TABLE "ApiKey" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    "keyHash" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "lastUsed" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_apikey_user ON "ApiKey"("userId");
CREATE INDEX idx_apikey_provider ON "ApiKey"(provider);

CREATE TABLE "CodeModification" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30),
    "repositoryId" VARCHAR(30),
    "filePath" VARCHAR(500) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    "originalCode" TEXT NOT NULL,
    "modifiedCode" TEXT NOT NULL,
    prompt TEXT NOT NULL,
    "aiModel" VARCHAR(100) NOT NULL,
    "tokensUsed" INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE SET NULL
);

CREATE INDEX idx_codemod_user ON "CodeModification"("userId");
CREATE INDEX idx_codemod_created ON "CodeModification"("createdAt");
CREATE INDEX idx_codemod_status ON "CodeModification"(status);

-- ============================================
-- Usage & Analytics
-- ============================================

CREATE TABLE "UsageStats" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    "aiRequests" INTEGER DEFAULT 0,
    "tokensUsed" INTEGER DEFAULT 0,
    "storageUsed" INTEGER DEFAULT 0,
    repositories INTEGER DEFAULT 0,
    commits INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE("userId", date)
);

CREATE INDEX idx_usagestats_user ON "UsageStats"("userId");
CREATE INDEX idx_usagestats_date ON "UsageStats"(date);

CREATE TABLE "ActivityLog" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255),
    metadata JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activitylog_user ON "ActivityLog"("userId");
CREATE INDEX idx_activitylog_action ON "ActivityLog"(action);
CREATE INDEX idx_activitylog_created ON "ActivityLog"("createdAt");

-- ============================================
-- Collaboration & Teams
-- ============================================

CREATE TABLE "Team" (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    "ownerId" VARCHAR(30) NOT NULL,
    plan VARCHAR(20) DEFAULT 'free',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_slug ON "Team"(slug);
CREATE INDEX idx_team_owner ON "Team"("ownerId");

CREATE TABLE "TeamMember" (
    id VARCHAR(30) PRIMARY KEY,
    "teamId" VARCHAR(30) NOT NULL,
    "userId" VARCHAR(30) NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("teamId") REFERENCES "Team"(id) ON DELETE CASCADE,
    UNIQUE("teamId", "userId")
);

CREATE INDEX idx_teammember_team ON "TeamMember"("teamId");
CREATE INDEX idx_teammember_user ON "TeamMember"("userId");

-- ============================================
-- Notifications & Webhooks
-- ============================================

CREATE TABLE "Notification" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    link VARCHAR(500),
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_user ON "Notification"("userId");
CREATE INDEX idx_notification_read ON "Notification"("isRead");
CREATE INDEX idx_notification_created ON "Notification"("createdAt");

CREATE TABLE "Webhook" (
    id VARCHAR(30) PRIMARY KEY,
    "userId" VARCHAR(30) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_user ON "Webhook"("userId");
CREATE INDEX idx_webhook_active ON "Webhook"("isActive");

-- ============================================
-- Functions & Triggers
-- ============================================

-- Auto update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_updated_at BEFORE UPDATE ON "Plan" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repository_updated_at BEFORE UPDATE ON "Repository" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branch_updated_at BEFORE UPDATE ON "Branch" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apikey_updated_at BEFORE UPDATE ON "ApiKey" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON "Team" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhook_updated_at BEFORE UPDATE ON "Webhook" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views for Common Queries
-- ============================================

-- Active users with their current plan
CREATE VIEW "ActiveUsersWithPlan" AS
SELECT 
    u.id,
    u.email,
    u.name,
    p.name as plan_name,
    p."displayName" as plan_display_name,
    s.status as subscription_status,
    s."currentPeriodEnd" as subscription_end
FROM "User" u
LEFT JOIN "Subscription" s ON u.id = s."userId" AND s.status = 'active'
LEFT JOIN "Plan" p ON s."planId" = p.id;

-- User usage summary
CREATE VIEW "UserUsageSummary" AS
SELECT 
    u.id,
    u.email,
    COUNT(DISTINCT r.id) as total_repositories,
    COUNT(DISTINCT cm.id) as total_modifications,
    COALESCE(SUM(us."aiRequests"), 0) as total_ai_requests,
    COALESCE(SUM(us."tokensUsed"), 0) as total_tokens_used
FROM "User" u
LEFT JOIN "Repository" r ON u.id = r."userId"
LEFT JOIN "CodeModification" cm ON u.id = cm."userId"
LEFT JOIN "UsageStats" us ON u.id = us."userId"
GROUP BY u.id, u.email;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Add a test user (password: demo123 - bcrypt hashed)
-- INSERT INTO "User" (id, email, name, password) VALUES 
-- ('user_test1', 'demo@example.com', 'Demo User', '$2b$10$YourBcryptHashedPasswordHere');

COMMENT ON DATABASE devpilot IS 'AI Code Agent - Complete SaaS Platform Database';
