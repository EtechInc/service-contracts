import { useState, useMemo } from "react";

// localStorage helpers (replaces Claude window.storage API)
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
  { id: 29, customer: "Image First; Clifton, NJ", customerNo: "40118", team: "Log", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 875.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 30, customer: "Image First - Denver, CO", customerNo: "39557", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 39.25, hours2025: 120, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
  { id: 31, customer: "ImageFirst Kansas City (Faultless)", customerNo: "30091", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1437.50, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 3.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26" },
  { id: 32, customer: "Image First Seattle - Kent, WA", customerNo: "33726", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 27.25, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27" },
  { id: 33, customer: "ImageFirst St. Louis (Faultless)", customerNo: "28258", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 248.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26" },
  { id: 34, customer: "ImageFirst; Westbrook, ME", customerNo: "40052", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26" },
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
const EQUIPMENT_TYPES = ["W1", "W2", "W3", "Log"];
const TEAMS = ["All", "W1", "W2", "W3", "Log"];
const TRAVEL_OPTIONS = ["Billable", "All inclusive", "All Inclusive"];

const CORPORATE_GROUPS = [
  "None",
  "Pure Star",
  "ImageFirst / Faultless",
  "Cintas",
  "Century Linen",
  "Economy Linen",
  "Magic Laundry",
  "The Boca Raton",
];

const emptyContract = {
  customer: "", customerNo: "", team: "", travelCosts: "Billable",
  corporateGroup: "None",
  monthlyRevenue: 0, contractedHours: 0, hourlyRate: 0, contractAmount: 0,
  hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0,
  extensionDate: "",
  partsDiscount: "", laborDiscount: "", premiumBilling: "", salesman: "", autoRenew: false,
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

// Visit data stored as { [contractId]: [{id, visitNo, date, actualHours, techs, comments}] }
const INITIAL_VISITS = {};

function VisitPanel({ contract: c, visits, newVisit, setNewVisit, onAddVisit, onDeleteVisit, onEditVisit, onClose, getVisitedHours, onUpdateContract, onDeleteContract, allContracts, allVisits, customerHistory, onSaveCustomerHistory }) {
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
                  <label>Corporate Group</label>
                  <select value={contractForm.corporateGroup || "None"} onChange={e => setContractForm(f => ({ ...f, corporateGroup: e.target.value }))} style={{ width: "100%" }}>
                    {CORPORATE_GROUPS.map(g => <option key={g}>{g}</option>)}
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
  const [division, setDivision] = useState("KNA");

  // Per-division contract data
  const [knaContracts, setKnaContracts] = useState(INITIAL_CONTRACTS);
  const [kcanContracts, setKcanContracts] = useState([
    { id: 1, customer: "CH St-Joseph-de-la-Providence", customerNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 1872.16, contractedHours: 260, contractAmount: 45500.0, hours2024: 0, hours2025: 220, hours2026: 220, hours2027: 0, hours2028: 0, extensionDate: "12/31/2023" },
    { id: 2, customer: "CHU Ste-Justine", customerNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 4353.02, contractedHours: 260, contractAmount: 45500.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "2/28/2025" },
    { id: 3, customer: "HLS Ottawa", customerNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 540, contractAmount: 94500.0, hours2024: 0, hours2025: 250, hours2026: 250, hours2027: 0, hours2028: 0, extensionDate: "" },
    { id: 4, customer: "HLS Toronto", customerNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 504, contractAmount: 88200.0, hours2024: 0, hours2025: 200, hours2026: 200, hours2027: 0, hours2028: 0, extensionDate: "" },
    { id: 5, customer: "BCM", customerNo: "", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 292.75, contractAmount: 51231.25, hours2024: 0, hours2025: 0, hours2026: 292.75, hours2027: 0, hours2028: 0, extensionDate: "" },
    { id: 6, customer: "CISSS De Lanaudiere", customerNo: "", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 0, contractAmount: 0.0, hours2024: 0, hours2025: 80, hours2026: 80, hours2027: 0, hours2028: 0, extensionDate: "" },
  ]);

  // Per-division visit data
  const [knaVisits, setKnaVisits] = useState(INITIAL_VISITS);
  const [kcanVisits, setKcanVisits] = useState({});

  // Per-division monthly snapshots
  const [knaSnapshots, setKnaSnapshots] = useState({ "2026-01": 7620.75, "2026-02": 7822 });
  const [kcanSnapshots, setKcanSnapshots] = useState({});

  // Customer history: { [customerNo]: { 2017: { hrs, rev }, 2018: ... } }
  const [customerHistory, setCustomerHistory] = useState({});

  // Active division data (derived)
  const contracts = division === "KNA" ? knaContracts : kcanContracts;
  const setContracts = division === "KNA" ? setKnaContracts : setKcanContracts;
  const visits = division === "KNA" ? knaVisits : kcanVisits;
  const setVisits = division === "KNA" ? setKnaVisits : setKcanVisits;
  const monthlySnapshots = division === "KNA" ? knaSnapshots : kcanSnapshots;
  const setMonthlySnapshots = division === "KNA" ? setKnaSnapshots : setKcanSnapshots;
  const [selectedContract, setSelectedContract] = useState(null); // slide-out panel
  const [newVisit, setNewVisit] = useState({ date: "", actualHours: "", techs: "", comments: "" });
  const [view, setView] = useState("dashboard");
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

  function saveEdit(id) {
    setContracts(prev => prev.map(c => c.id === id ? { ...editForm, id } : c));
    setEditingId(null);
    setEditForm(null);
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function deleteContract(id) {
    setConfirmDeleteId(id);
  }

  function updateContract(updated) {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c)
      .sort((a, b) => a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())));
    setSelectedContract(updated);
  }

  function confirmDelete() {
    setContracts(prev => prev.filter(c => c.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  }

  function addContract() {
    const newId = Math.max(...contracts.map(c => c.id)) + 1;
    const newContract = { ...addForm, id: newId };
    setContracts(prev => [...prev, newContract].sort((a, b) =>
      a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())
    ));
    setAddForm({ ...emptyContract });
    setShowAddForm(false);
  }

  function addVisit(contractId) {
    if (!newVisit.date || !newVisit.actualHours) return;
    const contractVisits = visits[contractId] || [];
    const nextNo = contractVisits.length > 0 ? Math.max(...contractVisits.map(v => v.visitNo)) + 1 : 1;
    const visit = {
      id: Date.now(),
      visitNo: nextNo,
      date: newVisit.date,
      actualHours: parseFloat(newVisit.actualHours) || 0,
      techs: newVisit.techs,
      comments: newVisit.comments,
    };
    setVisits(prev => ({ ...prev, [contractId]: [...(prev[contractId] || []), visit] }));
    setNewVisit({ date: "", actualHours: "", techs: "", comments: "" });
  }

  function deleteVisit(contractId, visitId) {
    setVisits(prev => ({ ...prev, [contractId]: (prev[contractId] || []).filter(v => v.id !== visitId) }));
  }

  function editVisit(contractId, visitId, updates) {
    setVisits(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(v => v.id === visitId ? { ...v, ...updates, actualHours: parseFloat(updates.actualHours) || 0 } : v)
    }));
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

  // Load snapshots from storage on mount
  useState(function() {
    async function loadSnapshots() {
      try {
        const knaResult = await localGet("monthly-snapshots-2026-KNA");
        if (knaResult && knaResult.value) {
          setKnaSnapshots(function(prev) { return { ...prev, ...JSON.parse(knaResult.value) }; });
        }
      } catch(e) {}
      try {
        const kcanResult = await localGet("monthly-snapshots-2026-KCAN");
        if (kcanResult && kcanResult.value) {
          setKcanSnapshots(function(prev) { return { ...prev, ...JSON.parse(kcanResult.value) }; });
        }
      } catch(e) {}
      try {
        const histResult = await localGet("customer-history");
        if (histResult && histResult.value) {
          setCustomerHistory(JSON.parse(histResult.value));
        }
      } catch(e) {}
    }
    loadSnapshots();
  });

  async function saveCustomerHistory(updated) {
    setCustomerHistory(updated);
    try {
      await localSet("customer-history", JSON.stringify(updated));
    } catch(e) {}
  }

  async function saveSnapshot(key, value) {
    const storageKey = "monthly-snapshots-2026-" + division;
    try {
      const stored = {};
      try {
        const existing = await localGet(storageKey);
        if (existing && existing.value) Object.assign(stored, JSON.parse(existing.value));
      } catch(e) {}
      stored[key] = value;
      await localSet(storageKey, JSON.stringify(stored));
      setMonthlySnapshots(function(prev) { return { ...prev, [key]: value }; });
    } catch(e) {}
  }

  // Auto-capture current month snapshot if not yet stored
  useState(function() {
    const now = new Date();
    const key = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    if (key.startsWith("2026") && !monthlySnapshots[key]) {
      saveSnapshot(key, compute2026Total());
    }
  });


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
            </div>
            <div className="mono" style={{ fontSize: 10, color: "#2563eb", letterSpacing: "0.2em", marginTop: 2 }}>
              {division === "KCAN" ? "If it's measured, it's managed, eh." : "If it's measured, it's managed."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div className="cond" style={{ fontSize: 22, fontWeight: 600, color: "#7c3aed" }}>
                {contracts.reduce((s, c) => s + (c.contractedHours || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>ANNUAL CONTRACT HRS</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="cond" style={{ fontSize: 22, fontWeight: 600, color: "#0891b2" }}>
                ${Math.round(contracts.reduce((s, c) => s + (c.contractAmount || 0), 0)).toLocaleString("en-US")}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>TOTAL REVENUE</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {[
            { id: "dashboard", label: "DASHBOARD" },
            { id: "contracts", label: "ALL CONTRACTS" },
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

            {/* YoY + Open Hours stat box */}
            {(() => {
              // Historical snapshot values (recorded on Jan 1 of the following year)
              // 2024 final = 7118 (recorded Jan 1 2025), 2025 final = 8578 (recorded Jan 1 2026)
              // 2026 uses live computed total until Jan 1 2027 when it will be snapshotted
              const now = new Date();
              const currentYear = now.getFullYear();
              const live2026 = contracts.reduce((s, c) => s + (c.contractedHours || 0), 0);

              const yoyHistorical = division === "KCAN"
                ? { 2024: 520, 2025: 1870 }
                : { 2024: 7118, 2025: 8578 };
              // Build data: include 2024 onward; 2026 = live; future years from contract data if > 0
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
              // Floor: round down to nearest 500 below (dataMin - ~20% padding)
              const yMin = Math.max(0, Math.floor((dataMin - range * 0.3) / 500) * 500);
              const yMax = Math.ceil((dataMax + range * 0.15) / 500) * 500;
              const yRange = yMax - yMin;

              // Build 4 evenly-spaced grid lines between yMin and yMax
              const gridLines = [0, 1, 2, 3, 4].map(i => yMin + Math.round((yRange / 4) * i));

              const cH = 100; const cW = 480; const pL = 44; const pB = 22; const pT = 10; const pR = 12;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const pts = yoyData.map((d, i) => ({
                x: pL + (i / (yoyData.length - 1)) * iW,
                y: pT + iH - ((d.hours - yMin) / yRange) * iH,
                ...d,
              }));
              const polyline = pts.map(p => p.x + "," + p.y).join(" ");
              const totalOpen = contracts.reduce(function(s, c) { const r = getRemainingHours(c, getVisitedHours(c.id)); return s + YEARS.reduce((ys, y) => ys + (r[y] || 0), 0); }, 0);
              const openCount = contracts.filter(c => { const r = getRemainingHours(c, getVisitedHours(c.id)); return YEARS.some(y => (r[y] || 0) > 0); }).length;
              return (
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, marginBottom: 16 }}>
                  <div className="stat-card" style={{ "--accent": "#2563eb", display: "flex", flexDirection: "column", justifyContent: "center", padding: "12px 16px" }}>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Total Open Hours</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6 }}>All years, after visits</div>
                    <div className="cond" style={{ fontSize: 36, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>{totalOpen.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{openCount} contracts with open hrs</div>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b", marginBottom: 8 }}>CONTRACTED HOURS YEAR OVER YEAR</div>
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
                      <polygon points={polyline + " " + (pL + iW) + "," + (pT + iH) + " " + pL + "," + (pT + iH)} fill="rgba(37,99,235,0.06)" />
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
                    <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>* 2026 shows current live total. Final value locked Jan 1, 2027.</div>
                  </div>
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
              const cW = 620; const cH = 110; const pL = 46; const pB = 22; const pT = 10; const pR = 10;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const barW = Math.floor(iW / 12) - 4;
              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>TOTAL OPEN HOURS BY MONTH (2024-2026)</div>
                    <button className="btn-sm" style={{ fontSize: 10 }} onClick={function() { saveSnapshot(currentKey, compute2026Total()); }}>Capture Today</button>
                  </div>
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
                          {hasData && bh > 16 && <text x={bx + barW / 2} y={by + 10} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">{d.total.toLocaleString()}</text>}
                          {!hasData && !d.isFuture && <text x={bx + barW / 2} y={pT + iH - 4} textAnchor="middle" fontSize="7" fill="#cbd5e1">-</text>}
                          <text x={bx + barW / 2} y={pT + iH + 14} textAnchor="middle" fontSize="8" fill={d.isCurrentMonth ? "#2563eb" : "#64748b"} fontWeight={d.isCurrentMonth ? "700" : "400"}>{d.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Snapshot captured on the 1st of each month. Use "Capture Today" to record manually.</div>
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
              const cW = 480; const cH = 110; const pL = 46; const pB = 28; const pT = 10; const pR = 10;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const barW = Math.floor(iW / 4) - 20;
              const colors = ["#2563eb", "#7c3aed", "#0891b2", "#059669"];

              // Y-axis grid lines
              const gridVals = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxQ * f));

              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", marginBottom: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>REMAINING HOURS -- NEXT 4 QUARTERS</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>based on contract dates & visits logged</div>
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
                {CORPORATE_GROUPS.filter(g => g !== "None").map(g => <option key={g}>{g}</option>)}
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

            <div style={{ overflowX: "auto", borderRadius: 4, border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", minWidth: 200 }} onClick={() => handleSort("customer")}>Customer <SortIcon col="customer" /></th>
                    <th onClick={() => handleSort("customerNo")}>Cust # <SortIcon col="customerNo" /></th>
                    <th onClick={() => handleSort("team")}>Eq. Type <SortIcon col="team" /></th>
                    <th onClick={() => handleSort("corporateGroup")}>Group <SortIcon col="corporateGroup" /></th>
                    <th onClick={() => handleSort("travelCosts")}>Travel <SortIcon col="travelCosts" /></th>
                    <th onClick={() => handleSort("contractAmount")}>Contract Amt <SortIcon col="contractAmount" /></th>
                    <th onClick={() => handleSort("contractedHours")}>Contracted <SortIcon col="contractedHours" /></th>
                    {YEARS.map(y => <th key={y} style={{ color: y < 2026 ? "#dc2626" : undefined }} onClick={() => handleSort("hours" + y)}>{y} <SortIcon col={"hours" + y} /></th>)}
                    <th onClick={() => handleSort("netDue")}>Net Due <SortIcon col="netDue" /></th>
                    <th style={{ minWidth: 160 }} onClick={() => handleSort("extensionDate")}>Extension Date <SortIcon col="extensionDate" /></th>
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
                          <td><input value={editForm.customerNo} onChange={e => setEditForm(f => ({ ...f, customerNo: e.target.value }))} style={{ width: 80 }} /></td>
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
                            <select value={editForm.corporateGroup || "None"} onChange={e => setEditForm(f => ({ ...f, corporateGroup: e.target.value }))}>
                              {CORPORATE_GROUPS.map(g => <option key={g}>{g}</option>)}
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
                        <td style={{ color: "#64748b", textAlign: "center" }}>{c.customerNo}</td>
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
      </div>

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
                <label>Corporate Group</label>
                <select value={addForm.corporateGroup || "None"} onChange={e => updateAddFormField("corporateGroup", e.target.value)}>
                  {CORPORATE_GROUPS.map(g => <option key={g}>{g}</option>)}
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
              <button className="btn-primary" onClick={() => {
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
                const newId = Math.max(0, ...contracts.map(c => c.id)) + 1;
                const finalContract = { ...addForm, ...allocated, id: newId, monthlyRevenue: monthly, extensionDate: extDate, hourlyRate: rate };
                delete finalContract._startDate;
                delete finalContract._endDate;
                setContracts(prev => [...prev, finalContract].sort((a, b) => a.customer.toLowerCase().localeCompare(b.customer.toLowerCase())));
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

      {selectedContract ? <VisitPanel contract={selectedContract} visits={visits} newVisit={newVisit} setNewVisit={setNewVisit} onAddVisit={addVisit} onDeleteVisit={deleteVisit} onEditVisit={editVisit} onClose={() => setSelectedContract(null)} getVisitedHours={getVisitedHours} onUpdateContract={updateContract} onDeleteContract={(id) => { setSelectedContract(null); deleteContract(id); }} allContracts={[...knaContracts, ...kcanContracts]} allVisits={{ ...knaVisits, ...kcanVisits }} customerHistory={customerHistory} onSaveCustomerHistory={saveCustomerHistory} /> : null}

    </div>
  );
}
