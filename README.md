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
