import { SendEmail } from '@/api/integrations';

export class EmailTemplates {
  static async sendCreatorInvitation({ creatorName, creatorEmail, founderName, companyName, programName, inviteLink, customMessage = '' }) {
    const subject = `${founderName} invited you to join ${companyName} as a micro-investor`;
    
    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: rgba(255,255,255,0.1); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="width: 64px; height: 64px; background: linear-gradient(45deg, #8B5CF6, #EC4899); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✨</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">You're Invited to Join ${companyName}</h1>
          <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Become a micro-investor and earn equity + revenue share</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <p style="font-size: 18px; margin: 0 0 16px; color: white;">Hi ${creatorName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px; opacity: 0.9;">
            ${founderName} has personally invited you to join <strong>${programName}</strong> as a micro-investor. 
            This means you'll receive actual equity in ${companyName} and earn revenue share for every customer you bring in.
          </p>

          ${customMessage ? `
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #8B5CF6;">
            <p style="margin: 0; font-size: 16px; font-style: italic; opacity: 0.9;">"${customMessage}"</p>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.7;">- ${founderName}</p>
          </div>
          ` : ''}

          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.2);">
            <h3 style="margin: 0 0 16px; font-size: 18px; color: white;">🚀 What You Get:</h3>
            <ul style="margin: 0; padding-left: 20px; color: white; opacity: 0.9;">
              <li style="margin-bottom: 8px;">Real equity stake in ${companyName}</li>
              <li style="margin-bottom: 8px;">Revenue share for every conversion you drive</li>
              <li style="margin-bottom: 8px;">Automatic tracking and attribution</li>
              <li style="margin-bottom: 8px;">Monthly automated payouts</li>
              <li>Exclusive company updates and insider access</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 32px; opacity: 0.9;">
            This isn't just another affiliate program – you'll actually own a piece of the company and share in its long-term success.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(45deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);">
              Accept Invitation & Join Now →
            </a>
          </div>

          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #8B5CF6;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              <strong>Next Steps:</strong> Click the button above to create your account, complete your creator profile, 
              and get your unique tracking links to start earning immediately.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: rgba(0,0,0,0.2); padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="margin: 0; font-size: 14px; opacity: 0.7;">
            This invitation was sent by ${founderName} from ${companyName}.<br>
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
          <div style="margin-top: 16px;">
            <a href="https://stakeshare.app" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 12px;">
              Powered by StakeShare
            </a>
          </div>
        </div>
      </div>
    `;

    await SendEmail({
      to: creatorEmail,
      subject,
      body: htmlBody,
      from_name: `${founderName} (${companyName})`
    });
  }

  static async sendApplicationReceived({ creatorName, creatorEmail, programName, companyName }) {
    const subject = `Application received for ${programName}`;
    
    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: rgba(255,255,255,0.1); padding: 32px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: linear-gradient(45deg, #3B82F6, #1D4ED8); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">📋</div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Application Received!</h1>
        </div>

        <div style="padding: 32px 24px;">
          <p style="font-size: 18px; margin: 0 0 16px;">Hi ${creatorName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px; opacity: 0.9;">
            Thank you for applying to join <strong>${programName}</strong> at ${companyName}! 
            We've received your application and are excited to review it.
          </p>

          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px; color: white;">⏳ What happens next:</h3>
            <ol style="margin: 0; padding-left: 20px; opacity: 0.9;">
              <li style="margin-bottom: 8px;">We'll review your application and social metrics</li>
              <li style="margin-bottom: 8px;">You'll receive an approval/feedback email within 48 hours</li>
              <li style="margin-bottom: 8px;">If approved, you'll get access to your creator dashboard</li>
              <li>Start earning equity and revenue share immediately!</li>
            </ol>
          </div>

          <p style="font-size: 16px; margin: 24px 0; opacity: 0.9;">
            We'll notify you as soon as there's an update on your application status.
          </p>
        </div>

        <div style="background: rgba(0,0,0,0.2); padding: 24px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.7;">
            Questions? Reply to this email or contact us at creators@stakeshare.app
          </p>
        </div>
      </div>
    `;

    await SendEmail({
      to: creatorEmail,
      subject,
      body: htmlBody,
      from_name: companyName
    });
  }

