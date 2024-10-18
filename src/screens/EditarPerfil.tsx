import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { useUserContext } from '../context/UserContext'; // Importa el contexto del usuario
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native'; // Hook correcto para la navegación
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';  // Importa los tipos de RootStackParamList

type EditarPerfilNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditarPerfil'>;

const EditarPerfil: React.FC = () => {
  const { user, setUser } = useUserContext(); // Obtener el contexto del usuario
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [labor, setLabor] = useState('');

  const navigation = useNavigation<EditarPerfilNavigationProp>(); // Hook correcto para la navegación

  // Cargar los datos del usuario al montar la pantalla
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phoneNumber || '');
      if (user.userType === 'Emprendedor') {
        setBusinessName(user.businessName || '');
        setBusinessDescription(user.businessDescription || '');
      }
      if (user.userType === 'Independiente') {
        setLabor(user.labor || '');
      }
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert('Error', 'No se encontró al usuario autenticado.');
      return;
    }

    try {
      // Actualizar los datos del usuario en Firestore utilizando el UID en lugar del email
      const userRef = doc(db, 'users', user.uid); // Cambiado a user.uid
      const updatedUserData = {
        name,
        lastName,
        phoneNumber,
        ...(user.userType === 'Emprendedor' && { businessName, businessDescription }),
        ...(user.userType === 'Independiente' && { labor }),
      };

      await updateDoc(userRef, updatedUserData);

      // Actualizar el contexto del usuario
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          ...updatedUserData,
          email: prevUser.email, // Aseguramos que el email siga siendo un string
          userType: prevUser.userType, // Aseguramos que el tipo de usuario también se mantenga
        };
      });

      Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
      navigation.navigate('Menu');  // Redirigir al menú
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
    }
  };

  return (
    <View style={styles.container}>
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
        placeholder="Teléfono"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {user?.userType === 'Emprendedor' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre de Emprendimiento"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción de Emprendimiento"
            value={businessDescription}
            onChangeText={setBusinessDescription}
          />
        </>
      )}

      {user?.userType === 'Independiente' && (
        <TextInput
          style={styles.input}
          placeholder="Labor"
          value={labor}
          onChangeText={setLabor}
        />
      )}

      <Button title="GUARDAR CAMBIOS" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default EditarPerfil;


