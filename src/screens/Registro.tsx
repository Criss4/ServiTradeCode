import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type RegistroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registro'>;

interface Props {
  navigation: RegistroNavigationProp;
}

const Registro: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Solo los 8 dígitos del número de celular
  const [userType, setUserType] = useState<'Cliente' | 'Emprendedor' | 'Independiente'>('Cliente');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [labor, setLabor] = useState('');

  const handleRegister = async () => {
    // Validaciones básicas
    if (!name || !lastName || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (phoneNumber.length !== 8 || isNaN(Number(phoneNumber))) {
      Alert.alert('Error', 'El número de celular debe tener 8 dígitos numéricos.');
      return;
    }

    if (userType === 'Emprendedor' && (!businessName || !businessDescription)) {
      Alert.alert('Error', 'Debes proporcionar el nombre y la descripción de tu emprendimiento.');
      return;
    }

    if (userType === 'Independiente' && !labor) {
      Alert.alert('Error', 'Debes especificar tu labor como independiente.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear documento del usuario en Firestore
      const userRef = doc(db, 'users', user.uid); // Usar UID en vez de email
      const userData: any = {
        uid: user.uid, // Guardar el UID del usuario aquí
        name,
        lastName,
        email,
        phoneNumber: '+569' + phoneNumber, // Agregar prefijo del formato chileno
        userType,
      };

      if (userType === 'Emprendedor') {
        userData.businessName = businessName;
        userData.businessDescription = businessDescription;
      }

      if (userType === 'Independiente') {
        userData.labor = labor;
      }

      // Guardar datos del usuario en Firestore
      await setDoc(userRef, userData);

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada exitosamente.');
      navigation.navigate('Home'); // Navegar al login del cliente u otra pantalla
    } catch (error: any) {
      Alert.alert('Error en el registro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <View style={styles.phoneContainer}>
        <Text style={styles.phonePrefix}>+569</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Número de celular (8 dígitos)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
          maxLength={8} // Limitar a 8 dígitos
        />
      </View>

      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue as 'Cliente' | 'Emprendedor' | 'Independiente')}
        style={styles.picker}
      >
        <Picker.Item label="Cliente" value="Cliente" />
        <Picker.Item label="Emprendedor" value="Emprendedor" />
        <Picker.Item label="Independiente" value="Independiente" />
      </Picker>

      {userType === 'Emprendedor' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre de Emprendimiento"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción del Emprendimiento"
            value={businessDescription}
            onChangeText={setBusinessDescription}
          />
        </>
      )}

      {userType === 'Independiente' && (
        <TextInput
          style={styles.input}
          placeholder="Labor (Carpintero, Jardinero, etc.)"
          value={labor}
          onChangeText={setLabor}
        />
      )}

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  phonePrefix: {
    fontSize: 16,
    paddingHorizontal: 5,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
});

export default Registro;
