# Findings

- The user already deleted `src/locales` and left the repository passing build, lint, and tests.
- The target is complete removal of remaining non-English locale support, not merely deletion of translation files.
- The English path still relies on `i18n.ts` for log-message placeholder substitution and `$t`; these behaviors are not translations and must remain or be extracted.
- Remaining explicit locale selection includes language constants, a `lang` local-storage preference, three language UI components, locale-specific styles, startup JSON fetching, and locale-aware list formatting.
- `make_static_json.ts` already only generates settings despite its stale translations comment.
- The retained legacy `v-i18n` plugin is now English-only: `translateText` is an identity function, while message/player substitution and parameter interpolation remain intact.
- Locale-specific UI, preferences, startup asset loading, formatting utilities, CSS, tools, tests, and contributor guidance have been removed.
- Discord's optional OAuth `locale` field is third-party response metadata, not application locale support, and remains.
