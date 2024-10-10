# Contribution Guide

Thank you for your interest in contributing to our open-source projects! We welcome contributions of all types, including bug fixes, new features, documentation improvements, and more. This guide will help you understand how to contribute effectively to this project.

## Getting Started

### 1. Fork the Repository

Before you start working on a feature or bug fix, make sure to [fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and work off of that fork.

### 2. Clone Your Fork

Once you've forked the repository, clone it locally:

```bash
git clone https://github.com/your-username/repository-name.git
cd repository-name
```

### 3. Create a Branch

Create a new branch for your contribution. Use a descriptive name to help others understand what you are working on:

```bash
git checkout -b feature/new-feature
```

For example:
- `feature/surreal-query-builder`
- `fix/authentication-issues`

### 4. Set Up Development Environment

Refer to the [README.md](./README.md) for instructions on how to set up the project on your local machine.

### 5. Make Your Changes

Now that you're set up, you can begin making your changes. Make sure to:
- Write clean, readable code.
- Include comments where necessary.
- Follow the coding standards of the project.
- Write unit tests for any new functionality where applicable.

### 6. Test Your Changes

Make sure your changes pass all tests by running the test suite. You can also add new tests as needed to cover new features or bug fixes.

```bash
npm test
```

Ensure that the code is properly linted:

```bash
npm run lint
```

### 7. Commit and Push

Once you're happy with your changes, commit them to your branch:

```bash
git add .
git commit -m "Brief description of the changes"
```

Then push your changes to your forked repository:

```bash
git push origin feature/new-feature
```

### 8. Open a Pull Request (PR)

Go to the original repository and [open a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) from your branch. Make sure to provide a detailed description of what you’ve done and include relevant issue numbers if applicable.

Be ready to address feedback and make additional changes based on code reviews.

## Contributing Guidelines

When contributing to this repository, please ensure that your code adheres to the following guidelines:

1. **Code Style**: Follow the code style and guidelines used in the project. We use linters to enforce these standards, so make sure your code passes lint checks before submitting.
   
2. **Write Unit Tests**: All new features and fixes should come with appropriate tests to ensure they work as expected. This helps maintain code quality.

3. **Documentation**: For significant changes or new features, update or create relevant documentation files (e.g., README, Wiki). Documentation is critical for onboarding other developers.

4. **Commits**: Write clear, concise, and meaningful commit messages. A good commit message tells the story of what you’ve done and why.

5. **Issues**: If you’re addressing an issue, make sure to link it in the pull request description by using keywords like `Fixes #issue-number` or `Closes #issue-number`.

6. **Work In Progress (WIP)**: If you’re not done with a feature but still want feedback, you can open a PR with the `WIP` (Work In Progress) label. This way, other contributors can provide feedback while you're still working.

## Code of Conduct

We follow a [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure that everyone can contribute in a respectful and inclusive environment. Make sure you read and adhere to it when contributing.

## Reporting Bugs & Suggesting Features

If you have discovered a bug or want to suggest a new feature, please [open an issue](https://github.com/repository/issues) using the appropriate template.

## Need Help?

If you need help with your contribution or have any questions, feel free to open an issue, and we'll do our best to assist.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (usually MIT or another open-source license). Please review the [LICENSE file](./LICENSE) for details.

---

Thank you again for your interest in contributing! We appreciate all the help we can get to make this project better.
