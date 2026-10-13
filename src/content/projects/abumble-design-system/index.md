---
name: '@abumble/design-system'
type: Personal
startYear: 2025
endYear: present
description: A shared component and theme library for personal web projects, built on shadcn/ui and Tailwind CSS and published to npm.
tech: [TypeScript, React, TailwindCSS, Vite]
related: [web-portfolio, propmange]
---

## Overview

This package is a single, shared library of components and themes for a family of personal web projects, so each new site starts from the same building blocks and styles instead of defining them again. It's published to npm and added to each project as a regular dependency, and it's used by both [Web Portfolio](/projects/web-portfolio) and [PropMange](/projects/propmange).

It's built on two starting points, **shadcn/ui** for the components and **Tailwind CSS** for the styling, and is essentially a custom flavour of both. It was built solo with the assistance of Claude Code, with every change reviewed by hand.

### Components

The library began with shadcn/ui components (buttons, dialogs, forms, tables and the like) restyled to suit those projects. It has since grown to include original components, added whenever a need showed up in more than one project: page headers, a sidebar, not-found and under-construction pages, and the logo. Once a component is in the library, every project gets it, and improvements to it, through a version update.

Components are built and previewed in isolation with Storybook and a small sandbox app before they're published.

### Theming

All styling is done with Tailwind CSS. The library ships a set of custom colour themes, each with a light and a dark mode, and every project picks the theme it uses by default. Components are styled with semantic colours (background, primary, border) rather than fixed ones, so a theme restyles every component at once without touching any of them.
