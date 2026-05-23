import React from "react";

const LAST_UPDATED = "May 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-primary/5 py-20 border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 mt-16 prose prose-lg dark:prose-invert prose-headings:font-display pb-16">

        <p>
          Welcome to Scrolltek. Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect information when you visit our website. By using Scrolltek, you agree to the practices described in this policy.
        </p>
        <p>
          We've written this policy in plain language so it's actually readable. If something isn't clear, please feel free to reach out through our contact page.
        </p>

        <h2>1. Information We May Collect</h2>
        <p>
          Scrolltek is a content website — our primary goal is to publish articles, not to collect personal data. However, like most websites, we may collect certain information in the course of normal operation:
        </p>
        <ul>
          <li>
            <strong>Usage data</strong> — Information about how you interact with the site, such as pages visited, time spent on pages, browser type, device type, and referring URLs. This is typically collected automatically through analytics tools.
          </li>
          <li>
            <strong>Cookies and similar technologies</strong> — Small data files stored on your device that help the site function properly and allow us to understand site traffic patterns.
          </li>
          <li>
            <strong>Voluntarily submitted information</strong> — If you contact us or submit any form on the site, we may collect the information you provide, such as your name or message content.
          </li>
        </ul>
        <p>
          We do not collect sensitive personal information such as financial data, government ID numbers, or health information.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>Any information we collect is used to:</p>
        <ul>
          <li>Operate and improve the Scrolltek website and its content</li>
          <li>Understand how readers discover and engage with our articles</li>
          <li>Diagnose technical issues and maintain site performance</li>
          <li>Serve relevant advertising, where applicable</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>

        <h2>3. Cookies</h2>
        <p>
          Scrolltek uses cookies to make the site work properly and to better understand how visitors use it. Cookies are small text files stored on your device. We may use:
        </p>
        <ul>
          <li>
            <strong>Essential cookies</strong> — Necessary for the basic functionality of the site, such as remembering your display preferences.
          </li>
          <li>
            <strong>Analytics cookies</strong> — Used to collect anonymous data about how visitors use the site, which pages are most popular, and how users navigate between pages.
          </li>
          <li>
            <strong>Advertising cookies</strong> — If we display ads in the future, advertising partners may use cookies to show you relevant ads based on your browsing activity.
          </li>
        </ul>
        <p>
          Most browsers allow you to control or disable cookies through their settings. Note that disabling certain cookies may affect how the site functions.
        </p>

        <h2>4. Analytics</h2>
        <p>
          We may use third-party analytics services (such as Google Analytics) to understand site traffic and reader behavior. These services collect anonymized data and may use cookies or similar technologies. They operate under their own privacy policies, which we encourage you to review.
        </p>
        <p>
          Analytics data helps us understand which content is most useful to our readers and how to improve the overall Scrolltek experience.
        </p>

        <h2>5. Advertising</h2>
        <p>
          Scrolltek may display advertisements in the future through third-party ad networks. These advertising partners may use cookies or tracking technologies to deliver ads that are relevant to your interests, based on your browsing history across websites.
        </p>
        <p>
          If you prefer not to receive interest-based ads, most ad networks offer opt-out options. You can also visit the{" "}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
            Digital Advertising Alliance opt-out page
          </a>{" "}
          to manage your preferences.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          Our website may include links to third-party websites, embedded content, or references to external platforms. Once you leave Scrolltek or interact with third-party content, you are subject to those third parties' own privacy policies. We are not responsible for the privacy practices of external sites or services.
        </p>
        <p>We may use third-party tools for services such as:</p>
        <ul>
          <li>Website analytics and performance monitoring</li>
          <li>Content delivery and hosting infrastructure</li>
          <li>Embedded social media or video content</li>
          <li>Future advertising or sponsored content programs</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Anonymized analytics data may be retained for longer periods to help us understand long-term trends in site performance.
        </p>

        <h2>8. Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or request deletion of information we hold about you. You may also have the right to opt out of certain types of data processing.
        </p>
        <p>
          To exercise any of these rights, or if you have a question about your data, please get in touch through the contact page on our site. We will respond to reasonable requests in a timely manner.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Scrolltek is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to remove that data promptly.
        </p>

        <h2>10. Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no method of data transmission or storage is completely secure. We cannot guarantee absolute security, and we encourage you to take care with any personal information you share online.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time as our site evolves or as legal requirements change. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.
        </p>
        <p>
          Continued use of Scrolltek after any changes to this policy constitutes your acceptance of the updated terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          If you have any questions, concerns, or requests related to this Privacy Policy or your privacy on Scrolltek, please use the contact information available on our website. We take privacy seriously and will do our best to respond promptly and helpfully.
        </p>

        <div className="not-prose mt-12 rounded-xl bg-primary/5 border border-border p-6 text-sm text-muted-foreground">
          <p className="mb-0">
            <strong className="text-foreground">Note:</strong> This Privacy Policy is provided for general informational purposes and is not legal advice. If you have specific legal concerns about data privacy compliance, we recommend consulting a qualified legal professional.
          </p>
        </div>

      </div>
    </div>
  );
}
