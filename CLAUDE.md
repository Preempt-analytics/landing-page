# Preempt Analytics landing page — project instructions

## Cross-platform commands (Mac + Windows)

Any command sequence added to the README, docs, or handover notes must work on
both macOS/Linux (bash/zsh) and Windows. Concretely:

- Don't chain commands with `&&` as the only form shown — it fails in Windows
  PowerShell 5.1 (parser error). Either show commands on separate lines, or
  give both a bash and a PowerShell version when chaining matters.
- If a command depends on shell-specific syntax (env vars, path separators,
  `rm -rf` vs `Remove-Item`), call out the Windows equivalent explicitly rather
  than assuming bash.
- If a fix involves deleting `node_modules`/lockfiles or other OS-sensitive
  troubleshooting (e.g. the npm optional-dependencies native-binding bug —
  https://github.com/npm/cli/issues/4828), document the Windows-specific
  symptom/fix alongside the Mac one, since native optional deps
  (`@rolldown/binding-*`, etc.) resolve differently per OS.

**Why:** this project's contributors run both macOS and Windows, and a
Windows-only npm/rolldown native-binding bug already broke `npm run dev` once
because the lockfile drifted onto an OS the machine wasn't running (see
`claude-handover/` for the incident). Docs that silently assume one shell cost
real debugging time.
