export default function TermsPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground"><strong>Last updated:</strong> March 2, 2026</p>

      <h2>1. Overview</h2>
      <p>
        WadeCV (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an AI-powered CV tailoring service operated by a sole proprietor.
        By accessing or using our service at wadecv.com (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
      </p>

      <h2>2. Account Registration</h2>
      <p>
        To use WadeCV, you must create an account by providing a valid email address. You are responsible for
        maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>

      <h2>3. Credits and Payments</h2>
      <ul>
        <li>WadeCV operates on a credit-based system. Each CV generation costs 1 credit.</li>
        <li>New accounts receive 1 free credit upon registration.</li>
        <li>Credits can be purchased in packs: 10 credits for $10, 20 credits for $15, or 50 credits for $20.</li>
        <li>Credits do not expire and are non-transferable.</li>
        <li>All payments are processed securely through Stripe.</li>
        <li>Cover letter generation is free and does not consume credits.</li>
        <li>Prices are in USD and may be subject to applicable taxes.</li>
      </ul>

      <h2>4. AI-Generated Content</h2>
      <ul>
        <li>
          CVs and cover letters are generated using artificial intelligence based on the GPT-5 series of models. We
          currently use Azure OpenAI as our provider, but this may change over time and we may use other AI providers.
        </li>
        <li>AI-generated content is provided &quot;as is.&quot; You are solely responsible for reviewing, verifying, and editing all generated content before use.</li>
        <li>We do not guarantee that AI-generated content will be error-free, accurate, or suitable for any particular purpose.</li>
        <li>We do not fabricate experience or qualifications, but AI may misinterpret or rephrase your original content.</li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service to generate fraudulent, misleading, or deceptive CVs or cover letters.</li>
        <li>Upload content that infringes on third-party intellectual property rights.</li>
        <li>Attempt to reverse engineer, decompile, or interfere with the Service.</li>
        <li>Use automated systems (bots, scrapers) to access the Service without permission.</li>
        <li>Resell or redistribute credits or generated content commercially.</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        You retain ownership of the content you upload. Generated CVs and cover letters are provided for your personal
        and professional use. The WadeCV brand, logo, and platform design remain our intellectual property.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, WadeCV shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, including loss of profits, data, or employment opportunities, arising from
        your use of the Service. Our total liability shall not exceed the amount you paid to us in the 12 months
        preceding the claim.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied,
        including but not limited to implied warranties of merchantability, fitness for a particular purpose, or
        non-infringement.
      </p>

      <h2>9. Account Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account if you violate these terms. You may delete your
        account at any time through the Settings page, which will permanently remove all your data.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the Service after changes constitutes
        acceptance of the revised terms. We will notify registered users of material changes via email.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be
        resolved through good-faith negotiation or, if necessary, through binding arbitration.
      </p>

      <h2>12. Contact</h2>
      <p>For questions about these Terms, contact us at <a href="mailto:support@wadecv.com">support@wadecv.com</a>.</p>
    </article>
  );
}
