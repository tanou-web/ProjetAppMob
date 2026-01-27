# 🚀 Configuration de l'Application Intelligent Tutor

## ✅ Backend Configuration

### Démarrer le serveur Django:
```bash
cd /home/tanou/Bur/projetWeb/intelligent_tutor
python manage.py runserver 8000
```

**URL API:** `http://127.0.0.1:8000/api/`

### Credentials de test:
- **Admin:** admin@example.com / admin123
- **Élèves de test:** student1-5@example.com / student123

---

## ✅ Frontend Configuration

### Pré-requis:
- Node.js 18+
- Expo CLI

### Installation et Lancement:
```bash
cd /home/tanou/Bur/projetWeb/Frontend
npm install
npx expo run web  # Pour le web (localhost:19006)
# ou
npx expo run ios  # Pour iOS
npx expo run android  # Pour Android
```

---

## 🔧 API Endpoints Principaux

### Authentication:
- **POST** `/api/token/` - Login (email + password)
- **POST** `/api/users/` - Register (signup)
- **POST** `/api/users/google_login/` - Google Authentication
- **GET** `/api/users/profile/` - Get current user profile

### Courses:
- **GET** `/api/courses/courses/` - List all courses (paginated)
- **GET** `/api/courses/courses/{id}/` - Get course details
- **POST** `/api/courses/courses/{id}/enroll/` - Enroll in course
- **GET** `/api/courses/courses/my_courses/` - My enrolled courses

### Lessons:
- **GET** `/api/courses/lessons/` - List lessons

### Exercises:
- **GET** `/api/exercises/exercises/` - List exercises by lesson
- **GET** `/api/exercises/exercises/{id}/` - Get exercise details
- **POST** `/api/exercises/attempts/submit/` - Submit exercise answer

### Recommendations:
- **GET** `/api/recommendations/recommend/` - Get personalized recommendations
- **GET** `/api/recommendations/models/` - Get model status

---

## 📊 Database Stats

**Current Data:**
- 37 Courses
- 171 Lessons (FASO curriculum complete)
- 18 Exercises
- 4 ML Models trained (recommendation, performance, learning_style, difficulty)
- 1 Admin + 5 Test Students

---

## 🎯 Test Registration

**Using curl:**
```bash
curl http://localhost:8000/api/users/ -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"password123",
    "password_confirm":"password123",
    "first_name":"Test",
    "last_name":"User",
    "role":"student",
    "level":"primary_cm1",
    "phone":"+226XXXXXXXXX"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 7,
  "email": "test@test.com",
  "first_name": "Test",
  "last_name": "User",
  "role": "student",
  "level": "primary_cm1",
  "phone": "+226XXXXXXXXX"
}
```

---

## 🔑 Important Notes

### Level Values (must match):
- `primary_cp1`, `primary_cp2`, `primary_ce1`, `primary_ce2`, `primary_cm1`, `primary_cm2`
- `secondary_6eme`, `secondary_5eme`, `secondary_4eme`, `secondary_3eme`
- `secondary_2nde`, `secondary_1ere`, `secondary_tle`

### CORS Configuration:
Already configured in Django settings for:
- Localhost (development)
- Expo client connections

### Password Requirements:
- Minimum 8 characters
- Must match confirmation

---

## 🐛 Troubleshooting

### "Cannot create account"
✅ Fixed: Level values now match backend (primary_cm1 instead of primary_5)
✅ Fixed: Added role='student' parameter

### "API connection error"
- Ensure Django server is running on port 8000
- Check API_BASE_URL in Frontend/src/services/api.ts
- Default: `http://127.0.0.1:8000/api/`

### "Missing required field"
- Check that all fields are sent: email, password, password_confirm, first_name, last_name, role, level, phone
- Validate level value matches backend choices

---

## 📱 Next Steps

1. ✅ Backend is fully configured
2. ✅ Frontend level values are fixed
3. ✅ Signup endpoint is working
4. **TODO:** Start Frontend dev server and test registration

Happy Coding! 🎉
