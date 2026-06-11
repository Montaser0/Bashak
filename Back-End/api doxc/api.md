# Bashak — توثيق واجهة برمجة التطبيقات (API)

واجهة REST API لمتجر إلكتروني بسيط مبني على Laravel مع مصادقة Sanctum.

---

## معلومات عامة

| البند | القيمة |
|-------|--------|
| **الرابط الأساسي** | `http://localhost:8000/api` |
| **صيغة البيانات** | `application/json` (ما عدا رفع الصور) |
| **المصادقة** | Laravel Sanctum — Bearer Token |
| **فحص الصحة** | `GET /up` |

> استبدل `http://localhost:8000` بعنوان الخادم الفعلي عند النشر.

---

## المصادقة (Authentication)

### كيف تعمل المصادقة

1. أنشئ حساب أدمن من `POST /api/admin/register` أو استخدم الحساب الافتراضي.
2. أرسل بيانات الدخول إلى `POST /api/admin/login`.
3. استلم `token` من الاستجابة.
4. أرفق الرمز في كل طلب محمي:

```http
Authorization: Bearer {token}
```

### الحساب الافتراضي بعد `migrate --seed`

| الحقل | القيمة |
|-------|--------|
| البريد الإلكتروني | `admin@store.com` |
| كلمة المرور | `password123` |

### انتهاء صلاحية الرمز

- الرمز يبقى صالحاً حتى **تسجيل الخروج** (`POST /api/admin/logout`) أو **تغيير كلمة المرور** للمستخدم.
- عند تغيير كلمة مرور مدير، تُحذف جميع رموزه تلقائياً.

---

## تنسيق الاستجابات

### استجابة ناجحة لمورد واحد

```json
{
  "message": "رسالة توضيحية",
  "admin": { "...": "..." }
}
```

### استجابة ناجحة لقائمة موارد

```json
{
  "data": [
    { "...": "..." }
  ]
}
```

### أخطاء التحقق (422)

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["حقل البريد الإلكتروني مطلوب."]
  }
}
```

### غير مصرح (401)

```json
{
  "message": "غير مصرح بالوصول. يرجى تسجيل الدخول."
}
```

### غير موجود (404)

```json
{
  "message": "No query results for model [App\\Models\\Product] 1"
}
```

---

## نماذج البيانات

### Admin

```json
{
  "id": 1,
  "full_name": "مدير المتجر",
  "email": "admin@store.com",
  "created_at": "2026-06-11T12:00:00.000000Z"
}
```

### Product

```json
{
  "id": 1,
  "product_name": "هاتف ذكي تجريبي",
  "description": "هاتف ذكي بمواصفات جيدة مناسب للاستخدام اليومي.",
  "price": "1499.00",
  "quantity": 12,
  "image_url": "http://localhost:8000/storage/products/demo-phone.jpg",
  "created_at": "2026-06-11T12:00:00.000000Z",
  "updated_at": "2026-06-11T12:00:00.000000Z"
}
```

### Stock Alert

```json
{
  "id": 1,
  "product_id": 1,
  "product_name": "هاتف ذكي تجريبي",
  "remaining_quantity": 2,
  "threshold": 2,
  "message": "تنبيه: مخزون المنتج هاتف ذكي تجريبي منخفض وأصبح 2 قطعة.",
  "is_resolved": false,
  "created_at": "2026-06-11T12:00:00.000000Z",
  "updated_at": "2026-06-11T12:00:00.000000Z"
}
```

### Order Item

```json
{
  "id": 1,
  "product_id": 1,
  "product_name": "هاتف ذكي تجريبي",
  "unit_price": "1499.00",
  "quantity": 2,
  "line_total": "2998.00"
}
```

### Order

```json
{
  "id": 1,
  "order_number": "ORD-20260611120000-AB12",
  "customer_name": "أحمد علي",
  "whatsapp_number": "201001112233",
  "notes": "التسليم مساءً",
  "status": "pending",
  "subtotal": "3299.00",
  "total": "3299.00",
  "whatsapp_recipient_number": "+905316924944",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "هاتف ذكي تجريبي",
      "unit_price": "1499.00",
      "quantity": 2,
      "line_total": "2998.00"
    }
  ],
  "whatsapp_message": "فاتورة الطلب...",
  "whatsapp_url": "https://wa.me/905316924944?text=...",
  "created_at": "2026-06-11T12:00:00.000000Z",
  "updated_at": "2026-06-11T12:00:00.000000Z"
}
```

---

## المسارات العامة

### 1) عرض جميع المنتجات

```http
GET /api/products
```

**المصادقة:** غير مطلوبة

**مثال الاستجابة JSON:**

```json
{
  "data": [
    {
      "id": 1,
      "product_name": "هاتف ذكي تجريبي",
      "description": "هاتف ذكي بمواصفات جيدة مناسب للاستخدام اليومي.",
      "price": "1499.00",
      "quantity": 12,
      "image_url": "http://localhost:8000/storage/products/demo-phone.jpg",
      "created_at": "2026-06-11T12:00:00.000000Z",
      "updated_at": "2026-06-11T12:00:00.000000Z"
    }
  ]
}
```

### 2) عرض تفاصيل منتج

```http
GET /api/products/{id}
```

**المصادقة:** غير مطلوبة

**مثال الاستجابة JSON:**

```json
{
  "data": {
    "id": 1,
    "product_name": "هاتف ذكي تجريبي",
    "description": "هاتف ذكي بمواصفات جيدة مناسب للاستخدام اليومي.",
    "price": "1499.00",
    "quantity": 12,
    "image_url": "http://localhost:8000/storage/products/demo-phone.jpg",
    "created_at": "2026-06-11T12:00:00.000000Z",
    "updated_at": "2026-06-11T12:00:00.000000Z"
  }
}
```

### 3) إنشاء طلب من السلة

```http
POST /api/orders
Content-Type: application/json
```

**المصادقة:** غير مطلوبة

**مثال الطلب JSON:**

```json
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

