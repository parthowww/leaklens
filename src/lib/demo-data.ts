import { Transaction, Workspace } from '@/types';

export const DEMO_WORKSPACE: Workspace = {
  id: 'demo-workspace-01',
  name: 'Acme Digital Agency (Demo)',
  owner_id: 'demo-user-01',
  currency: 'INR',
  created_at: '2026-06-01T00:00:00Z',
};

export const DEMO_TRANSACTIONS: Transaction[] = [
  // 1. DUPLICATE PAYMENT CASE: Adobe Creative Cloud charged twice within 24 hours
  {
    id: 'tx-adobe-01',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-12',
    merchant: 'Adobe Systems Inc',
    description: 'Adobe All Apps Creative Cloud Subscription',
    amount: 5400,
    category: 'Software & Subscriptions',
    reference_id: 'ADB-99281-A',
    created_at: '2026-10-12T10:14:00Z',
  },
  {
    id: 'tx-adobe-02',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-13',
    merchant: 'Adobe Systems Inc',
    description: 'Adobe Creative Cloud All Apps Auto-Debit',
    amount: 5400,
    category: 'Software & Subscriptions',
    reference_id: 'ADB-99281-B',
    created_at: '2026-10-13T09:22:00Z',
  },

  // 2. RECURRING EXPENSE: Google Workspace (Monthly ₹1,500)
  {
    id: 'tx-gw-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-04',
    merchant: 'Google Workspace',
    description: 'Google Workspace Business Standard',
    amount: 1500,
    category: 'Software & Subscriptions',
    reference_id: 'GSUITE-2607',
    created_at: '2026-07-04T05:00:00Z',
  },
  {
    id: 'tx-gw-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-04',
    merchant: 'Google Workspace',
    description: 'Google Workspace Business Standard',
    amount: 1500,
    category: 'Software & Subscriptions',
    reference_id: 'GSUITE-2608',
    created_at: '2026-08-04T05:00:00Z',
  },
  {
    id: 'tx-gw-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-04',
    merchant: 'Google Workspace',
    description: 'Google Workspace Business Standard',
    amount: 1500,
    category: 'Software & Subscriptions',
    reference_id: 'GSUITE-2609',
    created_at: '2026-09-04T05:00:00Z',
  },
  {
    id: 'tx-gw-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-04',
    merchant: 'Google Workspace',
    description: 'Google Workspace Business Standard',
    amount: 1500,
    category: 'Software & Subscriptions',
    reference_id: 'GSUITE-2610',
    created_at: '2026-10-04T05:00:00Z',
  },

  // 3. RECURRING EXPENSE: Slack Pro (Monthly ₹3,200)
  {
    id: 'tx-slack-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-15',
    merchant: 'Slack Technologies',
    description: 'Slack Pro Plan - 4 seats',
    amount: 3200,
    category: 'Software & Subscriptions',
    reference_id: 'SLK-7712',
    created_at: '2026-07-15T08:00:00Z',
  },
  {
    id: 'tx-slack-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-15',
    merchant: 'Slack Technologies',
    description: 'Slack Pro Plan - 4 seats',
    amount: 3200,
    category: 'Software & Subscriptions',
    reference_id: 'SLK-8819',
    created_at: '2026-08-15T08:00:00Z',
  },
  {
    id: 'tx-slack-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-15',
    merchant: 'Slack Technologies',
    description: 'Slack Pro Plan - 4 seats',
    amount: 3200,
    category: 'Software & Subscriptions',
    reference_id: 'SLK-9901',
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'tx-slack-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-15',
    merchant: 'Slack Technologies',
    description: 'Slack Pro Plan - 4 seats',
    amount: 3200,
    category: 'Software & Subscriptions',
    reference_id: 'SLK-1023',
    created_at: '2026-10-15T08:00:00Z',
  },

  // 4. VENDOR PRICE INCREASE: Figma jumped from ₹1,200 to ₹1,800 (50% increase)
  {
    id: 'tx-figma-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-18',
    merchant: 'Figma Inc',
    description: 'Figma Design Team Seat',
    amount: 1200,
    category: 'Design Tools',
    reference_id: 'FIG-3041',
    created_at: '2026-07-18T11:00:00Z',
  },
  {
    id: 'tx-figma-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-18',
    merchant: 'Figma Inc',
    description: 'Figma Design Team Seat',
    amount: 1200,
    category: 'Design Tools',
    reference_id: 'FIG-4192',
    created_at: '2026-08-18T11:00:00Z',
  },
  {
    id: 'tx-figma-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-18',
    merchant: 'Figma Inc',
    description: 'Figma Design Team Seat (Tier Adjustment)',
    amount: 1800,
    category: 'Design Tools',
    reference_id: 'FIG-5290',
    created_at: '2026-09-18T11:00:00Z',
  },
  {
    id: 'tx-figma-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-18',
    merchant: 'Figma Inc',
    description: 'Figma Design Team Seat',
    amount: 1800,
    category: 'Design Tools',
    reference_id: 'FIG-6310',
    created_at: '2026-10-18T11:00:00Z',
  },

  // 5. UNUSUAL EXPENSE: AWS Hosting baseline ~₹4,200 surges to ₹24,850 (+492% surge)
  {
    id: 'tx-aws-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-02',
    merchant: 'Amazon Web Services',
    description: 'AWS Cloud Compute & S3 Hosting',
    amount: 4180,
    category: 'Cloud Infrastructure',
    reference_id: 'AWS-99120',
    created_at: '2026-07-02T02:00:00Z',
  },
  {
    id: 'tx-aws-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-02',
    merchant: 'Amazon Web Services',
    description: 'AWS Cloud Compute & S3 Hosting',
    amount: 4250,
    category: 'Cloud Infrastructure',
    reference_id: 'AWS-99230',
    created_at: '2026-08-02T02:00:00Z',
  },
  {
    id: 'tx-aws-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-02',
    merchant: 'Amazon Web Services',
    description: 'AWS Cloud Compute & S3 Hosting',
    amount: 4210,
    category: 'Cloud Infrastructure',
    reference_id: 'AWS-99340',
    created_at: '2026-09-02T02:00:00Z',
  },
  {
    id: 'tx-aws-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-02',
    merchant: 'Amazon Web Services',
    description: 'AWS Cloud Compute (Uncapped GPU Instance Spike)',
    amount: 24850,
    category: 'Cloud Infrastructure',
    reference_id: 'AWS-99450',
    created_at: '2026-10-02T02:00:00Z',
  },

  // 6. LEGITIMATE ORDINARY TRANSACTIONS (Should NOT trigger false alerts)
  // Multiple coffees on different days with different amounts
  {
    id: 'tx-coffee-01',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-05',
    merchant: 'Blue Tokai Coffee Roasters',
    description: 'Client strategy kickoff coffee',
    amount: 720,
    category: 'Food & Dining',
    reference_id: 'POS-BT-112',
    created_at: '2026-10-05T14:30:00Z',
  },
  {
    id: 'tx-coffee-02',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-19',
    merchant: 'Blue Tokai Coffee Roasters',
    description: 'Team project retrospective beverages',
    amount: 1150,
    category: 'Food & Dining',
    reference_id: 'POS-BT-390',
    created_at: '2026-10-19T17:15:00Z',
  },

  // Office Space Coworking (Monthly)
  {
    id: 'tx-wework-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-01',
    merchant: 'WeWork India',
    description: 'Dedicated 6-Desk Private Office Suite',
    amount: 45000,
    category: 'Facilities & Rent',
    reference_id: 'WW-INV-7102',
    created_at: '2026-07-01T09:00:00Z',
  },
  {
    id: 'tx-wework-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-01',
    merchant: 'WeWork India',
    description: 'Dedicated 6-Desk Private Office Suite',
    amount: 45000,
    category: 'Facilities & Rent',
    reference_id: 'WW-INV-8199',
    created_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'tx-wework-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-01',
    merchant: 'WeWork India',
    description: 'Dedicated 6-Desk Private Office Suite',
    amount: 45000,
    category: 'Facilities & Rent',
    reference_id: 'WW-INV-9201',
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'tx-wework-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-01',
    merchant: 'WeWork India',
    description: 'Dedicated 6-Desk Private Office Suite',
    amount: 45000,
    category: 'Facilities & Rent',
    reference_id: 'WW-INV-1034',
    created_at: '2026-10-01T09:00:00Z',
  },

  // Internet Fiber Broadband
  {
    id: 'tx-airtel-jul',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-07-10',
    merchant: 'Airtel Broadband',
    description: '1Gbps Static IP Business Fiber Line',
    amount: 2999,
    category: 'Utilities & Telecom',
    reference_id: 'ATL-7019',
    created_at: '2026-07-10T12:00:00Z',
  },
  {
    id: 'tx-airtel-aug',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-08-10',
    merchant: 'Airtel Broadband',
    description: '1Gbps Static IP Business Fiber Line',
    amount: 2999,
    category: 'Utilities & Telecom',
    reference_id: 'ATL-8102',
    created_at: '2026-08-10T12:00:00Z',
  },
  {
    id: 'tx-airtel-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-10',
    merchant: 'Airtel Broadband',
    description: '1Gbps Static IP Business Fiber Line',
    amount: 2999,
    category: 'Utilities & Telecom',
    reference_id: 'ATL-9204',
    created_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 'tx-airtel-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-10',
    merchant: 'Airtel Broadband',
    description: '1Gbps Static IP Business Fiber Line',
    amount: 2999,
    category: 'Utilities & Telecom',
    reference_id: 'ATL-1033',
    created_at: '2026-10-10T12:00:00Z',
  },

  // Travel / Uber receipts (varied, legitimate, no duplicates)
  {
    id: 'tx-uber-01',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-08',
    merchant: 'Uber India',
    description: 'Airport ride for client pitch meeting',
    amount: 840,
    category: 'Travel & Commute',
    reference_id: 'UBR-4412-A',
    created_at: '2026-10-08T06:40:00Z',
  },
  {
    id: 'tx-uber-02',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-11',
    merchant: 'Uber India',
    description: 'Return ride from partner agency studio',
    amount: 420,
    category: 'Travel & Commute',
    reference_id: 'UBR-4419-B',
    created_at: '2026-10-11T20:10:00Z',
  },

  // Office Supplies & Equipment
  {
    id: 'tx-amazon-01',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-14',
    merchant: 'Amazon Business',
    description: 'Ergonomic keyboard and USB-C hub adapters',
    amount: 4890,
    category: 'Office & Equipment',
    reference_id: 'AMZ-5501-1',
    created_at: '2026-10-14T11:45:00Z',
  },
  {
    id: 'tx-github-oct',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-oct',
    transaction_date: '2026-10-22',
    merchant: 'GitHub Inc',
    description: 'GitHub Team Organization Subscription',
    amount: 1750,
    category: 'Software & Subscriptions',
    reference_id: 'GH-88210',
    created_at: '2026-10-22T04:00:00Z',
  },
  {
    id: 'tx-github-sep',
    workspace_id: DEMO_WORKSPACE.id,
    import_batch_id: 'batch-demo-prior',
    transaction_date: '2026-09-22',
    merchant: 'GitHub Inc',
    description: 'GitHub Team Organization Subscription',
    amount: 1750,
    category: 'Software & Subscriptions',
    reference_id: 'GH-77190',
    created_at: '2026-09-22T04:00:00Z',
  },
];

