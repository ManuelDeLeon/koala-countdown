import { User } from "../models/User";
import { shared } from "./shared";

export const [sharedUser, updateSharedUser] = shared<User | null>(null);
