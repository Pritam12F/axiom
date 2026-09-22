import type {
  Agent,
  AgentEvent,
  ApprovalRequest,
  Group,
  Project,
  Task,
  ActivityFeedItem,
} from "./types"

// Deterministic pseudo-random generator so server and client render identical
// sparkline data (Math.random() would differ between SSR and hydration).
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function sparkline(base: number, variance: number, n = 20) {
  const rand = seededRandom(Math.round(base * 1000 + variance))
  const arr: number[] = []
  let v = base
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * variance
    v = Math.max(4, Math.min(96, v))
    arr.push(Math.round(v))
  }
  return arr
}

export const groups: Group[] = [
  { id: "grp-atlas", name: "Atlas Squad", color: "#6366f1", projectId: "proj-webapp", memberIds: [] },
  { id: "grp-nebula", name: "Nebula Team", color: "#22c55e", projectId: "proj-api", memberIds: [] },
  { id: "grp-forge", name: "Forge Crew", color: "#f59e0b", projectId: null, memberIds: [] },
]

export const projects: Project[] = [
  {
    id: "proj-webapp",
    name: "web-app",
    repo: "github.com/acme/web-app",
    defaultBranch: "main",
    groupId: "grp-atlas",
    lastActivity: "3m ago",
    description: "Customer-facing Next.js storefront and account portal.",
  },
  {
    id: "proj-api",
    name: "core-api",
    repo: "github.com/acme/core-api",
    defaultBranch: "develop",
    groupId: "grp-nebula",
    lastActivity: "12m ago",
    description: "Internal REST + gRPC services powering billing and orders.",
  },
  {
    id: "proj-mobile",
    name: "mobile-shell",
    repo: "github.com/acme/mobile-shell",
    defaultBranch: "main",
    groupId: null,
    lastActivity: "1h ago",
    description: "React Native shell app for iOS and Android clients.",
  },
]

export const agents: Agent[] = [
  {
    id: "agt-atlas",
    name: "atlas",
    avatarColor: "#6366f1",
    status: "running",
    groupId: "grp-atlas",
    projectId: "proj-webapp",
    currentTask: "Refactoring checkout flow to use server actions",
    uptimeMinutes: 187,
    role: "Planner",
    machine: {
      size: "large",
      vcpu: 8,
      memoryGb: 16,
      diskGb: 100,
      region: "us-east",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.3.11",
      costPerHour: 0.42,
      cpuHistory: sparkline(55, 20),
      memoryPercent: 62,
      diskPercent: 34,
    },
  },
  {
    id: "agt-nova",
    name: "nova",
    avatarColor: "#22c55e",
    status: "running",
    groupId: "grp-nebula",
    projectId: "proj-api",
    currentTask: "Running npm test on billing service",
    uptimeMinutes: 94,
    role: "Worker",
    machine: {
      size: "medium",
      vcpu: 4,
      memoryGb: 8,
      diskGb: 60,
      region: "us-east",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.3.18",
      costPerHour: 0.21,
      cpuHistory: sparkline(70, 25),
      memoryPercent: 48,
      diskPercent: 21,
    },
  },
  {
    id: "agt-orion",
    name: "orion",
    avatarColor: "#0ea5e9",
    status: "needs-approval",
    groupId: "grp-nebula",
    projectId: "proj-api",
    currentTask: "Wants approval to force-push hotfix branch",
    uptimeMinutes: 41,
    role: "Worker",
    machine: {
      size: "medium",
      vcpu: 4,
      memoryGb: 8,
      diskGb: 60,
      region: "eu-west",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.5.4",
      costPerHour: 0.21,
      cpuHistory: sparkline(30, 15),
      memoryPercent: 33,
      diskPercent: 18,
    },
  },
  {
    id: "agt-vega",
    name: "vega",
    avatarColor: "#a855f7",
    status: "idle",
    groupId: "grp-atlas",
    projectId: "proj-webapp",
    currentTask: null,
    uptimeMinutes: 302,
    role: "Reviewer",
    machine: {
      size: "small",
      vcpu: 2,
      memoryGb: 4,
      diskGb: 40,
      region: "us-east",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.3.22",
      costPerHour: 0.11,
      cpuHistory: sparkline(8, 6),
      memoryPercent: 22,
      diskPercent: 14,
    },
  },
  {
    id: "agt-lyra",
    name: "lyra",
    avatarColor: "#ec4899",
    status: "sleeping",
    groupId: "grp-forge",
    projectId: null,
    currentTask: null,
    uptimeMinutes: 15,
    role: "Planner",
    machine: {
      size: "small",
      vcpu: 2,
      memoryGb: 4,
      diskGb: 40,
      region: "us-west",
      baseImage: "ubuntu-24.04-python3.12",
      ip: "10.42.7.9",
      costPerHour: 0.11,
      cpuHistory: sparkline(3, 3),
      memoryPercent: 9,
      diskPercent: 6,
    },
  },
  {
    id: "agt-kestrel",
    name: "kestrel",
    avatarColor: "#ef4444",
    status: "error",
    groupId: "grp-forge",
    projectId: "proj-mobile",
    currentTask: "Build failed — missing native module linkage",
    uptimeMinutes: 63,
    role: "Worker",
    machine: {
      size: "medium",
      vcpu: 4,
      memoryGb: 8,
      diskGb: 60,
      region: "us-west",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.7.14",
      costPerHour: 0.21,
      cpuHistory: sparkline(40, 30),
      memoryPercent: 71,
      diskPercent: 45,
    },
  },
  {
    id: "agt-sable",
    name: "sable",
    avatarColor: "#14b8a6",
    status: "running",
    groupId: "grp-atlas",
    projectId: "proj-webapp",
    currentTask: "Writing integration tests for cart persistence",
    uptimeMinutes: 22,
    role: "Reviewer",
    machine: {
      size: "small",
      vcpu: 2,
      memoryGb: 4,
      diskGb: 40,
      region: "us-east",
      baseImage: "ubuntu-24.04-node20",
      ip: "10.42.3.30",
      costPerHour: 0.11,
      cpuHistory: sparkline(45, 18),
      memoryPercent: 38,
      diskPercent: 12,
    },
  },
]

