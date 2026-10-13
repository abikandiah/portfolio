# PropMange: brief

Questionnaire answers for the write-up. Ignored by the build.

Source: https://github.com/abikandiah/prop-manager (Spring Boot API and infrastructure) and https://github.com/abikandiah/prop-manager-ui (React frontend). Replaces the legacy `src/projects/PropMange.tsx` page.

## Part 1

1. **Work or Personal?** Personal.
2. **When?** March 2026. The commit history runs from 2026-01-29 to 2026-03-25.
3. **Problem / why?** "It was a project for learning purposes, decided on build a property management system that could connect management, tenants, landlords, and maintenance crews together. With a whole OIDC auth and authorization flow, tickets, chats, emails, and whatnot, with power to scale. To learn Java Spring, PostgreSQL, databases, cloudflare self-hosting with tunnels, docker compose and containers for the whole setup with caddy, logto, reverse proxy learning, setting up and managing the whole infrastructure, hosting on cloudflare pages, etc. Mainly a learning project basically."
4. **Role?** "Built solo with claude code assistance, mostly generated and reviewed. Brainstorming and discussions." No meta row.
5. **Most proud of?** "What I've experimented with, learned and used, technology-wise, that I've used this as a learning project to learn how to develop with these tools and AI development, and the thought process and scale behind the whole application - multi-orgs, etc."
6. **Numbers?** No.
7. **Live link?** https://prop-mange.akandiah.ca. Don't link the GitHub repos.
8. **Write-up, case study, or both?** Both.
9. **Anything to leave out?** Nothing.
10. **Related projects?** None. It shares the `@abumble/design-system` package with the portfolio, but that isn't on the site yet.

## Part 2

1. **Tickets, chats, maintenance (placeholder pages only): describe?** "Yes leave them out, maybe mention them as a feature roadmap or such."
2. **Heart of it?** "How about the self-hosted infrastructure combined with the offline-first frontend? And then yes, the rest briefly." The rest: properties/units, leases and templates, tenant portal, multi-org access control, invites, notifications, activity.
3. **Live demo?** "No, the backend doesn't run 24/7, there's no demo site, only the frontend on cloudflare pages, it's only a landing page." Don't present the link as a working demo.
4. **Case study material?** "Not really to be honest. The only thing I could think of is going over the tools used for the infrastructure, but that's redundant with the design docs, right?"

## Direction

- A learning project: the page should say so, and say it was built with AI assistance (Claude Code), mostly generated and reviewed by the author.
- Centre: the self-hosted infrastructure and the offline-first frontend, as one story of how the system runs.
- Multi-org access, leases, tenant portal, invites and notifications are covered briefly.
- Tickets, chat and maintenance appear only as a roadmap.

## Naming AI tools

Don't name any AI tool or vendor on the page (no "Claude" or "Claude Code"). Say "AI assistance" or "AI coding" generically.
