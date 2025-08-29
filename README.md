# Anthology

Needs .env file

```js
// .env file
VITE_WC_PROJECT_ID = "WalletConnect Project ID";
VITE_FACTORY_CONTRACT = "Factory Contract Address";
VITE_FACTORY_RPC = "Factory RPC - http";
VITE_ENV = "development" | "any";
```

---

## Git merge Example Workflow

```js
//1. Create a feature branch:
git checkout -b feature/add-search dev

//2. Make changes and commit:
git commit -m "Add search functionality"

//3. Merge into dev with a commit:
git checkout dev

// --no-ff -> its going to keep branch flow topology
git merge --no-ff feature/add-search -m "Merged 'feature/add-search' into dev"

// --no-edit -> makes the "Merged 'feature/add-search' into dev" by default
git merge --no-ff --no-edit <BRANCH NAME>

//4. Delete the feature branch:
git branch -d feature/add-search
```

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

### Commit Message Guidelines

```js
//For clear and consistent commit messages, follow this format:
git commit -m "<type>(<scope>): <message>"
```

```js
//Types:
feat: → New feature
fix: → Bug fix
chore: → Maintenance, cleanup, etc.
refactor: → Code improvements without changing functionality
docs: → Documentation updates
style: → Code style (e.g., formatting)
test: → Adding or updating tests

//Versioning Results:
feat: → Bumps Minor version
fix: → Bumps Patch version
BREAKING CHANGE: → Bumps Major version
No relevant commits? → No version change
```

### Git commit template

#### Create template file and set it up

```
> nano .gitmessage
> git config commit.template .gitmessage
> git commit -> without -m flag
```

### Pushing to main

```js
//only on main
npm run release

//Push tags with
git push --follow-tags origin main
```