groups.forEach((g) => {
  g.memberIds = agents.filter((a) => a.groupId === g.id).map((a) => a.id)
})

export const tasks: Task[] = [
  { id: "task-1", projectId: "proj-webapp", title: "Refactor checkout to server actions", column: "in-progress", assigneeAgentId: "agt-atlas", branch: "atlas/checkout-server-actions", prStatus: "draft" },
  { id: "task-2", projectId: "proj-webapp", title: "Add cart persistence integration tests", column: "in-progress", assigneeAgentId: "agt-sable", branch: "sable/cart-persist-tests", prStatus: "none" },
  { id: "task-3", projectId: "proj-webapp", title: "Review PR #138 — pricing table redesign", column: "in-review", assigneeAgentId: "agt-vega", branch: "atlas/pricing-table", prStatus: "review", prNumber: 138 },
  { id: "task-4", projectId: "proj-webapp", title: "Fix hydration mismatch on /account", column: "planned", assigneeAgentId: null, branch: null, prStatus: "none" },
  { id: "task-5", projectId: "proj-webapp", title: "Migrate analytics to server-side events", column: "done", assigneeAgentId: "agt-atlas", branch: "atlas/analytics-migration", prStatus: "merged", prNumber: 129 },
  { id: "task-6", projectId: "proj-api", title: "Run full billing regression suite", column: "in-progress", assigneeAgentId: "agt-nova", branch: "nova/billing-regression", prStatus: "none" },
  { id: "task-7", projectId: "proj-api", title: "Force-push hotfix for webhook retries", column: "in-progress", assigneeAgentId: "agt-orion", branch: "orion/webhook-retry-hotfix", prStatus: "open", prNumber: 141 },
  { id: "task-8", projectId: "proj-api", title: "Add rate limiting to /v1/orders", column: "planned", assigneeAgentId: null, branch: null, prStatus: "none" },
  { id: "task-9", projectId: "proj-api", title: "Document billing webhook contract", column: "done", assigneeAgentId: "agt-nova", branch: "nova/webhook-docs", prStatus: "merged", prNumber: 118 },
]

