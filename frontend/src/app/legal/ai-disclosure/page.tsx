export default function AIDisclosurePage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>AI Disclosure</h1>
      <p className="text-muted-foreground"><strong>Last updated:</strong> March 2, 2026</p>

      <h2>How WadeCV Uses Artificial Intelligence</h2>
      <p>
        WadeCV uses artificial intelligence to generate tailored CVs and cover letters.
        We believe in transparency about how AI is used in our service.
      </p>

      <h2>AI Model</h2>
      <ul>
        <li><strong>Model family:</strong> Models based on the GPT-5 series</li>
        <li><strong>Provider:</strong> Currently Microsoft Azure (OpenAI), but this may change over time and we may use other AI providers</li>
        <li><strong>Purpose:</strong> Generating tailored CV content and professional cover letters</li>
      </ul>

      <h2>What the AI Does</h2>
      <ul>
        <li>Analyzes your existing CV content and extracts key qualifications, experience, and skills.</li>
        <li>Reads the target job description to understand role requirements.</li>
        <li>Rewrites and restructures your CV content to better match the target role.</li>
        <li>Generates a professional summary tailored to the specific job.</li>
        <li>Rewords experience bullet points to highlight relevant achievements.</li>
        <li>Writes professional cover letters based on your tailored CV and the job description.</li>
      </ul>

      <h2>What the AI Does NOT Do</h2>
      <ul>
        <li><strong>Fabricate experience:</strong> The AI is instructed to only enhance presentation of your actual experience, not invent roles, companies, or qualifications you don&apos;t have.</li>
        <li><strong>Store your data:</strong> Azure OpenAI processes your data for generation only and does not use it for model training (per Microsoft&apos;s data processing terms).</li>
        <li><strong>Make hiring decisions:</strong> WadeCV is a content creation tool, not a hiring or recruitment platform.</li>
      </ul>

      <h2>Important Disclaimers</h2>
      <ul>
        <li>AI-generated content may contain errors, misinterpretations, or inaccuracies.</li>
        <li><strong>You are responsible</strong> for reviewing all generated content before using it in job applications.</li>
        <li>AI may rephrase your experience in ways that don&apos;t accurately reflect your actual role — always verify.</li>
        <li>Generated cover letters are a starting point and should be personalized with specific details about the company.</li>
        <li>AI output quality depends on the quality and completeness of the input you provide.</li>
      </ul>

      <h2>Your Control</h2>
      <p>You always have full control over the final output:</p>
      <ul>
        <li>An inline editor lets you modify every section of the generated CV before downloading.</li>
        <li>You can regenerate content by starting a new tailoring session.</li>
        <li>Downloaded DOCX files can be further edited in any word processor.</li>
      </ul>

      <h2>AI Monitoring</h2>
      <p>
        We use Langfuse to monitor AI generation quality, including token usage, latency, and error rates.
        This monitoring helps us ensure the service works reliably. Monitoring data includes trace IDs and
        token counts but does not include the content of your CVs or personal information.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions or concerns about our use of AI, please contact us at{" "}
        <a href="mailto:support@wadecv.com">support@wadecv.com</a>.
      </p>
    </article>
  );
}
