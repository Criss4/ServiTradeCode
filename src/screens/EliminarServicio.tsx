import React, {useContext} from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useUserContext } from '../context/UserContext';

type PerfilIndependienteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PerfilIndependiente'>;

interface Props {
  navigation: PerfilIndependienteNavigationProp;
  servicioId: string; // ID del servicio a eliminar
}

const EliminarServicio: React.FC<Props> = ({ navigation, servicioId }) => {
  const { user } = useUserContext();

  const handleDeleteService = async () => {
    const password = prompt('Ingresa tu contraseña para confirmar la eliminación');

    if (!password || !auth.currentUser || !auth.currentUser.email) {
      Alert.alert('Error', 'No se pudo verificar la cuenta.');
      return;
    }

    try {
      // Reautenticación del usuario antes de la eliminación
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Procedemos a eliminar el servicio
      await deleteDoc(doc(db, 'services', servicioId));

      Alert.alert('Éxito', 'Servicio eliminado correctamente.');
      if (user?.uid) {
        navigation.navigate('PerfilIndependiente', { independienteId: user.uid });
      } else {
        Alert.alert('Error', 'No se ha encontrado el ID del independiente.');
      }
          } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el servicio.');
    }
  };

  return (
    <View>
      <Button title="Eliminar Servicio" onPress={handleDeleteService} />
    </View>
  );
};

export default EliminarServicio;
