import { db } from "./db";
import { auth } from "./auth";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export function usersCol() {
  return collection(db, "users");
}

export function userDoc(userId) {
  return doc(db, "users", userId);
}

export function workoutsCol(userId) {
  return collection(db, "users", userId, "workouts");
}

export function tracksCol(userId) {
  return collection(db, "users", userId, "tracks");
}

export function exercisesCol() {
  return collection(db, "exercises");
}

export async function ensureUserProfile(userId, profile) {
  await setDoc(
    userDoc(userId),
    {
      createdAt: serverTimestamp(),
      ...profile,
    },
    { merge: true }
  );
}

export async function createWorkout(userId, workout) {
  return addDoc(workoutsCol(userId), {
    createdAt: serverTimestamp(),
    ...workout,
  });
}

export async function createTrack(userId, track) {
  return addDoc(tracksCol(userId), {
    createdAt: serverTimestamp(),
    ...track,
  });
}

export async function createExercise(exercise) {
  return addDoc(exercisesCol(), {
    createdAt: serverTimestamp(),
    ...exercise,
  });
}

export async function listExercises() {
  const snap = await getDocs(exercisesCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function currentUserIdOrDemo() {
  return auth.currentUser?.uid || "demo-seed";
}
