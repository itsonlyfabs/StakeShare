import { EmailTemplates } from './EmailTemplates';
import { User, Creator, Program, Application } from '@/api/entities';

export class NotificationService {
  // Creator Notifications
  static async notifyCreatorInvited({ creatorId, programId, founderName }) {
    try {
      const [creator, program] = await Promise.all([
        Creator.get(creatorId),
        Program.get(programId)
      ]);

      if (!creator || !program) return;

      const inviteLink = `${window.location.origin}/creator-programs/${programId}`;

      await EmailTemplates.sendCreatorInvitation({
        creatorName: creator.name,
        creatorEmail: creator.email,
        founderName,
        companyName: program.company_name || 'Company',
        programName: program.name,
        inviteLink
      });
    } catch (error) {
      console.error('Failed to send creator invitation:', error);
    }
  }

  static async notifyApplicationReceived({ applicationId }) {
    try {
      const application = await Application.get(applicationId);
      const [creator, program] = await Promise.all([
        Creator.get(application.creator_id),
        Program.get(application.program_id)
      ]);

      await EmailTemplates.sendApplicationReceived({
        creatorName: creator.name,
        creatorEmail: creator.email,
        programName: program.name,
        companyName: program.company_name || 'Company'
      });
    } catch (error) {
      console.error('Failed to send application received notification:', error);
    }
  }

  static async notifyApplicationApproved({ applicationId }) {
    try {
      const application = await Application.get(applicationId);
      const [creator, program] = await Promise.all([
        Creator.get(application.creator_id),
        Program.get(application.program_id)
      ]);

      const dashboardLink = `${window.location.origin}/creator-dashboard`;

      await EmailTemplates.sendApplicationApproved({
        creatorName: creator.name,
        creatorEmail: creator.email,
        programName: program.name,
        companyName: program.company_name || 'Company',
        dashboardLink,
        allocationPercent: application.allocated_percent || program.default_allocation_percent
      });
    } catch (error) {
      console.error('Failed to send application approved notification:', error);
    }
  }

  static async notifyPayoutSent({ creatorId, amount, payoutType, programId }) {
    try {
      const [creator, program] = await Promise.all([
        Creator.get(creatorId),
        Program.get(programId)
      ]);

      await EmailTemplates.sendPayoutNotification({
        creatorName: creator.name,
        creatorEmail: creator.email,
        amount: (amount / 100).toFixed(2), // Convert cents to dollars
        payoutType,
        programName: program.name,
        companyName: program.company_name || 'Company'
      });
    } catch (error) {
      console.error('Failed to send payout notification:', error);
    }
  }

  // Founder Notifications
  static async notifyFounderWelcome({ founderId, companyName }) {
    try {
      const founder = await User.get(founderId);
      const dashboardLink = `${window.location.origin}/dashboard`;

      await EmailTemplates.sendFounderWelcome({
        founderName: founder.full_name,
        founderEmail: founder.email,
        companyName,
        dashboardLink
      });
    } catch (error) {
      console.error('Failed to send founder welcome:', error);
    }
  }
}