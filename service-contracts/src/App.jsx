import { useState, useEffect, useMemo, useRef } from "react";
import { supabase, setBrokerToken } from './supabaseClient'
import { useSession, SignInButton, getSupabaseToken } from '@etechinc/sso-client'

// DB mapping helpers
function mapDbToContract(c) {
  return {
    id: c.id,
    division: c.division,
    customer: c.customer,
    customerNo: c.customer_no || '',
    customerPO: c.customer_po || '',
    contractNo: c.contract_no || '',
    billingNo: c.billing_no || '',
    shippingNo: c.shipping_no || '',
    team: c.team || '',
    travelCosts: c.travel_costs || 'Billable',
    corporateGroup: c.corporate_group || 'None',
    monthlyRevenue: c.monthly_revenue || 0,
    contractedHours: c.contracted_hours || 0,
    hourlyRate: c.hourly_rate || 175,
    contractAmount: c.contract_amount || 0,
    hours2024: c.hours_2024 || 0,
    hours2025: c.hours_2025 || 0,
    hours2026: c.hours_2026 || 0,
    hours2027: c.hours_2027 || 0,
    hours2028: c.hours_2028 || 0,
    extensionDate: c.extension_date || '',
    termStartDate: c.term_start_date || '',
    suggestedVisits: parseInt(c.suggested_visits) || 4,
    partsDiscount: c.parts_discount || '',
    laborDiscount: c.labor_discount || '',
    premiumBilling: c.premium_billing || '',
    salesman: c.salesman || '',
    autoRenew: c.auto_renew || false,
    notes: c.notes || '',
    status: c.status || 'active',
    trackingType: c.tracking_type || 'hours',
    ippTasks: c.ipp_tasks || [],
    renewalHistory: c.renewal_history || [],
  }
}

function mapContractToDb(c) {
  return {
    customer: c.customer,
    customer_no: c.customerNo || '',
    customer_po: c.customerPO || '',
    contract_no: c.contractNo || '',
    billing_no: c.billingNo || '',
    shipping_no: c.shippingNo || '',
    team: c.team || '',
    travel_costs: c.travelCosts || 'Billable',
    corporate_group: c.corporateGroup || 'None',
    monthly_revenue: c.monthlyRevenue || 0,
    contracted_hours: c.contractedHours || 0,
    hourly_rate: c.hourlyRate || 175,
    contract_amount: c.contractAmount || 0,
    hours_2024: c.hours2024 || 0,
    hours_2025: c.hours2025 || 0,
    hours_2026: c.hours2026 || 0,
    hours_2027: c.hours2027 || 0,
    hours_2028: c.hours2028 || 0,
    extension_date: c.extensionDate || '',
    term_start_date: c.termStartDate || '',
    suggested_visits: parseInt(c.suggestedVisits) || 4,
    parts_discount: c.partsDiscount || '',
    labor_discount: c.laborDiscount || '',
    premium_billing: c.premiumBilling || '',
    salesman: c.salesman || '',
    auto_renew: c.autoRenew || false,
    notes: c.notes || '',
    status: c.status || 'active',
    tracking_type: c.trackingType || 'hours',
    ipp_tasks: c.ippTasks || [],
    renewal_history: c.renewalHistory || [],
  }
}

function mapDbToVisit(v) {
  return {
    id: v.id,
    contractId: v.contract_id,
    visitNo: v.visit_no,
    date: v.date,
    actualHours: v.actual_hours || 0,
    eqHours: v.eq_hours || {},
    techs: v.techs || '',
    comments: v.comments || '',
    tasks: v.tasks || [],
    billedAmount: v.billed_amount || 0,
    laborCost: v.labor_cost || 0,
    travelCost: v.travel_cost || 0,
    partsCost: v.parts_cost || 0,
  }
}

function mapVisitToDb(v, contractId) {
  return {
    contract_id: contractId,
    visit_no: v.visitNo,
    date: v.date,
    actual_hours: v.actualHours || 0,
    eq_hours: v.eqHours || {},
    techs: v.techs || '',
    comments: v.comments || '',
    tasks: v.tasks || [],
    billed_amount: v.billedAmount || 0,
    labor_cost: v.laborCost || 0,
    travel_cost: v.travelCost || 0,
    parts_cost: v.partsCost || 0,
  }
}

// localStorage helpers (fallback)
async function localGet(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? { value: val } : null;
  } catch(e) { return null; }
}
async function localSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch(e) { return null; }
}


