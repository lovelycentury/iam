#!/usr/bin/env node
// oxlint-disable no-console
/**
 * commit-msg hook: enforce the project commit convention.
 *
 *   <:gitmoji:> <type>(<scope>)?<!>?: <summary>
 *   :sparkles: feat: add a size prop to Button
 *   :bug: fix(react): stop Dialog leaking the scroll lock
 *
 * - the summary must start with a gitmoji shortcode from the official set
 *   (https://gitmoji.dev) — `pnpm commit` inserts it for you;
 * - after it comes a Conventional Commits header: a type, an optional
 *   `(scope)`, an optional `!` for a breaking change, then `: ` and a summary.
 *
 * Skipped: merge commits, reverts, `fixup!` / `squash!` / `amend!` autosquash
 * commits, and the `chore: version packages` commit from the changesets bot.
 *
 * simple-git-hooks invokes this as `node tools/check-commit-msg.mjs $1`, where
 * `$1` is the path to the commit message file; when no path is passed it falls
 * back to `git rev-parse --git-path COMMIT_EDITMSG`.
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const CONVENTIONAL_TYPES = [
  "feat",
  "fix",
  "chore",
  "docs",
  "refactor",
  "test",
  "perf",
  "build",
  "ci",
  "style",
  "revert",
];

// Official gitmoji shortcodes and what each one means — https://gitmoji.dev
const GITMOJI_CODES = new Set([
  "art", // 🎨 Improve structure / format of the code
  "zap", // ⚡️ Improve performance
  "fire", // 🔥 Remove code or files
  "bug", // 🐛 Fix a bug
  "ambulance", // 🚑️ Critical hotfix
  "sparkles", // ✨ Introduce new features
  "memo", // 📝 Add or update documentation
  "rocket", // 🚀 Deploy stuff
  "lipstick", // 💄 Add or update the UI and style files
  "tada", // 🎉 Begin a project
  "white_check_mark", // ✅ Add, update, or pass tests
  "lock", // 🔒️ Fix security or privacy issues
  "closed_lock_with_key", // 🔐 Add or update secrets
  "bookmark", // 🔖 Release / version tags
  "rotating_light", // 🚨 Fix compiler / linter warnings
  "construction", // 🚧 Work in progress
  "green_heart", // 💚 Fix CI build
  "arrow_down", // ⬇️ Downgrade dependencies
  "arrow_up", // ⬆️ Upgrade dependencies
  "pushpin", // 📌 Pin dependencies to specific versions
  "construction_worker", // 👷 Add or update CI build system
  "chart_with_upwards_trend", // 📈 Add or update analytics or track code
  "recycle", // ♻️ Refactor code
  "heavy_plus_sign", // ➕ Add a dependency
  "heavy_minus_sign", // ➖ Remove a dependency
  "wrench", // 🔧 Add or update configuration files
  "hammer", // 🔨 Add or update development scripts
  "globe_with_meridians", // 🌐 Internationalization and localization
  "pencil2", // ✏️ Fix typos
  "poop", // 💩 Write bad code that needs to be improved
  "rewind", // ⏪️ Revert changes
  "twisted_rightwards_arrows", // 🔀 Merge branches
  "package", // 📦️ Add or update compiled files or packages
  "alien", // 👽️ Update code due to external API changes
  "truck", // 🚚 Move or rename resources (files, paths, routes)
  "page_facing_up", // 📄 Add or update license
  "boom", // 💥 Introduce breaking changes
  "bento", // 🍱 Add or update assets
  "wheelchair", // ♿️ Improve accessibility
  "bulb", // 💡 Add or update comments in source code
  "beers", // 🍻 Write code drunkenly
  "speech_balloon", // 💬 Add or update text and literals
  "card_file_box", // 🗃️ Perform database related changes
  "loud_sound", // 🔊 Add or update logs
  "mute", // 🔇 Remove logs
  "busts_in_silhouette", // 👥 Add or update contributor(s)
  "children_crossing", // 🚸 Improve user experience / usability
  "building_construction", // 🏗️ Make architectural changes
  "iphone", // 📱 Work on responsive design
  "clown_face", // 🤡 Mock things
  "egg", // 🥚 Add or update an easter egg
  "see_no_evil", // 🙈 Add or update a .gitignore file
  "camera_flash", // 📸 Add or update snapshots
  "alembic", // ⚗️ Perform experiments
  "mag", // 🔍️ Improve SEO
  "label", // 🏷️ Add or update types
  "seedling", // 🌱 Add or update seed files
  "triangular_flag_on_post", // 🚩 Add, update, or remove feature flags
  "goal_net", // 🥅 Catch errors
  "dizzy", // 💫 Add or update animations and transitions
  "wastebasket", // 🗑️ Deprecate code that needs to be cleaned up
  "passport_control", // 🛂 Work on code related to authorization, roles and permissions
  "adhesive_bandage", // 🩹 Simple fix for a non-critical issue
  "monocle_face", // 🧐 Data exploration / inspection
  "coffin", // ⚰️ Remove dead code
  "test_tube", // 🧪 Add a failing test
  "necktie", // 👔 Add or update business logic
  "stethoscope", // 🩺 Add or update healthcheck
  "bricks", // 🧱 Infrastructure related changes
  "technologist", // 🧑‍💻 Improve developer experience
  "money_with_wings", // 💸 Add sponsorships or money related infrastructure
  "thread", // 🧵 Add or update code related to multithreading or concurrency
  "safety_vest", // 🦺 Add or update code related to validation
]);

const MAX_SUBJECT_LENGTH = 100;
const SKIP_PREFIXES = ["Merge ", "Revert ", "fixup! ", "squash! ", "amend! "];

function resolveMessagePath() {
  if (process.argv[2]) return process.argv[2];
  return execFileSync("git", ["rev-parse", "--git-path", "COMMIT_EDITMSG"], {
    encoding: "utf8",
  }).trim();
}

const raw = readFileSync(resolveMessagePath(), "utf8");
const subject =
  raw.split(/\r?\n/).find((line) => line.trim() !== "" && !line.startsWith("#")) ?? "";

if (
  subject === "chore: version packages" ||
  SKIP_PREFIXES.some((prefix) => subject.startsWith(prefix))
) {
  process.exit(0);
}

const errors = [];
const gitmojiMatch = subject.match(/^:([a-z0-9_+-]+): (.+)$/);

if (!gitmojiMatch) {
  errors.push('Must start with a gitmoji shortcode, e.g. ":sparkles: feat: ...".');
} else {
  const [, code, rest] = gitmojiMatch;
  if (!GITMOJI_CODES.has(code)) {
    errors.push(`":${code}:" is not an official gitmoji — see https://gitmoji.dev.`);
  }
  const header = rest.match(/^([a-z]+)(\([^)]+\))?(!)?: .+/);
  if (!header) {
    errors.push(
      'After the gitmoji, use a Conventional Commits header: "<type>(<scope>)?: <summary>".',
    );
  } else if (!CONVENTIONAL_TYPES.includes(header[1])) {
    errors.push(`"${header[1]}" is not an allowed type (${CONVENTIONAL_TYPES.join(", ")}).`);
  }
}

if (subject.length > MAX_SUBJECT_LENGTH) {
  errors.push(`Subject is ${subject.length} chars; keep it ≤ ${MAX_SUBJECT_LENGTH}.`);
}

if (errors.length > 0) {
  console.error("✗ commit message rejected:\n");
  console.error(`  ${subject || "(empty subject)"}\n`);
  for (const error of errors) console.error(`  • ${error}`);
  console.error("\n  Run `pnpm commit` for a guided prompt.\n");
  process.exit(1);
}
