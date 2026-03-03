export default function RefundPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Refund Policy</h1>
      <p className="text-muted-foreground"><strong>Last updated:</strong> March 2, 2026</p>

      <h2>Credit Purchases</h2>
      <p>
        WadeCV credits are digital goods purchased through our platform. Our refund policy is as follows:
      </p>

      <h3>Unused Credits</h3>
      <ul>
        <li>If you have not used any credits from a purchased pack, you may request a full refund within <strong>14 days</strong> of purchase.</li>
        <li>Refund requests after 14 days will be evaluated on a case-by-case basis.</li>
      </ul>

      <h3>Partially Used Credits</h3>
      <ul>
        <li>If you have used some credits from a pack, the used credits are non-refundable.</li>
        <li>We may, at our discretion, offer a partial refund for the unused portion within 14 days of purchase.</li>
      </ul>

      <h3>Fully Used Credits</h3>
      <ul>
        <li>Credits that have been used for CV generation are non-refundable.</li>
      </ul>

      <h3>Free Credits</h3>
      <ul>
        <li>The free signup credit has no monetary value and is not refundable.</li>
      </ul>

      <h2>How to Request a Refund</h2>
      <ol>
        <li>Email <a href="mailto:support@wadecv.com">support@wadecv.com</a> with the subject line &quot;Refund Request.&quot;</li>
        <li>Include your account email address and the date of purchase.</li>
        <li>We will process eligible refunds within 5-10 business days.</li>
        <li>Refunds will be issued to the original payment method via Stripe.</li>
      </ol>

      <h2>Service Issues</h2>
      <p>
        If you experience a technical issue that results in a failed CV generation where your credit was deducted but
        no CV was produced, please contact us. We will either:
      </p>
      <ul>
        <li>Restore the credit to your account, or</li>
        <li>Issue a refund for that credit.</li>
      </ul>

      <h2>Account Deletion</h2>
      <p>
        If you delete your account with remaining unused credits, those credits are forfeited.
        Please request a refund before deleting your account if you have unused credits you&apos;d like refunded.
      </p>

      <h2>Contact</h2>
      <p>For refund requests or questions, contact us at <a href="mailto:support@wadecv.com">support@wadecv.com</a>.</p>
    </article>
  );
}
