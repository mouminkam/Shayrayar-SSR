# خطة إعداد مشروع Magic Show

## الهدف

إعداد الملفات الأساسية وتطبيق نفس البنية والأنماط من المشروع الحالي على مشروع Magic Show، مع الحفاظ على بنية `_components` داخل الصفحات.

## البنية الحالية للمشروع الجديد

- يستخدم `_components` داخل كل صفحة (سيتم الحفاظ عليها)
- لا يوجد `api/`, `store/`, `hooks/`, `lib/`, `context/`, `locales/`
- الصفحات طويلة بدون lazy loading أو error boundaries
- لا يوجد UI components مشتركة

## الملفات الأساسية المطلوب إضافتها

### 1. إضافة المجلدات الأساسية

```javascript
src/
├── api/                    # API calls structure (فارغ حالياً)
│   ├── config/
│   │   └── axios.js        # Axios configuration
│   └── index.js            # API exports
├── store/                  # Zustand stores
│   ├── authStore.js        # Authentication store
│   ├── cartStore.js        # Cart store
│   ├── branchStore.js      # Branch/store selection (إن وجد)
│   └── toastStore.js       # Toast notifications store
├── hooks/                  # Custom React hooks
│   ├── useApiCache.js      # API caching hook
│   ├── useCart.js          # Cart management hook
│   └── useShopProducts.js  # Products fetching hook
├── lib/                    # Utilities
│   ├── utils/
│   │   ├── apiCache.js     # API caching utility
│   │   ├── cartHelpers.js  # Cart helper functions
│   │   ├── debounce.js     # Debounce utility
│   │   ├── formatters.js   # Formatting utilities
│   │   └── imageUtils.js   # Image utilities
│   └── validations/
│       └── authSchemas.js  # Zod validation schemas
├── context/                # React contexts
│   ├── LanguageContext.jsx # Language/i18n context
│   └── HighlightsContext.jsx # Highlights context (إن وجد)
└── locales/                # Translations
    ├── en.json
    ├── bg.json (أو ar.json حسب الحاجة)
    └── i18n/
        ├── config.js
        └── getTranslation.js
```



### 2. إضافة UI Components المشتركة

```javascript
src/components/
├── ui/
│   ├── AnimatedSection.jsx      # Animation wrapper
│   ├── ErrorBoundary.jsx         # Error boundary component
│   ├── SectionSkeleton.jsx      # Loading skeleton
│   ├── Breadcrumb.jsx           # Breadcrumb navigation
│   ├── Toast.jsx                # Toast notifications
│   └── OptimizedImage.jsx       # Optimized image component
├── auth/
│   ├── Protected.jsx            # Protected route wrapper
│   └── GuestOnly.jsx            # Guest-only route wrapper
└── seo/
    └── PageSEO.jsx              # SEO component
```



### 3. تحديث package.json

إضافة dependencies المطلوبة:

- `axios` - API calls
- `zustand` - State management
- `zod` + `@hookform/resolvers` - Form validation
- `react-hook-form` - Form handling
- `@stripe/react-stripe-js` + `@stripe/stripe-js` - Payments (إن وجد)
- `lenis` - Smooth scrolling
- `@vercel/speed-insights` - Performance monitoring
- `react-intersection-observer` - Intersection observer
- `next-seo` - SEO (أو استخدام PageSEO المخصص)

### 4. تحديث layout.jsx

- إضافة LanguageProvider
- إضافة HighlightsProvider (إن وجد)
- إضافة LenisScrollProvider
- إضافة Toast component
- إضافة HtmlLangUpdater
- تحديث metadata

### 5. تحديث globals.css

- إضافة theme colors variables
- إضافة font variables
- الحفاظ على الـ styles الحالية

### 6. إعادة هيكلة الصفحات (نمط مختصر)

تحويل كل صفحة من:

```jsx
// قبل: صفحة طويلة مع كل المنطق
export default function CategoryPage() {
  // ... كل المنطق هنا
  return <div>...</div>
}
```

إلى:

```jsx
// بعد: صفحة مختصرة + Section component
"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import PageSEO from "../../components/seo/PageSEO";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

const CategorySection = dynamic(
  () => import("./_components/CategorySection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={12} height="h-screen" />,
    ssr: false,
  }
);

export default function CategoryPage() {
  const { lang } = useLanguage();
  
  return (
    <div className="bg-bg3 min-h-screen">
      <PageSEO
        title="Category - Browse Products"
        description="Browse our products"
        url="/category-page"
        keywords={["products", "category"]}
      />
      <AnimatedSection>
        <Breadcrumb title={t(lang, "category")} />
      </AnimatedSection>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={12} height="h-screen" />}>
          <CategorySection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

ثم نقل كل المنطق إلى `_components/CategorySection.jsx`

### 7. تحديث next.config.ts

- إضافة image optimization settings
- إضافة compiler options
- إضافة experimental features

## الصفحات المطلوب إعادة هيكلتها

1. `src/app/home/page.jsx` → نقل المنطق إلى `_components/HomeSection.jsx`
2. `src/app/category-page/page.jsx` → نقل المنطق إلى `_components/CategorySection.jsx`
3. `src/app/about-us/page.jsx` → نقل المنطق إلى `_components/AboutUsSection.jsx`
4. `src/app/contact-us/page.jsx` → نقل المنطق إلى `_components/ContactSection.jsx`
5. `src/app/product-page/page.jsx` → نقل المنطق إلى `_components/ProductSection.jsx`
6. `src/app/blog/page.jsx` → نقل المنطق إلى `_components/BlogSection.jsx`
7. باقي الصفحات بنفس النمط

## ملفات الإعدادات

- `next.config.ts` - تحديث image config
- `src/app/layout.jsx` - إضافة providers
- `src/app/globals.css` - إضافة theme variables
- `package.json` - إضافة dependencies

## ملاحظات مهمة

1. **الحفاظ على `_components`**: لن يتم تحويلها إلى `components/pages/` كما طلب المستخدم
2. **API فارغة حالياً**: الملفات ستكون جاهزة للاستخدام عند جاهزية Backend
3. **Mock data**: يمكن الاحتفاظ بـ mock data في المكونات حتى جاهزية API
4. **التدرج**: يمكن تطبيق التغييرات بشكل تدريجي على الصفحات

## الترتيب التنفيذي

1. إضافة المجلدات الأساسية والملفات الفارغة
2. إضافة UI components المشتركة
3. تحديث package.json وتثبيت dependencies
4. تحديث layout.jsx وglobals.css
5. إعادة هيكلة صفحة واحدة كـ example (مثل home)