# Product Admin Dashboard 🚀

A responsive, production-ready Product Admin Dashboard built with **React 19**, **TypeScript**, **Tailwind CSS**, **Axios**, and **React Router**. This application integrates with the **DummyJSON REST API** to deliver seamless authentication, debounced product search with race-condition protection, category filtering, sorting, pagination, URL state synchronization, and full CRUD management.

---

## 🌟 Key Features

- **🔐 Authentication & Route Protection**
  - Authenticates against DummyJSON `/auth/login` endpoint.
  - Test Credentials pre-configured: Username: `emilys` | Password: `emilyspass`.
  - Protected routes redirect unauthenticated users to `/login`.
  - Session persistence via `localStorage` with logout functionality.

- **📦 Product Listing & Discovery**
  - Responsive layout: Desktop structured table & Mobile touch-friendly card grid.
  - Displays thumbnail, title, category, price, discount %, rating, and stock badges.
  - Stats overview bar with total catalogue count and active filter tags.

- **⚡ Debounced Search & Race-Condition Protection**
  - 400ms search input debounce via custom `useDebounce` hook.
  - **Stale-Response Protection:** Uses `AbortController` to cancel pending in-flight requests when query parameters change, ensuring older slow responses never overwrite newer search results.

- **🔍 Category Filtering & Multi-Attribute Sorting**
  - Category filtering using DummyJSON API category list.
  - Sort by `title`, `price`, `rating`, or `stock` in `asc` or `desc` order.
  - Seamless handling of DummyJSON API limitations when combining search and category filters.

- **📄 Dynamic Pagination**
  - Page size selection options: `10`, `20`, `50` items per page.
  - Full previous, page numbers, and next navigation.
  - Uses `limit` and `skip` parameters.

- **🔗 URL State Synchronization & Safe Normalization**
  - URL query string reflects current page state: `/products?page=2&pageSize=20&search=phone&category=smartphones&sortBy=price&order=asc`.
  - Refreshing or sharing the URL reproduces the exact view.
  - Invalid parameters (e.g., `?page=-5`, `?pageSize=999`) are automatically normalized to safe defaults without crashing.

- **📝 CRUD Operations (Add, Edit, Delete)**
  - **Add Product:** Form modal with client-side field validation & numeric checks.
  - **Edit Product:** Pre-populates form with existing product details.
  - **Delete Product:** Explicit modal confirmation with deleting feedback.
  - **Optimistic State Updates:** Reflects mock API POST/PUT/DELETE operations immediately in the UI.

- **🔍 Detailed Product View (`/products/:id`)**
  - Image gallery carousel, product specs, brand, warranty, shipping info, and customer reviews.
  - Friendly "Product Not Found" state for invalid or non-existent product IDs.

---

## 🛠️ Technology Stack

- **Core Framework:** React 19, TypeScript, Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **HTTP Client:** Axios (Centralized shared instance with interceptors)
- **Icons:** Lucide React

---

## 🏗️ Architecture & Code Organization

The codebase follows a clean layered separation of concerns:

```
src/
├── api/
│   ├── axiosInstance.ts    # Centralized Axios setup (baseURL, auth headers, error handling)
│   ├── authService.ts      # Authentication API endpoints
│   └── productService.ts   # Product fetching, search, filter, sort, and CRUD services
│
├── components/
│   ├── common/             # ProtectedRoute, SkeletonLoader, ErrorState
│   ├── layout/             # Navbar with user badge and logout
│   └── products/           # ProductFilters, ProductTable, Pagination, ProductFormModal, DeleteConfirmModal
│
├── context/
│   └── AuthContext.tsx     # Session state, login, logout, and token storage
│
├── hooks/
│   └── useDebounce.ts      # Custom search input debounce hook
│
├── pages/
│   ├── LoginPage.tsx          # Login page with auto-fill test credentials
│   ├── ProductListPage.tsx    # Dashboard with URL query sync, search, and CRUD
│   ├── ProductDetailsPage.tsx # Detailed view with image gallery & customer reviews
│   └── NotFoundPage.tsx       # Custom 404 route component
│
├── types/
│   └── product.ts          # Strongly typed TypeScript interfaces (Product, ProductQueryParams, etc.)
│
├── App.tsx                 # Application router configuration
└── main.tsx                # React 19 entry point
```

---

## 🚦 How Search Race Conditions are Prevented

When a user types rapidly in a search bar (e.g. typing "p" → "ph" → "phone"), multiple API requests are fired. If request A ("ph") responds *after* request B ("phone"), displaying request A would show stale, incorrect results.

**Our Solution:**
1. In `src/api/productService.ts`, all API requests accept an `AbortSignal`.
2. `ProductListPage` maintains an `abortControllerRef`.
3. Before dispatching a new request, `abortControllerRef.current.abort()` is called to immediately cancel any previous pending Axios request.
4. If an aborted request rejects with `CanceledError`, the response is safely ignored, ensuring **only the latest response updates the state**.

---

## 💡 DummyJSON API Limitations & Strategy

DummyJSON is a mock REST API with specific behavior characteristics:

1. **Search + Category Combination:** DummyJSON does not natively support combining search (`/products/search?q=`) and category (`/products/category/`) in a single query.
   - **Our Strategy:** When both search and category are active, `productService.getProducts` queries search matches (`limit=0`), applies client-side category filtering, sorts the items, and paginates cleanly (`slice(skip, skip + limit)`).
2. **Mock Mutations:** Endpoints `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id` return mock responses but do not permanently modify DummyJSON's remote database.
   - **Our Strategy:** Successful API operations trigger immediate optimistic updates to local React state so that additions, edits, and deletions are visually reflected in the UI.

---

## ⚙️ Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/product-admin-dashboard.git
   cd product-admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production & lint:**
   ```bash
   npm run build
   npm run lint
   ```

---

## 🤖 AI Usage Transparency

In accordance with PRD guidelines:
- **AI Tools Used:** Antigravity AI Assistant (powered by Google Gemini).
- **AI Role:** Initial boilerplate scaffolding, CSS utility formatting, and documentation.
- **Manual Verification:** Architecture layout, `AbortController` cancellation logic, URL state normalization, and TypeScript strict mode types were manually designed, reviewed, and verified.

---

## 📜 License

MIT License. Built for Frontend Technical Assessment.
