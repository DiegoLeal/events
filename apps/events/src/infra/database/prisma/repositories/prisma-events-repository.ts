import { EventsRepository } from "../../../../application/repositories/events-repository";
import { Event } from "../../../../domain/event";
import { prisma } from "../prisma";

export class PrismaEventsRepository implements EventsRepository {
  async findByPurchasesProductId(purchasesProductId: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
      where: { purchasesProductId },
    })

    if (!event) {
      return null;
    }

    return new Event({
      title: event.title,
      purchasesProductId: event.purchasesProductId,
    }, event.id);
  }

  async create(event: Event): Promise<void> {
    await prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        purchasesProductId: event.purchasesProductId,
      },
    })
  }
}