# Scripture Speed Quiz Plan Review
A concise review of the current plan for a Svelte + shadcn scripture quiz game, now updated with confirmed identity/attempt rules, Romanian-local midnight cutover, and bundled sample quotes.

## Quick Assessment
- **Concept**: Daily scripture quote guessing with speed-based scoring and leaderboards (global + groups). Stack: Svelte 5 + shadcn-svelte, Vercel + Neon, quotes in JSON. Strong for simplicity, performance, and mobile-first delivery.
- **Scope**: MVP defined (daily game, leaderboards, groups). Identity/attempt rules clarified; remaining details: rotation/timezone handling in storage, PWA specifics, and leaderboard windows.

## Gaps / Risks
1. **Identity model**: Anonymous play vs. named users not finalized; how to persist user identity across days/devices (cookie/device fingerprint vs. lightweight account). Impacts streaks and grouping.
2. **Anti-cheat & fairness**: Timer start/stop trust, resubmissions, multiple attempts per day, and skipping behavior not specified; need rate limiting and one-score-per-user-per-day rules.
3. **Quote rotation**: “No adjacent repeats” is vague—define daily seed/rotation, timezone source (UTC?), and how to handle missed days/offline PWA clients.
4. **Answer validation**: Fuzzy matching rules (case/diacritics/aliases/typos), acceptable variants (“Jesus Christ” vs “Jesus”), and recipient/spoken-to edge cases not defined.
5. **Data model completeness**: Groups lack owner/admin rules, rename/delete, and code collision handling; scores table needs unique constraint (user, date, quote_id, question_type, group_code) to prevent duplicates.
6. **Leaderboard slices**: Need clear ordering tie-break (points desc, time asc, submitted_at asc) and pagination/window (top 20 + “you” position). Group vs global reset cadence and timezone alignment.
7. **PWA/offline**: No manifest/service worker plan (caching, offline play, background sync). Clarify whether offline submissions queue and how to prevent stale scores after midnight.
8. **Security/compliance**: Input sanitization, rate limiting on APIs, CORS, and secret handling in Vercel envs. GDPR/privacy if names/emails are stored.
9. **Observability**: Logging/metrics for API latency, errors, and leaderboard queries; health checks for Neon connection limits.
10. **Testing**: No test plan; need unit tests for scoring/validation/rotation and integration tests for API + DB.

## Recommendations (updated)
1. **Identity**: Anonymous user with stored UUID + display name; persist via httpOnly cookie; optional name change; no email. Drives streaks and deduping.
2. **Attempt rules**: One scored submission per user per day per question_type; server timestamps start/end; client time only for latency-adjusted duration; allow unscored practice afterward.
3. **Day boundary**: Use Romanian local midnight (EET/EEST) for quote selection, streaks, and resets; store offset with record to avoid DST ambiguity; server enforces.
4. **Rotation**: Seed daily quote by `local-date (RO) -> hash -> index`; store `quote_id` server-side for the day; keep previous day to prevent repeats; ensure consistent mobile-first rendering.
5. **Validation**: Normalize (lowercase, trim, punctuation/diacritics removed); alias list per quote; Levenshtein threshold (e.g., <=2 edits) for minor typos; strict for wrong speaker/recipient.
6. **DB constraints**: Unique index `(user_id, quote_id, question_type, local_date_ro, group_code)`; add `groups.owner_id`, optional unique `groups.name`; `users.name` length limit; `submitted_at` default `now()`.
7. **Leaderboards**: Order `points DESC`, `time_seconds ASC`, `submitted_at ASC`; window by Romanian local day; expose top 20 + “your rank”; tabs for global/group; responsive/mobile-first tables/cards.
8. **PWA**: Manifest + service worker; cache shell + quotes.json; queue offline submissions; discard queued scores if day rolled over (Romanian time) before sync.
9. **Security/limits**: Rate limit `/api/score` and group creation; validate group codes; escape output; parameterized queries; secrets via Vercel env; locked CORS.
10. **Observability**: Structured logs, request metrics, DB latency/error alerts; log leaderboard query durations and queue flush outcomes.
11. **Testing**: Unit tests for scoring/validation/rotation; integration for `/api/quote`, `/api/score`, leaderboards with group filter; include day-boundary/DST cases.

## Next Steps
- Implement Romanian-local day boundary in rotation and scoring storage.
- Finalize alias lists and typo thresholds for validation.
- Proceed to implementation once above are acknowledged.


