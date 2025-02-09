// services/auth.js
import { auth } from "./config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

/**
 * Logs in an existing user with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Resolves with the user credential or rejects with an error.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(await userCredential.user.getIdToken())
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Registers a new user with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Resolves with the user credential or rejects with an error.
 */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Logs out the current user.
 *
 * @returns {Promise} Resolves when the user is signed out or rejects with an error.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
