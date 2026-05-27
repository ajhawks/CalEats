Create ingestion trigger endpoint.

## TASK
Implement POST /api/ingest

### Requirements:
1. Secure endpoint using CRON_SECRET
2. Trigger scraper pipeline
3. Run full ingestion (all halls × meals)
4. Write logs to scrape_log
5. Return summary of success/failure

### Constraints:
- No UI work
- No frontend changes
- No logic duplication (reuse scraper module)

### Success Criteria:
- Manual POST triggers full ingestion successfully