ID,Verse Reference,Quote Text,Speaker,Recipient
1,Jeremiah 29:11,"'I well know the thoughts that I am thinking toward you,' declares Jehovah, 'thoughts of peace, and not of calamity, to give you a future and a hope.'",Jehovah,Exiled Israelites
2,John 3:16,"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",Jesus,Nicodemus
3,1 Peter 5:7,"Casting all your anxiety on him, because he cares for you.",Peter,Believers
4,Proverbs 3:6,"In all your ways take notice of him, and he will make your paths straight.",Solomon,Reader
5,Isaiah 54:17,"No weapon formed against you will have any effect, and any tongue that rises up against you for judgment, you will prove to be in the wrong.",Jehovah,Israel
6,1 Corinthians 13:4-7,"Love is patient and kind. Love is not jealous. It does not brag, does not get puffed up, does not behave indecently, does not look for its own interests, does not become provoked. It does not keep account of the injury. It does not rejoice over unrighteousness, but rejoices with the truth. It bears all things, believes all things, hopes all things, endures all things.",Paul,Corinthian Church
7,Matthew 28:19,"Go, therefore, and make disciples of people of all the nations, baptizing them in the name of the Father and of the Son and of the holy spirit.",Jesus,Disciples
8,2 Timothy 3:16,"All Scripture is inspired of God and beneficial for teaching, for reproof, for correction, for training in righteousness.",Paul,Timothy
9,Galatians 5:23,"Meekness, self-control. Against such things there is no law.",Paul,Galatian Churches
10,1 John 1:9,"If we confess our sins, he is faithful and righteous so as to forgive us our sins and to cleanse us from all unrighteousness.",John,Believers
11,1 Thessalonians 5:18,"In connection with everything, give thanks, for this is what God wills for you in connection with Christ Jesus.",Paul,Thessalonian Church
12,Ephesians 2:8,"For by this undeserved kindness you have been saved through faith; and this is not of yourselves, it is God's gift.",Paul,Ephesian Church
13,Ephesians 6:11,Put on the complete suit of armor from God so that you may be able to stand firm against the crafty acts of the Devil.,Paul,Ephesian Church
14,Romans 5:8,"But God recommends his own love to us in that, while we were yet sinners, Christ died for us.",Paul,Roman Church
15,Romans 12:2,"And stop being molded by the system of things of this world, but be transformed by making your mind over, so that you may prove to yourselves the good and acceptable and perfect will of God.",Paul,Roman Church
16,Philippians 4:6,"Do not be anxious over anything, but in everything by prayer and supplication along with thanksgiving, let your petitions be made known to God.",Paul,Philippian Church
17,Matthew 6:33,"But keep on seeking first the kingdom and his righteousness, and all these other things will be added to you.",Jesus,Disciples
18,2 Timothy 1:7,"For God gave us not a spirit of cowardice, but of power and of love and of a sound mind.",Paul,Timothy
19,Isaiah 41:10,"Do not be afraid, for I am with you. Do not be anxious, for I am your God. I will strengthen you, yes, I will help you, yes, I will uphold you with the right hand of my righteousness.",Jehovah,Israel
20,1 Corinthians 10:13,"No temptation has come upon you except what is common to men. But God is faithful, and he will not let you be tempted beyond what you can bear. But with the temptation he will also make the way out, so that you may be able to endure it.",Paul,Corinthian Church
21,Matthew 11:28,"Come to me, all you who are toiling and loaded down, and I will refresh you.",Jesus,All People
22,Matthew 28:20,Teaching them to observe all the things I have commanded you. And look! I am with you all the days until the conclusion of the system of things.,Jesus,Disciples
23,1 Peter 3:15,"Rather, sanctify the Christ as Lord in your hearts, always ready to make a defense before anyone who demands of you a reason for the hope you have.",Peter,Believers
24,Ephesians 4:29,"Let no unwholesome word proceed out of your mouth, but only what is good for building up as the need may be, so that it imparts what is favorable to the hearers.",Paul,Ephesian Church
25,Joshua 1:9,"Have I not commanded you? Be courageous and strong. Do not be terrified or be dismayed, for Jehovah your God is with you wherever you go.",Jehovah,Joshua
26,Isaiah 43:19,Look! I am doing something new. Now it springs forth. Do you not know about it? I am putting a road in the wilderness and rivers in the desert.,Jehovah,Israel
27,Matthew 5:16,"Likewise, let your light shine before people, so that they may see your fine works and give glory to your Father who is in the heavens.",Jesus,Disciples
28,Proverbs 22:6,"Train up a boy according to the way he should go; even when he grows old, he will not depart from it.",Solomon,Reader