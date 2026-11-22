#!/usr/bin/env bash
set -euo pipefail

app=/opt/formation-pro-360
releases="$app/releases"
current="$(readlink -f "$app/current" 2>/dev/null || true)"

if [ "$app" != "/opt/formation-pro-360" ] || [ "$releases" != "$app/releases" ]; then
  echo "Refusing cleanup outside the frontend release directory." >&2
  exit 1
fi
if [ -n "$current" ] && [[ "$current" != "$releases/"* ]]; then
  echo "Current release points outside the frontend release directory." >&2
  exit 1
fi

mapfile -t release_paths < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2-)
kept=0
for release in "${release_paths[@]}"; do
  [[ "$release" == "$releases/"* ]] || { echo "Unexpected release path; stopping cleanup." >&2; exit 1; }
  if [ "$release" = "$current" ]; then
    kept=$((kept + 1))
    continue
  fi
  if [ "$kept" -lt 5 ]; then
    kept=$((kept + 1))
  else
    rm -rf -- "$release"
  fi
done

find /tmp -maxdepth 1 -type f -user "$(id -un)" -name 'formation-pro-360-*' -mtime +1 -delete
if command -v npm >/dev/null 2>&1 && [ -d "$HOME/.npm" ]; then
  npm cache clean --force --cache "$HOME/.npm" >/dev/null 2>&1 || true
fi

used="$(df -P / | awk 'NR == 2 { gsub(/%/, "", $5); print $5 }')"
printf 'Frontend cleanup complete; root filesystem use: %s%%; retained releases: %s\n' "$used" "$kept"
if [ "${used:-0}" -ge 90 ]; then
  echo "Frontend container disk usage is at least 90%." >&2
  exit 1
fi
