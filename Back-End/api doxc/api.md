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

### آلية العمل

1. أرسل بيانات الدخول إلى `POST /api/admin/login`.
2. استلم `token` من الاستجابة.
3. أرفق الرمز في كل طلب محمي:

```http
Authorization: Bearer {token}
```

### حساب المدير الافتراضي (بعد `migrate --seed`)

| الحقل | القيمة |
|-------|--------|
| البريد الإلكتروني | `admin@store.com` |
| كلمة المرور | `password123` |

### انتهاء صلاحية الرمز

- الرمز يبقى صالحاً حتى **تسجيل الخروج** (`POST /api/admin/logout`) أو **تغيير كلمة المرور** للمستخدم.
- عند تغيير كلمة مرور مدير، تُحذف جميع رموزه تلقائياً.

---

## تنسيق الاستجابات

### استجابة ناجحة (مورد واحد)

```json
{
  "message": "رسالة توضيحية (اختياري)",
  "admin": { ... }
}
```

### استجابة ناجحة (قائمة موارد)

```json
{
  "data": [
    { ... },
    { ... }
  ]
}
```

### أخطاء التحقق (422)

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["حقل البريد الإلكتروني مطلوب."],
    "password": ["حقل كلمة المرور مطلوب."]
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
  "message": "No query results for model [App\\Models\\Product] {id}"
}
```

---

## نماذج البيانات (Schemas)

### Admin

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | المعرف |
| `full_name` | string | الاسم الكامل |
| `email` | string | البريد الإلكتروني |
| `created_at` | string (ISO 8601) | تاريخ الإنشاء |

### Product

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | المعرف |
| `product_name` | string | اسم المنتج (حد أقصى 255 حرف) |
| `description` | string | وصف المنتج |
| `price` | string/number | السعر (منزلتان عشريتان) |
| `image_url` | string | رابط الصورة الكامل |
| `created_at` | string (ISO 8601) | تاريخ الإنشاء |
| `updated_at` | string (ISO 8601) | تاريخ آخر تحديث |

### Order

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | المعرف |
| `order_number` | string | رقم الطلب |
| `customer_name` | string | اسم العميل |
| `whatsapp_number` | string | رقم واتس أب |
| `notes` | string/null | ملاحظات إضافية |
| `status` | string | حالة الطلب |
| `subtotal` | string/number | الإجمالي الفرعي |
| `total` | string/number | الإجمالي النهائي |
| `items` | array | عناصر الطلب |
| `whatsapp_message` | string | نص الفاتورة |
| `whatsapp_url` | string | رابط واتس أب الجاهز |
| `created_at` | string (ISO 8601) | تاريخ الإنشاء |
| `updated_at` | string (ISO 8601) | تاريخ آخر تحديث |

### Order Item

| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | المعرف |
| `product_id` | integer/null | معرف المنتج |
| `product_name` | string | اسم المنتج وقت إنشاء الطلب |
| `unit_price` | string/number | سعر القطعة |
| `quantity` | integer | الكمية |
| `line_total` | string/number | إجمالي السطر |

---

## نقاط النهاية العامة (بدون مصادقة)

### 1. عرض جميع المنتجات

```http
GET /api/products
```

**المصادقة:** غير مطلوبة

**الاستجابة `200 OK`:**

```json
{
  "data": [
    {
      "id": 1,
      "product_name": "منتج تجريبي",
      "description": "وصف المنتج",
      "price": "99.99",
      "image_url": "http://localhost:8000/storage/products/example.jpg",
      "created_at": "2026-06-10T12:00:00.000000Z",
      "updated_at": "2026-06-10T12:00:00.000000Z"
    }
  ]
}
```

---

### 2. عرض تفاصيل منتج

```http
GET /api/products/{id}
```

**المصادقة:** غير مطلوبة

**المعاملات:**

| الاسم | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | معرف المنتج |

**الاستجابة `200 OK`:**

```json
{
  "data": {
    "id": 1,
    "product_name": "منتج تجريبي",
    "description": "وصف المنتج",
    "price": "99.99",
    "image_url": "http://localhost:8000/storage/products/example.jpg",
    "created_at": "2026-06-10T12:00:00.000000Z",
    "updated_at": "2026-06-10T12:00:00.000000Z"
  }
}
```

---

## نقاط نهاية المدير — المصادقة

### 3. تسجيل الدخول

```http
POST /api/admin/login
Content-Type: application/json
```

**المصادقة:** غير مطلوبة

**جسم الطلب:**

```json
{
  "email": "admin@store.com",
  "password": "password123"
}
```

**قواعد التحقق:**

| الحقل | القواعد |
|-------|---------|
| `email` | مطلوب، بريد إلكتروني صالح |
| `password` | مطلوب، نص |

**الاستجابة `200 OK`:**

```json
{
  "message": "تم تسجيل الدخول بنجاح.",
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "Bearer",
  "admin": {
    "id": 1,
    "full_name": "مدير النظام",
    "email": "admin@store.com",
    "created_at": "2026-06-10T12:00:00.000000Z"
  }
}
```

**خطأ بيانات الدخول `422`:**

```json
{
  "message": "بيانات الدخول غير صحيحة.",
  "errors": {
    "email": ["بيانات الدخول غير صحيحة."]
  }
}
```

---

### 4. بيانات المدير الحالي

```http
GET /api/admin/me
Authorization: Bearer {token}
```

**الاستجابة `200 OK`:**

```json
{
  "admin": {
    "id": 1,
    "full_name": "مدير النظام",
    "email": "admin@store.com",
    "created_at": "2026-06-10T12:00:00.000000Z"
  }
}
```

---

### 5. تسجيل الخروج

```http
POST /api/admin/logout
Authorization: Bearer {token}
```

**الاستجابة `200 OK`:**

```json
{
  "message": "تم تسجيل الخروج بنجاح."
}
```

---

## نقاط نهاية المدير — المنتجات

> جميع الطلبات التالية تتطلب `Authorization: Bearer {token}`

### 6. عرض المنتجات (لوحة التحكم)

```http
GET /api/admin/products
Authorization: Bearer {token}
```

**الاستجابة:** نفس صيغة `GET /api/products`

---

### 7. إضافة منتج

```http
POST /api/admin/products
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**حقول النموذج (Form Data):**

