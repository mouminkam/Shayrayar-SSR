# Magic Show Project - Next.js

هذا مشروع Next.js جاهز للنشر على Vercel.

## البدء السريع

لتشغيل المشروع محلياً:

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح لعرض المشروع.

## النشر على Vercel

### الطريقة الأولى: من خلال واجهة Vercel (موصى بها)

1. **الذهاب إلى صفحة Vercel:**
   - افتح الرابط: https://vercel.com/new?teamSlug=mo2min2001-2274s-projects

2. **ربط المشروع:**
   - اختر "Import Git Repository" (استيراد مستودع Git)
   - إذا كان المشروع موجوداً على GitHub/GitLab/Bitbucket، قم بربط المستودع
   - أو استخدم "Clone Template" إذا كان لديك قالب

3. **إذا لم يكن المشروع على Git:**
   - قم بإنشاء مستودع على GitHub/GitLab/Bitbucket أولاً
   - ادفع الكود إلى المستودع:
     ```bash
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin <your-repo-url>
     git push -u origin main
     ```
   - ثم عد إلى صفحة Vercel واربط المستودع

4. **إعدادات النشر:**
   - Vercel سيكتشف تلقائياً أنه مشروع Next.js
   - اضغط "Deploy" (نشر)

### الطريقة الثانية: من خلال Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# أو النشر للإنتاج مباشرة
vercel --prod
```

## متطلبات المشروع

- Node.js 18 أو أحدث
- npm أو yarn أو pnpm

## البناء والإنتاج

```bash
# بناء المشروع
npm run build

# تشغيل نسخة الإنتاج
npm start
```

## معلومات إضافية

- Framework: Next.js 16
- React: 19.2.0
- Styling: Tailwind CSS 4
- Package Manager: npm
