import 'dotenv/config';

import { EnrollUserToEvent } from "../../application/usecases/enroll-user-to-event"
import { PrismaEventsRepository } from "../database/prisma/repositories/prisma-events-repository"
import { PrismaEnrollmentsRepository } from "../database/prisma/repositories/prisma-enrollments-repository"
import { PrismaUsersRepository } from "../database/prisma/repositories/prisma-users-repository"
import { kafka } from "./kafka/kafka"

interface PurchasesNewPurchaseMessage {
  product: {
    id: string;
    title: string;
  }
  customer: {
    name: string;
    email: string;
  }
  purchaseId: string;
}

async function main() {
  const consumer = kafka.consumer({ groupId: 'classroom-group', allowAutoTopicCreation: true })

  await consumer.connect()
  await consumer.subscribe({ topic: 'purchases.new-purchase' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const purchaseJSON = message.value?.toString();

      if (!purchaseJSON) {
        return;
      }

      const purchase: PurchasesNewPurchaseMessage = JSON.parse(purchaseJSON);

      const prismaUsersRepository = new PrismaUsersRepository()
      const prismaEventRepository = new PrismaEventsRepository()
      const prismaEnrollmentRepository = new PrismaEnrollmentsRepository()

      const enrollUserToEvent = new EnrollUserToEvent(
        prismaUsersRepository,
        prismaEventRepository,
        prismaEnrollmentRepository,
      )

      await enrollUserToEvent.execute({
        user: {
          name: purchase.customer.name,
          email: purchase.customer.email,
        },
        event: {
          title: purchase.product.title,
          purchasesProductId: purchase.product.id,
        },
        purchasesEnrolledByPurchaseId: purchase.purchaseId,
      })

      console.log(`[Classroom] Enrolled user ${purchase.customer.name} to ${purchase.product.title}`)
    },
  })
}

main().then(() => {
  console.log('[Classroom] Listening to Kafka messages')
})