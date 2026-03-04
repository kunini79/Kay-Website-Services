import { redirect } from 'next/navigation';

/**
 * Canonical redirect to unified ThinkBox entry point.
 * All ThinkBox access (marketing, demo requests, login) now lives at /products/thinkbox.
 */
export default function ThinkBoxPage() {
  redirect('/products/thinkbox');
}
