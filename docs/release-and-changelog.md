## Release version

First make git work directory clean, then bump npm version. `npm version` will generate git tag
automatically.

#### Example: release a patch version

```bash
npm version patch

npm run changelog  ## will handle patch version

git commit -a -m 'chore: Modify changelog'

git push --follow-tags origin master
```


## Auto-gen changelog

### 1. standard-version and the problem
Previously we use `standard-version` to handle our version release. The command is very easy:

```bash
standard-version -i CHANGELOG.md -n
```

More details, checkout it's homepage: `https://github.com/conventional-changelog/standard-version#readme`

But there is one issue that `standard-version` _can not assign git commit range_.

You can see following issues on github:

- [https://github.com/conventional-changelog/standard-version/issues/205](https://github.com/conventional-changelog/standard-version/issues/205)
- [https://github.com/conventional-changelog/standard-version/issues/93](https://github.com/conventional-changelog/standard-version/issues/93)
- [https://github.com/conventional-changelog/conventional-changelog/issues/45](https://github.com/conventional-changelog/conventional-changelog/issues/45)


### 2. generate-changelog to rescue

`generate-changelog` is also a npm package, just like `standard-version`, but less popular. Checkout `generate-changelog`'s help:

```bash
npx generate-changelog -h
```

While most functionality of `generate-changelog` can also be done in `standard-version`, but the best of it is **git commit range**.
When you can not assign commit range in `standard-version`, you can try:
```bash
generate-changelog -t v0.4.1  ## gen changelog from v0.4.1
``` 

Dry-run, not output to changelog.md
```bash
generate-changelog -t v0.4.1 -f -
```
