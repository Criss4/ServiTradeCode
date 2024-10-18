import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserContext } from '../context/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

type PerfilNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfil'>;

interface Props {
  navigation: PerfilNavigationProp;
}

const Perfil: React.FC<Props> = ({ navigation }) => {
  const { user } = useUserContext();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser?.uid) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            Alert.alert('Error', 'No se encontró la información del usuario en la base de datos.');
          }
        } else {
          Alert.alert('Error', 'El usuario no tiene un UID asociado.');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    if (!password || !auth.currentUser || !auth.currentUser.email) {
      Alert.alert('Error', 'Por favor, ingresa tu contraseña.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await auth.currentUser.delete();

      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada.');
      setShowModal(false);
      navigation.navigate('Home'); // Redirigir al inicio después de la eliminación
    } catch (error: any) {
      console.error('Error al eliminar la cuenta:', error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Es necesario que vuelvas a iniciar sesión para eliminar la cuenta.');
      } else {
        Alert.alert('Error', 'Hubo un problema al eliminar tu cuenta.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando información del usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text>Nombre: {userData.name}</Text>
          <Text>Apellido: {userData.lastName}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Teléfono: {userData.phoneNumber}</Text>

          <Button title="Modificar datos" onPress={() => navigation.navigate('EditarPerfil')} />
          <Button title="Eliminar cuenta" onPress={() => setShowModal(true)} />

          {/* Modal para ingresar la contraseña */}
          <Modal
            visible={showModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Ingresa tu contraseña para confirmar:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <View style={styles.buttonRow}>
                  <Button title="Cancelar" onPress={() => setShowModal(false)} />
                  <Button title="Eliminar" onPress={handleDeleteAccount} />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text>No se encontró información del usuario.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Perfil;