  static async sendApplicationApproved({ creatorName, creatorEmail, programName, companyName, dashboardLink, allocationPercent }) {
    const subject = `🎉 You're approved! Welcome to ${programName}`;
    
    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: rgba(255,255,255,0.1); padding: 32px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: linear-gradient(45deg, #10B981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">🎉</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Congratulations!</h1>
          <p style="margin: 8px 0 0; font-size: 18px; opacity: 0.9;">You've been approved for ${programName}</p>
        </div>

        <div style="padding: 32px 24px;">
          <p style="font-size: 18px; margin: 0 0 16px;">Hi ${creatorName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px; opacity: 0.9;">
            Fantastic news! Your application to join <strong>${programName}</strong> at ${companyName} has been approved. 
            You're now an official micro-investor with <strong>${allocationPercent}%</strong> equity allocation!
          </p>

          <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid rgba(255,255,255,0.2);">
            <h3 style="margin: 0 0 16px; color: white;">🚀 You now have access to:</h3>
            <ul style="margin: 0; padding-left: 20px; opacity: 0.9;">
              <li style="margin-bottom: 8px;">Your personalized creator dashboard</li>
              <li style="margin-bottom: 8px;">Unique tracking links for all campaigns</li>
              <li style="margin-bottom: 8px;">Real-time analytics and earnings tracking</li>
              <li style="margin-bottom: 8px;">Direct messaging with the founder</li>
              <li>Promotional materials and brand assets</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(45deg, #10B981, #059669); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);">
              Access Your Dashboard →
            </a>
          </div>

          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              <strong>💡 Pro Tip:</strong> Start by generating your first tracking link and sharing it on your highest-performing platform. 
              The sooner you start, the sooner you'll see those revenue share payments rolling in!
            </p>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.2); padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 14px; opacity: 0.7;">
            Welcome to the team! Questions? Message the founder directly through your dashboard.
          </p>
        </div>
      </div>
    `;

    await SendEmail({
      to: creatorEmail,
      subject,
      body: htmlBody,
      from_name: companyName
    });
  }

  static async sendPayoutNotification({ creatorName, creatorEmail, amount, payoutType, programName, companyName }) {
    const subject = `💰 Payment sent: $${amount} from ${companyName}`;
    
    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #7C2D12 0%, #991B1B 100%); color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: rgba(255,255,255,0.1); padding: 32px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: linear-gradient(45deg, #EF4444, #DC2626); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">💰</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Payment Sent!</h1>
          <p style="margin: 8px 0 0; font-size: 18px; opacity: 0.9;">$${amount} ${payoutType.replace('_', ' ')}</p>
        </div>

        <div style="padding: 32px 24px; text-center;">
          <p style="font-size: 18px; margin: 0 0 16px;">Hi ${creatorName},</p>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; margin: 24px 0;">
            <div style="font-size: 48px; font-weight: 800; margin-bottom: 8px;">$${amount}</div>
            <div style="font-size: 16px; opacity: 0.8; text-transform: capitalize;">${payoutType.replace('_', ' ')} • ${programName}</div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 24px 0; opacity: 0.9;">
            Great work! This payment has been sent to your account and should arrive within 1-2 business days.
          </p>

          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              💡 Keep up the amazing work! The more conversions you drive, the more you earn. 
              Check your dashboard to see your latest performance metrics.
            </p>
          </div>
        </div>
      </div>
    `;

    await SendEmail({
      to: creatorEmail,
      subject,
      body: htmlBody,
      from_name: companyName
    });
  }

  static async sendFounderWelcome({ founderName, founderEmail, companyName, dashboardLink }) {
    const subject = `Welcome to StakeShare, ${founderName}! 🚀`;
    
    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #581C87 0%, #7C2D12 100%); color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: rgba(255,255,255,0.1); padding: 40px 24px; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #8B5CF6, #EC4899); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">✨</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Welcome to StakeShare!</h1>
          <p style="margin: 12px 0 0; font-size: 18px; opacity: 0.9;">Transform your users into micro-investors</p>
        </div>

        <div style="padding: 40px 24px;">
          <p style="font-size: 18px; margin: 0 0 20px;">Hi ${founderName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 32px; opacity: 0.9;">
            Congratulations on taking the first step toward building a more aligned creator economy! 
            ${companyName} is now ready to recruit micro-investors and accelerate growth through true partnership.
          </p>

          <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; margin: 32px 0;">
            <h3 style="margin: 0 0 20px; font-size: 20px; text-align: center;">🎯 Your Next Steps:</h3>
            
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #3B82F6, #1D4ED8); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">1</div>
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">Complete Company Setup</div>
                  <div style="font-size: 14px; opacity: 0.8;">Add your logo, description, and connect payment processing</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #10B981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">2</div>
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">Create Your First Program</div>
                  <div style="font-size: 14px; opacity: 0.8;">Set equity pool, eligibility rules, and revenue sharing terms</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #8B5CF6, #EC4899); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">3</div>
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">Recruit Your First Creators</div>
                  <div style="font-size: 14px; opacity: 0.8;">Invite specific creators or open public applications</div>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(45deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);">
              Access Your Dashboard →
            </a>
          </div>

          <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 32px 0;">
            <h4 style="margin: 0 0 12px; font-size: 16px;">📚 Helpful Resources:</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; opacity: 0.8;">
              <li style="margin-bottom: 6px;">Documentation: Complete setup guide and best practices</li>
              <li style="margin-bottom: 6px;">Support: help@stakeshare.app for any questions</li>
              <li>Community: Join other founders building creator economies</li>
            </ul>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 24px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.7;">
            Ready to turn your best users into owners? Let's build something amazing together.
          </p>
        </div>
      </div>
    `;

    await SendEmail({
      to: founderEmail,
      subject,
      body: htmlBody,
      from_name: "StakeShare Team"
    });
  }
}