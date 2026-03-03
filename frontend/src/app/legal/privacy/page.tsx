export default function PrivacyPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground"><strong>Last updated:</strong> March 2, 2026</p>

      <h2>1. Information We Collect</h2>
      <h3>Account Information</h3>
      <ul>
        <li>Email address (required for account creation)</li>
        <li>Password hash (if using password authentication; we never store plain-text passwords)</li>
      </ul>

      <h3>CV and Job Data</h3>
      <ul>
        <li>CV files you upload (PDF, DOCX) and their extracted text content</li>
        <li>Additional information you provide about yourself</li>
        <li>Job descriptions and URLs you submit</li>
        <li>Generated CVs and cover letters</li>
      </ul>

      <h3>Payment Information</h3>
      <ul>
        <li>Stripe customer ID and transaction records</li>
        <li>We do not store credit card numbers — all payment processing is handled by Stripe</li>
      </ul>

      <h3>Usage Data</h3>
      <ul>
        <li>AI generation logs (prompt tokens, completion tokens, latency) via Langfuse for quality monitoring</li>
        <li>Application tracking data you create</li>
      </ul>

      <h2>2. How We Use Your Data</h2>
      <ul>
        <li><strong>CV Generation:</strong> Your CV content and job descriptions are sent to Azure OpenAI to generate tailored CVs and cover letters.</li>
        <li><strong>Account Management:</strong> Your email is used for authentication, magic links, email verification, and account-related communications.</li>
        <li><strong>Payment Processing:</strong> Transaction data is used to manage your credit balance.</li>
        <li><strong>Service Improvement:</strong> AI usage metrics (via Langfuse) help us monitor and improve generation quality. These logs do not contain your personal data — only prompt structure and token counts.</li>
      </ul>

      <h2>3. Data Processing and Third Parties</h2>
      <table>
        <thead>
          <tr><th>Service</th><th>Purpose</th><th>Data Shared</th></tr>
        </thead>
        <tbody>
          <tr><td>Azure OpenAI</td><td>AI CV/cover letter generation</td><td>CV text, job descriptions (processed, not stored by Azure)</td></tr>
          <tr><td>Stripe</td><td>Payment processing</td><td>Email, payment details</td></tr>
          <tr><td>Langfuse</td><td>AI monitoring and quality</td><td>Token counts, latency metrics, trace IDs</td></tr>
          <tr><td>Resend</td><td>Transactional emails</td><td>Email address</td></tr>
          <tr><td>Azure (Hosting)</td><td>Infrastructure</td><td>All data (encrypted at rest and in transit)</td></tr>
        </tbody>
      </table>

      <h2>4. Data Storage and Security</h2>
      <ul>
        <li>All data is stored on Azure Database for PostgreSQL with encryption at rest.</li>
        <li>Data in transit is encrypted using TLS.</li>
        <li>Passwords are hashed using bcrypt.</li>
        <li>Access to production systems is restricted to the sole operator.</li>
      </ul>

      <h2>5. Data Retention</h2>
      <ul>
        <li>Your data is retained as long as your account is active.</li>
        <li>Deleted accounts have their data permanently removed within 30 days.</li>
        <li>Payment records may be retained longer for legal and accounting purposes.</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> View all data associated with your account through the dashboard.</li>
        <li><strong>Rectification:</strong> Edit your CV data at any time via the CV editor.</li>
        <li><strong>Deletion:</strong> Delete your account and all associated data through Settings &gt; Delete Account.</li>
        <li><strong>Portability:</strong> Download your generated CVs and cover letters as DOCX files.</li>
        <li><strong>Object:</strong> Contact us to object to specific data processing activities.</li>
      </ul>

      <h2>7. Cookies and Analytics</h2>
      <p>
        We use essential cookies to keep you signed in (authentication tokens stored as httpOnly, secure
        cookies) and to remember your theme preference.
      </p>
      <p>
        We also use Google Analytics 4 (&quot;GA4&quot;) to understand how WadeCV is used so we can improve
        the product. GA4 collects pseudonymous usage data such as page views, feature engagement (for example,
        when you tailor a CV, generate a new version, or download a document), approximate location (based on
        your IP address as processed by Google), device and browser information, and technical event metadata
        (such as error states or failed requests). We do not use this data to build marketing profiles of
        individual users.
      </p>
      <p>
        Analytics cookies and related tracking are controlled via an in-product banner and settings. You can
        choose to accept or decline analytics on your first visit, and you can change this choice later in the
        app. If you decline, only essential cookies will be used and we will not send non-essential analytics
        events to Google.
      </p>
      <p>
        For more information about how Google Analytics handles data, please see Google&apos;s documentation on
        &quot;How Google uses information from sites or apps that use our services&quot; and the
        &quot;Safeguarding your data in Google Analytics&quot; page.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>WadeCV is not intended for users under 16 years of age. We do not knowingly collect data from children.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We will notify registered users via email of any material changes to this Privacy Policy.</p>

      <h2>10. Contact</h2>
      <p>For privacy-related inquiries, contact us at <a href="mailto:support@wadecv.com">support@wadecv.com</a>.</p>
    </article>
  );
}
