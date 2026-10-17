# Working on this project

## Start here

- Read `PROJECT_CONTEXT.md` for the design map and existing decisions before searching the repository.
- Use the conversation, selected code, and known file paths first. Read only the relevant files when more context is needed.
- Context notes are a navigation aid; current code and the user's latest instructions are the source of truth.

## User's preferred workflow

- Make edits using direct file patches.
- Do not run shell commands or Python scripts to inspect or edit files unless the user explicitly authorizes them.
- Do not run builds, tests, linting, development servers, or browser automation unless requested.
- Do not commit, push, deploy, or publish unless explicitly requested. Earlier authorization to push was withdrawn.
- Preserve unrelated edits. Reverting a change means undoing only the requested change, not resetting a file or the repository.
- For small changes, use the available context and patch only the relevant lines. Avoid unnecessary exploration or confirmation questions.
- Keep progress updates brief and final confirmations short. State what changed; do not claim checks that were not performed.
- Keep visual changes focused on the requested element. Preserve existing artwork, playback, scrolling, music, and interactions unless asked to change them.

## Keeping context useful

- Update `PROJECT_CONTEXT.md` when changing a design's identity, route, architecture, or a lasting project decision.
- Keep the context concise. Do not turn it into a transcript or a running list of every spacing adjustment.
- Read the relevant current code before relying on exact values copied into old conversations.
