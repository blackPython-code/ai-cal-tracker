import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const userService = {
    async saveUser(userId: string, email: string, fullName: string) {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email,
                    fullName,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                console.log(`User ${userId} created in Firestore.`);
            } else {
                console.log(`User ${userId} already exists in Firestore.`);
            }
        } catch (error) {
            console.error("Error saving user to Firebase:", error);
            throw error;
        }
    },

    async getUser(userId: string) {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting user from Firebase:", error);
            throw error;
        }
    }
};
