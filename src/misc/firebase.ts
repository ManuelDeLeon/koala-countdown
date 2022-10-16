import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as _signOut,
  onIdTokenChanged,
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  setDoc,
  enableIndexedDbPersistence,
  Firestore,
  getDoc,
} from "firebase/firestore";

import type { Document } from "../models/Document";

import { AnyObject } from "../models/AnyObject";
import { firebaseConfig } from "./constants";
import { updateSharedUser } from "./sharedState";

function listenForAuthChanges() {
  const auth = getAuth(app);

  onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
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

let app: FirebaseApp;
let db: Firestore;
export function initializeFirebase() {
  try {
    // Jest hates firebase/app
    const initializeApp = require("firebase/app").initializeApp;
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
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function createAccount(email: string, password: string) {
  const auth = getAuth(app);

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

export async function getDocument<T extends Document>(
  type: { new (data: AnyObject): T },
  collectionPath: string,
  id: string
): Promise<T | null> {
  const docRef = doc(db, collectionPath, id);
  const dbDoc = await getDoc(docRef);

  if (dbDoc.exists()) {
    const document = new type(dbDoc.data());
    document._id = dbDoc.id;
    return document;
  } else {
    return null;
  }
}