**مثال الاستجابة JSON:**

```json
{
  "message": "تم إنشاء الطلب بنجاح.",
  "order": {
    "id": 1,
    "order_number": "ORD-20260611120000-AB12",
    "customer_name": "أحمد علي",
    "whatsapp_number": "201001112233",
    "notes": "التسليم مساءً",
    "status": "pending",
    "subtotal": "3299.00",
    "total": "3299.00",
    "whatsapp_recipient_number": "+905316924944",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "هاتف ذكي تجريبي",
        "unit_price": "1499.00",
        "quantity": 2,
        "line_total": "2998.00"
      }
    ],
    "whatsapp_message": "فاتورة الطلب...",
    "whatsapp_url": "https://wa.me/905316924944?text=...",
    "created_at": "2026-06-11T12:00:00.000000Z",
    "updated_at": "2026-06-11T12:00:00.000000Z"
  },
  "whatsapp_url": "https://wa.me/905316924944?text=...",
  "whatsapp_message": "فاتورة الطلب..."
}
```

---

## مسارات الأدمن للمصادقة

### 4) تسجيل دخول الأدمن

```http
POST /api/admin/login
Content-Type: application/json
```

**المصادقة:** غير مطلوبة

**مثال الطلب JSON:**

```json
{
  "email": "admin@store.com",
  "password": "password123"
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم تسجيل الدخول بنجاح.",
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "Bearer",
  "admin": {
    "id": 1,
    "full_name": "مدير المتجر",
    "email": "admin@store.com",
    "created_at": "2026-06-11T12:00:00.000000Z"
  }
}
```

### 5) إنشاء حساب أدمن جديد بدون تسجيل دخول

```http
POST /api/admin/register
Content-Type: application/json
```

**المصادقة:** غير مطلوبة

**ملاحظة:** هذا المسار ينشئ حسابات admin فقط، ويتم حفظها في جدول `admins`.

**مثال الطلب JSON:**

```json
{
  "full_name": "Admin Test",
  "email": "admin2@store.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "لقد تم انشاء الحساب بنجاح.",
  "admin": {
    "id": 2,
    "full_name": "Admin Test",
    "email": "admin2@store.com",
    "created_at": "2026-06-11T12:00:00.000000Z"
  }
}
```

### 6) بيانات الأدمن الحالي

```http
GET /api/admin/me
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "admin": {
    "id": 1,
    "full_name": "مدير المتجر",
    "email": "admin@store.com",
    "created_at": "2026-06-11T12:00:00.000000Z"
  }
}
```

### 7) تسجيل خروج الأدمن

```http
POST /api/admin/logout
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم تسجيل الخروج بنجاح."
}
```

---

## مسارات الأدمن للمنتجات

