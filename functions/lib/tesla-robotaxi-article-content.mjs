// Canonical body for the robotaxi explainer (tesla-self-driving-cars-2026).
// Verbatim copy of ARTICLE_BODY_TESLA_FSD in lib/db/src/ensure-seeded.ts and
// BODIES['tesla-self-driving-cars-2026'] in api/setup.mjs. The page template
// renders the H1, so the body has none.
export const TESLA_ROBOTAXI_ARTICLE_BODY = String.raw`<p><em>Updated October 24, 2026. This guide began as our May 2026 report on Tesla's driverless launch. We rebuilt it as a full robotaxi explainer with dated figures from company filings, regulator notices and company data pages.</em></p>

<p>You open an app, a car pulls up, and nobody is in the driver's seat. That is a robotaxi, and in October 2026 you can ride one in more than a dozen US cities, in several Chinese cities and in parts of the Middle East. This guide explains what a robotaxi is, how robotaxis work, who runs them, where Tesla really stands and how safe they are.</p>

<h2 id="what-is-a-robotaxi">What Is a Robotaxi? The Quick Answer</h2>

<p><strong>A robotaxi is a ride-hailing car that drives itself, with no human driver, so you book it in an app and ride as a passenger. Robotaxis usually operate at SAE Level 4, meaning the software handles all driving inside a mapped service area, with remote staff available for help.</strong></p>

<p>Not every service sold under the name qualifies. If a human sits in the driver's seat, or a safety supervisor rides along, we treat it as a supervised pilot rather than a true robotaxi. We flag those cases below.</p>

<h2 id="how-robotaxis-work">How Robotaxis Work</h2>

<p>A robotaxi stacks three layers. The first is sensors. Most fleets combine cameras, radar and lidar, a laser scanner that builds a 3D picture of the road. Waymo and the main Chinese operators use that mix. Tesla uses cameras only and says this is cheaper to scale. The second layer is software and an onboard AI chip that turns sensor data into driving decisions many times a second, similar to the <a href="/article/amd-on-device-ai-no-internet-2026">on-device AI chips we covered earlier</a>. The third layer is fleet operations: depots, charging, cleaning and remote support.</p>

<p>Remote assistance is not the same as remote driving. When a car is unsure, such as at a blocked lane, it can ask a human agent for guidance. Companies differ on how much control those staff have. Tesla's safety report says its mileage includes trips where a remote operator assisted or took over.</p>

<p>Engineers rate automation on the SAE scale from Level 0 to 5. At Level 2 the car steers and brakes but you must watch the road. At Level 4 the car drives itself within set conditions, such as one mapped area, and needs no human driver. Robotaxis are Level 4. Level 5, driving anywhere in any conditions, does not exist commercially.</p>

<figure>
<img src="/images/how-a-robotaxi-works-sensors-diagram.webp" alt="Diagram of how a robotaxi works: cameras, radar, lidar, onboard AI computer and remote support" width="1200" height="800" loading="lazy" decoding="async">
<figcaption>How a robotaxi sees the road: cameras, radar and lidar feed an onboard AI computer, with remote support on standby. Original Scrolltek diagram.</figcaption>
</figure>

<h2 id="robotaxi-vs-tesla-fsd-vs-self-driving-car">Robotaxi vs Tesla FSD vs a Normal Self-Driving Car</h2>

<p>People use these terms interchangeably. They describe very different things.</p>

<table>
<thead><tr><th></th><th>Robotaxi</th><th>Tesla FSD (Supervised)</th><th>"Self-driving car" (everyday term)</th></tr></thead>
<tbody>
<tr><td>Who drives</td><td>The software, no driver</td><td>You supervise at all times</td><td>Depends on the car</td></tr>
<tr><td>SAE level</td><td>Level 4</td><td>Level 2</td><td>Level 2 to 4</td></tr>
<tr><td>Your role</td><td>Passenger</td><td>Driver, ready to take over</td><td>Check the manual</td></tr>
<tr><td>Where it works</td><td>Inside a mapped service area</td><td>Many roads</td><td>Varies</td></tr>
<tr><td>How you get it</td><td>Hail it in an app</td><td>Subscribe in your own Tesla</td><td>Buy or lease</td></tr>
<tr><td>Examples</td><td>Waymo, Zoox, Apollo Go</td><td>Customer-owned Teslas</td><td>Any car marketed that way</td></tr>
</tbody>
</table>

<p>So is a Tesla with FSD a robotaxi? No. Tesla's own filing says FSD (Supervised) <a href="https://www.sec.gov/Archives/edgar/data/1318605/000162828026066738/exhibit9914.htm" rel="noopener">"does not make the vehicle autonomous."</a> The 2026 Model Y was the first vehicle to pass NHTSA's new driver-assistance tests, <a href="https://www.nhtsa.gov/press-releases/tesla-model-y-first-vehicle-pass-nhtsa-new-advanced-driver-assistance-system-tests" rel="noopener">announced May 7, 2026</a>, but those tests cover features such as pedestrian braking and lane keeping, not robotaxi operation.</p>

<h2 id="robotaxi-companies-and-cities">Robotaxi Companies and Cities in 2026: Who Runs Them</h2>

<p>Figures are company-reported unless noted. Check the date in each row.</p>

<table>
<thead><tr><th>Operator</th><th>Where</th><th>Vehicle</th><th>Status</th><th>As of</th></tr></thead>
<tbody>
<tr><td><strong>Waymo</strong> (Alphabet)</td><td>15 US metros by our count of <a href="https://support.google.com/waymo/announcements/12766613" rel="noopener">Waymo's rider announcements</a>: Phoenix, SF Bay Area, Los Angeles, Austin, Atlanta, Miami, Orlando, Dallas, Houston, San Antonio, Nashville, Denver, Tampa, San Diego, Las Vegas</td><td>Jaguar I-Pace, new Ojai</td><td>Driverless and paid. 500,000+ paid rides a week (March 2026); goal of 1 million by end of 2026. Las Vegas is adding riders gradually</td><td>Oct 2026</td></tr>
<tr><td><strong>Tesla Robotaxi</strong></td><td>Austin, Dallas, Houston, Miami, Orlando, Tampa (no in-car supervisor); Bay Area (safety driver)</td><td>Model Y; Cybercab in Austin</td><td>Paid. Cybercab rides began Sept 3, 2026</td><td>Oct 2026</td></tr>
<tr><td><strong>Zoox</strong> (Amazon)</td><td>Las Vegas (paid); San Francisco (free); Austin and Miami named as next</td><td>Purpose-built, no steering wheel</td><td>NHTSA exemption for up to 2,500 vehicles a year for two years</td><td>Aug 2026</td></tr>
<tr><td><strong>Baidu Apollo Go</strong></td><td>28 cities in its global footprint (Aug 2026), mostly China; fully driverless commercial service in Dubai and Abu Dhabi</td><td>Mixed fleet incl. RT6</td><td>23 million+ cumulative rides (June 30, 2026)</td><td>Aug 2026</td></tr>
<tr><td><strong>WeRide</strong></td><td>China; Abu Dhabi and Dubai (fully driverless); Riyadh; Singapore. Madrid and Zurich planned with Uber</td><td>Robotaxi GXR and others</td><td>1,800+ robotaxis (July 31, 2026)</td><td>July 2026</td></tr>
<tr><td><strong>Pony.ai</strong></td><td>China's four top-tier cities; also Croatia, Qatar, Singapore, South Korea</td><td>Gen-7</td><td>1,975 robotaxis (June 30, 2026); target 3,500+ by end of 2026</td><td>Aug 2026</td></tr>
</tbody>
</table>

<p>Outside the US and China, London got its first commercial service on September 3, 2026 from Uber and Wayve, with a human supervisor behind the wheel. Waymo says it aims to carry London passengers with nobody at the wheel by the end of 2026, subject to government approval. Waymo also offers Google's Gemini assistant in its Ojai robotaxi (since July 29, 2026), part of the AI push in our <a href="/article/google-io-2026-ai-announcements">Google I/O 2026 recap</a>.</p>

<h2 id="tesla-robotaxi">Tesla Robotaxi: Where It Really Stands</h2>

<p>Tesla's robotaxi is real but still small next to Waymo's. Here is the dated record:</p>

<ul>
<li><strong>June 22, 2025:</strong> Service starts in Austin with safety monitors on board.</li>
<li><strong>January 2026:</strong> Tesla begins removing monitors from some Austin rides.</li>
<li><strong>April 2026:</strong> Unsupervised rides start in Dallas and Houston.</li>
<li><strong>July 2026:</strong> Unsupervised rides start in Miami, Orlando and Tampa.</li>
<li><strong>September 3, 2026:</strong> Cybercab, a two-seater with no steering wheel or pedals, starts carrying riders in Austin.</li>
<li><strong>October 10, 2026:</strong> Tesla says 300+ Cybercabs serve Austin, up from fewer than 40 a month earlier.</li>
</ul>

<p><strong>Fleet size.</strong> Texas records listed about 420 Tesla robotaxi-registered vehicles on September 4, 2026, including 45 Cybercabs (Reuters). Tesla does not say how many run at once. The figure of about 38 vehicles in our original article is out of date.</p>

<p><strong>Miles and safety.</strong> Tesla's first Robotaxi Safety Report covers January 22 to October 18, 2026: 3.1 million miles with no monitor aboard, 2.1 million in Austin. Tesla reports no injuries, no airbag deployments and no pedestrian or cyclist collisions. Those are Tesla's own numbers, and 3.1 million miles is roughly one percent of Waymo's total rider-only miles, too few for firm conclusions.</p>

<p><strong>Regulators.</strong> NHTSA opened an audit on September 3, 2026 into how Tesla certified the Cybercab without a steering wheel or pedals and without seeking an exemption. Sworn answers are due October 30, 2026. NHTSA has not found a violation. In California, Tesla's Bay Area rides still use a human safety driver.</p>

<p><strong>Promises versus record.</strong> In April 2019, Musk said Tesla would have over a million robotaxis on the road in 2020. In October 2026 the fleet is in the hundreds. On Tesla's Q3 call (October 21, 2026), executives said unsupervised FSD could start reaching customer cars around Q2 2027, limited at first to select US regions, and that Cybercab rides in Dallas begin in November.</p>

<h2 id="are-robotaxis-safe">Are Robotaxis Safe?</h2>

<p><strong>The case for.</strong> The best public dataset is Waymo's. Through June 2026 it reports 271.3 million rider-only miles and, versus human benchmarks in the same areas, <a href="https://waymo.com/safety/impact/" rel="noopener">95% fewer serious-injury crashes and 82% fewer injury-causing crashes</a>. Baidu says its fully driverless vehicles average about one airbag deployment per 14.4 million kilometres (June 2026). These are company-run comparisons, and Waymo itself notes that not all human crashes are reported.</p>

<p><strong>The case against.</strong> Safety is not only crash rates. Waymo has filed several software recalls, including: after robotaxis passed stopped school buses in Austin (December 2025); after vehicles drove into flooded roads, including an empty car swept away in San Antonio on April 20, 2026 (May 2026); and after 13 incidents involving freeway construction zones (June 2026). Waymo paused freeway rides in late May and began restoring them on July 29, 2026.</p>

<p>In China, about 100 Apollo Go cars stalled in Wuhan on March 31, 2026 after a system failure. Police reported no injuries, though some passengers were stranded for nearly two hours. China reportedly paused new Level 4 permits afterwards. In San Francisco, Waymos stopped in traffic during a December 2025 power outage and caused gridlock.</p>

<p><strong>The honest read.</strong> The best-documented fleet looks safer than human drivers on injury crashes, while failures cluster in unusual situations: floods, school buses, construction and emergencies. Tesla and most newer operators lack comparable public data. NHTSA says it can pull Zoox's exemption if major safety issues appear.</p>

<h2 id="how-to-ride-a-robotaxi">How to Ride a Robotaxi (and What It Costs)</h2>

<ol>
<li><strong>Check your city.</strong> Waymo, Tesla and Zoox each show service areas in their apps.</li>
<li><strong>Pick the app.</strong> Use the operator's app, or Uber where it carries robotaxis: Waymo in Austin and Atlanta, WeRide in Abu Dhabi, Apollo Go in Dubai.</li>
<li><strong>Expect a waitlist in new cities.</strong> Waymo opened Tampa, San Diego and San Antonio to everyone on October 14, 2026, and began adding Las Vegas riders gradually on September 14, 2026.</li>
<li><strong>Ride as a passenger.</strong> The car unlocks through the app, and you cannot use the driver's seat.</li>
</ol>

<p><strong>Price versus Uber.</strong> Obi tracked San Francisco fares from November 27, 2025 to January 1, 2026. The average ride cost $19.69 on Waymo, $17.47 on Uber and $15.47 on Lyft, against $8.17 on Tesla, whose rides still carried a safety driver. By March and April 2026, Obi found Waymo prices up 18% since December and Uber up 5%, with Tesla still about half of Waymo's price. Fares vary by city, time and demand, so check the app. For context on rising device and chip costs, see <a href="/article/why-gadgets-are-getting-more-expensive-2026">why gadgets are getting more expensive in 2026</a>.</p>

<h2 id="drivers-and-cities">What Robotaxis Mean for Drivers and Cities</h2>

<p>The US Bureau of Labor Statistics counted about <a href="https://www.bls.gov/ooh/transportation-and-material-moving/taxi-drivers-and-chauffeurs.htm" rel="noopener">447,900 taxi drivers, shuttle drivers and chauffeurs in 2024</a> and projects 9% growth to 2034. That projection was published in 2025, before this year's rapid expansion, so treat it with care. Heavy truck drivers, about 2.2 million jobs in 2024, are a separate story: driverless trucks are a different industry from robotaxis. Worker anxiety is real, though. Residents in Wuhan have protested robotaxis in the past over job losses. The same AI investment wave is reshaping work elsewhere, as in <a href="/article/big-tech-725-billion-ai-spending-layoffs-2026">Big Tech's $725 billion AI spending and layoffs</a>.</p>

<p>Cities face practical questions too: stalled fleets, emergency scenes and curb space. Texas has required state authorization for commercial driverless operators since May 28, 2026, and operators must file first-responder plans.</p>

<h2 id="robotaxi-faq">Robotaxi FAQ</h2>

<h3>What is a robotaxi?</h3>
<p>A robotaxi is a driverless ride-hailing car you book in an app. It typically runs at SAE Level 4, driving itself inside a mapped area with no human driver. Some services still carry a supervisor and are best seen as pilots.</p>

<h3>How do robotaxis work?</h3>
<p>Cameras, radar and usually lidar feed an AI driving system. Remote staff can offer guidance in tricky situations, and fleets run only inside areas the operator has mapped and approved.</p>

<h3>Is a Tesla with FSD a robotaxi?</h3>
<p>No. FSD (Supervised) is Level 2 driver assistance, and you must watch the road. Tesla's separate Robotaxi service uses company-run cars. Tesla said on October 21, 2026 that unsupervised FSD could reach customer cars around Q2 2027.</p>

<h3>Where can I ride one?</h3>
<p>As of October 2026: Waymo in 15 US metros, Tesla in six cities without an in-car supervisor, Zoox in Las Vegas (paid) and San Francisco (free), plus Baidu, WeRide and Pony.ai in China and the Gulf. Availability changes quickly, so check each app.</p>

<h3>Are robotaxis safe?</h3>
<p>Waymo's data through June 2026 shows far fewer injury crashes than human benchmarks, but recalls show gaps in rare situations. Tesla's safety figures are self-reported and cover far fewer miles. See the safety section above.</p>

<h3>How much do they cost?</h3>
<p>In San Francisco, Obi found Waymo averaged $19.69, Uber $17.47 and Tesla $8.17 (with a safety driver) in late 2025. Waymo prices rose 18% by spring 2026.</p>

<h3>Are there robotaxis outside the US?</h3>
<p>Yes. China has the most, with Baidu, Pony.ai and WeRide. Abu Dhabi and Dubai run fully driverless services, and Pony.ai serves riders in Qatar, Singapore and South Korea. London and Zagreb have supervised services. We found no confirmed public robotaxi service in Nigeria or elsewhere in Africa as of October 2026.</p>

<h2 id="bottom-line">Robotaxis in 2026: The Bottom Line</h2>

<p>Robotaxis have moved from demo to daily service, led by Waymo, with Chinese and Gulf operators scaling fast. Tesla is a serious entrant with a small fleet and open regulatory questions. Dates to watch: Tesla's NHTSA answers (October 30), Cybercab rides in Dallas (November), Tesla's shareholder meeting (December 3) and Waymo's year-end goal of 1 million weekly rides. Fast-moving topics are also where AI summaries go stale, which is why every figure here carries a date, as we explain in <a href="/article/ai-search-changing-the-internet">how AI search is changing the internet</a>.</p>

<p><strong>Would you ride in a car with no driver? Share this guide and tell us where you stand.</strong></p>`;
