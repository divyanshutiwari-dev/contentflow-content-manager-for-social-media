# Contentflow — Content Manager for Social Media
### Full-Stack Dashboard | Java 21 + Spring Boot 3 + Next.js 14 App Router

> **Engineered & Designed with passion by Divyanshu.**
> A high-performance, minimalist content management and scheduling SaaS platform with Dark Mode support, powered by Java 21, Spring Boot 3, and Next.js 14 App Router.

![Author](https://img.shields.io/badge/Made%20By-Divyanshu-E5484D?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Theme](https://img.shields.io/badge/Theme-Light%20%26%20Dark%20Mode-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Java%2021%20%7C%20Spring%20Boot%203.3.4-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black?style=for-the-badge)

---

## 1. Product Overview

**ContentFlow** is a modern editorial workflow and multi-platform content scheduling platform designed for high-velocity marketing teams, creators, and agency strategists. It provides a clean, unified command center to draft, schedule, visualize, and track publications across X (Twitter), LinkedIn, Instagram, Facebook, and blogs without the cognitive overload of disconnected tools.

### Problem Statement
Modern content distribution is fragmented across multiple platforms, spreadsheets, and heavyweight project management tools. Creators and social media teams often struggle with:
- Fragmented drafts scattered across Notion, Google Docs, and local files.
- Lack of a consolidated calendar view of upcoming broadcasts.
- Cluttered user interfaces with nonfunctional controls and complex token setups.
- Weak database-backed metrics that misrepresent pipeline velocity.

### Solution & Objectives
ContentFlow solves this by combining the **rock-solid reliability of an enterprise Java backend** with the **fluid responsiveness of a Next.js 14 frontend**:
- **Single Source of Truth**: Centralize all drafts, scheduled items, and published articles.
- **Accurate Database-Backed Analytics**: Dynamic counts and weekly activity breakdowns calculated directly from the relational database.
- **Interactive Calendar**: Monthly schedule planning with click-to-schedule date mapping and instant modal previews.
- **Platform-Aware Content Editor**: Live character count thresholds tailored for X (280 chars), LinkedIn (3,000 chars), Instagram (2,200 chars), and real-time social card preview simulation.

---

## 2. Key Features

| Feature | Description |
| :--- | :--- |
| **Dynamic Dashboard (`/dashboard`)** | Live metrics (Total Content, Drafts, Scheduled, Published), weekly activity distribution chart, platform breakdown progress bars, upcoming posts queue, and recent activity feed. |
| **Content Library (`/content`)** | Dual-mode view (Table and Card Grid), real-time search, multi-filter dropdowns (Status and Platform), sort controls, item deletion with confirmation dialog, and one-click draft duplication. |
| **Interactive Calendar (`/calendar`)** | Monthly grid with accurate date calculation, month transitions, today jumper, clickable post pills with platform icons, and quick-schedule date triggers. |
| **Platform-Aware Editor (`/content/new` & `/content/edit/[id]`)** | Supports 6 platforms (X, LinkedIn, Instagram, Facebook, Blog, General), strict future-date validation for scheduled items, live character counters with threshold alerts, and side-by-side simulated social card preview. |
| **Content Details Modal** | Full content review, author info, character count, scheduled timestamps, creation/update metadata, copy-to-clipboard body action, and direct edit/delete triggers. |
| **Dark Mode & Themes** | One-click toggle between light mode (#F8F8F6) and high-contrast dark mode (#0F0F11) with system preference detection and localStorage persistence. |
| **System Settings & Health Check (`/settings`)** | Live backend connectivity test measuring roundtrip latency in milliseconds, H2 database connection info, workspace default preferences, and editorial workflow guidance. |

---

## 3. Technology Stack & Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom SaaS tokens inspired by Linear, Vercel, and Notion Calendar
- **Icons**: Lucide React
- **HTTP Client**: Typed Native Fetch API with structured `ApiResponse<T>` handling

### Backend
- **Language**: Java 21 (OpenJDK / Eclipse Adoptium)
- **Framework**: Spring Boot 3.3.4
- **Web**: Spring Web (REST Controllers, CORS configuration)
- **Persistence**: Spring Data JPA & Hibernate 6
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Testing**: JUnit 5, Mockito, MockMvc, Spring Boot Test

### Database
- **Engine**: H2 Database Engine 2.2+
- **Storage Mode**: File-based persistence at `./data/contentflow.mv.db`
- **Development Tool**: Embedded H2 Web Console accessible at `http://localhost:8080/h2-console`
- **Portability**: Database dialect abstraction easily migrates to PostgreSQL or MySQL by updating `application.properties`.

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 14 Frontend                       │
│        (Tailwind CSS, Lucide Icons, App Router)             │
│   /dashboard   |   /content   |   /calendar   |   /settings │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      REST API (JSON over HTTP)
                      Port: 8080 (CORS Enabled)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Java 21 Spring Boot Backend                │
│                                                             │
│  [ Controllers ]  ──>  [ Services ]  ──>  [ Repositories ]   │
│  - ContentController   - ContentService    - ContentRepo    │
│  - HealthController    - ValidationLogic   - Custom JPQL    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                          Spring Data JPA
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    H2 Database Storage                      │
│        File-based Persistence: ./data/contentflow.mv.db      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### `contents` Table

| Column Name | SQL Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | No | Primary Key, Auto-increment Identity |
| `title` | `VARCHAR(255)` | No | Title of the content piece or social post |
| `body` | `TEXT` | No | Full post body, article draft, or marketing copy |
| `content_type` | `VARCHAR(50)` | No | `SOCIAL_POST`, `BLOG_DRAFT` |
| `platform` | `VARCHAR(50)` | No | `TWITTER_X`, `LINKEDIN`, `INSTAGRAM`, `FACEBOOK`, `BLOG`, `GENERAL` |
| `status` | `VARCHAR(50)` | No | `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED` |
| `scheduled_at` | `TIMESTAMP` | Yes | Target broadcast timestamp (required if `SCHEDULED`) |
| `tags` | `VARCHAR(255)` | Yes | Comma-separated list of tags (e.g. `launch,saas`) |
| `author` | `VARCHAR(100)` | Yes | Creator name (defaults to `Content Manager`) |
| `created_at` | `TIMESTAMP` | No | Auto-generated creation timestamp |
| `updated_at` | `TIMESTAMP` | No | Auto-updated modification timestamp |

---

## 5. REST API Documentation

Base URL: `http://localhost:8080/api`

All responses follow a predictable JSON format:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-10-29T02:05:31"
}
```

### Endpoints

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | None |
| `GET` | `/api/contents` | Retrieve content items | `search`, `status`, `platform`, `sortBy`, `sortDir` |
| `GET` | `/api/contents/{id}` | Retrieve single item by ID | Path variable `id` |
| `POST` | `/api/contents` | Create new post or draft | JSON body with title, body, contentType, platform, status, scheduledAt |
| `PUT` | `/api/contents/{id}` | Update existing content item | Path variable `id`, updated JSON body |
| `DELETE`| `/api/contents/{id}` | Permanently delete content item | Path variable `id` |
| `POST` | `/api/contents/{id}/duplicate` | Clone item as a new draft | Path variable `id` |
| `PATCH`| `/api/contents/{id}/status` | Quick status transition | `{"status": "PUBLISHED"}` |
| `GET` | `/api/contents/stats` | Dynamic dashboard statistics | Computes counts, upcoming posts, weekly activity, and platform breakdown |
| `GET` | `/api/contents/calendar`| Retrieve scheduled events | `year` (e.g. 2026), `month` (e.g. 10) |

---

## 6. Project Structure

```
contentflow/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/contentflow/
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java            # Configurable CORS origin mapping
│   │   │   │   │   ├── DataInitializer.java       # Idempotent demo data seeder (7 records)
│   │   │   │   │   └── GlobalExceptionHandler.java# REST exception handlers
│   │   │   │   ├── controller/
│   │   │   │   │   ├── ContentController.java     # REST API CRUD endpoints
│   │   │   │   │   └── HealthController.java      # Health check endpoint
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java           # Standard envelope
│   │   │   │   │   ├── ContentRequestDto.java     # Bean Validation input DTO
│   │   │   │   │   ├── ContentResponseDto.java    # Output DTO with displays
│   │   │   │   │   ├── DashboardStatsDto.java     # Metrics & breakdown
│   │   │   │   │   └── WeeklyActivityDto.java     # 7-day volume analytics
│   │   │   │   ├── exception/
│   │   │   │   │   ├── BadRequestException.java   # 400 validation error
│   │   │   │   │   └── ResourceNotFoundException.java # 404 entity error
│   │   │   │   ├── model/
│   │   │   │   │   ├── Content.java               # JPA entity
│   │   │   │   │   ├── ContentStatus.java         # DRAFT, SCHEDULED, PUBLISHED
│   │   │   │   │   ├── ContentType.java           # SOCIAL_POST, BLOG_DRAFT
│   │   │   │   │   └── Platform.java              # TWITTER_X, LINKEDIN, etc.
│   │   │   │   ├── repository/
│   │   │   │   │   └── ContentRepository.java     # Spring Data JPA queries
│   │   │   │   ├── service/
│   │   │   │   │   ├── ContentService.java        # Business interface
│   │   │   │   │   └── ContentServiceImpl.java    # Validation & scheduling logic
│   │   │   │   └── ContentFlowApplication.java    # Main Spring Boot launcher
│   │   │   └── resources/
│   │   │       └── application.properties         # Server & H2 configuration
│   │   └── test/
│   │       └── java/com/contentflow/
│   │           ├── ContentServiceTest.java        # Unit tests with Mockito (7 tests)
│   │           └── ContentControllerIntegrationTest.java # MockMvc integration tests (4 tests)
│   ├── data/                                      # File-based H2 database store
│   └── pom.xml                                    # Maven configuration (Java 21)
├── frontend/
│   ├── app/
│   │   ├── calendar/page.tsx                      # Monthly calendar page
│   │   ├── content/
│   │   │   ├── edit/[id]/page.tsx                 # Content edit page
│   │   │   ├── new/page.tsx                       # New content page
│   │   │   └── page.tsx                           # Content library (table/grid)
│   │   ├── dashboard/page.tsx                     # Dynamic analytics dashboard
│   │   ├── settings/page.tsx                      # Settings & backend latency tester
│   │   ├── globals.css                            # Tailored design system tokens
│   │   └── layout.tsx                             # Root layout, Sidebar, Navbar
│   ├── components/
│   │   ├── ConfirmModal.tsx                       # Modal confirmation dialog
│   │   ├── ContentDetailModal.tsx                 # Comprehensive detail modal
│   │   ├── ContentForm.tsx                        # Editor with live char limit & preview
│   │   ├── Navbar.tsx                             # Top navigation & search
│   │   ├── PlatformBadge.tsx                      # Brand-colored platform pills
│   │   ├── Sidebar.tsx                            # Sidebar & live health indicator
│   │   ├── SocialPreview.tsx                      # Simulated social cards (X, LinkedIn)
│   │   ├── StatusBadge.tsx                        # Status pills (Draft, Scheduled)
│   │   └── ToastProvider.tsx                      # Toast notification system
│   ├── lib/
│   │   ├── api.ts                                 # Typed API service
│   │   ├── types.ts                               # TypeScript domain types
│   │   └── utils.ts                               # Formatting & character boundaries
│   ├── .env.example
│   ├── .env.local
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

---

## 7. Prerequisites & Installation

### Prerequisites
- **Java Development Kit (JDK)**: Java 21 or higher (e.g. Eclipse Adoptium Temurin 21)
- **Apache Maven**: Version 3.9+
- **Node.js**: Version 18.17+ or 20+
- **npm**: Version 9+

---

## 8. Startup Commands

### Step 1: Start the Java Spring Boot Backend
Open a terminal in the `backend` directory:

```bash
cd backend
mvn clean spring-boot:run
```
*Alternatively, run the packaged JAR directly:*
```bash
java -jar target/contentflow-backend-1.0.0.jar
```
* The backend will start on **`http://localhost:8080`**.
* The H2 database file will automatically initialize in `backend/data/contentflow.mv.db`.
* Realistic demo data (7 diverse records across X, LinkedIn, Blog, Instagram, Facebook) will seed automatically.

### Step 2: Start the Next.js Frontend
Open a second terminal in the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
* The frontend will start on **`http://localhost:3000`**.
* Open your browser and navigate to **`http://localhost:3000`** (automatically redirects to `/dashboard`).

---

## 9. Environment Configuration

### Frontend (`frontend/.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (`backend/src/main/resources/application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:h2:file:./data/contentflow;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
app.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

---

## 10. Testing Instructions

### Run Backend Unit & Integration Tests
```bash
cd backend
mvn test
```
**Test Results Summary**:
- `ContentServiceTest`: 7 unit tests verifying CRUD, duplication, future-date scheduling validation, and stats calculation.
- `ContentControllerIntegrationTest`: 4 MockMvc tests verifying health endpoint, dashboard stats, H2 persistence, and input validation.
- **Total: 11 tests passed with 0 failures and 0 errors**.

### Verify Frontend Production Build
```bash
cd frontend
npm run build
```
* Compiles TypeScript, verifies route types, and outputs optimized static and dynamic bundles with zero lint or build errors.

---

## 11. Demonstration Walkthrough Guide

Follow this 5-minute walkthrough to demonstrate all capabilities:

1. **Dashboard Overview (`/dashboard`)**:
   - Observe live metric cards (Total Content: 8, Scheduled: 3, Drafts: 3, Published: 2).
   - Check the **Weekly Publishing Activity** interactive bar chart showing distribution across Monday through Sunday.
   - Inspect the **Platform Breakdown** and **Upcoming Scheduled Content** queue.
   - Notice the green **"Java Backend Online"** indicator in the bottom-left sidebar.

2. **Create a Post with Live Preview (`/content/new`)**:
   - Click **"+ Create Post"** in the top navigation.
   - Select **LinkedIn** as target platform and **Social Media Post** as type.
   - Enter title and write a post body — notice the live character count tracking against the 3,000-character LinkedIn limit.
   - Watch the **Live Social Preview** on the right side of the screen update in real time with the author badge, formatted text, and LinkedIn action buttons.
   - Toggle to **"Schedule Post"** and choose tomorrow's date. Click **"Schedule Post"**.

3. **Content Library & Management (`/content`)**:
   - The newly scheduled post appears at the top of the list.
   - Switch between **Table View** and **Card Grid View**.
   - Use the live search bar to search by keyword.
   - Filter by platform (e.g. "X (Twitter)") or status (e.g. "Scheduled Only").
   - Click the post to open the **Content Details Modal**. Click **"Duplicate Draft"** — notice an immediate clone titled *"Copy of..."* is created as an editable draft.

4. **Monthly Calendar (`/calendar`)**:
   - Navigate to the Calendar page.
   - Browse the monthly grid showing scheduled posts assigned to their exact target dates with platform badges and time indicators.
   - Use the **Previous/Next** month steppers to see schedule transitions.
   - Click any post on the calendar to open its detail view.

5. **Settings & Health Ping (`/settings`)**:
   - Navigate to Settings.
   - Click **"Test Connection"** to send a live health ping to `http://localhost:8080/api/health`.
   - Observe the live roundtrip latency indicator (e.g., *Latency: 4ms*).

---

## 12. Deployment Preparation

### Frontend Deployment (Vercel)
1. Push the code to GitHub.
2. Import the `frontend` folder into [Vercel](https://vercel.com).
3. Set the environment variable in Vercel project settings:
   ```ini
   NEXT_PUBLIC_API_URL=https://your-java-backend.up.railway.app/api
   ```
4. Deploy. Next.js App Router will build and serve seamlessly on Vercel's global edge network.

### Backend Deployment (Docker / Railway / Render / AWS)
1. Build the production executable JAR:
   ```bash
   cd backend
   mvn package -DskipTests
   ```
2. Containerize using a standard OpenJDK 21 Dockerfile:
   ```dockerfile
   FROM eclipse-temurin:21-jre-alpine
   VOLUME /tmp
   COPY target/contentflow-backend-1.0.0.jar app.jar
   EXPOSE 8080
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```
3. Set production environment variables:
   - `APP_CORS_ALLOWED_ORIGINS`: Set to your production Vercel frontend URL (e.g. `https://contentflow.vercel.app`).
   - For high availability, connect to PostgreSQL or MySQL by setting `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

---

## 13. Scope & Future Enhancements

### Current Scope & Design Philosophy
- **Single-User Workspace**: Designed as a focused personal or team content management dashboard without unnecessary third-party OAuth barriers.
- **Scheduling vs Publishing**: ContentFlow manages editorial timelines, drafts, and schedule queues. In accordance with Section 7, direct social media API dispatching requires paid developer accounts and OAuth token maintenance outside this initial release.

### Recommended Future Additions
- Multi-user role-based access control (Admin, Editor, Reviewer).
- Webhook notifications or email reminders when scheduled posts are due.
- Native OAuth2 integrations for direct 1-click publishing to X API v2 and LinkedIn Share API.
- AI copy suggestions and hashtag recommendations based on platform character trends.
