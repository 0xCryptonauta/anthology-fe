# Anthology

needs .env file

> .env
>
> > FACTORY_CONTRACT_ADDRESS = "FACTORY_CONTRACT"
> >
> > LAVA_PROJECT_ID = "LAVA PROJECT ID"
> > WC_PROJECT_ID = "WC PROJECT ID"
> > VITE_ENV = "development" || "production"

How to run this project

```
    npm run dev
```

---

---

## Git merge Example Workflow

### 1. Create a feature branch:

```
git checkout -b feature/add-search dev
```

### 2. Make changes and commit:

```
git commit -m "Add search functionality"
```

### 3. Merge into dev with a commit:

```
git checkout dev
git merge --no-ff feature/add-search -m "Merged 'feature/add-search' into dev"
git merge --no-ff --no-edit <BRANCH NAME>
```

### 4. Delete the feature branch:

```
git branch -d feature/add-search
```

---

---

## Branch naming

|     Type      |  Prefix  |            Example            |
| :-----------: | :------: | :---------------------------: |
|    Feature    | feature/ |    feature/user-onboarding    |
|    Bug Fix    |   fix/   |         fix/login-bug         |
|    Hotfix     | hotfix/  | hotfix/critical-payment-issue |
| Documentation |  docs/   |      docs/update-readme       |
|    Chores     |  chore/  |   chore/update-dependencies   |

---

---

### Commit Message Guidelines

#### For clear and consistent commit messages, follow this format:

```
<type>(<scope>): <message>
```

#### Types:

```
feat: → New feature

fix: → Bug fix

chore: → Maintenance, cleanup, etc.

refactor: → Code improvements without changing functionality

docs: → Documentation updates

style: → Code style (e.g., formatting)

test: → Adding or updating tests
```

#### Versioning Results:

```

feat: → Bumps Minor version

fix: → Bumps Patch version

BREAKING CHANGE: → Bumps Major version

No relevant commits? → No version change
```

#### Examples:

```
feat(auth): add OAuth login support

fix(ui): resolve alignment issues on mobile

chore: update dependencies

docs: improve README instructions
```

---

### Git commit template

#### Create template file and set it up

```
> nano .gitmessage
> git config commit.template .gitmessage
> git commit -> without -m flag
```

#### Template

```
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
<type>[optional scope]: <description>
# |<----  Using a Maximum Of 50 Characters  ---->|

<body>
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|
# Explain how the commit addresses the issue
#
# BREAKING CHANGE: <explanation> (optional -> bumps major version)
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
#
# ------------------------------ COMMIT TYPE ----------------------------------
# Type can be
#   feat     (new feature -> Bumps Minor version)
#   fix      (bug fix -> Bumps Patch version)
#   refactor (refactoring production code)
#   style    (formatting, missing semi colons, etc; no code change)
#   docs     (changes to documentation)
#   test     (adding or refactoring tests; no production code change)
#   chore    (updating grunt tasks etc; no production code change)
#   wip      (work in progress commit to be squashed -- do not push!)**
# -----------------------------------------------------------------------------
#
# Remember to
#   - Capitalize the subject line
#   - Use the imperative mood in the subject line
#   - Do not end the subject line with a period
#   - Separate subject from body with a blank line
#   - Use the body to explain what and why vs. how
#   - Can use multiple lines with "-" for bullet points in body.
```
