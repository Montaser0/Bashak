# Bashak — Backend API

متجر إلكتروني بسيط — واجهة برمجية Laravel REST API.

## المتطلبات

- PHP 8.2+
- Composer
- SQLite (افتراضي) أو MySQL / SQL Server

## التثبيت

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

## حساب المدير الافتراضي

| الحقل | القيمة |
|-------|--------|
| البريد | `admin@store.com` |
| كلمة المرور | `password123` |

## نقاط النهاية (API)

### عام — للزوار (بدون تسجيل دخول)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/products` | عرض جميع المنتجات |
| GET | `/api/products/{id}` | تفاصيل منتج |

### المدير — يتطلب `Authorization: Bearer {token}`

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/api/admin/login` | تسجيل الدخول |
| GET | `/api/admin/me` | بيانات المدير الحالي |
| POST | `/api/admin/logout` | تسجيل الخروج |
| GET | `/api/admin/products` | عرض المنتجات |
| POST | `/api/admin/products` | إضافة منتج |
| PUT | `/api/admin/products/{id}` | تعديل منتج |
| DELETE | `/api/admin/products/{id}` | حذف منتج |
| GET | `/api/admin/users` | عرض المستخدمين (المدراء) |
| POST | `/api/admin/users` | إضافة مستخدم جديد |
| PUT | `/api/admin/users/{id}/password` | تعديل كلمة مرور مستخدم |
| DELETE | `/api/admin/users/{id}` | حذف مستخدم |

### تسجيل الدخول

```json
POST /api/admin/login
{
  "email": "admin@store.com",
  "password": "password123"
}
```

### إنشاء حساب أدمن جديد بدون تسجيل دخول

```json
POST /api/admin/register
{
  "full_name": "Admin Test",
  "email": "admin2@store.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

هذا المسار عام ولا يحتاج Bearer Token، وهو مخصص لحسابات الأدمن فقط ويُحفظ في جدول `admins`.

### إضافة مستخدم (مدير)

```json
POST /api/admin/users
Authorization: Bearer {token}

{
  "full_name": "اسم المدير",
  "email": "newadmin@store.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### تعديل كلمة مرور مستخدم

```json
PUT /api/admin/users/{id}/password
Authorization: Bearer {token}

{
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

### إضافة منتج

```
POST /api/admin/products
Content-Type: multipart/form-data
Authorization: Bearer {token}

product_name, description, price, image (file)
```

> المنتج الآن يحتوي أيضًا على `quantity` كمخزون، ويتم خصمه تلقائياً عند إنشاء الطلب.

### تنبيه انخفاض المخزون

- عندما يصبح مخزون المنتج 2 أو أقل، يتم إنشاء تنبيه منخفض مخزون.
- يمكن للمدير مراجعة التنبيهات من `/api/admin/stock-alerts`.

### إنشاء طلب وسلة التسوق

عند انتهاء الزبون من التسوق تُرسل عناصر السلة إلى API الطلبات، ثم يرجع النظام رابط واتس أب جاهز مع نص الفاتورة. الواجهة الأمامية يمكنها وضعه على زر "إرسال واتس أب" مباشرة.

```json
POST /api/orders
{
  "customer_name": "أحمد علي",
  "whatsapp_number": "201001112233",
  "notes": "التسليم مساءً",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

الاستجابة تتضمن `order` و`whatsapp_url` و`whatsapp_message`.

زر "إرسال واتس أب" في الواجهة الأمامية يجب أن يفتح قيمة `whatsapp_url` مباشرة.

## المصادقة

يستخدم المشروع Laravel Sanctum لإصدار رموز Bearer Token (متوافق مع JWT للواجهة الأمامية).
