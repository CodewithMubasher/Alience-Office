# shadcn/ui monorepo template

This is a Vite monorepo template with shadcn/ui.

## Office suite

Five apps live in `apps/` (Documents, Notes, Presentation, Spreadsheet, Whiteboard), each on its
own dev port (5177–5181) so they can run side by side with `pnpm dev`.

The Spreadsheet app ports its engine from the MIT-licensed
[HeyPuter "everything" monorepo](https://github.com/HeyPuter/everything) and rebuilds the UI in
shadcn/ui. The plan and architecture decisions live in
[docs/spreadsheet-plan.md](docs/spreadsheet-plan.md) and
[docs/adr/](docs/adr/).

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
