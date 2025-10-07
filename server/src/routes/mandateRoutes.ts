import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import type { Submission } from '../types/Submission.js';
import { sendMandateEmail } from '../utils/mailer.js';
import { randomUUID } from 'crypto';

const router = Router();

const submissionSchema = z.object({
  govId: z.string().min(3),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  mandateId: z.string().min(2)
});

// Simple in-memory store (could be replaced with a database later)
const submissions: Submission[] = [];

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const parsed = submissionSchema.parse(req.body);

    const submission: Submission = { id: randomUUID(), createdAt: new Date(), ...parsed };
    submissions.push(submission);

    const emailResult = await sendMandateEmail({
      to: submission.email,
      fullName: submission.fullName,
      mandateId: submission.mandateId
    });

    res.status(201).json({
      message: `Congrats ${submission.fullName}! You have signed Mandate ${submission.mandateId}. Please contact the agency for further information.`,
      id: submission.id,
      email: emailResult.ok ? 'sent' : 'queued-failed'
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid submission', issues: err.issues });
    }
    console.error('Submission error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;