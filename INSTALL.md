# Installation Guide

## opencode

opencode loads skills from `~/.config/opencode/skills/`.

```bash
# Clone or download this repo
git clone https://github.com/boticlaw/escape-room-skills.git

# Copy all three skills
cp -r escape-room-skills/skills/* ~/.config/opencode/skills/

# Verify
ls ~/.config/opencode/skills/escape-design/SKILL.md
ls ~/.config/opencode/skills/escape-build/SKILL.md
ls ~/.config/opencode/skills/escape-puzzles/SKILL.md
```

The skills will be available on next opencode session start.

## Claude Code

Claude Code loads skills from `.claude/skills/` in your project directory.

```bash
# In your project root
mkdir -p .claude/skills
cp -r escape-room-skills/skills/* .claude/skills/

# Verify
ls .claude/skills/escape-design/SKILL.md
```

Claude Code picks up skills automatically when you start a new conversation.

## Generic LLM Agents

For agents without a skill-loading system:

### Option A: System Prompt

Copy the contents of each `SKILL.md` into your agent's system prompt or custom instructions. Skills are self-contained — no external file references needed.

```bash
# Concatenate all skills into one instruction file
cat skills/escape-design/SKILL.md \
    skills/escape-build/SKILL.md \
    skills/escape-puzzles/SKILL.md \
    > escape-room-instructions.md
```

### Option B: Context Files

Upload each `SKILL.md` as a separate context file. Most agents handle multiple context files well.

### Option C: RAG / Knowledge Base

Add the `SKILL.md` files to your agent's knowledge base. The structured format (frontmatter, headers, tables) works well with retrieval-augmented generation.

## Build Tools (Optional)

The `scripts/` and `templates/` directories provide PDF generation and validation:

```bash
# PDF generation requires Node.js + Puppeteer
npm install puppeteer
node scripts/build-pdf.mjs templates/html/game-design.html

# Schema validation requires Python 3
bash scripts/validate-schema.sh ./my-game
```

These are optional — the design skills work without them.

## Verification

After installation, ask your agent:

```
What escape room skills do you have available?
```

It should list: escape-design, escape-build, escape-puzzles.
