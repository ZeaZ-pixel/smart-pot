export interface IEmailSenderService {
  send(to: string, subject: string, body: string): Promise<void>;
}
