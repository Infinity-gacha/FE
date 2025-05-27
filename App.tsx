  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { StatusBar } from 'react-native';

  import IntroScreen from './pages/IntroScreen';
  import LoginScreen from './pages/LoginScreen';
  import SignupScreen from './pages/SignUpScreen';
  import NewPersona from './pages/NewPersona';
  import PersonaDetail from './pages/PersonaDetail';  
  import ChatListScreen from './pages/ChatListScreen';
  import ChatRoomScreen from './pages/ChatRoomScreen';
  import ChatSummaryListScreen from './pages/ChatSummaryListScreen';
  import ChatSummaryScreen from './pages/ChatSummaryScreen';

  import { RootStackParamList } from './types'; // 타입 정의

  // Stack Navigator 생성
  const Stack = createStackNavigator<RootStackParamList>();

  function App(): React.JSX.Element {
    return (
      <NavigationContainer>
        {/* 상태바 숨기기 */}
        <StatusBar hidden={true} />

        {/* 모든 화면에서 상단 헤더 숨기기 */}
        <Stack.Navigator
          initialRouteName="NewPersona"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ChatSummaryList" component={ChatSummaryListScreen} />
          <Stack.Screen name="ChatSummary" component={ChatSummaryScreen} />
          <Stack.Screen name="NewPersona" component={NewPersona} />
          <Stack.Screen name="PersonaDetail" component={PersonaDetail} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default App;
