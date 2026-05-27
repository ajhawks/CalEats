Create API endpoint for dining hall status.

## TASK
Implement GET /api/halls

### Requirements:
1. Return all dining halls
2. Compute real-time status:
   - open / closed / soon
3. Determine current meal period based on time + operating hours table
4. Include next opening/closing event

### Constraints:
- No frontend changes
- No scraper changes
- Use Supabase only for data

### Success Criteria:
- Endpoint returns accurate hall status dynamically