#!/bin/bash
# ─────────────────────────────────────────────────────────────
# SocioVert — Cleanup Cron Script
# Deletes converted files older than 30 minutes
# Add to crontab: */15 * * * * /path/to/cleanup-cron.sh
# ─────────────────────────────────────────────────────────────

TEMP_DIR="/tmp/sociovert"

if [ -d "$TEMP_DIR" ]; then
  count=$(find "$TEMP_DIR" -type f -mmin +30 | wc -l)
  find "$TEMP_DIR" -type f -mmin +30 -delete
  find "$TEMP_DIR" -type d -empty -delete 2>/dev/null || true

  if [ "$count" -gt 0 ]; then
    echo "$(date): Cleaned up $count expired file(s) from $TEMP_DIR"
  fi
fi
