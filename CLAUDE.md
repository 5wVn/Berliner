# CLAUDE.md

This file provides essential context for Claude Code when working on the Berliner codebase. It documents architecture patterns, conventions, and critical information that requires reading multiple files to understand.

## Project Overview

Berliner is a multi-tenant student portal for vocational schools. It provides role-based dashboards for students, teachers, registrars, academic heads, and company representatives to manage schedules, grades, attendance, and documents.

## Development Commands

```bash
npm run dev     # Start Next.js development server (localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

**Note:** Testing framework is not yet configured (defined in Definition of Done but not implemented).

## Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (serverless, edge functions)
- **PWA:** next-pwa + Workbox for offline support

## Architecture Decisions

- **Server Components by default** (Next.js App Router)
- **Server Actions** instead of traditional API routes for data operations
- **Multi-tenant shared database** with `establishment_id` on all tables
- **Row-Level Security (RLS)** at PostgreSQL level for tenant isolation
- **Offline-first strategy** with service worker caching for schedules and notes

## Code Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   └── (dashboard)/       # Role-based dashboard route groups
│       ├── student/
│       ├── teacher/
│       ├── registrar/
│       ├── academic-head/
│       └── company/
├── modules/               # Feature modules (domain-driven)
│   ├── auth/
│   ├── attendance/
│   ├── grades/
│   ├── scheduling/
│   └── ...
└── shared/               # Shared utilities & components
    ├── components/ui/    # Design system components
    ├── lib/supabase/    # Supabase client utilities
    └── types/           # Shared TypeScript types
```

## Multi-Tenant Security (CRITICAL)

**Every database table includes `establishment_id (UUID)` for tenant isolation.**

**RLS (Row-Level Security) is the security boundary:**
- ALL tables have RLS policies enabled
- Helper function: `auth.user_establishment_id()` enforces tenant context
- **NEVER bypass RLS in application code** - it prevents cross-tenant data access

**Example RLS Policy:**
```sql
CREATE POLICY "Establishment isolation for profiles"
  ON profiles FOR ALL
  USING (establishment_id = auth.user_establishment_id());
```

## Database Conventions

- **Primary keys:** UUID
- **Timestamps:** `created_at`, `updated_at` on all tables
- **Enums:** `user_role`, `attendance_status`
- **Soft delete:** Not implemented in MVP

**Helper Function:**
```sql
CREATE OR REPLACE FUNCTION auth.user_establishment_id()
RETURNS uuid AS $$
  SELECT establishment_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE;
```

## Server Actions Pattern

All data operations use Server Actions (not API routes).

**Error Shape:**
```typescript
type ActionError = {
  code: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL';
  message: string;
  details?: Record<string, string>;
};
```

**Return Type:**
```typescript
Promise<{ ok: true; data?: T } | { ok: false; error: ActionError }>
```

**Requirements:**
- Validate inputs (use zod or equivalent)
- Return consistent error shapes
- Handle authentication/authorization at the action level

## Design System

**Typography:**
- **Fonts:** Fira Sans (Headings - Bold Italic), Montserrat (Body)
- **Base size:** 17px (optimized for mobile readability)
- **Scale:** H1 28px Bold, H2 24px SemiBold, H3 20px Medium, Body 17px Regular

**Color Palette:**
- **Primary:** Indigo 600 (`#4F46E5`) - buttons, links, brand elements
- **Surface:** Dark Navy (`#0F172A`) - headers, navigation
- **Background:** Slate 50 (`#F8FAFC`) - page background (not pure white)
- **Semantic Colors:**
  - Success: Emerald 500 (`#10B981`)
  - Warning: Amber 500 (`#F59E0B`)
  - Error: Red 500 (`#EF4444`)
  - Info: Blue 500 (`#3B82F6`)

**UI Patterns:**
- **"Bento" card layout** with `rounded-xl` (12px) or `rounded-2xl` (16px)
- **Touch targets:** Minimum 44x44px (mobile-first)
- **Bottom navigation** for main navigation
- **FAB (Floating Action Button)** for primary actions
- **Skeleton screens** for loading states
- **Icons:** Lucide React (outline/stroke style, 1.5-2px stroke)
- **Shadows:** Very light (`shadow-sm` maximum) for performance

## TypeScript Standards

- **Strict mode enabled**
- **Zero `any` policy** - all types must be explicit
- **Target:** ES2017
- All files must pass `npm run lint`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Definition of Done

**Code:**
- TypeScript strict, 0 `any`, lint passes
- No known regressions

**Performance:**
- Lighthouse mobile > 90
- FCP < 1.5s, TTI < 3s

**Security:**
- RLS policies tested
- Secrets never exposed to client
- Input validation with explicit errors

**UX:**
- Mobile-first, touch targets > 44px
- Offline fallback functional
- WCAG 2.1 AA accessibility compliance

## Documentation

Comprehensive documentation in `docs/`:
- `00_context.md` through `14_risks_open_questions.md`
- `design_system.md` - UI patterns and brand guidelines
- `diagrams/` - Mermaid architecture diagrams

**Key Documentation Files:**
- `docs/07_architecture.md` - Stack and architectural decisions
- `docs/08_data_model.md` - PostgreSQL schema and RLS conventions
- `docs/09_api_contracts.md` - Server Actions patterns
- `docs/13_definition_of_done.md` - Quality standards

## Path Alias

- `@/*` resolves to `./src/*` (configured in `tsconfig.json` and Tailwind)