> جميع الطلبات التالية تتطلب `Authorization: Bearer {token}`.

### 8) عرض المنتجات في لوحة التحكم

```http
GET /api/admin/products
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "data": [
    {
      "id": 1,
      "product_name": "هاتف ذكي تجريبي",
      "description": "هاتف ذكي بمواصفات جيدة مناسب للاستخدام اليومي.",
      "price": "1499.00",
      "quantity": 12,
      "image_url": "http://localhost:8000/storage/products/demo-phone.jpg",
      "created_at": "2026-06-11T12:00:00.000000Z",
      "updated_at": "2026-06-11T12:00:00.000000Z"
    }
  ]
}
```

### 9) إضافة منتج

```http
POST /api/admin/products
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**حقول النموذج:**

| الحقل | النوع | مطلوب |
|-------|-------|-------|
| `product_name` | string | نعم |
| `description` | string | نعم |
| `price` | number | نعم |
| `quantity` | integer | نعم |
| `image` | file | نعم |

**مثال JSON توضيحي للبيانات:**

```json
{
  "product_name": "هاتف ذكي",
  "description": "هاتف بمواصفات عالية",
  "price": 1500,
  "quantity": 10
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم إضافة المنتج بنجاح.",
  "product": {
    "id": 2,
    "product_name": "هاتف ذكي",
    "description": "هاتف بمواصفات عالية",
    "price": "1500.00",
    "quantity": 10,
    "image_url": "http://localhost:8000/storage/products/xxxxx.jpg",
    "created_at": "2026-06-11T14:00:00.000000Z",
    "updated_at": "2026-06-11T14:00:00.000000Z"
  }
}
```

### 10) تعديل منتج

```http
PUT /api/admin/products/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**مثال JSON توضيحي للبيانات:**

```json
{
  "product_name": "هاتف ذكي محدّث",
  "description": "وصف محدّث",
  "price": 1400,
  "quantity": 8
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم تحديث المنتج بنجاح.",
  "product": {
    "id": 2,
    "product_name": "هاتف ذكي محدّث",
    "description": "وصف محدّث",
    "price": "1400.00",
    "quantity": 8,
    "image_url": "http://localhost:8000/storage/products/yyyyy.jpg",
    "created_at": "2026-06-11T14:00:00.000000Z",
    "updated_at": "2026-06-11T15:00:00.000000Z"
  }
}
```

### 11) حذف منتج

```http
DELETE /api/admin/products/{id}
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم حذف المنتج بنجاح."
}
```

---

## مسارات الأدمن للطلبات والتنبيهات

### 12) عرض الطلبات في لوحة التحكم

```http
GET /api/admin/orders
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260611120000-AB12",
      "customer_name": "أحمد علي",
      "whatsapp_number": "201001112233",
      "notes": "التسليم مساءً",
      "status": "pending",
      "subtotal": "3299.00",
      "total": "3299.00",
      "items": [],
      "whatsapp_message": "فاتورة الطلب...",
      "whatsapp_url": "https://wa.me/905316924944?text=...",
      "created_at": "2026-06-11T12:00:00.000000Z",
      "updated_at": "2026-06-11T12:00:00.000000Z"
    }
  ]
}
```

### 13) عرض طلب واحد

```http
GET /api/admin/orders/{id}
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "data": {
    "id": 1,
    "order_number": "ORD-20260611120000-AB12",
    "customer_name": "أحمد علي",
    "whatsapp_number": "201001112233",
    "notes": "التسليم مساءً",
    "status": "pending",
    "subtotal": "3299.00",
    "total": "3299.00",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "هاتف ذكي تجريبي",
        "unit_price": "1499.00",
        "quantity": 2,
        "line_total": "2998.00"
      }
    ],
    "whatsapp_message": "فاتورة الطلب...",
    "whatsapp_url": "https://wa.me/905316924944?text=...",
    "created_at": "2026-06-11T12:00:00.000000Z",
    "updated_at": "2026-06-11T12:00:00.000000Z"
  }
}
```

### 14) عرض تنبيهات المخزون

```http
GET /api/admin/stock-alerts
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "هاتف ذكي تجريبي",
      "remaining_quantity": 2,
      "threshold": 2,
      "message": "تنبيه: مخزون المنتج هاتف ذكي تجريبي منخفض وأصبح 2 قطعة.",
      "is_resolved": false,
      "created_at": "2026-06-11T12:00:00.000000Z",
      "updated_at": "2026-06-11T12:00:00.000000Z"
    }
  ]
}
```

