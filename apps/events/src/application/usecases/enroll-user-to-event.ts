import { Event } from "../../domain/event";
import { Enrollment } from "../../domain/enrollment";
import { User } from "../../domain/user";
import { EventsRepository } from "../repositories/events-repository";
import { EnrollmentsRepository } from "../repositories/enrollments-repository";
import { UsersRepository } from "../repositories/users-repository";

interface EnrollUserToEventRequest {
  user: {
    name: string;
    email: string;
  }
  event: {
    title: string;
    purchasesProductId: string;
  }
  purchasesEnrolledByPurchaseId?: string;
}

export class EnrollUserToEvent {
  constructor(
    private usersRepository: UsersRepository,
    private eventsRepository: EventsRepository,
    private enrollmentsRepository: EnrollmentsRepository,
  ) {}

  async execute(request: EnrollUserToEventRequest): Promise<void> {
    let event = await this.eventsRepository.findByPurchasesProductId(request.event.purchasesProductId);

    if (!event) {
      event = new Event({
        title: request.event.title,
        purchasesProductId: request.event.purchasesProductId,
      })

      await this.eventsRepository.create(event)
    }

    let user = await this.usersRepository.findByEmail(request.user.email);

    if (!user) {
      user = new User({
        name: request.user.name,
        email: request.user.email,
      })

      await this.usersRepository.create(user)
    }

    const enrollment = new Enrollment({
      eventId: event.id,
      userId: user.id,
      createdAt: new Date(),
      purchasesEnrolledByPurchaseId: request.purchasesEnrolledByPurchaseId,
    })

    await this.enrollmentsRepository.create(enrollment);
  }
}