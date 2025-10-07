export interface SubmissionInput {
  govId: string;
  fullName: string;
  email: string;
  phone: string;
  mandateId: string;
}

export interface Submission extends SubmissionInput {
  id: string;
  createdAt: Date;
}