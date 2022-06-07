import crypto from 'node:crypto';
import { Maybe } from '../core/logic/Maybe';

interface EnrollmentProps {
  userId: string;
  eventId: string; 
  createdAt: Date;
  
  purchasesEnrolledByPurchaseId?: Maybe<string>;
  inactivatedAt?: Maybe<Date>;
}

export class Enrollment {
  private _id: string;
  private props: EnrollmentProps;

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get inactivatedAt(): Maybe<Date> {
    return this.props.inactivatedAt;
  }

  get purchasesEnrolledByPurchaseId(): Maybe<string> {
    return this.props.purchasesEnrolledByPurchaseId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  constructor(props: EnrollmentProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }
}