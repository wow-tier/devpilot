-- ============================================
-- Seed Data for AI Code Agent
-- Database: devpilot
-- ============================================

-- Insert Plans
INSERT INTO "Plan" (id, name, "displayName", description, price, interval, features, "maxRepositories", "maxAIRequests", "maxStorage", "isActive") VALUES
('clfree001', 'free', 'Free Plan', 'Perfect for trying out AI Code Agent', 0.00, 'month', 
 '{"aiRequests": 100, "repositories": 5, "storage": "1GB", "support": "community", "features": ["Basic AI assistance", "5 repositories", "Community support"]}', 
 5, 100, 1000, true),

('clpro0001', 'pro', 'Pro Plan', 'For professional developers and small teams', 29.00, 'month',
 '{"aiRequests": 10000, "repositories": 50, "storage": "10GB", "support": "email", "features": ["Advanced AI models", "50 repositories", "Priority support", "Custom themes", "Advanced analytics"]}',
 50, 10000, 10000, true),

('clent0001', 'enterprise', 'Enterprise Plan', 'For large teams and organizations', 99.00, 'month',
 '{"aiRequests": -1, "repositories": -1, "storage": "unlimited", "support": "24/7", "features": ["Unlimited everything", "Custom AI models", "24/7 phone support", "SLA guarantee", "On-premise option", "SSO/SAML"]}',
 -1, -1, -1, true);

-- Insert Sample Test User (password is 'demo123' - you should hash this with bcrypt)
-- Bcrypt hash for 'demo123': $2b$10$rF8Kw7L5z9X1Y2Z3A4B5C.abcdefghijklmnopqrstuvwxyz1234567
INSERT INTO "User" (id, email, name, password, "emailVerified", "createdAt") VALUES
('usr_demo001', 'demo@aicode.dev', 'Demo User', '$2b$10$rF8Kw7L5z9X1Y2Z3A4B5C.abcdefghijklmnopqrstuvwxyz1234567', NOW(), NOW());

-- Create Free Subscription for Demo User
INSERT INTO "Subscription" (id, "userId", "planId", status, "currentPeriodStart", "currentPeriodEnd", "createdAt") VALUES
('sub_demo001', 'usr_demo001', 'clfree001', 'active', NOW(), NOW() + INTERVAL '30 days', NOW());

-- Insert Sample Repositories
INSERT INTO "Repository" (id, "userId", name, "fullName", url, "defaultBranch", description, language, "isPrivate", stars, forks, "lastAccessedAt", "createdAt") VALUES
('repo_001', 'usr_demo001', 'my-nextjs-app', 'demo/my-nextjs-app', 'https://github.com/demo/my-nextjs-app.git', 'main', 'A Next.js application with AI integration', 'TypeScript', false, 12, 3, NOW(), NOW()),
('repo_002', 'usr_demo001', 'python-api', 'demo/python-api', 'https://github.com/demo/python-api.git', 'main', 'FastAPI backend service', 'Python', true, 8, 1, NOW(), NOW()),
('repo_003', 'usr_demo001', 'react-dashboard', 'demo/react-dashboard', 'https://github.com/demo/react-dashboard.git', 'main', 'React admin dashboard', 'JavaScript', false, 25, 7, NOW(), NOW());

-- Insert Sample Branches
INSERT INTO "Branch" (id, "repositoryId", name, sha, "isDefault", protected, "createdAt") VALUES
('br_001', 'repo_001', 'main', 'abc123def456', true, true, NOW()),
('br_002', 'repo_001', 'develop', 'def789ghi012', false, false, NOW()),
('br_003', 'repo_002', 'main', 'ghi345jkl678', true, true, NOW());

-- Insert Sample Commits
INSERT INTO "Commit" (id, "repositoryId", sha, message, author, "authorEmail", branch, timestamp, "createdAt") VALUES
('cmt_001', 'repo_001', 'abc123def456', 'feat: add user authentication', 'Demo User', 'demo@aicode.dev', 'main', NOW() - INTERVAL '2 days', NOW()),
('cmt_002', 'repo_001', 'def456ghi789', 'fix: resolve login bug', 'Demo User', 'demo@aicode.dev', 'main', NOW() - INTERVAL '1 day', NOW()),
('cmt_003', 'repo_002', 'ghi345jkl678', 'feat: add API endpoints', 'Demo User', 'demo@aicode.dev', 'main', NOW(), NOW());

-- Insert Sample Code Modifications (AI interactions)
INSERT INTO "CodeModification" (id, "userId", "repositoryId", "filePath", "fileName", language, "originalCode", "modifiedCode", prompt, "aiModel", "tokensUsed", status, "createdAt") VALUES
('mod_001', 'usr_demo001', 'repo_001', 'src/auth/login.ts', 'login.ts', 'TypeScript', 
 'export function login(email, password) { return api.post("/auth/login", { email, password }); }',
 'export async function login(email: string, password: string): Promise<User> { try { const response = await api.post<User>("/auth/login", { email, password }); return response.data; } catch (error) { throw new Error("Login failed"); } }',
 'Add TypeScript types and error handling to the login function',
 'gpt-4', 256, 'completed', NOW() - INTERVAL '1 hour'),

