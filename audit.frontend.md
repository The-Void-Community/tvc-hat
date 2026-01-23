# **Аудит проекта: TVC-HAT Frontend**

**Дата:** 23 января 2026 г.

**Проверяющий:** GitHub Copilot

**Владелец репозитория:** The Void community

**Краткая сводка:** Проанализировано около 100 файлов в frontend. Выявлено 20+ лишних файлов (legacy chat implementation) и 5 модулей, требующих рефакторинга.

---

## **1. Цель**

Выявить неиспользуемые, устаревшие (легаси) файлы и файлы, требующие оптимизации, для очистки репозитория и улучшения поддерживаемости кода frontend приложения.

## **2. Методология**

- Анализ импортов и зависимостей в TypeScript/JSX файлах.
- Проверка entry points (app/page.tsx, app/layout.tsx) и рекурсивное отслеживание импортов.
- Ручной анализ структуры и ссылок.
- Игнорирование сгенерированных файлов (.next/).

## **3. Результаты аудита**

### **3.1. Актуальные и необходимые файлы**

_Файлы, которые активно используются в проекте._

- `src/api/*.ts` — API утилиты (get-chats.ts, post-message.ts, etc.), импортируемые компонентами.
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/home.tsx`, `src/app/chat/` — Страницы и layout Next.js.
- `src/components/logo.component.tsx`, `src/components/settings.component.tsx`, `src/components/wrapper.component.tsx`, `src/components/human.component.tsx`, `src/components/icon.tsx` — Компоненты, используемые в layout и features.
- `src/constants/*.ts` — Константы, импортируемые повсеместно.
- `src/contexts/` — (если используется, но по анализу chat.context.ts legacy).
- `src/enums/*.ts` — Перечисления, используемые в types и features.
- `src/features/app.provider.tsx`, `src/features/chat/`, `src/features/client/`, `src/features/hooks/`, `src/features/messages/`, `src/features/users/` — Новая архитектура features, активно импортируемая.
- `src/hooks/use-chat-initialization.hook.ts`, etc. (новые hooks в features).
- `src/types/*.ts` — Типы, используемые в API и компонентах.
- `src/utils/*.ts` — Утилиты, импортируемые.

### **3.2. Кандидаты на рефакторинг / Легаси-код**

_Файлы, которые используются, но содержат устаревший код, требуют объединения или оптимизации._

- Некоторые компоненты в `src/features/` (message-related) — Используются, но могут быть оптимизированы для производительности.
- `src/features/hooks/use-normalized-store.hook.ts` — Логика store может быть упрощена или мигрирована на Zustand.

### **3.3. Кандидаты на удаление**

_Файлы, не импортируемые и не используемые в проекте (legacy chat implementation)._

- `src/app/chat.tsx` — Старый chat компонент, заменен features.
- `src/components/chat/chat-sidebar.tsx`, `src/components/chat/chat.tsx`, `src/components/chat/message-input.tsx`, `src/components/chat/message-list.tsx`, `src/components/chat/message.tsx`, `src/components/chat/user-list.tsx`, `src/components/chat/user-status.tsx` — Старые chat компоненты, не импортируются.
- `src/hooks/use-chat-messages.hook.ts`, `src/hooks/use-chat-scroll.hook.ts`, `src/hooks/use-date-formatters.hook.ts`, `src/hooks/use-direct-chat.hook.ts`, `src/hooks/use-filtered-chats.hook.ts` (и другие в hooks/) — Legacy hooks, только для старого chat.
- `src/contexts/chat.context.ts` — Только для старого chat.
- Любые неиспользуемые утилиты или частичные реализации в features/, если есть дубликаты.

---

**Статус документа:** Согласован

**Следующая проверка:** unknown

**Автор:** GitHub Copilot

**На согласовании у:** The Void Community

---

© The Void Community 2026
