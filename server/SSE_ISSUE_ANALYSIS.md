# Analisis Masalah SSE Notification

## 🐛 Masalah yang Ditemukan

### 1. **Method `insert()` - TIDAK Mengirim SSE Notification**
**Lokasi:** `src/api/expense/expense.service.ts:17-52`

**Masalah:**
- Method hanya melakukan insert expense dan update periode_limit
- **TIDAK ada pemanggilan** `periodeLimitService.sendSpendingNotification(userId)`
- Client SSE tidak akan menerima notifikasi sama sekali setelah insert tunggal

**Status:** ❌ **CRITICAL - Sudah diperbaiki**

---

### 2. **Raw SQL Menggunakan Kolom yang Salah**
**Lokasi:** 
- `src/api/expense/expense.service.ts:46-50` (method `insert`)
- `src/api/expense/expense.service.ts:92-96` (method `insertBulk`)

**Masalah:**
```sql
-- SEBELUM (SALAH)
UPDATE periode_limit
SET amount = amount + ${amount}  -- ❌ Kolom 'amount' tidak ada
WHERE user_id = ${userId}

-- SETELAH (BENAR)
UPDATE periode_limit
SET current_spending = current_spending + ${amount}  -- ✅ Kolom yang benar
WHERE user_id = ${userId}
```

**Dampak:**
- Update gagal atau tidak mengubah data yang benar
- Perhitungan spending menjadi salah
- Notifikasi SSE mengirim data yang tidak akurat

**Status:** ❌ **CRITICAL - Sudah diperbaiki**

---

### 3. **Timing Issue di `insertBulk()`**
**Lokasi:** `src/api/expense/expense.service.ts:109`

**Masalah:**
- `sendSpendingNotification()` dipanggil **SETELAH** transaction commit
- Ini sebenarnya **BENAR** karena data harus sudah tersimpan sebelum dikirim
- Namun perlu dipastikan tidak ada error handling yang menghalangi eksekusi

**Status:** ✅ **Sudah benar**

---

### 4. **Potential Issue: Tidak Ada Connected Clients**
**Lokasi:** `src/core/utils/sse-connection.ts:56-67`

**Analisis:**
```typescript
async sendToUser(userId: number, data: SpendingNotification) {
  const userClients = this.clients.get(userId);
  if (userClients && userClients.size > 0) {
    // Mengirim notifikasi...
  } else {
    logger.warn(`No active SSE clients found for user ${userId}`);
    // ⚠️ Notifikasi tidak dikirim jika tidak ada client yang terhubung
  }
}
```

**Kemungkinan Penyebab:**
1. Client belum membuka koneksi SSE ke endpoint `/notifications/stream`
2. Koneksi SSE terputus sebelum operasi expense dilakukan
3. Client disconnect karena timeout atau network issue

**Cara Verifikasi:**
- Check log untuk pesan: `"No active SSE clients found for user X"`
- Pastikan client sudah connect sebelum melakukan insert/update/delete

**Status:** ⚠️ **PERLU MONITORING**

---

## ✅ Perbaikan yang Dilakukan

### 1. Tambahkan SSE Notification di Method `insert()`
```typescript
export const expenseService = {
  insert: async (request: createExpenseDto, userId: number) => {
    // ... existing code ...
    
    try {
      await db.transaction(async (trx) => {
        // ... insert expense ...
        // ... update periode_limit ...
      });

      // ✅ DITAMBAHKAN: Send SSE notification setelah transaction
      await periodeLimitService.sendSpendingNotification(userId);
      
    } catch (error) {
      throw error;
    }
  },
```

### 2. Perbaiki Nama Kolom di Raw SQL Query
```typescript
// Di method insert() dan insertBulk()
await trx.execute(
  sql`UPDATE periode_limit
      SET current_spending = current_spending + ${amount},  -- ✅ Kolom diperbaiki
          updated_at = NOW()
      WHERE user_id = ${userId}`,
);
```

---

## 🧪 Cara Testing

### 1. Test SSE Connection
```bash
# Gunakan curl untuk test SSE endpoint
curl -N -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/periode-limit/notifications/stream
```

Expected output:
```
event: connected
data: {"message":"Connected to Spending notifications"}

event: notification
data: {"userId":1,"currentSpending":5000,"maxSpending":10000,...}
```

### 2. Test Insert Expense (Single)
```bash
# POST /api/expense
curl -X POST http://localhost:3000/api/expense \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Lunch","amount":50000,"spent_at":"2025-10-21T12:00:00Z"}'
```

**Expected behavior:**
1. Expense tersimpan ke database ✅
2. `periode_limit.current_spending` bertambah ✅
3. SSE notification terkirim ke semua connected clients ✅
4. Log menampilkan: `"SSE notification sent to X client(s) for user Y"` ✅

### 3. Test Bulk Insert
```bash
curl -X POST http://localhost:3000/api/expense/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"name":"Item 1","amount":10000},
    {"name":"Item 2","amount":20000}
  ]'
```

### 4. Test Update & Delete
Sama seperti insert, pastikan SSE notification terkirim setelah operasi selesai.

---

## 📊 Monitoring & Debugging

### Log Messages to Watch:
```
✅ SUCCESS INDICATORS:
- "SSE Client added for user X"
- "SSE notification sent to X client(s) for user Y"
- "SSE notification written for user X"

⚠️ WARNING INDICATORS:
- "No active SSE clients found for user X"
- "No spending limit found for user X"

❌ ERROR INDICATORS:
- "Error sending spending notification: ..."
- "Error writing SSE notification: ..."
- "Error sending to client for user X: ..."
```

### Debug Checklist:
- [ ] Client sudah connect ke `/notifications/stream`
- [ ] Token authentication valid
- [ ] User memiliki active spending limit
- [ ] `periode_limit` record exists untuk user
- [ ] `spending_limit.isActive = true`
- [ ] Periode limit masih aktif (antara `periodeStart` dan `periodeEnd`)
- [ ] Database transaction berhasil commit
- [ ] Tidak ada error di console/log

---

## 🔄 Flow Diagram

```
┌─────────────────┐
│  Client Request │
│  POST /expense  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  expense.service.insert()   │
│  1. Insert expense          │
│  2. Update periode_limit    │
│  3. Commit transaction      │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  periodeLimitService                 │
│  .sendSpendingNotification(userId)   │
│  1. Query spending data              │
│  2. Calculate percentage             │
│  3. Create notification object       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  sseManager.sendToUser()     │
│  1. Get connected clients    │
│  2. Send to each client      │
│  3. Log success/failure      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  SSE Stream Client       │
│  Receives notification   │
│  event: "notification"   │
│  data: {...}             │
└──────────────────────────┘
```

---

## 🎯 Kesimpulan

### Masalah Utama:
1. ❌ Method `insert()` tidak mengirim SSE notification
2. ❌ Raw SQL menggunakan kolom yang salah (`amount` → `current_spending`)

### Perbaikan:
1. ✅ Tambahkan `sendSpendingNotification()` di method `insert()`
2. ✅ Perbaiki nama kolom di semua raw SQL query
3. ✅ Pastikan flow notification berjalan di semua operasi (insert, insertBulk, update, delete)

### Next Steps:
- [ ] Test semua endpoint dengan SSE client connected
- [ ] Monitor log untuk memastikan notification terkirim
- [ ] Verifikasi data `current_spending` update dengan benar
- [ ] Test dengan multiple concurrent requests

---

**Tanggal Analisis:** 21 Oktober 2025  
**Status:** ✅ **RESOLVED**