export const agentEvents: AgentEvent[] = [
  { id: "ev-1", agentId: "agt-atlas", kind: "thought", title: "Planning checkout refactor", detail: "Breaking the checkout flow into three server actions: createOrder, applyDiscount, and finalizePayment. Will keep the existing Stripe integration untouched.", timestamp: minutesAgo(2) },
  { id: "ev-2", agentId: "agt-atlas", kind: "file-edit", title: "Edited app/checkout/actions.ts", detail: "+42 -18 lines", timestamp: minutesAgo(4) },
  { id: "ev-3", agentId: "agt-atlas", kind: "shell", title: "pnpm tsc --noEmit", detail: "No type errors found.", timestamp: minutesAgo(6) },
  { id: "ev-4", agentId: "agt-atlas", kind: "git", title: "Committed 3 files", detail: "refactor(checkout): extract server actions for order flow", timestamp: minutesAgo(8) },
  { id: "ev-5", agentId: "agt-atlas", kind: "test", title: "npm test -- checkout", detail: "18 passed, 0 failed", timestamp: minutesAgo(11) },
  { id: "ev-6", agentId: "agt-atlas", kind: "message", title: "Opened PR #142", detail: "refactor(checkout): move to server actions", timestamp: minutesAgo(14) },
  { id: "ev-7", agentId: "agt-nova", kind: "thought", title: "Investigating flaky billing test", detail: "The invoice rounding test fails intermittently. Suspect floating point comparison — switching to a tolerance-based assertion.", timestamp: minutesAgo(3) },
  { id: "ev-8", agentId: "agt-nova", kind: "shell", title: "npm test", detail: "3 failing: invoice.spec.ts", timestamp: minutesAgo(5) },
  { id: "ev-9", agentId: "agt-nova", kind: "file-edit", title: "Edited tests/invoice.spec.ts", detail: "+9 -4 lines", timestamp: minutesAgo(9) },
  { id: "ev-10", agentId: "agt-orion", kind: "thought", title: "Preparing hotfix for webhook retries", detail: "Retry backoff is not capped, causing duplicate charges under load. Need to force-push over the previous broken commit on this branch.", timestamp: minutesAgo(1) },
  { id: "ev-11", agentId: "agt-orion", kind: "shell", title: "git push --force origin orion/webhook-retry-hotfix", detail: "Awaiting human approval.", timestamp: minutesAgo(1) },
  { id: "ev-12", agentId: "agt-kestrel", kind: "shell", title: "npx react-native run-ios", detail: "Build failed: missing native module 'RNFastImage'", timestamp: minutesAgo(7) },
  { id: "ev-13", agentId: "agt-kestrel", kind: "thought", title: "Diagnosing missing native module", detail: "Pod install likely did not run after the last dependency bump. Attempting pod install and rebuild.", timestamp: minutesAgo(5) },
  { id: "ev-14", agentId: "agt-sable", kind: "file-edit", title: "Edited tests/cart-persist.spec.ts", detail: "+61 -0 lines", timestamp: minutesAgo(3) },
  { id: "ev-15", agentId: "agt-sable", kind: "test", title: "npm test -- cart", detail: "7 passed, 0 failed", timestamp: minutesAgo(1) },
]

export const approvalRequests: ApprovalRequest[] = [
  {
    id: "appr-1",
    agentId: "agt-orion",
    projectId: "proj-api",
    command: "git push --force origin main",
    reason: "Rewriting webhook retry history to remove an accidental secret commit before merging the hotfix.",
    risk: "high",
    createdAt: minutesAgo(1),
    status: "pending",
  },
  {
    id: "appr-2",
    agentId: "agt-kestrel",
    projectId: "proj-mobile",
    command: "rm -rf ./dist && npm publish",
    reason: "Clearing stale build output before publishing the mobile-shell package to the internal registry.",
    risk: "high",
    createdAt: minutesAgo(6),
    status: "pending",
  },
  {
    id: "appr-3",
    agentId: "agt-nova",
    projectId: "proj-api",
    command: "npm audit fix --force",
    reason: "Resolving 4 high severity advisories in transitive dependencies ahead of the billing release.",
    risk: "medium",
    createdAt: minutesAgo(19),
    status: "pending",
  },
  {
    id: "appr-4",
    agentId: "agt-atlas",
    projectId: "proj-webapp",
    command: "vercel env pull .env.local",
    reason: "Syncing preview environment variables needed to run the checkout integration tests locally.",
    risk: "low",
    createdAt: minutesAgo(32),
    status: "pending",
  },
]

export const activityFeed: ActivityFeedItem[] = [
  { id: "act-1", agentId: "agt-atlas", message: "atlas opened PR #142 on web-app", timestamp: minutesAgo(14) },
  { id: "act-2", agentId: "agt-nova", message: "nova ran npm test — 3 failures on core-api", timestamp: minutesAgo(5) },
  { id: "act-3", agentId: "agt-sable", message: "sable committed cart persistence tests on web-app", timestamp: minutesAgo(3) },
  { id: "act-4", agentId: "agt-orion", message: "orion requested approval to force-push on core-api", timestamp: minutesAgo(1) },
  { id: "act-5", agentId: "agt-kestrel", message: "kestrel hit a build error on mobile-shell", timestamp: minutesAgo(7) },
  { id: "act-6", agentId: "agt-vega", message: "vega reviewed PR #138 on web-app", timestamp: minutesAgo(22) },
  { id: "act-7", agentId: "agt-atlas", message: "atlas committed 3 files to atlas/checkout-server-actions", timestamp: minutesAgo(8) },
  { id: "act-8", agentId: "agt-lyra", message: "lyra went to sleep after 15 minutes of inactivity", timestamp: minutesAgo(30) },
]

