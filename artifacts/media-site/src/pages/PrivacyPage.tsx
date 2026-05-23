import React from "react";

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-16 pb-32">
      <h1 className="font-display text-4xl font-extrabold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>We only collect the information you choose to give us, and we process it with your consent, or on another legal basis; we only require the minimum amount of personal information that is necessary to fulfill the purpose of your interaction with us; we don't sell it to third parties; and we only use it as this Privacy Statement describes.</p>

        <h2>2. How We Use Information</h2>
        <p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
        <ul>
          <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
          <li>To improve our website in order to better serve you.</li>
          <li>To allow us to better service you in responding to your customer service requests.</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>

        <h2>4. Third-Party Disclosure</h2>
        <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>
        
        <h2>5. Contacting Us</h2>
        <p>If there are any questions regarding this privacy policy, you may contact us using the information on our Contact page.</p>
      </div>
    </div>
  );
}