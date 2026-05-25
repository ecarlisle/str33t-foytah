#!/bin/bash

# 1. Check for valid JavaScript syntax using Node.js compiler flags
if ! node -c game.js 2>/dev/null; then
    echo "CRITICAL FAILURE: Invalid JavaScript syntax detected in game.js!"
    exit 1
fi

# 2. Check Line Count (Prevents partial file wipes from lazy AI generation)
LINE_COUNT=$(wc -l < game.js)
if [ "$LINE_COUNT" -lt 180 ]; then
    echo "CRITICAL FAILURE: game.js is too small ($LINE_COUNT lines). Full code was wiped!"
    exit 1
fi

# 3. Check for lazy LLM truncation shortcuts
if grep -q "// \.\.\." game.js || grep -q "Existing" game.js; then
    echo "CRITICAL FAILURE: Lazy code placeholder shortcut detected in game.js!"
    exit 1
fi

# 4. Check for illegal backend modules leaking into browser space
if grep -q "require('child_process')" game.js || grep -q "execSync" game.js; then
    echo "CRITICAL FAILURE: Illegal backend shell command injected into browser game!"
    exit 1
fi

# 5. Structural Loop Integrity Check
if ! grep -q "function gameLoop" game.js; then
    echo "CRITICAL FAILURE: Main gameLoop function was erased from game.js!"
    exit 1
fi

echo "SUCCESS: game.js passed all structural guardrails."
exit 0
