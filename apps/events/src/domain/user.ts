import crypto from 'node:crypto';

interface UserProps {
  name: string;
  email: string;
}

export class User {
  private _id: string;
  private props: UserProps;

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  constructor(props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }
}