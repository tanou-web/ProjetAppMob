"""
URL configuration for intelligent_tutor project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.serializers import MyTokenObtainPairSerializer

from rest_framework.response import Response
from apps.users.serializers import UserSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        
        # Refresh user from database to get latest data (e.g., level changes)
        user.refresh_from_db()
        print(f"[TOKEN_LOGIN] User {user.email} logging in with level: {user.level}")
        
        data = serializer.validated_data
        data['user'] = UserSerializer(user).data
        return Response(data)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('apps.users.urls')),
    path('api/courses/', include('apps.courses.urls')),
    path('api/exercises/', include('apps.exercises.urls')),
    path('api/progress/', include('apps.progress.urls')),
    path('api/recommendations/', include('apps.recommendations.urls')),
    path('api/', include('apps.ai.urls')),  # AI endpoints
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from django.http import HttpResponse

def root_view(request):
    html = """
    <html>
        <head>
            <title>Intelligent Tutor Backend</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding-top: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                h1 { color: #2c3e50; }
                p { color: #7f8c8d; }
                a { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                a:hover { background-color: #2980b9; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>✅ Backend is Running!</h1>
                <p>This is the API server. To use the application, please visit the Frontend.</p>
                <a href="http://localhost:8081">Go to App (Frontend)</a>
                <p style="font-size: 0.8em; margin-top: 40px;">If the link doesn't work, ensure you have started the frontend with <code>npx expo start</code>.</p>
            </div>
        </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns.append(path('', root_view))
