# Project Instructions

Angular frontend project.

## Token / Context Rules

- Never scan the whole repository unless explicitly requested.
- Read only files directly relevant to the current task.
- Search for symbols/usages before opening additional files.
- Do not read node_modules, dist, .angular, or generated files.
- Do not repeatedly re-read files already inspected unless necessary.
- For UI changes, start with the target component HTML/TS/CSS only.
- Read shared services/models only when the requested change requires them.
- Do not explore unrelated components for style consistency unless explicitly requested.
- Prefer editing the smallest possible number of files.

## Workflow

1. Identify likely files.
2. Inspect only those files.
3. Make the change.
4. Run the minimum relevant validation/build.
5. Stop when the requested task is complete.

Do not perform broad refactoring unless explicitly requested.