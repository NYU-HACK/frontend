// services/auth.js
import axios from "axios";
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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const response = await axios.post("http://10.253.215.20:3000/login", {
      token,
    });
    if (response.data && response.data._id) {
      // Return the user if backend validation is successful.
      return response.data;
    } else {
      // Otherwise, sign out and throw an error.
      await signOut(auth);
      throw new Error("Backend token validation failed");
    }
    
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
export const registerUser = async (firstName, lastName, email, password, confirmPassword) => {
  try {
    const response = await axios.post("http://10.253.215.20:3000/signup", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });
    return response.data.signUpSuccessful;
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
