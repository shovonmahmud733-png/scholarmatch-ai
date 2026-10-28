# ScholarMatch AI — Intelligent Scholarship Recommendation Platform

> **"Your Future Deserves Funding."**  
> Discover scholarships that match your academic profile, financial needs, research interests, and study-abroad goals through verified data and transparent eligibility matching.

---

## 1. Project Overview

Finding scholarships for international higher education is notoriously challenging. Eligibility information is scattered across university websites, foreign ministries, embassies, and philanthropic portals. Students frequently waste weeks preparing complex application dossiers for awards where they are disqualified by hard requirements (e.g. ineligible nationalities, work experience hour thresholds, or GPA minimums).

**ScholarMatch AI** solves this problem by combining:
1. **Audited, Verified Scholarship Data:** Real, prestigious international opportunities (Chevening, Fulbright, DAAD, Erasmus Mundus, Gates Cambridge, Eiffel, SINGA, MEXT, Rhodes, Vanier) with zero fabricated records.
2. **4-Layer Recommendation Pipeline:** Hard eligibility rule guards, GPA scale normalization (4.0, 5.0, 10.0, 100%), multi-factor weighted scoring, and transparent "Why It Matches" rationales.
3. **End-to-End Candidate Workflow:** Side-by-side comparison matrix (up to 4 scholarships), 9-stage Kanban application tracker with document checklists, and a personalized student dashboard.

---

## 2. Technology Stack

- **Framework:** React 18, TypeScript, Vite
- **Styling & Design System:** Tailwind CSS, Lucide React Icons
- **Routing:** React Router v6
- **Architecture:** Modular recommendation engine (`src/services/recommendationEngine.ts`) decoupled from UI, shared state management via React Context with localStorage persistence.
- **Visual Identity:** Deep navy (`#0a192f`), royal blue (`#1e40af`), and restrained teal accents (`#0d9488`) on soft neutral backgrounds.

---

## 3. Core Features & Routes

| Route | Page / Feature | Description |
|---|---|---|
| `/` | **Landing Page** | Compelling hero section with instant search, 4-layer engine visual breakdown, verified flagship awards, popular destinations, and verified student testimonials. |
| `/scholarships` | **Discovery Explorer** | Multi-filter sidebar (country, degree level, funding coverage, monthly stipend, subject), sorting by deadline / match score / stipend, grid and list view toggles. |
| `/scholarships/:id` | **Scholarship Details** | Full program overview, funding breakdown (tuition %, monthly stipend, airfare, health cover), academic & language criteria, required document dossier, step-by-step procedure, and verified official source link. |
| `/recommendations` | **AI Recommendations** | Personalized ranking feed based on student GPA, degree, and preferences. Filterable by: *All Ranked*, *High Match (≥80%)*, *Fully Eligible*, *Needs Verification*, and *Ineligible (Transparently Audited)*. |
| `/compare` | **Comparison Matrix** | Side-by-side comparison table of up to 4 scholarships comparing funding, stipends, airfare, GPA cutoffs, language tests, visa restrictions, and deadlines. |
| `/onboarding` | **Student Onboarding** | 4-step wizard collecting academic, country, funding, and research preferences, with tooltips explaining *why* each field improves recommendation accuracy. |
| `/dashboard` | **Student Dashboard** | Profile completion progress gauge, top AI recommendations, upcoming deadline alerts, active application status summary, and quick links. |
| `/applications` | **Application Tracker** | 9-stage Kanban board and List view (*Interested → Planning → Preparing Documents → Ready to Submit → Applied → Interview → Accepted → Rejected → Withdrawn*), with document checklists and personal notes. |
| `/saved` | **Saved Scholarships** | Bookmarked opportunities with quick filter search and one-click summary text export. |
| `/profile` | **Profile & Preferences** | Profile management with instant 1-click candidate preset switcher (*Master's in AI*, *PhD STEM Researcher*, *Undergraduate Aspirant*). |
| `/login` & `/register` | **Authentication** | Sign in and registration interfaces with a 1-click **"Sign In as Demo Scholar"** button for instant evaluation. |
| `/settings` | **Settings & Methodology** | Notification reminder preferences, ML factor weighting transparency, and local storage reset options. |
| `/about`, `/privacy`, `/terms`| **Editorial & Trust** | Platform mission, strict student privacy policy (zero third-party ad selling), and legal disclaimers. |

---

## 4. Recommendation Engine Architecture

The platform's recommendation engine is built in `src/services/recommendationEngine.ts` following a 4-layer design:

```
[Student Profile] ──> Layer 1: Hard Eligibility Engine (Citizenship, Degree, Min GPA)
                          │ (Disqualifications strictly block high score)
                          ▼
                      Layer 2: Content-Based Multi-Factor Scoring
                          │ (GPA Normalization, Subject, Country, Funding, Research)
                          ▼
                      Layer 3: Configurable Ranking Engine
                          │ (Academic: 25%, Degree: 20%, Subject: 20%, Country: 15%, Funding: 10%, Research: 10%)
                          ▼
                      Layer 4: Feedback Calibration & Explainability Output
                          ├── Normalized Match Score (0–100)
                          ├── Eligibility Status (Eligible / Potentially Eligible / Ineligible / Needs Verification)
                          ├── Why It Matches Breakdown
                          └── Missing Requirements to Verify
```

### Key Recommendation Principles
- **No False Guarantees:** A match score measures profile compatibility; it is never labeled as a "guarantee" of admission or funding.
- **Hard Rule Integrity:** A disqualifying condition (e.g. undergraduate student applying for a PhD fellowship) strictly limits the score and labels the status as `ineligible`, preventing high preference scores from overriding mandatory rules.
- **Honest Handling of Missing Data:** When information is absent in a profile, the system classifies the requirement as `needs_verification` or `potentially_eligible`, never blindly assuming eligibility.

---

## 5. Verified Dataset

The application includes verified, real-world scholarship programs:
1. **Chevening Master's Scholarship** (UK FCDO)
2. **Fulbright Foreign Student Program** (U.S. Department of State / IIE)
3. **DAAD Helmut-Schmidt-Programme** (German Academic Exchange Service)
4. **Erasmus Mundus Joint Masters** (European Commission)
5. **Australia Awards Scholarships** (Australian Government DFAT)
6. **Gates Cambridge Scholarship** (Bill & Melinda Gates Foundation / University of Cambridge)
7. **Eiffel Excellence Scholarship Program** (French Ministry for Europe & Foreign Affairs)
8. **Swiss Government Excellence Scholarships** (Federal Commission FCS)
9. **Singapore International Graduate Award (SINGA)** (A*STAR, NUS, NTU)
10. **MEXT Japanese Government Scholarship** (MEXT Japan)
11. **Rhodes Scholarship** (The Rhodes Trust / University of Oxford)
12. **Vanier Canada Graduate Scholarships** (Government of Canada)

Every record includes official source URLs, audited eligibility criteria, funding breakdowns, and verification dates.

---

## 6. How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v20.18.0)
- npm or pnpm

### Quick Start

```bash
# 1. Navigate to the project directory
cd scholarmatch-ai

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

The application will start at `http://localhost:5173`.