---

## مسارات الأدمن للمستخدمين

### 15) عرض جميع المدراء

```http
GET /api/admin/users
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "data": [
    {
      "id": 1,
      "full_name": "مدير المتجر",
      "email": "admin@store.com",
      "created_at": "2026-06-11T12:00:00.000000Z"
    }
  ]
}
```

### 16) إضافة مدير جديد

```http
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json
```

**مثال الطلب JSON:**

```json
{
  "full_name": "اسم المدير",
  "email": "newadmin@store.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "لقد تم انشاء الحساب بنجاح.",
  "admin": {
    "id": 2,
    "full_name": "اسم المدير",
    "email": "newadmin@store.com",
    "created_at": "2026-06-11T16:00:00.000000Z"
  }
}
```

### 17) تعديل بيانات مدير

```http
PUT /api/admin/users/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**مثال الطلب JSON:**

```json
{
  "full_name": "اسم المدير الجديد",
  "email": "newadmin@store.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم تحديث بيانات المستخدم بنجاح.",
  "admin": {
    "id": 2,
    "full_name": "اسم المدير الجديد",
    "email": "newadmin@store.com",
    "created_at": "2026-06-11T16:00:00.000000Z"
  }
}
```

**ملاحظات:**

- يمكنك إرسال `full_name` فقط أو `email` فقط أو الكل معًا.
- إذا أرسلت `password` فلابد من إرسال `password_confirmation` أيضًا.
- عند تغيير كلمة المرور تُحذف جميع رموز الوصول الخاصة بهذا الحساب.

### 18) حذف مدير

```http
DELETE /api/admin/users/{id}
Authorization: Bearer {token}
```

**مثال الاستجابة JSON:**

```json
{
  "message": "تم حذف المستخدم بنجاح."
}
```

---

## ملخص المسارات

| # | Method | Endpoint | المصادقة | الوصف |
|---|--------|----------|----------|-------|
| 1 | GET | `/api/products` | — | عرض جميع المنتجات |
| 2 | GET | `/api/products/{id}` | — | تفاصيل منتج |
| 3 | POST | `/api/orders` | — | إنشاء طلب من السلة |
| 4 | POST | `/api/admin/login` | — | تسجيل الدخول |
| 5 | POST | `/api/admin/register` | — | إنشاء أدمن جديد |
| 6 | GET | `/api/admin/me` | Bearer | بيانات الأدمن الحالي |
| 7 | POST | `/api/admin/logout` | Bearer | تسجيل الخروج |
| 8 | GET | `/api/admin/products` | Bearer | عرض المنتجات |
| 9 | POST | `/api/admin/products` | Bearer | إضافة منتج |
| 10 | PUT | `/api/admin/products/{id}` | Bearer | تعديل منتج |
| 11 | DELETE | `/api/admin/products/{id}` | Bearer | حذف منتج |
| 12 | GET | `/api/admin/orders` | Bearer | عرض الطلبات |
| 13 | GET | `/api/admin/orders/{id}` | Bearer | تفاصيل طلب |
| 14 | GET | `/api/admin/stock-alerts` | Bearer | عرض تنبيهات المخزون |
| 15 | GET | `/api/admin/users` | Bearer | عرض المدراء |
| 16 | POST | `/api/admin/users` | Bearer | إضافة مدير |
| 17 | PUT | `/api/admin/users/{id}` | Bearer | تعديل بيانات المدير |
| 18 | DELETE | `/api/admin/users/{id}` | Bearer | حذف مدير |

---

## ملاحظات للمطورين

1. **رفع الصور:** تأكد من تنفيذ `php artisan storage:link` لعرض الصور عبر `image_url`.
2. **CORS:** اضبط إعدادات CORS في Laravel إذا كانت الواجهة الأمامية على نطاق مختلف.
3. **طلب PUT مع ملفات:** بعض العملاء لا يدعمون `multipart/form-data` مع PUT؛ يمكن استخدام `_method=PUT` عبر POST إذا لزم الأمر.
4. **زر واتس أب:** استخدم قيمة `whatsapp_url` مباشرة في الواجهة لفتح المحادثة.
5. **المخزون:** يتم خصم `quantity` تلقائياً عند إنشاء الطلب، ويظهر تنبيه إذا أصبح المخزون `2` أو أقل.
