import { useState, useMemo } from "react";

const INITIAL_CONTRACTS = [
  { id: 1, customer: "Alsco; Honolulu, HI", billingNo: "", shippingNo: "26942", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 2, customer: "Arrow Linen Supply - Garden City, NY", billingNo: "", shippingNo: "33932", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 2916.67, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 40, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27", hourlyRate: 175, suggestedVisits: 4 },
  { id: 3, customer: "Blue Water Linen (Heritage Hotels)", billingNo: "", shippingNo: "35027", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 2100.00, contractedHours: 144, contractAmount: 25200.0, hours2024: 0, hours2025: 0, hours2026: 144, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27", hourlyRate: 175, suggestedVisits: 4 },
  { id: 4, customer: "The Boca Raton - Burner Maintenance", billingNo: "", shippingNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 583.33, contractedHours: 40, contractAmount: 7000.0, hours2024: 0, hours2025: 0, hours2026: 40, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 5, customer: "The Boca Raton - Press Pan Reseal", billingNo: "", shippingNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 729.17, contractedHours: 50, contractAmount: 8750.0, hours2024: 0, hours2025: 0, hours2026: 50, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 6, customer: "The Boca Raton", billingNo: "", shippingNo: "40263", team: "W1, W3", travelCosts: "Billable", corporateGroup: "The Boca Raton", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 29, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 7, customer: "Brady Linen; West Mayflower", billingNo: "", shippingNo: "32834", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 2333.33, contractedHours: 160, contractAmount: 28000.0, hours2024: 0, hours2025: 96.5, hours2026: 130, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 8, customer: "Breakers, The; Palm Beach", billingNo: "", shippingNo: "33752", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 9, customer: "Breck Commercial Laundry, Silverthorne, CO", billingNo: "", shippingNo: "34330", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 485.21, contractedHours: 64, contractAmount: 11200.0, hours2024: 0, hours2025: 9.25, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 10, customer: "Century Linen, Gloversville, NY", billingNo: "", shippingNo: "38983", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Century Linen", monthlyRevenue: 1275.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 70.75, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 11, customer: "Century Linen - Somerville/Worcester", billingNo: "", shippingNo: "40128/40127", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Century Linen", monthlyRevenue: 2625.00, contractedHours: 180, contractAmount: 31500.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "8/1/25-7/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 12, customer: "Chickasaw", billingNo: "", shippingNo: "33680", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1133.33, contractedHours: 96, contractAmount: 16800.0, hours2024: 0, hours2025: 0, hours2026: 96, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27", hourlyRate: 175, suggestedVisits: 4 },
  { id: 13, customer: "Cintas; Eau Claire, WI", billingNo: "", shippingNo: "41227", team: "Log", travelCosts: "Billable", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 14, customer: "Cintas; Liverpool", billingNo: "", shippingNo: "39178", team: "Log", travelCosts: "Billable", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 87.5, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 15, customer: "Cintas; Philadelphia", billingNo: "", shippingNo: "39171", team: "Log", travelCosts: "All inclusive", corporateGroup: "Cintas", monthlyRevenue: 0, contractedHours: 160, contractAmount: 28000.0, hours2024: 0, hours2025: 62, hours2026: 80, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 16, customer: "Cleveland Clinic", billingNo: "", shippingNo: "38704", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 5250.00, contractedHours: 360, contractAmount: 63000.0, hours2024: 0, hours2025: 0, hours2026: 91.5, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 17, customer: "Continental Linen Service; Kalamazoo", billingNo: "", shippingNo: "32682", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 18, customer: "Denman Linen, Quincy, IL", billingNo: "", shippingNo: "35407", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 71.5, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 19, customer: "Disney Cruise Lines", billingNo: "", shippingNo: "41320", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 240, contractAmount: 42000.0, hours2024: 0, hours2025: 58.5, hours2026: 240, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 20, customer: "Economy Linen; Dayton, OH", billingNo: "", shippingNo: "39809", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Economy Linen", monthlyRevenue: 0, contractedHours: 340, contractAmount: 59500.0, hours2024: 0, hours2025: 0, hours2026: 223.25, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 21, customer: "Economy Linen; Zanesville, OH", billingNo: "", shippingNo: "32831", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Economy Linen", monthlyRevenue: 583.33, contractedHours: 40, contractAmount: 7000.0, hours2024: 0, hours2025: 0, hours2026: 59, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 22, customer: "Emerald Textiles - Livingston, CA", billingNo: "", shippingNo: "39007", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 33.75, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 23, customer: "Fairmont Scottsdale Princess, Scottsdale, AZ", billingNo: "", shippingNo: "35489", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1400.00, contractedHours: 96, contractAmount: 16800.0, hours2024: 0, hours2025: 61.75, hours2026: 96, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 24, customer: "Fresh Start Laundry - Goodwill Colorado Springs", billingNo: "", shippingNo: "32853", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 17, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 25, customer: "General Linen; Somersworth, NH", billingNo: "", shippingNo: "34011", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 18.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 26, customer: "Grindstone Laundry; Hinckley, MN", billingNo: "", shippingNo: "34548", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 30, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 27, customer: "Halifax Linen; Roanoke Rapids, NC", billingNo: "", shippingNo: "26725", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 10, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 28, customer: "HCSC Laundry, Allentown, PA", billingNo: "", shippingNo: "33812", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1275.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 19.75, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 29, customer: "Image First; Clifton, NJ", billingNo: "", shippingNo: "40118", team: "Log", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 875.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 30, customer: "Image First - Denver, CO", billingNo: "", shippingNo: "39557", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 39.25, hours2025: 120, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 31, customer: "ImageFirst Kansas City (Faultless)", billingNo: "", shippingNo: "30091", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1437.50, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 3.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 32, customer: "Image First Seattle - Kent, WA", billingNo: "", shippingNo: "33726", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 27.25, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27", hourlyRate: 175, suggestedVisits: 4 },
  { id: 33, customer: "ImageFirst St. Louis (Faultless)", billingNo: "", shippingNo: "28258", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 248.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 34, customer: "ImageFirst; Westbrook, ME", billingNo: "", shippingNo: "40052", team: "W1, W3", travelCosts: "Billable", corporateGroup: "ImageFirst / Faultless", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 35, customer: "Logan's Healthcare Laundry", billingNo: "", shippingNo: "35449", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 36, customer: "M & F Laundry; Northridge, CA", billingNo: "", shippingNo: "39618", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 33.25, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 37, customer: "Magic Laundry; Montebello, CA", billingNo: "", shippingNo: "33725", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Magic Laundry", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 64.25, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "10/1/25-9/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 38, customer: "Magic Laundry; San Bernardino, CA", billingNo: "", shippingNo: "39810", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Magic Laundry", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 39, customer: "Mastel Linen - Phoenix AZ", billingNo: "", shippingNo: "33808", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 760.00, contractedHours: 64, contractAmount: 11200.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "5/1/25-4/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 40, customer: "Mayo Clinic; Jacksonville, FL", billingNo: "", shippingNo: "40115", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 384, contractAmount: 67200.0, hours2024: 0, hours2025: 26, hours2026: 210, hours2027: 0, hours2028: 0, extensionDate: "12/1/25-11/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 41, customer: "Metropolitan Detroit Laundry Services", billingNo: "", shippingNo: "38593", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 7.75, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 42, customer: "Michigan Premier Laundry (CHS) - Saginaw, MI", billingNo: "", shippingNo: "34369", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1750.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 113.25, hours2027: 0, hours2028: 0, extensionDate: "11/1/25-10/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 43, customer: "Morgan Services, Inc", billingNo: "", shippingNo: "39082", team: "Log", travelCosts: "All Inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 12.25, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "2/1/26-1/31/27", hourlyRate: 175, suggestedVisits: 4 },
  { id: 44, customer: "NWHCL - Bellingham, WA", billingNo: "", shippingNo: "32779", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1134.50, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 0, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 45, customer: "New York Laundry, Orangestad, Aruba", billingNo: "", shippingNo: "32638", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1125.00, contractedHours: 100, contractAmount: 17500.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 46, customer: "Premier Linen Services; Fort Myers, FL", billingNo: "", shippingNo: "40047", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 47, customer: "Pure Star: 5 Star; Aurora, CO", billingNo: "", shippingNo: "39296", team: "Log, IPP", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 48, customer: "Pure Star: 5 Star; Chicago, IL", billingNo: "", shippingNo: "35415", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 49, customer: "Pure Star: 5 Star; Grapevine, TX", billingNo: "", shippingNo: "35541", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 50, customer: "Pure Star: 5 Star; National Harbor, MD", billingNo: "", shippingNo: "38833", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 28.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 51, customer: "Pure Star: ACL; Atlantic City, NJ", billingNo: "", shippingNo: "33494", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 59.5, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 52, customer: "Pure Star: ACL; Norwich, CT", billingNo: "", shippingNo: "39290", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 30, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 53, customer: "Pure Star: Baha Mar; Nassau, Bahamas", billingNo: "", shippingNo: "39295", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 70, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 54, customer: "Pure Star: Brady Linen, Arville; Las Vegas, NV", billingNo: "", shippingNo: "39859", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 57.5, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 55, customer: "Pure Star: Brady Linen, Losee; N. Las Vegas, NV", billingNo: "", shippingNo: "39291", team: "Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 60, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 56, customer: "Pure Star: Hotelier; Miami Lakes, FL", billingNo: "", shippingNo: "32287", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 30, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 57, customer: "Pure Star: Hotelier; Orlando, FL", billingNo: "", shippingNo: "34656", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 51.5, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 58, customer: "Pure Star: Maui Linen; Kahului, Maui", billingNo: "", shippingNo: "39048", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 12, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 59, customer: "Pure Star: United Linen; Honolulu, HI", billingNo: "", shippingNo: "27113", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 10, hours2026: 90, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 60, customer: "Pure Star: United Linen; Kailua Kona, HI", billingNo: "", shippingNo: "26992", team: "W1, W3", travelCosts: "Billable", corporateGroup: "Pure Star", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 40.5, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 4 },
  { id: 61, customer: "Radiant Services; Gardena, CA", billingNo: "", shippingNo: "27177", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 25, hours2027: 0, hours2028: 0, extensionDate: "9/1/24-8/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 62, customer: "Reino Linen - Brownstown, MI", billingNo: "", shippingNo: "35588", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 956.25, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 63, customer: "Roscoe Co. - Chicago, IL", billingNo: "", shippingNo: "35034", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 675.00, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 33, hours2026: 20, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 64, customer: "Sacramento Laundry Company", billingNo: "", shippingNo: "33794", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 30, hours2026: 15.5, hours2027: 0, hours2028: 0, extensionDate: "4/1/25-3/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 65, customer: "Servicios Estrella Azul de Occidente", billingNo: "", shippingNo: "31450", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 66, customer: "Shared Hospital Services - Portsmouth, VA", billingNo: "", shippingNo: "28331", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1500.00, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 13.5, hours2026: 120, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 67, customer: "Tender Care Laundry; Chicago, IL", billingNo: "", shippingNo: "32889", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 120, contractAmount: 21000.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "5/1/25-4/30/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 68, customer: "Texas Medical Center; Houston, TX", billingNo: "", shippingNo: "35503", team: "Log", travelCosts: "All Inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 80, contractAmount: 14000.0, hours2024: 0, hours2025: 40, hours2026: 40, hours2027: 0, hours2028: 0, extensionDate: "9/1/25-8/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 69, customer: "UniClean Cleanroom Services; Milpitas, CA", billingNo: "", shippingNo: "33281", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 60, contractAmount: 10500.0, hours2024: 0, hours2025: 0, hours2026: 30, hours2027: 0, hours2028: 0, extensionDate: "7/1/25-6/30/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 70, customer: "Vestis Services; Chicago, IL", billingNo: "", shippingNo: "38451", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 300, contractAmount: 52500.0, hours2024: 0, hours2025: 64, hours2026: 150, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 71, customer: "VLS Plants", billingNo: "", shippingNo: "Multiple", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 4000.00, contractedHours: 270, contractAmount: 47250.0, hours2024: 0, hours2025: 0, hours2026: 240, hours2027: 0, hours2028: 0, extensionDate: "1/1/26-12/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 72, customer: "White Plains Linen - Peekskill NY", billingNo: "", shippingNo: "32158", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1146.88, contractedHours: 90, contractAmount: 15750.0, hours2024: 0, hours2025: 36.5, hours2026: 60, hours2027: 0, hours2028: 0, extensionDate: "6/1/25-5/31/26", hourlyRate: 175, suggestedVisits: 6 },
  { id: 73, customer: "Shared Hospital Services - Nashville, TN", billingNo: "", shippingNo: "35119", team: "Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 375.00, contractedHours: 30, contractAmount: 4500.0, hours2024: 0, hours2025: 5.5, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "3/1/24-2/28/25", hourlyRate: 175, suggestedVisits: 6 },
  { id: 74, customer: "Northwest Healthcare - Bellingham, WA - Burner Maint", billingNo: "", shippingNo: "32779", team: "W1, W3", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 1008.47, contractedHours: 80, contractAmount: 12101.60, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "10/1/24-9/30/25", hourlyRate: 175, suggestedVisits: 6 },
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
  "ImageFirst / Faultless",
  "Cintas",
  "Century Linen",
  "Economy Linen",
  "Magic Laundry",
  "The Boca Raton",
];

const emptyContract = {
  customer: "", customerNo: "", contractNo: "", billingNo: "", shippingNo: "", team: "", travelCosts: "Billable",
  corporateGroup: "None",
  monthlyRevenue: 0, contractedHours: 0, hourlyRate: 0, contractAmount: 0,
  hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0,
  extensionDate: "",
  partsDiscount: "", laborDiscount: "", premiumBilling: "", salesman: "", autoRenew: false,
  pendingWorkOrders: [],  // WOs entered at contract creation, saved to workOrders on save
  notes: "", suggestedVisits: "", renewalHistory: [], termStartDate: "", status: "active", ippTasks: [],
};

// CorporateGroupSelect: dropdown with "Add new group..." option
function CorporateGroupSelect({ value, onChange, extraGroups, onAddGroup }) {
  const [adding, setAdding] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState("");
  const allGroups = [...CORPORATE_GROUPS, ...(extraGroups || [])];
  if (adding) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <input autoFocus value={newGroup} onChange={e => setNewGroup(e.target.value)}
          placeholder="New group name..." style={{ flex: 1, fontSize: 12, padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 4 }}
          onKeyDown={e => { if (e.key === "Enter" && newGroup.trim()) { onAddGroup(newGroup.trim()); onChange(newGroup.trim()); setAdding(false); setNewGroup(""); } if (e.key === "Escape") { setAdding(false); setNewGroup(""); } }} />
        <button onClick={() => { if (newGroup.trim()) { onAddGroup(newGroup.trim()); onChange(newGroup.trim()); } setAdding(false); setNewGroup(""); }}
          style={{ fontSize: 11, padding: "3px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
        <button onClick={() => { setAdding(false); setNewGroup(""); }}
          style={{ fontSize: 11, padding: "3px 8px", background: "none", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>x</button>
      </div>
    );
  }
  return (
    <select value={value} onChange={e => { if (e.target.value === "__add__") { setAdding(true); } else { onChange(e.target.value); } }} style={{ width: "100%" }}>
      {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
      <option value="__add__">+ Add new group...</option>
    </select>
  );
}


// EqTypeCheckboxes: checkbox list with "Add new type" inline button
function EqTypeCheckboxes({ value, onChange, extraEqTypes, onAddEqType }) {
  const [adding, setAdding] = React.useState(false);
  const [newType, setNewType] = React.useState("");
  const allTypes = [...EQUIPMENT_TYPES, ...(extraEqTypes || [])];
  const current = (value || "").split(", ").filter(Boolean);
  const handleToggle = function(t, checked) {
    const updated = checked ? [...current, t] : current.filter(x => x !== t);
    const ordered = allTypes.filter(x => updated.includes(x));
    onChange(ordered.join(", "));
  };
  const handleAdd = function() {
    const name = newType.trim().toUpperCase();
    if (!name) return;
    onAddEqType(name);
    // auto-check the new type
    const updated = [...current, name];
    const orderedAll = [...allTypes, name];
    onChange(orderedAll.filter(x => updated.includes(x)).join(", "));
    setNewType(""); setAdding(false);
  };
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 4, alignItems: "center" }}>
      {allTypes.map(function(t) {
        const checked = current.includes(t);
        return (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, cursor: "pointer" }}>
            <input type="checkbox" checked={checked} onChange={e => handleToggle(t, e.target.checked)} />
            {t}
          </label>
        );
      })}
      {adding ? (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <input autoFocus value={newType} onChange={e => setNewType(e.target.value)}
            placeholder="e.g. XL" style={{ width: 70, fontSize: 11, padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 4 }}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewType(""); } }} />
          <button onClick={handleAdd} style={{ fontSize: 11, padding: "3px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
          <button onClick={() => { setAdding(false); setNewType(""); }} style={{ fontSize: 11, padding: "3px 8px", background: "none", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>x</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ fontSize: 10, padding: "2px 7px", background: "none", border: "1px dashed #94a3b8", borderRadius: 4, cursor: "pointer", color: "#64748b", whiteSpace: "nowrap" }}>+ Add type</button>
      )}
    </div>
  );
}


// Generate a deterministic pill color for custom/unknown equipment types
function getEqPillStyle(type) {
  const known = ["w1","w2","w3","log","pp","dry","insp","ipp","irn"];
  if (known.includes(type.toLowerCase())) return null; // use CSS class
  // Hash the string to pick from a palette of colors
  const palette = [
    { bg: "rgba(6,182,212,0.1)",   color: "#0891b2", border: "rgba(6,182,212,0.3)"   }, // cyan
    { bg: "rgba(245,158,11,0.1)",  color: "#d97706", border: "rgba(245,158,11,0.3)"  }, // amber
    { bg: "rgba(16,185,129,0.1)",  color: "#059669", border: "rgba(16,185,129,0.3)"  }, // emerald
    { bg: "rgba(239,68,68,0.1)",   color: "#dc2626", border: "rgba(239,68,68,0.3)"   }, // red
    { bg: "rgba(139,92,246,0.1)",  color: "#7c3aed", border: "rgba(139,92,246,0.3)"  }, // violet
    { bg: "rgba(236,72,153,0.1)",  color: "#db2777", border: "rgba(236,72,153,0.3)"  }, // pink
    { bg: "rgba(20,184,166,0.1)",  color: "#0d9488", border: "rgba(20,184,166,0.3)"  }, // teal
    { bg: "rgba(249,115,22,0.1)",  color: "#ea580c", border: "rgba(249,115,22,0.3)"  }, // orange
  ];
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = (hash * 31 + type.charCodeAt(i)) & 0xffff;
  const c = palette[hash % palette.length];
  return { background: c.bg, color: c.color, border: "1px solid " + c.border };
}

// Render an equipment type pill — uses CSS class for known types, inline style for custom
function EqPill({ type, style }) {
  const dynStyle = getEqPillStyle(type);
  if (dynStyle) {
    return <span className="pill" style={{ ...dynStyle, ...(style || {}) }}>{type}</span>;
  }
  return <span className={"pill pill-" + type.toLowerCase()} style={style || {}}>{type}</span>;
}

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


// Parse extensionDate "M/D/YY-M/D/YY" → { start: Date, end: Date } or null
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

// Given a contract and its logged visits, compute the schedule:
// Returns array of { visitNo, targetYearMonth, status: "done"|"upcoming"|"overdue"|"unscheduled" }
// Compute suggested dates for work orders that have no scheduledDate yet.
// Spreads them evenly across the contract term. Returns WOs with targetDate filled in.
function computeWOSchedule(c, contractWOs) {
  if (!contractWOs || contractWOs.length === 0) return [];
  const dates = parseContractDates(c.extensionDate);
  const today = new Date();
  const n = contractWOs.length;

  return contractWOs.map(function(wo, i) {
    // If already has a scheduledDate, use it; otherwise suggest evenly spaced
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
  // overrides: { [visitNo]: "YYYY-MM" } — manually pinned slots
  const slotOverrides = overrides || {};
  const n = parseInt(c.suggestedVisits) || 0;
  if (n === 0) return [];
  const dates = parseContractDates(c.extensionDate);
  if (!dates) return [];
  const { start, end } = dates;
  const today = new Date();
  const contractMs = end - start;

  // ── Original baseline schedule: n visits evenly across full term ──────────
  // These are the "ideal" target dates regardless of what has happened.
  const originalTargets = [];
  for (let i = 0; i < n; i++) {
    const frac = n === 1 ? 0.5 : i / (n - 1);
    originalTargets.push(new Date(start.getTime() + frac * contractMs));
  }

  // ── Filter visits to current term only ────────────────────────────────────
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

  // ── Determine if any completed visit was late ─────────────────────────────
  // A visit is "late" if its actual date is more than ~2 weeks past its
  // original target. We use the LAST completed visit to decide whether to
  // re-spread remaining slots — if it was on time, original schedule holds.
  let wasLate = false;
  if (doneCount > 0) {
    const lastDone = completedVisits[doneCount - 1];
    const lastDoneDate = lastDone.date.length === 7
      ? new Date(lastDone.date + "-01")
      : new Date(lastDone.date);
    const originalTarget = originalTargets[doneCount - 1];
    const lateTolerance = 1000 * 60 * 60 * 24 * 14; // 14-day grace window
    wasLate = (lastDoneDate - originalTarget) > lateTolerance;
  }

  // ── Build slot list ───────────────────────────────────────────────────────
  const slots = [];

  // Done slots — pinned to actual visit date, show original target for context
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

  // Remaining slots — use original targets if on track, re-spread if late
  for (let i = 0; i < remainingCount; i++) {
    let targetDate;

    if (!wasLate) {
      // On track — keep original schedule
      targetDate = originalTargets[doneCount + i];
    } else {
      // Late — re-spread remaining visits evenly from today through contract end
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
    // If overridden to a future month, treat as upcoming even if original was overdue
    const finalStatus = upcomingOverride
      ? (new Date(upcomingOverride + "-01") < today ? "overdue" : "upcoming")
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

// Summarise a contract's schedule into a health status
function getScheduleHealth(c, contractVisits) {
  const n = parseInt(c.suggestedVisits) || 0;
  if (n === 0) return { status: "none", label: "—", color: "#94a3b8" };
  const schedule = computeSchedule(c, contractVisits);
  const overdueCount  = schedule.filter(s => s.status === "overdue").length;
  const doneCount     = schedule.filter(s => s.status === "done").length;
  const upcomingCount = schedule.filter(s => s.status === "upcoming").length;
  const dates = parseContractDates(c.extensionDate);
  const expired = dates && new Date() > dates.end;
  if (overdueCount > 0)    return { status: "overdue",  label: overdueCount + " overdue",   color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (doneCount === n)     return { status: "complete", label: "All done",                  color: "#059669", bg: "rgba(5,150,105,0.08)" };
  const next = schedule.find(s => s.status === "upcoming");
  if (next) {
    const daysUntil = Math.round((next.targetDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 30) return { status: "due-soon",  label: "Due in " + daysUntil + "d", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
    return { status: "on-track", label: "On track",                                          color: "#2563eb", bg: "rgba(37,99,235,0.08)" };
  }
  return { status: "on-track", label: doneCount + "/" + n + " done",                         color: "#2563eb", bg: "rgba(37,99,235,0.08)" };
}



// Derive effective contract status: archived > active/expired
function getContractStatus(c) {
  if (c.status === "archived") return "archived";
  const p = parseExtensionParts(c.extensionDate);
  if (p && new Date() > p.endDate) return "expired";
  return "active";
}

// ── Renewal utilities ───────────────────────────────────────────────────────

// Advance a date string "M/D/YY" by one year
function advanceDateByYear(str) {
  const m = str.trim().match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!m) return str;
  const newYear = (parseInt(m[3]) + 1) % 100;
  return m[1] + "/" + m[2] + "/" + String(newYear).padStart(2, "0");
}

// Parse extensionDate and return { startStr, endStr, startDate, endDate }
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

// Days until contract end (negative = already expired)
function daysUntilExpiry(c) {
  const p = parseExtensionParts(c.extensionDate);
  if (!p) return null;
  return Math.round((p.endDate - new Date()) / (1000 * 60 * 60 * 24));
}

// Renewal status for a contract
function getRenewalStatus(c) {
  const days = daysUntilExpiry(c);
  if (days === null) return { status: "unknown", label: "No dates", color: "#94a3b8" };
  if (days < 0)      return { status: "expired",  label: "Expired " + Math.abs(days) + "d ago", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (days <= 30)    return { status: "due",       label: "Expires in " + days + "d",            color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  return { status: "ok", label: days + "d remaining", color: "#059669", bg: "rgba(5,150,105,0.08)" };
}

// Suggest the next term's extensionDate (advance both dates by 1 year)
function suggestNextTerm(extensionDate) {
  const p = parseExtensionParts(extensionDate);
  if (!p) return "";
  return advanceDateByYear(p.startStr) + "-" + advanceDateByYear(p.endStr);
}

// Figure out which year columns are relevant for the new term
function getNextTermYears(nextExtensionDate) {
  const p = parseExtensionParts(nextExtensionDate);
  if (!p) return [];
  const years = [];
  let y = p.startDate.getFullYear();
  while (y <= p.endDate.getFullYear()) { years.push(y); y++; }
  return years;
}

// Visit data stored as { [contractId]: [{id, visitNo, date, actualHours, techs, comments}] }
const INITIAL_VISITS = {};

// Two-click confirm archive button — first click arms it, second confirms
function ConfirmArchiveButton({ onConfirm, style: extraStyle = {}, stopPropagation = false }) {
  const [armed, setArmed] = React.useState(false);
  const timerRef = React.useRef(null);

  function arm(e) {
    if (stopPropagation) e.stopPropagation();
    setArmed(true);
    // Auto-disarm after 3 seconds if no second click
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
          ✕
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

// ── IPP Task Manager Component ────────────────────────────────────────
function IppTaskManager({ tasks, onChange, readOnly }) {
  const [newTask, setNewTask] = React.useState({ description: "", category: "Mechanical" });
  const [editingId, setEditingId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  const taskList = tasks || [];

  function addTask() {
    if (!newTask.description.trim()) return;
    const task = { id: Date.now(), description: newTask.description.trim(), category: newTask.category };
    onChange([...taskList, task]);
    setNewTask({ description: "", category: "Mechanical" });
  }

  function removeTask(id) {
    onChange(taskList.filter(t => t.id !== id));
  }

  function startEdit(t) {
    setEditingId(t.id);
    setEditForm({ description: t.description, category: t.category });
  }

  function saveEdit(id) {
    onChange(taskList.map(t => t.id === id ? { ...t, ...editForm } : t));
    setEditingId(null);
    setEditForm({});
  }

  function moveTask(idx, dir) {
    const arr = [...taskList];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    onChange(arr);
  }

  const grouped = IPP_TASK_CATEGORIES.reduce((acc, cat) => {
    const items = taskList.filter(t => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: 12 }}>
      {/* Grouped task list */}
      {taskList.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: 11, fontStyle: "italic", padding: "8px 0" }}>No tasks defined yet.</div>
      ) : (
        <div style={{ marginBottom: 10 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{cat}</div>
              {items.map(function(t) {
                const idx = taskList.findIndex(x => x.id === t.id);
                if (editingId === t.id) {
                  return (
                    <div key={t.id} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "center" }}>
                      <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                        style={{ flex: 1, padding: "3px 6px", border: "1px solid #93c5fd", borderRadius: 3, fontSize: 11 }} />
                      <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                        style={{ padding: "3px 4px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 10 }}>
                        {IPP_TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <button onClick={() => saveEdit(t.id)} style={{ padding: "2px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 3, fontSize: 10, cursor: "pointer" }}>✓</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: "2px 8px", background: "none", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 10, cursor: "pointer" }}>✕</button>
                    </div>
                  );
                }
                return (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3, padding: "3px 6px", background: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                    <span style={{ flex: 1, fontSize: 11, color: "#1a2235" }}>{t.description}</span>
                    {!readOnly && (
                      <>
                        <button onClick={() => moveTask(idx, -1)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 10, cursor: "pointer", padding: "0 2px" }}>↑</button>
                        <button onClick={() => moveTask(idx, 1)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 10, cursor: "pointer", padding: "0 2px" }}>↓</button>
                        <button onClick={() => startEdit(t)} style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 9, padding: "1px 5px", borderRadius: 2, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => removeTask(t.id)} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 9, padding: "1px 5px", borderRadius: 2, cursor: "pointer" }}>✕</button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {/* Add new task row */}
      {!readOnly && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <input placeholder="Task description..." value={newTask.description}
            onChange={e => setNewTask(f => ({ ...f, description: e.target.value }))}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTask(); } }}
            style={{ flex: 1, padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 11 }} />
          <select value={newTask.category} onChange={e => setNewTask(f => ({ ...f, category: e.target.value }))}
            style={{ padding: "4px 4px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 10 }}>
            {IPP_TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addTask} style={{ padding: "4px 10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 3, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
        </div>
      )}
    </div>
  );
}

// ── Visit Task Checklist Component ────────────────────────────────────
function VisitTaskChecklist({ ippTasks, visitTasks, onChange }) {
  // visitTasks: [{ taskId, description, category, completed, notes }]
  const tasks = ippTasks || [];
  const current = visitTasks || [];

  function getVisitTask(taskId) {
    return current.find(vt => vt.taskId === taskId) || { taskId, completed: false, notes: "" };
  }

  function toggleTask(taskId, description, category) {
    const existing = getVisitTask(taskId);
    const updated = current.some(vt => vt.taskId === taskId)
      ? current.map(vt => vt.taskId === taskId ? { ...vt, completed: !vt.completed } : vt)
      : [...current, { taskId, description, category, completed: true, notes: "" }];
    onChange(updated);
  }

  function setNotes(taskId, description, category, notes) {
    const updated = current.some(vt => vt.taskId === taskId)
      ? current.map(vt => vt.taskId === taskId ? { ...vt, notes } : vt)
      : [...current, { taskId, description, category, completed: false, notes }];
    onChange(updated);
  }

  if (tasks.length === 0) return null;

  const completedCount = tasks.filter(t => {
    const vt = getVisitTask(t.id);
    return vt.completed;
  }).length;

  const grouped = IPP_TASK_CATEGORIES.reduce((acc, cat) => {
    const items = tasks.filter(t => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: 12, border: "1px solid #dbeafe", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: "#eff6ff", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em" }}>IPP Tasks This Visit</span>
        <span style={{ fontSize: 10, color: completedCount === tasks.length ? "#059669" : "#64748b", fontWeight: 700 }}>{completedCount}/{tasks.length} complete</span>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{cat}</div>
            {items.map(function(t) {
              const vt = getVisitTask(t.id);
              return (
                <div key={t.id} style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={!!vt.completed}
                      onChange={() => toggleTask(t.id, t.description, t.category)}
                      style={{ width: "auto", margin: 0, cursor: "pointer", accentColor: "#2563eb" }} />
                    <span style={{ fontSize: 11, color: vt.completed ? "#94a3b8" : "#1a2235", textDecoration: vt.completed ? "line-through" : "none", flex: 1 }}>{t.description}</span>
                  </div>
                  {vt.completed && (
                    <input placeholder="Notes for this task (optional)..." value={vt.notes || ""}
                      onChange={e => setNotes(t.id, t.description, t.category, e.target.value)}
                      style={{ marginLeft: 24, marginTop: 2, width: "calc(100% - 32px)", padding: "2px 6px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 10, color: "#64748b" }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitPanel({ contract: c, visits, newVisit, setNewVisit, onAddVisit, onDeleteVisit, onEditVisit, onClose, getVisitedHours, onUpdateContract, onDeleteContract, allContracts, allVisits, customerHistory, onSaveCustomerHistory, extraGroups, onAddGroup, extraEqTypes, onAddEqType, onRenew, onArchive, workOrders, onAddWorkOrder, onUpdateWorkOrder, onDeleteWorkOrder, onCompleteWorkOrder, onRevertWorkOrder, initialTab, onTabOpened, getContractIpp }) {
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [editVisitForm, setEditVisitForm] = useState(null);
  const [confirmDeleteVisit, setConfirmDeleteVisit] = useState(null);
  const [confirmDeleteContract, setConfirmDeleteContract] = useState(false);
  const [overrideWarning, setOverrideWarning] = useState(false);
  const [pendingWOCompletions, setPendingWOCompletions] = useState([]);
  const [woChecked, setWoChecked] = useState({});
  const [editingContract, setEditingContract] = useState(false);
  const [contractForm, setContractForm] = useState(null);
  const [panelTab, setPanelTab] = useState("visits");
  React.useEffect(function() {
    if (initialTab) { setPanelTab(initialTab); if (onTabOpened) onTabOpened(); }
  }, [initialTab]);
  // Work order local state
  const emptyWO = { title: "", description: "", estimatedHours: "", revenue: "", serialNumber: "", linkedVisitNo: "" };
  const [showAddWO, setShowAddWO] = useState(false);
  const [newWO, setNewWO] = useState(emptyWO);
  const [editingWOId, setEditingWOId] = useState(null);
  const [editWOForm, setEditWOForm] = useState(null);
  const [completingWOId, setCompletingWOId] = useState(null);
  const [completeWOForm, setCompleteWOForm] = useState({ actualHours: "", revenue: "" });
  const [confirmDeleteWOId, setConfirmDeleteWOId] = useState(null);
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

  const isDollarContract = c.trackingType === "dollars";
  const visitedDollars = (visits[c.id] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
  const contractedHours = totalOwedAllYears;
  const pct = isDollarContract
    ? (c.contractAmount > 0 ? Math.min(100, visitedDollars / c.contractAmount * 100) : 0)
    : (contractedHours > 0 ? (visitedHours / contractedHours) * 100 : 0);
  const remaining = isDollarContract
    ? Math.max(0, c.contractAmount - visitedDollars)
    : (remainingAllYears - Math.max(0, visitedHours - contractedHours));
  const isAhead = isDollarContract ? false : visitedHours > contractedHours;
  const barColor = isAhead ? "#7c3aed" : pct >= 100 ? "#dc2626" : pct >= 80 ? "#d97706" : "#059669";

  function startEditVisit(v) {
    setEditingVisitId(v.id);
    setEditVisitForm({ date: v.date, actualHours: v.actualHours, eqHours: v.eqHours || {}, techs: v.techs, comments: v.comments, tasks: v.tasks || [] });
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
                {c.contractNo ? "Contract# " + c.contractNo + " · " : ""}{c.billingNo ? "Bill# " + c.billingNo + " · " : ""}{c.shippingNo ? "Ship# " + c.shippingNo + " · " : ""}{c.team.split(", ").map(function(t) { return <EqPill key={t} type={t} style={{ marginRight: 3 }} />; })}
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
              {onRenew && <button onClick={() => onRenew(c)}
                style={{ background: "#ede9fe", border: "1px solid #c4b5fd", color: "#6366f1", fontSize: 10, padding: "3px 9px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.05em", fontWeight: 700 }}>
                🔄 RENEW
              </button>}
              {onArchive && c.status !== "archived" && <ConfirmArchiveButton onConfirm={() => onArchive(c.id)}
                style={{ fontSize: 10, padding: "3px 9px", letterSpacing: "0.05em" }} />}
              {onArchive && c.status === "archived" && onRenew && <button onClick={() => onRenew(c)}
                style={{ background: "#ede9fe", border: "1px solid #c4b5fd", color: "#6366f1", fontSize: 10, padding: "3px 9px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.05em", fontWeight: 700 }}>
                🔄 REACTIVATE
              </button>}
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
                  <label>Contract #</label>
                  <input value={contractForm.contractNo || ""} onChange={e => setContractForm(f => ({ ...f, contractNo: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Billing #</label>
                  <input value={contractForm.billingNo || ""} onChange={e => setContractForm(f => ({ ...f, billingNo: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Shipping #</label>
                  <input value={contractForm.shippingNo || ""} onChange={e => setContractForm(f => ({ ...f, shippingNo: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field">
                  <label>Corporate Group</label>
                  <CorporateGroupSelect value={contractForm.corporateGroup || "None"} onChange={val => setContractForm(f => ({ ...f, corporateGroup: val }))} extraGroups={extraGroups} onAddGroup={onAddGroup} />
                </div>
                <div className="form-field">
                  <label>Equipment Type</label>
                  <EqTypeCheckboxes value={contractForm.team || ""} onChange={val => setContractForm(f => ({ ...f, team: val }))} extraEqTypes={extraEqTypes} onAddEqType={onAddEqType} />
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
                  <label>Tracking Type</label>
                  <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                    {["hours", "dollars"].map(function(t) {
                      return (
                        <label key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer", fontWeight: contractForm.trackingType === t ? 700 : 400 }}>
                          <input type="radio" checked={(contractForm.trackingType || "hours") === t}
                            onChange={function() { setContractForm(f => ({ ...f, trackingType: t })); }} />
                          {t === "hours" ? "Hours" : "Dollar Amount"}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {(contractForm.trackingType || "hours") === "hours" ? (
                  <>
                    <div className="form-field">
                      <label>Contracted Hours</label>
                      <input type="number" value={contractForm.contractedHours || ""} onChange={e => setContractForm(f => ({ ...f, contractedHours: parseFloat(e.target.value) || 0 }))} style={{ width: "100%" }} />
                    </div>
                    <div className="form-field">
                      <label>Hourly Rate ($)</label>
                      <input type="number" value={contractForm.hourlyRate || ""} placeholder="e.g. 175" onChange={e => setContractForm(f => ({ ...f, hourlyRate: parseFloat(e.target.value) || 0 }))} style={{ width: "100%" }} />
                    </div>
                  </>
                ) : (
                  <div className="form-field">
                    <label>Contract Value ($)</label>
                    <input type="number" value={contractForm.contractAmount || ""} placeholder="e.g. 50000" onChange={e => setContractForm(f => ({ ...f, contractAmount: parseFloat(e.target.value) || 0, contractedHours: 0, hourlyRate: 0 }))} style={{ width: "100%" }} />
                  </div>
                )}
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
                <div className="form-field">
                  <label>Suggested Visits</label>
                  <input type="number" min="0" value={contractForm.suggestedVisits || ""} placeholder="e.g. 4" onChange={e => setContractForm(f => ({ ...f, suggestedVisits: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                  <input type="checkbox" id="autoRenewPanel" checked={!!contractForm.autoRenew} onChange={e => setContractForm(f => ({ ...f, autoRenew: e.target.checked }))} style={{ width: "auto" }} />
                  <label htmlFor="autoRenewPanel" style={{ fontSize: 11, color: "#1a2235", textTransform: "none", letterSpacing: 0, cursor: "pointer", marginBottom: 0 }}>Auto Renew</label>
                </div>
                <div className="form-field" style={{ gridColumn: "span 2" }}>
                  <label>Contract Notes</label>
                  <textarea value={contractForm.notes || ""} onChange={e => setContractForm(f => ({ ...f, notes: e.target.value }))} placeholder="Internal notes about this contract..." style={{ width: "100%", height: 60, resize: "vertical", fontSize: 12, padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
              {/* IPP / Scoped Task Template — shown when contract has IPP-type eq */}
              {(function() {
                const eqTypes = contractForm.team ? contractForm.team.split(", ").map(t => t.trim()).filter(Boolean) : [];
                const hasTaskEq = eqTypes.some(t => IPP_EQ_TYPES.includes(t));
                if (!hasTaskEq) return null;
                return (
                  <div style={{ marginTop: 12, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
                    <div style={{ fontSize: 10, color: "#2563eb", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>
                      📋 Scoped Task Template
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>
                      Define the tasks that must be completed across visits for this contract. Technicians will check these off when logging visits.
                    </div>
                    <IppTaskManager
                      tasks={contractForm.ippTasks || []}
                      onChange={tasks => setContractForm(f => ({ ...f, ippTasks: tasks }))}
                    />
                  </div>
                );
              })()}
              {/* Live calc summary */}
              {contractForm.contractedHours > 0 && contractForm.hourlyRate > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
                  {[
                    { label: "Contract Value", val: fmtRev(contractForm.contractedHours * contractForm.hourlyRate), color: "#2563eb" },
                    { label: "Monthly Rev", val: (function() { const s = contractForm._startDate || ""; const e2 = contractForm._endDate || ""; const sm = s.match(/^(\d+)\/(\d+)\/(\d+)$/); const em = e2.match(/^(\d+)\/(\d+)\/(\d+)$/); if (!sm || !em) return "--"; const mo = Math.max(1,(2000+parseInt(em[3])-2000-parseInt(sm[3]))*12+(parseInt(em[1])-parseInt(sm[1]))+(parseInt(em[2])>=parseInt(sm[2])?1:0)); return "$"+(contractForm.contractedHours*contractForm.hourlyRate/mo).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); })(), color: "#059669" },
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
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { label: "Contract #", val: c.contractNo || "-" },
                { label: "Billing #", val: c.billingNo || c.customerNo || "-" },
                { label: "Shipping #", val: c.shippingNo || "-" },
                { label: "Suggested Visits", val: c.suggestedVisits || "-" },
                { label: "Tracking", val: c.trackingType === "dollars" ? "$ Dollar Amount" : "Hours" },
                { label: c.trackingType === "dollars" ? "Contract Value" : "Hourly Rate", val: c.trackingType === "dollars" ? (c.contractAmount > 0 ? fmtRev(c.contractAmount) : "-") : (c.hourlyRate > 0 ? "$" + c.hourlyRate + "/hr" : "-") },
                { label: "Contract Amt", val: c.trackingType === "dollars" ? "-" : (c.contractAmount > 0 ? fmtRev(c.contractAmount) : "-") },
                { label: "Monthly Rev", val: getMonthlyRevenue(c) > 0 ? fmtRev(getMonthlyRevenue(c)) : "-" },
                { label: "Travel", val: c.travelCosts || "-" },
                { label: "Group", val: c.corporateGroup && c.corporateGroup !== "None" ? c.corporateGroup : "-" },
                { label: "Ext. Date", val: c.extensionDate || "-" },
                { label: "Salesman", val: c.salesman || "-" },
                { label: "Parts Disc.", val: c.partsDiscount || "-" },
                { label: "Labor Disc.", val: c.laborDiscount || "-" },
                { label: "Auto Renew", val: c.autoRenew ? "Yes" : "No" },
              ].map(item => (
                <div key={item.label} style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#1a2235", fontWeight: 600, marginTop: 1 }}>{item.val}</div>
                </div>
              ))}
              </div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Contract Notes</div>
                <div style={{ fontSize: 11, color: c.notes ? "#1a2235" : "#cbd5e1", lineHeight: 1.5, whiteSpace: "pre-wrap", fontStyle: c.notes ? "normal" : "italic" }}>{c.notes || "No notes"}</div>
              </div>
              {/* Visit Schedule mini-view */}
              {parseInt(c.suggestedVisits) > 0 && (function() {
                const sched = computeSchedule(c, contractVisits);
                const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Visit Schedule</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {sched.map(s => {
                        const d = s.targetDate;
                        const lbl = MONTH_NAMES[d.getMonth()] + " '" + String(d.getFullYear()).slice(2);
                        const col = s.status === "done" ? "#059669" : s.status === "overdue" ? "#dc2626" : "#2563eb";
                        const bg  = s.status === "done" ? "rgba(5,150,105,0.08)" : s.status === "overdue" ? "rgba(220,38,38,0.08)" : "rgba(37,99,235,0.08)";
                        const icon = s.status === "done" ? "✓" : s.status === "overdue" ? "!" : "◉";
                        return (
                          <div key={s.visitNo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px", background: bg, border: "1px solid " + col + "33", borderRadius: 4, minWidth: 48 }}>
                            <span style={{ fontSize: 9, color: col, fontWeight: 700 }}>{icon} V{s.visitNo}</span>
                            <span style={{ fontSize: 9, color: col, fontWeight: 600 }}>{lbl}</span>
                            {s.manuallyMoved && <span style={{ fontSize: 8, color: "#0369a1" }}>↻</span>}
                          </div>
                        );
                      })}
                        </div>
                      </div>
                    );
                  })()}
            </div>
          )}

          {/* Hours / Dollar progress bar */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {isDollarContract ? "Amount Billed" : "Hours Used"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>
                {isDollarContract
                  ? "$" + visitedDollars.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " / $" + (c.contractAmount || 0).toLocaleString("en-US")
                  : visitedHours.toFixed(1) + " / " + contractedHours + " hrs"}
              </span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: Math.min(100, pct) + "%", background: barColor }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11 }}>
              <span style={{ color: "#64748b" }}>{pct.toFixed(0)}% used</span>
              <span style={{ fontWeight: 600, color: remaining <= 0 ? "#dc2626" : "#059669" }}>
                {isDollarContract
                  ? "$" + remaining.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " remaining"
                  : isAhead
                    ? (visitedHours - contractedHours).toFixed(1) + " hrs ahead"
                    : remaining.toFixed(1) + " hrs remaining"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", background: "#fff", flexShrink: 0 }}>
          {[{ id: "visits", label: "VISIT LOG" }, { id: "workorders", label: "WORK ORDERS" + ((workOrders || []).length > 0 ? " (" + (workOrders || []).length + ")" : "") }, { id: "history", label: "CUSTOMER HISTORY" }].map(function(tab) {
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
          {panelTab === "workorders" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>Work Orders</div>
                <button className="btn-sm" onClick={() => { setShowAddWO(true); setNewWO(emptyWO); }}
                  style={{ fontSize: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>
                  + Add Work Order
                </button>
              </div>

              {/* Add Work Order form */}
              {showAddWO && (
                <div style={{ background: "#f0f4ff", border: "1px solid #c7d7fd", borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 10, letterSpacing: "0.06em" }}>NEW WORK ORDER</div>
                  <div className="form-field" style={{ marginBottom: 8 }}>
                    <label>Title</label>
                    <input value={newWO.title} onChange={e => setNewWO(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Annual IPP Inspection" style={{ width: "100%" }} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 8 }}>
                    <label>Description / Scope</label>
                    <textarea value={newWO.description} onChange={e => setNewWO(f => ({ ...f, description: e.target.value }))}
                      placeholder="Scope of work, details..." rows={2}
                      style={{ width: "100%", padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, resize: "vertical", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Serial Number</label>
                      <input value={newWO.serialNumber} onChange={e => setNewWO(f => ({ ...f, serialNumber: e.target.value }))} placeholder="Equipment serial #" style={{ width: "100%" }} />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Link to Visit</label>
                      <select value={newWO.linkedVisitNo} onChange={e => setNewWO(f => ({ ...f, linkedVisitNo: e.target.value }))} style={{ width: "100%" }}>
                        <option value="">— Standalone —</option>
                        {Array.apply(null, Array(parseInt(c.suggestedVisits) || 0)).map(function(x, i) { return <option key={i+1} value={i+1}>Visit {i+1}</option>; })}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div className="form-field">
                      <label>Estimated Hours</label>
                      <input type="number" value={newWO.estimatedHours} onChange={e => setNewWO(f => ({ ...f, estimatedHours: e.target.value }))} placeholder="0" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-sm" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer" }}
                      disabled={!newWO.title}
                      onClick={() => { onAddWorkOrder({ ...newWO, status: "scheduled" }); setShowAddWO(false); setNewWO(emptyWO); }}>
                      Save Work Order
                    </button>
                    <button className="btn-sm" style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer", color: "#64748b" }}
                      onClick={() => setShowAddWO(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Work Order list */}
              {(!workOrders || workOrders.length === 0) && !showAddWO ? (
                <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", padding: "24px 0" }}>No work orders yet — click Add Work Order to create one.</div>
              ) : (
                <div>
                  {(workOrders || []).sort((a, b) => {
                    // Scheduled first, then by date
                    if (a.status !== b.status) return a.status === "scheduled" ? -1 : 1;
                    return (a.scheduledDate || "9999") < (b.scheduledDate || "9999") ? -1 : 1;
                  }).map(wo => {
                    const isComplete = wo.status === "complete";
                    const statusColor = isComplete ? "#059669" : "#d97706";
                    const statusBg = isComplete ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)";
                    const isEditing = editingWOId === wo.id;
                    const isCompleting = completingWOId === wo.id;
                    const isConfirmDelete = confirmDeleteWOId === wo.id;

                    if (isEditing && editWOForm) {
                      return (
                        <div key={wo.id} style={{ background: "#f0f4ff", border: "1px solid #c7d7fd", borderRadius: 6, padding: "12px 14px", marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 10 }}>EDIT WORK ORDER</div>
                          <div className="form-field" style={{ marginBottom: 8 }}>
                            <label>Title</label>
                            <input value={editWOForm.title} onChange={e => setEditWOForm(f => ({ ...f, title: e.target.value }))} style={{ width: "100%" }} />
                          </div>
                          <div className="form-field" style={{ marginBottom: 8 }}>
                            <label>Description / Scope</label>
                            <textarea value={editWOForm.description} onChange={e => setEditWOForm(f => ({ ...f, description: e.target.value }))} rows={2}
                              style={{ width: "100%", padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, resize: "vertical", fontFamily: "inherit" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                            <div className="form-field" style={{ margin: 0 }}>
                              <label>Serial Number</label>
                              <input value={editWOForm.serialNumber || ""} onChange={e => setEditWOForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="Equipment serial #" style={{ width: "100%" }} />
                            </div>
                            <div className="form-field" style={{ margin: 0 }}>
                              <label>Link to Visit</label>
                              <select value={editWOForm.linkedVisitNo || ""} onChange={e => setEditWOForm(f => ({ ...f, linkedVisitNo: e.target.value }))} style={{ width: "100%" }}>
                                <option value="">— Standalone —</option>
                                {Array.apply(null, Array(parseInt(c.suggestedVisits) || 0)).map(function(x, i) { return <option key={i+1} value={i+1}>Visit {i+1}</option>; })}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                            <div className="form-field">
                              <label>Estimated Hours</label>
                              <input type="number" value={editWOForm.estimatedHours} onChange={e => setEditWOForm(f => ({ ...f, estimatedHours: e.target.value }))} style={{ width: "100%" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-sm" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer" }}
                              onClick={() => { onUpdateWorkOrder(wo.id, editWOForm); setEditingWOId(null); }}>Save</button>
                            <button className="btn-sm" style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer", color: "#64748b" }}
                              onClick={() => setEditingWOId(null)}>Cancel</button>
                          </div>
                        </div>
                      );
                    }

                    if (isCompleting) {
                      return (
                        <div key={wo.id} style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: 6, padding: "12px 14px", marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 10 }}>MARK COMPLETE — {wo.title}</div>
                          <div style={{ marginBottom: 12 }}>
                            <div className="form-field">
                              <label>Actual Hours</label>
                              <input type="number" value={completeWOForm.actualHours}
                                onChange={e => setCompleteWOForm(f => ({ ...f, actualHours: e.target.value }))}
                                placeholder={wo.estimatedHours || "0"} style={{ width: "100%" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-sm" style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer" }}
                              onClick={() => {
                                onCompleteWorkOrder(wo.id,
                                  parseFloat(completeWOForm.actualHours) || parseFloat(wo.estimatedHours) || 0);
                                setCompletingWOId(null);
                              }}>✓ Confirm Complete</button>
                            <button className="btn-sm" style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "5px 14px", fontSize: 11, cursor: "pointer", color: "#64748b" }}
                              onClick={() => setCompletingWOId(null)}>Cancel</button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={wo.id} style={{ background: statusBg, border: "1px solid " + statusColor + "33", borderRadius: 6, padding: "10px 12px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{wo.title}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, background: statusColor, color: "#fff", borderRadius: 8, padding: "1px 7px", letterSpacing: "0.06em" }}>
                                {isComplete ? "COMPLETE" : "SCHEDULED"}
                              </span>
                            </div>
                            {wo.description && <div style={{ fontSize: 11, color: "#475569", marginBottom: 4, lineHeight: 1.4 }}>{wo.description}</div>}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 10, color: "#64748b" }}>
                              {wo.serialNumber && <span>🔢 {wo.serialNumber}</span>}
                              {wo.linkedVisitNo && <span style={{ background: "rgba(37,99,235,0.10)", color: "#2563eb", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 3, padding: "1px 6px", fontWeight: 700 }}>📌 Visit {wo.linkedVisitNo}</span>}
                              {wo.serialNumber && <span>🔖 #{wo.serialNumber}</span>}
                              {wo.estimatedHours && <span>⏱ Est. {wo.estimatedHours}h{isComplete && wo.actualHours ? " → Act. " + wo.actualHours + "h" : ""}</span>}
                              {isComplete && wo.completedAt && <span style={{ color: "#059669" }}>✓ Done {wo.completedAt}</span>}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            {!isComplete && (
                              <button title="Mark complete" onClick={() => { setCompletingWOId(wo.id); setCompleteWOForm({ actualHours: wo.estimatedHours || "" }); }}
                                style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer" }}>✓</button>
                            )}
                            {isComplete && (
                              <button title="Revert to scheduled" onClick={() => onRevertWorkOrder(wo.id)}
                                style={{ background: "none", border: "1px solid #d97706", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer", color: "#d97706" }}>↺</button>
                            )}
                            <button title="Edit" onClick={() => { setEditingWOId(wo.id); setEditWOForm({ ...wo }); }}
                              style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer", color: "#64748b" }}>✎</button>
                            {isConfirmDelete ? (
                              <div style={{ display: "flex", gap: 3 }}>
                                <button onClick={() => { onDeleteWorkOrder(wo.id); setConfirmDeleteWOId(null); }}
                                  style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer" }}>Delete</button>
                                <button onClick={() => setConfirmDeleteWOId(null)}
                                  style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer", color: "#64748b" }}>✕</button>
                              </div>
                            ) : (
                              <button title="Delete" onClick={() => setConfirmDeleteWOId(wo.id)}
                                style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer", color: "#94a3b8" }}>🗑</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : panelTab === "visits" ? (
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
                          <label>Visit Date</label>
                          <input type="date" value={editVisitForm.date} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, date: e.target.value }; }); }} style={{ width: "100%", position: "relative" }} />
                        </div>
                      </div>
                      <div className="form-field" style={{ marginBottom: 8 }}>
                        <label>Hours by Equipment Type</label>
                        {(function() {
                          const contractEqTypes = c.team ? c.team.split(", ").map(t => t.trim()).filter(Boolean) : [];
                          const allEqTypes = Array.from(new Set(contractEqTypes.concat(extraEqTypes)));
                          const eqH = editVisitForm.eqHours || {};
                          if (allEqTypes.length === 0) {
                            return (
                              <input type="number" step="0.25" value={editVisitForm.actualHours}
                                onChange={function(e) { setEditVisitForm(function(f) { return { ...f, actualHours: e.target.value }; }); }}
                                style={{ width: "100%" }} />
                            );
                          }
                          const total = allEqTypes.reduce((s, t) => s + (parseFloat(eqH[t]) || 0), 0);
                          return (
                            <div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 6, marginBottom: 6 }}>
                                {allEqTypes.map(function(t) {
                                  const _rawStyle = getEqPillStyle(t);
                                  const style = _rawStyle || { color: "#2563eb", bg: "rgba(37,99,235,0.08)", background: "rgba(37,99,235,0.08)" };
                                  return (
                                    <div key={t} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: style.color, background: style.background || style.bg,
                                        border: "1px solid " + style.color + "44", borderRadius: 3, padding: "1px 6px", display: "inline-block", alignSelf: "flex-start" }}>{t}</span>
                                      <input type="number" step="0.25" placeholder="0.00"
                                        value={eqH[t] || ""}
                                        onChange={function(e) {
                                          const val = e.target.value;
                                          setEditVisitForm(function(f) { return { ...f, eqHours: { ...f.eqHours, [t]: val } }; });
                                        }}
                                        style={{ width: "100%", padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 12 }} />
                                    </div>
                                  );
                                })}
                              </div>
                              {total > 0 && <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>Total: {total.toFixed(2)} hrs</div>}
                            </div>
                          );
                        })()}
                      </div>
                      <div className="form-field" style={{ marginBottom: 8 }}>
                        <label>Tech(s)</label>
                        <input value={editVisitForm.techs} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, techs: e.target.value }; }); }} style={{ width: "100%" }} />
                      </div>
                      <div className="form-field" style={{ marginBottom: 10 }}>
                        <label>Comments</label>
                        <input value={editVisitForm.comments} onChange={function(e) { setEditVisitForm(function(f) { return { ...f, comments: e.target.value }; }); }} style={{ width: "100%" }} />
                      </div>
                      {(c.ippTasks || []).length > 0 && (
                        <VisitTaskChecklist
                          ippTasks={c.ippTasks}
                          visitTasks={editVisitForm.tasks}
                          onChange={tasks => setEditVisitForm(f => ({ ...f, tasks }))}
                        />
                      )}
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="btn-sm" onClick={cancelEditVisit}>Cancel</button>
                        <button className="btn-primary" style={{ padding: "4px 12px", fontSize: 11 }} onClick={function() { saveEditVisit(c.id, v.id); }}>Save</button>
                      </div>
                    </div>
                  );
                }
                const linkedWOs = (workOrders || []).filter(wo => String(wo.linkedVisitNo) === String(v.visitNo));
                return (
                  <div key={v.id}>
                  <div className="visit-row" style={{ gridTemplateColumns: "28px 90px 50px 1fr 60px" }}>
                    <div style={{ color: "#94a3b8", fontWeight: 700 }}>{v.visitNo}</div>
                    <div style={{ color: "#1a2235" }}>{v.date}</div>
                    <div>
                      {isDollarContract ? (
                        <div>
                          <div style={{ color: "#059669", fontWeight: 700 }}>${(parseFloat(v.billedAmount) || 0).toLocaleString()}</div>
                          {(v.laborCost > 0 || v.travelCost > 0 || v.partsCost > 0) && (
                            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>
                              {v.laborCost > 0 && <span>L:${v.laborCost} </span>}
                              {v.travelCost > 0 && <span>T:${v.travelCost} </span>}
                              {v.partsCost > 0 && <span>P:${v.partsCost}</span>}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div style={{ color: "#2563eb", fontWeight: 700 }}>{v.actualHours}</div>
                          {linkedWOs.length > 0 && (
                            <div style={{ fontSize: 9, color: "#d97706", fontWeight: 700 }}>+{linkedWOs.reduce((s, wo) => s + (parseFloat(wo.actualHours) || parseFloat(wo.estimatedHours) || 0), 0)}h WO</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ color: "#1a2235", fontSize: 12 }}>{v.techs ? v.techs : <span style={{ color: "#cbd5e1" }}>-</span>}</div>
                      {v.eqHours && Object.keys(v.eqHours).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 3 }}>
                          {Object.entries(v.eqHours).filter(([,h]) => parseFloat(h) > 0).map(([t, h]) => {
                            const _rawS = getEqPillStyle(t);
                            const s = _rawS || { color: "#2563eb", background: "rgba(37,99,235,0.08)" };
                            return <span key={t} style={{ fontSize: 9, fontWeight: 700, color: s.color, background: s.background || s.bg,
                              border: "1px solid " + s.color + "44", borderRadius: 3, padding: "1px 5px" }}>{t}: {h}h</span>;
                          })}
                        </div>
                      )}
                      {v.tasks && v.tasks.length > 0 && (function() {
                        const done = v.tasks.filter(vt => vt.completed).length;
                        const total = (c.ippTasks || []).length || v.tasks.length;
                        const pct = total > 0 ? Math.round(done / total * 100) : 0;
                        const col = pct === 100 ? "#059669" : "#2563eb";
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 9, color: col, fontWeight: 700 }}>📋 {done}/{total} tasks</span>
                            <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 3, height: 4, maxWidth: 80 }}>
                              <div style={{ height: "100%", width: pct + "%", background: col, borderRadius: 3 }} />
                            </div>
                          </div>
                        );
                      })()}
                      {v.comments && <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{v.comments}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={function() { startEditVisit(v); }} style={{ background: "none", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 10, padding: "2px 6px", borderRadius: 2, cursor: "pointer" }}>Edit</button>
                      <button onClick={function() { setConfirmDeleteVisit(v); }} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 10, padding: "2px 6px", borderRadius: 2, cursor: "pointer" }}>Del</button>
                    </div>
                  </div>
                  {linkedWOs.length > 0 && (
                    <div style={{ marginLeft: 28, marginTop: 0, marginBottom: 4 }}>
                      {linkedWOs.map(wo => {
                        const isWODone = wo.status === "complete";
                        return (
                          <div key={wo.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px",
                            background: isWODone ? "rgba(5,150,105,0.06)" : "rgba(217,119,6,0.06)",
                            border: "1px solid " + (isWODone ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)"),
                            borderRadius: 4, fontSize: 10 }}>
                            <span style={{ color: "#d97706", fontWeight: 700 }}>🔧</span>
                            <span style={{ fontWeight: 700, color: "#1a2235" }}>{wo.title}</span>
                            {wo.serialNumber && <span style={{ color: "#94a3b8" }}>#{wo.serialNumber}</span>}
                            <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                              {wo.estimatedHours && <span style={{ color: "#64748b" }}>Est. {wo.estimatedHours}h</span>}
                              {isWODone && wo.actualHours && <span style={{ color: "#059669", fontWeight: 700 }}>Act. {wo.actualHours}h</span>}
                              <span style={{ fontWeight: 700, fontSize: 9, padding: "1px 6px", borderRadius: 8,
                                background: isWODone ? "#059669" : "#d97706", color: "#fff" }}>
                                {isWODone ? "DONE" : "SCHEDULED"}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: "1px solid #e2e8f0", marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{isDollarContract ? "Total Billed: $" + (visits[c.id] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0).toLocaleString() : "Total: " + visitedHours.toFixed(1) + " hrs"}</span>
              </div>
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Log a Visit</div>
            {c.trackingType === "dollars" && (
              <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 5, padding: "5px 10px", marginBottom: 10, fontSize: 10, color: "#2563eb", fontWeight: 700 }}>
                $ Dollar-Tracked Contract — enter billed amount below
              </div>
            )}
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Visit Date</label>
              <input type="date" value={newVisit.date} onChange={function(e) { setNewVisit(function(v) { return { ...v, date: e.target.value }; }); }} style={{ width: "100%", position: "relative" }} />
            </div>
            {c.trackingType === "dollars" ? (
              <div style={{ marginBottom: 10 }}>
                <div className="form-field" style={{ marginBottom: 8 }}>
                  <label>Total Billed ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={newVisit.billedAmount || ""}
                    onChange={function(e) { setNewVisit(function(v) { return { ...v, billedAmount: e.target.value, actualHours: 0 }; }); }}
                    style={{ width: "100%", fontSize: 13, fontWeight: 700 }} />
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6 }}>Optional breakdown:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Labor ($)", "laborCost"], ["Travel ($)", "travelCost"], ["Parts ($)", "partsCost"]].map(function(pair) {
                    return (
                      <div key={pair[1]} className="form-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: 10 }}>{pair[0]}</label>
                        <input type="number" step="0.01" placeholder="0.00" value={newVisit[pair[1]] || ""}
                          onChange={function(e) { setNewVisit(function(v) { const u = {}; u[pair[1]] = e.target.value; return { ...v, ...u }; }); }}
                          style={{ width: "100%" }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Hours by Equipment Type</label>
              {(function() {
                const contractEqTypes = c.team ? c.team.split(", ").map(t => t.trim()).filter(Boolean) : [];
                const allEqTypes = Array.from(new Set(contractEqTypes.concat(extraEqTypes)));
                if (allEqTypes.length === 0) {
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#64748b", width: 60 }}>Total Hrs</span>
                        <input type="number" step="0.25" placeholder="0.00" value={newVisit.actualHours}
                          onChange={function(e) { setNewVisit(function(v) { return { ...v, actualHours: e.target.value }; }); }}
                          style={{ width: 80, padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 12 }} />
                      </div>
                    </div>
                  );
                }
                const eqHours = newVisit.eqHours || {};
                const total = allEqTypes.reduce((s, t) => s + (parseFloat(eqHours[t]) || 0), 0);
                return (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6, marginBottom: 6 }}>
                      {allEqTypes.map(function(t) {
                        const _rs = getEqPillStyle(t);
                        const style = _rs || { color: "#2563eb", background: "rgba(37,99,235,0.08)" };
                        return (
                          <div key={t} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: style.color, background: style.background || style.bg,
                              border: "1px solid " + style.color + "44", borderRadius: 3, padding: "1px 6px", display: "inline-block", alignSelf: "flex-start" }}>{t}</span>
                            <input type="number" step="0.25" placeholder="0.00"
                              value={eqHours[t] || ""}
                              onChange={function(e) {
                                const val = e.target.value;
                                setNewVisit(function(v) { return { ...v, eqHours: { ...v.eqHours, [t]: val } }; });
                              }}
                              style={{ width: "100%", padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 3, fontSize: 12 }} />
                          </div>
                        );
                      })}
                    </div>
                    {total > 0 && <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>Total: {total.toFixed(2)} hrs</div>}
                  </div>
                );
              })()}
            </div>
            )}
            <div className="form-field" style={{ marginBottom: 10 }}>
              <label>Tech(s)</label>
              <input placeholder="e.g. S.Argus / C.Berry" value={newVisit.techs} onChange={function(e) { setNewVisit(function(v) { return { ...v, techs: e.target.value }; }); }} style={{ width: "100%" }} />
            </div>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Comments</label>
              <input placeholder="Optional notes..." value={newVisit.comments} onChange={function(e) { setNewVisit(function(v) { return { ...v, comments: e.target.value }; }); }} style={{ width: "100%" }} />
            </div>
            {(c.ippTasks || []).length > 0 && (
              <VisitTaskChecklist
                ippTasks={c.ippTasks}
                visitTasks={newVisit.tasks}
                onChange={tasks => setNewVisit(v => ({ ...v, tasks }))}
              />
            )}
            {(function() {
              const eqHoursObj = newVisit.eqHours || {};
              const eqTotal = Object.values(eqHoursObj).reduce((s, h) => s + (parseFloat(h) || 0), 0);
              const newHrs = eqTotal > 0 ? eqTotal : parseFloat(newVisit.actualHours) || 0;
              const wouldVisit = visitedHours + newHrs;
              const wouldExceed = wouldVisit > totalOwedAllYears;
              const overHrs = wouldExceed ? (wouldVisit - totalOwedAllYears).toFixed(1) : 0;

              // Determine which WOs are linked to this (next) visit number
              const contractVisits = visits[c.id] || [];
              const nextVisitNo = contractVisits.length > 0 ? Math.max(...contractVisits.map(v => v.visitNo)) + 1 : 1;
              const linkedWOs = (workOrders || []).filter(wo => wo.status !== "complete" && String(wo.linkedVisitNo) === String(nextVisitNo));

              const handleLogVisit = function(completedWOIds) {
                if (wouldExceed && !isDollar) {
                  setPendingWOCompletions(completedWOIds || []);
                  setOverrideWarning(true);
                } else {
                  onAddVisit(c.id, completedWOIds);
                }
              };
              const eqHcheck = newVisit.eqHours || {};
              const eqTotCheck = Object.values(eqHcheck).reduce(function(s, h) { return s + (parseFloat(h) || 0); }, 0);
              const isDollar = c.trackingType === "dollars";
              const isLogDisabled = !newVisit.date || (isDollar ? !newVisit.billedAmount : (eqTotCheck <= 0 && !newVisit.actualHours));

              // Pre-check any linked WOs not yet in woChecked state
              const checkedIds = linkedWOs
                .filter(wo => woChecked[wo.id] !== false)
                .map(wo => wo.id);

              // IPP tasks for this visit number
              const ippInfo = getContractIpp(c.id);
              const ippVisitTasks = ippInfo ? ((ippInfo.site.visitTasks || {})[nextVisitNo] || []).filter(t => (t.completions || []).length === 0) : [];

              return (
                <>
                  {linkedWOs.length > 0 && (
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                        🔧 Work Orders on this Visit
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {linkedWOs.map(function(wo) {
                          const checked = woChecked[wo.id] !== false;
                          return (
                            <label key={wo.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                              <input type="checkbox" checked={checked}
                                onChange={function(e) { setWoChecked(function(prev) { return { ...prev, [wo.id]: e.target.checked }; }); }}
                                style={{ marginTop: 2, accentColor: "#d97706", flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: checked ? "#1a2235" : "#94a3b8", textDecoration: checked ? "none" : "line-through" }}>
                                  {wo.title}
                                </div>
                                {wo.serialNumber && <div style={{ fontSize: 10, color: "#94a3b8" }}>#{wo.serialNumber}</div>}
                                {wo.description && <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{wo.description}</div>}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {checkedIds.length > 0 && (
                        <div style={{ fontSize: 10, color: "#92400e", marginTop: 8, paddingTop: 6, borderTop: "1px solid #fde68a" }}>
                          {checkedIds.length === linkedWOs.length ? "All" : checkedIds.length} WO{checkedIds.length !== 1 ? "s" : ""} will be marked complete when visit is logged.
                        </div>
                      )}
                    </div>
                  )}
                  {ippVisitTasks.length > 0 && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                        📋 IPP Tasks — Visit {nextVisitNo}
                      </div>
                      <div style={{ fontSize: 10, color: "#166534", marginBottom: 8 }}>
                        These tasks will be marked complete when the visit is logged.
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {ippVisitTasks.map(function(task) {
                          return (
                            <div key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                              <span style={{ color: "#059669", fontSize: 12, marginTop: 1 }}>✓</span>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2235" }}>{task.category}</span>
                                {task.hours && <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginLeft: 6 }}>{task.hours}h</span>}
                                {task.description && <span style={{ fontSize: 10, color: "#64748b", marginLeft: 6 }}>{task.description}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {wouldExceed && newHrs > 0 && !isDollar && (
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
                    onClick={function() { handleLogVisit(checkedIds); setWoChecked({}); }}
                    disabled={isLogDisabled}
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
            {sparkData.length >= 2 && (function() {
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
                onClick={function() { setOverrideWarning(false); onAddVisit(c.id, pendingWOCompletions); }}
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

// Allocate totalHours across years, guaranteed to sum exactly to totalHours.
// Uses visit-proportional split if nVisits > 0 and dates are valid, else month-proportional.
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
    // Split by which year each evenly-spaced visit lands in
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
    // Split proportionally by months in each year
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

  // Round each value down, then distribute remainder to largest fractional years
  // This guarantees sum === totalHours exactly
  const activeYears = YEARS.filter(y => rawValues["hours" + y] > 0);
  let sumFloored = 0;
  activeYears.forEach(y => {
    result["hours" + y] = Math.floor(rawValues["hours" + y]);
    sumFloored += result["hours" + y];
  });
  let remainder = Math.round(totalHours - sumFloored);
  // Distribute remainder 1 unit at a time to years with largest fractional parts
  const byFrac = activeYears
    .map(y => ({ y, frac: rawValues["hours" + y] - Math.floor(rawValues["hours" + y]) }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < remainder && i < byFrac.length; i++) {
    result["hours" + byFrac[i].y] += 1;
  }
  return result;
}

function App() {
  const [division, setDivision] = useState("KNA");

  // Per-division contract data
  const [knaContracts, setKnaContracts] = useState(INITIAL_CONTRACTS);
  const [kcanContracts, setKcanContracts] = useState([
    { id: 1, customer: "CH St-Joseph-de-la-Providence", billingNo: "", shippingNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 1872.16, contractedHours: 260, contractAmount: 45500.0, hours2024: 0, hours2025: 220, hours2026: 220, hours2027: 0, hours2028: 0, extensionDate: "12/31/2023", hourlyRate: 175, suggestedVisits: 4 },
    { id: 2, customer: "CHU Ste-Justine", billingNo: "", shippingNo: "", team: "W1, W3, IPP", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 4353.02, contractedHours: 260, contractAmount: 45500.0, hours2024: 0, hours2025: 0, hours2026: 0, hours2027: 0, hours2028: 0, extensionDate: "2/28/2025", hourlyRate: 175, suggestedVisits: 4 },
    { id: 3, customer: "HLS Ottawa", billingNo: "", shippingNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 540, contractAmount: 94500.0, hours2024: 0, hours2025: 250, hours2026: 250, hours2027: 0, hours2028: 0, extensionDate: "", hourlyRate: 175, suggestedVisits: 4 },
    { id: 4, customer: "HLS Toronto", billingNo: "", shippingNo: "", team: "W1, W3", travelCosts: "All inclusive", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 504, contractAmount: 88200.0, hours2024: 0, hours2025: 200, hours2026: 200, hours2027: 0, hours2028: 0, extensionDate: "", hourlyRate: 175, suggestedVisits: 4 },
    { id: 5, customer: "BCM", billingNo: "", shippingNo: "", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 292.75, contractAmount: 51231.25, hours2024: 0, hours2025: 0, hours2026: 292.75, hours2027: 0, hours2028: 0, extensionDate: "", hourlyRate: 175, suggestedVisits: 4 },
    { id: 6, customer: "CISSS De Lanaudiere", billingNo: "", shippingNo: "", team: "W1, W3, Log", travelCosts: "Billable", corporateGroup: "None", monthlyRevenue: 0, contractedHours: 0, contractAmount: 0.0, hours2024: 0, hours2025: 80, hours2026: 80, hours2027: 0, hours2028: 0, extensionDate: "", hourlyRate: 175, suggestedVisits: 4 },
  ]);

  // Per-division visit data
  const [knaVisits, setKnaVisits] = useState(INITIAL_VISITS);
  const [kcanVisits, setKcanVisits] = useState({});

  // Per-division work orders: { [contractId]: [{ id, title, description, scheduledDate, techs, estimatedHours, actualHours, revenue, status, createdAt }] }
  const [knaWorkOrders, setKnaWorkOrders] = useState({});
  const [kcanWorkOrders, setKcanWorkOrders] = useState({});
  const workOrders = division === "KNA" ? knaWorkOrders : kcanWorkOrders;
  const setWorkOrders = division === "KNA" ? setKnaWorkOrders : setKcanWorkOrders;

  // Per-division monthly snapshots
  const [knaSnapshots, setKnaSnapshots] = useState({ "2026-01": 7620.75, "2026-02": 7822 });
  const [kcanSnapshots, setKcanSnapshots] = useState({});

  // Customer history: { [customerNo]: { 2017: { hrs, rev }, 2018: ... } }
  const [customerHistory, setCustomerHistory] = useState({});

  // Active division data (derived)
  const allDivisionContracts = division === "KNA" ? knaContracts : kcanContracts;
  const contracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");
  const setContracts = division === "KNA" ? setKnaContracts : setKcanContracts;
  const visits = division === "KNA" ? knaVisits : kcanVisits;
  const setVisits = division === "KNA" ? setKnaVisits : setKcanVisits;
  const monthlySnapshots = division === "KNA" ? knaSnapshots : kcanSnapshots;
  const setMonthlySnapshots = division === "KNA" ? setKnaSnapshots : setKcanSnapshots;
  const [selectedContract, setSelectedContract] = useState(null); // slide-out panel
  const [newVisit, setNewVisit] = useState({ date: "", actualHours: "", eqHours: {}, techs: "", comments: "", tasks: [] });
  const [extraGroups, setExtraGroups] = useState([]);
  // IPP Programs: shared across divisions (programs reference contractIds from either)
  const [ippPrograms, setIppPrograms] = useState([{
    id: 9999001,
    name: "Pure Star IPP 2026",
    group: "Pure Star",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    sites: [
      {
        contractId: 47,
        _division: "KNA",
        visitCount: 2,
        visitTasks: {
          1: [
            { id: 9999101, category: "Dryer PM", description: "Dryer burner inspection and maintenance", hours: 8, completions: [] },
            { id: 9999102, category: "Rail Audit", description: "Rail and lift safety audit", hours: 4, completions: [] },
            { id: 9999103, category: "Ironer PM", description: "Ironer burner inspection and maintenance", hours: 6, completions: [] },
          ],
          2: [
            { id: 9999104, category: "Tunnel Extractor", description: "Tunnel extractor and centrifugal maintenance", hours: 8, completions: [] },
            { id: 9999105, category: "Press Service", description: "Press pan resealing and column service", hours: 6, completions: [] },
            { id: 9999106, category: "eVue Update", description: "Annual eVue software upgrade and verification", hours: 2, completions: [{ visitNo: 2, date: "2026-03-15", techs: "S. Argus", completedAt: "2026-03-15T14:00:00.000Z" }] },
          ],
        },
      },
      {
        contractId: 48,
        _division: "KCAN",
        visitCount: 2,
        visitTasks: {
          1: [
            { id: 9999201, category: "Dryer PM", description: "Dryer burner inspection and maintenance", hours: 10, completions: [{ visitNo: 1, date: "2026-02-10", techs: "C. Berry", completedAt: "2026-02-10T10:00:00.000Z" }] },
            { id: 9999202, category: "Rail Audit", description: "Rail and lift safety audit", hours: 4, completions: [{ visitNo: 1, date: "2026-02-10", techs: "C. Berry", completedAt: "2026-02-10T10:00:00.000Z" }] },
            { id: 9999203, category: "Sort Station", description: "Sort station adjustments and calibration", hours: 3, completions: [] },
          ],
          2: [
            { id: 9999204, category: "Servo Lift", description: "Servo lift inspections, lubrication, and adjustments", hours: 6, completions: [] },
            { id: 9999205, category: "Centrifugal", description: "Centrifugal extractor maintenance", hours: 8, completions: [] },
          ],
        },
      },
    ],
  }]);
  const [ippUiState, setIppUiState] = useState({ view: "list", editingProgram: null, selectedProgram: null, selectedSiteId: null, taskDrag: null, dragOverVisit: null, sitesCollapsed: true });
  const [renewalContract, setRenewalContract] = useState(null); // contract being renewed
  const [renewForm, setRenewForm] = useState({});               // proposed new term fields
  // Ref for contractedHours input — uncontrolled to avoid focus/re-render issues
  const renewHoursRef = React.useRef(null);
  React.useEffect(function() {
    if (renewHoursRef.current) {
      renewHoursRef.current.value = String(renewForm.contractedHours || "");
    }
  }, [renewalContract]); // sync when a new contract is opened for renewal
  const [extraEqTypes, setExtraEqTypes] = useState([]);
  function addExtraGroup(name) { setExtraGroups(prev => prev.includes(name) ? prev : [...prev, name]); }

  // ── IPP CRUD ──────────────────────────────────────────────────────────────
  // Convert ISO date (2025-12-01) to contract extensionDate format (12/1/25)
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
      // Sum all task hours across all visits for this site
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
        // Distribute hours across year buckets using contract term
        const yearAlloc = allocateHoursByYear(extDate || (existingContract && existingContract.extensionDate) || "", totalHours, site.visitCount);
        Object.assign(updates, yearAlloc);
      }
      // Auto-add IPP to team/equipment types if not already present
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

  function addIppProgram(program) {
    const id = Date.now();
    const newProg = { ...program, id };
    setIppPrograms(prev => [...prev, newProg]);
    syncIppContractFields(newProg.sites, newProg.startDate, newProg.endDate);
    return id;
  }

  function updateIppProgram(programId, updates) {
    setIppPrograms(prev => prev.map(p => p.id === programId ? { ...p, ...updates } : p));
    const prog = { ...(ippPrograms.find(p => p.id === programId) || {}), ...updates };
    if (updates.sites || updates.startDate || updates.endDate) {
      syncIppContractFields(prog.sites || [], prog.startDate, prog.endDate);
    }
  }

  function deleteIppProgram(programId) {
    // Before deleting, find which contracts were in this program and
    // remove the IPP team tag if they're not in any other program
    const prog = ippPrograms.find(p => p.id === programId);
    if (prog) {
      prog.sites.forEach(function(site) {
        const stillInOther = ippPrograms.some(p => p.id !== programId && (p.sites || []).some(s => s.contractId === site.contractId && s._division === site._division));
        if (!stillInOther) {
          const removeIppTag = function(contracts) {
            return contracts.map(c => {
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
  }

  function recordIppTaskCompletion(programId, contractId, visitNo, taskId, visitDate, techName) {
    setIppPrograms(prev => prev.map(function(p) {
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
    }));
  }

  function revertIppTaskCompletion(programId, contractId, visitNo, taskId) {
    setIppPrograms(prev => prev.map(function(p) {
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
    }));
  }

  // Get IPP program+site for a contract (if any)
  function getContractIpp(contractId) {
    for (const prog of ippPrograms) {
      const site = (prog.sites || []).find(s => s.contractId === contractId);
      if (site) return { program: prog, site };
    }
    return null;
  }
  function addExtraEqType(name) { setExtraEqTypes(prev => prev.includes(name) ? prev : [...prev, name]); }
  const [view, setView] = useState("dashboard");
  const [contractStatusFilter, setContractStatusFilter] = useState("active"); // "active"|"expired"|"archived"
  const [selectedScheduleMonth, setSelectedScheduleMonth] = useState(null); // YYYY-MM string
  // Drag state for visit rescheduling
  const [draggingSlot, setDraggingSlot] = React.useState(null); // { contractId, visitNo, customerLabel, visitLabel }
  const [dragOverMonth, setDragOverMonth] = React.useState(null); // YYYY-MM being hovered
  // Manual visit slot overrides: { [contractId_visitNo]: "YYYY-MM" }
  // e.g. { "42_2": "2026-04" } means contract 42, visit 2 moved to April 2026
  const [knaScheduleOverrides, setKnaScheduleOverrides] = useState({});
  const [kcanScheduleOverrides, setKcanScheduleOverrides] = useState({});
  const scheduleOverrides = division === "KNA" ? knaScheduleOverrides : kcanScheduleOverrides;
  const setScheduleOverrides = division === "KNA" ? setKnaScheduleOverrides : setKcanScheduleOverrides;
  function applyScheduleOverride(contractId, visitNo, ym) {
    const key = contractId + "_" + visitNo;
    setScheduleOverrides(prev => ({ ...prev, [key]: ym }));
  }
  function getOverridesForContract(contractId) {
    const result = {};
    Object.entries(scheduleOverrides).forEach(([k, ym]) => {
      const [cid, vno] = k.split("_");
      if (parseInt(cid) === contractId) result[parseInt(vno)] = ym;
    });
    return result;
  }
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedWORows, setExpandedWORows] = useState({});
  const [openPanelToTab, setOpenPanelToTab] = useState(null); // "workorders"|"visits"|null — signals VisitPanel which tab to start on // { [contractId]: true }
  function toggleWORow(id) { setExpandedWORows(p => ({ ...p, [id]: !p[id] })); }
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

  const filtered = useMemo(function() {
    // For expired/archived views, search across all division contracts (not just active)
    const pool = contractStatusFilter === "active"
      ? allDivisionContracts.filter(c => getContractStatus(c) === "active")
      : contractStatusFilter === "expired"
      ? allDivisionContracts.filter(c => getContractStatus(c) === "expired")
      : allDivisionContracts.filter(c => getContractStatus(c) === "archived");

    let data = pool.filter(c => {
      const matchSearch = c.customer.toLowerCase().includes(search.toLowerCase()) ||
        (c.billingNo || "").toLowerCase().includes(search.toLowerCase()) || (c.shippingNo || "").toLowerCase().includes(search.toLowerCase());
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
  }, [allDivisionContracts, contractStatusFilter, search, teamFilter, owedOnly, groupFilter, sortCol, sortDir, visits]);

  const totals = useMemo(function() {
    const t = { contractedHours: 0, netDue: 0, monthlyRevenue: 0, contractAmount: 0, owedHours: 0, dollarContractValue: 0, dollarBilled: 0 };
    YEARS.forEach(y => t[`hours${y}`] = 0);
    filtered.forEach(c => {
      const visitedHrs = getVisitedHours(c.id);
      t.contractedHours += c.contractedHours;
      t.monthlyRevenue += getMonthlyRevenue(c);
      t.contractAmount += c.contractAmount || 0;
      t.owedHours += getOwedAfterVisits(c, visitedHrs);
      t.netDue += getNetDue(c, visitedHrs);
      if (c.trackingType === "dollars") {
        t.dollarContractValue += (c.contractAmount || 0);
        t.dollarBilled += (visits[c.id] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
      }
      const rem = getRemainingHours(c, visitedHrs);
      YEARS.forEach(y => t[`hours${y}`] += rem[y] || 0);
    });
    return t;
  }, [filtered, visits]);

  const teamCounts = useMemo(function() {
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
  function commitRenewal() {
    if (!renewalContract) return;
    const c = renewalContract;
    const p = parseExtensionParts(c.extensionDate);
    const historyEntry = {
      extensionDate: c.extensionDate,
      contractedHours: c.contractedHours,
      hourlyRate: c.hourlyRate,
      suggestedVisits: c.suggestedVisits,
      renewedAt: new Date().toISOString().slice(0, 10),
    };
    // termStartDate tells computeSchedule where the new term begins
    const newTermDates = parseContractDates(renewForm.extensionDate);
    const termStartDate = newTermDates ? newTermDates.start.toISOString().slice(0, 10) : "";
    const updated = {
      ...c,
      ...renewForm,
      contractAmount: (parseFloat(renewForm.contractedHours) || 0) * (parseFloat(renewForm.hourlyRate) || 0),
      monthlyRevenue: 0, // will recalculate from contractAmount
      termStartDate,
      renewalHistory: [...(c.renewalHistory || []), historyEntry],
      ippTasks: c.ippTasks || [],   // carry task template forward; completion resets with visits
    };
    // Use the global setKna/setKcan directly since division may differ
    const isKna = knaContracts.find(x => x.id === c.id);
    if (isKna) {
      setKnaContracts(prev => prev.map(x => x.id === updated.id ? updated : x));
    } else {
      setKcanContracts(prev => prev.map(x => x.id === updated.id ? updated : x));
    }
    if (selectedContract && selectedContract.id === updated.id) setSelectedContract(updated);
    setRenewalContract(null);
    setRenewForm({});
  }


  function archiveContract(id) {
    const isKna = knaContracts.find(x => x.id === id);
    const updater = prev => prev.map(c => c.id === id ? { ...c, status: "archived" } : c);
    if (isKna) setKnaContracts(updater); else setKcanContracts(updater);
    if (selectedContract && selectedContract.id === id) setSelectedContract(prev => ({ ...prev, status: "archived" }));
  }

  function reactivateContract(c) {
    // Reactivation = open renewal modal (so user sets new term)
    openRenewalModal({ ...c, status: "active" });
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

  // ── Work Order CRUD ──────────────────────────────────────────────────────────
  function addWorkOrder(contractId, wo) {
    const id = Date.now();
    setWorkOrders(prev => ({
      ...prev,
      [contractId]: [...(prev[contractId] || []), { ...wo, id, createdAt: new Date().toISOString().slice(0, 10) }],
    }));
  }
  function updateWorkOrder(contractId, woId, changes) {
    setWorkOrders(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(w => w.id === woId ? { ...w, ...changes } : w),
    }));
  }
  function deleteWorkOrder(contractId, woId) {
    setWorkOrders(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).filter(w => w.id !== woId),
    }));
  }
  function completeWorkOrder(contractId, woId, actualHours) {
    setWorkOrders(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(w =>
        w.id === woId ? { ...w, status: "complete", actualHours, completedAt: new Date().toISOString().slice(0, 10) } : w
      ),
    }));
  }
  function revertWorkOrder(contractId, woId) {
    setWorkOrders(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(w =>
        w.id === woId ? { ...w, status: "scheduled", actualHours: undefined, completedAt: undefined } : w
      ),
    }));
  }

  function addVisit(contractId, completedWOIds) {
    if (!newVisit.date) return;
    const eqHours = newVisit.eqHours || {};
    const totalHrs = Object.values(eqHours).reduce((s, h) => s + (parseFloat(h) || 0), 0);
    if (totalHrs <= 0 && !newVisit.actualHours) return;
    const actualHours = totalHrs > 0 ? totalHrs : parseFloat(newVisit.actualHours) || 0;
    const contractVisits = visits[contractId] || [];
    const nextNo = contractVisits.length > 0 ? Math.max(...contractVisits.map(v => v.visitNo)) + 1 : 1;
    const isDollarContract = (function() {
      const allC = [...knaContracts, ...kcanContracts];
      const c = allC.find(x => x.id === contractId);
      return c && c.trackingType === "dollars";
    })();
    const visit = {
      id: Date.now(),
      visitNo: nextNo,
      date: newVisit.date,
      actualHours: isDollarContract ? 0 : actualHours,
      eqHours: (isDollarContract || totalHrs <= 0) ? {} : eqHours,
      techs: newVisit.techs,
      comments: newVisit.comments,
      tasks: newVisit.tasks || [],
      ...(isDollarContract ? {
        billedAmount: parseFloat(newVisit.billedAmount) || 0,
        laborCost: parseFloat(newVisit.laborCost) || 0,
        travelCost: parseFloat(newVisit.travelCost) || 0,
        partsCost: parseFloat(newVisit.partsCost) || 0,
      } : {}),
    };
    setVisits(prev => ({ ...prev, [contractId]: [...(prev[contractId] || []), visit] }));
    if (completedWOIds && completedWOIds.length > 0) {
      setWorkOrders(prev => ({
        ...prev,
        [contractId]: (prev[contractId] || []).map(w =>
          completedWOIds.includes(w.id)
            ? { ...w, status: "complete", actualHours, completedAt: newVisit.date }
            : w
        ),
      }));
    }
    // Auto-complete IPP tasks for this visit number
    const ippMatch = ippPrograms.find(function(p) { return (p.sites || []).find(s => s.contractId === contractId); });
    if (ippMatch) {
      const site = ippMatch.sites.find(s => s.contractId === contractId);
      const visitTasks = site ? ((site.visitTasks || {})[nextNo] || []) : [];
      const incompleteTasks = visitTasks.filter(t => (t.completions || []).length === 0);
      if (incompleteTasks.length > 0) {
        incompleteTasks.forEach(function(task) {
          setIppPrograms(function(prev) {
            return prev.map(function(p) {
              if (p.id !== ippMatch.id) return p;
              return { ...p, sites: p.sites.map(function(s) {
                if (s.contractId !== contractId) return s;
                const vt = s.visitTasks || {};
                return { ...s, visitTasks: { ...vt, [nextNo]: (vt[nextNo] || []).map(function(t) {
                  if (t.id !== task.id) return t;
                  return { ...t, completions: [...(t.completions || []), { visitNo: nextNo, date: visit.date, techs: newVisit.techs || "", completedAt: new Date().toISOString() }] };
                })}};
              })};
            });
          });
        });
      }
    }
    setNewVisit({ date: "", actualHours: "", eqHours: {}, techs: "", comments: "", tasks: [], billedAmount: "", laborCost: "", travelCost: "", partsCost: "" });
  }

  function deleteVisit(contractId, visitId) {
    setVisits(prev => ({ ...prev, [contractId]: (prev[contractId] || []).filter(v => v.id !== visitId) }));
  }

  function editVisit(contractId, visitId, updates) {
    setVisits(prev => ({
      ...prev,
      [contractId]: (prev[contractId] || []).map(v => {
        if (v.id !== visitId) return v;
        const eqH = updates.eqHours || {};
        const eqTotal = Object.values(eqH).reduce((s, h) => s + (parseFloat(h) || 0), 0);
        const actualHours = eqTotal > 0 ? eqTotal : parseFloat(updates.actualHours) || 0;
        return { ...v, ...updates, actualHours, eqHours: eqH };
      })
    }));
  }


  function getLastVisitDate(contractId) {
    const vs = visits[contractId] || [];
    if (vs.length === 0) return null;
    // Sort descending by date string (YYYY-MM-DD or YYYY-MM both sort correctly)
    const sorted = [...vs].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return sorted[0].date || null;
  }

  function getVisitedHours(contractId) {
    const allC = [...knaContracts, ...kcanContracts];
    const contract = allC.find(c => c.id === contractId);
    if (contract && contract.trackingType === "dollars") return 0;
    return (visits[contractId] || []).reduce((s, v) => s + (v.actualHours || 0), 0);
  }

  function getVisitedDollars(contractId) {
    return (visits[contractId] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
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
        const knaResult = await window.storage.get("monthly-snapshots-2026-KNA");
        if (knaResult && knaResult.value) {
          setKnaSnapshots(function(prev) { return { ...prev, ...JSON.parse(knaResult.value) }; });
        }
      } catch(e) {}
      try {
        const kcanResult = await window.storage.get("monthly-snapshots-2026-KCAN");
        if (kcanResult && kcanResult.value) {
          setKcanSnapshots(function(prev) { return { ...prev, ...JSON.parse(kcanResult.value) }; });
        }
      } catch(e) {}
      try {
        const histResult = await window.storage.get("customer-history");
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
      await window.storage.set("customer-history", JSON.stringify(updated));
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

  // Auto-capture: on first open of each month, record the snapshot
  React.useEffect(function() {
    const now = new Date();
    const key = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    if (key.startsWith("2026") && !monthlySnapshots[key]) {
      saveSnapshot(key, compute2026Total());
    }
  }, [division]);


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
        .pill-pp { background: rgba(220,38,38,0.1); color: #dc2626; border: 1px solid rgba(220,38,38,0.25); }
        .pill-dry { background: rgba(8,145,178,0.1); color: #0891b2; border: 1px solid rgba(8,145,178,0.25); }
        .pill-insp { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
        .pill-ipp { background: rgba(249,115,22,0.1); color: #f97316; border: 1px solid rgba(249,115,22,0.25); }
        .pill-irn { background: rgba(168,85,247,0.1); color: #a855f7; border: 1px solid rgba(168,85,247,0.25); }
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
        input[type="date"] { cursor: pointer; width: 100%; box-sizing: border-box; position: relative; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
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
            { id: "schedule",  label: "📅 VISIT SCHEDULE" },
            { id: "renewals",  label: "🔄 RENEWALS" },
            { id: "ipp",       label: "📋 IPP" },
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

            {/* Team breakdown, Hours by Year, YoY — 3-col grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
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
                {(function() {
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

            {/* YoY chart — third column of the same grid */}
            {(function() {
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

              const cH = 78; const cW = 480; const pL = 56; const pB = 30; const pT = 10; const pR = 12;
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
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>CONTRACTED HOURS YEAR OVER YEAR</div>
                    <div style={{ textAlign: "right" }}>
                      <div className="cond" style={{ fontSize: 18, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>{totalOpen.toLocaleString()}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>open hrs · {openCount} contracts</div>
                    </div>
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
                    <polygon points={polyline + " " + (pL + iW) + "," + (pT + iH) + " " + pL + "," + (pT + iH)} fill="rgba(37,99,235,0.06)" />
                    <polyline points={polyline} fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                    {pts.map(function(p, i) {
                      return (
                        <g key={p.year}>
                          <circle cx={p.x} cy={p.y} r="3" fill={p.isLive ? "#059669" : "#2563eb"} stroke="#fff" strokeWidth="1.5" />
                          {p.isLive && <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="#059669" strokeWidth="1" opacity="0.4" />}
                          <text x={p.x} y={pT + iH + 14} textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"} fontSize="8" fill={p.isLive ? "#059669" : "#64748b"}>{p.year}{p.isLive ? "*" : ""}</text>
                          {(function() {
                            if (i === 0) return null;
                            const prev = pts[i - 1];
                            if (!prev || !prev.hours || !p.hours) return null;
                            const pct = ((p.hours - prev.hours) / prev.hours * 100);
                            const sign = pct >= 0 ? "+" : "";
                            const color = pct >= 0 ? "#059669" : "#dc2626";
                            const anchor = i === pts.length - 1 ? "end" : "middle";
                            return <text x={p.x} y={pT + iH + 23} textAnchor={anchor} fontSize="7" fill={color} fontWeight="600">{sign}{pct.toFixed(1)}%</text>;
                          })()}
                          {p.hours > 0 && <text x={p.x} y={p.y - 8} textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"} fontSize="7" fill={p.isLive ? "#059669" : "#2563eb"} fontWeight="700">{p.hours.toLocaleString()}</text>}
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>* 2026 shows current live total. Final value locked Jan 1, 2027.</div>
                </div>
              );
            })()}
            </div>

            {/* Monthly + Quarterly + Eq Hours charts — 3 col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {(function() {
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
                    return { label, key, total: snapshot !== undefined ? snapshot : null, isFuture: isFuture && !isCurrentMonth, isCurrentMonth };
                  });
                  const maxBar = Math.max(...monthlyData.map(d => d.total || 0), 1);
                  const cW = 560; const cH = 110; const pL = 46; const pB = 22; const pT = 10; const pR = 10;
                  const iW = cW - pL - pR; const iH = cH - pT - pB;
                  const barW = Math.floor(iW / 12) - 4;
                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>TOTAL OPEN HOURS BY MONTH (2026)</div>
                        <button className="btn-sm" style={{ fontSize: 10 }} onClick={function() { saveSnapshot(currentKey, compute2026Total()); }}>Capture Now</button>
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
                      <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Auto-captures on first open each month. Use "Capture Now" to record manually at any time.</div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {(function() {
                  const now = new Date();
                  const currentYear = now.getFullYear();
                  const currentMonth = now.getMonth() + 1;
                  const currentQ = Math.ceil(currentMonth / 3);

                  // Build next 4 quarters
                  const quarters = [];
                  for (let i = 0; i < 4; i++) {
                    let q = currentQ + i; let y = currentYear;
                    while (q > 4) { q -= 4; y++; }
                    const startMonth = (q - 1) * 3 + 1;
                    const endMonth = q * 3;
                    // Generate YYYY-MM keys for all 3 months in this quarter
                    const monthKeys = [startMonth, startMonth + 1, startMonth + 2].map(
                      m => y + "-" + String(m).padStart(2, "0")
                    );
                    quarters.push({ label: "Q" + q + " " + y, q, y, startMonth, endMonth, monthKeys });
                  }

                  // Use computeSchedule — same source as the monthly visit chart
                  // For each contract with suggestedVisits, assign hours/revenue per scheduled visit slot
                  const qVisits  = quarters.map(() => ({ done: 0, upcoming: 0, overdue: 0 }));
                  const qRevenue = quarters.map(() => 0);

                  contracts.filter(c => parseInt(c.suggestedVisits) > 0).forEach(function(c) {
                    const n = parseInt(c.suggestedVisits);
                    const hrsPerVisit = n > 0 ? (c.contractedHours || 0) / n : 0;
                    const rate = c.hourlyRate || 0;
                    const revenuePerVisit = c.trackingType === "dollars"
                      ? (n > 0 ? (c.contractAmount || 0) / n : 0)
                      : hrsPerVisit * rate;
                    const schedule = computeSchedule(c, visits[c.id]);
                    schedule.forEach(function(slot) {
                      quarters.forEach(function(qd, qi) {
                        if (qd.monthKeys.includes(slot.targetYearMonth)) {
                          qVisits[qi][slot.status] = (qVisits[qi][slot.status] || 0) + 1;
                          qRevenue[qi] += revenuePerVisit;
                        }
                      });
                    });
                  });

                  const qTotals = qVisits.map(v => v.done + v.upcoming + v.overdue);
                  const maxQ = Math.max(...qTotals, 1);
                  const cW = 400; const cH = 110; const pL = 32; const pB = 42; const pT = 10; const pR = 10;
                  const iW = cW - pL - pR; const iH = cH - pT - pB;
                  const barW = Math.floor(iW / 4) - 20;

                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div className="cond" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#64748b" }}>SCHEDULED VISITS — NEXT 4 QUARTERS</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>based on scheduled visit slots</div>
                      </div>
                      <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible" }}>
                        {[0, 0.5, 1].map(function(frac) {
                          const val = Math.round(maxQ * frac);
                          const gy = pT + iH - frac * iH;
                          return (
                            <g key={frac}>
                              <line x1={pL} y1={gy} x2={pL + iW} y2={gy} stroke="#f1f5f9" strokeWidth="1" />
                              <text x={pL - 4} y={gy + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{val}</text>
                            </g>
                          );
                        })}
                        <line x1={pL} y1={pT + iH} x2={pL + iW} y2={pT + iH} stroke="#e2e8f0" strokeWidth="1" />
                        {quarters.map(function(qd, i) {
                          const v = qVisits[i];
                          const total = qTotals[i];
                          const rev = qRevenue[i];
                          const slotW = iW / 4;
                          const bx = pL + i * slotW + (slotW - barW) / 2;
                          const cx = bx + barW / 2;
                          const isCurrentQ = qd.q === currentQ && qd.y === currentYear;

                          // Stacked bar heights
                          const ovH  = maxQ > 0 ? (v.overdue  / maxQ) * iH : 0;
                          const dnH  = maxQ > 0 ? (v.done     / maxQ) * iH : 0;
                          const upH  = maxQ > 0 ? (v.upcoming / maxQ) * iH : 0;
                          const baseY = pT + iH;

                          const revStr = rev >= 1000000 ? "$" + (rev / 1000000).toFixed(1) + "M"
                                       : rev >= 1000    ? "$" + Math.round(rev / 1000) + "K"
                                       : "$" + Math.round(rev);
                          return (
                            <g key={qd.label}>
                              {ovH > 0 && <rect x={bx} y={baseY - ovH} width={barW} height={ovH} rx="1" fill="#dc2626" />}
                              {dnH > 0 && <rect x={bx} y={baseY - ovH - dnH} width={barW} height={dnH} rx="1" fill="#059669" />}
                              {upH > 0 && <rect x={bx} y={baseY - ovH - dnH - upH} width={barW} height={upH} rx="1" fill={isCurrentQ ? "#1d4ed8" : "#2563eb"} />}
                              {total > 0 && <text x={cx} y={baseY - ovH - dnH - upH - 3} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="700">{total}</text>}
                              <text x={cx} y={pT + iH + 12} textAnchor="middle" fontSize="9"
                                fill={isCurrentQ ? "#1d4ed8" : "#64748b"}
                                fontWeight={isCurrentQ ? "700" : "400"}>{qd.label}</text>
                              {i === 0 && <text x={pL - 4} y={pT + iH + 25} textAnchor="end" fontSize="8" fill="#059669" fontWeight="600">Rev.</text>}
                              <text x={cx} y={pT + iH + 25} textAnchor="middle" fontSize="9" fill="#059669" fontWeight="600">{revStr}</text>
                              {i === 0 && <text x={pL - 4} y={pT + iH + 36} textAnchor="end" fontSize="8" fill="#94a3b8">visits</text>}
                              <text x={cx} y={pT + iH + 36} textAnchor="middle" fontSize="8" fill="#94a3b8">
                                {v.done > 0 ? "✓" + v.done + " " : ""}{v.upcoming > 0 ? "◉" + v.upcoming + " " : ""}{v.overdue > 0 ? "⚠" + v.overdue : ""}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      <div style={{ display: "flex", gap: 12, fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
                        <span><span style={{ color: "#059669" }}>✓</span> Done</span>
                        <span><span style={{ color: "#2563eb" }}>◉</span> Upcoming</span>
                        <span><span style={{ color: "#dc2626" }}>⚠</span> Overdue</span>
                        <span style={{ marginLeft: 4 }}>Revenue = visits × hrs/visit × rate</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Eq Hours by Type — 3rd column */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {(function() {
                  const eqTotals = {};
                  contracts.forEach(function(c) {
                    (visits[c.id] || []).forEach(function(v) {
                      const eqH = v.eqHours || {};
                      const hasBreakdown = Object.values(eqH).some(h => parseFloat(h) > 0);
                      if (hasBreakdown) {
                        Object.entries(eqH).forEach(function([t, h]) {
                          const hrs = parseFloat(h) || 0;
                          if (hrs > 0) eqTotals[t] = (eqTotals[t] || 0) + hrs;
                        });
                      } else if (v.actualHours > 0) {
                        const types = c.team ? c.team.split(", ").map(t => t.trim()).filter(Boolean) : ["Unknown"];
                        types.forEach(function(t) { eqTotals[t] = (eqTotals[t] || 0) + v.actualHours / types.length; });
                      }
                    });
                  });
                  const entries = Object.entries(eqTotals).sort((a,b) => b[1]-a[1]).filter(([,h]) => h > 0);
                  const totalLogged = entries.reduce((s,[,h]) => s+h, 0);
                  const knownColors = { w1:"#2563eb",w2:"#7c3aed",w3:"#059669",log:"#d97706",pp:"#0891b2",dry:"#dc2626",insp:"#db2777",ipp:"#ea580c",irn:"#0d9488" };
                  const knownBgs   = { w1:"rgba(37,99,235,0.12)",w2:"rgba(124,58,237,0.12)",w3:"rgba(5,150,105,0.12)",log:"rgba(217,119,6,0.12)",pp:"rgba(8,145,178,0.12)",dry:"rgba(220,38,38,0.12)",insp:"rgba(219,39,119,0.12)",ipp:"rgba(234,88,12,0.12)",irn:"rgba(13,148,136,0.12)" };
                  const maxHrs = entries.length > 0 ? entries[0][1] : 1;
                  const barH = 16; const rowGap = 5; const labelW = 36; const barAreaW = 160;
                  const chartH = entries.length * (barH + rowGap);
                  return (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                        <div className="cond" style={{ fontSize:12, fontWeight:700, letterSpacing:"0.08em", color:"#64748b" }}>LOGGED HRS BY EQ TYPE</div>
                        <div style={{ fontSize:9, color:"#94a3b8" }}>Total: <strong style={{color:"#1a2235"}}>{totalLogged % 1 === 0 ? totalLogged.toFixed(0) : totalLogged.toFixed(1)}h</strong></div>
                      </div>
                      {entries.length === 0 ? (
                        <div style={{color:"#94a3b8",fontSize:11,textAlign:"center",padding:"20px 0"}}>No visits logged yet</div>
                      ) : (
                        <svg width="100%" viewBox={"0 0 " + (labelW + barAreaW + 60) + " " + chartH} style={{overflow:"visible",display:"block"}}>
                          {entries.map(function([type, hrs], i) {
                            const y = i * (barH + rowGap);
                            const k = type.toLowerCase();
                            const barColor = knownColors[k] || (getEqPillStyle(type) || {color:"#2563eb"}).color;
                            const bgColor  = knownBgs[k]   || (getEqPillStyle(type) || {background:"rgba(37,99,235,0.1)"}).background;
                            const bw = Math.max(2, (hrs / maxHrs) * barAreaW);
                            const pct = totalLogged > 0 ? (hrs/totalLogged*100).toFixed(0) : "0";
                            return (
                              <g key={type}>
                                <rect x={0} y={y+1} width={labelW-3} height={barH-2} rx={2} fill={bgColor} />
                                <text x={(labelW-3)/2} y={y+barH/2+0.5} textAnchor="middle" dominantBaseline="middle"
                                  fontSize="8" fontWeight="700" fill={barColor} fontFamily="'Barlow Condensed',sans-serif">{type}</text>
                                <rect x={labelW} y={y+2} width={barAreaW} height={barH-4} rx={2} fill="#f1f5f9"/>
                                <rect x={labelW} y={y+2} width={bw} height={barH-4} rx={2} fill={barColor} opacity="0.85"/>
                                <text x={labelW+bw+4} y={y+barH/2+0.5} dominantBaseline="middle"
                                  fontSize="8" fill="#64748b" fontFamily="'Space Mono',monospace">
                                  {hrs % 1 === 0 ? hrs.toFixed(0) : hrs.toFixed(1)}h {pct}%
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      )}
                    </div>
                  );
                })()}
              </div>

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
                if (rate === 0) return;

                // Actual: logged visits this calendar year
                (visits[c.id] || []).forEach(function(v) {
                  const d = v.date.length === 7 ? new Date(v.date + "-01") : new Date(v.date);
                  if (d.getFullYear() === year) {
                    actual[d.getMonth()] += (parseFloat(v.actualHours) || 0) * rate;
                  }
                });

                // Projected: upcoming scheduled slots this calendar year
                const sched = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
                const hrsPerVisit = parseInt(c.suggestedVisits) > 0
                  ? (c.trackingType === "dollars"
                      ? (c.contractAmount || 0) / parseInt(c.suggestedVisits)
                      : (parseFloat(c.contractedHours) || 0) / parseInt(c.suggestedVisits))
                  : 0;
                sched.forEach(function(slot) {
                  if (slot.status !== "upcoming" && slot.status !== "overdue") return;
                  const d = slot.targetDate;
                  if (d.getFullYear() === year) {
                    projected[d.getMonth()] += hrsPerVisit * rate;
                  }
                });
              });

              // Combined for y-axis scaling
              const combined = MONTHS.map((_, i) => actual[i] + projected[i]);
              const maxVal = Math.max(...combined, 1);
              const totalActual = actual.reduce((s, v) => s + v, 0);
              const totalProjected = projected.reduce((s, v) => s + v, 0);

              const cW = 700; const cH = 120; const pL = 56; const pB = 24; const pT = 10; const pR = 12;
              const iW = cW - pL - pR; const iH = cH - pT - pB;
              const slotW = iW / 12;
              const barW = Math.floor(slotW * 0.55);
              const barGap = Math.floor(slotW * 0.0);

              const fmtK = function(v) {
                if (v >= 1000) return "$" + (v / 1000).toFixed(0) + "k";
                return "$" + Math.round(v);
              };

              // Y-axis ticks
              const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ frac: f, val: maxVal * f }));

              return (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
                      const gy = pT + iH - t.frac * iH;
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
                      const cx = pL + slotW * now.getMonth() + slotW / 2;
                      return <line x1={cx} y1={pT} x2={cx} y2={pT + iH} stroke="#dbeafe" strokeWidth={slotW - 2} strokeLinecap="round" opacity="0.5" />;
                    })()}

                    {/* Stacked bars: actual (bottom, solid blue), projected (top, light blue) */}
                    {MONTHS.map(function(label, i) {
                      const cx = pL + slotW * i + slotW / 2;
                      const x = cx - barW / 2;
                      const baseY = pT + iH;
                      const actH = maxVal > 0 ? (actual[i] / maxVal) * iH : 0;
                      const prjH = maxVal > 0 ? (projected[i] / maxVal) * iH : 0;
                      const total = actual[i] + projected[i];
                      const isCurrent = year === now.getFullYear() && i === now.getMonth();
                      const isPast = year < now.getFullYear() || (year === now.getFullYear() && i < now.getMonth());

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
                    Actual = hours logged × rate. Projected = scheduled visit hrs × rate for upcoming visits. Current month highlighted.
                  </div>
                </div>
              );
            })()}

            {/* Dollar-Tracked Contracts Summary — only shown if any exist */}
            {(function() {
              const dollarContracts = contracts.filter(c => c.trackingType === "dollars");
              if (dollarContracts.length === 0) return null;
              const totalValue = dollarContracts.reduce((s, c) => s + (c.contractAmount || 0), 0);
              const totalBilled = dollarContracts.reduce((s, c) => {
                return s + (visits[c.id] || []).reduce((vs, v) => vs + (parseFloat(v.billedAmount) || 0), 0);
              }, 0);
              const totalRemaining = totalValue - totalBilled;
              const pct = totalValue > 0 ? Math.min(100, Math.round(totalBilled / totalValue * 100)) : 0;
              const barColor = pct >= 100 ? "#059669" : pct >= 80 ? "#d97706" : "#2563eb";
              return (
                <div style={{ padding: "0 28px 28px" }}>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                      <div className="cond" style={{ fontSize: 14, fontWeight: 700, color: "#1a2235", letterSpacing: "0.06em" }}>
                        $ DOLLAR-TRACKED CONTRACTS
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{dollarContracts.length} contract{dollarContracts.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 16 }}>
                      {[
                        { label: "Total Sold", val: "$" + Math.round(totalValue).toLocaleString("en-US"), color: "#1a2235" },
                        { label: "Total Billed", val: "$" + Math.round(totalBilled).toLocaleString("en-US"), color: "#2563eb" },
                        { label: "Remaining", val: "$" + Math.round(totalRemaining).toLocaleString("en-US"), color: totalRemaining <= 0 ? "#059669" : "#d97706" },
                      ].map(function(stat) {
                        return (
                          <div key={stat.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.val}</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{stat.label}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                      <span style={{ color: "#64748b" }}>Billing progress</span>
                      <span style={{ color: barColor, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#e2e8f0", borderRadius: 4, height: 8 }}>
                      <div style={{ height: "100%", width: pct + "%", background: barColor, borderRadius: 4, transition: "width 0.4s" }} />
                    </div>
                    {dollarContracts.length > 0 && (
                      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                        {dollarContracts.map(function(c) {
                          const billed = (visits[c.id] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
                          const rem = (c.contractAmount || 0) - billed;
                          const cPct = c.contractAmount > 0 ? Math.min(100, Math.round(billed / c.contractAmount * 100)) : 0;
                          const cColor = cPct >= 100 ? "#059669" : cPct >= 80 ? "#d97706" : "#2563eb";
                          return (
                            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 120px", gap: 8, alignItems: "center", padding: "6px 0", borderTop: "1px solid #f1f5f9", fontSize: 11 }}>
                              <span style={{ color: "#1a2235", fontWeight: 600, cursor: "pointer" }}
                                onClick={function() { setSelectedContract(c); }}>{c.customer}</span>
                              <span style={{ color: "#64748b", textAlign: "right" }}>${Math.round(c.contractAmount || 0).toLocaleString()}</span>
                              <span style={{ color: "#2563eb", textAlign: "right", fontWeight: 700 }}>${Math.round(billed).toLocaleString()}</span>
                              <span style={{ color: rem <= 0 ? "#059669" : "#d97706", textAlign: "right" }}>${Math.round(rem).toLocaleString()}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 3, height: 5 }}>
                                  <div style={{ height: "100%", width: cPct + "%", background: cColor, borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: 10, color: cColor, fontWeight: 700, width: 32 }}>{cPct}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

          // Use all contracts across both divisions for the master schedule
          // Division-scoped: only show current division contracts
          const allContracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");

          const enriched = allContracts
            .filter(c => parseInt(c.suggestedVisits) > 0)
            .map(c => {
              const schedule = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
              const health = getScheduleHealth(c, visits[c.id]);
              const nextUp = schedule.find(s => s.status === "upcoming" || s.status === "overdue");
              const div = knaContracts.find(x => x.id === c.id) ? "KNA" : "KCAN";
              return { c, schedule, health, nextUp, div };
            });

          const overdue  = enriched.filter(e => e.health.status === "overdue").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || 0) - ((b.nextUp && b.nextUp.targetDate) || 0));
          const dueSoon  = enriched.filter(e => e.health.status === "due-soon").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || 0) - ((b.nextUp && b.nextUp.targetDate) || 0));
          const onTrack  = enriched.filter(e => e.health.status === "on-track").sort((a, b) => ((a.nextUp && a.nextUp.targetDate) || Infinity) - ((b.nextUp && b.nextUp.targetDate) || Infinity));
          const complete = enriched.filter(e => e.health.status === "complete");
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
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
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
                    {nextUp ? fmtYM(nextUp.targetYearMonth) : doneCount === total ? "✓ Done" : "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  {/* WO dots — amber, shown alongside visit dots */}
                  {computeWOSchedule(c, workOrders[c.id] || []).map(wo => {
                    const bg = wo.status === "complete" ? "#059669" : wo.status === "overdue" ? "#dc2626" : "#f59e0b";
                    const fg = "#fff";
                    return (
                      <div key={"wo-" + wo.id}
                        title={"🔧 " + wo.title + " · " + (wo.scheduledDate ? wo.scheduledDate : "suggested " + wo.targetDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }))}
                        style={{ width: 24, height: 24, borderRadius: 4, background: bg, color: fg,
                          fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid rgba(0,0,0,0.1)" }}>
                        🔧
                      </div>
                    );
                  })}
                  {schedule.map(s => {
                    const bg = s.status === "done"
                      ? (s.wasLate ? "#d97706" : "#059669")
                      : s.status === "overdue" ? "#dc2626"
                      : s.rescheduled ? "#e0f2fe" : "#e2e8f0";
                    const fg = (s.status === "done" || s.status === "overdue") ? "#fff"
                      : s.rescheduled ? "#0369a1" : "#64748b";
                    const border = s.rescheduled && s.status !== "done" ? "1.5px dashed #0369a1" : "none";
                    const origLabel = s.originalTarget ? fmtYM(toYearMonth(s.originalTarget)) : null;
                    const tooltipParts = ["Visit " + s.visitNo + ": target " + fmtYM(s.targetYearMonth)];
                    if (s.matchedVisit) tooltipParts.push("✓ logged " + s.matchedVisit.date);
                    else tooltipParts.push("not yet logged");
                    if (s.wasLate) tooltipParts.push("⚠ logged late (original: " + origLabel + ")");
                    if (s.rescheduled && origLabel && origLabel !== fmtYM(s.targetYearMonth)) tooltipParts.push("↻ rescheduled from " + origLabel);
                    return (
                      <div key={s.visitNo}
                        title={tooltipParts.join(" · ")}
                        style={{ width: 24, height: 24, borderRadius: 4, background: bg, color: fg, border,
                          fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                        {s.status === "done" ? (s.wasLate ? "!" : "✓") : s.rescheduled ? "↻" : s.visitNo}
                      </div>
                    );
                  })}
                  {schedule.some(s => s.rescheduled) && (
                    <span style={{ fontSize: 9, color: "#0369a1", marginLeft: 2, whiteSpace: "nowrap" }}>↻ rescheduled</span>
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
          }

          const Section = function({ title, color, bg, items, defaultOpen }) {
            const [open, setOpen] = React.useState(defaultOpen !== false);
            if (items.length === 0) return null;
            return (
              <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setOpen(o => !o)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 16px", background: bg, cursor: "pointer",
                    borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                    <span style={{ color, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
                  </div>
                </div>
                {open && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 1fr 90px", gap: 12,
                      padding: "6px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Customer", "Progress", "Next Due", "Visit Timeline (hover for details)", "Status"].map(h => (
                        <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase" }}>{h}</div>
                      ))}
                    </div>
                    {items.map(e => <ScheduleRow key={e.c.id} e={e} />)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div>
              {/* 12-Month Scheduled Visits Chart */}
          {/* Rolling 12-Month Scheduled Visits Chart */}
          {(function() {
            const now = new Date();
            // Build the 12 months starting from current month
            const months = [];
            for (let i = 0; i < 12; i++) {
              const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
              months.push({
                ym: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"),
                label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " '" + String(d.getFullYear()).slice(2),
                isCurrent: i === 0,
              });
            }

            // Tally scheduled visits per month + track which contracts
            const monthContracts = {};
            months.forEach(m => { monthContracts[m.ym] = []; });

            const currentYM = months[0].ym; // first bucket = current month
            contracts.filter(c => parseInt(c.suggestedVisits) > 0).forEach(c => {
              const schedule = computeSchedule(c, visits[c.id], getOverridesForContract(c.id));
              schedule.forEach(slot => {
                // Overdue slots whose target is before the chart window → show in current month
                const bucketYM = (slot.status === "overdue" && slot.targetYearMonth < currentYM)
                  ? currentYM
                  : slot.targetYearMonth;
                if (monthContracts[bucketYM]) {
                  monthContracts[bucketYM].push({ c, slot: { ...slot, bucketedYM: bucketYM } });
                }
              });
            });
            // Also tally work orders into the same month buckets
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
                upcoming: items.filter(x => x.slot.status === "upcoming").length,
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
                  <svg width="100%" viewBox={"0 0 " + cW + " " + cH} style={{ overflow: "visible", cursor: "pointer" }}>
                    {/* Grid lines */}
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

                    {/* Stacked bars */}
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
                        {/* Full-column drop zone (invisible, covers whole column) */}
                        <rect x={pL + slotW * i} y={pT - 4} width={slotW} height={iH + 28}
                          fill="transparent"
                          onDragOver={draggingSlot ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverMonth(d.ym); } : undefined}
                          onDragLeave={draggingSlot ? () => setDragOverMonth(prev => prev === d.ym ? null : prev) : undefined}
                          onDrop={draggingSlot ? (e) => {
                            e.preventDefault();
                            if (draggingSlot.isWorkOrder) {
                              // Update scheduledDate directly on the work order
                              updateWorkOrder(draggingSlot.contractId, draggingSlot.woId, { scheduledDate: d.ym + "-01" });
                            } else {
                              applyScheduleOverride(draggingSlot.contractId, draggingSlot.visitNo, d.ym);
                            }
                            setDraggingSlot(null);
                            setDragOverMonth(null);
                            setSelectedScheduleMonth(d.ym);
                          } : undefined}
                        />
                        {/* Hover/selected highlight zone */}
                        <rect x={x - 3} y={pT} width={barW + 6} height={iH + 4}
                          fill={isDragOver ? "rgba(14,165,233,0.18)" : isSelected ? "rgba(37,99,235,0.08)" : "transparent"}
                          stroke={isDragOver ? "#0ea5e9" : isSelected ? "#2563eb" : "none"} strokeWidth={isDragOver ? "2" : "1"} rx="3" />
                        {isDragOver && <text x={cx} y={pT + iH / 2} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#0369a1" fontWeight="700">DROP HERE</text>}
                        {/* Overdue (red, bottom) */}
                        {ovH > 0 && <rect x={x} y={baseY - ovH} width={barW} height={ovH} fill="#dc2626" rx="1" />}
                        {/* Done (green) */}
                        {doneH > 0 && <rect x={x} y={baseY - ovH - doneH} width={barW} height={doneH} fill="#059669" rx="1" />}
                        {/* Upcoming (blue, top) */}
                        {upH > 0 && <rect x={x} y={baseY - ovH - doneH - upH} width={barW} height={upH} fill={d.isCurrent ? "#1d4ed8" : "#2563eb"} rx="1" />}
                        {/* Total label */}
                        {total > 0 && <text x={cx} y={baseY - ovH - doneH - upH - 3} textAnchor="middle" fontSize="7" fill={isSelected ? "#2563eb" : "#64748b"} fontWeight="600">{total}</text>}
                        {/* X-axis label */}
                        <text x={cx} y={pT + iH + 14} textAnchor="middle" fontSize="7" fill={isSelected ? "#2563eb" : d.isCurrent ? "#1d4ed8" : "#94a3b8"} fontWeight={d.isCurrent || isSelected ? "700" : "400"}>{d.label}</text>
                      </g>
                    );
                    })}
                  </svg>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Click a bar to see contracts scheduled that month. Drag a visit card to a bar to reschedule it.</div>
                </div>

                {/* Month detail panel */}
                {selectedData && (
                  <div style={{ background: "#fff", border: "1px solid #2563eb", borderRadius: 6, padding: "14px 16px", marginTop: 8, boxShadow: "0 2px 8px rgba(37,99,235,0.10)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <span className="cond" style={{ fontSize: 14, fontWeight: 700, color: "#1a2235", letterSpacing: "0.06em" }}>
                        {selectedData.label.toUpperCase()} — {selectedData.items.length} SCHEDULED VISIT{selectedData.items.length !== 1 ? "S" : ""}
                      </span>
                      <span style={{ marginLeft: 12, fontSize: 11, color: "#94a3b8" }}>
                        {selectedData.done > 0 && <span style={{ color: "#059669", marginRight: 10 }}>✓ {selectedData.done} done</span>}
                        {selectedData.upcoming > 0 && <span style={{ color: "#2563eb", marginRight: 10 }}>◉ {selectedData.upcoming} upcoming</span>}
                        {selectedData.overdue > 0 && <span style={{ color: "#dc2626" }}>⚠ {selectedData.overdue} overdue</span>}
                      </span>
                    </div>
                    <button onClick={() => setSelectedScheduleMonth(null)}
                      style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>✕</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                    {selectedData.items.sort((a, b) => {
                      const order = { overdue: 0, upcoming: 1, done: 2 };
                      return (order[a.slot.status] !== undefined ? order[a.slot.status] : 3) - (order[b.slot.status] !== undefined ? order[b.slot.status] : 3);
                    }).map(({ c, slot }, idx) => {
                      const isWO = !!slot.isWorkOrder;
                      const statusColor = isWO
                        ? (slot.status === "done" ? "#059669" : slot.status === "overdue" ? "#dc2626" : "#d97706")
                        : (slot.status === "done" ? "#059669" : slot.status === "overdue" ? "#dc2626" : "#2563eb");
                      const statusBg = isWO
                        ? (slot.status === "done" ? "rgba(5,150,105,0.07)" : slot.status === "overdue" ? "rgba(220,38,38,0.07)" : "rgba(217,119,6,0.07)")
                        : (slot.status === "done" ? "rgba(5,150,105,0.07)" : slot.status === "overdue" ? "rgba(220,38,38,0.07)" : "rgba(37,99,235,0.07)");
                      const statusLabel = slot.status === "done" ? "Done" : slot.status === "overdue" ? "Overdue" : isWO ? "Scheduled" : "Upcoming";
                      const eqTypes = c.team ? c.team.split(", ").map(t => t.trim()).filter(Boolean) : [];
                      return (
                        <div key={idx}
                          draggable={slot.status !== "done"}
                          onDragStart={slot.status !== "done" ? (e) => {
                            e.dataTransfer.effectAllowed = "move";
                            if (slot.isWorkOrder) {
                              setDraggingSlot({ contractId: c.id, woId: slot.woData.id, isWorkOrder: true, customerLabel: c.customer, visitLabel: "🔧 " + (slot.woData.title || "Work Order") });
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
                                {slot.manuallyMoved && <span style={{ fontSize: 9, color: "#0369a1" }} title="Manually rescheduled">↻</span>}
                                {slot.status !== "done" && <span style={{ fontSize: 9, color: "#94a3b8" }} title="Drag to reschedule">⠿</span>}
                                <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, whiteSpace: "nowrap" }}>{statusLabel}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                              {isWO ? <span>🔧 {slot.woData && slot.woData.title}</span> : (function() {
                                const ippInfo = getContractIpp(c.id);
                                const baseLabel = ippInfo ? ippInfo.program.group + " IPP · Visit " + slot.visitNo + " of " + c.suggestedVisits : "Visit " + slot.visitNo + " of " + c.suggestedVisits;
                                const dollarTag = c.trackingType === "dollars" ? " · $" : "";
                                return <span>{baseLabel}{dollarTag}</span>;
                              })()}
                              {!isWO && (function() {
                                const linkedWOs = (workOrders[c.id] || []).filter(wo => String(wo.linkedVisitNo) === String(slot.visitNo));
                                if (linkedWOs.length === 0) return null;
                                return <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#fff", background: "#d97706", border: "1px solid #b45309", borderRadius: 3, padding: "2px 6px", letterSpacing: "0.03em", boxShadow: "0 1px 2px rgba(180,83,9,0.3)" }}>🔧 {linkedWOs.length} WO</span>;
                              })()}
                              {c.contractNo && <span style={{ marginLeft: 8, color: "#94a3b8" }}>#{c.contractNo}</span>}
                              {(function() {
                                const ippInfo = getContractIpp(c.id);
                                if (!ippInfo) return null;
                                const { site } = ippInfo;
                                const visitTasks = site.visitTasks || {};
                                const totalTasks = Object.values(visitTasks).reduce((s, tasks) => s + tasks.length, 0);
                                const doneTasks = Object.values(visitTasks).reduce((s, tasks) => s + tasks.filter(t => (t.completions || []).length > 0).length, 0);
                                return <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: doneTasks === totalTasks && totalTasks > 0 ? "#059669" : "#2563eb", background: doneTasks === totalTasks && totalTasks > 0 ? "rgba(5,150,105,0.1)" : "rgba(37,99,235,0.1)", border: "1px solid " + (doneTasks === totalTasks && totalTasks > 0 ? "rgba(5,150,105,0.3)" : "rgba(37,99,235,0.3)"), borderRadius: 3, padding: "2px 6px" }}>📋 {doneTasks}/{totalTasks}</span>;
                              })()}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>VISIT SCHEDULE</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    All {enriched.length} contracts with suggested visits · evenly spaced across contract period · click any row to open
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { label: "Overdue",   val: overdue.length,  color: "#dc2626" },
                    { label: "Due Soon",  val: dueSoon.length,  color: "#d97706" },
                    { label: "On Track",  val: onTrack.length,  color: "#2563eb" },
                    { label: "Complete",  val: complete.length, color: "#059669" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Section title="🔴  OVERDUE — Visits past their target window"  color="#dc2626" bg="rgba(220,38,38,0.04)"   items={overdue}  defaultOpen={true} />
              <Section title="🟡  DUE SOON — Next visit within 30 days"       color="#d97706" bg="rgba(217,119,6,0.04)"   items={dueSoon}  defaultOpen={true} />
              <Section title="🟢  ON TRACK — Next visit more than 30 days out" color="#2563eb" bg="rgba(37,99,235,0.04)"  items={onTrack}  defaultOpen={true} />
              <Section title="✅  COMPLETE — All visits logged"                color="#059669" bg="rgba(5,150,105,0.04)"  items={complete} defaultOpen={false} />

              {noSchedule.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                  {noSchedule.length} contract{noSchedule.length !== 1 ? "s" : ""} have no suggested visit count — set one in the Visit Panel to include them here.
                </div>
              )}

              {/* Work Orders section */}
              {(function() {
                // Collect all work orders across all active contracts with computed schedule
                const allWOs = [];
                allContracts.forEach(c => {
                  const woSched = computeWOSchedule(c, workOrders[c.id] || []);
                  woSched.forEach(wo => allWOs.push({ wo, c }));
                });
                const scheduledWOs = allWOs.filter(x => x.wo.status !== "complete").sort((a, b) => (a.wo.targetDate || new Date("9999")) < (b.wo.targetDate || new Date("9999")) ? -1 : 1);
                const completeWOs  = allWOs.filter(x => x.wo.status === "complete").sort((a, b) => (b.wo.completedAt || "") < (a.wo.completedAt || "") ? -1 : 1);
                if (allWOs.length === 0) return null;

                const WOSection = function({ title, color, bg, items, defaultOpen }) {
                  const [open, setOpen] = React.useState(defaultOpen !== false);
                  if (items.length === 0) return null;
                  return (
                    <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                      <div onClick={() => setOpen(o => !o)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 16px", background: bg, cursor: "pointer", borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                          <span style={{ color, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
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
                                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{c.customer}</div>
                                  <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{wo.title}</div>
                                  {wo.serialNumber && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>🔢 {wo.serialNumber}</div>}
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
                                  {wo.actualHours && wo.estimatedHours && wo.actualHours !== wo.estimatedHours &&
                                    <div style={{ fontSize: 9, color: "#94a3b8" }}>est. {wo.estimatedHours}h</div>}
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
                }

                return (
                  <div style={{ marginTop: 32 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em", marginBottom: 4 }}>WORK ORDERS</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>
                      {scheduledWOs.length} scheduled · {completeWOs.length} complete · click any row to open contract
                    </div>
                    <WOSection title="🔧  SCHEDULED — Open work orders" color="#d97706" bg="rgba(217,119,6,0.04)" items={scheduledWOs} defaultOpen={true} />
                    <WOSection title="✅  COMPLETE — Finished work orders" color="#059669" bg="rgba(5,150,105,0.04)" items={completeWOs} defaultOpen={false} />
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* RENEWALS VIEW */}
        {view === "renewals" && (function() {
          // Division-scoped: only show current division contracts
          const allContracts = allDivisionContracts.filter(c => getContractStatus(c) !== "archived");
          const today = new Date();

          // Classify every contract
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
            const p = parseExtensionParts(c.extensionDate);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 130px 140px 160px", gap: 12,
                alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f1f5f9",
                background: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2235" }}>{c.customer}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                    {div}{c.team ? " · " + c.team : ""}{c.contractNo ? " · #" + c.contractNo : ""}
                    {renewalCount > 0 && <span style={{ marginLeft: 6, color: "#6366f1", fontWeight: 700 }}>↻ {renewalCount} renewal{renewalCount > 1 ? "s" : ""}</span>}
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
                      border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>Renew →</button>
                  <ConfirmArchiveButton onConfirm={() => archiveContract(c.id)}
                    style={{ fontSize: 11, padding: "4px 10px" }} />
                </div>
              </div>
            );
          }

          const RenewalSection = function({ title, color, bg, items, defaultOpen }) {
            const [open, setOpen] = React.useState(defaultOpen !== false);
            if (items.length === 0) return null;
            return (
              <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 16px", background: bg, cursor: "pointer",
                  borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color }}>{title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 10, background: color, color: "#fff" }}>{items.length}</span>
                    <span style={{ color, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
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
          }

          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>CONTRACT RENEWALS</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    Contracts expiring within 90 days or already expired · click Renew to review terms
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { label: "Expired",   val: expired.length,  color: "#dc2626" },
                    { label: "≤30 Days",  val: dueSoon.length,  color: "#d97706" },
                    { label: "31–90 Days",val: upcoming.length, color: "#6366f1" },
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
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>No renewals due in the next 90 days</div>
                </div>
              )}

              <RenewalSection title="🔴  EXPIRED — Immediate action needed"      color="#dc2626" bg="rgba(220,38,38,0.04)"  items={expired}  defaultOpen={true} />
              <RenewalSection title="🟡  EXPIRING SOON — Within 30 days"         color="#d97706" bg="rgba(217,119,6,0.04)"  items={dueSoon}  defaultOpen={true} />
              <RenewalSection title="🟣  COMING UP — Expiring in 31–90 days"     color="#6366f1" bg="rgba(99,102,241,0.04)" items={upcoming} defaultOpen={true} />
            </div>
          );
        })()}


        {/* IPP VIEW */}
        {view === "ipp" && (function() {
          // Build cross-division contract lookup — tag each with its division
          // to avoid ID collisions between KNA and KCAN contract sets
          const knaContractSet = knaContracts.filter(c => getContractStatus(c) !== "archived").map(c => ({ ...c, _division: "KNA" }));
          const kcanContractSet = kcanContracts.filter(c => getContractStatus(c) !== "archived").map(c => ({ ...c, _division: "KCAN" }));
          const allContracts = [...knaContractSet, ...kcanContractSet];
          // Safe lookup by contractId + division hint stored on site, or brute-force match
          const findContractForSite = function(site) {
            if (site._division) {
              const set = site._division === "KNA" ? knaContractSet : kcanContractSet;
              return set.find(c => c.id === site.contractId);
            }
            // Legacy: no division tag — try current division first, then other
            const divSet = division === "KNA" ? knaContractSet : kcanContractSet;
            const otherSet = division === "KNA" ? kcanContractSet : knaContractSet;
            return divSet.find(c => c.id === site.contractId) || otherSet.find(c => c.id === site.contractId);
          };
          const allGroups = [...CORPORATE_GROUPS, ...extraGroups].filter(g => g !== "None");

          // ── Local UI state via a single useState at component level ──
          // (ippUiState is declared at App level below — see injection point)
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
            // Filter: only show programs that contain at least one contract in the current division
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
                        onChange={function(e) { setIppFilter(e.target.checked); }}
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
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
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
                          const pct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
                          const barColor = pct === 100 ? "#059669" : pct > 50 ? "#d97706" : "#2563eb";
                          // Visit stats
                          const totalVisits = prog.sites.reduce(function(s, site) { return s + (site.visitCount || 0); }, 0);
                          const doneVisits = prog.sites.reduce(function(s, site) {
                            const allVisits = { ...knaVisits, ...kcanVisits };
                            return s + ((allVisits[site.contractId] || []).length);
                          }, 0);
                          // Hours stats
                          const totalHours = prog.sites.reduce(function(s, site) {
                            return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                              return ts + tasks.reduce(function(hs, t) { return hs + (parseFloat(t.hours) || 0); }, 0);
                            }, 0);
                          }, 0);
                          const doneHours = prog.sites.reduce(function(s, site) {
                            const allVisits = { ...knaVisits, ...kcanVisits };
                            return s + ((allVisits[site.contractId] || []).reduce(function(vs, v) { return vs + (v.actualHours || 0); }, 0));
                          }, 0);
                          return (
                            <div key={prog.id}
                              onClick={function() { setSelectedProgram(prog); setIppView("detail"); }}
                              style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                              onMouseEnter={function(e) { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#f8faff"; }}
                              onMouseLeave={function(e) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2235" }}>{prog.name}</div>
                                  <span style={{ fontSize: 10, color: "#94a3b8", background: "#f1f5f9", borderRadius: 3, padding: "1px 6px" }}>{prog.startDate && prog.endDate ? prog.startDate + " – " + prog.endDate : "No dates set"}</span>
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
                                            <span style={{ fontSize: 10, color: color, fontWeight: 700, width: 70, textAlign: "right", flexShrink: 0 }}>{row.fmt(row.done)}/{row.fmt(row.total)} · {row.pct}%</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                              <div style={{ display: "flex", gap: 8 }} onClick={function(e) { e.stopPropagation(); }}>
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
                  // Remove IPP tag from contract if not in any other saved program
                  const stillInOther = ippPrograms.some(saved => saved.id !== p.id && (saved.sites || []).some(s => s.contractId === contractId && s._division === contractDivision));
                  if (!stillInOther) {
                    const removeIppTag = function(contracts) {
                      return contracts.map(c => {
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
                    // Rebuild visitTasks keys when visit count changes
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
                  <button className="btn-sm" onClick={function() { setIppView("list"); setEditingProgram(null); }}>← Back</button>
                  <div className="cond" style={{ fontSize: 20, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>
                    {isNew ? "NEW IPP PROGRAM" : "EDIT IPP PROGRAM"}
                  </div>
                </div>

                {/* Program meta */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Program Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 10 }}>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Program Name</label>
                      <input value={prog.name} onChange={function(e) { updateProg("name", e.target.value); }}
                        placeholder="e.g. Alsco IPP 2026" style={{ width: "100%" }} />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Customer Group</label>
                      <select value={prog.group} onChange={function(e) { updateProg("group", e.target.value); updateProg("sites", []); }} style={{ width: "100%" }}>
                        <option value="">— Select group —</option>
                        {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Start Date</label>
                      <input type="date" value={prog.startDate || ""} onChange={function(e) { updateProg("startDate", e.target.value); }}
                        style={{ width: "100%" }} />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>End Date</label>
                      <input type="date" value={prog.endDate || ""} onChange={function(e) { updateProg("endDate", e.target.value); }}
                        style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>

                {/* Site selection */}
                {prog.group && (
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: sitesCollapsed ? 0 : 14 }}
                      onClick={function() { setSitesCollapsed(!sitesCollapsed); }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Participating Sites — {prog.group}
                        <span style={{ marginLeft: 8, color: "#2563eb" }}>({(prog.sites || []).length} enrolled)</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#94a3b8", userSelect: "none" }}>{sitesCollapsed ? "▶ Show" : "▼ Hide"}</span>
                    </div>
                    {!sitesCollapsed && (groupContracts.length === 0 ? (
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>No active contracts found for {prog.group}.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {groupContracts.map(function(c) {
                          const enrolled = (prog.sites || []).find(s => s.contractId === c.id && s._division === c._division);
                          return (
                            <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                              background: enrolled ? "rgba(37,99,235,0.05)" : "#f8fafc", border: "1px solid " + (enrolled ? "rgba(37,99,235,0.2)" : "#e2e8f0") }}>
                              <input type="checkbox" checked={!!enrolled} onChange={function(e) {
                                if (enrolled) {
                                  // Check if this site has any tasks defined
                                  const taskCount = Object.values(enrolled.visitTasks || {}).reduce(function(s, tasks) { return s + tasks.length; }, 0);
                                  if (taskCount > 0) {
                                    if (!window.confirm("Remove " + c.customer + " from this IPP? This will delete all " + taskCount + " task" + (taskCount !== 1 ? "s" : "") + " entered for this site.")) {
                                      e.preventDefault();
                                      return;
                                    }
                                  }
                                }
                                toggleSite(c.id, c._division);
                              }}
                                style={{ accentColor: "#2563eb" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a2235" }}>{c.customer}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.extensionDate || "No term set"} · {c.trackingType === "dollars" ? "$" + (c.contractAmount || 0).toLocaleString() : c.contractedHours + "h"}</div>
                              </div>
                              {enrolled && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={function(e) { e.preventDefault(); }}>
                                  <span style={{ fontSize: 11, color: "#64748b" }}>Visits:</span>
                                  <input type="number" min={1} max={12} value={enrolled.visitCount}
                                    onChange={function(e) { updateSite(c.id, "visitCount", e.target.value, c._division); }}
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

                {/* Task definition per site per visit */}
                {(prog.sites || []).length > 0 && (function() {
                  // Drag state lives in ippUiState to avoid hook-in-IIFE
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

                  const moveVisit = function(contractId, fromIdx, direction, siteDivision) {
                    const toIdx = fromIdx + direction;
                    setEditingProgram(function(p) {
                      return { ...p, sites: p.sites.map(function(s) {
                        if (s.contractId !== contractId || (siteDivision && s._division !== siteDivision)) return s;
                        const n = s.visitCount || 1;
                        if (toIdx < 1 || toIdx > n) return s;
                        // Swap visit task lists for fromIdx and toIdx
                        const vt = s.visitTasks || {};
                        const newVt = { ...vt };
                        const tmp = newVt[fromIdx] || [];
                        newVt[fromIdx] = newVt[toIdx] || [];
                        newVt[toIdx] = tmp;
                        return { ...s, visitTasks: newVt };
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
                          <div key={site.contractId} style={{ marginBottom: 24 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a2235", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, background: "#f1f5f9", borderRadius: 4, padding: "2px 8px", color: "#64748b" }}>📍</span>
                              {c.customer}
                              <span style={{ fontSize: 10, color: "#94a3b8" }}>{n} visit{n !== 1 ? "s" : ""}</span>
                            </div>
                            {Array.from({ length: n }, function(_, i) { return i + 1; }).map(function(vNo) {
                              const tasks = (site.visitTasks || {})[vNo] || [];
                              const isDropTarget = dragOverVisit && dragOverVisit.contractId === site.contractId && dragOverVisit.vNo === vNo
                                && taskDrag && taskDrag.contractId === site.contractId && taskDrag.fromVisitNo !== vNo;
                              return (
                                <div key={vNo} style={{ marginBottom: 12, paddingLeft: 12,
                                  borderLeft: isDropTarget ? "3px solid #2563eb" : "2px solid #e2e8f0",
                                  background: isDropTarget ? "rgba(37,99,235,0.03)" : "transparent",
                                  borderRadius: isDropTarget ? "0 4px 4px 0" : 0,
                                  transition: "border-color 0.1s, background 0.1s" }}
                                  onDragOver={function(e) { e.preventDefault(); setDragOverVisit({ contractId: site.contractId, vNo }); }}
                                  onDragLeave={function() { setDragOverVisit(null); }}
                                  onDrop={function(e) {
                                    e.preventDefault();
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
                                    <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                                      <button onClick={function() { moveVisit(site.contractId, vNo, -1, site._division); }}
                                        disabled={vNo === 1}
                                        title="Move visit up"
                                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 3, padding: "1px 6px", fontSize: 11, cursor: vNo === 1 ? "not-allowed" : "pointer", color: vNo === 1 ? "#cbd5e1" : "#64748b" }}>↑</button>
                                      <button onClick={function() { moveVisit(site.contractId, vNo, 1, site._division); }}
                                        disabled={vNo === n}
                                        title="Move visit down"
                                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 3, padding: "1px 6px", fontSize: 11, cursor: vNo === n ? "not-allowed" : "pointer", color: vNo === n ? "#cbd5e1" : "#64748b" }}>↓</button>
                                    </div>
                                  </div>
                                  {tasks.length === 0 && (
                                    <div style={{ fontSize: 11, color: isDropTarget ? "#2563eb" : "#94a3b8", fontStyle: "italic", paddingLeft: 4 }}>
                                      {isDropTarget ? "Drop here to move task" : "No tasks defined — click '+ Task' to add"}
                                    </div>
                                  )}
                                  {tasks.map(function(task) {
                                    const isDragging = taskDrag && taskDrag.taskId === task.id;
                                    return (
                                      <div key={task.id}
                                        draggable={true}
                                        onDragStart={function(e) {
                                          e.dataTransfer.effectAllowed = "move";
                                          setTaskDrag({ contractId: site.contractId, fromVisitNo: vNo, taskId: task.id });
                                        }}
                                        onDragEnd={function() { setTaskDrag(null); setDragOverVisit(null); }}
                                        style={{ display: "grid", gridTemplateColumns: "16px 1fr 2fr 70px 24px", gap: 6, marginBottom: 4, alignItems: "center",
                                          opacity: isDragging ? 0.4 : 1, cursor: "grab" }}>
                                        <span style={{ color: "#94a3b8", fontSize: 13, cursor: "grab", userSelect: "none", textAlign: "center" }}
                                          title="Drag to move to another visit">⠿</span>
                                        <input value={task.category} onChange={function(e) { updateTask(site.contractId, vNo, task.id, "category", e.target.value, site._division); }}
                                          onMouseDown={function(e) { e.stopPropagation(); }}
                                          placeholder="Category (e.g. Dryer PM)"
                                          style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11 }} />
                                        <input value={task.description} onChange={function(e) { updateTask(site.contractId, vNo, task.id, "description", e.target.value, site._division); }}
                                          onMouseDown={function(e) { e.stopPropagation(); }}
                                          placeholder="Description (e.g. Dryer burner inspection and maintenance)"
                                          style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11 }} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                          <span style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Hours</span>
                                          <input type="number" step="0.25" min="0" value={task.hours || ""}
                                            onChange={function(e) { updateTask(site.contractId, vNo, task.id, "hours", e.target.value, site._division); }}
                                            onMouseDown={function(e) { e.stopPropagation(); }}
                                            placeholder="0"
                                            style={{ padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, textAlign: "center", width: "100%" }} />
                                        </div>
                                        <button onClick={function() { removeTask(site.contractId, vNo, task.id, site._division); }}
                                          style={{ background: "none", border: "none", color: "#dc2626", fontSize: 14, cursor: "pointer", padding: 0, marginTop: 14 }}>×</button>
                                      </div>
                                    );
                                  })}
                                  {tasks.length > 0 && isDropTarget && (
                                    <div style={{ fontSize: 10, color: "#2563eb", fontStyle: "italic", paddingLeft: 20, marginTop: 4 }}>Drop to add here</div>
                                  )}
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
            // Refresh from live state
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
              const allVisits = { ...knaVisits, ...kcanVisits };
              return s + ((allVisits[site.contractId] || []).length);
            }, 0);
            const totalHours = prog.sites.reduce(function(s, site) {
              return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                return ts + tasks.reduce(function(hs, t) { return hs + (parseFloat(t.hours) || 0); }, 0);
              }, 0);
            }, 0);
            const doneHours = prog.sites.reduce(function(s, site) {
              const allVisits = { ...knaVisits, ...kcanVisits };
              return s + ((allVisits[site.contractId] || []).reduce(function(vs, v) { return vs + (v.actualHours || 0); }, 0));
            }, 0);

            // Export report as printable HTML
            const exportReport = function(siteOnly) {
              const sitesToExport = siteOnly ? prog.sites.filter(s => s.contractId === activeSiteId) : prog.sites;
              let html = '<html><head><meta charset="UTF-8"><style>';
              html += 'body{font-family:Arial,sans-serif;font-size:12px;color:#1a2235;padding:32px;max-width:900px;margin:0 auto}';
              html += 'h1{font-size:22px;font-weight:700;margin-bottom:4px}';
              html += '.subtitle{color:#64748b;margin-bottom:24px;font-size:13px}';
              html += '.site{margin-bottom:32px;page-break-inside:avoid}';
              html += '.site-name{font-size:15px;font-weight:700;padding:8px 0;border-bottom:2px solid #e2e8f0;margin-bottom:12px}';
              html += '.visit-block{margin-bottom:16px}';
              html += '.visit-label{font-size:11px;font-weight:700;color:#2563eb;background:rgba(37,99,235,0.08);display:inline-block;padding:2px 10px;border-radius:3px;margin-bottom:8px}';
              html += 'table{width:100%;border-collapse:collapse;margin-bottom:8px}';
              html += 'th{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;text-align:left;padding:4px 8px;border-bottom:1px solid #e2e8f0}';
              html += 'td{padding:6px 8px;border-bottom:1px solid #f1f5f9;font-size:11px}';
              html += '.done{color:#059669;font-weight:700}.open{color:#d97706;font-weight:700}';
              html += '.summary{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 16px;margin-bottom:24px;display:flex;gap:24px}';
              html += '.stat{text-align:center}.stat-val{font-size:20px;font-weight:700;color:#1a2235}.stat-lbl{font-size:10px;color:#94a3b8;text-transform:uppercase}';
              html += '</style></head><body>';
              html += '<h1>' + prog.name + '</h1>';
              html += '<div class="subtitle">Investment Protection Program · ' + prog.group + ' · ' + (prog.startDate && prog.endDate ? prog.startDate + ' – ' + prog.endDate : 'No dates set') + (siteOnly ? ' · ' + ((knaContractSet.find(c => c.id === activeSiteId) || kcanContractSet.find(c => c.id === activeSiteId)) || {}).customer : '') + '</div>';
              const exportDone = sitesToExport.reduce(function(s, site) {
                return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) { return ts + tasks.filter(t => (t.completions || []).length > 0).length; }, 0);
              }, 0);
              const exportTotal = sitesToExport.reduce(function(s, site) {
                return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) { return ts + tasks.length; }, 0);
              }, 0);
              const exportTotalVisits = sitesToExport.reduce(function(s, site) { return s + (site.visitCount || 0); }, 0);
              const exportDoneVisits = sitesToExport.reduce(function(s, site) {
                const allVisits = { ...knaVisits, ...kcanVisits };
                return s + ((allVisits[site.contractId] || []).length);
              }, 0);
              const exportTotalHours = sitesToExport.reduce(function(s, site) {
                return s + Object.values(site.visitTasks || {}).reduce(function(ts, tasks) {
                  return ts + tasks.reduce(function(hs, t) { return hs + (parseFloat(t.hours) || 0); }, 0);
                }, 0);
              }, 0);
              const exportDoneHours = sitesToExport.reduce(function(s, site) {
                const allVisits = { ...knaVisits, ...kcanVisits };
                return s + ((allVisits[site.contractId] || []).reduce(function(vs, v) { return vs + (v.actualHours || 0); }, 0));
              }, 0);
              html += '<div class="summary">';
              html += '<div class="stat"><div class="stat-val">' + sitesToExport.length + '</div><div class="stat-lbl">Sites</div></div>';
              html += '<div class="stat"><div class="stat-val">' + exportDoneVisits + '/' + exportTotalVisits + '</div><div class="stat-lbl">Visits</div></div>';
              html += '<div class="stat"><div class="stat-val">' + exportDoneHours.toFixed(1) + '/' + exportTotalHours.toFixed(1) + '</div><div class="stat-lbl">Hours</div></div>';
              html += '<div class="stat"><div class="stat-val">' + exportDone + '/' + exportTotal + '</div><div class="stat-lbl">Tasks</div></div>';
              html += '<div class="stat"><div class="stat-val">' + (exportTotal > 0 ? Math.round(exportDone / exportTotal * 100) : 0) + '%</div><div class="stat-lbl">Progress</div></div>';
              html += '</div>';
              sitesToExport.forEach(function(site) {
                const c = findContractForSite(site);
                if (!c) return;
                html += '<div class="site"><div class="site-name">📍 ' + c.customer + '</div>';
                const n = site.visitCount || 1;
                for (let v = 1; v <= n; v++) {
                  const tasks = (site.visitTasks || {})[v] || [];
                  html += '<div class="visit-block"><div class="visit-label">Visit ' + v + '</div>';
                  if (tasks.length === 0) { html += '<div style="color:#94a3b8;font-style:italic;font-size:11px;padding:4px 0">No tasks defined</div>'; }
                  else {
                    html += '<table><thead><tr><th>Category</th><th>Description</th><th>Hours</th><th>Status</th><th>Completed</th></tr></thead><tbody>';
                    tasks.forEach(function(t) {
                      const done = (t.completions || []).length > 0;
                      const lastComp = done ? t.completions[t.completions.length - 1] : null;
                      html += '<tr><td>' + (t.category || '') + '</td><td>' + (t.description || '') + '</td><td>' + (t.hours ? t.hours + 'h' : '—') + '</td>';
                      html += '<td class="' + (done ? "done" : "open") + '">' + (done ? "✓ Complete" : "○ Open") + '</td>';
                      html += '<td>' + (lastComp ? lastComp.date + (lastComp.techs ? ' · ' + lastComp.techs : '') : '—') + '</td></tr>';
                    });
                    html += '</tbody></table>';
                  }
                  html += '</div>';
                }
                html += '</div>';
              });
              html += '<div style="margin-top:32px;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px">Generated ' + new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + ' · Kannegiesser North America</div>';
              html += '</body></html>';
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = prog.name.replace(/\s+/g, "_") + (siteOnly ? "_" + ((knaContractSet.find(c => c.id === activeSiteId) || kcanContractSet.find(c => c.id === activeSiteId)) || {}).customer.replace(/[\s,;]+/g, "_") : "_All_Sites") + "_IPP_Report.html";
              a.click();
              URL.revokeObjectURL(url);
            };

            return (
              <div style={{ padding: "24px 28px", maxWidth: 960, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
                  <button className="btn-sm" onClick={function() { setIppView("list"); setSelectedProgram(null); }}>← Back</button>
                  <div style={{ flex: 1 }}>
                    <div className="cond" style={{ fontSize: 22, fontWeight: 700, color: "#1a2235", letterSpacing: "0.05em" }}>{prog.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{prog.group} · {prog.startDate && prog.endDate ? prog.startDate + " – " + prog.endDate : "No dates set"} · {prog.sites.length} site{prog.sites.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-sm" style={{ fontSize: 10 }}
                      onClick={function() { exportReport(false); }}>⬇ Full Report</button>
                    <button className="btn-sm" style={{ fontSize: 10 }}
                      onClick={function() { exportReport(true); }}>⬇ Site Report</button>
                    <button className="btn-sm" style={{ fontSize: 10 }}
                      onClick={function() { setEditingProgram({ ...prog }); setSitesCollapsed(true); setIppView("setup"); }}>Edit</button>
                  </div>
                </div>

                {/* Group summary bar */}
                {(function() {
                  const vPct = totalVisits > 0 ? Math.round(doneVisits / totalVisits * 100) : 0;
                  const hPct = totalHours > 0 ? Math.round(doneHours / totalHours * 100) : 0;
                  const tPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
                  const statRows = [
                    { label: "Visits", done: doneVisits,        total: totalVisits, pct: vPct, fmt: function(v) { return v; } },
                    { label: "Hours",  done: doneHours,         total: totalHours,  pct: hPct, fmt: function(v) { return v.toFixed(1); } },
                    { label: "Tasks",  done: doneTasks,         total: totalTasks,  pct: tPct, fmt: function(v) { return v; } },
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
                                  <span style={{ fontSize: 11, color: color, fontWeight: 700 }}>{row.fmt(row.done)} / {row.fmt(row.total)} · {row.pct}%</span>
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

                {/* Site tabs + task grid */}
                <div style={{ display: "flex", gap: 16 }}>
                  {/* Site list sidebar */}
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

                  {/* Task grid for active site */}
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
                                          <div style={{ fontSize: 14, color: done ? "#059669" : "#cbd5e1" }}>{done ? "✓" : "○"}</div>
                                          <div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: done ? "#059669" : "#1a2235", textDecoration: done ? "none" : "none" }}>{task.category || <span style={{ color: "#94a3b8" }}>—</span>}</div>
                                          </div>
                                          <div style={{ fontSize: 11, color: "#64748b" }}>{task.description || "—"}</div>
                                          <div style={{ fontSize: 10, color: "#94a3b8" }}>
                                            {lastComp ? lastComp.date + (lastComp.techs ? " · " + lastComp.techs : "") : "—"}
                                          </div>
                                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            {done ? (
                                              <button className="btn-sm" style={{ fontSize: 9, padding: "2px 8px", color: "#64748b" }}
                                                onClick={function() { revertIppTaskCompletion(prog.id, site.contractId, vNo, task.id); }}>
                                                ↺ Revert
                                              </button>
                                            ) : (
                                              <button className="btn-sm" style={{ fontSize: 9, padding: "2px 8px", background: "#059669", color: "#fff", border: "none", borderRadius: 3 }}
                                                onClick={function() {
                                                  const d = prompt("Completion date (YYYY-MM-DD):", new Date().toISOString().slice(0,10));
                                                  if (!d) return;
                                                  const tech = prompt("Technician(s):", "");
                                                  recordIppTaskCompletion(prog.id, site.contractId, vNo, task.id, d, tech);
                                                }}>
                                                ✓ Mark Done
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
                {[...EQUIPMENT_TYPES, ...extraEqTypes].map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} style={{ width: 180 }}>
                <option value="All">All Groups</option>
                {[...CORPORATE_GROUPS, ...extraGroups].filter(g => g !== "None").map(g => <option key={g}>{g}</option>)}
              </select>
              {/* Status filter toggle */}
              <div style={{ display: "flex", gap: 0, borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                {[
                  { val: "active",   label: "Active",   color: "#059669" },
                  { val: "expired",  label: "Expired",  color: "#d97706" },
                  { val: "archived", label: "Archived", color: "#64748b" },
                ].map(s => (
                  <button key={s.val} onClick={() => setContractStatusFilter(s.val)}
                    style={{ fontSize: 11, padding: "5px 12px", border: "none", cursor: "pointer", fontWeight: contractStatusFilter === s.val ? 700 : 400,
                      background: contractStatusFilter === s.val ? s.color : "#fff",
                      color: contractStatusFilter === s.val ? "#fff" : "#64748b",
                      borderRight: s.val !== "archived" ? "1px solid #e2e8f0" : "none" }}>
                    {s.label}
                  </button>
                ))}
              </div>
              {view === "contracts" && contractStatusFilter === "active" && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={owedOnly} onChange={e => setOwedOnly(e.target.checked)} />
                  <span style={{ color: "#dc2626" }}>Show overdue only</span>
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
                    <th onClick={() => handleSort("contractNo")}>Contract # <SortIcon col="contractNo" /></th>
                    <th onClick={() => handleSort("team")}>Eq. Type <SortIcon col="team" /></th>
                    <th onClick={() => handleSort("corporateGroup")}>Group <SortIcon col="corporateGroup" /></th>
                    <th onClick={() => handleSort("travelCosts")}>Travel <SortIcon col="travelCosts" /></th>
                    <th onClick={() => handleSort("hourlyRate")}>Rate <SortIcon col="hourlyRate" /></th>
                    <th onClick={() => handleSort("contractAmount")}>Contract Amt <SortIcon col="contractAmount" /></th>
                    <th onClick={() => handleSort("contractedHours")}>Contracted <SortIcon col="contractedHours" /></th>
                    {YEARS.map(y => <th key={y} style={{ color: y < 2026 ? "#dc2626" : undefined }} onClick={() => handleSort("hours" + y)}>{y} <SortIcon col={"hours" + y} /></th>)}
                    <th onClick={() => handleSort("netDue")}>Net Due <SortIcon col="netDue" /></th>
                    <th style={{ minWidth: 160 }} onClick={() => handleSort("extensionDate")}>Extension Date <SortIcon col="extensionDate" /></th>
                    <th>Schedule</th>
                    <th style={{ whiteSpace: "nowrap" }}>Last Visit</th>
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
                          <td><input value={editForm.contractNo || ""} placeholder="Contract #" onChange={e => setEditForm(f => ({ ...f, contractNo: e.target.value }))} style={{ width: 80 }} /></td>
                          <td>
                            <EqTypeCheckboxes value={editForm.team || ""} onChange={val => setEditForm(f => ({ ...f, team: val }))} extraEqTypes={extraEqTypes} onAddEqType={addExtraEqType} />
                          </td>
                          <td>
                            <CorporateGroupSelect value={editForm.corporateGroup || "None"} onChange={val => setEditForm(f => ({ ...f, corporateGroup: val }))} extraGroups={extraGroups} onAddGroup={addExtraGroup} />
                          </td>
                          <td>
                            <select value={editForm.travelCosts} onChange={e => setEditForm(f => ({ ...f, travelCosts: e.target.value }))}>
                              <option>Billable</option><option>All inclusive</option>
                            </select>
                          </td>
                          <td><input type="number" value={editForm.hourlyRate || 0} onChange={e => setEditForm(f => ({ ...f, hourlyRate: parseFloat(e.target.value) || 0 }))} style={{ width: 70 }} /></td>
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
                    const contractWOs = (workOrders[c.id] || []);
                    const woExpanded = !!expandedWORows[c.id];
                    const scheduledWOCount = contractWOs.filter(w => w.status === "scheduled").length;
                    const completeWOCount  = contractWOs.filter(w => w.status === "complete").length;
                    return (
                      <React.Fragment key={c.id}>
                      <tr className={isOwed ? "row-owed" : ""} style={{ cursor: "pointer" }}
                        onClick={e => { if (!e.target.closest("button") && !e.target.closest("select") && !e.target.closest("input")) setSelectedContract(c); }}>
                        <td style={{ color: "#1a2235", fontWeight: isOwed ? "700" : "400" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {isOwed && <span style={{ color: "#dc2626" }}>!</span>}
                            {c.trackingType === "dollars" && <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.3)", borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>$</span>}
                            <span>{c.customer}</span>
                            {contractWOs.length > 0 && (
                              <button onClick={e => { e.stopPropagation(); toggleWORow(c.id); }}
                                title={woExpanded ? "Hide work orders" : "Show work orders"}
                                style={{ flexShrink: 0, background: woExpanded ? "#1e40af" : "rgba(37,99,235,0.1)", color: woExpanded ? "#fff" : "#2563eb",
                                  border: "1px solid rgba(37,99,235,0.25)", borderRadius: 3, fontSize: 9, padding: "1px 5px",
                                  cursor: "pointer", fontWeight: 700, letterSpacing: "0.04em", lineHeight: "14px" }}>
                                🔧 {contractWOs.length} {woExpanded ? "▲" : "▼"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td style={{ color: "#64748b", textAlign: "center" }}>{c.contractNo || "-"}</td>
                        <td style={{ textAlign: "center" }}>{c.team.split(", ").map(function(t) { return <EqPill key={t} type={t} style={{ marginRight: 2 }} />; })}</td>
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
                        <td style={{ textAlign: "right", color: c.hourlyRate > 0 ? "#7c3aed" : "#cbd5e1" }}>
                          {c.trackingType === "dollars" ? "-" : (c.hourlyRate > 0 ? "$" + c.hourlyRate : "-")}
                        </td>
                        <td style={{ textAlign: "right", color: c.contractAmount > 0 ? "#059669" : "#cbd5e1" }}>
                          {c.contractAmount > 0 ? fmtRev(c.contractAmount) : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {c.trackingType === "dollars"
                            ? <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.3)", borderRadius: 3, padding: "1px 6px" }}>$ {fmtRev(c.contractAmount)}</span>
                            : fmtHrs(c.contractedHours)}
                        </td>
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
                          {c.trackingType === "dollars" ? (function() {
                            const billed = (visits[c.id] || []).reduce((s, v) => s + (parseFloat(v.billedAmount) || 0), 0);
                            const rem = (c.contractAmount || 0) - billed;
                            return rem > 0
                              ? <span style={{ color: "#1a2235", fontWeight: 700 }}>{fmtRev(rem)}</span>
                              : rem < 0
                                ? <span style={{ color: "#dc2626", fontWeight: 700 }}>({fmtRev(Math.abs(rem))})</span>
                                : <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>;
                          })() : (function() {
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
                        <td style={{ textAlign: "center" }}>{(function() {
                          const h = getScheduleHealth(c, visits[c.id]);
                          if (h.status === "none") return <span style={{ color: "#94a3b8", fontSize: 11 }}>—</span>;
                          return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 7px", borderRadius: 10, background: h.bg, color: h.color, whiteSpace: "nowrap" }}>{h.label}</span>;
                        })()}</td>
                        <td style={{ textAlign: "center" }}>{(function() {
                          const lastDate = getLastVisitDate(c.id);
                          if (!lastDate) return <span style={{ color: "#cbd5e1", fontSize: 11 }}>—</span>;
                          // Parse YYYY-MM-DD or YYYY-MM
                          const parts = lastDate.split("-");
                          const d = parts.length === 3
                            ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
                            : new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
                          const days = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
                          const color = days > 180 ? "#dc2626" : days > 90 ? "#d97706" : "#059669";
                          return (
                            <span title={lastDate} style={{ fontSize: 11, fontWeight: 700, color }}>
                              {days}d ago
                            </span>
                          );
                        })()}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            {(visits[c.id] || []).length > 0 && (
                              <span style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 2, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>
                                {(visits[c.id] || []).length} visits
                              </span>
                            )}
                            {contractStatusFilter === "active" && null}
                            {contractStatusFilter === "expired" && (
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={e => { e.stopPropagation(); openRenewalModal(c); }}
                                  style={{ fontSize: 10, padding: "2px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontWeight: 700 }}>
                                  Renew
                                </button>
                              </div>
                            )}
                            {contractStatusFilter === "archived" && (
                              <button onClick={e => { e.stopPropagation(); reactivateContract(c); }}
                                style={{ fontSize: 10, padding: "2px 8px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontWeight: 700 }}>
                                🔄 Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Work Orders expand row */}
                      {woExpanded && contractWOs.length > 0 && (
                        <tr style={{ background: "#f0f4ff" }}>
                          <td colSpan={99} style={{ padding: "0 0 0 24px", borderBottom: "2px solid #c7d7fd" }}>
                            <div style={{ padding: "10px 12px 10px 0" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2563eb" }}>
                                  WORK ORDERS — {c.customer}
                                </span>
                                <span style={{ fontSize: 10, color: "#64748b" }}>
                                  {scheduledWOCount > 0 && <span style={{ marginRight: 10, color: "#d97706" }}>● {scheduledWOCount} scheduled</span>}
                                  {completeWOCount > 0  && <span style={{ color: "#059669" }}>✓ {completeWOCount} complete</span>}
                                </span>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px", gap: 0,
                                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8",
                                textTransform: "uppercase", borderBottom: "1px solid #dbeafe", paddingBottom: 4, marginBottom: 4 }}>
                                {["Title / Description", "Est. Hrs", "Act. Hrs", "Revenue"].map(h => (
                                  <div key={h} style={{ padding: "0 8px" }}>{h}</div>
                                ))}
                              </div>
                              {contractWOs.sort((a, b) => {
                                if (a.status !== b.status) return a.status === "scheduled" ? -1 : 1;
                                return (a.scheduledDate || "9999") < (b.scheduledDate || "9999") ? -1 : 1;
                              }).map(wo => {
                                const isComplete = wo.status === "complete";
                                const isOverdue = !isComplete && wo.scheduledDate && new Date(wo.scheduledDate) < new Date();
                                const statusColor = isComplete ? "#059669" : isOverdue ? "#dc2626" : "#d97706";
                                return (
                                  <div key={wo.id}
                                    onClick={e => { e.stopPropagation(); setOpenPanelToTab("workorders"); setSelectedContract(c); }}
                                    style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px",
                                    gap: 0, alignItems: "start", borderBottom: "1px solid #e0e7ff",
                                    padding: "6px 0", cursor: "pointer" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#e0e7ff"}
                                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                                    <div style={{ padding: "0 8px" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2235" }}>{wo.title}</span>
                                        <span style={{ fontSize: 9, fontWeight: 700, background: statusColor, color: "#fff",
                                          borderRadius: 8, padding: "1px 6px", letterSpacing: "0.05em" }}>
                                          {isComplete ? "DONE" : isOverdue ? "OVERDUE" : "SCHEDULED"}
                                        </span>
                                        {wo.linkedVisitNo && (
                                          <span style={{ fontSize: 9, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 3, padding: "1px 5px" }}>
                                            📌 Visit {wo.linkedVisitNo}
                                          </span>
                                        )}
                                      </div>
                                      {wo.description && (
                                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, lineHeight: 1.3 }}>{wo.description}</div>
                                      )}
                                    </div>
                                    <div style={{ padding: "0 8px", fontSize: 11, color: "#475569" }}>{wo.estimatedHours ? wo.estimatedHours + "h" : "—"}</div>
                                    <div style={{ padding: "0 8px", fontSize: 11, color: isComplete ? "#059669" : "#94a3b8", fontWeight: isComplete ? 700 : 400 }}>
                                      {wo.actualHours ? wo.actualHours + "h" : "—"}
                                    </div>
                                    <div style={{ padding: "0 8px", fontSize: 11, color: "#475569" }}>
                                      {wo.revenue ? "$" + parseFloat(wo.revenue).toLocaleString() : "—"}
                                    </div>
                                  </div>
                                );
                              })}

                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #e2e8f0" }}>
                    <td colSpan={2} style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                      TOTALS ({filtered.length} contracts)
                      {totals.dollarContractValue > 0 && (
                        <span style={{ marginLeft: 10, fontSize: 10, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 3, padding: "1px 6px" }}>
                          $ {fmtRev(totals.dollarBilled)} / {fmtRev(totals.dollarContractValue)}
                        </span>
                      )}
                    </td>
                    <td /><td /><td /><td />
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
                    <td /><td /><td />
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
                <label>Contract #</label>
                <input value={addForm.contractNo || ""} onChange={e => updateAddFormField("contractNo", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Billing #</label>
                <input value={addForm.billingNo || ""} onChange={e => updateAddFormField("billingNo", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Shipping #</label>
                <input value={addForm.shippingNo || ""} onChange={e => updateAddFormField("shippingNo", e.target.value)} />
              </div>
              <div className="form-field">
                <label>Equipment Type</label>
                <EqTypeCheckboxes value={addForm.team || ""} onChange={val => updateAddFormField("team", val)} extraEqTypes={extraEqTypes} onAddEqType={addExtraEqType} />
              </div>
              <div className="form-field">
                <label>Corporate Group</label>
                <CorporateGroupSelect value={addForm.corporateGroup || "None"} onChange={val => updateAddFormField("corporateGroup", val)} extraGroups={extraGroups} onAddGroup={addExtraGroup} />
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
                <label>Tracking Type</label>
                <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                  {["hours", "dollars"].map(function(t) {
                    return (
                      <label key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer", fontWeight: (addForm.trackingType || "hours") === t ? 700 : 400 }}>
                        <input type="radio" checked={(addForm.trackingType || "hours") === t}
                          onChange={function() { updateAddFormField("trackingType", t); }} />
                        {t === "hours" ? "Hours" : "Dollar Amount"}
                      </label>
                    );
                  })}
                </div>
              </div>
              {(addForm.trackingType || "hours") === "hours" ? (
                <>
                  <div className="form-field">
                    <label>Contracted Hours</label>
                    <input type="number" value={addForm.contractedHours || ""} placeholder="e.g. 120" onChange={e => updateAddFormField("contractedHours", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="form-field">
                    <label>Hourly Rate ($)</label>
                    <input type="number" value={addForm.hourlyRate || ""} placeholder="e.g. 185" onChange={e => updateAddFormField("hourlyRate", parseFloat(e.target.value) || 0)} />
                  </div>
                </>
              ) : (
                <div className="form-field">
                  <label>Contract Value ($)</label>
                  <input type="number" value={addForm.contractAmount || ""} placeholder="e.g. 50000" onChange={e => { updateAddFormField("contractAmount", parseFloat(e.target.value) || 0); updateAddFormField("contractedHours", 0); updateAddFormField("hourlyRate", 0); }} />
                </div>
              )}
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
              <div className="form-field">
                <label>Suggested Visits</label>
                <input type="number" min="0" value={addForm.suggestedVisits || ""} placeholder="e.g. 4" onChange={e => updateAddFormField("suggestedVisits", e.target.value)} />
              </div>
              <div className="form-field" style={{ gridColumn: "span 2" }}>
                <label>Contract Notes</label>
                <textarea value={addForm.notes || ""} onChange={e => updateAddFormField("notes", e.target.value)} placeholder="Internal notes about this contract..." style={{ width: "100%", height: 60, resize: "vertical", fontSize: 12, padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Work Orders section in Add Contract form */}
            {(function() {
              const pWOs = addForm.pendingWorkOrders || [];
              const emptyPWO = { title: "", description: "", serialNumber: "", estimatedHours: "", revenue: "" };
              return (
                <div style={{ marginTop: 20, border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: pWOs.length > 0 ? "1px solid #e2e8f0" : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="cond" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#64748b" }}>WORK ORDERS</span>
                      <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 8 }}>Pre-sold tasks included with this contract</span>
                    </div>
                    <button type="button" className="btn-sm" style={{ fontSize: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}
                      onClick={() => updateAddFormField("pendingWorkOrders", [...pWOs, { ...emptyPWO, _editing: true, _tempId: Date.now() }])}>
                      + Add Work Order
                    </button>
                  </div>

                  {pWOs.length === 0 && (
                    <div style={{ padding: "16px", fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>
                      No work orders yet. Click + Add Work Order to include pre-sold tasks.
                    </div>
                  )}

                  {pWOs.map(function(wo, idx) {
                    const updateWO = function(field, val) {
                      const updated = pWOs.map(function(w, i) { return i === idx ? { ...w, [field]: val } : w; });
                      updateAddFormField("pendingWorkOrders", updated);
                    }
                    const removeWO = function() {
                      updateAddFormField("pendingWorkOrders", pWOs.filter(function(_, i) { return i !== idx; }));
                    }
                    return (
                      <div key={wo._tempId || idx} style={{ padding: "12px 16px", borderBottom: idx < pWOs.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: "#fff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: 9 }}>Title *</label>
                            <input value={wo.title || ""} onChange={e => updateWO("title", e.target.value)}
                              placeholder="e.g. Annual IPP Inspection" style={{ width: "100%", fontSize: 11 }} />
                          </div>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: 9 }}>Serial Number</label>
                            <input value={wo.serialNumber || ""} onChange={e => updateWO("serialNumber", e.target.value)}
                              placeholder="Equipment serial #" style={{ width: "100%", fontSize: 11 }} />
                          </div>
                        </div>
                        <div className="form-field" style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 9 }}>Description / Scope</label>
                          <input value={wo.description || ""} onChange={e => updateWO("description", e.target.value)}
                            placeholder="Scope of work..." style={{ width: "100%", fontSize: 11 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 8, alignItems: "end" }}>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: 9 }}>Link to Visit</label>
                            <select value={wo.linkedVisitNo || ""} onChange={e => updateWO("linkedVisitNo", e.target.value)} style={{ width: "100%", fontSize: 11 }}>
                              <option value="">— Standalone —</option>
                              {Array.apply(null, Array(parseInt(addForm.suggestedVisits) || 0)).map(function(x, i) { return <option key={i+1} value={i+1}>Visit {i+1}</option>; })}
                            </select>
                          </div>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: 9 }}>Est. Hours</label>
                            <input type="number" value={wo.estimatedHours || ""} onChange={e => updateWO("estimatedHours", e.target.value)}
                              placeholder="0" style={{ width: "100%", fontSize: 11 }} />
                          </div>
                          <button type="button" onClick={removeWO}
                            style={{ height: 28, background: "none", border: "1px solid #fca5a5", borderRadius: 4, color: "#dc2626", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ×
                          </button>
                        </div>
                        <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 6 }}>
                          📅 Scheduled date will be suggested automatically based on contract term.
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Live calculation summary */}
            {(function() {
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
                // Save any pending work orders to workOrders state
                if (addForm.pendingWorkOrders && addForm.pendingWorkOrders.length > 0) {
                  const timestampedWOs = addForm.pendingWorkOrders.map(function(wo, i) {
                    return { ...wo, id: Date.now() + i, createdAt: new Date().toISOString().slice(0, 10) };
                  });
                  setWorkOrders(prev => ({ ...prev, [newId]: timestampedWOs }));
                }
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

      {selectedContract ? <VisitPanel contract={selectedContract} visits={visits} newVisit={newVisit} setNewVisit={setNewVisit} onAddVisit={addVisit} onDeleteVisit={deleteVisit} onEditVisit={editVisit} onClose={() => setSelectedContract(null)} getVisitedHours={getVisitedHours} onUpdateContract={updateContract} onDeleteContract={(id) => { setSelectedContract(null); deleteContract(id); }} allContracts={[...knaContracts, ...kcanContracts]} allVisits={{ ...knaVisits, ...kcanVisits }} customerHistory={customerHistory} onSaveCustomerHistory={saveCustomerHistory} extraGroups={extraGroups} onAddGroup={addExtraGroup} extraEqTypes={extraEqTypes} onAddEqType={addExtraEqType} onRenew={openRenewalModal} onArchive={archiveContract} initialTab={openPanelToTab} onTabOpened={() => setOpenPanelToTab(null)} workOrders={workOrders[selectedContract.id] || []} onAddWorkOrder={(wo) => addWorkOrder(selectedContract.id, wo)} onUpdateWorkOrder={(woId, changes) => updateWorkOrder(selectedContract.id, woId, changes)} onDeleteWorkOrder={(woId) => deleteWorkOrder(selectedContract.id, woId)} onCompleteWorkOrder={(woId, hrs) => completeWorkOrder(selectedContract.id, woId, hrs)} onRevertWorkOrder={(woId) => revertWorkOrder(selectedContract.id, woId)} getContractIpp={getContractIpp} /> : null}

      {/* RENEWAL MODAL */}
      {renewalContract && (function() {
        const c = renewalContract;
        const renewalCount = (c.renewalHistory || []).length;
        const nextYears = getNextTermYears(renewForm.extensionDate || "");

        const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setRenewalContract(null)}>
            <div style={{ background: "#fff", borderRadius: 8, width: 820, maxWidth: "95vw", maxHeight: "90vh",
              overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                      🔄 CONTRACT RENEWAL {renewalCount > 0 ? "· Term " + (renewalCount + 1) : "· First Renewal"}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{c.customer}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {c.team || "—"}{c.contractNo ? " · Contract #" + c.contractNo : ""}
                      {renewalCount > 0 && <span style={{ color: "#6366f1" }}> · {renewalCount} previous renewal{renewalCount > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <button onClick={() => setRenewalContract(null)}
                    style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                </div>
              </div>

              {/* Body: side-by-side comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, flex: 1, overflowY: "auto" }}>

                {/* LEFT: Current term (read-only) */}
                <div style={{ padding: "20px 24px", borderRight: "1px solid #e2e8f0", background: "#fafafa" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>
                    ← CURRENT TERM
                  </div>
                  {[
                    { label: "Term Dates", val: c.extensionDate || "—" },
                    { label: c.trackingType === "dollars" ? "Contract Value" : "Contracted Hours", val: c.trackingType === "dollars" ? (c.contractAmount ? fmtRev(c.contractAmount) : "—") : ((c.contractedHours || 0) + " hrs") },
                    { label: "Hourly Rate", val: c.trackingType === "dollars" ? "—" : (c.hourlyRate ? "$" + c.hourlyRate + "/hr" : "—") },
                    { label: "Contract Value", val: c.trackingType === "dollars" ? "—" : (c.contractAmount ? "$" + Math.round(c.contractAmount).toLocaleString() : "—") },
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
                          <span style={{ fontWeight: 700, color: "#1a2235" }}>Term {i + 1}:</span> {h.extensionDate} · {h.contractedHours}hrs · ${h.hourlyRate}/hr
                          <span style={{ color: "#94a3b8" }}> (renewed {h.renewedAt})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: New term (editable) */}
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#2563eb", textTransform: "uppercase", marginBottom: 16 }}>
                    NEW TERM →
                  </div>

                  <Field label="Term Dates">
                    <input style={{ ...inputStyle, color: renewForm.extensionDate !== c.extensionDate ? "#2563eb" : "#1a2235", fontWeight: renewForm.extensionDate !== c.extensionDate ? 700 : 400 }}
                      value={renewForm.extensionDate || ""} onChange={e => {
                        const val = e.target.value;
                        const newDates = parseContractDates(val);
                        const hoursUpdate = allocateHoursByYear(val, renewForm.contractedHours || 0, renewForm.suggestedVisits);
                        setRenewForm(f => ({ ...f, extensionDate: val, ...hoursUpdate }));
                      }} placeholder="M/D/YY-M/D/YY" />
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Contracted Hours">
                      <input type="number" ref={renewHoursRef}
                        style={{ ...inputStyle, color: String(renewForm.contractedHours) !== String(c.contractedHours) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.contractedHours) !== String(c.contractedHours) ? 700 : 400 }}
                        defaultValue={renewForm.contractedHours || ""}
                        onBlur={e => {
                          const totalHours = parseFloat(e.target.value) || 0;
                          const hoursUpdate = allocateHoursByYear(renewForm.extensionDate, totalHours, renewForm.suggestedVisits);
                          setRenewForm(f => ({ ...f, contractedHours: totalHours, ...hoursUpdate }));
                        }} />
                    </Field>
                    <Field label="Hourly Rate">
                      <input type="number" style={{ ...inputStyle, color: String(renewForm.hourlyRate) !== String(c.hourlyRate) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.hourlyRate) !== String(c.hourlyRate) ? 700 : 400 }}
                        value={renewForm.hourlyRate || ""} onChange={e => setRenewForm(f => ({ ...f, hourlyRate: parseFloat(e.target.value) || 0 }))} />
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
                            onChange={e => setRenewForm(f => ({ ...f, ["hours" + y]: parseFloat(e.target.value) || 0 }))} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Suggested Visits">
                      <input type="number" style={{ ...inputStyle, color: String(renewForm.suggestedVisits) !== String(c.suggestedVisits) ? "#2563eb" : "#1a2235", fontWeight: String(renewForm.suggestedVisits) !== String(c.suggestedVisits) ? 700 : 400 }}
                        value={renewForm.suggestedVisits || ""} onChange={e => {
                          const nVisits = parseInt(e.target.value) || 0;
                          const hoursUpdate = allocateHoursByYear(renewForm.extensionDate, parseFloat(renewForm.contractedHours) || 0, nVisits);
                          setRenewForm(f => ({ ...f, suggestedVisits: e.target.value, ...hoursUpdate }));
                        }} />
                    </Field>
                    <Field label="Salesman">
                      <input style={inputStyle} value={renewForm.salesman || ""} onChange={e => setRenewForm(f => ({ ...f, salesman: e.target.value }))} />
                    </Field>
                    <Field label="Parts Discount">
                      <input style={inputStyle} value={renewForm.partsDiscount || ""} onChange={e => setRenewForm(f => ({ ...f, partsDiscount: e.target.value }))} />
                    </Field>
                    <Field label="Labor Discount">
                      <input style={inputStyle} value={renewForm.laborDiscount || ""} onChange={e => setRenewForm(f => ({ ...f, laborDiscount: e.target.value }))} />
                    </Field>
                  </div>

                  <Field label="Notes">
                    <textarea style={{ ...inputStyle, height: 56, resize: "vertical" }} value={renewForm.notes || ""}
                      onChange={e => setRenewForm(f => ({ ...f, notes: e.target.value }))} />
                  </Field>

                  {changed.length > 0 && (
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 4, padding: "8px 12px", marginTop: 4, fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: "#6366f1" }}>Changes: </span>
                      <span style={{ color: "#64748b" }}>{changed.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "14px 28px", borderTop: "1px solid #e2e8f0", background: "#f8fafc",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  Fields highlighted in <span style={{ color: "#2563eb", fontWeight: 700 }}>blue</span> have changed from the current term.
                  Visit schedule will reset to the new term start date.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRenewalContract(null)}
                    style={{ fontSize: 12, padding: "8px 18px", background: "none", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                  <button onClick={commitRenewal}
                    style={{ fontSize: 12, padding: "8px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>
                    ✓ Confirm Renewal
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
