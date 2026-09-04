import { redirect } from 'next/navigation';

/**
 * Canonical redirect to unified ThinkBox entry point.
 * All ThinkBox access, plans, trials, and sign-in live at /products/thinkbox.
 */
export default function ThinkBoxPage() {
  redirect('/products/thinkbox');
}
