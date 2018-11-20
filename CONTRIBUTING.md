# Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to `OpenPitrix Dashboard`, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

## Issues and Bug reporting

Before opening an issue, please search the [issue tracker](https://github.com/openpitrix/dashboard/issues) to make sure your issue hasn't already been reported.

We use the issue tracker to keep track of bugs and improvements to this project, its examples, and the documentation. We encourage you to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.

## Workflow

### Github workflow

To check out code to work on, please refer to the [GitHub Workflow Guide](https://guides.github.com/introduction/flow/).

### Development

```
npm run dev
```

### Testing

Continuous integration will run these tests either as pre-submits on PRs, post-submits against master/release branches, or both.

Running tests against your local change:

```
npm test
```

## Directory and File Conventions

```
|- build-deps   # build dependencies or binary used in CI build
|- config       # global config files
|- docs         # documents
|- lib          # libraries used both on server and client
|- public       # public assets like images and svg, font
|- server       # server-side source folder
|- test         # test files
|- src          # client-side source folder
   |- components    # basic components
   |- config        # client-side config files
   |- locales       # i18n files
   |- pages         # page container components
   |- providers     # service providers
   |- routes        # client routes
   |- scss          # sass folder
   |- stores        # mobx store files
   |- utils         # client utilities
   |- App.jsx       # application component
   |- index.js      # entry file
```

## Pull Request

For non-trivial changes, please open an issue with a proposal for a new feature or refactoring before starting on the work. We don't want you to waste your efforts on a pull request that we won't want to accept.

On the other hand, sometimes the best way to start a conversation is to send a pull request. Use your best judgement!

In general, the contribution workflow looks like this:

* Open a new issue in the Issue tracker.
* Fork the repo.
* Create a new feature branch based off the `master` branch.
* Make sure all tests pass and there are no linting errors.
* Submit a pull request, referencing any issues it addresses.

## Code Review

To make it easier for your PR to receive reviews, consider the reviewers will need you to:

* follow the project coding conventions
* write good commit messages
* break large changes into a logical series of smaller patches which individually make easily understandable changes, and in aggregate solve a broader issue

## Documentation

Our documents placed at `docs`. If you would like to help contribute to this project's documentation or website,
we’re happy to have your help! Anyone can contribute,
whether you’re new to the project or you’ve been around a long time,
and whether you self-identify as a developer, an end user, or someone who just can’t stand seeing typos.

Thank you for contributing!