('mod_002', 'usr_demo001', 'repo_002', 'api/users.py', 'users.py', 'Python',
 'def get_user(id): return db.query(User).filter(User.id == id).first()',
 'async def get_user(id: int, db: Session = Depends(get_db)) -> Optional[User]: user = await db.query(User).filter(User.id == id).first() if not user: raise HTTPException(status_code=404, detail="User not found") return user',
 'Make this async and add error handling',
 'gpt-4', 312, 'completed', NOW() - INTERVAL '30 minutes');

-- Insert Usage Stats
INSERT INTO "UsageStats" (id, "userId", date, "aiRequests", "tokensUsed", "storageUsed", repositories, commits, "createdAt") VALUES
('stat_001', 'usr_demo001', CURRENT_DATE - INTERVAL '2 days', 15, 2400, 250, 3, 5, NOW()),
('stat_002', 'usr_demo001', CURRENT_DATE - INTERVAL '1 day', 22, 3600, 280, 3, 8, NOW()),
('stat_003', 'usr_demo001', CURRENT_DATE, 8, 1200, 300, 3, 3, NOW());

-- Insert Activity Logs
INSERT INTO "ActivityLog" (id, "userId", action, resource, metadata, "ipAddress", "createdAt") VALUES
('log_001', 'usr_demo001', 'user_login', 'session', '{"browser": "Chrome", "os": "macOS"}', '192.168.1.100', NOW() - INTERVAL '3 hours'),
('log_002', 'usr_demo001', 'repository_created', 'repo_001', '{"name": "my-nextjs-app"}', '192.168.1.100', NOW() - INTERVAL '2 hours'),
('log_003', 'usr_demo001', 'ai_request', 'code_modification', '{"model": "gpt-4", "tokens": 256}', '192.168.1.100', NOW() - INTERVAL '1 hour'),
('log_004', 'usr_demo001', 'commit_created', 'cmt_003', '{"repository": "repo_002", "branch": "main"}', '192.168.1.100', NOW() - INTERVAL '30 minutes');

-- Insert Notifications
INSERT INTO "Notification" (id, "userId", type, title, message, "isRead", link, "createdAt") VALUES
('notif_001', 'usr_demo001', 'success', 'Welcome to AI Code Agent!', 'Your account has been created successfully. Start by adding your first repository.', false, '/dashboard', NOW() - INTERVAL '3 hours'),
('notif_002', 'usr_demo001', 'info', 'AI Request Completed', 'Your code modification for login.ts has been completed successfully.', true, '/workspace', NOW() - INTERVAL '1 hour'),
('notif_003', 'usr_demo001', 'warning', 'Approaching API Limit', 'You have used 95 of 100 AI requests this month. Consider upgrading to Pro.', false, '/settings', NOW() - INTERVAL '10 minutes');

-- Insert Sample Webhook
INSERT INTO "Webhook" (id, "userId", url, events, secret, "isActive", "createdAt") VALUES
('hook_001', 'usr_demo001', 'https://myapp.com/webhooks/aicode', ARRAY['repository.created', 'code.modified', 'commit.pushed'], 'whsec_abcdef123456', true, NOW());

-- Insert Sample Team
INSERT INTO "Team" (id, name, slug, "ownerId", plan, "createdAt") VALUES
('team_001', 'Demo Team', 'demo-team', 'usr_demo001', 'pro', NOW());

-- Add user to team
INSERT INTO "TeamMember" (id, "teamId", "userId", role, "createdAt") VALUES
('tm_001', 'team_001', 'usr_demo001', 'owner', NOW());

-- Insert Sample Payment
INSERT INTO "Payment" (id, "userId", amount, currency, status, description, metadata, "createdAt") VALUES
('pay_001', 'usr_demo001', 29.00, 'usd', 'succeeded', 'Pro Plan - Monthly Subscription', 
 '{"planId": "clpro0001", "period": "2025-01"}', NOW() - INTERVAL '1 month');

-- Verify data
SELECT 'Users created: ' || COUNT(*) FROM "User";
SELECT 'Plans available: ' || COUNT(*) FROM "Plan";
SELECT 'Repositories: ' || COUNT(*) FROM "Repository";
SELECT 'Code Modifications: ' || COUNT(*) FROM "CodeModification";
SELECT 'Activity Logs: ' || COUNT(*) FROM "ActivityLog";

-- Show sample user info
SELECT 
    u.email,
    p."displayName" as plan,
    s.status as subscription_status,
    COUNT(DISTINCT r.id) as repositories,
    COUNT(DISTINCT cm.id) as ai_modifications
FROM "User" u
LEFT JOIN "Subscription" s ON u.id = s."userId"
LEFT JOIN "Plan" p ON s."planId" = p.id
LEFT JOIN "Repository" r ON u.id = r."userId"
LEFT JOIN "CodeModification" cm ON u.id = cm."userId"
WHERE u.email = 'demo@aicode.dev'
GROUP BY u.email, p."displayName", s.status;
