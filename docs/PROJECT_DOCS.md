🧠 Project Overview

EduFlow — bu o‘quv markazlar uchun mo‘ljallangan education management dashboard (MVP).

Maqsad:

o‘quv markaz ichki jarayonlarini raqamlashtirish
studentlar, guruhlar va davomadni boshqarish
oddiy, tez va tushunarli admin panel yaratish
🎯 MVP Goal

Bu loyiha MVP (Minimum Viable Product) bosqichida.

Asosiy maqsad:

bitta learning centre uchun ishlaydigan system yaratish
real userga berib test qilish
feedback olish va keyin rivojlantirish

❗ Muhim:

Multi-tenant (ko‘p learning centre) HOZIR YO‘Q
System hozir faqat bitta organization uchun ishlaydi
👥 User Roles
OWNER
learning centre egasi
barcha CRUD operatsiyalarni bajaradi
ADMIN
operatsion ishlar:
students
groups
enrollment
TEACHER
faqat:
o‘z group’lari
attendance
🧱 Core Modules (MVP Scope)
1. Auth
login/logout
JWT (access + refresh)
role-based access
2. Students
create / edit / delete
student list
student detail
3. Courses
course yaratish
grouplar uchun asos
4. Groups (Classes)
course + teacher bilan bog‘langan
schedule + start date
group detail page
5. Staff (Teachers)
User model orqali (role=TEACHER)
alohida table YO‘Q
6. Enrollment
studentni groupga qo‘shish
status: ACTIVE / LEFT / FINISHED
group detail’da students list
student detail’da groups list
7. Attendance
alohida sahifa:
Teacher → “Today attendance”
Admin → “History”
session + records model
🗄️ Data Model (Simplified)
User (OWNER, ADMIN, TEACHER)
Student
Course
Group
Enrollment
AttendanceSession
AttendanceRecord
⚙️ Tech Stack

Frontend:

Next.js (App Router)
TypeScript
shadcn/ui
TanStack Query

Backend:

NestJS
Prisma

Database:

SQLite (development)
PostgreSQL (future production)
📦 Architecture Rules
1. Feature-based structure
src/features/<feature>/

Har feature:

api.ts
queries.ts
types.ts
components/
2. UI
Faqat shadcn/ui ishlatiladi
custom UI yozilmaydi (agar kerak bo‘lmasa)
3. API usage
barcha requestlar shared HTTP client orqali
Authorization: Bearer token
4. State
TanStack Query ishlatiladi
global state minimal
🔐 Auth Rules
har request auth talab qiladi
token localStorage’da saqlanadi:
eduflow.accessToken
eduflow.refreshToken
401 bo‘lsa:
1 marta refresh
bo‘lmasa login page
📏 Coding Rules (Agentlar uchun)

❗ MUHIM:

Har doim mavjud kod strukturaga mos yoz
Yangi feature yozishda:
feature folder yarat
existing patternni copy qil
UI faqat shadcn orqali
API endpointlar REST bo‘lsin
Keraksiz refactor qilma
Minimal va tushunarli kod yoz
🚫 Out of Scope (Hozir qilinmaydi)
Multi-tenant (organization)
Payments system (keyin)
Notifications
Real-time
Mobile app
🔮 Future Plans (DO NOT IMPLEMENT NOW)
Multi-tenant SaaS:
Organization model
har user → organizationId
Super Admin dashboard
Subscription / billing

❗ Hozir bularni implement qilish shart EMAS

🧪 Development Notes
SQLite ishlatiladi
seed data qo‘shish tavsiya qilinadi
test qilish uchun:
1 admin
1 teacher
bir nechta students
🎯 Definition of Done (MVP)

MVP tayyor hisoblanadi agar:

user login qila olsa
student qo‘sha olsa
group yarata olsa
studentni groupga qo‘sha olsa
attendance qila olsa
💡 Important Philosophy
Perfect emas, working bo‘lsin
Real user feedback eng muhim
Oddiylik ustun
