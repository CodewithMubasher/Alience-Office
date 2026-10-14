# ADR-0002 — Local-first storage behind a repository interface

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The reference stores every document as a real `.xlsx` in the user's Puter cloud
drive, and depends on Puter for auth, drafts, and version snapshots. This repo
currently has **no backend at all**, and this is a portfolio project: the app
must work today without accounts, servers, or API keys.

## Decision

- Documents live locally: autosaved workbook JSON + `.xlsx` bytes in IndexedDB,
  with Open…/Save as… through file download/picker.
- All persistence goes through a `DocumentRepository` interface
  (`list/load/save/duplicate/delete/snapshots`) with two implementations:
  `IndexedDbRepository` (default) and `FileSystemRepository` (open/save to disk).
- The reference's `Doc` shape (workbook JSON, name, dirty state, save status) is
  kept so a future `PuterRepository`/`SupabaseRepository` drops in without UI
  changes.
- Autosave drafts are local-only for now; the reference's conflict prompt
  ("file changed elsewhere") is deferred with the backend.

## Consequences

- The app works offline and needs no signup; nothing about the engine changes.
- Multi-device and sharing features are blocked on a backend, exactly as the
  non-goals in the plan state.
- The op-log/collaboration model in the reference is understood but not
  implemented; the data model (workbook JSON as the unit of change) does not
  preclude adding it later.
