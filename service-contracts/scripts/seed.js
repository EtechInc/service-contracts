// =============================================================================
// SEED SCRIPT — Reads from SWAT CLAUDE.xlsx Sheet2, seeds Supabase contracts
// =============================================================================
// RUN WITH:  node scripts/seed.js
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';

const SUPABASE_URL = 'https://nqzlgmjomuvhpovpodwk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xemxnbWpvbXV2aHBvdnBvZHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUxODcxMCwiZXhwIjoyMDkwMDk0NzEwfQ.hsVw4xbVc10viYZ6G9JhhbEHuypN-Yw590_IU4Unosk';

const EXCEL_PATH = 'C:/Users/mark.kimble/OneDrive - kannegiesser.de/Desktop/SWAT CLAUDE.xlsx';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Read Excel Sheet2 and map rows to DB format
// ---------------------------------------------------------------------------
function readExcel() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets['Sheet2'];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // Row 0 = headers, Row 1 = "KE Paid Contracts" section header, data starts at Row 2
  // Headers: customer, contract_type, corporate_group, divison, customer_no, team,
  //          travel_costs, monthly_revenue, contracted_hours, hours_2024, hours_2025,
  //          hours_2026, hours_2027, hours_2028, extension_date, hourly_rate, contract_no, notes

  const contracts = [];
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[0] || typeof r[0] !== 'string' || r[0].trim() === '') continue;

    const customer = (r[0] || '').trim();
    const contractType = (r[1] || '').toString().trim();
    const corporateGroup = (r[2] || 'None').toString().trim() || 'None';
    const customerNo = (r[4] != null ? r[4].toString() : '').trim();
    const team = (r[5] || '').toString().trim();
    const travelCosts = (r[6] || 'Billable').toString().trim();
    const monthlyRevenue = parseFloat(r[7]) || 0;
    const contractedHours = parseFloat(r[8]) || 0;
    const hours2024 = parseFloat(r[9]) || 0;
    const hours2025 = parseFloat(r[10]) || 0;
    const hours2026 = parseFloat(r[11]) || 0;
    const hours2027 = parseFloat(r[12]) || 0;
    const hours2028 = parseFloat(r[13]) || 0;
    const extensionDate = (r[14] || '').toString().trim();
    const hourlyRate = parseFloat(r[15]) || 175;
    const contractNo = (r[16] != null ? r[16].toString() : '').trim();
    const notes = (r[17] || '').toString().trim();

    // Compute contract_amount from hourly_rate * contracted_hours
    const contractAmount = Math.round(hourlyRate * contractedHours * 100) / 100;

    contracts.push({
      division: 'KNA',
      customer,
      customer_no: customerNo,
      contract_no: contractNo,
      billing_no: '',
      shipping_no: '',
      team,
      travel_costs: travelCosts,
      corporate_group: corporateGroup,
      monthly_revenue: Math.round(monthlyRevenue * 100) / 100,
      contracted_hours: contractedHours,
      hourly_rate: hourlyRate,
      contract_amount: contractAmount,
      hours_2024: hours2024,
      hours_2025: hours2025,
      hours_2026: hours2026,
      hours_2027: hours2027,
      hours_2028: hours2028,
      extension_date: extensionDate,
      term_start_date: '',
      suggested_visits: 4,
      parts_discount: '',
      labor_discount: '',
      premium_billing: '',
      salesman: '',
      auto_renew: false,
      notes,
      status: 'active',
      tracking_type: 'hours',
      ipp_tasks: [],
      renewal_history: [],
    });
  }

  return contracts;
}

