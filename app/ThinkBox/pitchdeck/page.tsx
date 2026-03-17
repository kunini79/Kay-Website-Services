import { redirect } from 'next/navigation';

/**
 * Canonical redirect for legacy ThinkBox pitch deck route.
 * Primary route lives at /products/thinkbox/pitchdeck.
 */
export default function ThinkBoxPitchDeckLegacyPage() {
  redirect('/products/thinkbox/pitchdeck');
}
