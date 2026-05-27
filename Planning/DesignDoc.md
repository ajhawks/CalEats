# Cal Eats — Design Document (Planning Phase)

## 1. Project Overview

Cal Eats is a student-focused dining application designed to make [UC Berkeley Dining Services](https://dining.berkeley.edu/menus/?utm_source=chatgpt.com) menus significantly more accessible, readable, and user-friendly for Berkeley students. The core problem the application addresses is that Berkeley dining information is currently fragmented across webpages that are not optimized for quick daily usage, mobile-first interaction, or personalized student workflows. Students frequently need to navigate multiple pages and interfaces to determine what food is being served, where it is located, and whether it matches their preferences or dietary restrictions.

The goal of Cal Eats is to centralize dining hall and campus food information into a clean, fast, and intuitive application that students can check throughout the day. The application will aggregate menu data from Berkeley Dining, organize it into a simplified interface, and prioritize ease of access, clarity, and mobile usability. Rather than functioning as a replacement for Berkeley Dining infrastructure, Cal Eats acts as an improved presentation and accessibility layer on top of existing publicly available menu data.

The application will initially focus on the four primary dining halls with rotating daily menus:

* Cafe 3
* Crossroads
* Foothill
* Clark Kerr

The application will also support additional dining locations with more static or semi-static menus:

* Golden Bear Cafe
* The Eateries at Student Union
* Browns

The core thesis of the project is not simply displaying menus, but improving the student dining experience through usability, organization, and accessibility. The product should feel fast, modern, and student-centric rather than institutional.

---

# 2. Core Product Goals

The primary product goal is to reduce friction between students and dining information. Students should be able to open the application and immediately answer practical questions such as:

* What is being served right now?
* Which dining hall has the best options today?
* What locations are currently open?
* What food matches my dietary preferences?
* What are the breakfast/lunch/dinner options?
* Which locations are nearby?

The application should optimize for:

* speed
* readability
* mobile-first interaction
* low cognitive load
* intuitive navigation
* fast daily repeat usage

The application should avoid becoming cluttered, overly feature-heavy, or difficult to navigate. Simplicity and reliability are more important than maximizing feature count during the initial development phases.

---

# 3. High-Level Product Vision

Cal Eats should eventually function as a centralized Berkeley dining companion platform. While the initial version focuses primarily on menu aggregation and presentation, the long-term vision may include:

* personalized dining recommendations
* favorites/bookmarking
* dietary filtering
* notifications for favorite meals
* crowd-sourced ratings/reviews
* meal popularity tracking
* dining hall occupancy estimation
* schedule integration
* AI-generated meal summaries

However, these advanced features are secondary to the foundational requirement:

> reliably displaying accurate daily menus in a significantly better user experience than the existing Berkeley Dining website.

The MVP should prioritize:

1. accurate menu ingestion
2. clean UI/UX
3. fast mobile performance
4. reliable updates
5. intuitive organization

---

# 4. User Personas

## Primary User: Berkeley Undergraduate Student

Typical behaviors:

* checks menus between classes
* uses phone primarily
* wants fast access to food information
* compares dining halls before deciding where to eat
* values convenience over complexity

Pain points:

* current menus difficult to navigate quickly
* information spread across multiple pages
* poor mobile usability
* unclear organization of meals/items
* difficult comparison between dining halls

---

# 5. Core Functional Requirements

## Daily Menu Aggregation

The application must reliably collect and display menu data from Berkeley Dining sources on a daily basis.

This includes:

* breakfast menus
* lunch menus
* dinner menus
* late-night menus (if applicable)
* item names
* dining hall associations
* timestamps/update times

The system must handle changing daily menus for:

* Cafe 3
* Crossroads
* Foothill
* Clark Kerr

The system should also support relatively static menu sources for:

* Golden Bear Cafe
* Browns
* Student Union eateries

---

## Dining Hall Navigation

Users should be able to:

* switch between dining halls easily
* compare menus quickly
* view currently open locations
* understand meal schedules

Navigation should prioritize minimal clicks/taps.

---

## Mobile-First Interface

The application is primarily intended for student mobile usage. Therefore:

* responsive design is mandatory
* fast loading times are critical
* information density should remain manageable
* menus should be easy to scan quickly

The design philosophy should emphasize:

* clarity
* large readable typography
* intuitive sections
* smooth scrolling
* minimal visual clutter

---

# 6. Technical Product Direction

The current proposed stack consists of:

* VS Code
* Git/GitHub
* Claude Code
* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Vercel

The frontend application will likely use:

* Next.js App Router
* server-side rendering where appropriate
* reusable React components
* modular page architecture

Supabase may be used for:

* menu caching/storage
* user preferences
* authentication (future)
* analytics
* saved favorites

The backend architecture should prioritize reliability and simplicity. Since Berkeley Dining already provides menu data publicly, the primary engineering challenge is not building a full dining infrastructure but creating:

1. a reliable ingestion pipeline
2. a clean data structure
3. a highly usable frontend interface

---

# 7. System Architecture Direction (Early Planning)

The likely data pipeline will follow this structure:

```text id="v3g25e"
Berkeley Dining Website
        ↓
Menu Fetching Layer
        ↓
Parsing / Normalization
        ↓
Database Storage / Cache
        ↓
Frontend API Layer
        ↓
Mobile-Friendly UI
```

Important architectural considerations:

* Berkeley menu formatting consistency
* handling menu changes
* update frequency
* caching strategy
* avoiding excessive requests
* graceful handling of missing data

---

# 8. Initial MVP Scope

The MVP should intentionally remain narrow.

## MVP Features

* daily dining hall menus
* responsive mobile UI
* dining hall switching
* meal period organization
* open/closed indicators
* clean menu presentation

## Features Deferred

* social features
* AI recommendations
* notifications
* accounts/authentication
* ratings/reviews
* analytics dashboards
* occupancy tracking

The initial success metric is:

> students consistently preferring Cal Eats over the Berkeley Dining website for checking menus.

---

# 9. Development Philosophy

Development should follow an iterative AI-assisted workflow using Claude Code. The architecture should remain modular and maintainable to avoid AI-generated technical debt over time.

Important engineering principles:

* incremental feature development
* frequent Git commits
* modular components
* minimal overengineering
* spec-driven development
* clear separation of concerns

The project should prioritize:

* maintainability
* usability
* reliability
* development speed
* future extensibility

---

# 10. Immediate Next Planning Steps

The next stage of planning should focus on:

1. Information architecture
2. UI/UX wireframing
3. Data ingestion strategy
4. Berkeley Dining menu structure analysis
5. Database schema planning
6. Page hierarchy definition
7. API architecture planning
8. Caching/update strategy

No implementation or coding should begin until the application structure and product flow are sufficiently defined.