// ---------------------------------------------------------------------------
// KCAN Contracts (manually defined — not in the Excel)
// ---------------------------------------------------------------------------
const KCAN_CONTRACTS = [
  { division: 'KCAN', customer: "CH St-Joseph-de-la-Providence", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3", travel_costs: "All inclusive", corporate_group: "None", monthly_revenue: 1872.16, contracted_hours: 260, hourly_rate: 175, contract_amount: 45500.0, hours_2024: 0, hours_2025: 220, hours_2026: 220, hours_2027: 0, hours_2028: 0, extension_date: "12/31/2023", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
  { division: 'KCAN', customer: "CHU Ste-Justine", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3", travel_costs: "All inclusive", corporate_group: "None", monthly_revenue: 4353.02, contracted_hours: 260, hourly_rate: 175, contract_amount: 45500.0, hours_2024: 0, hours_2025: 0, hours_2026: 0, hours_2027: 0, hours_2028: 0, extension_date: "2/28/2025", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
  { division: 'KCAN', customer: "HLS Ottawa", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3", travel_costs: "All inclusive", corporate_group: "None", monthly_revenue: 0, contracted_hours: 540, hourly_rate: 175, contract_amount: 94500.0, hours_2024: 0, hours_2025: 250, hours_2026: 250, hours_2027: 0, hours_2028: 0, extension_date: "", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
  { division: 'KCAN', customer: "HLS Toronto", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3", travel_costs: "All inclusive", corporate_group: "None", monthly_revenue: 0, contracted_hours: 504, hourly_rate: 175, contract_amount: 88200.0, hours_2024: 0, hours_2025: 200, hours_2026: 200, hours_2027: 0, hours_2028: 0, extension_date: "", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
  { division: 'KCAN', customer: "BCM", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3, Log", travel_costs: "Billable", corporate_group: "None", monthly_revenue: 0, contracted_hours: 292.75, hourly_rate: 175, contract_amount: 51231.25, hours_2024: 0, hours_2025: 0, hours_2026: 292.75, hours_2027: 0, hours_2028: 0, extension_date: "", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
  { division: 'KCAN', customer: "CISSS De Lanaudiere", customer_no: "", contract_no: "", billing_no: "", shipping_no: "", team: "W1, W3, Log", travel_costs: "Billable", corporate_group: "None", monthly_revenue: 0, contracted_hours: 0, hourly_rate: 175, contract_amount: 0.0, hours_2024: 0, hours_2025: 80, hours_2026: 80, hours_2027: 0, hours_2028: 0, extension_date: "", term_start_date: "", suggested_visits: 4, parts_discount: "", labor_discount: "", premium_billing: "", salesman: "", auto_renew: false, notes: "", status: "active", tracking_type: "hours", ipp_tasks: [], renewal_history: [] },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seed() {
  console.log('Reading Excel file...');
  const knaContracts = readExcel();
  console.log(`  Found ${knaContracts.length} KNA contracts in Sheet2\n`);

  // ── Delete existing contracts ──────────────────────────────────────────────
  console.log('Deleting existing contracts...');
  const { error: deleteError } = await supabase
    .from('contracts')
    .delete()
    .neq('customer', '');

  if (deleteError) {
    console.error('Delete failed:', deleteError.message);
    process.exit(1);
  }
  console.log('Existing contracts deleted.\n');

  // ── Insert KNA contracts ───────────────────────────────────────────────────
  console.log(`Inserting ${knaContracts.length} KNA contracts...`);
  const { data: knaData, error: knaError } = await supabase
    .from('contracts')
    .insert(knaContracts)
    .select('id, customer');

  if (knaError) {
    console.error('KNA insert failed:', knaError.message);
    process.exit(1);
  }
  console.log(`  Inserted ${knaData.length} KNA contracts.`);

  // ── Insert KCAN contracts ──────────────────────────────────────────────────
  console.log(`\nInserting ${KCAN_CONTRACTS.length} KCAN contracts...`);
  const { data: kcanData, error: kcanError } = await supabase
    .from('contracts')
    .insert(KCAN_CONTRACTS)
    .select('id, customer');

  if (kcanError) {
    console.error('KCAN insert failed:', kcanError.message);
    process.exit(1);
  }
  console.log(`  Inserted ${kcanData.length} KCAN contracts.`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n--- Seed complete ---');
  console.log(`  KNA:  ${knaData.length} contracts`);
  console.log(`  KCAN: ${kcanData.length} contracts`);

  console.log('\nKNA contracts inserted:');
  knaData.forEach(c => console.log(`  [${c.id}] ${c.customer}`));
  console.log('\nKCAN contracts inserted:');
  kcanData.forEach(c => console.log(`  [${c.id}] ${c.customer}`));
}

seed().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
