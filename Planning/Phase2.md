You are working on a project called Cal Eats.

You MUST follow the architecture and constraints defined in the design document in this repository (docs/DesignDoc.md and Planning Document).

IMPORTANT RULES:
- Do NOT build frontend UI yet
- Do NOT over-engineer or add extra features
- Only implement what is requested in this phase
- Keep code modular and simple
- Do NOT modify unrelated files
- Explain what you changed and why
- Use TypeScript where applicable
- Assume Supabase is already configured via environment variables

---

## TASK: Phase 2 — Data Ingestion (START SMALL)

We are beginning the data pipeline.

Your goal is to implement a **minimal working scraper system** that does the following:

### Step 1: Single Hall, Single Meal Proof of Concept
- Target: Café 3
- Meal: lunch
- Date: today

### Step 2: Fetch HTML from Berkeley Dining menus page
Use server-side fetching (no browser automation unless absolutely necessary).

### Step 3: Parse the HTML
Extract:
- menu item name
- section/station (e.g., Grill, Pizza, etc.)
- dietary labels (if available)
- allergens (if available, optional for now)

### Step 4: Output structured JSON locally first
Before writing to database, print structured output like:

{
  hall: "cafe-3",
  date: "YYYY-MM-DD",
  mealPeriod: "lunch",
  sections: [
    {
      name: "Grill",
      items: [
        {
          name: "...",
          dietaryLabels: [],
          allergens: []
        }
      ]
    }
  ]
}

### Step 5: ONLY AFTER JSON IS CORRECT
- Add Supabase insertion for menu_items table
- Ensure upsert logic prevents duplicates
- Log ingestion results in scrape_log table

---

## CONSTRAINTS:
- Do NOT implement other dining halls yet
- Do NOT implement breakfast/dinner yet
- Do NOT build API routes yet
- Do NOT build UI yet
- Focus ONLY on ingestion pipeline correctness
- If scraping selectors are uncertain, make them configurable constants

---

## OUTPUT EXPECTATIONS:
When finished, you should provide:
1. File structure created/modified
2. Explanation of scraper logic
3. Example JSON output
4. Confirmation that Supabase write works (if implemented)

---

## SUCCESS CRITERIA:
- One hall works end-to-end (fetch → parse → structured output → DB insert)
- Code is clean and extendable
- No overengineering