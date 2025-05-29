import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import IntroScreen from './pages/IntroScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignUpScreen';
import NewPersona from './pages/NewPersona';
import PersonaDetail from './pages/PersonaDetail';  
import ChatListScreen from './pages/ChatListScreen';
import ChatRoomScreen from './pages/ChatRoomScreen';
import ChatSummaryListScreen from './pages/ChatSummaryListScreen';
import ChatSummaryScreen from './pages/ChatSummaryScreen';
import profileSetting from './pages/profileSetting'

import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <>
      <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator
          initialRouteName="NewPersona"
          //initialRouteName="Intro"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="NewPersona"
            component={NewPersona}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#DEE5F6',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'normal',
              },
              headerTitle: () => null,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoomScreen}
            options={({ navigation, route }) => ({
              title: route.params?.personaName ?? '채팅방', // 여기만 사용
              headerTitleAlign: 'center', // 이제 중앙 정렬이 동작함
              headerShown: true,
              headerStyle: {
                backgroundColor: '#DEE5F6',
                elevation: 0,
                shadowOpacity: 0, 
                borderBottomWidth: 0,
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'normal',
              },
              headerTitle: () => (
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                  {route.params?.personaName ?? '채팅방'}
                </Text>
              ),
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
          <Stack.Screen
            name="profileSetting"
            component={profileSetting}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '이미지 수정하기',
              headerTitleAlign: 'center',
              headerStyle:{
                backgroundColor: '#DEE5F6',
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={{ paddingHorizontal: 15 }}
                  onPress={() => navigation.navigate('NewPersona')}
                >
                  <Text style={{ color: '#007aff', fontSize: 17 }}>뒤로</Text>
                </TouchableOpacity>
              ),
              headerRight: () => <View style={{ width: 50 }} /> 
            })}
          />
          <Stack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={{
              headerShown: true,
              headerTitle: '',
              headerTitleAlign: 'center',
              headerLeft: () => null,
              headerStyle: {
                backgroundColor: '#DEE5F6',
              },
            }}
          />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} 
          options={({ navigation }) => ({
            headerShown: true, 
            headerTitle: '',
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login', {})}
                style={{ marginLeft: 15 }}
              >
                <Text style={{ fontSize: 16, color: '#000' }}>{'<'} 로그인하기</Text>
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#DEE5F6',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
          })}
        />
          <Stack.Screen name="ChatSummaryList" component={ChatSummaryListScreen} />
          <Stack.Screen name="ChatSummary" component={ChatSummaryScreen} />
          <Stack.Screen
              name="PersonaDetail"
              component={PersonaDetail}
              options={({ navigation }) => ({
                headerShown: true, 
                headerTitle: '',
                headerBackTitleVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NewPersona')}
                    style={{ marginLeft: 15 }}
                  >
                    <Text style={{ fontSize: 16, color: '#000' }}>{'<'}</Text>
                  </TouchableOpacity>
                ),
                headerStyle: {
                  backgroundColor: '#fff',
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
              })}
            />

        </Stack.Navigator>
      </NavigationContainer>

      {/* ✅ 여기에 Toast 추가 */}
      <Toast />
    </>
  );
}

export default App;