# Giga AI Agent Admin

Admin panel for Giga AI Agent

## Stack
Typescript, React, RectQuery, ReactRouter, Ant Design, Tailwind CSS

Building with webpack

## Project Structure

```
root/
├── assets - web assets
├── distrib - configuration for deployment to k8s
│   ├── deploy - Jenkinsfile and vars file
│   ├── templates - k8s manifests jinja2 templates
│   └── nginx.conf - nginx server for web static and api proxy configuration
├── src/ - sources
│   ├── api/ - backend API layer
│   ├── app/ - top level application wrappers like routes and design system
│   ├── components/ - applciation components in Atomic Design Methodology
│   ├── context/ - application context
│   ├── hooks/ - custom react hooks
│   ├── services/ - logic not directly related to components (authorization, etc)
│   ├── application/ state stores
│   └── index.tsx - index file
├── Jenkinsfile - CI pipeline
├── Dockerfile - dockerfile with nginx server for deployment
└── README.md
```

## Code requirements

- Code coverage > 90%
- prettier and eslint checks
- Conventional commits
- GitHub issue in commit message
- Playwright tests

## Git Branching model

Using trunk based development: [Trunk](https://trunkbaseddevelopment.com/)

- main - trunk brunch
- feature/* - feature branches
- bugfix/* - bugfix branches
- release/* - release branches

Every branch except main must have issue number in name. For example: `feature/24-add-about-page`

Pushes to main branch are forbidden, only pull requests allowed. For PRs using squash and fast-forward only

## Features flow

Implementing features with openspec and AI agents


## Test stand

Application is automatically deployed to test stand by jenkins job and then it is available at https://admin.giga-ai-agent.test.cloud.ra-tech.pro

## Changes agreements

Before branch is ready for PR, it shold be locally tested, then CI/CD pipelines must finish successfully, github checks run successfully and then feature/bugfix should work on test stand. After this PR can be maid.

