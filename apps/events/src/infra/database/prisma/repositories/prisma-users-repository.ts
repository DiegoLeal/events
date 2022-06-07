import { UsersRepository } from "../../../../application/repositories/users-repository";
import { User } from "../../../../domain/user";
import { prisma } from "../prisma";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return null;
    }

    return new User({
      name: user.name,
      email: user.email,
    }, user.id);
  }

  async create(user: User) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  }
}