| الحقل | النوع | مطلوب | القواعد |
|-------|-------|-------|---------|
| `product_name` | string | نعم | حد أقصى 255 حرف |
| `description` | string | نعم | — |
| `price` | number | نعم | رقم ≥ 0 |
| `image` | file | نعم | صورة، حد أقصى 5 ميجابايت |

**مثال (cURL):**

```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer {token}" \
  -F "product_name=هاتف ذكي" \
  -F "description=هاتف بمواصفات عالية" \
  -F "price=1500" \
  -F "image=@/path/to/image.jpg"
```

**الاستجابة `201 Created`:**

```json
{
  "message": "تم إضافة المنتج بنجاح.",
  "product": {
    "id": 2,
    "product_name": "هاتف ذكي",
    "description": "هاتف بمواصفات عالية",
    "price": "1500.00",
    "image_url": "http://localhost:8000/storage/products/xxxxx.jpg",
    "created_at": "2026-06-10T14:00:00.000000Z",
    "updated_at": "2026-06-10T14:00:00.000000Z"
  }
}
```

---

### 8. تعديل منتج

```http
PUT /api/admin/products/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**المعاملات:**

| الاسم | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | معرف المنتج |

**حقول النموذج (كلها اختيارية — أرسل ما تريد تعديله فقط):**

| الحقل | النوع | القواعد |
|-------|-------|---------|
| `product_name` | string | حد أقصى 255 حرف |
| `description` | string | — |
| `price` | number | رقم ≥ 0 |
| `image` | file | صورة، حد أقصى 5 ميجابايت |

> عند رفع صورة جديدة، تُحذف الصورة القديمة تلقائياً.

**الاستجابة `200 OK`:**

```json
{
  "message": "تم تحديث المنتج بنجاح.",
  "product": {
    "id": 2,
    "product_name": "هاتف ذكي محدّث",
    "description": "وصف محدّث",
    "price": "1400.00",
    "image_url": "http://localhost:8000/storage/products/yyyyy.jpg",
    "created_at": "2026-06-10T14:00:00.000000Z",
    "updated_at": "2026-06-10T15:00:00.000000Z"
  }
}
```

---

### 9. حذف منتج

```http
DELETE /api/admin/products/{id}
Authorization: Bearer {token}
```

**المعاملات:**

| الاسم | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | معرف المنتج |

**الاستجابة `200 OK`:**

```json
{
  "message": "تم حذف المنتج بنجاح."
}
```

---

## الطلبات وسلة التسوق

> السلة يمكن أن تبقى في الواجهة الأمامية. عند الانتهاء، أرسل العناصر إلى API الطلبات ليتم إنشاء الفاتورة وإرجاع رابط واتس أب جاهز.

### 11. إنشاء طلب جديد

```http
POST /api/orders
Content-Type: application/json
```

**المصادقة:** غير مطلوبة

**جسم الطلب:**

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

**الاستجابة `201 Created`:**

```json
{
  "message": "تم إنشاء الطلب بنجاح.",
  "order": {
    "id": 1,
    "order_number": "ORD-20260611091500-AB12",
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
        "product_name": "هاتف ذكي",
        "unit_price": "1500.00",
        "quantity": 2,
        "line_total": "3000.00"
      }
    ],
    "whatsapp_message": "فاتورة الطلب...",
    "whatsapp_url": "https://wa.me/201001112233?text=...",
    "created_at": "2026-06-11T09:15:00.000000Z",
    "updated_at": "2026-06-11T09:15:00.000000Z"
  },
  "whatsapp_url": "https://wa.me/201001112233?text=...",
  "whatsapp_message": "فاتورة الطلب..."
}
```

**زر واتس أب:**

- اربط زر "إرسال واتس أب" بالقيمة `whatsapp_url`.
- يمكن فتح الرابط مباشرة في المتصفح أو داخل تطبيق واتس أب.

---

### 12. عرض الطلبات في لوحة التحكم

```http
GET /api/admin/orders
Authorization: Bearer {token}
```

### 13. عرض طلب واحد

```http
GET /api/admin/orders/{id}
Authorization: Bearer {token}
```

> تُحذف صورة المنتج من التخزين مع السجل.

---

## نقاط نهاية المدير — المستخدمون (المدراء)

> جميع الطلبات التالية تتطلب `Authorization: Bearer {token}`

### 10. عرض جميع المدراء

```http
GET /api/admin/users
Authorization: Bearer {token}
```

**الاستجابة `200 OK`:**

```json
{
  "data": [
    {
      "id": 1,
      "full_name": "مدير النظام",
      "email": "admin@store.com",
      "created_at": "2026-06-10T12:00:00.000000Z"
    }
  ]
}
```

---

### 11. إضافة مدير جديد

```http
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json
```

**جسم الطلب:**

```json
{
  "full_name": "اسم المدير",
  "email": "newadmin@store.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**قواعد التحقق:**

| الحقل | القواعد |
|-------|---------|
| `full_name` | مطلوب، حد أقصى 255 حرف |
| `email` | مطلوب، بريد صالح، فريد |
| `password` | مطلوب، 8 أحرف على الأقل، مع تأكيد (`password_confirmation`) |

**الاستجابة `201 Created`:**

```json
{
  "message": "تم إضافة المستخدم بنجاح.",
  "admin": {
    "id": 2,
    "full_name": "اسم المدير",
    "email": "newadmin@store.com",
    "created_at": "2026-06-10T16:00:00.000000Z"
  }
}
```

---

### 12. تعديل كلمة مرور مدير

```http
PUT /api/admin/users/{id}/password
Authorization: Bearer {token}
Content-Type: application/json
```

**المعاملات:**

| الاسم | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | معرف المدير |

**جسم الطلب:**

```json
{
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**قواعد التحقق:**

| الحقل | القواعد |
|-------|---------|
| `password` | مطلوب، 8 أحرف على الأقل، مع تأكيد |

**الاستجابة `200 OK`:**

```json
{
  "message": "تم تحديث كلمة المرور بنجاح.",
  "admin": {
    "id": 2,
    "full_name": "اسم المدير",
    "email": "newadmin@store.com",
    "created_at": "2026-06-10T16:00:00.000000Z"
  }
}
```

> تُحذف جميع رموز الوصول (tokens) الخاصة بهذا المدير بعد تغيير كلمة المرور.

---

### 13. حذف مدير

```http
DELETE /api/admin/users/{id}
Authorization: Bearer {token}
```

**المعاملات:**

| الاسم | النوع | الوصف |
|-------|-------|-------|
| `id` | integer | معرف المدير |

**الاستجابة `200 OK`:**

```json
{
  "message": "تم حذف المستخدم بنجاح."
}
```

**أخطاء محتملة `422`:**

| الحالة | الرسالة |
|--------|---------|
| حذف الحساب الحالي | `لا يمكنك حذف حسابك الحالي.` |
| آخر مدير في النظام | `لا يمكن حذف آخر مدير في النظام.` |
| مدير لديه منتجات | `لا يمكن حذف مدير لديه منتجات مرتبطة. انقل المنتجات أو احذفها أولاً.` |

---

## ملخص نقاط النهاية

| # | Method | Endpoint | المصادقة | الوصف |
|---|--------|----------|----------|-------|
| 1 | GET | `/api/products` | — | عرض جميع المنتجات |
| 2 | GET | `/api/products/{id}` | — | تفاصيل منتج |
| 3 | POST | `/api/admin/login` | — | تسجيل الدخول |
| 4 | GET | `/api/admin/me` | Bearer | بيانات المدير الحالي |
| 5 | POST | `/api/admin/logout` | Bearer | تسجيل الخروج |
| 6 | GET | `/api/admin/products` | Bearer | عرض المنتجات |
| 7 | POST | `/api/admin/products` | Bearer | إضافة منتج |
| 8 | PUT | `/api/admin/products/{id}` | Bearer | تعديل منتج |
| 9 | DELETE | `/api/admin/products/{id}` | Bearer | حذف منتج |
| 10 | GET | `/api/admin/users` | Bearer | عرض المدراء |
| 11 | POST | `/api/admin/users` | Bearer | إضافة مدير |
| 12 | PUT | `/api/admin/users/{id}/password` | Bearer | تعديل كلمة المرور |
| 13 | DELETE | `/api/admin/users/{id}` | Bearer | حذف مدير |

---

## ملاحظات للمطورين

1. **رفع الصور:** تأكد من تنفيذ `php artisan storage:link` لعرض الصور عبر `image_url`.
2. **CORS:** اضبط إعدادات CORS في Laravel إذا كانت الواجهة الأمامية على نطاق مختلف.
3. **طلب PUT مع ملفات:** بعض العملاء لا يدعمون `multipart/form-data` مع PUT؛ يمكن استخدام `_method=PUT` عبر POST إذا لزم الأمر (Laravel method spoofing).
4. **الترتيب:** قوائم المنتجات والمدراء مرتبة من الأحدث إلى الأقدم (`latest`).
