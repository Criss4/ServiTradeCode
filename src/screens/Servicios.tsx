import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore';

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  independienteId: string;
  proveedorNombre?: string;
}

interface Usuario {
  name: string;
  lastName: string;
}

const Servicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const serviciosSnapshot = await getDocs(collection(db, 'services'));
        const serviciosList: Servicio[] = [];

        // Obtener todos los servicios y sus independientes paralelamente
        const serviciosData = await Promise.all(
          serviciosSnapshot.docs.map(async (doc) => {
            const data = doc.data() as Servicio;
            const independienteRef = firestoreDoc(db, 'users', data.independienteId);
            const independienteSnap = await getDoc(independienteRef);

            let proveedorNombre = 'Desconocido';
            if (independienteSnap.exists()) {
              const independienteData = independienteSnap.data() as Usuario;
              proveedorNombre = `${independienteData.name || 'Nombre desconocido'} ${independienteData.lastName || ''}`;
            }

            return {
              id: doc.id,
              nombre: data.nombre,
              descripcion: data.descripcion,
              precio: data.precio,
              independienteId: data.independienteId,
              proveedorNombre,
            };
          })
        );

        setServicios(serviciosData);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    };

    fetchServicios();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Descripción: {item.descripcion}</Text>
            <Text>Precio: {item.precio}</Text>
            <Text>Proveedor: {item.proveedorNombre}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default Servicios;
