import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth, db } from '../firebaseConfig';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserContext, mapFirebaseUserToAppUser } from '../context/UserContext';
import { doc, getDoc } from 'firebase/firestore';

// Ajuste en el tipo de navegación para ser más genérico y evitar el error
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  userType: string;
  onForgotPasswordPress: () => void;
  onRegisterPress: () => void;
}

const Login: React.FC<Props> = ({ userType, onForgotPasswordPress, onRegisterPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useUserContext();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Consultar la información adicional del usuario en Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const appUser = mapFirebaseUserToAppUser(user, {
            name: userData.name,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            userType: userData.userType,
            businessName: userData.businessName,
            businessDescription: userData.businessDescription,
            labor: userData.labor,
          });

          setUser(appUser);

          // Navegar según el tipo de usuario
          if (userType === 'Cliente') {
            navigation.navigate('Menu');
          } else {
            navigation.navigate('Menu'); // Ajusta la navegación según sea necesario
          }
        } else {
          Alert.alert('Error', 'No se encontró la información del usuario en Firestore.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Text style={styles.linkText} onPress={onForgotPasswordPress}>
        ¿Olvidaste tu contraseña?
      </Text>
      <Text style={styles.linkText} onPress={onRegisterPress}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