const INITIAL_CONTRACTS = [
  { id: 1, customer: "Alsco; Honolulu, HI", customerNo: "26942", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26" },
  { id: 2, customer: "Arrow Linen Supply - Garden City, NY", customerNo: "33932", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 2916.67, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 40, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 3, customer: "Blue Water Linen (Heritage Hotels)", customerNo: "35027", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 2100.00, contractedHours: 144, contractAmount: 25200.0, hours2024: 0, hours2025: 0, hours2026: 144, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 4, customer: "The Boca Raton - Burner Maintenance", customerNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 583.33, contractedHours: 40, contractAmount: 7000.0, hours2024: 0, hours2025: 0, hours2026: 40, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 5, customer: "The Boca Raton - Press Pan Reseal", customerNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 729.17, contractedHours: 50, contractAmount: 8750.0, hours2024: 0, hours2025: 0, hours2026: 50, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 6, customer: "The Boca Raton", customerNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 29, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 7, customer: "Brady Linen; West Mayflower", customerNo: "32834", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 2333.33, contractedHours: 160, contractAmount: 28000.0, hours2024: 0, hours2025: 96.5, hours2026: 130, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 8, customer: "Breakers, The; Palm Beach", customerNo: "33752", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 9, customer: "Breck Commercial Laundry, Silverthorne, CO", customerNo: "34330", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 485.21, contractedHours: 64, contractAmount: 11200.0, hours2024: 0, hours2025: 9.25, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 10, customer: "Century Linen, Gloversville, NY", customerNo: "38983", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Century Linen", monthlyRevenue: 1275.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 70.75, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26" },
  { id: 11, customer: "Century Linen - Somerville/Worcester", customerNo: "40128/40127", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Century Linen", monthlyRevenue: 2625.00, contractedHours: 180, contractAmount: 31500.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "8/1/25-7/31/26" },
  { id: 12, customer: "Chickasaw", customerNo: "33680", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1133.33, contractedHours: 96, contractAmount: 16800.0, hours2024: 0, hours2025: 0, hours2026: 96, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 13, customer: "Cintas; Eau Claire, WI", customerNo: "41227", team: "Log", travelCosts: "Billable", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26" },
  { id: 14, customer: "Cintas; Liverpool", customerNo: "39178", team: "Log", travelCosts: "Billable", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 87.5, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 15, customer: "Cintas; Philadelphia", customerNo: "39171", team: "Log", travelCosts: "All inclusive", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 160, contractAmount: 28000.0, hours2024: 0, hours2025: 62, hours2026: 80, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 16, customer: "Cleveland Clinic", customerNo: "38704", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 5250.00, contractedHours: 360, contractAmount: 63000.0, hours2024: 0, hours2025: 0, hours2026: 91.5, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 17, customer: "Continental Linen Service; Kalamazoo", customerNo: "32682", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 18, customer: "Denman Linen, Quincy, IL", customerNo: "35407", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 71.5, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 19, customer: "Disney Cruise Lines", customerNo: "41320", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 240, contractAmount: 42000.0, hours2024: 0, hours2025: 58.5, hours2026: 240, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-12/31/26" },
  { id: 20, customer: "Economy Linen; Dayton, OH", customerNo: "39809", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Economy Linen", monthlyRevenue: 0, contractedHours: 340, contractAmount: 59500.0, hours2024: 0, hours2025: 0, hours2026: 223.25, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 21, customer: "Economy Linen; Zanesville, OH", customerNo: "32831", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Economy Linen", monthlyRevenue: 583.33, contractedHours: 40, contractAmount: 7000.0, hours2024: 0, hours2025: 0, hours2026: 59, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 22, customer: "Emerald Textiles - Livingston, CA", customerNo: "39007", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 33.75, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26" },
  { id: 23, customer: "Fairmont Scottsdale Princess, Scottsdale, AZ", customerNo: "35489", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1400.00, contractedHours: 96, contractAmount: 16800.0, hours2024: 0, hours2025: 61.75, hours2026: 96, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 24, customer: "Fresh Start Laundry - Goodwill Colorado Springs", customerNo: "32853", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 17, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26" },
  { id: 25, customer: "General Linen; Somersworth, NH", customerNo: "34011", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 18.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 26, customer: "Grindstone Laundry; Hinckley, MN", customerNo: "34548", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 30, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26" },
  { id: 27, customer: "Halifax Linen; Roanoke Rapids, NC", customerNo: "26725", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 10, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 28, customer: "HCSC Laundry, Allentown, PA", customerNo: "33812", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1275.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 19.75, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 29, customer: "Image First; Clifton, NJ", customerNo: "40118", team: "Log", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 875.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 30, customer: "Image First - Denver, CO", customerNo: "39557", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 39.25, hours2025: 120, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 31, customer: "ImageFirst Kansas City (Faultless)", customerNo: "30091", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 1437.50, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 3.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 32, customer: "Image First Seattle - Kent, WA", customerNo: "33726", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 27.25, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 33, customer: "ImageFirst St. Louis (Faultless)", customerNo: "28258", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 248.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 34, customer: "ImageFirst; Westbrook, ME", customerNo: "40052", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 35, customer: "Logan's Healthcare Laundry", customerNo: "35449", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 36, customer: "M & F Laundry; Northridge, CA", customerNo: "39618", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 33.25, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26" },
  { id: 37, customer: "Magic Laundry; Montebello, CA", customerNo: "33725", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Magic Laundry", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 64.25, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26" },
  { id: 38, customer: "Magic Laundry; San Bernardino, CA", customerNo: "39810", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Magic Laundry", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 39, customer: "Mastel Linen - Phoenix AZ", customerNo: "33808", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 760.00, contractedHours: 64, contractAmount: 11200.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "5/1/25-4/30/26" },
  { id: 40, customer: "Mayo Clinic; Jacksonville, FL", customerNo: "40115", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 384, contractAmount: 67200.0, hours2024: 0, hours2025: 26, hours2026: 210, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26" },
  { id: 41, customer: "Metropolitan Detroit Laundry Services", customerNo: "38593", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 7.75, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 42, customer: "Michigan Premier Laundry (CHS) - Saginaw, MI", customerNo: "34369", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 113.25, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26" },
  { id: 43, customer: "Morgan Services, Inc", customerNo: "39082", team: "Log", travelCosts: "All Inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 12.25, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 44, customer: "NWHCL - Bellingham, WA", customerNo: "32779", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1134.50, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 0, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 45, customer: "New York Laundry, Orangestad, Aruba", customerNo: "32638", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1125.00, contractedHours: 100, contractAmount: 17500.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 46, customer: "Premier Linen Services; Fort Myers, FL", customerNo: "40047", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 47, customer: "Pure Star: 5 Star; Aurora, CO", customerNo: "39296", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 48, customer: "Pure Star: 5 Star; Chicago, IL", customerNo: "35415", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 49, customer: "Pure Star: 5 Star; Grapevine, TX", customerNo: "35541", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 50, customer: "Pure Star: 5 Star; National Harbor, MD", customerNo: "38833", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 28.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 51, customer: "Pure Star: ACL; Atlantic City, NJ", customerNo: "33494", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 59.5, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 52, customer: "Pure Star: ACL; Norwich, CT", customerNo: "39290", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 30, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 53, customer: "Pure Star: Baha Mar; Nassau, Bahamas", customerNo: "39295", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 70, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 54, customer: "Pure Star: Brady Linen, Arville; Las Vegas, NV", customerNo: "39859", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 57.5, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 55, customer: "Pure Star: Brady Linen, Losee; N. Las Vegas, NV", customerNo: "39291", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 60, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 56, customer: "Pure Star: Hotelier; Miami Lakes, FL", customerNo: "32287", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 30, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 57, customer: "Pure Star: Hotelier; Orlando, FL", customerNo: "34656", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 51.5, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 58, customer: "Pure Star: Maui Linen; Kahului, Maui", customerNo: "39048", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 12, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 59, customer: "Pure Star: United Linen; Honolulu, HI", customerNo: "27113", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 10, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 60, customer: "Pure Star: United Linen; Kailua Kona, HI", customerNo: "26992", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 40.5, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 61, customer: "Radiant Services; Gardena, CA", customerNo: "27177", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 25, hours2027: 0, hours2028: 0, extensionDate: "9/1/24-8/31/26" },
  { id: 62, customer: "Reino Linen - Brownstown, MI", customerNo: "35588", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 956.25, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 63, customer: "Roscoe Co. - Chicago, IL", customerNo: "35034", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 675.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 33, hours2026: 20, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 64, customer: "Sacramento Laundry Company", customerNo: "33794", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 30, hours2026: 15.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 65, customer: "Servicios Estrella Azul de Occidente", customerNo: "31450", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 66, customer: "Shared Hospital Services - Portsmouth, VA", customerNo: "28331", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 13.5, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 67, customer: "Tender Care Laundry; Chicago, IL", customerNo: "32889", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "5/1/25-4/30/26" },
  { id: 68, customer: "Texas Medical Center; Houston, TX", customerNo: "35503", team: "Log", travelCosts: "All Inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 80, contractAmount: 14000.0, hours2024: 0, hours2025: 40, hours2026: 40, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26" },
  { id: 69, customer: "UniClean Cleanroom Services; Milpitas, CA", customerNo: "33281", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26" },
  { id: 70, customer: "Vestis Services; Chicago, IL", customerNo: "38451", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 300, contractAmount: 52500.0, hours2024: 0, hours2025: 64, hours2026: 150, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 71, customer: "VLS Plants", customerNo: "Multiple", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 4000.00, contractedHours: 270, contractAmount: 47250.0, hours2024: 0, hours2025: 0, hours2026: 240, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 72, customer: "White Plains Linen - Peekskill NY", customerNo: "32158", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1146.88, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 36.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 73, customer: "Shared Hospital Services - Nashville, TN", customerNo: "35119", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 375.00, contractedHours: 30, contractAmount: 4500.0, hours2024: 0, hours2025: 5.5, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "3/1/24-2/28/25" },
  { id: 74, customer: "Northwest Healthcare - Bellingham, WA - Burner Maint", customerNo: "32779", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1008.47, contractedHours: 80, contractAmount: 12101.60, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "10/1/24-9/30/25" },
];



const YEARS = [2024, 2025, 2026, 2027, 2028];
const EQUIPMENT_TYPES = ["W1", "W2", "W3", "Log", "PP", "Dry", "Insp", "IPP", "IRN"];
const TEAMS = ["All", "W1", "W2", "W3", "Log"];
const IPP_TASK_CATEGORIES = ["Electrical", "Mechanical", "Hydraulic", "Safety", "Calibration", "Cleaning", "Lubrication", "Other"];
const IPP_EQ_TYPES = ["IPP", "INSP", "Dry", "IRN", "PP"];
const TRAVEL_OPTIONS = ["Billable", "All inclusive", "All Inclusive"];

const CORPORATE_GROUPS = [
  "None",
  "Pure Star",
  "ImageFirst",
  "Cintas",
  "Century Linen",
  "Economy Linen",
  "Magic Laundry",
  "The Boca Raton",
];

const emptyContract = {
  customer: "", customerNo: "", customerPO: "", contractNo: "", billingNo: "", shippingNo: "", team: "", travelCosts: "Billable",
  corporateGroup: "None",
  monthlyRevenue: 0, contractedHours: 0, hourlyRate: 0, contractAmount: 0,
  hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0,
  extensionDate: "",
  partsDiscount: "", laborDiscount: "", premiumBilling: "", salesman: "", autoRenew: false,
  pendingWorkOrders: [], notes: "", suggestedVisits: "", renewalHistory: [], termStartDate: "", status: "active", ippTasks: [],
};

// Format revenue: round to nearest dollar, no decimals
function fmtRev(n) {
  if (!n || n === 0) return "$0";
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Format hours: show up to 2 decimal places, strip trailing zeros
function fmtHrs(n) {
  if (n === 0 || n === undefined || n === null) return "0";
  const s = parseFloat(n.toFixed(2)).toString();
  return s;
}

// Derive monthly revenue from contractAmount / contract length in months
function getMonthlyRevenue(c) {
  if (c.monthlyRevenue > 0) return c.monthlyRevenue;
  if (!c.contractAmount || !c.extensionDate) return 0;
  const parts = c.extensionDate.split("-");
  if (parts.length < 2) return 0;
  const start = parts[0].trim();
  const end = parts.slice(1).join("-").trim();
  const sm = start.match(/^(\d+)\/(\d+)\/(\d+)$/);
  const em = end.match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!sm || !em) return 0;
  const sY = 2000 + parseInt(sm[3]), sM = parseInt(sm[1]), sD = parseInt(sm[2]);
  const eY = 2000 + parseInt(em[3]), eM = parseInt(em[1]), eD = parseInt(em[2]);
  const months = Math.max(1, (eY - sY) * 12 + (eM - sM) + (eD >= sD ? 1 : 0));
  return Math.round((c.contractAmount / months) * 100) / 100;
}

function getNetDue(c, visitedHours) {
  if (!visitedHours) return YEARS.reduce((sum, y) => sum + (c[`hours${y}`] || 0), 0);
  const rem = getRemainingHours(c, visitedHours);
  return YEARS.reduce((sum, y) => sum + (rem[y] || 0), 0);
}

function getHoursOwed(c) {
  return (c.hours2024 || 0) + (c.hours2025 || 0);
}

// Deduct visited hours from oldest year first, return remaining hours per year
function getRemainingHours(c, visitedHours) {
  let remaining = visitedHours;
  const result = {};
  YEARS.forEach(y => {
    const contracted = c[`hours${y}`] || 0;
    const deducted = Math.min(contracted, remaining);
    result[y] = contracted - deducted;
    remaining = Math.max(0, remaining - contracted);
  });
  return result;
}

// Returns how many owed (pre-2026) hours remain after deducting visits
function getOwedAfterVisits(c, visitedHours) {
  const rem = getRemainingHours(c, visitedHours);
  return (rem[2024] || 0) + (rem[2025] || 0);
}

// Parse extensionDate "M/D/YY-M/D/YY" -> { start: Date, end: Date } or null
function parseContractDates(extensionDate) {
  if (!extensionDate) return null;
  const parts = extensionDate.split("-");
  if (parts.length < 2) return null;
  const startStr = parts[0].trim();
  const endStr = parts.slice(1).join("-").trim();
  const sm = startStr.match(/^(\d+)\/(\d+)\/(\d+)$/);
  const em = endStr.match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!sm || !em) return null;
  const start = new Date(2000 + parseInt(sm[3]), parseInt(sm[1]) - 1, parseInt(sm[2]));
  const end   = new Date(2000 + parseInt(em[3]), parseInt(em[1]) - 1, parseInt(em[2]));
  return { start, end };
}

// Get YYYY-MM string from Date
function toYearMonth(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function computeWOSchedule(c, contractWOs) {
  if (!contractWOs || contractWOs.length === 0) return [];
  const dates = parseContractDates(c.extensionDate);
  const today = new Date();
  const n = contractWOs.length;

  return contractWOs.map(function(wo, i) {
    let targetDate;
    if (wo.scheduledDate) {
      targetDate = new Date(wo.scheduledDate);
    } else if (dates) {
      const { start, end } = dates;
      const contractMs = end - start;
      const frac = n === 1 ? 0.5 : i / (n - 1);
      targetDate = new Date(start.getTime() + frac * contractMs);
    } else {
      targetDate = today;
    }

    const isComplete = wo.status === "complete";
    const isOverdue = !isComplete && targetDate < today;
    return {
      ...wo,
      targetDate,
      targetYearMonth: toYearMonth(targetDate),
      status: isComplete ? "complete" : isOverdue ? "overdue" : "scheduled",
    };
  });
}

function computeSchedule(c, contractVisits, overrides) {
  const slotOverrides = overrides || {};
  const n = parseInt(c.suggestedVisits) || 0;
  if (n === 0) return [];
  const dates = parseContractDates(c.extensionDate);
  if (!dates) return [];
  const { start, end } = dates;
  const today = new Date();
  const contractMs = end - start;

  const originalTargets = [];
  for (let i = 0; i < n; i++) {
    const frac = n === 1 ? 0.5 : i / (n - 1);
    originalTargets.push(new Date(start.getTime() + frac * contractMs));
  }

  const termStart = c.termStartDate ? new Date(c.termStartDate) : start;
  const termVisits = (contractVisits || [])
    .filter(v => {
      const d = v.date.length === 7 ? new Date(v.date + "-01") : new Date(v.date);
      return d >= new Date(termStart.getFullYear(), termStart.getMonth(), 1);
    })
    .slice().sort((a, b) => (a.date < b.date ? -1 : 1));

  const completedVisits = termVisits.slice(0, n);
  const doneCount = completedVisits.length;
  const remainingCount = n - doneCount;

  let wasLate = false;
  if (doneCount > 0) {
    const lastDone = completedVisits[doneCount - 1];
    const lastDoneDate = lastDone.date.length === 7
      ? new Date(lastDone.date + "-01")
      : new Date(lastDone.date);
    const originalTarget = originalTargets[doneCount - 1];
    const lateTolerance = 1000 * 60 * 60 * 24 * 14;
    wasLate = (lastDoneDate - originalTarget) > lateTolerance;
  }

  const slots = [];

  for (let i = 0; i < doneCount; i++) {
    const v = completedVisits[i];
    const actualDate = v.date.length === 7 ? new Date(v.date + "-01") : new Date(v.date);
    const doneOverride = slotOverrides[i + 1];
    slots.push({
      visitNo: i + 1,
      targetYearMonth: doneOverride || toYearMonth(actualDate),
      targetDate: actualDate,
      originalTarget: originalTargets[i],
      matchedVisit: v,
      status: "done",
      wasLate: (actualDate - originalTargets[i]) > (1000 * 60 * 60 * 24 * 14),
      manuallyMoved: !!doneOverride,
    });
  }

  for (let i = 0; i < remainingCount; i++) {
    let targetDate;

    if (!wasLate) {
      targetDate = originalTargets[doneCount + i];
    } else {
      const spreadStart = today > start ? today : start;
      const spreadMs = end - spreadStart;
      if (spreadMs <= 0 || spreadStart >= end) {
        targetDate = new Date(end);
      } else if (remainingCount === 1) {
        targetDate = new Date(spreadStart.getTime() + spreadMs * 0.5);
      } else {
        const interval = spreadMs / remainingCount;
        targetDate = new Date(spreadStart.getTime() + interval * i + interval * 0.5);
      }
      if (targetDate > end) targetDate = new Date(end);
    }

    const isOverdue = targetDate < today || today > end;
    const upcomingOverride = slotOverrides[doneCount + i + 1];
    const finalYM = upcomingOverride || toYearMonth(targetDate);
    const finalStatus = upcomingOverride
      ? (new Date(upcomingOverride + "-01") < today
          ? "overdue"
          : (isOverdue ? "rescheduled" : "upcoming"))
      : (isOverdue ? "overdue" : "upcoming");
    slots.push({
      visitNo: doneCount + i + 1,
      targetYearMonth: finalYM,
      targetDate: upcomingOverride ? new Date(upcomingOverride + "-01") : targetDate,
      originalTarget: originalTargets[doneCount + i],
      matchedVisit: null,
      status: finalStatus,
      rescheduled: wasLate && !upcomingOverride,
      manuallyMoved: !!upcomingOverride,
    });
  }

  return slots;
}

function getScheduleHealth(c, contractVisits) {
  const n = parseInt(c.suggestedVisits) || 0;
  if (n === 0) return { status: "none", label: "—", color: "#94a3b8" };
  const schedule = computeSchedule(c, contractVisits);
  const overdueCount      = schedule.filter(s => s.status === "overdue").length;
  const rescheduledCount  = schedule.filter(s => s.status === "rescheduled").length;
  const doneCount         = schedule.filter(s => s.status === "done").length;
  const upcomingCount     = schedule.filter(s => s.status === "upcoming").length;
  if (overdueCount > 0)       return { status: "overdue",      label: overdueCount + " overdue",       color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (rescheduledCount > 0)   return { status: "rescheduled",  label: rescheduledCount + " rescheduled", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  if (doneCount === n)        return { status: "complete",     label: "All done",                       color: "#059669", bg: "rgba(5,150,105,0.08)" };
  const next = schedule.find(s => s.status === "upcoming" || s.status === "rescheduled");
  if (next) {
    const daysUntil = Math.round((next.targetDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 30) return { status: "due-soon",  label: "Due in " + daysUntil + "d", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
    return { status: "on-track", label: "On track",                                          color: "#2563eb", bg: "rgba(37,99,235,0.08)" };
  }
  return { status: "on-track", label: doneCount + "/" + n + " done",                         color: "#2563eb", bg: "rgba(37,99,235,0.08)" };
}

function getContractStatus(c) {
  if (c.status === "archived") return "archived";
  const p = parseExtensionParts(c.extensionDate);
  if (p && new Date() > p.endDate) return "expired";
  return "active";
}

function advanceDateByYear(str) {
  const m = str.trim().match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!m) return str;
  const newYear = (parseInt(m[3]) + 1) % 100;
  return m[1] + "/" + m[2] + "/" + String(newYear).padStart(2, "0");
}

function parseExtensionParts(extensionDate) {
  if (!extensionDate) return null;
  const parts = extensionDate.split("-");
  if (parts.length < 2) return null;
  const startStr = parts[0].trim();
  const endStr   = parts.slice(1).join("-").trim();
  const dates    = parseContractDates(extensionDate);
  if (!dates) return null;
  return { startStr, endStr, startDate: dates.start, endDate: dates.end };
}

function daysUntilExpiry(c) {
  const p = parseExtensionParts(c.extensionDate);
  if (!p) return null;
  return Math.round((p.endDate - new Date()) / (1000 * 60 * 60 * 24));
}

function getRenewalStatus(c) {
  const days = daysUntilExpiry(c);
  if (days === null) return { status: "unknown", label: "No dates", color: "#94a3b8" };
  if (days < 0)      return { status: "expired",  label: "Expired " + Math.abs(days) + "d ago", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (days <= 30)    return { status: "due",       label: "Expires in " + days + "d",            color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  return { status: "ok", label: days + "d remaining", color: "#059669", bg: "rgba(5,150,105,0.08)" };
}

function suggestNextTerm(extensionDate) {
  const p = parseExtensionParts(extensionDate);
  if (!p) return "";
  return advanceDateByYear(p.startStr) + "-" + advanceDateByYear(p.endStr);
}

function getNextTermYears(nextExtensionDate) {
  const p = parseExtensionParts(nextExtensionDate);
  if (!p) return [];
  const years = [];
  let y = p.startDate.getFullYear();
  while (y <= p.endDate.getFullYear()) { years.push(y); y++; }
  return years;
}

function allocateHoursByYear(extensionDate, totalHours, suggestedVisits) {
  const result = {};
  YEARS.forEach(y => { result["hours" + y] = 0; });
  if (!totalHours) return result;

  const newDates = parseContractDates(extensionDate);
  if (!newDates) return result;

  const { start, end } = newDates;
  const nVisits = parseInt(suggestedVisits) || 0;
  const rawValues = {};

  if (nVisits > 0) {
    const contractMs = end - start;
    const visitsPerYear = {};
    for (let i = 0; i < nVisits; i++) {
      const frac = nVisits === 1 ? 0.5 : i / (nVisits - 1);
      const targetDate = new Date(start.getTime() + frac * contractMs);
      const y = targetDate.getFullYear();
      visitsPerYear[y] = (visitsPerYear[y] || 0) + 1;
    }
    YEARS.forEach(y => {
      rawValues["hours" + y] = visitsPerYear[y] ? (visitsPerYear[y] / nVisits) * totalHours : 0;
    });
  } else {
    const monthsPerYear = {};
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (d <= endMonth) {
      const y = d.getFullYear();
      monthsPerYear[y] = (monthsPerYear[y] || 0) + 1;
      d.setMonth(d.getMonth() + 1);
    }
    const totalMonths = Object.values(monthsPerYear).reduce((s, v) => s + v, 0);
    YEARS.forEach(y => {
      rawValues["hours" + y] = monthsPerYear[y] ? (monthsPerYear[y] / totalMonths) * totalHours : 0;
    });
  }

  const activeYears = YEARS.filter(y => rawValues["hours" + y] > 0);
  let sumFloored = 0;
  activeYears.forEach(y => {
    result["hours" + y] = Math.floor(rawValues["hours" + y]);
    sumFloored += result["hours" + y];
  });
  let remainder = Math.round(totalHours - sumFloored);
  const byFrac = activeYears
    .map(y => ({ y, frac: rawValues["hours" + y] - Math.floor(rawValues["hours" + y]) }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < remainder && i < byFrac.length; i++) {
    result["hours" + byFrac[i].y] += 1;
  }
  return result;
}

// Generate a deterministic pill color for custom/unknown equipment types
function getEqPillStyle(type) {
  const known = ["w1","w2","w3","log","pp","dry","insp","ipp","irn"];
  if (known.includes(type.toLowerCase())) return null;
  const palette = [
    { bg: "rgba(6,182,212,0.1)",   color: "#0891b2", border: "rgba(6,182,212,0.3)"   },
    { bg: "rgba(245,158,11,0.1)",  color: "#d97706", border: "rgba(245,158,11,0.3)"  },
    { bg: "rgba(16,185,129,0.1)",  color: "#059669", border: "rgba(16,185,129,0.3)"  },
    { bg: "rgba(239,68,68,0.1)",   color: "#dc2626", border: "rgba(239,68,68,0.3)"   },
    { bg: "rgba(139,92,246,0.1)",  color: "#7c3aed", border: "rgba(139,92,246,0.3)"  },
    { bg: "rgba(236,72,153,0.1)",  color: "#db2777", border: "rgba(236,72,153,0.3)"  },
    { bg: "rgba(20,184,166,0.1)",  color: "#0d9488", border: "rgba(20,184,166,0.3)"  },
    { bg: "rgba(249,115,22,0.1)",  color: "#ea580c", border: "rgba(249,115,22,0.3)"  },
  ];
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = (hash * 31 + type.charCodeAt(i)) & 0xffff;
  const clr = palette[hash % palette.length];
  return { background: clr.bg, color: clr.color, border: "1px solid " + clr.border };
}

function EqPill({ type, style }) {
  const dynStyle = getEqPillStyle(type);
  if (dynStyle) {
    return <span className="pill" style={{ ...dynStyle, ...(style || {}) }}>{type}</span>;
  }
  return <span className={"pill pill-" + type.toLowerCase()} style={style || {}}>{type}</span>;
}

function ConfirmArchiveButton({ onConfirm, style: extraStyle = {}, stopPropagation = false }) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef(null);

  function arm(e) {
    if (stopPropagation) e.stopPropagation();
    setArmed(true);
    timerRef.current = setTimeout(() => setArmed(false), 3000);
  }

  function confirm(e) {
    if (stopPropagation) e.stopPropagation();
    clearTimeout(timerRef.current);
    setArmed(false);
    onConfirm();
  }

  function cancel(e) {
    if (stopPropagation) e.stopPropagation();
    clearTimeout(timerRef.current);
    setArmed(false);
  }

  if (armed) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <button onClick={confirm}
          style={{ fontSize: 10, padding: "2px 8px", background: "#dc2626", color: "#fff",
            border: "none", borderRadius: 3, cursor: "pointer", fontWeight: 700, ...extraStyle }}>
          Confirm
        </button>
        <button onClick={cancel}
          style={{ fontSize: 10, padding: "2px 6px", background: "none", border: "1px solid #e2e8f0",
            borderRadius: 3, cursor: "pointer", color: "#94a3b8" }}>
          x
        </button>
      </span>
    );
  }

  return (
    <button onClick={arm}
      style={{ fontSize: 10, padding: "2px 7px", background: "none", border: "1px solid #e2e8f0",
        borderRadius: 3, cursor: "pointer", color: "#94a3b8", ...extraStyle }}>
      Archive
    </button>
  );
}

// Visit data stored as { [contractId]: [{id, visitNo, date, actualHours, techs, comments}] }
const INITIAL_VISITS = {};

function VisitPanel({ contract: c, visits, newVisit, setNewVisit, onAddVisit, onDeleteVisit, onEditVisit, onClose, getVisitedHours, onUpdateContract, onDeleteContract, allContracts, allVisits, customerHistory, onSaveCustomerHistory, allCorporateGroups, onGroupSelect, getOverridesForContract }) {
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [editVisitForm, setEditVisitForm] = useState(null);
  const [confirmDeleteVisit, setConfirmDeleteVisit] = useState(null);
  const [confirmDeleteContract, setConfirmDeleteContract] = useState(false);
  const [overrideWarning, setOverrideWarning] = useState(false);
  const [editingContract, setEditingContract] = useState(false);
  const [contractForm, setContractForm] = useState(null);
  const [panelTab, setPanelTab] = useState("visits");
  const [editingHistoryYear, setEditingHistoryYear] = useState(null);
  const [historyEditForm, setHistoryEditForm] = useState({ hrs: "", rev: "" });

  const HISTORY_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const AUTO_YEARS = [2026, 2027, 2028];
  const customerKey = c.customerNo || c.customer;

  // Find all contracts for this customer across both divisions
  const customerContracts = (allContracts || []).filter(function(ct) {
    return ct.customerNo === c.customerNo && c.customerNo
      ? ct.customerNo === c.customerNo
      : ct.customer === c.customer;
  });

  // Auto-compute hours and revenue per year from all matching contracts
  function getAutoYear(y) {
    const hrs = customerContracts.reduce(function(s, ct) {
      return s + (ct[`hours${y}`] || 0);
    }, 0);
    const rev = customerContracts.reduce(function(s, ct) {
      // Apportion contractAmount to this year based on year hours / total hours
      const totalHrs = YEARS.reduce((ts, yr) => ts + (ct[`hours${yr}`] || 0), 0);
      const yearHrs = ct[`hours${y}`] || 0;
      if (totalHrs === 0 || yearHrs === 0) return s;
      return s + (ct.contractAmount || 0) * (yearHrs / totalHrs);
    }, 0);
    return { hrs, rev };
  }

  // Manual history for this customer
  const custHist = (customerHistory || {})[customerKey] || {};

  // Build full history rows
  const allHistYears = [...HISTORY_YEARS, ...AUTO_YEARS];
  const historyRows = allHistYears.map(function(y) {
    const isAuto = AUTO_YEARS.includes(y);
    if (isAuto) {
      const auto = getAutoYear(y);
      return { y, hrs: auto.hrs, rev: auto.rev, isAuto: true };
    } else {
      const manual = custHist[y] || {};
      return { y, hrs: manual.hrs || 0, rev: manual.rev || 0, isAuto: false };
    }
  });

  // Sparkline data: all years with any data
  const sparkData = historyRows.filter(r => r.hrs > 0 || r.rev > 0);

  function saveHistoryYear(y, hrs, rev) {
    const updated = {
      ...customerHistory,
      [customerKey]: {
        ...(customerHistory[customerKey] || {}),
        [y]: { hrs: parseFloat(hrs) || 0, rev: parseFloat(rev) || 0 },
      },
    };
    onSaveCustomerHistory(updated);
    setEditingHistoryYear(null);
  }

  const contractVisits = (visits[c.id] || []).slice().sort((a, b) => a.visitNo - b.visitNo);
  const visitedHours = getVisitedHours(c.id);

  // Total hours owed across ALL years (sum of all year columns)
  const totalOwedAllYears = YEARS.reduce((s, y) => s + (c[`hours${y}`] || 0), 0);
  // Remaining after visits applied oldest-first
  const remByYear = getRemainingHours(c, visitedHours);
  const remainingAllYears = YEARS.reduce((s, y) => s + (remByYear[y] || 0), 0);

  const contractedHours = totalOwedAllYears;
  const pct = contractedHours > 0 ? (visitedHours / contractedHours) * 100 : 0;
  const remaining = remainingAllYears - Math.max(0, visitedHours - contractedHours); // negative = ahead
  const isAhead = visitedHours > contractedHours;
  const barColor = isAhead ? "#7c3aed" : pct >= 100 ? "#dc2626" : pct >= 80 ? "#d97706" : "#059669";

  function startEditVisit(v) {
    setEditingVisitId(v.id);
    setEditVisitForm({ date: v.date, actualHours: v.actualHours, techs: v.techs, comments: v.comments });
  }

  function saveEditVisit(contractId, visitId) {
    onEditVisit(contractId, visitId, editVisitForm);
    setEditingVisitId(null);
    setEditVisitForm(null);
  }

  function cancelEditVisit() {
    setEditingVisitId(null);
    setEditVisitForm(null);
  }

  function startEditContract() {
    // Parse extensionDate back into _startDate/_endDate for the form
    const parts = c.extensionDate ? c.extensionDate.split("-") : ["", ""];
    setContractForm({
      ...c,
      _startDate: parts[0] || "",
      _endDate: parts.slice(1).join("-") || "",
    });
    setEditingContract(true);
  }

  function saveEditContract() {
    const f = contractForm;
    const hrs = f.contractedHours || 0;
    const rate = f.hourlyRate || 0;
    const start = f._startDate || "";
    const end = f._endDate || "";
    const totalValue = hrs * rate;
    const sMatch = start.match(/^(\d+)\/(\d+)\/(\d+)$/);
    const eMatch = end.match(/^(\d+)\/(\d+)\/(\d+)$/);
    let months = 0;
    if (sMatch && eMatch) {
      const sY = 2000 + parseInt(sMatch[3]), sM = parseInt(sMatch[1]), sD = parseInt(sMatch[2]);
      const eY = 2000 + parseInt(eMatch[3]), eM = parseInt(eMatch[1]), eD = parseInt(eMatch[2]);
      months = Math.max(1, (eY - sY) * 12 + (eM - sM) + (eD >= sD ? 1 : 0));
    }
    const monthly = months > 0 && totalValue > 0 ? Math.round((totalValue / months) * 100) / 100 : f.monthlyRevenue;
    const extDate = start && end ? start + "-" + end : f.extensionDate;
    const allocated = autoAllocateHours(extDate, hrs);
    const contractAmount = Math.round(hrs * rate * 100) / 100;
    const updated = { ...f, ...allocated, monthlyRevenue: monthly, extensionDate: extDate, contractAmount };
    delete updated._startDate;
    delete updated._endDate;
    onUpdateContract(updated);
    setEditingContract(false);
    setContractForm(null);
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 99 }} />
      <div className="slide-panel">
        <div className="slide-panel-header">
          {/* Header: customer name + close + edit toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <div className="cond" style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{c.customer}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                Cust # {c.customerNo}{" . "}{c.team.split(", ").map(function(t) { return <span key={t} className={"pill pill-" + t.toLowerCase()} style={{ marginRight: 3 }}>{t}</span>; })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={editingContract ? saveEditContract : startEditContract}
                style={{ background: editingContract ? "#059669" : "none", border: "1px solid " + (editingContract ? "#059669" : "#cbd5e1"), color: editingContract ? "#fff" : "#64748b", fontSize: 10, padding: "3px 9px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.05em" }}>
                {editingContract ? "SAVE" : "EDIT"}
              </button>
              {editingContract && (
                <button onClick={() => { setEditingContract(false); setContractForm(null); }}
                  style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 10, padding: "3px 9px", borderRadius: 2, cursor: "pointer" }}>
                  CANCEL
                </button>
              )}
              <button onClick={() => setConfirmDeleteContract(true)}
                style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 10, padding: "3px 9px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.05em" }}>
                DELETE
              </button>
              <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#64748b", padding: "0 4px", lineHeight: 1, cursor: "pointer" }}>x</button>
            </div>
          </div>

          {/* Editable contract fields */}
          {editingContract && contractForm ? (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Contract Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <div className="form-field" style={{ gridColumn: "span 2" }}>
                  <label>Customer Name</label>
                  <input value={contractForm.customer} onChange={e => setContractForm(f => ({ ...f, customer: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Customer #</label>
                  <input value={contractForm.customerNo} onChange={e => setContractForm(f => ({ ...f, customerNo: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Contract #</label>
                  <input value={contractForm.contractNo || ""} onChange={e => setContractForm(f => ({ ...f, contractNo: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Customer PO</label>
                  <input value={contractForm.customerPO || ""} onChange={e => setContractForm(f => ({ ...f, customerPO: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Corporate Group</label>
                  <select value={contractForm.corporateGroup || "None"} onChange={e => onGroupSelect(e.target.value, v => setContractForm(f => ({ ...f, corporateGroup: v })))} style={{ width: "100%" }}>
                    {allCorporateGroups.map(g => <option key={g}>{g}</option>)}
                    <option value="__add__">+ Add Group...</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Equipment Type</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 4 }}>
                    {EQUIPMENT_TYPES.map(function(t) {
                      const checked = (contractForm.team || "").split(", ").filter(Boolean).includes(t);
                      return (
                        <label key={t} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, cursor: "pointer" }}>
                          <input type="checkbox" checked={checked} onChange={function(e) {
                            const current = (contractForm.team || "").split(", ").filter(Boolean);
                            const updated = e.target.checked ? [...current, t] : current.filter(x => x !== t);
                            const ordered = EQUIPMENT_TYPES.filter(x => updated.includes(x));
                            setContractForm(f => ({ ...f, team: ordered.join(", ") }));
                          }} />
                          {t}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="form-field">
                  <label>Suggested Visits</label>
                  <input type="number" min="0" value={contractForm.suggestedVisits || ""} placeholder="e.g. 4" onChange={e => setContractForm(f => ({ ...f, suggestedVisits: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Travel Costs</label>
                  <select value={contractForm.travelCosts} onChange={e => setContractForm(f => ({ ...f, travelCosts: e.target.value }))} style={{ width: "100%" }}>
                    <option>Billable</option><option>All inclusive</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Contract Start Date</label>
                  <input value={contractForm._startDate || ""} placeholder="e.g. 1/1/26" onChange={e => setContractForm(f => ({ ...f, _startDate: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Contract End Date</label>
                  <input value={contractForm._endDate || ""} placeholder="e.g. 12/31/26" onChange={e => setContractForm(f => ({ ...f, _endDate: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Contracted Hours</label>
                  <input type="number" value={contractForm.contractedHours || ""} onChange={e => setContractForm(f => ({ ...f, contractedHours: parseFloat(e.target.value) || 0 }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Hourly Rate ($)</label>
                  <input type="number" value={contractForm.hourlyRate || ""} placeholder="e.g. 175" onChange={e => setContractForm(f => ({ ...f, hourlyRate: parseFloat(e.target.value) || 0 }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Salesman</label>
                  <input value={contractForm.salesman || ""} placeholder="e.g. J. Smith" onChange={e => setContractForm(f => ({ ...f, salesman: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Parts Discount</label>
                  <input value={contractForm.partsDiscount || ""} placeholder="e.g. 10%" onChange={e => setContractForm(f => ({ ...f, partsDiscount: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Labor Discount</label>
                  <input value={contractForm.laborDiscount || ""} placeholder="e.g. 5%" onChange={e => setContractForm(f => ({ ...f, laborDiscount: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Premium Billing</label>
                  <input value={contractForm.premiumBilling || ""} placeholder="e.g. Net 30" onChange={e => setContractForm(f => ({ ...f, premiumBilling: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                  <input type="checkbox" id="autoRenewPanel" checked={!!contractForm.autoRenew} onChange={e => setContractForm(f => ({ ...f, autoRenew: e.target.checked }))} style={{ width: "auto" }} />
                  <label htmlFor="autoRenewPanel" style={{ fontSize: 11, color: "#1a2235", textTransform: "none", letterSpacing: 0, cursor: "pointer", marginBottom: 0 }}>Auto Renew</label>
                </div>
                <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Notes</label>
                  <textarea
                    value={contractForm.notes || ""}
                    onChange={e => setContractForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Add any notes about this contract..."
                    style={{ width: "100%", minHeight: 80, resize: "vertical", fontFamily: "inherit", fontSize: 11, padding: 8, border: "1px solid #cbd5e1", borderRadius: 4, boxSizing: "border-box" }}
                  />
                </div>
              </div>
              {/* Live calc summary */}
              {contractForm.contractedHours > 0 && contractForm.hourlyRate > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
                  {[
                    { label: "Contract Value", val: fmtRev(contractForm.contractedHours * contractForm.hourlyRate), color: "#2563eb" },
                    { label: "Monthly Rev", val: (() => { const s = contractForm._startDate || ""; const e2 = contractForm._endDate || ""; const sm = s.match(/^(\d+)\/(\d+)\/(\d+)$/); const em = e2.match(/^(\d+)\/(\d+)\/(\d+)$/); if (!sm || !em) return "--"; const mo = Math.max(1,(2000+parseInt(em[3])-2000-parseInt(sm[3]))*12+(parseInt(em[1])-parseInt(sm[1]))+(parseInt(em[2])>=parseInt(sm[2])?1:0)); return "$"+(contractForm.contractedHours*contractForm.hourlyRate/mo).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); })(), color: "#059669" },
                    { label: "Hourly Rate", val: "$" + contractForm.hourlyRate + "/hr", color: "#7c3aed" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "6px 8px", textAlign: "center" }}>
                      <div className="cond" style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.val}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Read-only summary view */
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "10px 14px", marginBottom: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { label: "Contract Amt", val: c.contractAmount > 0 ? fmtRev(c.contractAmount) : "-" },
                { label: "Monthly Rev", val: getMonthlyRevenue(c) > 0 ? fmtRev(getMonthlyRevenue(c)) : "-" },
                { label: "Hourly Rate", val: c.hourlyRate > 0 ? "$" + c.hourlyRate + "/hr" : "-" },
                { label: "Suggested Visits", val: c.suggestedVisits || "-" },
                { label: "Travel", val: c.travelCosts || "-" },
                { label: "Group", val: c.corporateGroup && c.corporateGroup !== "None" ? c.corporateGroup : "-" },
                { label: "Ext. Date", val: c.extensionDate || "-" },
                { label: "Salesman", val: c.salesman || "-" },
                { label: "Parts Disc.", val: c.partsDiscount || "-" },
                { label: "Labor Disc.", val: c.laborDiscount || "-" },
                { label: "Prem. Billing", val: c.premiumBilling || "-" },
                { label: "Auto Renew", val: c.autoRenew ? "Yes" : "No" },
              ].map(item => (
                <div key={item.label} style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#1a2235", fontWeight: 600, marginTop: 1 }}>{item.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Hours progress bar */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Hours Used</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{visitedHours.toFixed(1)} / {contractedHours} hrs</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: Math.min(100, pct) + "%", background: barColor }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11 }}>
              <span style={{ color: "#64748b" }}>{pct.toFixed(0)}% used</span>
              <span style={{ fontWeight: 600, color: isAhead ? "#7c3aed" : remaining <= 0 ? "#dc2626" : "#059669" }}>
                {isAhead
                  ? (visitedHours - contractedHours).toFixed(1) + " hrs ahead"
                  : remaining.toFixed(1) + " hrs remaining"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", background: "#fff", flexShrink: 0 }}>
          {[{ id: "visits", label: "VISIT LOG" }, { id: "history", label: "CUSTOMER HISTORY" }].map(function(tab) {
            const active = panelTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setPanelTab(tab.id)}
                style={{ flex: 1, background: "none", border: "none", borderBottom: "2px solid " + (active ? "#2563eb" : "transparent"), marginBottom: -2, padding: "10px 0", fontSize: 11, fontWeight: active ? 700 : 400, color: active ? "#2563eb" : "#94a3b8", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.15s" }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="slide-panel-body">
          {panelTab === "visits" ? (
          <div>
          {/* Visit Schedule mini-view — re-reads visits on every render */}
          {parseInt(c.suggestedVisits) > 0 && (function() {
            const liveVisits = (visits[c.id] || []).slice().sort((a, b) => (a.date < b.date ? -1 : 1));
            const overrides = getOverridesForContract ? getOverridesForContract(c.id) : {};
            const sched = computeSchedule(c, liveVisits, overrides);
            const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const doneCount = sched.filter(s => s.status === "done").length;
            return (
              <div key={"sched-" + liveVisits.length} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>Visit Schedule</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: doneCount === sched.length ? "#059669" : "#2563eb" }}>{doneCount} of {sched.length} complete</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {sched.slice().sort(function(a, b) { return a.targetYearMonth < b.targetYearMonth ? -1 : a.targetYearMonth > b.targetYearMonth ? 1 : 0; }).map(function(s) {
                    var ymParts = s.targetYearMonth.split("-");
                    var lbl = MONTH_NAMES[parseInt(ymParts[1]) - 1] + " '" + ymParts[0].slice(2);
                    var col = s.status === "done" ? "#059669" : s.status === "overdue" ? "#dc2626" : s.status === "rescheduled" ? "#d97706" : "#2563eb";
                    var bg  = s.status === "done" ? "rgba(5,150,105,0.08)" : s.status === "overdue" ? "rgba(220,38,38,0.08)" : s.status === "rescheduled" ? "rgba(217,119,6,0.08)" : "rgba(37,99,235,0.08)";
                    var icon = s.status === "done" ? "✓" : s.status === "overdue" ? "!" : s.status === "rescheduled" ? "↻" : "◉";
                    return (
                      <div key={s.visitNo} title={s.status === "rescheduled" ? "Rescheduled — originally overdue" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px", background: bg, border: "1px solid " + col + "33", borderRadius: 4, minWidth: 48 }}>
                        <span style={{ fontSize: 9, color: col, fontWeight: 700 }}>{icon} V{s.visitNo}</span>
                        <span style={{ fontSize: 9, color: col, fontWeight: 600 }}>{lbl}</span>
                        {s.manuallyMoved && s.status !== "rescheduled" && <span style={{ fontSize: 8, color: "#0369a1" }}>↻</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Visit Log</div>
          {contractVisits.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", padding: "24px 0" }}>No visits logged yet</div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "28px 90px 50px 1fr 60px", gap: 6, paddingBottom: 6, borderBottom: "1px solid #e2e8f0", fontSize: 10, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <div>#</div><div>Date</div><div>Hrs</div><div>Tech(s) / Comments</div><div></div>
              </div>
              {contractVisits.map(function(v) {
                if (editingVisitId === v.id) {
                  return (
                    <div key={v.id} style={{ background: "#f0f4ff", borderRadius: 4, padding: "10px 8px", marginTop: 4, marginBottom: 4, border: "1px solid #c7d7fd" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                        <div className="form-field">
                          <label>Date</label>
                          <input type="date" value={editVisitForm.date} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, date: e.target.value }; }); }} style={{ width: "100%", position: "relative" }} />
                        </div>
                        <div className="form-field">
                          <label>Actual Hours</label>
                          <input type="number" step="0.25" value={editVisitForm.actualHours} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, actualHours: e.target.value }; }); }} style={{ width: "100%" }} />
                        </div>
                      </div>
                      <div className="form-field" style={{ marginBottom: 8 }}>
                        <label>Tech(s)</label>
                        <input value={editVisitForm.techs} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, techs: e.target.value }; }); }} style={{ width: "100%" }} />
                      </div>
                      <div className="form-field" style={{ marginBottom: 10 }}>
                        <label>Comments</label>
                        <input value={editVisitForm.comments} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, comments: e.target.value }; }); }} style={{ width: "100%" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="btn-sm" onClick={cancelEditVisit}>Cancel</button>
                        <button className="btn-primary" style={{ padding: "4px 12px", fontSize: 11 }} onClick={function() { saveEditVisit(c.id, v.id); }}>Save</button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={v.id} className="visit-row" style={{ gridTemplateColumns: "28px 90px 50px 1fr 60px" }}>
                    <div style={{ color: "#94a3b8", fontWeight: 700 }}>{v.visitNo}</div>
                    <div style={{ color: "#1a2235" }}>{v.date}</div>
                    <div style={{ color: "#2563eb", fontWeight: 700 }}>{v.actualHours}</div>
                    <div>
                      <div style={{ color: "#1a2235", fontSize: 12 }}>{v.techs ? v.techs : <span style={{ color: "#cbd5e1" }}>-</span>}</div>
                      {v.eqHours && Object.keys(v.eqHours).length > 0 && (
                        <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                          {Object.keys(v.eqHours).map(function(t) {
                            return <span key={t} className={"pill pill-" + t.toLowerCase()} style={{ fontSize: 9, padding: "1px 5px" }}>{t}</span>;
                          })}
                        </div>
                      )}
                      {v.comments && <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{v.comments}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={function() { startEditVisit(v); }} style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 10, padding: "2px 6px", borderRadius: 2, cursor: "pointer" }}>Edit</button>
                      <button onClick={function() { setConfirmDeleteVisit(v); }} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 10, padding: "2px 6px", borderRadius: 2, cursor: "pointer" }}>Del</button>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: "1px solid #e2e8f0", marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>Total: {visitedHours.toFixed(1)} hrs</span>
              </div>
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Log a Visit</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div className="form-field">
                <label>Date</label>
                <input type="date" value={newVisit.date} onChange={function(e) { setNewVisit(function(v) { return { ...v, date: e.target.value }; }); }} style={{ width: "100%", position: "relative" }} />
              </div>
              <div className="form-field">
                <label>Actual Hours</label>
                <input type="number" step="0.25" placeholder="0.00" value={newVisit.actualHours} onChange={function(e) { setNewVisit(function(v) { return { ...v, actualHours: e.target.value }; }); }} style={{ width: "100%" }} />
              </div>
            </div>
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Tech(s)</label>
              <input placeholder="e.g. S.Argus / C.Berry" value={newVisit.techs} onChange={function(e) { setNewVisit(function(v) { return { ...v, techs: e.target.value }; }); }} style={{ width: "100%" }} />
            </div>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Comments</label>
              <input placeholder="Optional notes..." value={newVisit.comments} onChange={function(e) { setNewVisit(function(v) { return { ...v, comments: e.target.value }; }); }} style={{ width: "100%" }} />
            </div>
            {c.team && c.team.split(", ").filter(Boolean).length > 0 && (
              <div className="form-field" style={{ marginBottom: 14 }}>
                <label>Equipment Focus</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {c.team.split(", ").filter(Boolean).map(function(t) {
                    const active = !!(newVisit.eqHours && newVisit.eqHours[t]);
                    return (
                      <button key={t} type="button"
                        onClick={function() {
                          setNewVisit(function(v) {
                            const eq = { ...(v.eqHours || {}) };
                            if (eq[t]) { delete eq[t]; } else { eq[t] = true; }
                            return { ...v, eqHours: eq };
                          });
                        }}
                        style={{
                          padding: "4px 12px", borderRadius: 3, fontSize: 11, fontWeight: 700,
                          letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.15s",
                          background: active ? (t === "W1" ? "#2563eb" : t === "W3" ? "#d97706" : t === "Log" ? "#059669" : t === "W2" ? "#7c3aed" : "#64748b") : "#f1f5f9",
                          color: active ? "#fff" : "#64748b",
                          border: active ? "1px solid transparent" : "1px solid #cbd5e1",
                        }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>Select which equipment types this visit covered</div>
              </div>
            )}
            {(() => {
              const newHrs = parseFloat(newVisit.actualHours) || 0;
              const wouldVisit = visitedHours + newHrs;
              const wouldExceed = wouldVisit > totalOwedAllYears;
              const overHrs = wouldExceed ? (wouldVisit - totalOwedAllYears).toFixed(1) : 0;

              function handleLogVisit() {
                if (wouldExceed) {
                  setOverrideWarning(true);
                } else {
                  onAddVisit(c.id);
                }
              }

              return (
                <>
                  {wouldExceed && newHrs > 0 && (
                    <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 4, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 14, lineHeight: 1.4 }}>(!)</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#854d0e" }}>NO CONTRACT HOURS AVAILABLE</div>
                        <div style={{ fontSize: 11, color: "#713f12", marginTop: 2 }}>
                          This visit would exceed all contracted hours by <strong>{overHrs} hrs</strong>. Customer may need to be billed separately.
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className={wouldExceed ? "btn-danger" : "btn-primary"}
                    style={{ width: "100%", padding: "9px", fontSize: 12, letterSpacing: "0.08em" }}
                    onClick={handleLogVisit}
                    disabled={!newVisit.date || !newVisit.actualHours}
                  >
                    {wouldExceed ? "(!) LOG VISIT (EXCEEDS CONTRACT)" : "+ LOG VISIT"}
                  </button>
                </>
              );
            })()}
          </div>
          </div>
          ) : (
          /* HISTORY TAB */
          <div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Customer Spend History
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
              {c.customer}{c.customerNo ? " . #" + c.customerNo : ""}
            </div>

            {/* Sparkline trend chart */}
            {sparkData.length >= 2 && (() => {
              const cW = 440; const cH = 90; const pL = 10; const pR = 10; const pT = 14; const pB = 20;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const maxHrs = Math.max(...sparkData.map(d => d.hrs), 1);
              const pts = sparkData.map(function(d, i) {
                return {
                  x: pL + (i / Math.max(sparkData.length - 1, 1)) * iW,
                  svgY: pT + iH - (d.hrs / maxHrs) * iH,
                  year: d.y,
                  hrs: d.hrs,
                  rev: d.rev,
                };
              });
              const polyline = pts.map(p => p.x + "," + p.svgY).join(" ");
              const first = sparkData[0].hrs;
              const last = sparkData[sparkData.length - 1].hrs;
              const trend = last > first * 1.05 ? "up" : last < first * 0.95 ? "down" : "flat";
              const trendColor = trend === "up" ? "#059669" : trend === "down" ? "#dc2626" : "#94a3b8";
              const trendLabel = trend === "up" ? "Trending Up" : trend === "down" ? "Trending Down" : "Flat";
              return (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Hours Trend</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: trendColor }}>{trendLabel}</div>
                  </div>
                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible" }}>
                    <polygon points={polyline + " " + pts[pts.length-1].x + "," + (pT+iH) + " " + pts[0].x + "," + (pT+iH)}
                      fill={"rgba(" + (trend==="up" ? "5,150,105" : trend==="down" ? "220,38,38" : "148,163,184") + ",0.08)"} />
                    <polyline points={polyline} fill="none" stroke={trendColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                    {pts.map(function(p, i) {
                      return (
                        <g key={i}>
                          <circle cx={p.x} cy={p.svgY} r="3" fill={trendColor} stroke="#fff" strokeWidth="1.5" />
                          {p.hrs > 0 && <text x={p.x} y={p.svgY - 7} textAnchor="middle" fontSize="7" fill={trendColor} fontWeight="700">{fmtHrs(p.hrs)}</text>}
                          <text x={p.x} y={pT + iH + 14} textAnchor="middle" fontSize="7" fill="#94a3b8">{p.year}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Year-by-year table */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 50px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "7px 12px", fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <div>Year</div><div style={{ textAlign: "right" }}>Hours</div><div style={{ textAlign: "right" }}>Revenue</div><div></div>
              </div>
              {historyRows.map(function(row) {
                const isEditing = editingHistoryYear === row.y;
                const hasData = row.hrs > 0 || row.rev > 0;
                return (
                  <div key={row.y} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {isEditing ? (
                      <div style={{ padding: "8px 12px", background: "#f0f4ff", display: "grid", gridTemplateColumns: "60px 1fr 1fr 80px", gap: 8, alignItems: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{row.y}</div>
                        <input type="number" step="0.25" placeholder="Hours" value={historyEditForm.hrs}
                          onChange={e => setHistoryEditForm(f => ({ ...f, hrs: e.target.value }))}
                          style={{ width: "100%", textAlign: "right" }} />
                        <input type="number" placeholder="Revenue" value={historyEditForm.rev}
                          onChange={e => setHistoryEditForm(f => ({ ...f, rev: e.target.value }))}
                          style={{ width: "100%", textAlign: "right" }} />
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => saveHistoryYear(row.y, historyEditForm.hrs, historyEditForm.rev)}
                            style={{ background: "#059669", border: "none", color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 2, cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditingHistoryYear(null)}
                            style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 10, padding: "3px 6px", borderRadius: 2, cursor: "pointer" }}>x</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 50px", padding: "8px 12px", alignItems: "center", background: hasData ? "#fff" : "#fafafa" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: row.isAuto ? "#2563eb" : "#1a2235" }}>
                          {row.y}{row.isAuto && <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 3 }}>auto</span>}
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: hasData ? "#1a2235" : "#cbd5e1", fontWeight: hasData ? 600 : 400 }}>
                          {row.hrs > 0 ? fmtHrs(row.hrs) : "-"}
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: hasData ? "#059669" : "#cbd5e1", fontWeight: hasData ? 600 : 400 }}>
                          {row.rev > 0 ? fmtRev(row.rev) : "-"}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {!row.isAuto && (
                            <button onClick={() => { setEditingHistoryYear(row.y); setHistoryEditForm({ hrs: row.hrs || "", rev: row.rev || "" }); }}
                              style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 10, padding: "2px 7px", borderRadius: 2, cursor: "pointer" }}>
                              {hasData ? "Edit" : "+"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Totals row */}
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 50px", padding: "9px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1a2235" }}>
                  {fmtHrs(historyRows.reduce((s, r) => s + r.hrs, 0))}
                </div>
                <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#059669" }}>
                  {fmtRev(historyRows.reduce((s, r) => s + r.rev, 0))}
                </div>
                <div />
              </div>
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 8 }}>
              Years marked "auto" are calculated from active contracts. Past years (2017-2025) are entered manually.
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Override confirmation modal */}
      {overrideWarning && (
        <div className="modal-overlay" style={{ zIndex: 200 }} onClick={() => setOverrideWarning(false)}>
          <div className="modal" style={{ width: 400, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>(!)</span>
              <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>No Hours Available</div>
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
              This visit exceeds all contracted hours for <strong style={{ color: "#1a2235" }}>{c.customer}</strong> across every year.
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "10px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>What this means:</div>
              <div style={{ fontSize: 12, color: "#7f1d1d", marginTop: 4, lineHeight: 1.6 }}>
                The customer has <strong>{Math.max(0, totalOwedAllYears - visitedHours).toFixed(1)} hrs</strong> remaining across all years.
                Logging this visit will result in a <strong>negative balance</strong> -- these hours should likely be billed separately.
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
              You can override and log the visit anyway, which will flag this contract with a negative balance. Or cancel and adjust the hours.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-sm" onClick={() => setOverrideWarning(false)}>Cancel</button>
              <button
                style={{ background: "#dc2626", border: "1px solid #b91c1c", color: "#fff", padding: "8px 16px", borderRadius: 3, fontSize: 12, letterSpacing: "0.05em", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}
                onClick={function() { setOverrideWarning(false); onAddVisit(c.id); }}
              >
                Override - Log Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteVisit ? (
        <div className="modal-overlay" style={{ zIndex: 200 }} onClick={() => setConfirmDeleteVisit(null)}>
          <div className="modal" style={{ width: 360, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <div className="cond" style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Delete Visit?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>You are about to delete visit #{confirmDeleteVisit.visitNo}:</div>
            <div style={{ fontSize: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ color: "#1a2235", fontWeight: 700 }}>{confirmDeleteVisit.date} - {confirmDeleteVisit.actualHours} hrs</div>
              {confirmDeleteVisit.techs && <div style={{ color: "#64748b", marginTop: 2 }}>{confirmDeleteVisit.techs}</div>}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 22 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-sm" onClick={() => setConfirmDeleteVisit(null)}>Cancel</button>
              <button className="btn-danger" style={{ padding: "6px 16px", fontSize: 12 }} onClick={function() { onDeleteVisit(c.id, confirmDeleteVisit.id); setConfirmDeleteVisit(null); }}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
      {confirmDeleteContract && (
        <div className="modal-overlay" style={{ zIndex: 200 }} onClick={() => setConfirmDeleteContract(false)}>
          <div className="modal" style={{ width: 380, padding: 32 }} onClick={function(e) { e.stopPropagation(); }}>
            <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Delete Contract?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>You are about to delete:</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2235", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, padding: "10px 14px", marginBottom: 16 }}>
              {c.customer}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-sm" onClick={() => setConfirmDeleteContract(false)}>Cancel</button>
              <button className="btn-danger" style={{ padding: "8px 18px", fontSize: 12 }} onClick={() => onDeleteContract(c.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Auto-allocate contracted hours across years based on extension date range
// e.g. "10/1/25-9/30/26" with 120 hrs => { 2025: 30, 2026: 90 }
function autoAllocateHours(extensionDate, contractedHours) {
  const result = { hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0 };
  if (!extensionDate || !contractedHours) return result;
  const match = extensionDate.match(/^(\d+)\/(\d+)\/(\d+)[^0-9]+(\d+)\/(\d+)\/(\d+)/);
  if (!match) return result;
  const startM = parseInt(match[1]), startD = parseInt(match[2]), startY = 2000 + parseInt(match[3]);
  const endM = parseInt(match[4]), endD = parseInt(match[5]), endY = 2000 + parseInt(match[6]);
  const start = new Date(startY, startM - 1, startD);
  const end = new Date(endY, endM - 1, endD);
  const totalDays = Math.max(1, (end - start) / 86400000 + 1);
  for (let y = startY; y <= endY; y++) {
    const key = "hours" + y;
    if (!(key in result)) continue;
    const yStart = new Date(Math.max(start, new Date(y, 0, 1)));
    const yEnd = new Date(Math.min(end, new Date(y, 11, 31)));
    const days = Math.max(0, (yEnd - yStart) / 86400000 + 1);
    result[key] = Math.round((days / totalDays) * contractedHours * 4) / 4; // round to 0.25
  }
  return result;
}

export default function App() {
  const { user, loading: authLoading, logout } = useSession();
  const [tokenReady, setTokenReady] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Keep broker token fresh — gates data loading so queries never fire with anon key
  useEffect(() => {
    if (!user) { setBrokerToken(null); setTokenReady(false); return; }
    let timer;
    let cancelled = false;
    const refresh = async () => {
      const result = await getSupabaseToken('https://kannegiesser.ai', 'service-contracts');
      if (cancelled || !result) return;
      setBrokerToken(result.access_token);
      setTokenReady(true);
      const msUntilRefresh = Math.max(0, (result.expires_at * 1000 - Date.now()) - 5 * 60 * 1000);
      timer = window.setTimeout(refresh, msUntilRefresh);
    };
    refresh();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [user]);

  const [division, setDivision] = useState("KNA");

  // Per-division contract data
  const [knaContracts, setKnaContracts] = useState([]);
  const [kcanContracts, setKcanContracts] = useState([]);

  // Per-division visit data
  const [knaVisits, setKnaVisits] = useState({});
  const [kcanVisits, setKcanVisits] = useState({});

  // Per-division monthly snapshots
  const [knaSnapshots, setKnaSnapshots] = useState({ "2026-01": 7620.75, "2026-02": 7822 });
  const [kcanSnapshots, setKcanSnapshots] = useState({});

  // Per-division work orders
  const [knaWorkOrders, setKnaWorkOrders] = useState({});
  const [kcanWorkOrders, setKcanWorkOrders] = useState({});

  // Customer history: { [customerNo]: { 2017: { hrs, rev }, 2018: ... } }
  const [customerHistory, setCustomerHistory] = useState({});

  // Load all data from Supabase — wait for broker token before firing any queries
  useEffect(() => {
    if (!user || !tokenReady) return;

    async function loadAllData() {
      setDataLoading(true);
      try {
        // Load KNA contracts
        const { data: knaData } = await supabase
          .from('contracts')
          .select('*')
          .eq('division', 'KNA')
          .order('customer');
        if (knaData) setKnaContracts(knaData.map(mapDbToContract));

        // Load KCAN contracts
        const { data: kcanData } = await supabase
          .from('contracts')
          .select('*')
          .eq('division', 'KCAN')
          .order('customer');
        if (kcanData) setKcanContracts(kcanData.map(mapDbToContract));

        // Load all visits
        const { data: visitsData } = await supabase
          .from('visits')
          .select('*')
          .order('visit_no');
        if (visitsData) {
          const knaVisitsMap = {};
          const kcanVisitsMap = {};
          // We need to know which contracts are KNA vs KCAN
          const knaIds = new Set((knaData || []).map(c => c.id));
          visitsData.forEach(v => {
            const mapped = mapDbToVisit(v);
            if (knaIds.has(v.contract_id)) {
              if (!knaVisitsMap[v.contract_id]) knaVisitsMap[v.contract_id] = [];
              knaVisitsMap[v.contract_id].push(mapped);
            } else {
              if (!kcanVisitsMap[v.contract_id]) kcanVisitsMap[v.contract_id] = [];
              kcanVisitsMap[v.contract_id].push(mapped);
            }
          });
          setKnaVisits(knaVisitsMap);
          setKcanVisits(kcanVisitsMap);
        }

        // Load customer history
        const { data: histData } = await supabase
          .from('customer_history')
          .select('*');
        if (histData) {
          const histMap = {};
          histData.forEach(h => {
            const key = h.customer_no;
            if (!histMap[key]) histMap[key] = {};
            histMap[key][h.year] = { hrs: h.hrs || 0, rev: h.rev || 0 };
          });
          setCustomerHistory(histMap);
        }

        // Load snapshots
        const { data: snapData } = await supabase
          .from('monthly_snapshots')
          .select('*');
        if (snapData) {
          const knaSnaps = {};
          const kcanSnaps = {};
          snapData.forEach(s => {
            if (s.division === 'KNA') knaSnaps[s.year_month] = s.revenue;
            else kcanSnaps[s.year_month] = s.revenue;
          });
          if (Object.keys(knaSnaps).length > 0) setKnaSnapshots(prev => ({ ...prev, ...knaSnaps }));
          if (Object.keys(kcanSnaps).length > 0) setKcanSnapshots(prev => ({ ...prev, ...kcanSnaps }));
        }

        // Load schedule overrides
        const { data: settingsData } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'schedule_overrides');
        if (settingsData) {
          settingsData.forEach(s => {
            if (s.division === 'KNA' && s.value) setKnaScheduleOverrides(s.value);
            else if (s.division === 'KCAN' && s.value) setKcanScheduleOverrides(s.value);
          });
        }

        // Load IPP programs
        const { data: ippData } = await supabase
          .from('ipp_programs')
          .select('*');
        if (ippData) {
          setIppPrograms(ippData.map(p => ({
            id: p.id,
            name: p.name,
            group: p.group_name,
            startDate: p.start_date || '',
            endDate: p.end_date || '',
            sites: p.sites || [],
          })));
        }

        // Load work orders
        const { data: woData } = await supabase
          .from('work_orders')
          .select('*');
        if (woData) {
          const knaWOs = {};
          const kcanWOs = {};
          const knaIds = new Set((knaData || []).map(c => c.id));
          woData.forEach(wo => {
            const mapped = {
              id: wo.id,
              contractId: wo.contract_id,
              title: wo.title,
              description: wo.description || '',
              serialNumber: wo.serial_number || '',
              estimatedHours: wo.estimated_hours,
              actualHours: wo.actual_hours,
              status: wo.status || 'scheduled',
              linkedVisitNo: wo.linked_visit_no,
              completedAt: wo.completed_at || '',
              scheduledDate: wo.scheduled_date || '',
              createdAt: wo.created_at,
            };
            if (knaIds.has(wo.contract_id)) {
              if (!knaWOs[wo.contract_id]) knaWOs[wo.contract_id] = [];
              knaWOs[wo.contract_id].push(mapped);
            } else {
              if (!kcanWOs[wo.contract_id]) kcanWOs[wo.contract_id] = [];
              kcanWOs[wo.contract_id].push(mapped);
            }
          });
          setKnaWorkOrders(knaWOs);
          setKcanWorkOrders(kcanWOs);
        }

      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        setDataLoading(false);
      }
    }

    loadAllData();
  }, [user, tokenReady]);

  // Active division data (derived)
  const workOrders = division === "KNA" ? knaWorkOrders : kcanWorkOrders;
  const setWorkOrders = division === "KNA" ? setKnaWorkOrders : setKcanWorkOrders;
  const allDivisionContracts = division === "KNA" ? knaContracts : kcanContracts;
  const contracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");
  const setContracts = division === "KNA" ? setKnaContracts : setKcanContracts;
  const visits = division === "KNA" ? knaVisits : kcanVisits;
  const setVisits = division === "KNA" ? setKnaVisits : setKcanVisits;
  const monthlySnapshots = division === "KNA" ? knaSnapshots : kcanSnapshots;
  const setMonthlySnapshots = division === "KNA" ? setKnaSnapshots : setKcanSnapshots;

  // IPP Programs
  const [ippPrograms, setIppPrograms] = useState([]);
  const [ippUiState, setIppUiState] = useState({
    view: "list", editingProgram: null, selectedProgram: null,
    selectedSiteId: null, taskDrag: null, dragOverVisit: null, sitesCollapsed: true
  });

  // Renewals
  const [renewalContract, setRenewalContract] = useState(null);
  const [renewForm, setRenewForm] = useState({});
  const renewHoursRef = useRef(null);
  useEffect(function() {
    if (renewHoursRef.current) {
      renewHoursRef.current.value = String(renewForm.contractedHours || "");
    }
  }, [renewalContract]);

  // Schedule
  const [selectedScheduleMonth, setSelectedScheduleMonth] = useState(null);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleSortCol, setScheduleSortCol] = useState("customer");
  const [scheduleSortDir, setScheduleSortDir] = useState("asc");
  const [draggingSlot, setDraggingSlot] = useState(null);
  const [dragOverMonth, setDragOverMonth] = useState(null);
  const [knaScheduleOverrides, setKnaScheduleOverrides] = useState({});
  const [kcanScheduleOverrides, setKcanScheduleOverrides] = useState({});
  const scheduleOverrides = division === "KNA" ? knaScheduleOverrides : kcanScheduleOverrides;
  const setScheduleOverrides = division === "KNA" ? setKnaScheduleOverrides : setKcanScheduleOverrides;

  // Contract status filter
  const [contractStatusFilter, setContractStatusFilter] = useState("active");

  // Work order UI
  const [expandedWORows, setExpandedWORows] = useState({});
  const [openPanelToTab, setOpenPanelToTab] = useState(null);

  // Extra equipment types and groups
  const [extraEqTypes, setExtraEqTypes] = useState([]);
  const [extraGroups, setExtraGroups] = useState([]);

  // Activity log
  const [activityLog, setActivityLog] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [activityPage, setActivityPage] = useState(0);
  const ACTIVITY_PAGE_SIZE = 50;

  async function loadActivityLog() {
    setActivityLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (data) setActivityLog(data);
      if (error) console.error('Failed to load activity log:', error);
    } catch (e) { console.error('Failed to load activity log:', e); }
    setActivityLoading(false);
  }

  const [selectedContract, setSelectedContract] = useState(null); // slide-out panel
  const [newVisit, setNewVisit] = useState({ date: "", actualHours: "", techs: "", comments: "", eqHours: {} });
  const [view, setView] = useState("dashboard");

  // Auto-refresh activity log when switching to the Activity tab
  useEffect(() => {
    if (view === "activity" && user) loadActivityLog();
  }, [view]);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyContract });
  const [addFormManual, setAddFormManual] = useState({}); // tracks which year fields user manually edited

  function updateAddFormField(field, value) {
    setAddForm(function(prev) {
      const updated = { ...prev, [field]: value };
      // Re-run allocation if hours or date changed, skip manually-overridden years
      if (field === "contractedHours" || field === "extensionDate") {
        const allocated = autoAllocateHours(
          field === "extensionDate" ? value : prev.extensionDate,
          field === "contractedHours" ? (parseFloat(value) || 0) : prev.contractedHours
        );
        YEARS.forEach(function(y) {
          if (!addFormManual["hours" + y]) {
            updated["hours" + y] = allocated["hours" + y] || 0;
          }
        });
      }
      return updated;
    });
  }
  const [sortCol, setSortCol] = useState("customer");
  const [sortDir, setSortDir] = useState("asc");
  const [owedOnly, setOwedOnly] = useState(false);
  const [groupFilter, setGroupFilter] = useState("All");

  const filtered = useMemo(() => {
    let data = contracts.filter(c => {
      const matchSearch = c.customer.toLowerCase().includes(search.toLowerCase()) ||
        c.customerNo.toLowerCase().includes(search.toLowerCase());
      const matchTeam = teamFilter === "All" || c.team.split(", ").includes(teamFilter);
      const matchOwed = !owedOnly || getOwedAfterVisits(c, (visits[c.id] || []).reduce((s, v) => s + v.actualHours, 0)) > 0;
      const matchGroup = groupFilter === "All" || c.corporateGroup === groupFilter;
      return matchSearch && matchTeam && matchOwed && matchGroup;
    });
    data = [...data].sort((a, b) => {
      let va, vb;
      if (sortCol === "netDue") {
        va = getNetDue(a, getVisitedHours(a.id)); vb = getNetDue(b, getVisitedHours(b.id));
      } else if (sortCol === "lastVisit") {
        va = getLastVisitDate(a.id) || ""; vb = getLastVisitDate(b.id) || "";
      } else {
        va = a[sortCol]; vb = b[sortCol];
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [contracts, search, teamFilter, owedOnly, groupFilter, sortCol, sortDir, visits]);

  const totals = useMemo(() => {
    const t = { contractedHours: 0, netDue: 0, monthlyRevenue: 0, contractAmount: 0, owedHours: 0 };
    YEARS.forEach(y => t[`hours${y}`] = 0);
    filtered.forEach(c => {
      const visitedHrs = getVisitedHours(c.id);
      t.contractedHours += c.contractedHours;
      t.monthlyRevenue += getMonthlyRevenue(c);
      t.contractAmount += c.contractAmount || 0;
      t.owedHours += getOwedAfterVisits(c, visitedHrs);
      t.netDue += getNetDue(c, visitedHrs);
      const rem = getRemainingHours(c, visitedHrs);
      YEARS.forEach(y => t[`hours${y}`] += rem[y] || 0);
    });
    return t;
  }, [filtered, visits]);

  const teamCounts = useMemo(() => {
    const counts = { W1: 0, W2: 0, W3: 0, Log: 0 };
    contracts.forEach(c => {
      c.team.split(", ").forEach(function(t) { if (counts[t] !== undefined) counts[t]++; });
    });
    return counts;
  }, [contracts]);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  // Activity logging
  async function logActivity(actionType, contractId, contractName, details) {
    try {
      await supabase.from('activity_log').insert({
        action_type: actionType,
        contract_id: contractId || null,
        contract_name: contractName || null,
        user_email: user?.email || null,
        details: details || {},
      });
    } catch (e) { console.error('Failed to log activity:', e); }
  }

  async function saveEdit(id) {
    const updated = { ...editForm, id };
    setContracts(prev => prev.map(c => c.id === id ? updated : c));
    setEditingId(null);
    setEditForm(null);
    // Persist to Supabase
    const { error } = await supabase.from('contracts').update(mapContractToDb(updated)).eq('id', id);
    if (error) console.error('Failed to save contract edit:', error);
    logActivity('contract_edited', id, updated.customer, { division });
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function deleteContract(id) {
    setConfirmDeleteId(id);
  }

  async function updateContract(updated) {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c)
      .sort((a, b) => a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())));
    setSelectedContract(updated);
    // Persist to Supabase
    const { error } = await supabase.from('contracts').update(mapContractToDb(updated)).eq('id', updated.id);
    if (error) console.error('Failed to update contract:', error);
    logActivity('contract_updated', updated.id, updated.customer, { division });
  }

  async function confirmDelete() {
    const idToDelete = confirmDeleteId;
    const deletedContract = contracts.find(c => c.id === idToDelete);
    setContracts(prev => prev.filter(c => c.id !== idToDelete));
    setConfirmDeleteId(null);
    // Persist to Supabase
    const { error } = await supabase.from('contracts').delete().eq('id', idToDelete);
    if (error) console.error('Failed to delete contract:', error);
    logActivity('contract_deleted', idToDelete, deletedContract?.customer, { division });
  }

  async function addContract() {
    const dbContract = { ...mapContractToDb(addForm), division };
    const { data, error } = await supabase.from('contracts').insert(dbContract).select().single();
    if (error) {
      console.error('Failed to add contract:', error);
      return;
    }
    const newContract = mapDbToContract(data);
    setContracts(prev => [...prev, newContract].sort((a, b) =>
      a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())
    ));
    setAddForm({ ...emptyContract });
    setShowAddForm(false);
    logActivity('contract_added', newContract.id, newContract.customer, { division });
  }

  async function addVisit(contractId) {
    if (!newVisit.date || !newVisit.actualHours) return;
    const contractVisits = visits[contractId] || [];
    const nextNo = contractVisits.length > 0 ? Math.max(...contractVisits.map(v => v.visitNo)) + 1 : 1;
    const visit = {
      visitNo: nextNo,
      date: newVisit.date,
      actualHours: parseFloat(newVisit.actualHours) || 0,
      eqHours: newVisit.eqHours || {},
      techs: newVisit.techs,
      comments: newVisit.comments,
    };
    // Save to Supabase first to get UUID
    const { data, error } = await supabase.from('visits').insert(mapVisitToDb(visit, contractId)).select().single();
    if (error) {
      console.error('Failed to add visit:', error);
      return;
    }
    const savedVisit = mapDbToVisit(data);
    setVisits(prev => ({ ...prev, [contractId]: [...(prev[contractId] || []), savedVisit] }));
    setNewVisit({ date: "", actualHours: "", techs: "", comments: "", eqHours: {} });
    const contract = contracts.find(c => c.id === contractId);
    logActivity('visit_logged', contractId, contract?.customer, { date: visit.date, hours: visit.actualHours, techs: visit.techs, eqHours: visit.eqHours });
  }

  async function deleteVisit(contractId, visitId) {
    const deletedVisit = (visits[contractId] || []).find(v => v.id === visitId);
    setVisits(prev => ({ ...prev, [contractId]: (prev[contractId] || []).filter(v => v.id !== visitId) }));
    const { error } = await supabase.from('visits').delete().eq('id', visitId);
    if (error) console.error('Failed to delete visit:', error);
    const contract = contracts.find(c => c.id === contractId);
    logActivity('visit_deleted', contractId, contract?.customer, { visitNo: deletedVisit?.visitNo, date: deletedVisit?.date });
  }

  async function editVisit(contractId, visitId, updates) {
    const merged = { ...updates, actualHours: parseFloat(updates.actualHours) || 0 };
    setVisits(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(v => v.id === visitId ? { ...v, ...merged } : v)
    }));
    // Persist to Supabase
    const dbUpdates = {};
    if (merged.date !== undefined) dbUpdates.date = merged.date;
    if (merged.actualHours !== undefined) dbUpdates.actual_hours = merged.actualHours;
    if (merged.techs !== undefined) dbUpdates.techs = merged.techs;
    if (merged.comments !== undefined) dbUpdates.comments = merged.comments;
    if (merged.eqHours !== undefined) dbUpdates.eq_hours = merged.eqHours;
    const { error } = await supabase.from('visits').update(dbUpdates).eq('id', visitId);
    if (error) console.error('Failed to edit visit:', error);
    const contract = contracts.find(c => c.id === contractId);
    logActivity('visit_edited', contractId, contract?.customer, { visitId, changes: Object.keys(dbUpdates) });
  }

  function getVisitedHours(contractId) {
    return (visits[contractId] || []).reduce((s, v) => s + v.actualHours, 0);
  }

  // Compute current total open 2026 hours across all contracts
  function compute2026Total() {
    return contracts.reduce(function(s, c) {
      const rem = getRemainingHours(c, getVisitedHours(c.id));
      return s + (rem[2024] || 0) + (rem[2025] || 0) + (rem[2026] || 0);
    }, 0);
  }

  // Data loading is now handled by the Supabase useEffect above

  async function saveCustomerHistory(updated) {
    setCustomerHistory(updated);
    // Persist to Supabase
    try {
      for (const [customerNo, years] of Object.entries(updated)) {
        for (const [year, data] of Object.entries(years)) {
          await supabase.from('customer_history').upsert({
            customer_no: customerNo,
            division: division,
            year: parseInt(year),
            hrs: data.hrs || 0,
            rev: data.rev || 0,
          }, { onConflict: 'customer_no,division,year' });
        }
      }
    } catch(e) { console.error('Failed to save customer history:', e); }
  }

  async function saveSnapshot(key, value) {
    setMonthlySnapshots(function(prev) { return { ...prev, [key]: value }; });
    // Persist to Supabase
    try {
      await supabase.from('monthly_snapshots').upsert({
        division: division,
        year_month: key,
        revenue: value,
      }, { onConflict: 'division,year_month' });
    } catch(e) { console.error('Failed to save snapshot:', e); }
  }

  // ── IPP CRUD ──────────────────────────────────────────────────────────────
  function isoToContractDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return parseInt(m) + "/" + parseInt(d) + "/" + String(parseInt(y)).slice(2);
  }

  function syncIppContractFields(sites, startDate, endDate) {
    const extDate = startDate && endDate
      ? isoToContractDate(startDate) + "-" + isoToContractDate(endDate)
      : null;
    sites.forEach(function(site) {
      const totalHours = Object.values(site.visitTasks || {}).reduce(function(sum, tasks) {
        return sum + tasks.reduce(function(s, t) { return s + (parseFloat(t.hours) || 0); }, 0);
      }, 0);

      const isKna = [...knaContracts].find(x => x.id === site.contractId);
      const existingContract = isKna
        ? knaContracts.find(c => c.id === site.contractId)
        : kcanContracts.find(c => c.id === site.contractId);
      const hourlyRate = (existingContract && existingContract.hourlyRate) || 175;

      const updates = { suggestedVisits: site.visitCount };
      if (extDate) updates.extensionDate = extDate;
      if (totalHours > 0) {
        updates.contractedHours = totalHours;
        updates.contractAmount = totalHours * hourlyRate;
        const yearAlloc = allocateHoursByYear(extDate || (existingContract && existingContract.extensionDate) || "", totalHours, site.visitCount);
        Object.assign(updates, yearAlloc);
      }
      if (existingContract) {
        const currentTeam = (existingContract.team || "").split(", ").filter(Boolean);
        if (!currentTeam.includes("IPP")) {
          updates.team = [...currentTeam, "IPP"].join(", ");
        }
      }

      if (isKna) {
        setKnaContracts(prev => prev.map(c => c.id === site.contractId ? { ...c, ...updates } : c));
      } else {
        setKcanContracts(prev => prev.map(c => c.id === site.contractId ? { ...c, ...updates } : c));
      }
    });
  }

  async function addIppProgram(program) {
    const { data, error } = await supabase.from('ipp_programs').insert({
      name: program.name,
      group_name: program.group,
      start_date: program.startDate || '',
      end_date: program.endDate || '',
      sites: program.sites || [],
    }).select().single();
    if (error) { console.error('Failed to add IPP program:', error); return null; }
    const newProg = { id: data.id, name: data.name, group: data.group_name, startDate: data.start_date, endDate: data.end_date, sites: data.sites || [] };
    setIppPrograms(prev => [...prev, newProg]);
    syncIppContractFields(newProg.sites, newProg.startDate, newProg.endDate);
    logActivity('ipp_created', null, null, { programName: newProg.name, group: newProg.group, sites: (newProg.sites || []).length });
    return newProg.id;
  }

  async function updateIppProgram(programId, updates) {
    setIppPrograms(prev => prev.map(p => p.id === programId ? { ...p, ...updates } : p));
    const prog = { ...(ippPrograms.find(p => p.id === programId) || {}), ...updates };
    if (updates.sites || updates.startDate || updates.endDate) {
      syncIppContractFields(prog.sites || [], prog.startDate, prog.endDate);
    }
    // Persist to Supabase
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.group !== undefined) dbUpdates.group_name = updates.group;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.sites !== undefined) dbUpdates.sites = updates.sites;
    dbUpdates.updated_at = new Date().toISOString();
    const { error } = await supabase.from('ipp_programs').update(dbUpdates).eq('id', programId);
    if (error) console.error('Failed to update IPP program:', error);
    logActivity('ipp_updated', null, null, { programName: prog.name, changes: Object.keys(updates) });
  }

  function deleteIppProgram(programId) {
    const prog = ippPrograms.find(p => p.id === programId);
    if (prog) {
      prog.sites.forEach(function(site) {
        const stillInOther = ippPrograms.some(p => p.id !== programId && (p.sites || []).some(s => s.contractId === site.contractId && s._division === site._division));
        if (!stillInOther) {
          const removeIppTag = function(ctrcts) {
            return ctrcts.map(c => {
              if (c.id !== site.contractId) return c;
              const team = (c.team || "").split(", ").filter(t => t !== "IPP").join(", ");
              return { ...c, team };
            });
          };
          if (site._division === "KNA") setKnaContracts(removeIppTag);
          else setKcanContracts(removeIppTag);
        }
      });
    }
    setIppPrograms(prev => prev.filter(p => p.id !== programId));
    // Persist to Supabase
    supabase.from('ipp_programs').delete().eq('id', programId).then(({ error }) => {
      if (error) console.error('Failed to delete IPP program:', error);
    });
    logActivity('ipp_deleted', null, null, { programName: prog?.name, group: prog?.group });
  }

  function recordIppTaskCompletion(programId, contractId, visitNo, taskId, visitDate, techName) {
    setIppPrograms(prev => {
      const updated = prev.map(function(p) {
        if (p.id !== programId) return p;
        return {
          ...p,
          sites: p.sites.map(function(site) {
            if (site.contractId !== contractId) return site;
            const visitTasks = site.visitTasks || {};
            const tasks = visitTasks[visitNo] || [];
            return {
              ...site,
              visitTasks: {
                ...visitTasks,
                [visitNo]: tasks.map(function(t) {
                  if (t.id !== taskId) return t;
                  const completions = t.completions || [];
                  return { ...t, completions: [...completions, { visitNo, date: visitDate, techs: techName, completedAt: new Date().toISOString() }] };
                })
              }
            };
          })
        };
      });
      // Persist sites JSON to Supabase
      const prog = updated.find(p => p.id === programId);
      if (prog) {
        supabase.from('ipp_programs').update({ sites: prog.sites, updated_at: new Date().toISOString() }).eq('id', programId);
      }
      return updated;
    });
  }

  function revertIppTaskCompletion(programId, contractId, visitNo, taskId) {
    setIppPrograms(prev => {
      const updated = prev.map(function(p) {
        if (p.id !== programId) return p;
        return {
          ...p,
          sites: p.sites.map(function(site) {
            if (site.contractId !== contractId) return site;
            const visitTasks = site.visitTasks || {};
            const tasks = visitTasks[visitNo] || [];
            return {
              ...site,
              visitTasks: {
                ...visitTasks,
                [visitNo]: tasks.map(function(t) {
                  if (t.id !== taskId) return t;
                  const completions = (t.completions || []);
                  return { ...t, completions: completions.filter((_,i) => i !== completions.length - 1) };
                })
              }
            };
          })
        };
      });
      const prog = updated.find(p => p.id === programId);
      if (prog) {
        supabase.from('ipp_programs').update({ sites: prog.sites, updated_at: new Date().toISOString() }).eq('id', programId);
      }
      return updated;
    });
  }

  function getContractIpp(contractId) {
    for (const prog of ippPrograms) {
      const site = (prog.sites || []).find(s => s.contractId === contractId);
      if (site) return { program: prog, site };
    }
    return null;
  }

  function addExtraEqType(name) { setExtraEqTypes(prev => prev.includes(name) ? prev : [...prev, name]); }
  function addExtraGroup(name) { setExtraGroups(prev => prev.includes(name) ? prev : [...prev, name]); }
  const allCorporateGroups = [...CORPORATE_GROUPS, ...extraGroups.filter(g => !CORPORATE_GROUPS.includes(g))];
  function handleGroupSelect(value, setter) {
    if (value === "__add__") {
      const name = prompt("Enter new corporate group name:");
      if (name && name.trim()) {
        const trimmed = name.trim();
        addExtraGroup(trimmed);
        setter(trimmed);
      }
    } else {
      setter(value);
    }
  }

  function applyScheduleOverride(contractId, visitNo, ym) {
    const key = contractId + "_" + visitNo;
    const contract = [...knaContracts, ...kcanContracts].find(c => c.id === contractId);
    setScheduleOverrides(prev => {
      const updated = { ...prev, [key]: ym };
      supabase.from('app_settings').upsert({
        division,
        key: 'schedule_overrides',
        value: updated,
      }, { onConflict: 'division,key' }).then(({ error }) => {
        if (error) console.error('Failed to save schedule overrides:', error);
      });
      return updated;
    });
    logActivity('visit_rescheduled', contractId, contract?.customer, { visitNo, movedTo: ym, division });
  }

  function getOverridesForContract(contractId) {
    const result = {};
    Object.entries(scheduleOverrides).forEach(([k, ym]) => {
      const [cid, vno] = k.split("_");
      if (cid === String(contractId)) result[parseInt(vno)] = ym;
    });
    return result;
  }

  function toggleWORow(id) { setExpandedWORows(p => ({ ...p, [id]: !p[id] })); }

  // Open renewal modal pre-filled with suggested next term
  function openRenewalModal(c) {
    const nextExt = suggestNextTerm(c.extensionDate);
    const nextYears = getNextTermYears(nextExt);
    const hoursDefaults = allocateHoursByYear(nextExt, c.contractedHours || 0, c.suggestedVisits);
    setRenewForm({
      extensionDate: nextExt,
      contractedHours: c.contractedHours || 0,
      hourlyRate: c.hourlyRate || 0,
      suggestedVisits: c.suggestedVisits || "",
      salesman: c.salesman || "",
      notes: c.notes || "",
      autoRenew: c.autoRenew || false,
      partsDiscount: c.partsDiscount || "",
      laborDiscount: c.laborDiscount || "",
      premiumBilling: c.premiumBilling || "",
      ...hoursDefaults,
    });
    setRenewalContract(c);
  }

  // Commit renewal: archive current term, apply new term fields
  async function commitRenewal() {
    if (!renewalContract) return;
    const c = renewalContract;
    const historyEntry = {
      extensionDate: c.extensionDate,
      contractedHours: c.contractedHours,
      hourlyRate: c.hourlyRate,
      suggestedVisits: c.suggestedVisits,
      renewedAt: new Date().toISOString().slice(0, 10),
    };
    const newTermDates = parseContractDates(renewForm.extensionDate);
    const termStartDate = newTermDates ? newTermDates.start.toISOString().slice(0, 10) : "";
    const updated = {
      ...c,
      ...renewForm,
      contractAmount: (parseFloat(renewForm.contractedHours) || 0) * (parseFloat(renewForm.hourlyRate) || 0),
      monthlyRevenue: 0,
      termStartDate,
      renewalHistory: [...(c.renewalHistory || []), historyEntry],
      ippTasks: c.ippTasks || [],
    };
    const isKna = knaContracts.find(x => x.id === c.id);
    if (isKna) {
      setKnaContracts(prev => prev.map(x => x.id === updated.id ? updated : x));
    } else {
      setKcanContracts(prev => prev.map(x => x.id === updated.id ? updated : x));
    }
    if (selectedContract && selectedContract.id === updated.id) setSelectedContract(updated);
    setRenewalContract(null);
    setRenewForm({});
    // Persist to Supabase
    const { error } = await supabase.from('contracts').update(mapContractToDb(updated)).eq('id', updated.id);
    if (error) console.error('Failed to persist renewal:', error);
    logActivity('contract_renewed', updated.id, updated.customer, { newTerm: renewForm.extensionDate, hours: renewForm.contractedHours, rate: renewForm.hourlyRate });
  }

  async function archiveContract(id) {
    const isKna = knaContracts.find(x => x.id === id);
    const updater = prev => prev.map(c => c.id === id ? { ...c, status: "archived" } : c);
    if (isKna) setKnaContracts(updater); else setKcanContracts(updater);
    if (selectedContract && selectedContract.id === id) setSelectedContract(prev => ({ ...prev, status: "archived" }));
    // Persist to Supabase
    const { error } = await supabase.from('contracts').update({ status: 'archived' }).eq('id', id);
    if (error) console.error('Failed to archive contract:', error);
    const contract = [...knaContracts, ...kcanContracts].find(c => c.id === id);
    logActivity('contract_archived', id, contract?.customer, { division });
  }

  function reactivateContract(c) {
    openRenewalModal({ ...c, status: "active" });
  }

  // ── Work Order CRUD ──────────────────────────────────────────────────────────
  async function addWorkOrder(contractId, wo) {
    const { data, error } = await supabase.from('work_orders').insert({
      contract_id: contractId,
      title: wo.title,
      description: wo.description || '',
      serial_number: wo.serialNumber || '',
      estimated_hours: wo.estimatedHours || null,
      status: 'scheduled',
      linked_visit_no: wo.linkedVisitNo || null,
    }).select().single();
    if (error) { console.error('Failed to add work order:', error); return; }
    const mapped = { id: data.id, contractId: data.contract_id, title: data.title, description: data.description || '', serialNumber: data.serial_number || '', estimatedHours: data.estimated_hours, actualHours: data.actual_hours, status: data.status, linkedVisitNo: data.linked_visit_no, completedAt: data.completed_at || '', scheduledDate: '', createdAt: data.created_at };
    setWorkOrders(prev => ({ ...prev, [contractId]: [...(prev[contractId] || []), mapped] }));
  }
  async function updateWorkOrder(contractId, woId, changes) {
    setWorkOrders(prev => ({ ...prev, [contractId]: (prev[contractId] || []).map(w => w.id === woId ? { ...w, ...changes } : w) }));
    const dbChanges = {};
    if (changes.title !== undefined) dbChanges.title = changes.title;
    if (changes.description !== undefined) dbChanges.description = changes.description;
    if (changes.serialNumber !== undefined) dbChanges.serial_number = changes.serialNumber;
    if (changes.estimatedHours !== undefined) dbChanges.estimated_hours = changes.estimatedHours;
    if (changes.linkedVisitNo !== undefined) dbChanges.linked_visit_no = changes.linkedVisitNo;
    if (changes.scheduledDate !== undefined) dbChanges.completed_at = changes.scheduledDate; // scheduledDate stored in completed_at for now
    if (changes.status !== undefined) dbChanges.status = changes.status;
    const { error } = await supabase.from('work_orders').update(dbChanges).eq('id', woId);
    if (error) console.error('Failed to update work order:', error);
  }
  async function deleteWorkOrder(contractId, woId) {
    setWorkOrders(prev => ({ ...prev, [contractId]: (prev[contractId] || []).filter(w => w.id !== woId) }));
    const { error } = await supabase.from('work_orders').delete().eq('id', woId);
    if (error) console.error('Failed to delete work order:', error);
  }
  async function completeWorkOrder(contractId, woId, actualHours) {
    const completedAt = new Date().toISOString().slice(0, 10);
    setWorkOrders(prev => ({ ...prev, [contractId]: (prev[contractId] || []).map(w => w.id === woId ? { ...w, status: "complete", actualHours, completedAt } : w) }));
    const { error } = await supabase.from('work_orders').update({ status: 'complete', actual_hours: actualHours, completed_at: completedAt }).eq('id', woId);
    if (error) console.error('Failed to complete work order:', error);
  }
  async function revertWorkOrder(contractId, woId) {
    setWorkOrders(prev => ({ ...prev, [contractId]: (prev[contractId] || []).map(w => w.id === woId ? { ...w, status: "scheduled", actualHours: undefined, completedAt: undefined } : w) }));
    const { error } = await supabase.from('work_orders').update({ status: 'scheduled', actual_hours: null, completed_at: null }).eq('id', woId);
    if (error) console.error('Failed to revert work order:', error);
  }

  function getLastVisitDate(contractId) {
    const vs = visits[contractId] || [];
    if (vs.length === 0) return null;
    const sorted = [...vs].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return sorted[0].date || null;
  }

  function getVisitedDollars(contractId) {
    return (visits[contractId] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
  }

  // Auto-capture current month snapshot if not yet stored
  useEffect(() => {
    if (dataLoading || !user || !tokenReady) return;
    const now = new Date();
    const key = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    if (key.startsWith("2026") && !monthlySnapshots[key]) {
      saveSnapshot(key, compute2026Total());
    }
  }, [dataLoading, user, tokenReady, division]);


  function startEdit(c) {
    setEditingId(c.id);
    setEditForm({ ...c });
  }

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span style={{ opacity: 0.3 }}>~</span>;
    return <span>{sortDir === "asc" ? "^" : "v"}</span>;
  };

  const owedContracts = contracts.filter(c => getOwedAfterVisits(c, getVisitedHours(c.id)) > 0);
  const totalOwedHours = owedContracts.reduce((s, c) => s + getOwedAfterVisits(c, getVisitedHours(c.id)), 0);
  const totalMonthly = contracts.reduce((s, c) => s + getMonthlyRevenue(c), 0);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ color: '#64748b', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', fontFamily: "'Barlow Condensed', sans-serif" }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '40px 48px', width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.1em' }}>KANNEGIESSER</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, letterSpacing: '0.08em', marginBottom: 32 }}>SERVICE CONTRACTS</div>
          <SignInButton />
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: '#64748b', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.1em' }}>LOADING...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: "#f4f6f9", minHeight: "100vh", color: "#1a2235" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f6f9; }
        .mono { font-family: 'Space Mono', monospace; }
        .cond { font-family: 'Barlow Condensed', sans-serif; }
        input, select { background: #fff; border: 1px solid #cbd5e1; color: #1a2235; padding: 6px 10px; border-radius: 3px; font-family: 'Space Mono', monospace; font-size: 12px; }
        input:focus, select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
        button { cursor: pointer; font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f4f6f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .row-owed { background: rgba(239,68,68,0.06) !important; }
        .row-owed:hover { background: rgba(239,68,68,0.12) !important; }
        tr:hover td { background: rgba(37,99,235,0.03); }
        .pill { display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .pill-w1 { background: rgba(37,99,235,0.1); color: #2563eb; border: 1px solid rgba(37,99,235,0.25); }
        .pill-w2 { background: rgba(124,58,237,0.1); color: #7c3aed; border: 1px solid rgba(124,58,237,0.25); }
        .pill-w3 { background: rgba(217,119,6,0.1); color: #d97706; border: 1px solid rgba(217,119,6,0.25); }
        .pill-log { background: rgba(5,150,105,0.1); color: #059669; border: 1px solid rgba(5,150,105,0.25); }
        .pill-pp { background: rgba(236,72,153,0.1); color: #db2777; border: 1px solid rgba(236,72,153,0.25); }
        .pill-dry { background: rgba(249,115,22,0.1); color: #ea580c; border: 1px solid rgba(249,115,22,0.25); }
        .pill-insp { background: rgba(20,184,166,0.1); color: #0d9488; border: 1px solid rgba(20,184,166,0.25); }
        .pill-ipp { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.25); }
        .pill-irn { background: rgba(6,182,212,0.1); color: #0891b2; border: 1px solid rgba(6,182,212,0.25); }
        .pill-group { background: rgba(99,102,241,0.08); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
        .pill-billable { background: rgba(217,119,6,0.1); color: #d97706; border: 1px solid rgba(217,119,6,0.2); }
        .pill-allinclusive { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 20px 24px; position: relative; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent); }
        .nav-btn { background: transparent; border: none; color: #64748b; padding: 10px 20px; font-size: 13px; letter-spacing: 0.08em; transition: color 0.2s; }
        .nav-btn:hover { color: #1a2235; }
        .nav-btn.active { color: #2563eb; border-bottom: 2px solid #2563eb; }
        th { background: #f8fafc !important; color: #64748b; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; padding: 10px 12px; white-space: nowrap; cursor: pointer; user-select: none; border-bottom: 1px solid #e2e8f0; }
        th:hover { color: #1a2235; }
        td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
        .btn-primary { background: #2563eb; border: 1px solid #1d4ed8; color: #fff; padding: 8px 16px; border-radius: 3px; font-size: 12px; letter-spacing: 0.05em; transition: all 0.15s; }
        .btn-primary:hover { background: #1d4ed8; border-color: #1e40af; }
        .btn-danger { background: transparent; border: 1px solid #fca5a5; color: #dc2626; padding: 4px 10px; border-radius: 3px; font-size: 11px; transition: all 0.15s; }
        .btn-danger:hover { background: #fef2f2; border-color: #dc2626; }
        .btn-sm { background: transparent; border: 1px solid #cbd5e1; color: #64748b; padding: 4px 10px; border-radius: 3px; font-size: 11px; transition: all 0.15s; }
        .btn-sm:hover { border-color: #2563eb; color: #2563eb; }
        .owed-badge { background: rgba(220,38,38,0.1); color: #dc2626; border: 1px solid rgba(220,38,38,0.3); padding: 2px 8px; border-radius: 2px; font-size: 11px; font-weight: 700; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 50; display: flex; align-items: center; justify-content: center; }
        .modal { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 28px; width: 680px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-field label { display: block; font-size: 10px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
        .form-field input, .form-field select { width: 100%; }
        input[type="date"] { cursor: pointer; width: 100%; box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .hours-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 4px; }
        .slide-panel { position: fixed; top: 0; right: 0; height: 100vh; width: 520px; max-width: 95vw; background: #fff; box-shadow: -4px 0 32px rgba(0,0,0,0.12); z-index: 100; display: flex; flex-direction: column; border-left: 1px solid #e2e8f0; }
        .slide-panel-header { padding: 24px 28px 20px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
        .slide-panel-body { flex: 1; overflow-y: auto; padding: 24px 28px; }
        .visit-row { display: grid; grid-template-columns: 32px 90px 60px 1fr 80px; gap: 8px; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
        .visit-row:last-child { border-bottom: none; }
        .visit-input-row { display: grid; grid-template-columns: 110px 70px 1fr 110px 36px; gap: 8px; align-items: end; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; }
        .progress-bar-track { background: #f1f5f9; border-radius: 4px; height: 8px; overflow: hidden; }
        .progress-bar-fill { height: 8px; border-radius: 4px; transition: width 0.3s; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #e2e8f0", padding: "0 32px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="cond" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.05em", color: "#0f172a" }}>
                {division} SERVICE CONTRACTS
              </div>
              {/* Division Toggle */}
              <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 4, padding: 3, gap: 2 }}>
                {["KNA", "KCAN"].map(div => (
                  <button key={div} onClick={() => { setDivision(div); setView("dashboard"); setSearch(""); setTeamFilter("All"); setGroupFilter("All"); setOwedOnly(false); setEditingId(null); setSelectedContract(null); }}
                    style={{ padding: "4px 14px", borderRadius: 3, border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", background: division === div ? "#fff" : "transparent", color: division === div ? "#2563eb" : "#94a3b8", boxShadow: division === div ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
                    {div}
                  </button>
                ))}
              </div>
              <button onClick={logout} style={{ fontSize: 11, padding: '5px 12px', background: 'none', border: '1px solid #cbd5e1', borderRadius: 4, color: '#64748b', cursor: 'pointer', letterSpacing: '0.06em' }}>Sign Out</button>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "#2563eb", letterSpacing: "0.2em", marginTop: 2 }}>
              {division === "KCAN" ? "If it's measured, it's managed, eh." : "If it's measured, it's managed."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div className="cond" style={{ fontSize: 22, fontWeight: 600, color: "#7c3aed" }}>
                {[...knaContracts, ...kcanContracts].reduce((s, c) => s + (c.contractedHours || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>ANNUAL CONTRACT HRS</div>
              <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.05em" }}>KNA + KCAN</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="cond" style={{ fontSize: 22, fontWeight: 600, color: "#0891b2" }}>
                ${Math.round([...knaContracts, ...kcanContracts].reduce((s, c) => s + (c.contractAmount || 0), 0)).toLocaleString("en-US")}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>TOTAL REVENUE</div>
              <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.05em" }}>KNA + KCAN</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {[
            { id: "dashboard", label: "DASHBOARD" },
            { id: "contracts", label: "ALL CONTRACTS" },
            { id: "schedule",  label: "VISIT SCHEDULE" },
            { id: "renewals",  label: "RENEWALS" },
            { id: "ipp",       label: "IPP" },
            { id: "activity",  label: "ACTIVITY" },
          ].map(tab => (
            <button key={tab.id} className={`nav-btn ${view === tab.id ? "active" : ""}`}
              onClick={() => setView(tab.id)}
              style={{ fontSize: 12, letterSpacing: "0.12em" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Contracts", value: contracts.length, accent: "#2563eb" },
                { label: "Annual Contract Hours", value: contracts.reduce((s, c) => s + (c.contractedHours || 0), 0).toLocaleString(), accent: "#7c3aed" },
                { label: "Total Revenue", value: "$" + Math.round(contracts.reduce((s, c) => s + (c.contractAmount || 0), 0)).toLocaleString("en-US"), accent: "#0891b2" },
                { label: "Monthly Revenue", value: "$" + Math.round(totalMonthly).toLocaleString("en-US"), accent: "#059669" },
                { label: "Hours Owed (Prior)", value: totalOwedHours.toLocaleString(), accent: "#dc2626" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ "--accent": s.accent }}>
                  <div className="cond" style={{ fontSize: 44, fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* KNA vs KCAN Comparison */}
            {knaContracts.length > 0 && kcanContracts.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 20px", marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b", marginBottom: 12 }}>KNA vs KCAN COMPARISON</div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 0 }}>
                  <div />
                  {["KNA", "KCAN"].map(div => (
                    <div key={div} style={{ textAlign: "center", paddingBottom: 6, borderBottom: "2px solid " + (div === "KNA" ? "#2563eb" : "#7c3aed"), marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: div === "KNA" ? "#2563eb" : "#7c3aed", letterSpacing: "0.1em" }}>{div}</span>
                    </div>
                  ))}
                  {[
                    { label: "Contracts", kna: knaContracts.length, kcan: kcanContracts.length },
                    { label: "Annual Hrs", kna: knaContracts.reduce((s,c)=>s+(c.contractedHours||0),0).toLocaleString(), kcan: kcanContracts.reduce((s,c)=>s+(c.contractedHours||0),0).toLocaleString() },
                    { label: "Monthly Rev", kna: "$"+Math.round(knaContracts.reduce((s,c)=>s+getMonthlyRevenue(c),0)).toLocaleString("en-US"), kcan: "$"+Math.round(kcanContracts.reduce((s,c)=>s+getMonthlyRevenue(c),0)).toLocaleString("en-US") },
                    { label: "Hours Owed", kna: knaContracts.reduce((s,c)=>s+getOwedAfterVisits(c,(knaVisits[c.id]||[]).reduce((sv,v)=>sv+v.actualHours,0)),0).toLocaleString(), kcan: kcanContracts.reduce((s,c)=>s+getOwedAfterVisits(c,(kcanVisits[c.id]||[]).reduce((sv,v)=>sv+v.actualHours,0)),0).toLocaleString() },
                    { label: "Total Revenue", kna: "$"+Math.round(knaContracts.reduce((s,c)=>s+(c.contractAmount||0),0)).toLocaleString("en-US"), kcan: "$"+Math.round(kcanContracts.reduce((s,c)=>s+(c.contractAmount||0),0)).toLocaleString("en-US") },
                  ].map(function(row) {
                    return [
                      <div key={row.label+"l"} style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", paddingBottom: 6 }}>{row.label}</div>,
                      <div key={row.label+"kna"} style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: division==="KNA" ? "#2563eb" : "#1a2235", paddingBottom: 6, cursor: "pointer" }} onClick={()=>setDivision("KNA")}>{row.kna}</div>,
                      <div key={row.label+"kcan"} style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: division==="KCAN" ? "#7c3aed" : "#1a2235", paddingBottom: 6, cursor: "pointer" }} onClick={()=>setDivision("KCAN")}>{row.kcan}</div>,
                    ];
                  })}
                </div>
                <div style={{ fontSize: 9, color: "#cbd5e1", marginTop: 6 }}>Click a value to switch to that division.</div>
              </div>
            )}

            {/* Team breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b", marginBottom: 10 }}>CONTRACTS BY EQUIPMENT TYPE</div>
                {Object.entries(teamCounts).map(([team, count]) => {
                  const pct = Math.round((count / contracts.length) * 100);
                  const colorMap = { W1: "#2563eb", W2: "#7c3aed", W3: "#d97706", Log: "#059669" };
                  const color = colorMap[team] || "#64748b";
                  const teamHours = contracts.filter(c => c.team.split(", ").includes(team)).reduce((s, c) => {
                    const rem = getRemainingHours(c, getVisitedHours(c.id));
                    return s + YEARS.reduce((ys, y) => ys + (rem[y] || 0), 0);
                  }, 0);
                  return (
                    <div key={team} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#1a2235", fontWeight: 500 }}>{team}</span>
                        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{count} contracts . {fmtHrs(teamHours)} hrs remaining</span>
                      </div>
                      <div style={{ height: 4, background: "#f1f5f9", borderRadius: 3 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b", marginBottom: 10 }}>HOURS BY YEAR</div>
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const yearTotals = YEARS.map(y => ({
                    y,
                    hrs: contracts.reduce((s, c) => {
                      const rem = getRemainingHours(c, getVisitedHours(c.id));
                      return s + (rem[y] || 0);
                    }, 0),
                  }));
                  const maxHrs = Math.max(...yearTotals.map(d => d.hrs), 1);
                  return yearTotals.map(({ y, hrs }) => {
                    const pct = Math.round((hrs / maxHrs) * 100);
                    const isOwed = y < currentYear;
                    const isCurrent = y === currentYear;
                    const color = isOwed ? "#dc2626" : isCurrent ? "#059669" : "#2563eb";
                    return (
                      <div key={y} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color, fontWeight: 500 }}>{y}{isOwed ? " !" : isCurrent ? " *" : ""}</span>
                          <span style={{ fontSize: 12, color, fontWeight: 600 }}>{fmtHrs(hrs)} hrs remaining</span>
                        </div>
                        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 3 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* YoY + Open Hours / Monthly / Quarterly — 2x2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* YoY line chart with open hours inline */}
            {(() => {
              const now = new Date();
              const currentYear = now.getFullYear();
              const live2026 = contracts.reduce((s, c) => s + (c.contractedHours || 0), 0);

              const yoyHistorical = division === "KCAN"
                ? { 2024: 520, 2025: 1870 }
                : { 2024: 7118, 2025: 8578 };
              const future2027 = contracts.reduce((s, c) => s + (c.hours2027 || 0), 0);
              const future2028 = contracts.reduce((s, c) => s + (c.hours2028 || 0), 0);

              const yoyData = [
                { year: "2024", hours: yoyHistorical[2024], isHistorical: true },
                { year: "2025", hours: yoyHistorical[2025], isHistorical: true },
                { year: "2026", hours: live2026, isHistorical: false, isLive: true },
              ];
              if (future2027 > 0) yoyData.push({ year: "2027", hours: future2027, isHistorical: false });
              if (future2028 > 0) yoyData.push({ year: "2028", hours: future2028, isHistorical: false });

              const allHours = yoyData.map(d => d.hours);
              const dataMin = Math.min(...allHours);
              const dataMax = Math.max(...allHours);
              const range = dataMax - dataMin || 1000;
              const yMin = Math.max(0, Math.floor((dataMin - range * 0.3) / 500) * 500);
              const yMax = Math.ceil((dataMax + range * 0.15) / 500) * 500;
              const yRange = yMax - yMin;
              const gridLines = [0, 1, 2, 3].map(i => yMin + Math.round((yRange / 3) * i));

              const cH = 100; const cW = 340; const pL = 44; const pB = 22; const pT = 10; const pR = 8;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const dataPad = 20; // inset data points so labels don't overlap y-axis
              const pts = yoyData.map((d, i) => ({
                x: pL + dataPad + (i / (yoyData.length - 1)) * (iW - dataPad * 2),
                y: pT + iH - ((d.hours - yMin) / yRange) * iH,
                ...d,
              }));
              const polyline = pts.map(p => p.x + "," + p.y).join(" ");
              const totalOpen = contracts.reduce(function(s, c) { const r = getRemainingHours(c, getVisitedHours(c.id)); return s + YEARS.reduce((ys, y) => ys + (r[y] || 0), 0); }, 0);
              const openCount = contracts.filter(c => { const r = getRemainingHours(c, getVisitedHours(c.id)); return YEARS.some(y => (r[y] || 0) > 0); }).length;
              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>CONTRACTED HOURS YoY</div>
                    <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>{totalOpen.toLocaleString()} <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 400 }}>open hrs ({openCount})</span></div>
                  </div>
                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible" }}>
                    {gridLines.map(function(val) {
                      const gy = pT + iH - ((val - yMin) / yRange) * iH;
                      return (
                        <g key={val}>
                          <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                          <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{val.toLocaleString()}</text>
                        </g>
                      );
                    })}
                    <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points={polyline + " " + pts[pts.length-1].x + "," + (pT + iH) + " " + pts[0].x + "," + (pT + iH)} fill="rgba(37,99,235,0.06)" />
                    <polyline points={polyline} fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                    {pts.map(function(p) {
                      return (
                        <g key={p.year}>
                          <circle cx={p.x} cy={p.y} r="3" fill={p.isLive ? "#059669" : "#2563eb"} stroke="#fff" strokeWidth="1.5" />
                          {p.isLive && <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="#059669" strokeWidth="1" opacity="0.4" />}
                          <text x={p.x} y={pT + iH + 14} textAnchor="middle" fontSize="8" fill={p.isLive ? "#059669" : "#64748b"}>{p.year}{p.isLive ? "*" : ""}</text>
                          {p.hours > 0 && <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="7" fill={p.isLive ? "#059669" : "#2563eb"} fontWeight="700">{p.hours.toLocaleString()}</text>}
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>* 2026 = live total. Final value locked Jan 1, 2027.</div>
                </div>
              );
            })()}

            {/* Monthly open hours bar chart */}
            {(() => {
              const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentMonth = now.getMonth() + 1;
              const currentKey = currentYear + "-" + String(currentMonth).padStart(2, "0");
              const monthlyData = MONTHS.map(function(label, idx) {
                const monthNum = idx + 1;
                const key = "2026-" + String(monthNum).padStart(2, "0");
                const isFuture = currentYear < 2026 || (currentYear === 2026 && monthNum > currentMonth) || currentYear > 2026;
                const isCurrentMonth = key === currentKey;
                const snapshot = monthlySnapshots[key];
                return { label: label, key: key, total: snapshot !== undefined ? snapshot : null, isFuture: isFuture && !isCurrentMonth, isCurrentMonth: isCurrentMonth };
              });
              const maxBar = Math.max(...monthlyData.map(d => d.total || 0), 1);
              const cW = 340; const cH = 100; const pL = 36; const pB = 22; const pT = 8; const pR = 6;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const barW = Math.floor(iW / 12) - 3;
              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="cond" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b", marginBottom: 6 }}>OPEN HOURS BY MONTH (2026)</div>
                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible" }}>
                    {[0, 0.5, 1].map(function(frac) {
                      const gy = pT + iH - frac * iH;
                      return (
                        <g key={frac}>
                          <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                          <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{Math.round(maxBar * frac).toLocaleString()}</text>
                        </g>
                      );
                    })}
                    <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />
                    {monthlyData.map(function(d, i) {
                      const slotW = iW / 12;
                      const bx = pL + i * slotW + (slotW - barW) / 2;
                      const hasData = d.total !== null;
                      const bh = hasData && maxBar > 0 ? Math.max((d.total / maxBar) * iH, d.total > 0 ? 2 : 0) : 0;
                      const by = pT + iH - bh;
                      const color = d.isCurrentMonth ? "#1d4ed8" : "#2563eb";
                      return (
                        <g key={d.label}>
                          {hasData && bh > 0 && <rect x={bx} y={by} width={barW} height={bh} rx="2" fill={color} opacity="0.85" />}
                          {hasData && bh > 12 && <text x={bx + barW / 2} y={by + 8} textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">{Math.round(d.total).toLocaleString()}</text>}
                          {!hasData && !d.isFuture && <text x={bx + barW / 2} y={pT + iH - 4} textAnchor="middle" fontSize="7" fill="#cbd5e1">-</text>}
                          <text x={bx + barW / 2} y={pT + iH + 14} textAnchor="middle" fontSize="8" fill={d.isCurrentMonth ? "#2563eb" : "#64748b"} fontWeight={d.isCurrentMonth ? "700" : "400"}>{d.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 2 }}>Auto-captured on the 1st of each month</div>
                </div>
              );
            })()}

            {/* Quarterly Hours Chart */}
            {(() => {
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentMonth = now.getMonth() + 1; // 1-12
              const currentQ = Math.ceil(currentMonth / 3); // 1-4

              // Build next 4 quarters starting from current
              const quarters = [];
              for (let i = 0; i < 4; i++) {
                let q = currentQ + i;
                let y = currentYear;
                while (q > 4) { q -= 4; y++; }
                const startMonth = (q - 1) * 3 + 1;
                const endMonth = q * 3;
                quarters.push({ label: "Q" + q + " " + y, q, y, startMonth, endMonth });
              }

              // For each contract, distribute remaining hours into quarters
              // Overdue hours (from years before current year) go straight into current quarter (qi=0)
              const qTotals = quarters.map(() => 0);

              contracts.forEach(function(c) {
                const visitedHrs = getVisitedHours(c.id);
                const rem = getRemainingHours(c, visitedHrs);

                YEARS.forEach(function(y) {
                  const hrsThisYear = rem[y] || 0;
                  if (hrsThisYear <= 0) return;

                  // Overdue: year already passed -- dump entirely into current quarter
                  if (y < currentYear) {
                    qTotals[0] += hrsThisYear;
                    return;
                  }

                  // Current or future year: distribute proportionally by contract active months
                  let startM = 1, endM = 12;
                  if (c.extensionDate) {
                    const parts = c.extensionDate.split("-");
                    const sm = parts[0] && parts[0].trim().match(/^(\d+)\/\d+\/(\d+)$/);
                    const em = parts[1] && parts[1].trim().match(/^(\d+)\/\d+\/(\d+)$/);
                    if (sm && parseInt(sm[2]) + 2000 === y) startM = parseInt(sm[1]);
                    if (em && parseInt(em[2]) + 2000 === y) endM = parseInt(em[1]);
                  }

                  const activeMonths = Math.max(1, endM - startM + 1);
                  const hrsPerMonth = hrsThisYear / activeMonths;

                  quarters.forEach(function(qd, qi) {
                    if (qd.y !== y) return;
                    const overlapStart = Math.max(startM, qd.startMonth);
                    const overlapEnd = Math.min(endM, qd.endMonth);
                    if (overlapEnd >= overlapStart) {
                      qTotals[qi] += hrsPerMonth * (overlapEnd - overlapStart + 1);
                    }
                  });
                });
              });

              const maxQ = Math.max(...qTotals, 1);
              const cW = 280; const cH = 100; const pL = 36; const pB = 24; const pT = 8; const pR = 6;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const barW = Math.floor(iW / 4) - 12;
              const colors = ["#2563eb", "#7c3aed", "#0891b2", "#059669"];

              // Y-axis grid lines
              const gridVals = [0, 0.5, 1].map(f => Math.round(maxQ * f));

              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ marginBottom: 6 }}>
                    <div className="cond" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>REMAINING HOURS — NEXT 4 QUARTERS</div>
                    <div style={{ fontSize: 9, color: "#94a3b8" }}>based on contract dates & visits</div>
                  </div>
                  {(() => {
                    // Calculate how many of Q1's hours are overdue (from prior years)
                    const overdueHrs = contracts.reduce(function(s, c) {
                      const rem = getRemainingHours(c, getVisitedHours(c.id));
                      return s + YEARS.filter(y => y < currentYear).reduce((ys, y) => ys + (rem[y] || 0), 0);
                    }, 0);
                    return overdueHrs > 0 ? (
                      <div style={{ fontSize: 10, color: "#dc2626", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontWeight: 700 }}>{Math.round(overdueHrs)} overdue hrs</span>
                        <span style={{ color: "#94a3b8" }}>from prior years included in {quarters[0].label}</span>
                      </div>
                    ) : null;
                  })()}
                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible" }}>
                    {gridVals.map(function(val) {
                      const gy = pT + iH - (val / maxQ) * iH;
                      return (
                        <g key={val}>
                          <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                          <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{Math.round(val).toLocaleString()}</text>
                        </g>
                      );
                    })}
                    <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />
                    {quarters.map(function(qd, i) {
                      const hrs = qTotals[i];
                      const slotW = iW / 4;
                      const bx = pL + i * slotW + (slotW - barW) / 2;
                      const bh = maxQ > 0 ? Math.max((hrs / maxQ) * iH, hrs > 0 ? 2 : 0) : 0;
                      const by = pT + iH - bh;
                      const isCurrentQ = qd.q === currentQ && qd.y === currentYear;
                      const color = isCurrentQ ? "#dc2626" : colors[i % colors.length];
                      return (
                        <g key={qd.label}>
                          <rect x={bx} y={by} width={barW} height={bh} rx="3" fill={color} opacity={isCurrentQ ? 1 : 0.75} />
                          {bh > 18 && <text x={bx + barW / 2} y={by + 12} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">{Math.round(hrs).toLocaleString()}</text>}
                          {bh <= 18 && hrs > 0 && <text x={bx + barW / 2} y={by - 4} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">{Math.round(hrs).toLocaleString()}</text>}
                          <text x={bx + barW / 2} y={pT + iH + 12} textAnchor="middle" fontSize="9" fill={isCurrentQ ? color : "#64748b"} fontWeight={isCurrentQ ? "700" : "400"}>{qd.label}</text>
                          {isCurrentQ && <text x={bx + barW / 2} y={pT + iH + 22} textAnchor="middle" fontSize="7" fill={color}>incl. overdue</text>}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Logged Hours by Equipment Type */}
            {(() => {
              // Tally visited hours by equipment type from eqHours on each visit
              const allVisitsForDiv = division === "KNA" ? knaVisits : kcanVisits;
              const eqTotals = {};
              Object.values(allVisitsForDiv).forEach(function(contractVisits) {
                (contractVisits || []).forEach(function(v) {
                  if (v.eqHours && typeof v.eqHours === "object") {
                    Object.keys(v.eqHours).forEach(function(t) {
                      eqTotals[t] = (eqTotals[t] || 0) + (v.actualHours || 0);
                    });
                  }
                });
              });
              // Also count visits with no eqHours as "Untagged"
              let untaggedHrs = 0;
              Object.values(allVisitsForDiv).forEach(function(contractVisits) {
                (contractVisits || []).forEach(function(v) {
                  if (!v.eqHours || Object.keys(v.eqHours).length === 0) {
                    untaggedHrs += (v.actualHours || 0);
                  }
                });
              });

              const colorMap = { W1: "#2563eb", W2: "#7c3aed", W3: "#d97706", Log: "#059669", PP: "#0891b2", Dry: "#6366f1", Insp: "#ec4899", IPP: "#f59e0b", IRN: "#14b8a6" };
              const types = Object.keys(eqTotals).sort();
              if (untaggedHrs > 0) types.push("Untagged");
              const data = types.map(function(t) {
                return { type: t, hours: t === "Untagged" ? untaggedHrs : eqTotals[t], color: colorMap[t] || "#94a3b8" };
              });
              const maxHrs = Math.max(...data.map(d => d.hours), 1);
              const totalLogged = data.reduce((s, d) => s + d.hours, 0);

              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>LOGGED HOURS BY EQUIPMENT</div>
                    <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>{fmtHrs(totalLogged)} <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 400 }}>total logged</span></div>
                  </div>
                  {data.length === 0 ? (
                    <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", padding: "20px 0" }}>No visits logged yet</div>
                  ) : (
                    <div>
                      {data.map(function(d) {
                        const pct = Math.round((d.hours / maxHrs) * 100);
                        return (
                          <div key={d.type} style={{ marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 12, color: "#1a2235", fontWeight: 500 }}>{d.type}</span>
                              <span style={{ fontSize: 12, color: d.color, fontWeight: 600 }}>{fmtHrs(d.hours)} hrs</span>
                            </div>
                            <div style={{ height: 4, background: "#f1f5f9", borderRadius: 3 }}>
                              <div style={{ width: pct + "%", height: "100%", background: d.color, borderRadius: 3 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
            </div>

            {/* Estimated Revenue by Month — full width */}
            {(function() {
              const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const now = new Date();
              const year = now.getFullYear();

              // Build actual revenue: sum actualHours × hourlyRate for each visit this year
              const actual = new Array(12).fill(0);
              const projected = new Array(12).fill(0);

              contracts.forEach(function(c) {
                const rate = parseFloat(c.hourlyRate) || 0;
                if (rate === 0 && c.trackingType !== "dollars") return;

                // Actual: logged visits this calendar year
                (visits[c.id] || []).forEach(function(v) {
                  const d = v.date.length === 7 ? new Date(v.date + "-01") : new Date(v.date);
                  if (d.getFullYear() === year) {
                    if (c.trackingType === "dollars") {
                      actual[d.getMonth()] += (parseFloat(v.billedAmount) || 0);
                    } else {
                      actual[d.getMonth()] += (parseFloat(v.actualHours) || 0) * rate;
                    }
                  }
                });

                // Projected: upcoming scheduled slots this calendar year
                const sv = parseInt(c.suggestedVisits) || 0;
                if (sv > 0) {
                  const sched = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
                  const revenuePerVisit = c.trackingType === "dollars"
                    ? (c.contractAmount || 0) / sv
                    : ((parseFloat(c.contractedHours) || 0) / sv) * rate;
                  sched.forEach(function(slot) {
                    if (slot.status !== "upcoming" && slot.status !== "overdue" && slot.status !== "rescheduled") return;
                    var d = slot.targetDate;
                    if (d.getFullYear() === year) {
                      projected[d.getMonth()] += revenuePerVisit;
                    }
                  });
                }
              });

              // Combined for y-axis scaling
              var combined = MONTHS.map(function(_, i) { return actual[i] + projected[i]; });
              var maxVal = Math.max.apply(null, combined.concat([1]));
              var totalActual = actual.reduce(function(s, v) { return s + v; }, 0);
              var totalProjected = projected.reduce(function(s, v) { return s + v; }, 0);

              var cW = 700; var cH = 120; var pL = 56; var pB = 24; var pT = 10; var pR = 12;
              var iW = cW - pL - pR; var iH = cH - pT - pB;
              var slotW = iW / 12;
              var barW = Math.floor(slotW * 0.55);

              var fmtK = function(v) {
                if (v >= 1000) return "$" + (v / 1000).toFixed(0) + "k";
                return "$" + Math.round(v);
              };

              var yTicks = [0, 0.25, 0.5, 0.75, 1].map(function(f) { return { frac: f, val: maxVal * f }; });

              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <div className="cond" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#64748b" }}>
                      ESTIMATED REVENUE BY MONTH — {year}
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 10, alignItems: "center" }}>
                      <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#2563eb", marginRight: 4 }} />
                        Actual <strong style={{ color: "#1a2235" }}>${totalActual.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>
                      </span>
                      <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#93c5fd", marginRight: 4 }} />
                        Projected <strong style={{ color: "#1a2235" }}>${totalProjected.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>
                      </span>
                      <span style={{ color: "#94a3b8" }}>
                        Total <strong style={{ color: "#1a2235" }}>${(totalActual + totalProjected).toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>
                      </span>
                    </div>
                  </div>

                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible", display: "block" }}>
                    {/* Y-axis grid + labels */}
                    {yTicks.map(function(t) {
                      if (t.frac === 0) return null;
                      var gy = pT + iH - t.frac * iH;
                      return (
                        <g key={t.frac}>
                          <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                          <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{fmtK(t.val)}</text>
                        </g>
                      );
                    })}
                    {/* Baseline */}
                    <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />

                    {/* Current month marker */}
                    {year === now.getFullYear() && (function() {
                      var cx = pL + slotW * now.getMonth() + slotW / 2;
                      return <line x1={cx} y1={pT} x2={cx} y2={pT + iH} stroke="#dbeafe" strokeWidth={slotW - 2} strokeLinecap="round" opacity="0.5" />;
                    })()}

                    {/* Stacked bars: actual (bottom, solid blue), projected (top, light blue) */}
                    {MONTHS.map(function(label, i) {
                      var cx = pL + slotW * i + slotW / 2;
                      var x = cx - barW / 2;
                      var baseY = pT + iH;
                      var actH = maxVal > 0 ? (actual[i] / maxVal) * iH : 0;
                      var prjH = maxVal > 0 ? (projected[i] / maxVal) * iH : 0;
                      var total = actual[i] + projected[i];
                      var isCurrent = year === now.getFullYear() && i === now.getMonth();
                      var isPast = year < now.getFullYear() || (year === now.getFullYear() && i < now.getMonth());

                      return (
                        <g key={label}>
                          {/* Projected bar (top, light blue) */}
                          {prjH > 0 && (
                            <rect x={x} y={baseY - actH - prjH} width={barW} height={prjH}
                              fill={isPast ? "#e2e8f0" : "#93c5fd"} rx="2"
                              opacity={isCurrent ? 0.7 : 1}>
                              <title>{label + ": $" + projected[i].toLocaleString("en-US", { maximumFractionDigits: 0 }) + " projected"}</title>
                            </rect>
                          )}
                          {/* Actual bar (bottom, solid blue) */}
                          {actH > 0 && (
                            <rect x={x} y={baseY - actH} width={barW} height={actH}
                              fill="#2563eb" rx="2"
                              opacity={isCurrent ? 0.85 : 1}>
                              <title>{label + ": $" + actual[i].toLocaleString("en-US", { maximumFractionDigits: 0 }) + " actual"}</title>
                            </rect>
                          )}
                          {/* Value label above bar */}
                          {total > 0 && (
                            <text x={cx} y={baseY - actH - prjH - 3} textAnchor="middle" fontSize="7"
                              fill={isCurrent ? "#1d4ed8" : "#64748b"} fontWeight={isCurrent ? "700" : "400"}>
                              {fmtK(total)}
                            </text>
                          )}
                          {/* X-axis label */}
                          <text x={cx} y={pT + iH + 14} textAnchor="middle" fontSize="8"
                            fill={isCurrent ? "#1d4ed8" : "#94a3b8"}
                            fontWeight={isCurrent ? "700" : "400"}>
                            {label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>
                    Actual = hours logged x rate. Projected = scheduled visit hrs x rate for upcoming visits. Current month highlighted.
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ALL CONTRACTS VIEW */}
        {(view === "contracts" || view === "owed") && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
              <input
                placeholder="Search customer or #..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 240 }}
              />
              <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} style={{ width: 160 }}>
                <option value="All">All Types</option>
                {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} style={{ width: 180 }}>
                <option value="All">All Groups</option>
                {allCorporateGroups.filter(g => g !== "None").map(g => <option key={g}>{g}</option>)}
              </select>
              {view === "contracts" && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={owedOnly} onChange={e => setOwedOnly(e.target.checked)} />
                  <span style={{ color: "#dc2626" }}>Show owed only</span>
                </label>
              )}
              <div style={{ marginLeft: "auto" }}>
                <button className="btn-primary" onClick={() => { setShowAddForm(true); setAddForm({ ...emptyContract }); }}>
                  + NEW CONTRACT
                </button>
              </div>
            </div>

            <div style={{ overflow: "auto", maxHeight: "calc(100vh - 260px)", borderRadius: 4, border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ textAlign: "left", minWidth: 200 }} onClick={() => handleSort("customer")}>Customer <SortIcon col="customer" /></th>
                    <th onClick={() => handleSort("contractNo")}>Contract # <SortIcon col="contractNo" /></th>
                    <th onClick={() => handleSort("team")}>Eq. Type <SortIcon col="team" /></th>
                    <th onClick={() => handleSort("corporateGroup")}>Group <SortIcon col="corporateGroup" /></th>
                    <th onClick={() => handleSort("travelCosts")}>Travel <SortIcon col="travelCosts" /></th>
                    <th onClick={() => handleSort("contractAmount")}>Contract Amt <SortIcon col="contractAmount" /></th>
                    <th onClick={() => handleSort("contractedHours")}>Contracted <SortIcon col="contractedHours" /></th>
                    {YEARS.map(y => <th key={y} style={{ color: y < 2026 ? "#dc2626" : undefined }} onClick={() => handleSort("hours" + y)}>{y} <SortIcon col={"hours" + y} /></th>)}
                    <th onClick={() => handleSort("netDue")}>Net Due <SortIcon col="netDue" /></th>
                    <th style={{ minWidth: 160 }} onClick={() => handleSort("extensionDate")}>Extension Date <SortIcon col="extensionDate" /></th>
                    <th onClick={() => handleSort("lastVisit")}>Last Visit <SortIcon col="lastVisit" /></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(view === "owed" ? filtered.filter(c => getOwedAfterVisits(c, getVisitedHours(c.id)) > 0) : filtered).map(c => {
                    const isEditing = editingId === c.id;
                    const visitedHrs = getVisitedHours(c.id);
                    const isOwed = getOwedAfterVisits(c, visitedHrs) > 0;
                    const remHours = getRemainingHours(c, visitedHrs);
                    if (isEditing) {
                      return (
                        <tr key={c.id} style={{ background: "#f0f4ff" }}>
                          <td><input value={editForm.customer} onChange={e => setEditForm(f => ({ ...f, customer: e.target.value }))} style={{ width: 200 }} /></td>
                          <td><input value={editForm.contractNo || ""} onChange={e => setEditForm(f => ({ ...f, contractNo: e.target.value }))} style={{ width: 80 }} /></td>
                          <td>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {EQUIPMENT_TYPES.map(function(t) {
                                const checked = (editForm.team || "").split(", ").filter(Boolean).includes(t);
                                return (
                                  <label key={t} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, cursor: "pointer" }}>
                                    <input type="checkbox" checked={checked} onChange={function(e) {
                                      const current = (editForm.team || "").split(", ").filter(Boolean);
                                      const updated = e.target.checked ? [...current, t] : current.filter(x => x !== t);
                                      const ordered = EQUIPMENT_TYPES.filter(x => updated.includes(x));
                                      setEditForm(f => ({ ...f, team: ordered.join(", ") }));
                                    }} />
                                    {t}
                                  </label>
                                );
                              })}
                            </div>
                          </td>
                          <td>
                            <select value={editForm.corporateGroup || "None"} onChange={e => handleGroupSelect(e.target.value, v => setEditForm(f => ({ ...f, corporateGroup: v })))}>
                              {allCorporateGroups.map(g => <option key={g}>{g}</option>)}
                              <option value="__add__">+ Add Group...</option>
                            </select>
                          </td>
                          <td>
                            <select value={editForm.travelCosts} onChange={e => setEditForm(f => ({ ...f, travelCosts: e.target.value }))}>
                              <option>Billable</option><option>All inclusive</option>
                            </select>
                          </td>
                          <td><input type="number" value={editForm.contractAmount || 0} onChange={e => setEditForm(f => ({ ...f, contractAmount: parseFloat(e.target.value) || 0 }))} style={{ width: 90 }} /></td>
                          <td><input type="number" value={editForm.contractedHours} onChange={e => setEditForm(f => ({ ...f, contractedHours: parseFloat(e.target.value) || 0 }))} style={{ width: 70 }} /></td>
                          {YEARS.map(y => (
                            <td key={y}><input type="number" value={editForm[`hours${y}`]} onChange={e => setEditForm(f => ({ ...f, [`hours${y}`]: parseFloat(e.target.value) || 0 }))} style={{ width: 60 }} /></td>
                          ))}
                          <td style={{ color: "#64748b" }}>{getNetDue(editForm, getVisitedHours(editForm.id)).toFixed(2)}</td>
                          <td><input value={editForm.extensionDate} onChange={e => setEditForm(f => ({ ...f, extensionDate: e.target.value }))} style={{ width: 140 }} /></td>
                          <td style={{ color: "#94a3b8", fontSize: 11 }}>{getLastVisitDate(c.id) || ""}</td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn-primary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => saveEdit(c.id)}>Save</button>
                              <button className="btn-sm" onClick={() => { setEditingId(null); setEditForm(null); }}>Cancel</button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={c.id} className={isOwed ? "row-owed" : ""} style={{ cursor: "pointer" }}
                        onClick={e => { if (!e.target.closest("button") && !e.target.closest("select") && !e.target.closest("input")) setSelectedContract(c); }}>
                        <td style={{ color: "#1a2235", fontWeight: isOwed ? "700" : "400" }}>
                          {isOwed && <span style={{ color: "#dc2626", marginRight: 6 }}>!</span>}
                          {c.customer}
                        </td>
                        <td style={{ color: "#64748b", textAlign: "center" }}>{c.contractNo || <span style={{ color: "#cbd5e1" }}>-</span>}</td>
                        <td style={{ textAlign: "center" }}>{c.team.split(", ").map(function(t) { return <span key={t} className={"pill pill-" + t.toLowerCase()} style={{ marginRight: 2 }}>{t}</span>; })}</td>
                        <td style={{ textAlign: "center" }}>
                          {c.corporateGroup && c.corporateGroup !== "None"
                            ? <span className="pill pill-group">{c.corporateGroup}</span>
                            : <span style={{ color: "#cbd5e1" }}>-</span>}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`pill ${c.travelCosts.toLowerCase().replace(/\s+/g, "") === "allinclusive" ? "pill-allinclusive" : "pill-billable"}`}>
                            {c.travelCosts}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", color: c.contractAmount > 0 ? "#059669" : "#cbd5e1" }}>
                          {c.contractAmount > 0 ? fmtRev(c.contractAmount) : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>{fmtHrs(c.contractedHours)}</td>
                        {YEARS.map(y => {
                          const currentYear = new Date().getFullYear();
                          const isCurrentYear = y === currentYear;
                          // For current year: calculate actual balance (can be negative if overridden)
                          // Total visited hours minus all hours from years before current year
                          const visitedHrs = getVisitedHours(c.id);
                          const hoursInPriorYears = YEARS.filter(yr => yr < y).reduce((s, yr) => s + (c[`hours${yr}`] || 0), 0);
                          const hoursAppliedToThisYear = Math.max(0, visitedHrs - hoursInPriorYears);
                          const rawBalance = (c[`hours${y}`] || 0) - hoursAppliedToThisYear;
                          const isNegative = isCurrentYear && rawBalance < 0;
                          const displayVal = isCurrentYear ? rawBalance : remHours[y];
                          const isEmpty = !isNegative && (displayVal === 0 || displayVal === undefined);
                          return (
                            <td key={y} style={{ textAlign: "center",
                              color: isNegative ? "#dc2626" : displayVal > 0 ? (y < currentYear ? "#dc2626" : "#2563eb") : "#cbd5e1",
                              fontWeight: isNegative ? 700 : 400,
                              background: isNegative ? "rgba(220,38,38,0.06)" : undefined
                            }}>
                              {isEmpty ? "-" : isNegative ? "(" + fmtHrs(Math.abs(displayVal)) + ")" : fmtHrs(displayVal)}
                            </td>
                          );
                        })}
                        <td style={{ textAlign: "center" }}>
                          {(() => {
                            const netDue = getNetDue(c, visitedHrs);
                            const isNeg = netDue < 0;
                            return netDue !== 0
                              ? <span style={{ color: isNeg ? "#dc2626" : "#1a2235", fontWeight: 700 }}>
                                  {isNeg ? "(" + fmtHrs(Math.abs(netDue)) + ")" : fmtHrs(netDue)}
                                </span>
                              : "-";
                          })()}
                        </td>
                        <td style={{ color: "#64748b", fontSize: 11 }}>{c.extensionDate}</td>
                        <td style={{ color: "#64748b", fontSize: 11, textAlign: "center" }}>{getLastVisitDate(c.id) || <span style={{ color: "#cbd5e1" }}></span>}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {(visits[c.id] || []).length > 0 && (
                              <span style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 2, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>
                                {(visits[c.id] || []).length} visits
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #e2e8f0" }}>
                    <td colSpan={2} style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>TOTALS ({filtered.length} contracts)</td>
                    <td /><td /><td />
                    <td style={{ textAlign: "right", color: "#059669", fontWeight: 700 }}>${Math.round(totals.contractAmount).toLocaleString("en-US")}</td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#1a2235" }}>{totals.contractedHours.toLocaleString()}</td>
                    {YEARS.map(y => (
                      <td key={y} style={{ textAlign: "center", fontWeight: 700, color: y < 2026 ? "#dc2626" : "#2563eb" }}>
                        {totals[`hours${y}`] > 0 ? fmtHrs(totals[`hours${y}`]) : "-"}
                      </td>
                    ))}
                    <td style={{ textAlign: "center", fontWeight: 700, color: totals.netDue < 0 ? "#dc2626" : "#1a2235" }}>
                      {totals.netDue < 0 ? "(" + fmtHrs(Math.abs(totals.netDue)) + ")" : fmtHrs(totals.netDue)}
                    </td>
                    <td /><td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {view === "schedule" && (function() {
          const today = new Date();
          const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const fmtYM = function(ym) {
            if (!ym) return "—";
            const parts = ym.split("-");
            return MONTH_NAMES[parseInt(parts[1]) - 1] + " " + parts[0];
          };

          const allContracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");

          const enriched = allContracts
            .filter(c => parseInt(c.suggestedVisits) > 0)
            .map(c => {
              const schedule = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
              const health = getScheduleHealth(c, visits[c.id]);
              const nextUp = schedule.find(s => s.status === "upcoming" || s.status === "overdue" || s.status === "rescheduled");
              const div = knaContracts.find(x => x.id === c.id) ? "KNA" : "KCAN";
              return { c, schedule, health, nextUp, div };
            });

          const overdue      = enriched.filter(e => e.health.status === "overdue").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || 0) - ((b.nextUp && b.nextUp.targetDate) || 0));
          const rescheduled  = enriched.filter(e => e.health.status === "rescheduled").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || 0) - ((b.nextUp && b.nextUp.targetDate) || 0));
          const dueSoon      = enriched.filter(e => e.health.status === "due-soon").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || 0) - ((b.nextUp && b.nextUp.targetDate) || 0));
          const onTrack      = enriched.filter(e => e.health.status === "on-track").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || Infinity) - ((b.nextUp && b.nextUp.targetDate) || Infinity));
          const complete     = enriched.filter(e => e.health.status === "complete");
          const noSchedule = allContracts.filter(c => !(parseInt(c.suggestedVisits) > 0));

          const ScheduleRow = function({ e }) {
            const { c, schedule, health, nextUp, div } = e;
            const doneCount = schedule.filter(s => s.status === "done").length;
            const total = schedule.length;
            return (
              <div
                onClick={() => setSelectedContract(c)}
                style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 1fr 90px", gap: 12, alignItems: "center",
                  padding: "10px 16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: "#fff" }}
                onMouseEnter={ev => ev.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{c.customer}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
                    {div}{c.team ? " · " + c.team : ""}{c.contractNo ? " · #" + c.contractNo : ""}
                    {" · "}<span style={{ color: "#94a3b8" }}>{c.extensionDate}</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Progress</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: health.color }}>{doneCount}/{total}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Next Due</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: health.color }}>
                    {nextUp ? fmtYM(nextUp.targetYearMonth) : doneCount === total ? "Done" : "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  {computeWOSchedule(c, workOrders[c.id] || []).map(wo => {
                    const bg = wo.status === "complete" ? "#059669" : wo.status === "overdue" ? "#dc2626" : "#f59e0b";
                    return (
                      <div key={"wo-" + wo.id}
                        title={"WO: " + wo.title + " · " + (wo.scheduledDate ? wo.scheduledDate : "suggested " + wo.targetDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }))}
                        style={{ width: 24, height: 24, borderRadius: 4, background: bg, color: "#fff",
                          fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid rgba(0,0,0,0.1)" }}>
                        WO
                      </div>
                    );
                  })}
                  {schedule.map(s => {
                    const bg = s.status === "done"
                      ? (s.wasLate ? "#d97706" : "#059669")
                      : s.status === "overdue" ? "#dc2626"
                      : s.status === "rescheduled" ? "#d97706"
                      : s.rescheduled ? "#e0f2fe" : "#e2e8f0";
                    const fg = (s.status === "done" || s.status === "overdue" || s.status === "rescheduled") ? "#fff"
                      : s.rescheduled ? "#0369a1" : "#64748b";
                    const border = s.status === "rescheduled" ? "1.5px solid #b45309" : s.rescheduled && s.status !== "done" ? "1.5px dashed #0369a1" : "none";
                    const origLabel = s.originalTarget ? fmtYM(toYearMonth(s.originalTarget)) : null;
                    const tooltipParts = ["Visit " + s.visitNo + ": target " + fmtYM(s.targetYearMonth)];
                    if (s.matchedVisit) tooltipParts.push("logged " + s.matchedVisit.date);
                    else tooltipParts.push("not yet logged");
                    if (s.wasLate) tooltipParts.push("logged late (original: " + origLabel + ")");
                    if (s.rescheduled && origLabel && origLabel !== fmtYM(s.targetYearMonth)) tooltipParts.push("rescheduled from " + origLabel);
                    return (
                      <div key={s.visitNo}
                        title={tooltipParts.join(" · ")}
                        style={{ width: 24, height: 24, borderRadius: 4, background: bg, color: fg, border,
                          fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                        {s.status === "done" ? (s.wasLate ? "!" : "V") : s.status === "rescheduled" ? "↻" : s.rescheduled ? "R" : s.visitNo}
                      </div>
                    );
                  })}
                  {schedule.some(s => s.rescheduled) && (
                    <span style={{ fontSize: 9, color: "#0369a1", marginLeft: 2, whiteSpace: "nowrap" }}>rescheduled</span>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 8px",
                    borderRadius: 10, background: health.bg, color: health.color, whiteSpace: "nowrap" }}>
                    {health.label}
                  </span>
                </div>
              </div>
            );
          };

          function sortScheduleItems(items) {
            var sorted = items.slice();
            sorted.sort(function(a, b) {
              var va, vb;
              if (scheduleSortCol === "customer") { va = a.c.customer.toLowerCase(); vb = b.c.customer.toLowerCase(); }
              else if (scheduleSortCol === "progress") { va = a.schedule.filter(s => s.status === "done").length / (a.schedule.length || 1); vb = b.schedule.filter(s => s.status === "done").length / (b.schedule.length || 1); }
              else if (scheduleSortCol === "nextDue") { va = a.nextUp ? a.nextUp.targetYearMonth : "9999"; vb = b.nextUp ? b.nextUp.targetYearMonth : "9999"; }
              else if (scheduleSortCol === "status") { va = a.health.label; vb = b.health.label; }
              else { va = a.c.customer.toLowerCase(); vb = b.c.customer.toLowerCase(); }
              if (va < vb) return scheduleSortDir === "asc" ? -1 : 1;
              if (va > vb) return scheduleSortDir === "asc" ? 1 : -1;
              return 0;
            });
            return sorted;
          }

          function filterScheduleItems(items) {
            if (!scheduleSearch) return items;
            var q = scheduleSearch.toLowerCase();
            return items.filter(function(e) {
              return e.c.customer.toLowerCase().includes(q) ||
                (e.c.contractNo || "").toLowerCase().includes(q) ||
                (e.c.team || "").toLowerCase().includes(q) ||
                (e.div || "").toLowerCase().includes(q);
            });
          }

          function handleScheduleSort(col) {
            if (scheduleSortCol === col) setScheduleSortDir(function(d) { return d === "asc" ? "desc" : "asc"; });
            else { setScheduleSortCol(col); setScheduleSortDir("asc"); }
          }

          var schedSortIcon = function(col) {
            if (scheduleSortCol !== col) return <span style={{ opacity: 0.3, marginLeft: 3 }}>~</span>;
            return <span style={{ marginLeft: 3 }}>{scheduleSortDir === "asc" ? "^" : "v"}</span>;
          };

          const Section = function({ title, color, bg, items, defaultOpen }) {
            const [open, setOpen] = useState(defaultOpen !== false);
            var displayed = sortScheduleItems(filterScheduleItems(items));
            if (items.length === 0) return null;
            return (
              <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setOpen(o => !o)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 16px", background: bg, cursor: "pointer",
                    borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {scheduleSearch && displayed.length !== items.length && <span style={{ fontSize: 10, color: "#94a3b8" }}>{displayed.length} of</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                    <span style={{ color, fontSize: 12 }}>{open ? "^" : "v"}</span>
                  </div>
                </div>
                {open && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 1fr 90px", gap: 12,
                      padding: "6px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {[
                        { label: "Customer", col: "customer" },
                        { label: "Progress", col: "progress" },
                        { label: "Next Due", col: "nextDue" },
                        { label: "Visit Timeline", col: null },
                        { label: "Status", col: "status" },
                      ].map(h => (
                        <div key={h.label} onClick={h.col ? function() { handleScheduleSort(h.col); } : undefined}
                          style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", cursor: h.col ? "pointer" : "default", userSelect: "none" }}>
                          {h.label}{h.col ? schedSortIcon(h.col) : null}
                        </div>
                      ))}
                    </div>
                    {displayed.map(e => <ScheduleRow key={e.c.id} e={e} />)}
                    {displayed.length === 0 && items.length > 0 && (
                      <div style={{ padding: "12px 16px", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>No matches for "{scheduleSearch}"</div>
                    )}
                  </div>
                )}
              </div>
            );
          };

          return (
            <div>
              {/* 12-Month Scheduled Visits Chart */}
              {(function() {
                const now = new Date();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
                  months.push({
                    ym: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"),
                    label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " '" + String(d.getFullYear()).slice(2),
                    isCurrent: i === 0,
                  });
                }

                const monthContracts = {};
                months.forEach(m => { monthContracts[m.ym] = []; });

                const currentYM = months[0].ym;
                contracts.filter(c => parseInt(c.suggestedVisits) > 0).forEach(c => {
                  const schedule = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
                  schedule.forEach(slot => {
                    const bucketYM = (slot.status === "overdue" && slot.targetYearMonth < currentYM)
                      ? currentYM
                      : slot.targetYearMonth;
                    if (monthContracts[bucketYM]) {
                      monthContracts[bucketYM].push({ c, slot: { ...slot, bucketedYM: bucketYM } });
                    }
                  });
                });
                contracts.forEach(c => {
                  const woSched = computeWOSchedule(c, workOrders[c.id] || []);
                  woSched.forEach(function(wo) {
                    const woStatus = wo.status === "complete" ? "done" : wo.status;
                    const bucketYM = (woStatus === "overdue" && wo.targetYearMonth < currentYM)
                      ? currentYM
                      : wo.targetYearMonth;
                    if (monthContracts[bucketYM]) {
                      monthContracts[bucketYM].push({ c, slot: {
                        visitNo: "WO",
                        targetYearMonth: wo.targetYearMonth,
                        bucketedYM: bucketYM,
                        targetDate: wo.targetDate,
                        status: woStatus,
                        isWorkOrder: true,
                        woData: wo,
                      }});
                    }
                  });
                });

                const data = months.map(m => {
                  const items = monthContracts[m.ym] || [];
                  return {
                    ...m,
                    items,
                    done:     items.filter(x => x.slot.status === "done").length,
                    upcoming: items.filter(x => x.slot.status === "upcoming" || x.slot.status === "rescheduled").length,
                    overdue:  items.filter(x => x.slot.status === "overdue").length,
                  };
                });
                const maxCount = Math.max(...data.map(d => d.items.length), 1);
                const totalScheduled = data.reduce((s, d) => s + d.items.length, 0);
                const totalDone = data.reduce((s, d) => s + d.done, 0);
                const totalOverdue = data.reduce((s, d) => s + d.overdue, 0);

                const cH = 100; const cW = 560; const pL = 28; const pB = 24; const pT = 8; const pR = 8;
                const iW = cW - pL - pR; const iH = cH - pT - pB;
                const barW = Math.floor(iW / 12) - 3;

                const selected = selectedScheduleMonth;
                const selectedData = selected ? data.find(d => d.ym === selected) : null;

                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                        <div className="cond" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>SCHEDULED VISITS — NEXT 12 MONTHS</div>
                        <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
                          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#059669", marginRight: 4 }} />Done ({totalDone})</span>
                          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#2563eb", marginRight: 4 }} />Upcoming ({totalScheduled - totalDone - totalOverdue})</span>
                          {totalOverdue > 0 && <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#dc2626", marginRight: 4 }} />Overdue ({totalOverdue})</span>}
                          <span style={{ color: "#94a3b8" }}>Total: {totalScheduled}</span>
                        </div>
                      </div>
                      <div style={{ position: "relative" }}>
                      {/* HTML overlay for drag-and-drop — much more reliable than SVG drag events */}
                      {draggingSlot && (
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: "flex", paddingLeft: (pL / cW * 100) + "%", paddingRight: (pR / cW * 100) + "%" }}>
                          {data.map(function(d) {
                            const isOver = dragOverMonth === d.ym;
                            return (
                              <div key={d.ym} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                background: isOver ? "rgba(14,165,233,0.20)" : "transparent",
                                border: isOver ? "2px dashed #0ea5e9" : "2px dashed transparent",
                                borderRadius: 4, transition: "background 0.1s, border 0.1s" }}
                                onDragOver={function(ev) { ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; setDragOverMonth(d.ym); }}
                                onDragLeave={function() { setDragOverMonth(function(prev) { return prev === d.ym ? null : prev; }); }}
                                onDrop={function(ev) {
                                  ev.preventDefault();
                                  if (draggingSlot.isWorkOrder) {
                                    updateWorkOrder(draggingSlot.contractId, draggingSlot.woId, { scheduledDate: d.ym + "-01" });
                                  } else {
                                    applyScheduleOverride(draggingSlot.contractId, draggingSlot.visitNo, d.ym);
                                  }
                                  setDraggingSlot(null);
                                  setDragOverMonth(null);
                                  setSelectedScheduleMonth(d.ym);
                                }}
                              >
                                {isOver && <span style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", pointerEvents: "none" }}>DROP</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible", cursor: "pointer", display: "block" }}>
                        {[0, 1, 2, 3].map(i => {
                          const val = Math.round((maxCount / 3) * i);
                          const gy = pT + iH - (val / maxCount) * iH;
                          return (
                            <g key={i}>
                              <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                              {i > 0 && <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="7" fill="#94a3b8">{val}</text>}
                            </g>
                          );
                        })}
                        <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />
                        {data.map((d, i) => {
                          const slotW = iW / 12;
                          const cx = pL + slotW * i + slotW / 2;
                          const x = cx - barW / 2;
                          const total = d.items.length;
                          const doneH   = total > 0 ? (d.done    / maxCount) * iH : 0;
                          const upH     = total > 0 ? (d.upcoming / maxCount) * iH : 0;
                          const ovH     = total > 0 ? (d.overdue  / maxCount) * iH : 0;
                          const baseY   = pT + iH;
                          const isSelected = selected === d.ym;
                          const isDragOver = draggingSlot && dragOverMonth === d.ym;
                          return (
                            <g key={d.ym} onClick={() => setSelectedScheduleMonth(isSelected ? null : d.ym)} style={{ cursor: total > 0 ? "pointer" : "default" }}>
                              {/* Click zone */}
                              <rect x={pL + slotW * i} y={pT - 4} width={slotW} height={iH + 28} fill="transparent" />
                              <rect x={x - 3} y={pT} width={barW + 6} height={iH + 4}
                                fill={isSelected ? "rgba(37,99,235,0.08)" : "transparent"}
                                stroke={isSelected ? "#2563eb" : "none"} strokeWidth="1" rx="3" />
                              {ovH > 0 && <rect x={x} y={baseY - ovH} width={barW} height={ovH} fill="#dc2626" rx="1" />}
                              {doneH > 0 && <rect x={x} y={baseY - ovH - doneH} width={barW} height={doneH} fill="#059669" rx="1" />}
                              {upH > 0 && <rect x={x} y={baseY - ovH - doneH - upH} width={barW} height={upH} fill={d.isCurrent ? "#1d4ed8" : "#2563eb"} rx="1" />}
                              {total > 0 && <text x={cx} y={baseY - ovH - doneH - upH - 3} textAnchor="middle" fontSize="7" fill={isSelected ? "#2563eb" : "#64748b"} fontWeight="600">{total}</text>}
                              <text x={cx} y={pT + iH + 14} textAnchor="middle" fontSize="7" fill={isSelected ? "#2563eb" : d.isCurrent ? "#1d4ed8" : "#94a3b8"} fontWeight={d.isCurrent || isSelected ? "700" : "400"}>{d.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                      </div>
                      <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Click a bar to see contracts scheduled that month. Drag a visit card to a bar to reschedule it.</div>
                    </div>

                    {selectedData && (
                      <div style={{ background: "#fff", border: "1px solid #2563eb", borderRadius: 6, padding: "14px 16px", marginTop: 8, boxShadow: "0 2px 8px rgba(37,99,235,0.10)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <div>
                            <span className="cond" style={{ fontSize: 14, fontWeight: 700, color: "#1a2235", letterSpacing: "0.06em" }}>
                              {selectedData.label.toUpperCase()} — {selectedData.items.length} SCHEDULED VISIT{selectedData.items.length !== 1 ? "S" : ""}
                            </span>
                            <span style={{ marginLeft: 12, fontSize: 11, color: "#94a3b8" }}>
                              {selectedData.done > 0 && <span style={{ color: "#059669", marginRight: 10 }}>V {selectedData.done} done</span>}
                              {selectedData.upcoming > 0 && <span style={{ color: "#2563eb", marginRight: 10 }}>{selectedData.upcoming} upcoming</span>}
                              {selectedData.overdue > 0 && <span style={{ color: "#dc2626" }}>{selectedData.overdue} overdue</span>}
                            </span>
                          </div>
                          <button onClick={() => setSelectedScheduleMonth(null)}
                            style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>x</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                          {selectedData.items.sort((a, b) => {
                            const order = { overdue: 0, rescheduled: 1, upcoming: 2, done: 3 };
                            return (order[a.slot.status] !== undefined ? order[a.slot.status] : 3) - (order[b.slot.status] !== undefined ? order[b.slot.status] : 3);
                          }).map(({ c, slot }, idx) => {
                            const isWO = !!slot.isWorkOrder;
                            const statusColor = isWO
                              ? (slot.status === "done" ? "#059669" : slot.status === "overdue" ? "#dc2626" : "#d97706")
                              : (slot.status === "done" ? "#059669" : slot.status === "overdue" ? "#dc2626" : slot.status === "rescheduled" ? "#d97706" : "#2563eb");
                            const statusBg = isWO
                              ? (slot.status === "done" ? "rgba(5,150,105,0.07)" : slot.status === "overdue" ? "rgba(220,38,38,0.07)" : "rgba(217,119,6,0.07)")
                              : (slot.status === "done" ? "rgba(5,150,105,0.07)" : slot.status === "overdue" ? "rgba(220,38,38,0.07)" : slot.status === "rescheduled" ? "rgba(217,119,6,0.07)" : "rgba(37,99,235,0.07)");
                            const statusLabel = slot.status === "done" ? "Done" : slot.status === "overdue" ? "Overdue" : slot.status === "rescheduled" ? "Rescheduled" : isWO ? "Scheduled" : "Upcoming";
                            const eqTypes = c.team ? c.team.split(", ").map(t => t.trim()).filter(Boolean) : [];
                            return (
                              <div key={idx}
                                draggable={slot.status !== "done"}
                                onDragStart={slot.status !== "done" ? (ev) => {
                                  ev.dataTransfer.effectAllowed = "move";
                                  if (slot.isWorkOrder) {
                                    setDraggingSlot({ contractId: c.id, woId: slot.woData.id, isWorkOrder: true, customerLabel: c.customer, visitLabel: "WO: " + (slot.woData.title || "Work Order") });
                                  } else {
                                    setDraggingSlot({ contractId: c.id, visitNo: slot.visitNo, customerLabel: c.customer, visitLabel: "Visit " + slot.visitNo + " of " + c.suggestedVisits });
                                  }
                                } : undefined}
                                onDragEnd={() => { setDraggingSlot(null); setDragOverMonth(null); }}
                                onClick={() => setSelectedContract(c)}
                                style={{ background: statusBg, border: "1px solid " + statusColor + "33", borderRadius: 5, padding: "10px 12px",
                                  cursor: slot.status !== "done" ? "grab" : "pointer",
                                  display: "flex", gap: 10, alignItems: "flex-start",
                                  opacity: draggingSlot && draggingSlot.contractId === c.id && draggingSlot.visitNo === slot.visitNo ? 0.4 : 1,
                                  outline: slot.manuallyMoved ? "1.5px dashed #0369a1" : "none" }}>
                                <div style={{ width: 6, minWidth: 6, height: 6, borderRadius: "50%", background: statusColor, marginTop: 5 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.customer}</div>
                                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                      {slot.manuallyMoved && <span style={{ fontSize: 9, color: "#0369a1" }} title="Manually rescheduled">R</span>}
                                      {slot.status !== "done" && <span style={{ fontSize: 9, color: "#94a3b8" }} title="Drag to reschedule">::</span>}
                                      <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, whiteSpace: "nowrap" }}>{statusLabel}</span>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                                    {isWO ? <span>WO: {slot.woData && slot.woData.title}</span> : (function() {
                                      const ippInfo = getContractIpp(c.id);
                                      const baseLabel = ippInfo ? ippInfo.program.group + " IPP - Visit " + slot.visitNo + " of " + c.suggestedVisits : "Visit " + slot.visitNo + " of " + c.suggestedVisits;
                                      return <span>{baseLabel}</span>;
                                    })()}
                                    {c.contractNo && <span style={{ marginLeft: 8, color: "#94a3b8" }}>#{c.contractNo}</span>}
                                    {slot.manuallyMoved && slot.originalTarget && (
                                      <span style={{ marginLeft: 8, color: "#0369a1", fontSize: 9 }}>moved from {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][slot.originalTarget.getMonth()]} '{String(slot.originalTarget.getFullYear()).slice(2)}</span>
                                    )}
                                    {slot.status === "overdue" && slot.bucketedYM && slot.bucketedYM !== slot.targetYearMonth && (
                                      <span style={{ marginLeft: 8, color: "#dc2626", fontSize: 9, fontWeight: 700 }}>was due {fmtYM(slot.targetYearMonth)}</span>
                                    )}
                                  </div>
                                  {eqTypes.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                                      {eqTypes.map(t => <EqPill key={t} type={t} />)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Header + summary stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>VISIT SCHEDULE</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    All {enriched.length} contracts with suggested visits - click any row to open
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { label: "Overdue",      val: overdue.length,     color: "#dc2626" },
                    { label: "Rescheduled",  val: rescheduled.length, color: "#d97706" },
                    { label: "Due Soon",     val: dueSoon.length,     color: "#f59e0b" },
                    { label: "On Track",     val: onTrack.length,     color: "#2563eb" },
                    { label: "Complete",     val: complete.length,    color: "#059669" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <input
                  placeholder="Search customer, contract #, team..."
                  value={scheduleSearch}
                  onChange={function(ev) { setScheduleSearch(ev.target.value); }}
                  style={{ width: 300 }}
                />
              </div>

              <Section title="OVERDUE — Visits past their target window"         color="#dc2626" bg="rgba(220,38,38,0.04)"   items={overdue}      defaultOpen={true} />
              <Section title="RESCHEDULED — Overdue visits moved to new date" color="#d97706" bg="rgba(217,119,6,0.04)"   items={rescheduled}  defaultOpen={true} />
              <Section title="DUE SOON — Next visit within 30 days"          color="#f59e0b" bg="rgba(245,158,11,0.04)"   items={dueSoon}      defaultOpen={true} />
              <Section title="ON TRACK — Next visit more than 30 days out" color="#2563eb" bg="rgba(37,99,235,0.04)"  items={onTrack}  defaultOpen={true} />
              <Section title="COMPLETE — All visits logged"                color="#059669" bg="rgba(5,150,105,0.04)"  items={complete} defaultOpen={false} />

              {noSchedule.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                  {noSchedule.length} contract{noSchedule.length !== 1 ? "s" : ""} have no suggested visit count — set one in the Visit Panel to include them here.
                </div>
              )}

              {/* Work Orders section */}
              {(function() {
                const allWOs = [];
                allContracts.forEach(c => {
                  const woSched = computeWOSchedule(c, workOrders[c.id] || []);
                  woSched.forEach(wo => allWOs.push({ wo, c }));
                });
                const scheduledWOs = allWOs.filter(x => x.wo.status !== "complete").sort((a, b) => (a.wo.targetDate || new Date("9999")) < (b.wo.targetDate || new Date("9999")) ? -1 : 1);
                const completeWOs  = allWOs.filter(x => x.wo.status === "complete").sort((a, b) => (b.wo.completedAt || "") < (a.wo.completedAt || "") ? -1 : 1);
                if (allWOs.length === 0) return null;

                const WOSection = function({ title, color, bg, items, defaultOpen }) {
                  const [open, setOpen] = useState(defaultOpen !== false);
                  if (items.length === 0) return null;
                  return (
                    <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                      <div onClick={() => setOpen(o => !o)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 16px", background: bg, cursor: "pointer", borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                          <span style={{ color, fontSize: 12 }}>{open ? "^" : "v"}</span>
                        </div>
                      </div>
                      {open && (
                        <div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 80px 70px", gap: 12,
                            padding: "6px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            {["Customer / Title", "Scheduled", "Est. Hrs", "Revenue", "Status"].map(h => (
                              <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase" }}>{h}</div>
                            ))}
                          </div>
                          {items.map(({ wo, c }) => {
                            const isOverdue = wo.status === "scheduled" && wo.scheduledDate && new Date(wo.scheduledDate) < new Date();
                            const rowColor = wo.status === "complete" ? "#059669" : isOverdue ? "#dc2626" : "#d97706";
                            return (
                              <div key={wo.id}
                                onClick={() => setSelectedContract(c)}
                                style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 80px 70px", gap: 12, alignItems: "center",
                                  padding: "10px 16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: "#fff" }}
                                onMouseEnter={ev => ev.currentTarget.style.background = "#f8fafc"}
                                onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{c.customer}</div>
                                  <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{wo.title}</div>
                                </div>
                                <div style={{ fontSize: 11, color: isOverdue ? "#dc2626" : "#475569", fontWeight: isOverdue ? 700 : 400 }}>
                                  {wo.targetDate
                                    ? wo.targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })
                                    : "—"}
                                  {!wo.scheduledDate && wo.targetDate && <div style={{ fontSize: 9, color: "#94a3b8" }}>suggested</div>}
                                  {isOverdue && <div style={{ fontSize: 9, color: "#dc2626" }}>OVERDUE</div>}
                                </div>
                                <div style={{ fontSize: 12, color: "#475569" }}>
                                  {wo.actualHours ? wo.actualHours + "h" : wo.estimatedHours ? wo.estimatedHours + "h" : "—"}
                                </div>
                                <div style={{ fontSize: 12, color: "#475569" }}>
                                  {wo.revenue ? "$" + parseFloat(wo.revenue).toLocaleString() : "—"}
                                </div>
                                <div>
                                  <span style={{ fontSize: 9, fontWeight: 700, background: rowColor, color: "#fff",
                                    borderRadius: 8, padding: "2px 8px", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                                    {wo.status === "complete" ? "DONE" : isOverdue ? "OVERDUE" : "SCHEDULED"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                };

                return (
                  <div style={{ marginTop: 32 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em", marginBottom: 4 }}>WORK ORDERS</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>
                      {scheduledWOs.length} scheduled - {completeWOs.length} complete - click any row to open contract
                    </div>
                    <WOSection title="SCHEDULED — Open work orders" color="#d97706" bg="rgba(217,119,6,0.04)" items={scheduledWOs} defaultOpen={true} />
                    <WOSection title="COMPLETE — Finished work orders" color="#059669" bg="rgba(5,150,105,0.04)" items={completeWOs} defaultOpen={false} />
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* RENEWALS VIEW */}
        {view === "renewals" && (function() {
          const allContracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");
          const today = new Date();

          const withStatus = allContracts.map(c => {
            const rs = getRenewalStatus(c);
            const days = daysUntilExpiry(c);
            return { c, rs, days };
          });

          const expired  = withStatus.filter(x => x.rs.status === "expired").sort((a,b) => a.days - b.days);
          const dueSoon  = withStatus.filter(x => x.rs.status === "due").sort((a,b) => a.days - b.days);
          const upcoming = withStatus.filter(x => x.rs.status === "ok" && x.days !== null && x.days <= 90).sort((a,b) => a.days - b.days);

          const RenewalRow = function({ item }) {
            const { c, rs, days } = item;
            const div = knaContracts.find(x => x.id === c.id) ? "KNA" : "KCAN";
            const renewalCount = (c.renewalHistory || []).length;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 130px 140px 160px", gap: 12,
                alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f1f5f9",
                background: "#fff" }}
                onMouseEnter={ev => ev.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{c.customer}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                    {div}{c.team ? " · " + c.team : ""}{c.contractNo ? " · #" + c.contractNo : ""}
                    {renewalCount > 0 && <span style={{ marginLeft: 6, color: "#6366f1", fontWeight: 700 }}>R {renewalCount} renewal{renewalCount > 1 ? "s" : ""}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Current Term</div>
                  <div style={{ fontSize: 11, color: "#1a2235", fontWeight: 600, marginTop: 1 }}>{c.extensionDate || "—"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Suggested Next</div>
                  <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, marginTop: 1 }}>{suggestNextTerm(c.extensionDate) || "—"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Status</div>
                  <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 10,
                    background: rs.bg, color: rs.color, whiteSpace: "nowrap", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>{rs.label}</span>
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button onClick={() => setSelectedContract(c)}
                    style={{ fontSize: 11, padding: "4px 10px", background: "none", border: "1px solid #e2e8f0",
                      borderRadius: 4, cursor: "pointer", color: "#64748b" }}>View</button>
                  <button onClick={() => openRenewalModal(c)}
                    style={{ fontSize: 11, padding: "4px 12px", background: "#2563eb", color: "#fff",
                      border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>Renew</button>
                  <ConfirmArchiveButton onConfirm={() => archiveContract(c.id)}
                    style={{ fontSize: 11, padding: "4px 10px" }} />
                </div>
              </div>
            );
          };

          const RenewalSection = function({ title, color, bg, items, defaultOpen }) {
            const [open, setOpen] = useState(defaultOpen !== false);
            if (items.length === 0) return null;
            return (
              <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 16px", background: bg, cursor: "pointer",
                  borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                    <span style={{ color, fontSize: 12 }}>{open ? "^" : "v"}</span>
                  </div>
                </div>
                {open && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 130px 140px 160px", gap: 12,
                      padding: "6px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Customer", "Current Term", "Suggested Next", "Status", "Action"].map(h => (
                        <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase" }}>{h}</div>
                      ))}
                    </div>
                    {items.map(item => <RenewalRow key={item.c.id} item={item} />)}
                  </div>
                )}
              </div>
            );
          };

          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>CONTRACT RENEWALS</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    Contracts expiring within 90 days or already expired - click Renew to review terms
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { label: "Expired",    val: expired.length,  color: "#dc2626" },
                    { label: "30 Days or less", val: dueSoon.length,  color: "#d97706" },
                    { label: "31-90 Days", val: upcoming.length, color: "#6366f1" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {expired.length === 0 && dueSoon.length === 0 && upcoming.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>OK</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>No renewals due in the next 90 days</div>
                </div>
              )}

              <RenewalSection title="EXPIRED — Immediate action needed"      color="#dc2626" bg="rgba(220,38,38,0.04)"  items={expired}  defaultOpen={true} />
              <RenewalSection title="EXPIRING SOON — Within 30 days"         color="#d97706" bg="rgba(217,119,6,0.04)"  items={dueSoon}  defaultOpen={true} />
              <RenewalSection title="COMING UP — Expiring in 31-90 days"     color="#6366f1" bg="rgba(99,102,241,0.04)" items={upcoming} defaultOpen={true} />
            </div>
          );
        })()}

        {/* IPP VIEW */}
        {view === "ipp" && (function() {
          const knaContractSet = knaContracts.filter(c => getContractStatus(c) !== "archived").map(c => ({ ...c, _division: "KNA" }));
          const kcanContractSet = kcanContracts.filter(c => getContractStatus(c) !== "archived").map(c => ({ ...c, _division: "KCAN" }));
          const allContracts = [...knaContractSet, ...kcanContractSet];
          const findContractForSite = function(site) {
            if (site._division) {
              const set = site._division === "KNA" ? knaContractSet : kcanContractSet;
              return set.find(c => c.id === site.contractId);
            }
            const divSet = division === "KNA" ? knaContractSet : kcanContractSet;
            const otherSet = division === "KNA" ? kcanContractSet : knaContractSet;
            return divSet.find(c => c.id === site.contractId) || otherSet.find(c => c.id === site.contractId);
          };
          const allGroups = [...CORPORATE_GROUPS, ...extraGroups].filter(g => g !== "None");

          const ippView = ippUiState.view;
          const setIppView = function(v) { setIppUiState(function(s) { return { ...s, view: v }; }); };
          const editingProgram = ippUiState.editingProgram;
          const setEditingProgram = function(p) { setIppUiState(function(s) { const next = typeof p === "function" ? p(s.editingProgram) : p; return { ...s, editingProgram: next }; }); };
          const selectedProgram = ippUiState.selectedProgram;
          const setSelectedProgram = function(p) { setIppUiState(function(s) { return { ...s, selectedProgram: p }; }); };
          const selectedSiteId = ippUiState.selectedSiteId;
          const setSelectedSiteId = function(id) { setIppUiState(function(s) { return { ...s, selectedSiteId: id }; }); };
          const setSitesCollapsed = function(v) { setIppUiState(function(s) { return { ...s, sitesCollapsed: v }; }); };

          // ── PROGRAM LIST VIEW ──────────────────────────────────────────
          if (ippView === "list") {
            const divisionContractIds = new Set(allDivisionContracts.map(c => c.id));
            const ippFilter = ippUiState.ippDivisionFilter !== false;
            const setIppFilter = function(v) { setIppUiState(function(s) { return { ...s, ippDivisionFilter: v }; }); };

            const visiblePrograms = ippFilter
              ? ippPrograms.filter(function(p) {
                  return (p.sites || []).some(function(s) { return divisionContractIds.has(s.contractId); });
                })
              : ippPrograms;

            const grouped = allGroups.map(function(g) {
              return { group: g, programs: visiblePrograms.filter(p => p.group === g) };
            }).filter(g => g.programs.length > 0);

            return (
              <div style={{ padding: "24px 28px", maxWidth: 900, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div className="cond" style={{ fontSize: 22, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>IPP PROGRAMS</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Investment Protection Programs by customer group</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, color: "#64748b", userSelect: "none" }}>
                      <input type="checkbox" checked={ippFilter}
                        onChange={function(ev) { setIppFilter(ev.target.checked); }}
                        style={{ accentColor: "#2563eb" }} />
                      {division} only
                    </label>
                    <button className="btn-primary" style={{ fontSize: 11, padding: "8px 16px" }}
                      onClick={function() {
                        setEditingProgram({ id: null, name: "", group: "", startDate: "", endDate: "", sites: [] }); setSitesCollapsed(false);
                        setIppView("setup");
                      }}>
                      + New Program
                    </button>
                  </div>
                </div>

                {visiblePrograms.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>{ippPrograms.length === 0 ? "No IPP programs yet" : "No IPP programs for " + division}</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{ippPrograms.length === 0 ? "Create a program to define visit schedules and task lists for a customer group." : "Toggle off the division filter to see all programs."}</div>
                  </div>
                ) : grouped.map(function(gRow) {
                  return (
                    <div key={gRow.group} style={{ marginBottom: 28 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e2e8f0" }}>
                        {gRow.group}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {gRow.programs.map(function(prog) {
                          const totalTasks = prog.sites.reduce(function(s, site) {
                            return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) { return ts + tasks.length; }, 0);
                          }, 0);
                          const doneTasks = prog.sites.reduce(function(s, site) {
                            return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                              return ts + tasks.filter(t => (t.completions || []).length > 0).length;
                            }, 0);
                          }, 0);
                          const totalVisits = prog.sites.reduce(function(s, site) { return s + (site.visitCount || 0); }, 0);
                          const doneVisits = prog.sites.reduce(function(s, site) {
                            const allVis = { ...knaVisits, ...kcanVisits };
                            return s + ((allVis[site.contractId] || []).length);
                          }, 0);
                          const totalHours = prog.sites.reduce(function(s, site) {
                            return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                              return ts + tasks.reduce(function(hs, t) { return hs + (parseFloat(t.hours) || 0); }, 0);
                            }, 0);
                          }, 0);
                          const doneHours = prog.sites.reduce(function(s, site) {
                            const allVis = { ...knaVisits, ...kcanVisits };
                            return s + ((allVis[site.contractId] || []).reduce(function(vs, v) { return vs + (v.actualHours || 0); }, 0));
                          }, 0);
                          return (
                            <div key={prog.id}
                              onClick={function() { setSelectedProgram(prog); setIppView("detail"); }}
                              style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                              onMouseEnter={function(ev) { ev.currentTarget.style.borderColor = "#2563eb"; ev.currentTarget.style.background = "#f8faff"; }}
                              onMouseLeave={function(ev) { ev.currentTarget.style.borderColor = "#e2e8f0"; ev.currentTarget.style.background = "#fff"; }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2235" }}>{prog.name}</div>
                                  <span style={{ fontSize: 10, color: "#94a3b8", background: "#f1f5f9", borderRadius: 3, padding: "1px 6px" }}>{prog.startDate && prog.endDate ? prog.startDate + " - " + prog.endDate : "No dates set"}</span>
                                  <span style={{ fontSize: 10, color: "#64748b" }}>{prog.sites.length} site{prog.sites.length !== 1 ? "s" : ""}</span>
                                </div>
                                {(function() {
                                  const vPct = totalVisits > 0 ? Math.round(doneVisits / totalVisits * 100) : 0;
                                  const hPct = totalHours > 0 ? Math.round(doneHours / totalHours * 100) : 0;
                                  const tPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
                                  const statRows = [
                                    { label: "Visits", done: doneVisits, total: totalVisits, pct: vPct, fmt: function(v) { return v; } },
                                    { label: "Hours",  done: doneHours,  total: totalHours,  pct: hPct, fmt: function(v) { return v.toFixed(1); } },
                                    { label: "Tasks",  done: doneTasks,  total: totalTasks,  pct: tPct, fmt: function(v) { return v; } },
                                  ];
                                  return (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                      {statRows.map(function(row) {
                                        const color = row.pct === 100 ? "#059669" : row.pct > 50 ? "#d97706" : "#2563eb";
                                        return (
                                          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 10, color: "#64748b", width: 36, flexShrink: 0 }}>{row.label}</span>
                                            <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 3, height: 5, maxWidth: 180 }}>
                                              <div style={{ height: "100%", width: row.pct + "%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
                                            </div>
                                            <span style={{ fontSize: 10, color: color, fontWeight: 700, width: 70, textAlign: "right", flexShrink: 0 }}>{row.fmt(row.done)}/{row.fmt(row.total)} - {row.pct}%</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                              <div style={{ display: "flex", gap: 8 }} onClick={function(ev) { ev.stopPropagation(); }}>
                                <button className="btn-sm" onClick={function() { setEditingProgram({ ...prog }); setSitesCollapsed(true); setIppView("setup"); }}
                                  style={{ fontSize: 10 }}>Edit</button>
                                <button className="btn-sm" style={{ fontSize: 10, color: "#dc2626", border: "1px solid #fca5a5" }}
                                  onClick={function() { if (window.confirm("Delete this IPP program?")) deleteIppProgram(prog.id); }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // ── PROGRAM SETUP VIEW ─────────────────────────────────────────
          if (ippView === "setup" && editingProgram) {
            const prog = editingProgram;
            const groupContracts = allContracts.filter(c => c.corporateGroup === prog.group);
            const isNew = !prog.id;
            const sitesCollapsed = ippUiState.sitesCollapsed;

            const updateProg = function(field, val) {
              setEditingProgram(function(p) { return { ...p, [field]: val }; });
            };
            const toggleSite = function(contractId, contractDivision) {
              setEditingProgram(function(p) {
                const exists = (p.sites || []).find(s => s.contractId === contractId && s._division === contractDivision);
                if (exists) {
                  const newSites = p.sites.filter(s => !(s.contractId === contractId && s._division === contractDivision));
                  const stillInOther = ippPrograms.some(saved => saved.id !== p.id && (saved.sites || []).some(s => s.contractId === contractId && s._division === contractDivision));
                  if (!stillInOther) {
                    const removeIppTag = function(ctrcts) {
                      return ctrcts.map(c => {
                        if (c.id !== contractId) return c;
                        const team = (c.team || "").split(", ").filter(t => t !== "IPP").join(", ");
                        return { ...c, team };
                      });
                    };
                    if (contractDivision === "KNA") setKnaContracts(removeIppTag);
                    else setKcanContracts(removeIppTag);
                  }
                  return { ...p, sites: newSites };
                } else {
                  return { ...p, sites: [...(p.sites || []), { contractId, visitCount: 4, visitTasks: {}, _division: contractDivision }] };
                }
              });
            };
            const updateSite = function(contractId, field, val, siteDivision) {
              setEditingProgram(function(p) {
                return { ...p, sites: p.sites.map(function(s) {
                  if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                  if (field === "visitCount") {
                    const n = parseInt(val) || 1;
                    const existing = s.visitTasks || {};
                    const newVT = {};
                    for (let i = 1; i <= n; i++) { newVT[i] = existing[i] || []; }
                    return { ...s, visitCount: n, visitTasks: newVT };
                  }
                  return { ...s, [field]: val };
                })};
              });
            };
            const addTask = function(contractId, visitNo, siteDivision) {
              setEditingProgram(function(p) {
                return { ...p, sites: p.sites.map(function(s) {
                  if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                  const vt = s.visitTasks || {};
                  const tasks = vt[visitNo] || [];
                  return { ...s, visitTasks: { ...vt, [visitNo]: [...tasks, { id: Date.now() + Math.random(), category: "", description: "", completions: [] }] } };
                })};
              });
            };
            const updateTask = function(contractId, visitNo, taskId, field, val, siteDivision) {
              setEditingProgram(function(p) {
                return { ...p, sites: p.sites.map(function(s) {
                  if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                  const vt = s.visitTasks || {};
                  return { ...s, visitTasks: { ...vt, [visitNo]: (vt[visitNo] || []).map(function(t) {
                    return t.id === taskId ? { ...t, [field]: val } : t;
                  })}};
                })};
              });
            };
            const removeTask = function(contractId, visitNo, taskId, siteDivision) {
              setEditingProgram(function(p) {
                return { ...p, sites: p.sites.map(function(s) {
                  if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                  const vt = s.visitTasks || {};
                  return { ...s, visitTasks: { ...vt, [visitNo]: (vt[visitNo] || []).filter(t => t.id !== taskId) }};
                })};
              });
            };

            const canSave = prog.name && prog.group && prog.startDate && prog.endDate && (prog.sites || []).length > 0;

            return (
              <div style={{ padding: "24px 28px", maxWidth: 900, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <button className="btn-sm" onClick={function() { setIppView("list"); setEditingProgram(null); }}>Back</button>
                  <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>
                    {isNew ? "NEW IPP PROGRAM" : "EDIT IPP PROGRAM"}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Program Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 10 }}>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Program Name</label>
                      <input value={prog.name} onChange={function(ev) { updateProg("name", ev.target.value); }}
                        placeholder="e.g. Alsco IPP 2026" style={{ width: "100%" }} />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Customer Group</label>
                      <select value={prog.group} onChange={function(ev) { updateProg("group", ev.target.value); updateProg("sites", []); }} style={{ width: "100%" }}>
                        <option value="">-- Select group --</option>
                        {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div className="form-field" style={{ margin: 0, position: "relative", zIndex: 2 }}>
                      <label>Start Date</label>
                      <input type="date" value={prog.startDate || ""} onFocus={function(ev) { ev.target.showPicker && ev.target.showPicker(); }} onChange={function(ev) { updateProg("startDate", ev.target.value); }} style={{ width: "100%", position: "relative" }} />
                    </div>
                    <div className="form-field" style={{ margin: 0, position: "relative", zIndex: 1 }}>
                      <label>End Date</label>
                      <input type="date" value={prog.endDate || ""} onFocus={function(ev) { ev.target.showPicker && ev.target.showPicker(); }} onChange={function(ev) { updateProg("endDate", ev.target.value); }} style={{ width: "100%", position: "relative" }} />
                    </div>
                  </div>
                </div>

                {prog.group && (
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: sitesCollapsed ? 0 : 14 }}
                      onClick={function() { setSitesCollapsed(!sitesCollapsed); }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Participating Sites — {prog.group}
                        <span style={{ marginLeft: 8, color: "#2563eb" }}>({(prog.sites || []).length} enrolled)</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#94a3b8", userSelect: "none" }}>{sitesCollapsed ? "> Show" : "v Hide"}</span>
                    </div>
                    {!sitesCollapsed && (groupContracts.length === 0 ? (
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>No active contracts found for {prog.group}.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {groupContracts.map(function(c) {
                          const enrolled = (prog.sites || []).find(s => s.contractId === c.id && s._division === c._division);
                          return (
                            <label key={c.id + "-" + c._division} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                              background: enrolled ? "rgba(37,99,235,0.05)" : "#f8fafc", border: "1px solid " + (enrolled ? "rgba(37,99,235,0.2)" : "#e2e8f0") }}>
                              <input type="checkbox" checked={!!enrolled} onChange={function() { toggleSite(c.id, c._division); }}
                                style={{ accentColor: "#2563eb" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a2235" }}>{c.customer}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.extensionDate || "No term set"} - {c.contractedHours + "h"}</div>
                              </div>
                              {enrolled && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={function(ev) { ev.preventDefault(); }}>
                                  <span style={{ fontSize: 11, color: "#64748b" }}>Visits:</span>
                                  <input type="number" min={1} max={12} value={enrolled.visitCount}
                                    onChange={function(ev) { updateSite(c.id, "visitCount", ev.target.value, c._division); }}
                                    style={{ width: 50, padding: "2px 6px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 12, textAlign: "center" }} />
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                {(prog.sites || []).length > 0 && (function() {
                  const taskDrag = ippUiState.taskDrag || null;
                  const setTaskDrag = function(v) { setIppUiState(function(s) { return { ...s, taskDrag: v }; }); };
                  const dragOverVisit = ippUiState.dragOverVisit || null;
                  const setDragOverVisit = function(v) { setIppUiState(function(s) { return { ...s, dragOverVisit: v }; }); };

                  const moveTask = function(contractId, fromVNo, taskId, toVNo, siteDivision) {
                    if (fromVNo === toVNo) return;
                    setEditingProgram(function(p) {
                      return { ...p, sites: p.sites.map(function(s) {
                        if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                        const vt = s.visitTasks || {};
                        const fromTasks = vt[fromVNo] || [];
                        const task = fromTasks.find(t => t.id === taskId);
                        if (!task) return s;
                        return { ...s, visitTasks: {
                          ...vt,
                          [fromVNo]: fromTasks.filter(t => t.id !== taskId),
                          [toVNo]: [...(vt[toVNo] || []), task],
                        }};
                      })};
                    });
                  };

                  return (
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Task List by Site & Visit</div>
                      {(prog.sites || []).map(function(site) {
                        const c = findContractForSite(site);
                        if (!c) return null;
                        const n = site.visitCount || 1;
                        return (
                          <div key={site.contractId + "-" + (site._division || "")} style={{ marginBottom: 24 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a2235", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #e2e8f0" }}>
                              {c.customer}
                              <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 8 }}>{n} visit{n !== 1 ? "s" : ""}</span>
                            </div>
                            {Array.from({ length: n }, function(_, i) { return i + 1; }).map(function(vNo) {
                              const tasks = (site.visitTasks || {})[vNo] || [];
                              const isDropTarget = dragOverVisit && dragOverVisit.contractId === site.contractId && dragOverVisit.vNo === vNo
                                && taskDrag && taskDrag.contractId === site.contractId && taskDrag.fromVisitNo !== vNo;
                              return (
                                <div key={vNo} style={{ marginBottom: 12, paddingLeft: 12,
                                  borderLeft: isDropTarget ? "3px solid #2563eb" : "2px solid #e2e8f0",
                                  background: isDropTarget ? "rgba(37,99,235,0.03)" : "transparent",
                                  transition: "border-color 0.1s, background 0.1s" }}
                                  onDragOver={function(ev) { ev.preventDefault(); setDragOverVisit({ contractId: site.contractId, vNo }); }}
                                  onDragLeave={function() { setDragOverVisit(null); }}
                                  onDrop={function(ev) {
                                    ev.preventDefault();
                                    if (taskDrag && taskDrag.contractId === site.contractId) {
                                      moveTask(site.contractId, taskDrag.fromVisitNo, taskDrag.taskId, vNo, site._division);
                                    }
                                    setTaskDrag(null);
                                    setDragOverVisit(null);
                                  }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.1)", borderRadius: 3, padding: "2px 8px" }}>Visit {vNo}</span>
                                    <button className="btn-sm" style={{ fontSize: 9, padding: "2px 8px" }}
                                      onClick={function() { addTask(site.contractId, vNo, site._division); }}>+ Task</button>
                                  </div>
                                  {tasks.length === 0 && (
                                    <div style={{ fontSize: 11, color: isDropTarget ? "#2563eb" : "#94a3b8", fontStyle: "italic", paddingLeft: 4 }}>
                                      {isDropTarget ? "Drop here to move task" : "No tasks defined"}
                                    </div>
                                  )}
                                  {tasks.map(function(task) {
                                    const isDragging = taskDrag && taskDrag.taskId === task.id;
                                    return (
                                      <div key={task.id}
                                        draggable={true}
                                        onDragStart={function(ev) {
                                          ev.dataTransfer.effectAllowed = "move";
                                          setTaskDrag({ contractId: site.contractId, fromVisitNo: vNo, taskId: task.id });
                                        }}
                                        onDragEnd={function() { setTaskDrag(null); setDragOverVisit(null); }}
                                        style={{ display: "grid", gridTemplateColumns: "16px 1fr 2fr 70px 24px", gap: 6, marginBottom: 4, alignItems: "center",
                                          opacity: isDragging ? 0.4 : 1, cursor: "grab" }}>
                                        <span style={{ color: "#94a3b8", fontSize: 13, cursor: "grab", userSelect: "none", textAlign: "center" }}
                                          title="Drag to move to another visit">::</span>
                                        <input value={task.category} onChange={function(ev) { updateTask(site.contractId, vNo, task.id, "category", ev.target.value, site._division); }}
                                          onMouseDown={function(ev) { ev.stopPropagation(); }}
                                          placeholder="Category"
                                          style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11 }} />
                                        <input value={task.description} onChange={function(ev) { updateTask(site.contractId, vNo, task.id, "description", ev.target.value, site._division); }}
                                          onMouseDown={function(ev) { ev.stopPropagation(); }}
                                          placeholder="Description"
                                          style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11 }} />
                                        <input type="number" step="0.25" min="0" value={task.hours || ""}
                                          onChange={function(ev) { updateTask(site.contractId, vNo, task.id, "hours", ev.target.value, site._division); }}
                                          onMouseDown={function(ev) { ev.stopPropagation(); }}
                                          placeholder="Hrs"
                                          style={{ padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, textAlign: "center", width: "100%" }} />
                                        <button onClick={function() { removeTask(site.contractId, vNo, task.id, site._division); }}
                                          style={{ background: "none", border: "none", color: "#dc2626", fontSize: 14, cursor: "pointer", padding: 0 }}>x</button>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" disabled={!canSave}
                    style={{ fontSize: 12, padding: "9px 24px", opacity: canSave ? 1 : 0.5 }}
                    onClick={function() {
                      if (isNew) {
                        addIppProgram(editingProgram);
                      } else {
                        updateIppProgram(editingProgram.id, editingProgram);
                      }
                      setEditingProgram(null);
                      setIppView("list");
                    }}>
                    {isNew ? "Create Program" : "Save Changes"}
                  </button>
                  <button className="btn-sm" style={{ fontSize: 12, padding: "9px 16px" }}
                    onClick={function() { setIppView("list"); setEditingProgram(null); setSitesCollapsed(false); }}>
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          // ── PROGRAM DETAIL VIEW ────────────────────────────────────────
          if (ippView === "detail" && selectedProgram) {
            const prog = ippPrograms.find(p => p.id === selectedProgram.id) || selectedProgram;
            const activeSiteId = selectedSiteId || (prog.sites[0] && prog.sites[0].contractId);

            const totalTasks = prog.sites.reduce(function(s, site) {
              return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) { return ts + tasks.length; }, 0);
            }, 0);
            const doneTasks = prog.sites.reduce(function(s, site) {
              return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                return ts + tasks.filter(t => (t.completions || []).length > 0).length;
              }, 0);
            }, 0);
            const totalVisits = prog.sites.reduce(function(s, site) { return s + (site.visitCount || 0); }, 0);
            const doneVisits = prog.sites.reduce(function(s, site) {
              const allVis = { ...knaVisits, ...kcanVisits };
              return s + ((allVis[site.contractId] || []).length);
            }, 0);
            const totalHours = prog.sites.reduce(function(s, site) {
              return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                return ts + tasks.reduce(function(hs, t) { return hs + (parseFloat(t.hours) || 0); }, 0);
              }, 0);
            }, 0);
            const doneHours = prog.sites.reduce(function(s, site) {
              const allVis = { ...knaVisits, ...kcanVisits };
              return s + ((allVis[site.contractId] || []).reduce(function(vs, v) { return vs + (v.actualHours || 0); }, 0));
            }, 0);

            return (
              <div style={{ padding: "24px 28px", maxWidth: 960, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
                  <button className="btn-sm" onClick={function() { setIppView("list"); setSelectedProgram(null); }}>Back</button>
                  <div style={{ flex: 1 }}>
                    <div className="cond" style={{ fontSize: 22, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>{prog.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{prog.group} - {prog.startDate && prog.endDate ? prog.startDate + " - " + prog.endDate : "No dates set"} - {prog.sites.length} site{prog.sites.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-sm" style={{ fontSize: 10 }}
                      onClick={function() { setEditingProgram({ ...prog }); setSitesCollapsed(true); setIppView("setup"); }}>Edit</button>
                  </div>
                </div>

                {(function() {
                  const vPct = totalVisits > 0 ? Math.round(doneVisits / totalVisits * 100) : 0;
                  const hPct = totalHours > 0 ? Math.round(doneHours / totalHours * 100) : 0;
                  const tPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
                  const statRows = [
                    { label: "Visits", done: doneVisits, total: totalVisits, pct: vPct, fmt: function(v) { return v; } },
                    { label: "Hours",  done: doneHours,  total: totalHours,  pct: hPct, fmt: function(v) { return v.toFixed(1); } },
                    { label: "Tasks",  done: doneTasks,  total: totalTasks,  pct: tPct, fmt: function(v) { return v; } },
                  ];
                  return (
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
                      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                        <div style={{ textAlign: "center", minWidth: 48 }}>
                          <div style={{ fontSize: 26, fontWeight: 700, color: "#1a2235" }}>{prog.sites.length}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sites</div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                          {statRows.map(function(row) {
                            const color = row.pct === 100 ? "#059669" : row.pct > 50 ? "#d97706" : "#2563eb";
                            return (
                              <div key={row.label}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2235", letterSpacing: "0.04em" }}>{row.label}</span>
                                  <span style={{ fontSize: 11, color: color, fontWeight: 700 }}>{row.fmt(row.done)} / {row.fmt(row.total)} - {row.pct}%</span>
                                </div>
                                <div style={{ background: "#e2e8f0", borderRadius: 4, height: 8 }}>
                                  <div style={{ height: "100%", width: row.pct + "%", background: color, borderRadius: 4, transition: "width 0.4s" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Sites</div>
                    {prog.sites.map(function(site) {
                      const c = findContractForSite(site);
                      if (!c) return null;
                      const siteDone = Object.values(site.visitTasks || {}).reduce(function(s, tasks) { return s + tasks.filter(t => (t.completions || []).length > 0).length; }, 0);
                      const siteTotal = Object.values(site.visitTasks || {}).reduce(function(s, tasks) { return s + tasks.length; }, 0);
                      const isActive = activeSiteId === site.contractId;
                      return (
                        <div key={site.contractId}
                          onClick={function() { setSelectedSiteId(site.contractId); }}
                          style={{ padding: "10px 12px", borderRadius: 6, cursor: "pointer", marginBottom: 4,
                            background: isActive ? "rgba(37,99,235,0.08)" : "#fff",
                            border: "1px solid " + (isActive ? "rgba(37,99,235,0.3)" : "#e2e8f0") }}>
                          <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: "#1a2235", marginBottom: 3 }}>{c.customer}</div>
                          <div style={{ fontSize: 10, color: siteDone === siteTotal && siteTotal > 0 ? "#059669" : "#d97706" }}>
                            {siteDone}/{siteTotal} tasks
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ flex: 1 }}>
                    {(function() {
                      const site = prog.sites.find(s => s.contractId === activeSiteId);
                      if (!site) return <div style={{ color: "#94a3b8" }}>Select a site</div>;
                      const c = findContractForSite(site);
                      const n = site.visitCount || 1;
                      return (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2235", marginBottom: 14 }}>{c && c.customer}</div>
                          {Array.from({ length: n }, function(_, i) { return i + 1; }).map(function(vNo) {
                            const tasks = (site.visitTasks || {})[vNo] || [];
                            const vDone = tasks.filter(t => (t.completions || []).length > 0).length;
                            return (
                              <div key={vNo} style={{ marginBottom: 16, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: vDone === tasks.length && tasks.length > 0 ? "rgba(5,150,105,0.06)" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb" }}>Visit {vNo}</span>
                                  <span style={{ fontSize: 11, color: vDone === tasks.length && tasks.length > 0 ? "#059669" : "#d97706", fontWeight: 700 }}>
                                    {vDone}/{tasks.length} complete
                                  </span>
                                </div>
                                {tasks.length === 0 ? (
                                  <div style={{ padding: "12px 14px", color: "#94a3b8", fontSize: 11, fontStyle: "italic" }}>No tasks defined for this visit</div>
                                ) : (
                                  <div>
                                    {tasks.map(function(task) {
                                      const done = (task.completions || []).length > 0;
                                      const lastComp = done ? task.completions[task.completions.length - 1] : null;
                                      return (
                                        <div key={task.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr 1fr 160px 80px", gap: 0, alignItems: "center",
                                          borderBottom: "1px solid #f1f5f9", padding: "8px 14px",
                                          background: done ? "rgba(5,150,105,0.03)" : "#fff" }}>
                                          <div style={{ fontSize: 14, color: done ? "#059669" : "#cbd5e1" }}>{done ? "V" : "o"}</div>
                                          <div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: done ? "#059669" : "#1a2235" }}>{task.category || <span style={{ color: "#94a3b8" }}>—</span>}</div>
                                          </div>
                                          <div style={{ fontSize: 11, color: "#64748b" }}>{task.description || "—"}</div>
                                          <div style={{ fontSize: 10, color: "#94a3b8" }}>
                                            {lastComp ? lastComp.date + (lastComp.techs ? " · " + lastComp.techs : "") : "—"}
                                          </div>
                                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            {done ? (
                                              <button className="btn-sm" style={{ fontSize: 9, padding: "2px 8px", color: "#64748b" }}
                                                onClick={function() { revertIppTaskCompletion(prog.id, site.contractId, vNo, task.id); }}>
                                                Revert
                                              </button>
                                            ) : (
                                              <button className="btn-sm" style={{ fontSize: 9, padding: "2px 8px", background: "#059669", color: "#fff", border: "none", borderRadius: 3 }}
                                                onClick={function() {
                                                  const d = prompt("Completion date (YYYY-MM-DD):", new Date().toISOString().slice(0,10));
                                                  if (!d) return;
                                                  const tech = prompt("Technician(s):", "");
                                                  recordIppTaskCompletion(prog.id, site.contractId, vNo, task.id, d, tech);
                                                }}>
                                                Mark Done
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

      </div>

      {/* RENEWAL MODAL */}
      {renewalContract && (function() {
        const c = renewalContract;
        const renewalCount = (c.renewalHistory || []).length;
        const nextYears = getNextTermYears(renewForm.extensionDate || "");

        const Field = function({ label, children }) {
          return (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              {children}
            </div>
          );
        };

        const inputStyle = { width: "100%", fontSize: 12, padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 4, boxSizing: "border-box" };
        const changed = [];
        if (renewForm.extensionDate !== c.extensionDate) changed.push("Term dates");
        if (String(renewForm.contractedHours) !== String(c.contractedHours)) changed.push("Contracted hours");
        if (String(renewForm.hourlyRate) !== String(c.hourlyRate)) changed.push("Hourly rate");
        if (String(renewForm.suggestedVisits) !== String(c.suggestedVisits)) changed.push("Suggested visits");
        if (renewForm.salesman !== (c.salesman || "")) changed.push("Salesman");
        if (renewForm.notes !== (c.notes || "")) changed.push("Notes");
        YEARS.forEach(y => { if (String(renewForm["hours" + y] || 0) !== String(c["hours" + y] || 0)) changed.push(y + " hours"); });

        const newContractValue = (parseFloat(renewForm.contractedHours) || 0) * (parseFloat(renewForm.hourlyRate) || 0);

        return (
          <div className="modal-overlay" onClick={ev => ev.target === ev.currentTarget && setRenewalContract(null)}>
            <div style={{ background: "#fff", borderRadius: 8, width: 820, maxWidth: "95vw", maxHeight: "90vh",
              overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
              onClick={ev => ev.stopPropagation()}>

              <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                      CONTRACT RENEWAL {renewalCount > 0 ? "- Term " + (renewalCount + 1) : "- First Renewal"}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{c.customer}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {c.team || "—"}{c.contractNo ? " - Contract #" + c.contractNo : ""}
                      {renewalCount > 0 && <span style={{ color: "#6366f1" }}> - {renewalCount} previous renewal{renewalCount > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <button onClick={() => setRenewalContract(null)}
                    style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>x</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, flex: 1, overflowY: "auto" }}>
                <div style={{ padding: "20px 24px", borderRight: "1px solid #e2e8f0", background: "#fafafa" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>
                    CURRENT TERM
                  </div>
                  {[
                    { label: "Term Dates", val: c.extensionDate || "—" },
                    { label: "Contracted Hours", val: (c.contractedHours || 0) + " hrs" },
                    { label: "Hourly Rate", val: c.hourlyRate ? "$" + c.hourlyRate + "/hr" : "—" },
                    { label: "Contract Value", val: c.contractAmount ? "$" + Math.round(c.contractAmount).toLocaleString() : "—" },
                    { label: "Suggested Visits", val: c.suggestedVisits || "—" },
                    { label: "Salesman", val: c.salesman || "—" },
                    { label: "Parts Discount", val: c.partsDiscount || "—" },
                    { label: "Labor Discount", val: c.laborDiscount || "—" },
                    { label: "Premium Billing", val: c.premiumBilling || "—" },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#1a2235", fontWeight: 600 }}>{item.val}</div>
                    </div>
                  ))}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 3 }}>Hours by Year</div>
                    {YEARS.filter(y => (c["hours" + y] || 0) > 0).map(y => (
                      <div key={y} style={{ fontSize: 12, color: "#1a2235" }}>{y}: {c["hours" + y]} hrs</div>
                    ))}
                  </div>
                  {(c.renewalHistory || []).length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>Renewal History</div>
                      {c.renewalHistory.map((h, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, color: "#1a2235" }}>Term {i + 1}:</span> {h.extensionDate} - {h.contractedHours}hrs - ${h.hourlyRate}/hr
                          <span style={{ color: "#94a3b8" }}> (renewed {h.renewedAt})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#2563eb", textTransform: "uppercase", marginBottom: 16 }}>
                    NEW TERM
                  </div>

                  <Field label="Term Dates">
                    <input style={{ ...inputStyle, color: renewForm.extensionDate !== c.extensionDate ? "#2563eb" : "#1a2235", fontWeight: renewForm.extensionDate !== c.extensionDate ? 700 : 400 }}
                      value={renewForm.extensionDate || ""} onChange={ev => {
                        const val = ev.target.value;
                        const hoursUpdate = allocateHoursByYear(val, renewForm.contractedHours || 0, renewForm.suggestedVisits);
                        setRenewForm(f => ({ ...f, extensionDate: val, ...hoursUpdate }));
                      }} placeholder="M/D/YY-M/D/YY" />
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Contracted Hours">
                      <input type="number" ref={renewHoursRef}
                        style={{ ...inputStyle, color: String(renewForm.contractedHours) !== String(c.contractedHours) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.contractedHours) !== String(c.contractedHours) ? 700 : 400 }}
                        defaultValue={renewForm.contractedHours || ""}
                        onBlur={ev => {
                          const totalHrs = parseFloat(ev.target.value) || 0;
                          const hoursUpdate = allocateHoursByYear(renewForm.extensionDate, totalHrs, renewForm.suggestedVisits);
                          setRenewForm(f => ({ ...f, contractedHours: totalHrs, ...hoursUpdate }));
                        }} />
                    </Field>
                    <Field label="Hourly Rate">
                      <input type="number" style={{ ...inputStyle, color: String(renewForm.hourlyRate) !== String(c.hourlyRate) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.hourlyRate) !== String(c.hourlyRate) ? 700 : 400 }}
                        value={renewForm.hourlyRate || ""} onChange={ev => setRenewForm(f => ({ ...f, hourlyRate: parseFloat(ev.target.value) || 0 }))} />
                    </Field>
                  </div>

                  {newContractValue > 0 && (
                    <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 4, padding: "8px 12px", marginBottom: 12, fontSize: 12 }}>
                      New contract value: <strong style={{ color: "#2563eb" }}>${Math.round(newContractValue).toLocaleString()}</strong>
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Hours by Year</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {YEARS.map(y => (
                        <div key={y} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#64748b", width: 32 }}>{y}</span>
                          <input type="number" style={{ ...inputStyle, flex: 1, color: nextYears.includes(y) ? "#1a2235" : "#cbd5e1" }}
                            value={renewForm["hours" + y] || ""} placeholder="0"
                            onChange={ev => setRenewForm(f => ({ ...f, ["hours" + y]: parseFloat(ev.target.value) || 0 }))} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Suggested Visits">
                      <input type="number" style={{ ...inputStyle, color: String(renewForm.suggestedVisits) !== String(c.suggestedVisits) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.suggestedVisits) !== String(c.suggestedVisits) ? 700 : 400 }}
                        value={renewForm.suggestedVisits || ""} onChange={ev => {
                          const nVisits = parseInt(ev.target.value) || 0;
                          const hoursUpdate = allocateHoursByYear(renewForm.extensionDate, parseFloat(renewForm.contractedHours) || 0, nVisits);
                          setRenewForm(f => ({ ...f, suggestedVisits: ev.target.value, ...hoursUpdate }));
                        }} />
                    </Field>
                    <Field label="Salesman">
                      <input style={inputStyle} value={renewForm.salesman || ""} onChange={ev => setRenewForm(f => ({ ...f, salesman: ev.target.value }))} />
                    </Field>
                    <Field label="Parts Discount">
                      <input style={inputStyle} value={renewForm.partsDiscount || ""} onChange={ev => setRenewForm(f => ({ ...f, partsDiscount: ev.target.value }))} />
                    </Field>
                    <Field label="Labor Discount">
                      <input style={inputStyle} value={renewForm.laborDiscount || ""} onChange={ev => setRenewForm(f => ({ ...f, laborDiscount: ev.target.value }))} />
                    </Field>
                  </div>

                  <Field label="Notes">
                    <textarea style={{ ...inputStyle, height: 56, resize: "vertical" }} value={renewForm.notes || ""}
                      onChange={ev => setRenewForm(f => ({ ...f, notes: ev.target.value }))} />
                  </Field>

                  {changed.length > 0 && (
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 4, padding: "8px 12px", marginTop: 4, fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: "#6366f1" }}>Changes: </span>
                      <span style={{ color: "#64748b" }}>{changed.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: "14px 28px", borderTop: "1px solid #e2e8f0", background: "#f8fafc",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  Fields highlighted in <span style={{ color: "#2563eb", fontWeight: 700 }}>blue</span> have changed from the current term.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRenewalContract(null)}
                    style={{ fontSize: 12, padding: "8px 18px", background: "none", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                  <button onClick={commitRenewal}
                    style={{ fontSize: 12, padding: "8px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>
                    Confirm Renewal
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

        {/* ACTIVITY VIEW */}
        {view === "activity" && (function() {
          // Load activity on first render of this tab
          // Auto-refresh is handled by useEffect on view change

          const ACTION_LABELS = {
            contract_added: "Contract Added",
            contract_edited: "Contract Edited",
            contract_updated: "Contract Updated",
            contract_deleted: "Contract Deleted",
            contract_renewed: "Contract Renewed",
            contract_archived: "Contract Archived",
            visit_logged: "Visit Logged",
            visit_edited: "Visit Edited",
            visit_deleted: "Visit Deleted",
            visit_rescheduled: "Visit Rescheduled",
            ipp_created: "IPP Program Created",
            ipp_updated: "IPP Program Updated",
            ipp_deleted: "IPP Program Deleted",
          };
          const ACTION_COLORS = {
            contract_added: "#059669",
            contract_edited: "#2563eb",
            contract_updated: "#2563eb",
            contract_deleted: "#dc2626",
            contract_renewed: "#7c3aed",
            contract_archived: "#d97706",
            visit_logged: "#0891b2",
            visit_edited: "#0891b2",
            visit_deleted: "#dc2626",
            visit_rescheduled: "#d97706",
            ipp_created: "#7c3aed",
            ipp_updated: "#7c3aed",
            ipp_deleted: "#dc2626",
          };
          const ACTION_ICONS = {
            contract_added: "+",
            contract_edited: "~",
            contract_updated: "~",
            contract_deleted: "x",
            contract_renewed: "R",
            contract_archived: "A",
            visit_logged: "V",
            visit_edited: "~",
            visit_deleted: "x",
            visit_rescheduled: "↻",
            ipp_created: "P+",
            ipp_updated: "P~",
            ipp_deleted: "Px",
          };

          const actionTypes = [...new Set(activityLog.map(a => a.action_type))].sort();

          const filtered = activityLog.filter(function(a) {
            if (activityFilter !== "all" && a.action_type !== activityFilter) return false;
            if (activitySearch) {
              const q = activitySearch.toLowerCase();
              const name = (a.contract_name || "").toLowerCase();
              const email = (a.user_email || "").toLowerCase();
              const action = (ACTION_LABELS[a.action_type] || a.action_type).toLowerCase();
              if (!name.includes(q) && !email.includes(q) && !action.includes(q)) return false;
            }
            return true;
          });

          const pageCount = Math.ceil(filtered.length / ACTIVITY_PAGE_SIZE);
          const pageItems = filtered.slice(activityPage * ACTIVITY_PAGE_SIZE, (activityPage + 1) * ACTIVITY_PAGE_SIZE);

          function fmtTime(ts) {
            const d = new Date(ts);
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return "just now";
            if (diffMins < 60) return diffMins + "m ago";
            const diffHrs = Math.floor(diffMins / 60);
            if (diffHrs < 24) return diffHrs + "h ago";
            const diffDays = Math.floor(diffHrs / 24);
            if (diffDays < 7) return diffDays + "d ago";
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
          }

          function fmtFull(ts) {
            const d = new Date(ts);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          }

          function renderDetails(a) {
            const d = a.details || {};
            const parts = [];
            if (d.division) parts.push(d.division);
            if (d.date) parts.push("date: " + d.date);
            if (d.hours) parts.push(d.hours + " hrs");
            if (d.techs) parts.push("techs: " + d.techs);
            if (d.newTerm) parts.push("new term: " + d.newTerm);
            if (d.rate) parts.push("rate: $" + d.rate);
            if (d.changes) parts.push("changed: " + d.changes.join(", "));
            if (d.eqHours && Object.keys(d.eqHours).length > 0) parts.push("eq: " + Object.keys(d.eqHours).join(", "));
            if (d.visitNo) parts.push("visit #" + d.visitNo);
            if (d.movedTo) parts.push("moved to " + d.movedTo);
            if (d.programName) parts.push(d.programName);
            if (d.group) parts.push("group: " + d.group);
            if (d.sites) parts.push(d.sites + " site" + (d.sites !== 1 ? "s" : ""));
            return parts.length > 0 ? parts.join(" · ") : null;
          }

          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>ACTIVITY LOG</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    {filtered.length} event{filtered.length !== 1 ? "s" : ""}{activityFilter !== "all" ? " (filtered)" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    placeholder="Search name, email, action..."
                    value={activitySearch}
                    onChange={e => { setActivitySearch(e.target.value); setActivityPage(0); }}
                    style={{ width: 220 }}
                  />
                  <select value={activityFilter} onChange={e => { setActivityFilter(e.target.value); setActivityPage(0); }} style={{ width: 180 }}>
                    <option value="all">All Actions</option>
                    {actionTypes.map(t => <option key={t} value={t}>{ACTION_LABELS[t] || t}</option>)}
                  </select>
                  <button className="btn-sm" onClick={loadActivityLog} style={{ fontSize: 11, padding: "5px 12px" }}>
                    Refresh
                  </button>
                </div>
              </div>

              {activityLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>Loading activity...</div>
              ) : pageItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>No activity found</div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  {pageItems.map(function(a, idx) {
                    const color = ACTION_COLORS[a.action_type] || "#64748b";
                    const icon = ACTION_ICONS[a.action_type] || "?";
                    const label = ACTION_LABELS[a.action_type] || a.action_type;
                    const details = renderDetails(a);
                    return (
                      <div key={a.id} style={{
                        display: "grid", gridTemplateColumns: "36px 1fr 140px 120px",
                        gap: 12, alignItems: "center", padding: "10px 16px",
                        borderBottom: idx < pageItems.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: idx % 2 === 0 ? "#fff" : "#fafbfc",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: color + "15", color: color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700,
                        }}>
                          {icon}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
                            {a.contract_name && (
                              <span style={{ fontSize: 12, color: "#1a2235", fontWeight: 500,
                                cursor: a.contract_id ? "pointer" : "default",
                                textDecoration: a.contract_id ? "underline" : "none",
                                textDecorationColor: "#cbd5e1",
                              }}
                              onClick={a.contract_id ? function() {
                                const c = [...knaContracts, ...kcanContracts].find(x => x.id === a.contract_id);
                                if (c) { setSelectedContract(c); }
                              } : undefined}
                              >{a.contract_name}</span>
                            )}
                          </div>
                          {details && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{details}</div>}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          {a.user_email ? a.user_email.split("@")[0] : <span style={{ color: "#cbd5e1" }}>—</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right" }} title={fmtFull(a.created_at)}>
                          {fmtTime(a.created_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {pageCount > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
                  <button className="btn-sm" disabled={activityPage === 0} onClick={() => setActivityPage(p => p - 1)} style={{ fontSize: 11, padding: "4px 10px" }}>Prev</button>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Page {activityPage + 1} of {pageCount}</span>
                  <button className="btn-sm" disabled={activityPage >= pageCount - 1} onClick={() => setActivityPage(p => p + 1)} style={{ fontSize: 11, padding: "4px 10px" }}>Next</button>
                </div>
              )}
            </div>
          );
        })()}

      {/* ADD CONTRACT MODAL */}
      {showAddForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddForm(false)}>
          <div className="modal">
            <div className="cond" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, letterSpacing: "0.05em", color: "#0f172a" }}>NEW CONTRACT</div>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn: "span 2" }}>
                <label>Customer Name</label>
                <input value={addForm.customer} onChange={e => updateAddFormField("customer", e.target.value)} style={{ width: "100%" }} />
              </div>
              <div className="form-field">
                <label>Customer #</label>
                <input value={addForm.customerNo} onChange={e => updateAddFormField("customerNo", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Contract #</label>
                <input value={addForm.contractNo || ""} onChange={e => updateAddFormField("contractNo", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Customer PO</label>
                <input value={addForm.customerPO || ""} onChange={e => updateAddFormField("customerPO", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Equipment Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                  {EQUIPMENT_TYPES.map(function(t) {
                    const checked = (addForm.team || "").split(", ").filter(Boolean).includes(t);
                    return (
                      <label key={t} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                        <input type="checkbox" checked={checked} onChange={function(e) {
                          const current = (addForm.team || "").split(", ").filter(Boolean);
                          const updated = e.target.checked ? [...current, t] : current.filter(x => x !== t);
                          const ordered = EQUIPMENT_TYPES.filter(x => updated.includes(x));
                          updateAddFormField("team", ordered.join(", "));
                        }} />
                        {t}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-field">
                <label>Suggested Visits</label>
                <input type="number" min="0" value={addForm.suggestedVisits || ""} placeholder="e.g. 4" onChange={e => updateAddFormField("suggestedVisits", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Corporate Group</label>
                <select value={addForm.corporateGroup || "None"} onChange={e => { if (e.target.value === "__add__") { const name = prompt("Enter new corporate group name:"); if (name && name.trim()) { addExtraGroup(name.trim()); updateAddFormField("corporateGroup", name.trim()); } } else { updateAddFormField("corporateGroup", e.target.value); } }}>
                  {allCorporateGroups.map(g => <option key={g}>{g}</option>)}
                  <option value="__add__">+ Add Group...</option>
                </select>
              </div>
              <div className="form-field">
                <label>Travel Costs</label>
                <select value={addForm.travelCosts} onChange={e => updateAddFormField("travelCosts", e.target.value)}>
                  <option>Billable</option><option>All inclusive</option>
                </select>
              </div>
              <div className="form-field">
                <label>Contract Start Date</label>
                <input value={addForm._startDate || ""} placeholder="e.g. 1/1/26" onChange={e => updateAddFormField("_startDate", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Contract End Date</label>
                <input value={addForm._endDate || ""} placeholder="e.g. 12/31/26" onChange={e => updateAddFormField("_endDate", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Contracted Hours</label>
                <input type="number" value={addForm.contractedHours || ""} placeholder="e.g. 120" onChange={e => updateAddFormField("contractedHours", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-field">
                <label>Hourly Rate ($)</label>
                <input type="number" value={addForm.hourlyRate || ""} placeholder="e.g. 185" onChange={e => updateAddFormField("hourlyRate", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-field">
                <label>Salesman</label>
                <input value={addForm.salesman || ""} placeholder="e.g. J. Smith" onChange={e => updateAddFormField("salesman", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Parts Discount</label>
                <input value={addForm.partsDiscount || ""} placeholder="e.g. 10%" onChange={e => updateAddFormField("partsDiscount", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Labor Discount</label>
                <input value={addForm.laborDiscount || ""} placeholder="e.g. 5%" onChange={e => updateAddFormField("laborDiscount", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Premium Billing</label>
                <input value={addForm.premiumBilling || ""} placeholder="e.g. Net 30" onChange={e => updateAddFormField("premiumBilling", e.target.value)} />
              </div>
              <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
                <input type="checkbox" id="autoRenewAdd" checked={!!addForm.autoRenew} onChange={e => updateAddFormField("autoRenew", e.target.checked)} style={{ width: "auto" }} />
                <label htmlFor="autoRenewAdd" style={{ fontSize: 11, color: "#1a2235", textTransform: "none", letterSpacing: 0, cursor: "pointer", marginBottom: 0 }}>Auto Renew</label>
              </div>
              <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                <label>Notes</label>
                <textarea
                  value={addForm.notes || ""}
                  onChange={e => updateAddFormField("notes", e.target.value)}
                  placeholder="Add any notes about this contract..."
                  style={{ width: "100%", minHeight: 90, resize: "vertical", fontFamily: "inherit", fontSize: 12, padding: 8, border: "1px solid #cbd5e1", borderRadius: 4, boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Live calculation summary */}
            {(() => {
              const hrs = addForm.contractedHours || 0;
              const rate = addForm.hourlyRate || 0;
              const start = addForm._startDate || "";
              const end = addForm._endDate || "";
              const totalValue = hrs * rate;

              // Calculate contract length in months for monthly revenue
              let months = 0;
              const sMatch = start.match(/^(\d+)\/(\d+)\/(\d+)$/);
              const eMatch = end.match(/^(\d+)\/(\d+)\/(\d+)$/);
              if (sMatch && eMatch) {
                const sY = 2000 + parseInt(sMatch[3]), sM = parseInt(sMatch[1]), sD = parseInt(sMatch[2]);
                const eY = 2000 + parseInt(eMatch[3]), eM = parseInt(eMatch[1]), eD = parseInt(eMatch[2]);
                months = Math.max(1, (eY - sY) * 12 + (eM - sM) + (eD >= sD ? 1 : 0));
              }
              const monthly = months > 0 && totalValue > 0 ? totalValue / months : 0;

              // Auto year allocation
              const extDate = start && end ? start + "-" + end : "";
              const allocated = autoAllocateHours(extDate, hrs);
              const yearRows = YEARS.filter(y => (allocated["hours" + y] || 0) > 0);

              const hasCalc = hrs > 0 && rate > 0;
              const hasAlloc = yearRows.length > 0;

              return (
                <div style={{ marginTop: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Contract Summary</div>

                  {/* Value calculations */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: hasAlloc ? 14 : 0 }}>
                    {[
                      { label: "Total Contract Value", value: hasCalc ? fmtRev(totalValue) : "--", accent: "#2563eb" },
                      { label: "Monthly Revenue", value: monthly > 0 ? fmtRev(monthly) : "--", accent: "#059669", sub: months > 0 ? "over " + months + " months" : "" },
                      { label: "Contract Period", value: months > 0 ? months + " months" : "--", accent: "#7c3aed", sub: start && end ? start + " - " + end : "" },
                    ].map(function(item) {
                      return (
                        <div key={item.label} style={{ textAlign: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 4, padding: "10px 8px" }}>
                          <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: item.accent, lineHeight: 1 }}>{item.value}</div>
                          {item.sub && <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{item.sub}</div>}
                          <div style={{ fontSize: 9, color: "#64748b", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Year allocation breakdown */}
                  {hasAlloc && (
                    <div>
                      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Hours Allocated by Year</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {yearRows.map(function(y) {
                          const h = allocated["hours" + y] || 0;
                          const pct = Math.round((h / hrs) * 100);
                          return (
                            <div key={y} style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 4, padding: "8px 10px", textAlign: "center" }}>
                              <div className="cond" style={{ fontSize: 18, fontWeight: 700, color: y < 2026 ? "#dc2626" : "#2563eb", lineHeight: 1 }}>{h}</div>
                              <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{y} &bull; {pct}%</div>
                              <div style={{ marginTop: 4, height: 3, background: "#f1f5f9", borderRadius: 2 }}>
                                <div style={{ width: pct + "%", height: "100%", background: y < 2026 ? "#dc2626" : "#2563eb", borderRadius: 2 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!hasCalc && !hasAlloc && (
                    <div style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", padding: "8px 0" }}>
                      Enter contracted hours, hourly rate, and dates to see calculations.
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-sm" onClick={() => { setShowAddForm(false); setAddFormManual({}); setAddForm({ ...emptyContract }); }}>Cancel</button>
              <button className="btn-primary" onClick={async () => {
                // Build final contract with computed monthlyRevenue, extensionDate, and year allocation
                const hrs = addForm.contractedHours || 0;
                const rate = addForm.hourlyRate || 0;
                const start = addForm._startDate || "";
                const end = addForm._endDate || "";
                const totalValue = hrs * rate;
                const sMatch = start.match(/^(\d+)\/(\d+)\/(\d+)$/);
                const eMatch = end.match(/^(\d+)\/(\d+)\/(\d+)$/);
                let months = 0;
                if (sMatch && eMatch) {
                  const sY = 2000 + parseInt(sMatch[3]), sM = parseInt(sMatch[1]), sD = parseInt(sMatch[2]);
                  const eY = 2000 + parseInt(eMatch[3]), eM = parseInt(eMatch[1]), eD = parseInt(eMatch[2]);
                  months = Math.max(1, (eY - sY) * 12 + (eM - sM) + (eD >= sD ? 1 : 0));
                }
                const monthly = months > 0 && totalValue > 0 ? Math.round((totalValue / months) * 100) / 100 : addForm.monthlyRevenue;
                const extDate = start && end ? start + "-" + end : addForm.extensionDate;
                const allocated = autoAllocateHours(extDate, hrs);
                const finalContract = { ...addForm, ...allocated, monthlyRevenue: monthly, extensionDate: extDate, hourlyRate: rate };
                delete finalContract._startDate;
                delete finalContract._endDate;
                delete finalContract.id;
                // Save to Supabase and get UUID
                const dbContract = { ...mapContractToDb(finalContract), division };
                const { data, error } = await supabase.from('contracts').insert(dbContract).select().single();
                if (error) { console.error('Failed to add contract:', error); return; }
                const saved = mapDbToContract(data);
                setContracts(prev => [...prev, saved].sort((a, b) => a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())));
                logActivity('contract_added', saved.id, saved.customer, { division });
                setAddForm({ ...emptyContract });
                setAddFormManual({});
                setShowAddForm(false);
              }} disabled={!addForm.customer}>Add Contract</button>
            </div>
          </div>
        </div>
      )}
      {/* VISIT SLIDE-OUT PANEL */}
      {confirmDeleteId ? (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" style={{ width: 380, padding: 32 }} onClick={function(e) { e.stopPropagation(); }}>
            <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Delete Contract?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
              You are about to delete:
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2235", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, padding: "10px 14px", marginBottom: 24 }}>
              {(contracts.find(function(c) { return c.id === confirmDeleteId; }) || {}).customer}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-sm" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn-danger" style={{ padding: "8px 18px", fontSize: 12 }} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedContract ? <VisitPanel contract={selectedContract} visits={visits} newVisit={newVisit} setNewVisit={setNewVisit} onAddVisit={addVisit} onDeleteVisit={deleteVisit} onEditVisit={editVisit} onClose={() => setSelectedContract(null)} getVisitedHours={getVisitedHours} onUpdateContract={updateContract} onDeleteContract={(id) => { setSelectedContract(null); deleteContract(id); }} allContracts={[...knaContracts, ...kcanContracts]} allVisits={{ ...knaVisits, ...kcanVisits }} customerHistory={customerHistory} onSaveCustomerHistory={saveCustomerHistory} allCorporateGroups={allCorporateGroups} onGroupSelect={handleGroupSelect} getOverridesForContract={getOverridesForContract} /> : null}

    </div>
  );
}