export const DEMO_SAMPLE_CSV = `Date,Merchant,Description,Amount,Category,Reference ID
2026-10-12,Adobe Systems Inc,Adobe All Apps Creative Cloud Subscription,5400,Software & Subscriptions,ADB-99281-A
2026-10-13,Adobe Systems Inc,Adobe Creative Cloud All Apps Auto-Debit,5400,Software & Subscriptions,ADB-99281-B
2026-07-04,Google Workspace,Google Workspace Business Standard,1500,Software & Subscriptions,GSUITE-2607
2026-08-04,Google Workspace,Google Workspace Business Standard,1500,Software & Subscriptions,GSUITE-2608
2026-09-04,Google Workspace,Google Workspace Business Standard,1500,Software & Subscriptions,GSUITE-2609
2026-10-04,Google Workspace,Google Workspace Business Standard,1500,Software & Subscriptions,GSUITE-2610
2026-07-15,Slack Technologies,Slack Pro Plan - 4 seats,3200,Software & Subscriptions,SLK-7712
2026-08-15,Slack Technologies,Slack Pro Plan - 4 seats,3200,Software & Subscriptions,SLK-8819
2026-09-15,Slack Technologies,Slack Pro Plan - 4 seats,3200,Software & Subscriptions,SLK-9901
2026-10-15,Slack Technologies,Slack Pro Plan - 4 seats,3200,Software & Subscriptions,SLK-1023
2026-07-18,Figma Inc,Figma Design Team Seat,1200,Design Tools,FIG-3041
2026-08-18,Figma Inc,Figma Design Team Seat,1200,Design Tools,FIG-4192
2026-09-18,Figma Inc,Figma Design Team Seat (Tier Adjustment),1800,Design Tools,FIG-5290
2026-10-18,Figma Inc,Figma Design Team Seat,1800,Design Tools,FIG-6310
2026-07-02,Amazon Web Services,AWS Cloud Compute & S3 Hosting,4180,Cloud Infrastructure,AWS-99120
2026-08-02,Amazon Web Services,AWS Cloud Compute & S3 Hosting,4250,Cloud Infrastructure,AWS-99230
2026-09-02,Amazon Web Services,AWS Cloud Compute & S3 Hosting,4210,Cloud Infrastructure,AWS-99340
2026-10-02,Amazon Web Services,AWS Cloud Compute (Uncapped GPU Instance Spike),24850,Cloud Infrastructure,AWS-99450
2026-10-05,Blue Tokai Coffee Roasters,Client strategy kickoff coffee,720,Food & Dining,POS-BT-112
2026-10-19,Blue Tokai Coffee Roasters,Team project retrospective beverages,1150,Food & Dining,POS-BT-390
2026-07-01,WeWork India,Dedicated 6-Desk Private Office Suite,45000,Facilities & Rent,WW-INV-7102
2026-08-01,WeWork India,Dedicated 6-Desk Private Office Suite,45000,Facilities & Rent,WW-INV-8199
2026-09-01,WeWork India,Dedicated 6-Desk Private Office Suite,45000,Facilities & Rent,WW-INV-9201
2026-10-01,WeWork India,Dedicated 6-Desk Private Office Suite,45000,Facilities & Rent,WW-INV-1034
2026-07-10,Airtel Broadband,1Gbps Static IP Business Fiber Line,2999,Utilities & Telecom,ATL-7019
2026-08-10,Airtel Broadband,1Gbps Static IP Business Fiber Line,2999,Utilities & Telecom,ATL-8102
2026-09-10,Airtel Broadband,1Gbps Static IP Business Fiber Line,2999,Utilities & Telecom,ATL-9204
2026-10-10,Airtel Broadband,1Gbps Static IP Business Fiber Line,2999,Utilities & Telecom,ATL-1033
2026-10-08,Uber India,Airport ride for client pitch meeting,840,Travel & Commute,UBR-4412-A
2026-10-11,Uber India,Return ride from partner agency studio,420,Travel & Commute,UBR-4419-B
2026-10-14,Amazon Business,Ergonomic keyboard and USB-C hub adapters,4890,Office & Equipment,AMZ-5501-1
2026-09-22,GitHub Inc,GitHub Team Organization Subscription,1750,Software & Subscriptions,GH-77190
2026-10-22,GitHub Inc,GitHub Team Organization Subscription,1750,Software & Subscriptions,GH-88210
`;
