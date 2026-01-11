<script lang="ts">
  import { onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  type QuoteResponse = {
    quote: Quote;
    questionType: QuestionType;
    dateKey: string;
    timeZone: string;
  };

  type ScoreResponse = {
    points: number;
    isCorrect: boolean;
    rank?: number;
    message?: string;
  };

  type Quote = {
    id: number;
    reference: string;
    text: string;
    speaker: string;
    recipient: string;
  };

  type QuestionType = 'speaker' | 'recipient';

  const STORAGE_KEY = 'wst_user';

  let userId = '';
  let displayName = '';
  let answer = '';
  let timeSeconds = 0;
  let timerRunning = false;
  let timerStart: number | null = null;
  let interval: ReturnType<typeof setInterval> | null = null;

  let quote: Quote | null = null;
  let questionType: QuestionType = 'speaker';
  let submitted = false;
  let resultMessage = '';
  let points = 0;
  let isCorrect: boolean | null = null;

  function loadUser() {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        userId = parsed.id || '';
        displayName = parsed.name || '';
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: userId, name: displayName }));
    }
  }

  function saveName() {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: userId, name: displayName }));
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerStart = performance.now();
    interval = setInterval(() => {
      if (timerStart) {
        timeSeconds = Math.floor((performance.now() - timerStart) / 1000);
      }
    }, 250);
  }

  function stopTimer() {
    timerRunning = false;
    if (interval) clearInterval(interval);
    if (timerStart) {
      timeSeconds = Math.floor((performance.now() - timerStart) / 1000);
    }
  }

  function resetState() {
    answer = '';
    timeSeconds = 0;
    submitted = false;
    resultMessage = '';
    stopTimer();
    timerStart = null;
  }

  async function fetchQuote() {
    const res = await fetch('/api/quote');
    const data: QuoteResponse = await res.json();
    quote = data.quote;
    questionType = data.questionType;
  }

  async function submit() {
    if (!quote || submitted) return;
    stopTimer();
    const payload = {
      quoteId: quote.id,
      questionType,
      answer,
      timeSeconds,
      displayName,
      userId
    };
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data: ScoreResponse = await res.json();
    submitted = true;
    points = data.points;
    isCorrect = data.isCorrect;
    resultMessage =
      data.message ||
      (data.isCorrect ? `Correct! +${data.points} pts` : 'Not quite — practice again');
  }

  onMount(async () => {
    loadUser();
    await fetchQuote();
    startTimer();
  });
</script>

<main class="page">
  <header class="header">
    <div>
      <p class="eyebrow">Scripture Speed</p>
      <h1>Daily Quiz</h1>
      <p class="sub">Romania midnight reset · Mobile first</p>
    </div>
    <div class="name">
      <label for="name">Display name</label>
      <input
        id="name"
        name="name"
        placeholder="Your name"
        bind:value={displayName}
        on:blur={saveName}
      />
    </div>
  </header>

  {#if quote}
    <section class="card quote">
      <div class="row">
        <p class="eyebrow">{quote.reference}</p>
        <p class="timer">{timeSeconds}s</p>
      </div>
      <p class="text">“{quote.text}”</p>
      <p class="question">
        {questionType === 'speaker' ? 'Who said this?' : 'To whom was this said?'}
      </p>
      <input
        class="answer"
        placeholder="Type your answer"
        bind:value={answer}
        on:focus={() => startTimer()}
      />
      <div class="actions">
        <button class="primary" on:click={submit} disabled={submitted}>Submit</button>
        <button class="ghost" on:click={resetState} disabled={!submitted}>Practice again</button>
      </div>
      {#if resultMessage}
        <p class="result" class:is-correct={isCorrect === true} class:is-wrong={isCorrect === false}>
          {resultMessage}
        </p>
      {/if}
    </section>
  {:else}
    <p>Loading quote…</p>
  {/if}
</main>

<style>
  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f0f0f;
    color: #f5f5f5;
    margin: 0;
  }
  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 16px 48px;
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #a0a0a0;
    font-size: 12px;
    margin: 0 0 4px;
  }
  h1 {
    margin: 0;
    font-size: 28px;
  }
  .sub {
    color: #b8b8b8;
    margin: 4px 0 0;
  }
  .name {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  label {
    font-size: 13px;
    color: #c8c8c8;
  }
  input {
    border-radius: 10px;
    border: 1px solid #2a2a2a;
    background: #111;
    color: #f5f5f5;
    padding: 12px 14px;
    font-size: 16px;
  }
  .card {
    background: #141414;
    border: 1px solid #1f1f1f;
    border-radius: 16px;
    padding: 18px 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
  .quote .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .timer {
    font-variant-numeric: tabular-nums;
    color: #d0d0d0;
    margin: 0;
  }
  .text {
    font-size: 18px;
    line-height: 1.5;
    margin: 12px 0;
  }
  .question {
    color: #c0c0c0;
    margin: 12px 0 8px;
    font-weight: 600;
  }
  .answer {
    width: 100%;
    margin-bottom: 12px;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
  .primary {
    flex: 1;
    background: linear-gradient(120deg, #ffffff, #d9d9d9);
    color: #0f0f0f;
    border: none;
    border-radius: 12px;
    padding: 12px 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .ghost {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #2a2a2a;
    background: #0f0f0f;
    color: #e0e0e0;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .result {
    margin-top: 10px;
    color: #7be69e;
  }
  @media (min-width: 768px) {
    h1 {
      font-size: 32px;
    }
    .text {
      font-size: 20px;
    }
  }
</style>
