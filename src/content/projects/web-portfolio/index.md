---
name: Web Portfolio
type: Personal
startYear: 2025
endYear: 2026
description: A personal portfolio website to showcase my technical expertise, designed as a modern single-page application (SPA) and hosted on Cloudflare.
tech: [TypeScript, React, Tanstack, TailwindCSS, Vite, Cloudflare]
url: https://akandiah.ca
---

## Overview

This site is a developer portfolio: a single place to show a career timeline, the projects completed along the way, and the technologies behind them. It's built as a React single-page application (SPA) and hosted on Cloudflare Pages.

It was built solo with the assistance of Claude Code, with every change reviewed by hand.

### The Site

The home page reads like a résumé, in the order a recruiter skims one: a short introduction, then work experience, education and a selection of projects. Each role and each stage of education expands in place for more detail, so the page stays short until the reader wants more.

Every project has its own page with up to two views. The **Design** view explains how the project works: its components, how they fit together and why it was built that way. The **Case Study** view, where there is one, is a short first-person story of why the project was built and what came out of it. Longer pages carry a table of contents and, where the connections between components are the point, a diagram.

:::info

Work projects are described at a design level, and never name the employer or its clients.

:::

### Project Write-ups

Each write-up is a Markdown file. The work write-ups came first: written by hand and then refined with AI, they set the voice and level of detail for the rest of the site. Personal projects are now drafted by an AI-assisted skill that reads the project's code and a short questionnaire, imitates those work write-ups, and leaves the draft to be reviewed and edited by hand. This keeps every page consistent without each one becoming a long, tedious piece of writing.

### Stack and Hosting

The site is a client-side rendered SPA written in TypeScript with React. TanStack Router handles routing, Tailwind CSS the styling, and Vite the builds. The result is a set of static files served from Cloudflare Pages, with no backend of its own.