export const terminalOutput: Record<string, string[]> = {
  "agt-atlas": [
    "$ pnpm tsc --noEmit",
    "",
    "> web-app@1.4.2 tsc",
    "> tsc --noEmit",
    "",
    "No type errors found. Done in 4.2s.",
    "",
    "$ git commit -m \"refactor(checkout): extract server actions for order flow\"",
    "[atlas/checkout-server-actions 8f3a1c2] refactor(checkout): extract server actions for order flow",
    " 3 files changed, 42 insertions(+), 18 deletions(-)",
    "",
    "$ gh pr create --title \"refactor(checkout): move to server actions\" --body \"...\"",
    "https://github.com/acme/web-app/pull/142",
    "",
    "$ _",
  ],
  "agt-nova": [
    "$ npm test",
    "",
    "  Billing Service",
    "    invoice generation",
    "      ✓ creates invoice with correct line items (12ms)",
    "      ✗ rounds totals to 2 decimal places (4ms)",
    "      ✗ applies tax before discount (3ms)",
    "      ✗ handles currency conversion edge case (6ms)",
    "",
    "  3 failing, 41 passing",
    "",
    "$ _",
  ],
  "agt-orion": [
    "$ git log --oneline -5",
    "a1b2c3d fix(webhooks): cap retry backoff at 30s",
    "9f8e7d6 chore: remove accidental .env commit",
    "3c4d5e6 fix(webhooks): add jitter to retry backoff",
    "",
    "$ git push --force origin orion/webhook-retry-hotfix",
    "Waiting for approval to run this command...",
    "$ _",
  ],
  "agt-kestrel": [
    "$ npx react-native run-ios",
    "info Found Xcode workspace mobile-shell.xcworkspace",
    "error Missing native module 'RNFastImage'.",
    "  Ensure pod install has been run after adding this dependency.",
    "",
    "$ pod install",
    "Analyzing dependencies",
    "Downloading dependencies",
    "Generating Pods project",
    "Integrating client project",
    "",
    "$ _",
  ],
  "agt-vega": ["$ gh pr diff 138 | head -40", "diff --git a/components/pricing-table.tsx b/components/pricing-table.tsx", "...", "$ _"],
  "agt-lyra": ["$ echo 'idle — no active session'", "idle — no active session", "$ _"],
  "agt-sable": [
    "$ npm test -- cart",
    "",
    "  Cart Persistence",
    "    ✓ persists cart across reloads (18ms)",
    "    ✓ merges guest cart on login (22ms)",
    "    ✓ expires cart after 30 days (5ms)",
    "",
    "  7 passing",
    "",
    "$ _",
  ],
}

export const diffsByAgent: Record<string, { file: string; hunks: string[] }[]> = {
  "agt-atlas": [
    {
      file: "app/checkout/actions.ts",
      hunks: [
        `@@ -1,12 +1,18 @@\n-export async function checkout(formData: FormData) {\n-  // handled everything inline\n-  const order = createOrderInline(formData)\n-  return order\n-}\n+export async function createOrder(formData: FormData) {\n+  const order = await buildOrder(formData)\n+  return order\n+}\n+\n+export async function applyDiscount(orderId: string, code: string) {\n+  return await discountService.apply(orderId, code)\n+}\n+\n+export async function finalizePayment(orderId: string) {\n+  return await paymentService.charge(orderId)\n+}`,
      ],
    },
    {
      file: "app/checkout/page.tsx",
      hunks: [
        `@@ -22,7 +22,7 @@\n-  <form action={checkout}>\n+  <form action={createOrder}>\n     <SubmitButton />\n   </form>`,
      ],
    },
  ],
  "agt-nova": [
    {
      file: "tests/invoice.spec.ts",
      hunks: [
        `@@ -14,7 +14,12 @@\n-  expect(total).toBe(19.99)\n+  expect(total).toBeCloseTo(19.99, 2)\n+\n+  it('handles currency conversion edge case', () => {\n+    const result = convert(19.995, 'USD', 'EUR')\n+    expect(result).toBeCloseTo(18.42, 2)\n+  })`,
      ],
    },
  ],
  "agt-sable": [
    {
      file: "tests/cart-persist.spec.ts",
      hunks: [
        `@@ -0,0 +1,61 @@\n+describe('Cart Persistence', () => {\n+  it('persists cart across reloads', async () => {\n+    // ...\n+  })\n+  it('merges guest cart on login', async () => {\n+    // ...\n+  })\n+})`,
      ],
    },
  ],
}

function minutesAgo(n: number) {
  return new Date(Date.now() - n * 60_000).toISOString()
}

export const dailyBudget = 48
export const spendToday = 31.6
