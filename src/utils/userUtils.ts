import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firestore

export const verifyUserType = async (email: string, userType: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', email); // Asegúrate de que 'users' use el identificador correcto (email o UID)
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData?.tipoUsuario === userType; // Cambia 'tipoUsuario' según el campo en tu base de datos
    }
    return false;
  } catch (error) {
    console.error("Error verifying user type:", error);
    return false;
  }
};
