You are now implementing Phase 3 of Cal Eats.

## TASK
Create backend API routes for retrieving menu data.

### Build:
GET /api/menus

### Query params:
- hall (slug)
- date (default: today)
- meal (optional, auto-detect current meal period if missing)

### Requirements:
1. Fetch data from Supabase only
2. Transform DB rows into structured response:
   - sections grouped correctly
   - items nested properly
3. Return clean JSON matching design doc schema

### Constraints:
- Do NOT implement UI
- Do NOT modify scraper logic
- Do NOT add authentication
- Keep route handler thin (logic in /lib/data)

### Success Criteria:
- API returns correctly structured menu JSON