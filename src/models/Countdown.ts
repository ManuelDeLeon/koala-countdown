import { Timestamp } from "firebase/firestore";
import { getDocument, saveDocument } from "../misc/firebase";
import type { AnyObject } from "./AnyObject";
import { Document } from "./Document";

export class Countdown extends Document {
  constructor(data: Countdown | AnyObject = {}) {
    super(data);
    this._load(data);
    this._dbFields.push("deadline");
  }

  static __collection = "countdown";
  _collection = Countdown.__collection;
  deadline: Timestamp = new Timestamp(0, 0);

  static async get(): Promise<Countdown | null> {
    return await getDocument(Countdown, this.__collection, "only-one");
  }

  static async update(deadline: Timestamp): Promise<void> {
    const existing = await this.get();
    if (!existing) return;
    existing.deadline = deadline;
    await saveDocument(existing);
  }
}
