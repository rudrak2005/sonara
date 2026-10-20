# PROJECT_MASTER.md

# SONORA — AI Retro Music Machine

> **Tagline:** Your music. Your memories. Your AI.  
> **Product thesis:** SONORA is a personal, AI-native music experience that learns not only what a user likes, but when, why, and in what context they like it—while transforming the interface into a living retro-futuristic atmosphere around the music.

---

## 1. Project Overview

### Project Identity

| Field | Definition |
|---|---|
| Project Name | **SONORA** |
| Full Product Name | **SONORA — The AI Retro Music Machine** |
| One-line Description | An AI-powered music player that learns a user's listening rhythm, creates personalized sessions and mixtapes, remembers meaningful songs, and dynamically changes its visual atmosphere with the music. |
| Category | Music / AI / Personalization / Consumer Software |
| Project Type | AI-native music application / web-first product |
| Development Stage | Full Production-Build Blueprint |
| Target Platforms | Web PWA first; desktop/mobile expansion later |
| Primary Objective | Build a differentiated music experience that creates strong daily listening habits through personalization, context, memory, and adaptive visual design. |
| Secondary Objectives | Demonstrate advanced full-stack engineering, recommender systems, AI orchestration, audio UI, product design, and scalable architecture. |
| Initial Audience | Students, young professionals, music enthusiasts, creators, developers, and users who value aesthetic/personalized listening experiences. |
| Initial Market Position | A companion/experience layer around licensed or user-owned music, not a rights-owning music catalog. |

### Detailed Description

SONORA is not intended to be a generic Spotify clone or a chatbot wrapped around a media player.

The product combines:

1. A polished retro-futuristic player.
2. Context-aware AI recommendations.
3. A **Pulse** engine that learns time-based listening habits.
4. An **Atmosphere** engine that adapts colors, motion, textures, and visual effects to the music.
5. **Music DNA** that explains and visualizes the user's taste.
6. **Memory** that connects songs to personal notes, moments, and life stages.
7. **Tape** that turns playlists into personalized digital mixtapes.
8. AI-assisted discovery, conversational control, and music explanation.
9. **SONORA Together** — synchronized listening rooms for couples, friends, and family, with fair queue priority, shared Atmosphere, reactions, and privacy-aware messaging.
10. Optional social experiences such as Dual Tape and shareable music identity cards.

The product must prove one core loop:

> **Open SONORA → instantly get a relevant session → listen → SONORA learns → next session gets better.**

### Elevator Pitch

SONORA is an AI-native music player that learns your listening rhythm, not just your favorite songs. It can prepare the right music for a time and activity, transform the interface to match the sound, remember the personal meaning behind songs, and turn moments into living retro mixtapes. The long-term goal is to make music feel less like a catalog and more like a personal world.

---

## 2. Problem Statement

### Existing Problem

Most music applications are excellent at providing access to large catalogs, but a large catalog does not automatically create a deeply personal listening experience.

Users frequently face:

- Search fatigue.
- Repetitive recommendations.
- Too many playlists with little context.
- Weak connection between music and personal memories.
- Limited understanding of *why* a recommendation was selected.
- Recommendation systems that are useful but feel invisible.
- Interfaces that remain visually static while the music changes.
- Manual effort required to choose music for recurring moments.
- Difficulty discovering new music without leaving their comfort zone.
- Fragmentation between listening history and personal memories.

### Who Experiences the Problem?

Primary users:

- Students and young adults.
- Heavy music listeners.
- Playlist creators.
- Users who listen at recurring times of day.
- Users who enjoy visual and nostalgic interfaces.
- Music discovery enthusiasts.

Secondary users:

- Creators and musicians.
- Social groups/friends sharing music.
- Developers and design/technology enthusiasts.
- Users managing personal/local music libraries.

### Why the Problem Exists

Traditional music products optimize heavily for catalog access, search, playback, recommendation, and engagement.

SONORA focuses on a different question:

> **How can the listening experience itself become adaptive, memorable, explainable, and expressive?**

### Current Solution Categories

The market includes:

- Large streaming platforms.
- Curated playlists.
- Algorithmic recommendations.
- AI DJs and conversational recommendation.
- Manual music libraries.
- Social music sharing.
- Music visualization apps.

Current major platforms are increasingly adding natural-language music discovery, personalized DJ experiences, prompted playlists, richer song context, and intelligent transitions. Spotify's 2026 product communications explicitly describe this shift from inferred intent toward users directly expressing intent with generative AI; Spotify also documents Prompted Playlist, DJ requests, Talk to Spotify, and SongDNA. Apple Music has expanded intelligent AutoMix and lyrics translation/pronunciation capabilities. These market directions are treated as signals, not features SONORA should blindly copy. **Verification is required again before launch because the market can change.**

### Limitations of Existing Approaches

Potential limitations SONORA can address:

| Limitation | SONORA Opportunity |
|---|---|
| Recommendation feels opaque | Explainable recommendations |
| User must manually search | Context-aware one-tap sessions |
| Static UI | Adaptive Atmosphere |
| Listening history is mostly recommendation input | Turn history into a personal story |
| Playlist is mainly a list | Turn playlist into a Tape artifact |
| Discovery can be repetitive | Controlled familiar/similar/surprise mix |
| Music memories are disconnected | Song + memory model |
| Social sharing often focuses on links | Shareable music identity and tapes |

### Consequences of the Problem

If a product only provides playback:

- Users may listen and leave.
- Personalized value is difficult to feel.
- Switching costs remain low.
- Product identity becomes dependent on catalog size.
- AI becomes a superficial layer rather than a core experience.

### Opportunity

SONORA can build a differentiated experience around **taste + time + context + memory + atmosphere + identity**.

---

## 3. Proposed Solution

### Solution Overview

SONORA combines five core intelligence loops:

1. **Taste Intelligence** — learns what the user likes.
2. **Pulse Intelligence** — learns when/contextually how the user listens.
3. **Atmosphere Intelligence** — adapts the interface and visual environment.
4. **Memory Intelligence** — connects songs with meaningful user memories.
5. **Discovery Intelligence** — balances familiar music with useful novelty.

### Core Workflow

