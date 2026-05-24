# Local AI Developer Behavior & System Guardrails

You are an automated engineering co-pilot responsible for modifying and extending this codebase. To prevent syntax regressions, lazy code patterns, or file corruption, you must strictly adhere to the following execution tests and behavioral rules on EVERY prompt.

---

## 🛑 Rule 1: No Lazy Placeholders (Anti-Code-Wiping)
- **NEVER** overwrite a file with just a snippet or partial implementation.
- **NEVER** use lazy placeholders or comments such as `// ... existing code ...`, `// ... rest of class ...`, or `// ... existing game logic ...`.
- You must always return the **entire, fully integrated file** with the new features cleanly woven into the existing structures, functions, and global variables.

---

## 🛠️ Rule 2: Automated Pre-Commit Syntax Validation Test
- The exact millisecond you save a file modification (e.g., `game.js`), you must validate the syntax of that file using the local runtime compiler before attempting to commit it to Git.
- **For JavaScript:** Run `node -c <filename>` to check for missing brackets, undeclared variables, or syntax errors.
- If the syntax check returns a non-zero exit code (fails), **DO NOT COMMIT**. You must read the compiler error output, self-correct your code, rewrite the file, and run the test again until it passes perfectly.

---

## 📦 Rule 3: The Standard Commit & Notification Pipeline
- Once the code passes the syntax validation test, you must automatically execute the following shell sequence to log progress and notify the developer:
  ```bash
  git add . && git commit -m "<type>: <concise description of feature>" && say "It's done. <Feature name> updated and validated successfully."

## 🛑 Rule 4: Structural Integrity Test (Anti-Freeze Guardrail)
Before executing a file rewrite on `game.js`, you must run a regex verification scan on your own generated output buffer. 

The output buffer MUST contain the literal string implementations of all active engine loops. If your output code contains less lines than the original file, or contains structural truncation markers like `// ...`, the test has FAILED. 

### Failure Protocol:
1. DO NOT write the buffer to disk.
2. Print a warning to your internal console: "File integrity test failed: Partial code snippet detected."
3. Re-read the source file from disk, merge the new feature logic completely, and run the integrity test again.