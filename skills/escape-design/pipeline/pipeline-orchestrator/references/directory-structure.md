# Directory Structure

## During the Pipeline

```
{output_dir}/
├── PROGRESS.json               ← Pipeline state (retomable)
├── RESOLVED_STANDARDS.json
├── BRIEF.json
├── REGRESSION-REPORT.json      ← Only if baseline exists
├── concepts/
│   ├── CONCEPT-A.json          (escape-judge-a output)
│   └── CONCEPT-B.json          (escape-judge-b output)
├── CONCEPT.json                (final synthesis)
├── designs/
│   ├── DESIGN-A.json           (escape-judge-a output)
│   └── DESIGN-B.json           (escape-judge-b output)
├── DESIGN.json                 (final synthesis)
├── NARRATIVE-CONSISTENCY-REPORT.json
├── DIFFICULTY-REPORT.json
├── VERIFY-REPORT.json
├── playtests/
│   ├── PLAYTEST-A.json         (escape-judge-a output)
│   └── PLAYTEST-B.json         (escape-judge-b output)
├── PLAYTEST-REPORT.json        (final synthesis)
└── JUDGMENT-REPORT.json
```

## After Final Approval

```
juegos/{juego}/
├── (game files)
└── doc/
    └── pipeline/
        ├── BRIEF.json
        ├── CONCEPT.json
        ├── DESIGN.json
        ├── VERIFY-REPORT.json
        ├── PLAYTEST-REPORT.json
        └── JUDGMENT-REPORT.json
```
