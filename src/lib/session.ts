// Simple session persistence helpers for wizard and results state
const WIZARD_KEY = "str:wizard:location";
const RESULTS_KEY = "str:results:data";

export function saveWizardLocation(location: any) {
  try {
    sessionStorage.setItem(WIZARD_KEY, JSON.stringify(location));
  } catch (e) {
    console.warn("Failed to save wizard location to sessionStorage", e);
  }
}

export function loadWizardLocation() {
  try {
    const raw = sessionStorage.getItem(WIZARD_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse wizard location from sessionStorage", e);
    return null;
  }
}

export function clearWizardLocation() {
  try {
    sessionStorage.removeItem(WIZARD_KEY);
  } catch (e) {
    console.warn("Failed to clear wizard location from sessionStorage", e);
  }
}

export function saveResultsData(data: any) {
  try {
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save results data to sessionStorage", e);
  }
}

export function loadResultsData() {
  try {
    const raw = sessionStorage.getItem(RESULTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse results data from sessionStorage", e);
    return null;
  }
}

export function clearResultsData() {
  try {
    sessionStorage.removeItem(RESULTS_KEY);
  } catch (e) {
    console.warn("Failed to clear results data from sessionStorage", e);
  }
}
