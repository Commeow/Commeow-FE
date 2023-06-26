export class EchoResponder {
  private callback: (payload: any) => void;

  constructor(callback: (payload: any) => void) {
    this.callback = callback;
  }

  fireAndForget(payload: any): void {
    this.callback(payload);
  }
}
