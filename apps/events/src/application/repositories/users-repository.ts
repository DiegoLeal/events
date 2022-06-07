import { User } from "../../domain/user";

export interface UsersRepository {
  findByEmail(email: String): Promise<User | null>;
  create(user: User): Promise<void>;
}