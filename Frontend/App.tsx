import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import apiClient from './src/services/api';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import LessonDetailScreen from './src/screens/LessonDetailScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import RevisionScreen from './src/screens/RevisionScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3498db',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CoursesList"
        component={CoursesScreen}
        options={{ title: 'Mes Cours' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'Détails du cours' }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'Contenu de la leçon' }}
      />
      <Stack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ title: 'Exercice' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ecf0f1',
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="AssistantTab"
        component={ChatScreen}
        options={{
          title: 'Assistant',
          tabBarLabel: 'Assistant',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesStack}
        options={{
          title: 'Cours',
          tabBarLabel: 'Cours',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="RevisionTab"
        component={RevisionScreen}
        options={{
          title: 'Révision',
          tabBarLabel: 'Révision',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔄</Text>,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          title: 'Progrès',
          tabBarLabel: 'Progrès',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'red' }}>Une erreur critique est survenue</Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>{this.state.error?.toString()}</Text>
          <Text style={{ color: 'gray' }}>Veuillez redémarrer l'application.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const { isLoading, user, restoreToken } = useAuthStore();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    console.log('[App] Mounting...');
    restoreToken();

    // Ping backend to verify connection
    apiClient.get('users/health/')
      .then((res) => {
        console.log('[App] ✅ Backend connecté:', res.data);
        setBackendStatus('connected');
      })
      .catch((err) => {
        console.error('[App] ❌ Backend non joignable:', err.message);
        setBackendStatus('error');
      });
  }, []);

  console.log('[App] Render - User:', user ? user.email : 'Non connecté', 'Loading:', isLoading, 'Backend:', backendStatus);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Chargement de l'application...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      <ErrorBoundary>
        <NavigationContainer>
          {user ? (
            <MainTabs />
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </ErrorBoundary>
    </View>
  );
}
