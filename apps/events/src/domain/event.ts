import crypto from 'node:crypto';
import { Maybe } from '../core/logic/Maybe';

interface EventProps {
  title: string;
  purchasesProductId: Maybe<string>;
}

export class Event {
  private _id: string;
  private props: EventProps;

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get purchasesProductId(): Maybe<string> {
    return this.props.purchasesProductId;
  }

  constructor(props: EventProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }
}