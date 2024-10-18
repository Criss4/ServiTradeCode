import React, { useState } from 'react';
import { View, Button, Alert, Modal, TextInput, StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useUserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

type PerfilEmprendedorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PerfilEmprendedor'>;

interface Props {
  productoId: string; // ID del producto a eliminar
}

const EliminarProducto: React.FC<Props> = ({ productoId }) => {
  const { user } = useUserContext();
  const navigation = useNavigation<PerfilEmprendedorNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleDeleteProduct = async () => {
    if (!password || !auth.currentUser || !auth.currentUser.email) {
      Alert.alert('Error', 'No se pudo verificar la cuenta.');
      return;
    }

    try {
      // Reautenticación del usuario antes de la eliminación
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Procedemos a eliminar el producto
      await deleteDoc(doc(db, 'products', productoId));

      Alert.alert('Éxito', 'Producto eliminado correctamente.');
      if (user?.uid) {
        navigation.navigate('PerfilEmprendedor', { emprendedorId: user.uid });
      } else {
        Alert.alert('Error', 'No se ha encontrado el ID del emprendedor.');
      }

      setModalVisible(false);
      
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto.');
      setModalVisible(false);
    }
  };

  return (
    <View>
      <Button title="Eliminar Producto" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Confirma tu contraseña para eliminar el producto:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Confirmar Eliminación" onPress={handleDeleteProduct} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
});

export default EliminarProducto;
