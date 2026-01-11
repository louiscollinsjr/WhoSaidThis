<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  export let data: PageData;

  type LeaderboardItem = {
    userId: string;
    displayName: string;
    points: number;
    timeSeconds: number;
    submittedAt: number;
    rank: number;
    groupCode?: string | null;
  };

  let global = data.global.items as LeaderboardItem[];
  let globalDate = data.global.dateKey;
  let groupCode = '';
  let groupItems: LeaderboardItem[] = [];
  let groupDate = '';
  let loadingGroup = false;
  let groupError = '';

  async function loadGroup() {
    groupError = '';
    groupItems = [];
    if (!groupCode.trim()) {
      groupError = 'Enter a group code';
      return;
    }
    loadingGroup = true;
    try {
      const res = await fetch(`/api/leaderboard/group/${groupCode.trim()}`);
      if (!res.ok) {
        const err = await res.json();
        groupError = err.message || 'Failed to load group';
      } else {
        const body = await res.json();
        groupItems = body.items;
        groupDate = body.dateKey;
      }
    } catch (e) {
      groupError = 'Network error';
    } finally {
      loadingGroup = false;
    }
  }

  function formatTime(sec: number) {
    return `${sec}s`;
  }

  onMount(() => {
    // no-op; data preloaded for global
  });
</script>

<main class="page">
  <header class="header">
    <div>
      <p class="eyebrow">Scripture Speed</p>
      <h1>Leaderboards</h1>
      <p class="sub">Romania midnight reset · Speed first tie-breaker</p>
    </div>
  </header>

  <section class="card">
    <div class="section-head">
      <div>
        <p class="eyebrow">Global</p>
        <h2>Top 20 · {globalDate}</h2>
      </div>
    </div>
    {#if global.length === 0}
      <p class="muted">No scores yet today.</p>
    {:else}
      <div class="table">
        <div class="row head">
          <span>#</span>
          <span>Name</span>
          <span>Pts</span>
          <span>Time</span>
        </div>
        {#each global as item}
          <div class="row">
            <span class="mono">{item.rank}</span>
            <span>{item.displayName || 'Player'}</span>
            <span class="mono">{item.points}</span>
            <span class="mono">{formatTime(item.timeSeconds)}</span>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <section class="card">
    <div class="section-head">
      <div>
        <p class="eyebrow">Group</p>
        <h2>Private leaderboard</h2>
      </div>
      <div class="group-input">
        <input
          placeholder="Enter code (e.g., ABC123)"
          bind:value={groupCode}
          autocomplete="off"
        />
        <button class="primary" on:click={loadGroup} disabled={loadingGroup}>
          {loadingGroup ? 'Loading…' : 'View'}
        </button>
      </div>
    </div>
    {#if groupError}
      <p class="error">{groupError}</p>
    {/if}
    {#if !groupError && groupItems.length === 0 && groupCode}
      <p class="muted">No scores yet for this group.</p>
    {/if}
    {#if groupItems.length > 0}
      <p class="eyebrow small">Date: {groupDate}</p>
      <div class="table">
        <div class="row head">
          <span>#</span>
          <span>Name</span>
          <span>Pts</span>
          <span>Time</span>
        </div>
        {#each groupItems as item}
          <div class="row">
            <span class="mono">{item.rank}</span>
            <span>{item.displayName || 'Player'}</span>
            <span class="mono">{item.points}</span>
            <span class="mono">{formatTime(item.timeSeconds)}</span>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f0f0f;
    color: #f5f5f5;
    margin: 0;
  }
  .page {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px 56px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #a0a0a0;
    font-size: 12px;
    margin: 0 0 4px;
  }
  .eyebrow.small {
    font-size: 11px;
    color: #8a8a8a;
  }
  h1 {
    margin: 0;
    font-size: 30px;
  }
  h2 {
    margin: 4px 0 0;
    font-size: 20px;
  }
  .sub {
    color: #b8b8b8;
    margin: 4px 0 0;
  }
  .card {
    background: #141414;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    padding: 18px 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .group-input {
    display: flex;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
    min-width: 240px;
  }
  input {
    border-radius: 10px;
    border: 1px solid #2a2a2a;
    background: #111;
    color: #f5f5f5;
    padding: 10px 12px;
    font-size: 15px;
    flex: 1;
  }
  .primary {
    background: linear-gradient(120deg, #ffffff, #d9d9d9);
    color: #0f0f0f;
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    font-weight: 700;
    cursor: pointer;
    min-width: 96px;
  }
  .primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .table {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .row {
    display: grid;
    grid-template-columns: 40px 1fr 60px 70px;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #0f0f0f;
    border: 1px solid #1f1f1f;
    align-items: center;
  }
  .row.head {
    background: transparent;
    border: 1px solid #1f1f1f;
    color: #a0a0a0;
    font-size: 13px;
    font-weight: 600;
  }
  .mono {
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: #9a9a9a;
    margin: 0;
  }
  .error {
    color: #ff7b7b;
    margin: 0 0 8px;
  }
  @media (max-width: 640px) {
    .row {
      grid-template-columns: 28px 1fr 50px 60px;
    }
    .group-input {
      flex-direction: column;
      align-items: stretch;
    }
    .primary {
      width: 100%;
    }
  }
</style>
