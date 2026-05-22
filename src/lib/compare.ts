export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  type: string;
  city: string;
  state: string;
}

const STORAGE_KEY = 'unifinder_compare';

export function getComparedColleges(): CompareCollege[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse compare colleges:', e);
    return [];
  }
}

export function addToCompare(college: CompareCollege): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: 'Window not defined' };
  const current = getComparedColleges();

  if (current.some((c) => c.id === college.id)) {
    return { success: false, message: 'College is already in comparison list' };
  }

  if (current.length >= 3) {
    return { success: false, message: 'You can compare at most 3 colleges side-by-side' };
  }

  const updated = [...current, college];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('unifinder_compare_change'));

  return { success: true, message: 'Added to comparison list' };
}

export function removeFromCompare(collegeId: string) {
  if (typeof window === 'undefined') return;
  const current = getComparedColleges();
  const updated = current.filter((c) => c.id !== collegeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('unifinder_compare_change'));
}

export function isInCompare(collegeId: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getComparedColleges();
  return current.some((c) => c.id === collegeId);
}

export function clearCompare() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('unifinder_compare_change'));
}
