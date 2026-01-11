import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/leaderboard/global');
  const global = await res.json();
  return { global };
};
