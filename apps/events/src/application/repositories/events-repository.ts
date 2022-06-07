import { Event } from "../../domain/event";

export interface EventsRepository {
  findByPurchasesProductId(purchasesProductId: string): Promise<Event | null>;
  create(event: Event): Promise<void>;
}