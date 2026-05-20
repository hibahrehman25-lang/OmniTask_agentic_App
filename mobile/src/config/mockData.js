const MOCK_SALES_DECLINE = {
  run_id: "A7F3",
  duration: 8.2,
  insights: [
    {
      type: "SALES CRISIS",
      severity: "HIGH",
      confidence: 94,
      title: "Lahore Region Retail Sales Drop",
      description: "Q4 orders plummeted 30% YoY due to active local competitive pricing strategy and drop in CSAT from 4.2 to 2.8.",
      evidence: "Competitor opened 3 stores within same 2km radius; user complaints spiked 45%.",
      domain_tags: ["Sales", "Lahore", "Retail"]
    }
  ],
  revenue_risk: "Rs 2,500,000",
  severity: "4/5",
  stakeholders: ["Lahore Retail Outlets", "Regional Managers"],
  timeline_warning: { urgency: "URGENT", text: "Action required within 48 hours to prevent competitor customer acquisition lock-in." },
  if_unaddressed: "Customer attrition will increase by 60% over the next quarter, translating to permanent brand share loss in Punjab territory.",
  recommended_actions: [
    { rank: 1, title: "Launch Loyalty Rewards & Immediate Promo Scheme", owner: "Marketing Lead", timeline: "24 Hours", tools: ["CRM", "Promo Engine"], expected_outcome: "Recover 75% of customer orders and pull CSAT up to 3.8", confidence: 92 }
  ],
  simulation: {
    state_change: { before: [{ label: "Orders Drop", value: "-30%", trend: "down", color: "#FB7185" }, { label: "Revenue Leak", value: "Rs 2.5M", trend: "up", color: "#FB7185" }], after: [{ label: "Orders Drop", value: "-5%", trend: "up", color: "#34D399" }, { label: "Revenue Leak", value: "Rs 0.4M", trend: "down", color: "#34D399" }] },
    chart_data: [{ label: "Orders", before: 70, after: 95 }, { label: "CSAT", before: 56, after: 76 }, { label: "Revenue", before: 20, after: 88 }],
    api_call: "POST /api/v1/promotions/activate\n{\n  \"region\": \"lahore\",\n  \"campaign\": \"loyalty\"\n}",
    notification: { channel: "SMS", subject: "Loyalty Bonus Activated!", body: "Enjoy Rs 500 off your next 3 orders." },
    timeline: [{ time: "09:00", text: "Simulation scenario initialized for Lahore crisis." }, { time: "09:02", text: "Promotional system triggers mock campaign API." }],
    projected_outcome: "The system successfully demonstrates automated crisis mitigation, recovering Rs 2.1M of the Rs 2.5M at-risk revenue by re-engaging localized retail consumers."
  },
  trace: [
    { agent: "Content Parser", status: "Success", decision: "Extracted Rs 2.5M risk & 30% decline", confidence: "98%", steps: ["Normalized text body and extracted key numerics."] },
    { agent: "Action Simulator", status: "Success", decision: "Simulated CRM promotion bounce back", confidence: "89%", steps: ["Constructed Before/After operational matrices."] }
  ]
};

const MOCK_FUEL_PRICE = {
  run_id: "F2E1",
  duration: 6.5,
  insights: [
    { type: "COST RISK", severity: "HIGH", confidence: 96, title: "15% Fuel Price Hike Impact", description: "Immediate 15% increase in fuel costs will directly impact Punjab delivery operations, increasing last-mile costs by 18-22%.", evidence: "Government announced 15% fuel price increase effective immediately.", domain_tags: ["Logistics", "Operations"] }
  ],
  revenue_risk: "Rs 1,200,000",
  severity: "4/5",
  stakeholders: ["Logistics Partners", "Fleet Managers"],
  timeline_warning: { urgency: "IMMEDIATE", text: "Adjust routing logic and delivery pricing before morning dispatch." },
  if_unaddressed: "Profit margins on standard deliveries will become negative within 48 hours.",
  recommended_actions: [
    { rank: 1, title: "Optimize Routing via ML Sub-routine & Introduce Fuel Surcharge", owner: "Fleet Manager", timeline: "12 Hours", tools: ["Route Optimizer", "Pricing Engine"], expected_outcome: "Absorb 12% of the cost impact through efficiency.", confidence: 88 }
  ],
  simulation: {
    state_change: { before: [{ label: "Margin", value: "12%", trend: "down", color: "#FB7185" }, { label: "Cost/Mile", value: "+22%", trend: "up", color: "#FB7185" }], after: [{ label: "Margin", value: "9%", trend: "down", color: "#34D399" }, { label: "Cost/Mile", value: "+6%", trend: "up", color: "#34D399" }] },
    chart_data: [{ label: "Margin", before: 80, after: 60 }, { label: "Cost", before: 20, after: 90 }, { label: "Delay", before: 30, after: 35 }],
    api_call: "POST /api/v1/logistics/reroute\n{\n  \"factor\": \"fuel_eco\",\n  \"surcharge\": 0.05\n}",
    notification: { channel: "Fleet App", subject: "New Route Assignments", body: "Please refresh routes for eco-optimized paths." },
    timeline: [{ time: "08:15", text: "Fuel price anomaly detected." }, { time: "08:16", text: "Eco-routing enabled in logistics simulator." }],
    projected_outcome: "Implementing eco-routing and a minor 5% surcharge prevents negative margins."
  },
  trace: [
    { agent: "Impact Analyzer", status: "Success", decision: "Quantified Punjab supply logistics impact", confidence: "91%", steps: ["Calculated downstream operational cost multiplier."] }
  ]
};

