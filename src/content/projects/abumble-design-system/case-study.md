I started this design system during my first web app, and kept building it after. As soon as I was building more than one site, it made sense to have one central place for components and theming rather than letting each project define its own buttons, dialogs and colours.

shadcn/ui and Tailwind CSS were the natural starting points. shadcn/ui hands you the component source rather than a locked-down library, so it's easy to make it your own, and Tailwind keeps the styling in one consistent vocabulary. Over time the library picked up my own components too, wherever more than one project needed the same thing.

Publishing it to npm was a small but important step. It means each project adds the design system as a normal dependency rather than a local one, and picks up changes by updating a version.

AI-assisted coding is a big part of why this is manageable. A shared library is extra work to build, maintain and keep consistent alongside the projects that use it, and Claude Code made that overhead small enough to be worth it. It's also never really finished: every new site I build will start from it.