```mermaid
flowchart LR
    A[Open SONORA] --> B[Context & Taste Signals]
        B --> C[Pulse Session Generator]
            C --> D[Candidate Music]
                D --> E[Ranking + Personalization]
                    E --> F[Playback]
                        F --> G[Adaptive Atmosphere]
                            F --> H[User Behavior]
                                H --> I[Learning Loop]
                                    I --> C
                                        F --> J[Memory / Tape / Save]
                                        ```

                                        ### Main Value Proposition

                                        > **SONORA reduces the effort of deciding what to listen to while making each listening session more personal, expressive, and memorable.**

                                        ### Why Users Would Use It

                                        - It starts music faster.
                                        - It learns their recurring listening patterns.
                                        - It gives them a beautiful adaptive environment.
                                        - It can explain recommendations.
                                        - It makes discovery feel intentional.
                                        - It turns listening history into memories and artifacts.

                                        ### Why Users Would Continue Using It

                                        The product should improve with continued use:

                                        > More listening → better context model → better sessions → more memories/tapes → stronger personal identity → greater value.

                                        ### Core Value Proposition

                                        **“The music player that learns your rhythm.”**

                                        ### Unique Selling Proposition (USP)

                                        **SONORA combines context-aware music personalization with a dynamic retro-futuristic interface and a personal music-memory layer.**

                                        The core differentiator is not “AI creates playlists.” The differentiator is:

                                        > **AI changes what you hear, why you hear it, and how the entire product feels while you hear it.**

                                        ---

                                        ## 4. Target Users

                                        ### Primary User Personas

                                        | Persona | Description | Goals | Problems | Needs | Usage |
                                        |---|---|---|---|---|---|
                                        | The Routine Listener | Listens around predictable times | Start music quickly | Repeated manual selection | Time-aware sessions | Daily |
                                        | The Explorer | Loves discovering artists/genres | Find hidden gems | Recommendations can be repetitive | Controlled novelty | 3–7x/week |
                                        | The Aesthetic Listener | Cares about design/visuals | Have a beautiful listening experience | Static music interfaces | Adaptive visuals | Daily |
                                        | The Memory Keeper | Attaches songs to moments | Preserve personal memories | Music history feels disposable | Song-memory relationships | Weekly/monthly |
                                        | The Mixtape Maker | Creates playlists for people/events | Make personal collections | Manual curation takes time | AI-assisted tapes | Weekly |

                                        ### Secondary Personas

                                        | Persona | Description | Goals | Problems | Needs | Usage |
                                        |---|---|---|---|---|---|
                                        | Creator | Shares music/tapes | Build an identity around curation | Hard to package taste | Shareable artifacts | Weekly |
                                        | Music Learner | Wants song/artist context | Understand music | Information is fragmented | Song intelligence | Weekly |
                                        | Friend Pair | Wants shared listening | Find overlap | Different tastes | Joint discovery | Occasional |
                                        | Local Music User | Has own audio files | Organize/experience files | File libraries are messy | Personal library tooling | Weekly |

                                        ### Primary User

                                        A student/young adult aged approximately 18–30 who listens to music frequently and values personalized experiences and visual design.

                                        ### Secondary User

                                        A music enthusiast who enjoys discovery, playlists, nostalgia, and sharing.

                                        ### Admin / Internal User

                                        A trusted operator responsible for moderation, support, analytics, system configuration, audit logs, and operational controls.

                                        ---

                                        ## 5. User Stories

                                        ### Primary User Stories

                                        1. As a user, I want to create an account so that my taste and listening history can be associated with my profile.
                                        2. As a user, I want to play a song so that I can listen without leaving the application.
                                        3. As a user, I want to search for music so that I can find a specific track/artist.
                                        4. As a user, I want SONORA to generate a session for my current activity so that I do not have to manually choose songs.
                                        5. As a user, I want SONORA to learn my repeated listening times so that relevant music can be prepared for recurring moments.
                                        6. As a user, I want the interface theme to adapt to the current music so that the experience feels alive.
                                        7. As a user, I want SONORA to explain why a recommendation was selected so that I can understand it.
                                        8. As a user, I want to save a song/playlist so that I can return to it later.
                                        9. As a user, I want to create an AI-assisted Tape so that I can turn a music concept into a curated artifact.
                                        10. As a user, I want to attach a note/memory to a song so that I can preserve why it matters to me.
                                        11. As a user, I want to control personalization settings so that I can choose how much AI influence I receive.
                                        12. As a user, I want to disable adaptive visuals so that playback remains distraction-free.

                                        ### Advanced User Stories

                                        1. As a user, I want to ask SONORA in natural language for a listening session.
                                        2. As a user, I want a conversational AI DJ to guide a listening session.
                                        3. As a user, I want SONORA to build a visual journey across an entire playlist.
                                        4. As a user, I want to explore the creative relationships around a song.
                                        5. As a user, I want to see how my taste changes over time.
                                        6. As a user, I want SONORA to generate a personal yearly/semester soundtrack.
                                        7. As a user, I want to create a shared Tape with another user.
                                        8. As a user, I want to discover music that is slightly outside my normal taste.
                                        9. As a user, I want to ask questions about a song's meaning or musical characteristics.
                                        10. As a user, I want to revisit music from a specific period of my life.
                                        11. As a creator, I want to publish a Tape or listening card.
                                        12. As an admin, I want to observe AI errors and recommendation quality.
                                        13. As a user, I want to create a private Together room so that I can listen with friends, a partner, or family.
                                        14. As a room host, I want to assign member roles and queue influence so that playback control stays fair.
                                        15. As a room member, I want my suggested songs to compete using group priority and votes so that everyone gets represented.
                                        16. As a room member, I want synchronized playback so that everyone hears the same song at approximately the same point.
                                        17. As a room member, I want to send private messages and reactions in the room without exposing my full listening history.
                                        18. As a room member, I want the shared visual atmosphere to react to the room's music so that the group session feels unified.
                                        19. As a couple, I want a shared Tape and shared memories so that important music moments can become relationship artifacts.
                                        20. As a family, I want stronger moderation and role controls so that shared listening remains appropriate and manageable.

                                        ---

                                        ## 6. User Journey

                                        ### Primary Journey

                                        ```mermaid
                                        flowchart TD
                                            A[Landing Page] --> B{Existing User?}
                                                B -->|No| C[Sign Up]
                                                    B -->|Yes| D[Login]
                                                        C --> E[Onboarding]
                                                            E --> F[Choose Music Goals / Preferences]
                                                                F --> G[Permission + Privacy Choices]
                                                                    G --> H[Home]
                                                                        D --> H
                                                                            H --> I{User Intent}
                                                                                I -->|Quick Session| J[Pulse Session]
                                                                                    I -->|Search| K[Search]
                                                                                        I -->|Tape| L[Create Tape]
                                                                                            I -->|Memory| M[Memories]
                                                                                                J --> N[Playback]
                                                                                                    K --> N
                                                                                                        L --> O[Tape Result]
                                                                                                            O --> N
                                                                                                                N --> P[Atmosphere]
                                                                                                                    N --> Q[Behavior Signals]
                                                                                                                        Q --> R[Personalization Update]
                                                                                                                            R --> H
                                                                                                                            ```

                                                                                                                            ### Retention Journey

                                                                                                                            1. First session delivers immediate value.
                                                                                                                            2. Second session uses early behavior.
                                                                                                                            3. By week one, Pulse identifies recurring patterns.
                                                                                                                            4. By week two, Music DNA becomes meaningful.
                                                                                                                            5. By week three, Memories/Tapes can represent personal identity.
                                                                                                                            6. Long-term usage improves recommendations and personal history.

                                                                                                                            ---

                                                                                                                            ## 7. Functional Requirements

                                                                                                                            | ID | Requirement | Priority | User | Description | Acceptance Criteria |
                                                                                                                            |---|---|---|---|---|---|
                                                                                                                            | FR-001 | User registration | P0 | User | Create account with email/password or supported auth provider | Account created, verified, error states handled |
                                                                                                                            | FR-002 | User login | P0 | User | Authenticate user | Valid user enters app; invalid login rejected safely |
                                                                                                                            | FR-003 | Music search | P0 | User | Search supported catalog/provider | Results show relevant tracks/artists |
                                                                                                                            | FR-004 | Playback | P0 | User | Play/pause/seek/next/previous | Playback state remains consistent |
                                                                                                                            | FR-005 | Queue | P0 | User | Manage upcoming tracks | Add/remove/reorder works |
                                                                                                                            | FR-006 | Save music | P0 | User | Save/unsave tracks and playlists | State persists |
                                                                                                                            | FR-007 | Session generation | P0 | User | Generate personalized session | Session contains ranked tracks |
                                                                                                                            | FR-008 | Pulse tracking | P0 | User | Track timestamped listening behavior | Events stored with privacy controls |
                                                                                                                            | FR-009 | Adaptive theme | P0 | User | Apply music-driven theme | Theme changes without breaking playback |
                                                                                                                            | FR-010 | Theme controls | P0 | User | Auto/static/subtle/full modes | User setting persists |
                                                                                                                            | FR-011 | Recommendation explanation | P1 | User | Show rationale | Explanation corresponds to available signals |
                                                                                                                            | FR-012 | Tape generation | P1 | User | Create AI-assisted mixtape | Tape includes name, concept, tracks, visual theme |
                                                                                                                            | FR-013 | Memory creation | P1 | User | Attach personal note to song | Memory saved and retrievable |
                                                                                                                            | FR-014 | Music DNA | P1 | User | Generate taste profile | Profile based on observed data and confidence |
                                                                                                                            | FR-015 | Surprise Me | P1 | User | Provide controlled discovery | Recommendation differs from immediate repeats |
                                                                                                                            | FR-016 | Personal settings | P0 | User | Control personalization/privacy | Settings apply consistently |
                                                                                                                            | FR-017 | Logout | P0 | User | End active session | Tokens/session invalidated according to chosen strategy |
                                                                                                                            | FR-018 | Error states | P0 | User | Standard UX for failures | No broken blank screens |
                                                                                                                            | FR-019 | Admin audit logs | P1 | Admin | Review important system actions | Restricted to admin |
                                                                                                                            | FR-020 | Health endpoint | P0 | System | Check service status | Returns operational state without secret leakage |

                                                                                                                            ---

                                                                                                                            ## 8. Non-Functional Requirements

                                                                                                                            | Area | Proposed Requirement |
                                                                                                                            |---|---|
                                                                                                                            | Performance | UI interactions should feel responsive; proposed target: p95 API latency under 500 ms for ordinary non-AI requests under initial production load. |
                                                                                                                            | AI latency | Proposed target: initial AI result under 5 seconds for common requests, with streaming or progress UI where practical. |
                                                                                                                            | Scalability | Architecture should support growth from ~100 to 100,000+ registered users without immediate rewrite. |
                                                                                                                            | Security | Secure authentication, validation, rate limits, secret management, and least-privilege access. |
                                                                                                                            | Availability | Target 99.5% initial service availability; production targets require measurement and budget review. |
                                                                                                                            | Reliability | Idempotent critical operations and graceful third-party failures. |
                                                                                                                            | Maintainability | Modular boundaries, typed contracts, tests, ADRs, and documentation. |
                                                                                                                            | Accessibility | WCAG-aligned practices with keyboard support, contrast, labels, focus states, and reduced motion. |
                                                                                                                            | Usability | A first-time user should reach playable music in a small number of deliberate steps. |
                                                                                                                            | SEO | Marketing pages should be indexable; authenticated application routes need not be publicly indexed. |
                                                                                                                            | Compatibility | Current evergreen browsers; mobile-first responsive behavior. |
                                                                                                                            | Localization | Architecture should allow localization; initial release may support English first with Hindi-ready strings. |
                                                                                                                            | Privacy | Explicit control for personalization, history, memory, and data deletion. |
                                                                                                                            | Observability | Centralized structured logs, errors, metrics, health checks, and alerts. |

                                                                                                                            ---

                                                                                                                            ## 9. Full Product Build Scope

                                                                                                                            The project is planned as one continuous production-oriented build. We do not create a separate Core Build track, Expansion track, or Together track inside the master plan.

                                                                                                                            ### 9.1 Personal Listening Core

                                                                                                                            | Feature | Priority | Complexity | Dependency | Build Window | Status |
                                                                                                                            |---|---|---|---|---|---|
                                                                                                                            | Authentication | P0 | Medium | DB | Days 9–14 | Planned |
                                                                                                                            | User onboarding | P0 | Medium | Auth | Days 12–15 | Planned |
                                                                                                                            | Music provider abstraction | P0 | High | Provider decision | Days 15–17 | Planned |
                                                                                                                            | Search | P0 | Medium | Provider | Days 17–18 | Planned |
                                                                                                                            | Playback engine | P0 | High | Audio/provider | Days 18–20 | Planned |
                                                                                                                            | Queue | P0 | Medium | Playback | Days 20–21 | Planned |
                                                                                                                            | Listening event pipeline | P0 | Medium | Auth + DB | Days 21–23 | Planned |
                                                                                                                            | Pulse engine | P0 | High | Events | Days 23–26 | Planned |
                                                                                                                            | Session generator | P0 | High | Pulse + ranking | Days 26–29 | Planned |
                                                                                                                            | Adaptive Atmosphere | P0 | High | Player + theme engine | Days 29–32 | Planned |
                                                                                                                            | Privacy/settings | P0 | Medium | Auth | Days 12–16, 34 | Planned |

                                                                                                                            ### 9.2 Intelligence Layer

                                                                                                                            | Feature | Priority | Complexity | Dependency | Build Window | Status |
                                                                                        
                                                                                                                            | Music DNA | P1 | Medium–High | History + ranking | Days 33–36 | Planned |
                                                                                                                            | Why This Song | P1 | Medium | Recommendation signals | Days 35–36 | Planned |
                                                                                                                            | Controlled Surprise Me | P1 | Medium | Ranking | Days