const MOCK_TARIFF_UPDATE = {
  run_id: "T9B4",
  duration: 9.1,
  insights: [
    { type: "POLICY UPDATE", severity: "MEDIUM", confidence: 92, title: "25% Import Tariff on Electronics", description: "New tariffs will squeeze margins on smartphones/laptops. Current inventory is facing a 340% panic buying surge.", evidence: "Retailers report pre-announcement panic buying surge of 340%.", domain_tags: ["Inventory", "Pricing"] }
  ],
  revenue_risk: "Rs 4,000,000",
  severity: "3/5",
  stakeholders: ["Procurement", "Sales Heads"],
  timeline_warning: { urgency: "MODERATE", text: "Adjust inventory pricing dynamically as stock depletes." },
  if_unaddressed: "Stock will sell out at old prices, missing opportunity to buffer the future 25% cost increase.",
  recommended_actions: [
    { rank: 1, title: "Activate Dynamic Inventory Pricing", owner: "Revenue Manager", timeline: "Immediate", tools: ["ERP", "Pricing Engine"], expected_outcome: "Capture 15% margin increase during panic buying phase.", confidence: 95 }
  ],
  simulation: {
    state_change: { before: [{ label: "Stock Level", value: "-60%", trend: "down", color: "#FB7185" }, { label: "Margin", value: "Standard", trend: "down", color: "#FB7185" }], after: [{ label: "Stock Level", value: "-30%", trend: "down", color: "#34D399" }, { label: "Margin", value: "+15%", trend: "up", color: "#34D399" }] },
    chart_data: [{ label: "Stock", before: 90, after: 40 }, { label: "Price", before: 50, after: 75 }, { label: "Revenue", before: 40, after: 85 }],
    api_call: "PUT /api/v1/inventory/pricing\n{\n  \"category\": \"electronics\",\n  \"multiplier\": 1.15\n}",
    notification: { channel: "Dashboard", subject: "Pricing Override Active", body: "Electronics pricing up 15% due to high velocity." },
    timeline: [{ time: "14:00", text: "Surge detected." }, { time: "14:05", text: "Pricing API invoked." }],
    projected_outcome: "Capitalized on the panic buying surge to build a financial buffer for future stock acquisition at the new tariff rate."
  },
  trace: [
    { agent: "Insight Extractor", status: "Success", decision: "Correlated tariff announcement to panic buying", confidence: "94%", steps: ["Mapped regulatory news to real-time checkout velocity."] }
  ]
};

const MOCK_MARKET_REPORT = {
  run_id: "M3X8",
  duration: 7.8,
  insights: [
    { type: "MARKET TREND", severity: "MEDIUM", confidence: 89, title: "E-Commerce YoY Growth & CAC Increase", description: "While sector grew 67%, CAC increased by 34% due to competitor loyalty programs.", evidence: "Top 3 competitors launched loyalty programs. CAC up 34%.", domain_tags: ["Marketing", "Strategy"] }
  ],
  revenue_risk: "Rs 800,000",
  severity: "2/5",
  stakeholders: ["CMO", "Growth Team"],
  timeline_warning: { urgency: "LOW", text: "Strategic planning required for next quarter marketing budget." },
  if_unaddressed: "Customer acquisition will become unsustainable, leading to market share stagnation despite industry growth.",
  recommended_actions: [
    { rank: 1, title: "Shift Budget to Retention & Referral Programs", owner: "CMO", timeline: "1 Week", tools: ["Ad Platforms", "Referral System"], expected_outcome: "Reduce effective CAC by 20% through viral loops.", confidence: 82 }
  ],
  simulation: {
    state_change: { before: [{ label: "CAC", value: "+34%", trend: "up", color: "#FB7185" }, { label: "LTV/CAC", value: "1.2", trend: "down", color: "#FB7185" }], after: [{ label: "CAC", value: "+14%", trend: "up", color: "#34D399" }, { label: "LTV/CAC", value: "2.5", trend: "up", color: "#34D399" }] },
    chart_data: [{ label: "CAC", before: 80, after: 45 }, { label: "Retention", before: 30, after: 60 }, { label: "LTV", before: 50, after: 85 }],
    api_call: "POST /api/v1/campaigns/referral\n{\n  \"incentive\": \"double_points\"\n}",
    notification: { channel: "Email", subject: "New Referral Campaign Setup", body: "Draft campaign requires approval." },
    timeline: [{ time: "10:00", text: "Market report ingested." }, { time: "10:04", text: "Budget reallocation simulation run." }],
    projected_outcome: "Pivoting to retention mechanics shields the brand from the rising industry CAC, improving unit economics."
  },
  trace: [
    { agent: "Action Generator", status: "Success", decision: "Prioritized Referral Engine over Paid Ads", confidence: "95%", steps: ["Evaluated diminishing returns on current ad spend.", "Modeled LTV impact of referral loops."] }
  ]
};

export function getMockDataForSample(index) {
  switch (index) {
    case 0: return MOCK_SALES_DECLINE;
    case 1: return MOCK_FUEL_PRICE;
    case 2: return MOCK_TARIFF_UPDATE;
    case 3: return MOCK_MARKET_REPORT;
    default: return MOCK_SALES_DECLINE;
  }
}
