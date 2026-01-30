import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Auth functions
export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Send password reset email
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    // Normalize common Firebase errors into user-friendly messages
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email address.");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Please enter a valid email address.");
    }
    throw new Error(error.message || "Failed to send password reset email. Please try again.");
  }
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 'prompt': 'consent' });
    const result = await signInWithPopup(auth, provider);
    
    // Create or update user profile
    try {
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
      });
    } catch (profileError) {
      console.error("Error creating user profile:", profileError);
      // Continue anyway - user is authenticated
    }

    return result;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    // Provide helpful error messages for common issues
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method');
    } else if (error.code === 'auth/invalid-oauth-provider') {
      throw new Error('OAuth provider not configured. Make sure Google provider is enabled in Firebase.');
    } else if (error.message?.includes('The requested action is invalid')) {
      const currentUrl = window.location.hostname;
      throw new Error(`Firebase is not configured for this domain (${currentUrl}). Add it to Firebase Console > Authentication > Authorized domains.`);
    }
    
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Create or update user profile
    try {
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
      });
    } catch (profileError) {
      console.error("Error creating user profile:", profileError);
      // Continue anyway - user is authenticated
    }

    return result;
  } catch (error: any) {
    console.error("GitHub sign-in error:", error);
    
    // Provide helpful error messages for common issues
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('GitHub sign-in is not enabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method');
    } else if (error.message?.includes('The requested action is invalid')) {
      const currentUrl = window.location.hostname;
      throw new Error(`Firebase is not configured for this domain (${currentUrl}). Add it to Firebase Console > Authentication > Authorized domains.`);
    }
    
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Check if email already exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

// Check if user profile exists
export const checkUserProfileExists = async (uid: string): Promise<boolean> => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
};

// Firestore user data functions
export const createUserProfile = async (uid: string, userData: any) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No user profile found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: any) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Travel preferences and recommendations
export const saveTravelPreferences = async (
  uid: string,
  preferences: any
) => {
  try {
    await setDoc(doc(db, "users", uid, "preferences", "travelPrefs"), {
      ...preferences,
      savedAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving travel preferences:", error);
    throw error;
  }
};

export const getTravelPreferences = async (uid: string) => {
  try {
    const docSnap = await getDoc(
      doc(db, "users", uid, "preferences", "travelPrefs")
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching travel preferences:", error);
    throw error;
  }
};

export const saveDestinationRecommendation = async (
  uid: string,
  recommendation: any
) => {
  try {
    const docRef = doc(
      collection(db, "users", uid, "recommendations")
    );
    await setDoc(docRef, {
      ...recommendation,
      savedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving recommendation:", error);
    throw error;
  }
};

export const getDestinationRecommendations = async (uid: string) => {
  try {
    const q = query(
      collection(db, "users", uid, "recommendations")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

export const deleteSavedRecommendation = async (
  uid: string,
  recommendationId: string
) => {
  try {
    await deleteDoc(
      doc(db, "users", uid, "recommendations", recommendationId)
    );
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    throw error;
  }
};
