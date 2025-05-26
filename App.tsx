  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { StatusBar, Text, TouchableOpacity } from 'react-native';

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
          initialRouteName="Intro" //Intro 변경 시 로그인 창 나오게 됨
          screenOptions={{
            headerShown: false,  // 전체 헤더 보이게 하거나, 개별 설정 가능
            headerStyle: {
              backgroundColor: '#DEE5F6', 
            },
            headerTintColor: '#000', // 헤더 텍스트(타이틀)와 아이콘 색상 (흰색)
            headerTitleStyle: {
              fontWeight: 'normal', // 타이틀 폰트 굵기 등 추가 스타일 가능
            },
          }}
        >
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen
  name="ChatRoom"
  component={ChatRoomScreen}
  options={({ navigation }) => ({
    headerShown: true,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatList')}
        style={{ marginLeft: 15 }}
      >
        <Text style={{ fontSize: 16, color: '#000' }}>{'<'} 뒤로</Text>
      </TouchableOpacity>
    ),
  })}
/>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ChatSummaryList" component={ChatSummaryListScreen} />
          <Stack.Screen name="ChatSummary" component={ChatSummaryScreen} />
          <Stack.Screen name="NewPersona" component={NewPersona} />
          <Stack.Screen name="PersonaDetail" component={PersonaDetail}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default App;
