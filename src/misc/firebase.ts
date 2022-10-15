import type { FirebaseApp } from "firebase/app";
import {
  enableIndexedDbPersistence,
  Firestore,
  getDocs,
  limit,
  QueryConstraint,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  query,
  where,
  addDoc,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as _signOut,
  onIdTokenChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import type { Document } from "../models/Document";

import { AnyObject } from "../models/AnyObject";
import { firebaseConfig } from "./constants";
import { updateSharedUser } from "./sharedState";

export let token: any;

function listenForAuthChanges() {
  const auth = getAuth(app);
  if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence);
  }

  onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
        token = await user.getIdToken();
        updateSharedUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } else {
        updateSharedUser(null);
      }
    },
    (err) => console.error(err.message)
  );
}

export let app: FirebaseApp;
export let db: Firestore;
export function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);

    db = getFirestore(app);
    if (typeof window !== "undefined") {
      enableIndexedDbPersistence(db, { forceOwnership: true }).catch((err) => {
        console.log(err);
      });
    }

    listenForAuthChanges();
  } catch (err: any) {
    console.log(err.message);
  }
}

function getDbObject(document: Document): Partial<Document> {
  const obj: AnyObject = {};
  Object.keys(document)
    .filter((k) => document._dbFields.includes(k))
    .forEach((k) => {
      obj[k] = document[k as keyof Document];
    });
  return obj;
}

export async function saveDocument(document: Document) {
  const dbObject = getDbObject(document);
  if (!document._collection) {
    throw Error("Objects that extends Document must specify __collection");
  }

  if (document._id) {
    await setDoc(doc(db, document._collection, document._id), dbObject);
  } else {
    const todoRef = await addDoc(
      collection(db, document._collection),
      dbObject
    );
    document._id = todoRef.id;
  }
}

export async function signIn(email: string, password: string) {
  const auth = getAuth(app);
  if (typeof window !== "undefined") {
    await setPersistence(auth, browserLocalPersistence);
  }

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function createAccount(email: string, password: string) {
  const auth = getAuth(app);
  if (typeof window !== "undefined") {
    await setPersistence(auth, browserLocalPersistence);
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function resetPassword(email: string) {
  const auth = getAuth(app);
  await sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  const auth = getAuth(app);
  await _signOut(auth);
}

export async function deleteDocument(document: Document) {
  if (!document._collection) {
    throw Error("Objects that extends Document must specify __collection");
  }

  await deleteDoc(doc(db, document._collection, document._id));
}

export async function searchDocument<T extends Document>(
  type: { new (data: AnyObject): T },
  collectionPath: string,
  search: AnyObject
): Promise<T | null> {
  let ref = collection(db, collectionPath);
  const wheres: Array<QueryConstraint> = [];
  for (let indexMatch of Object.entries(search)) {
    wheres.push(where(indexMatch[0], "==", indexMatch[1]));
  }
  const q = query(ref, limit(1), ...wheres);
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const dbDoc = querySnapshot.docs[0];
  const document = new type(dbDoc.data());
  document._id = dbDoc.id;
  return document;
}
