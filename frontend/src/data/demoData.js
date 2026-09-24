export const demoData = {
  store: {
    id: 'store-ai-sales-demo',
    name: 'Juniper & Co.',
    platform: 'Synthetic commerce feed',
    currency: 'USD',
    as_of: '2026-09-22',
  },
  metrics: [
    { id: 'revenue', label: 'Net revenue', value: 184620, change_pct: 12.4, format: 'currency' },
    { id: 'orders', label: 'Orders', value: 2418, change_pct: 8.7, format: 'integer' },
    { id: 'aov', label: 'Average order value', value: 76.35, change_pct: 3.4, format: 'currency' },
    { id: 'conversion', label: 'Conversion rate', value: 3.82, change_pct: -0.31, format: 'percentage' },
  ],
  daily_sales: [10820, 11640, 12240, 13780, 14420, 12910, 13840, 15370, 16220, 14980, 15610, 16470, 15980, 10340].map((revenue, index) => ({
    date: `2026-09-${String(index + 9).padStart(2, '0')}`,
    revenue,
  })),
  products: [
    { name: 'CloudSoft Throw', revenue: 42860, units: 612, growth_pct: 18.2 },
    { name: 'Cedar Desk Lamp', revenue: 35440, units: 386, growth_pct: 11.6 },
    { name: 'Harbor Linen Set', revenue: 31780, units: 298, growth_pct: 7.8 },
    { name: 'Solstice Travel Mug', revenue: 21610, units: 540, growth_pct: -9.4 },
    { name: 'Moss Cable Organizer', revenue: 8930, units: 421, growth_pct: -17.8 },
  ],
  regions: [
    { name: 'West', revenue: 58280, share_pct: 31.6 },
    { name: 'Northeast', revenue: 47340, share_pct: 25.6 },
    { name: 'South', revenue: 44610, share_pct: 24.2 },
    { name: 'Midwest', revenue: 34390, share_pct: 18.6 },
  ],
  alerts: [
    { id: 'conversion-softness', severity: 'high', title: 'Conversion softened despite stronger traffic', detail: 'Conversion is down 0.31 percentage points while sessions are up 15.2%.' },
    { id: 'moss-decline', severity: 'medium', title: 'Moss Cable Organizer is declining', detail: 'Revenue growth is -17.8% with 421 units sold in the selected period.' },
    { id: 'west-growth', severity: 'positive', title: 'West is the largest revenue contributor', detail: 'The region contributes $58,280, or 31.6% of net revenue.' },
  ],
}

export const defaultAnswer = {
  answer: 'Net revenue is $184,620, up 12.4%, with 2,418 orders. The main risk is that conversion fell to 3.82% even as traffic increased. Protect the revenue trend by diagnosing traffic quality and checkout friction before scaling acquisition spend.',
  confidence: 'high',
  evidence: [
    { id: 'revenue', label: 'Synthetic order ledger', period: '2026-09-09 to 2026-09-22' },
    { id: 'conversion', label: 'Synthetic storefront funnel', period: '2026-09-09 to 2026-09-22' },
  ],
  actions: ['Review funnel conversion by channel and device.', 'Investigate the two declining products.', 'Use the West region for the next controlled growth test.'],
}
