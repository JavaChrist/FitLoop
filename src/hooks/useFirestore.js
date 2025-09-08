import { useMemo } from "react";
import { db } from "../firebase/db";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export function useFirestore() {
  return useMemo(() => ({ db, collection, addDoc, getDocs, query, where }), []);
}
