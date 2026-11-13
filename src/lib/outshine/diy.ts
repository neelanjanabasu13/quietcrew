import { TRADES, type Finding, type Trade } from "./audit";
import { PLAYBOOKS } from "./playbook";
import { AI_ASSISTANTS, descriptionPrompt, NO_CODE_TOOLS, reviewPrompt, SCREENS, websitePrompt, type AiPrompt, type ToolLink, type UiScreen } from "./sop-visuals";

export interface Sop {
  /** What this SOP achieves, in one line. */
  goal: string;
  /** What the owner needs before starting. */
  youNeed: string[];
  /** Numbered, dummy-proof steps. Each step says exactly where to click and what to type. */
  steps: string[];
  /** Word-for-word scripts the owner can copy, where relevant. */
  scripts: { label: string; text: string }[];
  /** Extra tips that separate a good result from a great one. */
  proTips: string[];
  /** Rough time to complete. */
  time: string;
  /** Trade-specific causes behind the symptom, each with the business change that removes it. */
  rootCauses?: { theme: string; fix: string }[];
  /** Trade-specific photo shot list. */
  shotList?: { shot: string; how: string }[];
  /** Lines the owner must not cross. */
  guardrails?: string[];
  /** Annotated diagrams for steps tied to a specific interface (generic steps get none). */
  screens?: UiScreen[];
  /** Indicative tool links, always shown with the tools disclaimer. */
  tools?: ToolLink[];
  /** Fill-in-the-blank prompts for AI assistants. */
  prompts?: AiPrompt[];
}

/**
 * The DIY playbook: one standard operating procedure per fix kind, written for
 * someone who has never opened Google Business Profile before. Steps name the
 * exact buttons and menus as they appear on google.com/business (also reachable
 * by searching your own business name on Google while signed in).
 */
export function sopFor(f: Finding, trade: Trade, businessName: string, area?: string, directReviewLink?: string): Sop {
  const sop = sopCore(f, trade, businessName);
  const label = TRADES[trade].label;
  if (f.id === "credential") return { ...sop, screens: [SCREENS.description] };
  switch (f.fix) {
    case "review-request": return {
      ...sop,
      steps: directReviewLink ? [`Open your review link using the Your review form link below. Check that it opens the right business before sharing it. The next steps show where to find the link in Google if you need it.`, ...sop.steps] : sop.steps,
      screens: [SCREENS.askReviews, SCREENS.reviewLink],
      tools: [
        { name: "Google Business Profile", url: "https://business.google.com/", bestFor: "Find your review link" },
        { name: "Canva QR generator", url: "https://www.canva.com/qr-code-generator/", bestFor: "Make a printable review card" },
        ...(directReviewLink ? [{ name: "Your review form", url: directReviewLink, bestFor: "Test or share your review link" }] : []),
      ],
      prompts: [reviewPrompt(businessName, label, area)],
    };
    case "review-replies": return { ...sop, screens: [SCREENS.replyReviews] };
    case "description": return { ...sop, screens: [SCREENS.description], prompts: [descriptionPrompt(businessName, label)] };
    case "photos": return { ...sop, screens: [SCREENS.photos] };
    case "posts": return { ...sop, screens: [SCREENS.posts] };
    case "website": return { ...sop, screens: [SCREENS.website], tools: NO_CODE_TOOLS, prompts: [websitePrompt(businessName, label)] };
    default: return sop;
  }
}

function sopCore(f: Finding, trade: Trade, businessName: string): Sop {
  const p = PLAYBOOKS[trade];
  const t = TRADES[trade];
  if (f.id === "credential") return credentialSop(trade, businessName);
  const base = baseSop(f, trade, businessName);
  switch (f.fix) {
    case "review-request":
      return {
        ...base,
        steps: base.steps,
        scripts: [...base.scripts, p.expectationScript],
        ...(f.id === "rating" ? { rootCauses: p.rootCauses } : {}),
        proTips: [...base.proTips, ...(f.id === "rating" ? ["If a concern comes up repeatedly, check what you can change in the service itself."] : [])],
        guardrails: p.guardrails,
      };
    case "review-replies":
      return { ...base, rootCauses: p.rootCauses, guardrails: p.guardrails };
    case "description":
      return {
        ...base,
        steps: base.steps.map((s, i) => i === 3 ? `${s} Customers in your trade search for phrases like: ${p.serviceTerms.join(", ")}. Use the ones you genuinely offer.` : s),
      };
    case "photos":
      return {
        ...base,
        shotList: p.shotList,
        proTips: [...base.proTips.filter((x) => !x.startsWith("If you need filler")), `For graphics only (price lists, offers), paste this into ChatGPT or Canva's Magic Media: "${p.aiPrompt}". Always label these as graphics, never as photos of your work.`],
        guardrails: p.guardrails,
      };
    case "posts":
      return { ...base, proTips: [...base.proTips, `Ideas that work for ${t.label.toLowerCase()}: ${p.postIdeas.join("; ")}.`] };
    default:
      return base;
  }
}

function credentialSop(trade: Trade, businessName: string): Sop {
  const t = TRADES[trade];
  const p = PLAYBOOKS[trade];
  return {
    goal: `Show customers, in plain words, that you hold ${t.credential}, so they trust you before they call.`,
    time: "20 minutes",
    youNeed: ["Your certificate, membership card or licence number", "A Google account that manages your Business Profile", "Access to edit your website, if you have one"],
    steps: [
      "Find your certificate or card and write down the exact scheme name and your registration or licence number.",
      `Check it yourself the way a customer would. ${p.credentialCheck}`,
      "If the public listing is out of date (old address, expired), update it with the scheme first. Customers trust the register over your word.",
      "Go to google.com/business, sign in, click 'Edit profile' and open the 'Description' field.",
      "Add one plain sentence naming the credential and your number, using the script below. Click 'Save'.",
      "If you have a website, add the same sentence near the top of the home page, plus the scheme's logo only if the scheme allows members to use it.",
      "Add one photo of your card or certificate to your Google photos, covering any personal home address.",
      "Search your business name in an incognito window and confirm the sentence shows on your public profile.",
    ],
    scripts: [{ label: "Credential sentence for your profile and website", text: `${businessName} holds ${t.credential} (number [your number]). ${t.credentialPlain} You can check us on the official register any time.` }],
    proTips: ["Name the credential exactly as the scheme writes it. Customers search for it by name.", "Mention it again in replies to reviews where it is relevant, for example after a boiler or rewiring job."],
    guardrails: ["Only claim a credential that is current and held by your business or the person doing the work. False claims can be a criminal offence and get profiles removed.", ...p.guardrails.slice(1)],
  };
}

function baseSop(f: Finding, trade: Trade, businessName: string): Sop {
  const t = TRADES[trade];
  switch (f.fix) {
    case "review-request":
      return {
        goal: "People with a complaint may think to leave a review on their own. A short, optional invitation after every visit or job makes it easier for more customers to share their experience.",
        time: "30 minutes to set up, then 2 minutes per customer",
        youNeed: [
          "A Google account that manages your Business Profile",
          "A smartphone or computer with a browser",
          "A QR code generator, such as the Canva tool linked below",
        ],
        steps: [
          "Go to google.com/business and sign in with the Google account that manages your profile. If you have never claimed your profile, search your business name on Google and click 'Own this business?' to claim it first.",
          "On your profile dashboard, find and click the 'Ask for reviews' button (it may show as 'Share review form'). Google shows you a short link that goes straight to your review form.",
          "Copy the link and open it on your phone. Check that it shows the right business before sharing it.",
          "Open the Canva QR generator linked below. Paste your review link, download the code as a PNG and scan it with your phone before printing.",
          "Print the QR code. Put it on a small card you can hand over, on your invoices, and on a sign near where customers pay. Choose a spot where people can scan it easily.",
          "Save the review link in your phone's notes app so you can text or WhatsApp it to customers in two taps.",
          "Make the invitation part of your regular follow-up, regardless of how the customer felt.",
          "Once a week, check your profile for new reviews and reply to every one (see the review replies SOP if you have it).",
        ],
        scripts: [
          { label: "In person with your QR card", text: "Thanks for choosing us. If you would like to leave an honest Google review, you can scan this whenever you have a minute." },
          { label: "WhatsApp follow-up", text: `Hi [first name], thanks for choosing ${businessName}. If you have a minute, we would appreciate hearing about your experience: [review link]. Thanks, [your name].` },
          { label: "Short text", text: `Thanks for choosing ${businessName}. If you would like to leave a Google review, here is the link: [review link].` },
        ],
        proTips: [
          "Never offer discounts, gifts or prizes for reviews. Google removes incentivised reviews and can suspend profiles.",
          "Give everyone the same opportunity to leave an honest review.",
          "Choose a consistent time, such as after the visit or when you send the final invoice.",
        ],
      };
    case "review-replies":
      return {
        goal: "Reply to every Google review so new customers see an owner who cares.",
        time: "15 minutes to catch up, then 5 minutes a week",
        youNeed: ["A Google account that manages your Business Profile"],
        steps: [
          "Go to google.com/business and sign in.",
          "Click 'Reviews' in the menu. You now see every review customers have left.",
          "Click the 'Replied' filter and switch it to 'Haven't replied' so you only see the reviews still waiting.",
          "Start with the newest review and work backwards. Click 'Reply' under each one.",
          "For 5-star reviews: thank them by name, mention the specific job they mentioned, and invite them back. Two or three sentences is perfect. Use the template below.",
          "For negative reviews: do not argue. Thank them, apologise for their experience, and offer to fix it by phone or email. Never share their personal details or job details publicly. Use the template below.",
          "Reply to every review, old and new. Replying to an old review still counts, because new customers read them.",
          "Turn on email notifications for new reviews in your profile settings so you never miss one again.",
        ],
        scripts: [
          {
            label: "Positive review reply",
            text: `Thank you so much, [name]! It was a pleasure [doing the job they mentioned]. Really appreciate you taking the time, and we're here whenever you need us. - [your name], ${businessName}`,
          },
          {
            label: "Negative review reply",
            text: `Hi [name], thank you for the honest feedback and I'm sorry your experience wasn't what it should have been. That's not the standard we aim for. I'd really like to put this right - please call or email me directly on [your contact] and I'll sort it personally. - [your name], ${businessName}`,
          },
        ],
        proTips: [
          "A calm, kind reply to a bad review impresses new customers more than the bad review damages you. Never get defensive.",
          "Use the customer's first name and mention their actual job. Copy-paste replies that all look identical are worse than short personal ones.",
          "Reply within 24 hours where you can. Speed signals an active, caring business.",
        ],
      };
    case "description":
      return {
        goal: `Write a profile description that lists your real services and area, so Google and customers know exactly what you do.`,
        time: "20 minutes",
        youNeed: ["A Google account that manages your Business Profile", "A list of the services you actually offer"],
        steps: [
          "Go to google.com/business and sign in.",
          "Click 'Edit profile', then scroll to the 'Description' field near the bottom.",
          `Write up to 750 characters describing what you do. Structure it like this: one sentence on who you are and where you work, then your main services, then why customers trust you.`,
          `List at least ${t.minServices} specific services by name. 'Plumbing' is too vague; 'boiler repair, boiler servicing, bathroom installation, leak detection, emergency call-outs' is what customers search for.`,
          `Name the towns and areas you cover. Customers search '${t.label.toLowerCase()} near me' and Google matches your area text.`,
          `If you hold ${t.credential}, say so plainly in the description. ${t.credentialPlain} Only claim it if you genuinely hold it.`,
          "Do not stuff in phone numbers, URLs or all-caps slogans; Google can reject descriptions that look like adverts.",
          "Click 'Save', then search your business name in an incognito window to check the description appears on your public profile.",
        ],
        scripts: [
          {
            label: "Description skeleton to adapt",
            text: `${businessName} is a local ${t.label.toLowerCase()} business serving [your towns]. We offer [service 1], [service 2], [service 3] and [service 4], with [your trust point, e.g. fully insured, 15 years' experience]. [Credential line if you hold one]. Fair prices, tidy work, and we turn up when we say we will.`,
          },
        ],
        proTips: [
          "Write for a customer, not for Google. If a sentence sounds like keyword stuffing, delete it.",
          "Update the description when you add a service. It is a living part of your profile, not a one-off.",
        ],
      };
    case "photos":
      return {
        goal: `Build a photo gallery of at least ${t.minPhotos} genuine photos that makes customers trust you before they call.`,
        time: "One afternoon of shooting, 30 minutes to upload",
        youNeed: ["A smartphone with a decent camera (any phone from the last 5 years is fine)", "A Google account that manages your Business Profile"],
        steps: [
          `Plan your shot list. For ${t.label.toLowerCase()}, customers expect: ${t.expectedPhotos}. Aim for at least ${t.minPhotos} photos in total.`,
          "Shoot in daylight wherever possible. Stand with the light behind you, not behind the subject. Wipe the lens first; it makes a bigger difference than any setting.",
          "Hold the phone sideways (landscape) for rooms, gardens and vans. Hold it upright (portrait) only for people.",
          "Take before and after shots of every job from the same angle. These are the single most convincing photos a trade business can post.",
          "Ask permission before any photo shows a customer's face or the inside of their home. A quick 'mind if I snap this for our Google page?' is enough, and note who said yes.",
          "Get one good photo of you or your team, smiling, in work clothes. Customers book people, not logos.",
          "To upload: go to google.com/business, sign in, click 'Photos', then 'Add photos', and select your shots. Add a short caption to each.",
          "Set a reminder to add 2 or 3 fresh photos every month. An active gallery signals a busy, current business.",
        ],
        scripts: [],
        proTips: [
          "Never use stock photos. Customers spot them instantly and they destroy the trust you are trying to build.",
          "If you need filler images while you build your real gallery, AI tools like ChatGPT or Canva can generate clean graphics (price lists, service menus, seasonal offers). Prompt example: 'A clean, modern price list graphic for a [trade] business, cream background, navy text, minimal style'. Label them as graphics, never as photos of your work.",
          "Your single best photo should be set as your profile cover photo: in 'Photos', find it, click the three dots and choose 'Set as cover'.",
        ],
      };
    case "posts":
      return {
        goal: "Post a short Google update every week so your profile looks alive and customers see recent work.",
        time: "10 minutes a week",
        youNeed: ["A Google account that manages your Business Profile", "A recent photo from a real job"],
        steps: [
          "Go to google.com/business and sign in.",
          "Click 'Add update' (on some screens it is under 'Promote').",
          "Write 2 to 4 sentences about something real: a job you finished this week, a seasonal tip, an open slot, or a new service.",
          "Add one genuine photo from the job. Updates with photos get far more attention.",
          "Add a button: choose 'Call now' or 'Learn more' and point it at your phone number or website.",
          "Click 'Post', then view your public profile to check it appears.",
          "Repeat weekly. Pick a fixed slot, for example Friday afternoon, and treat it like any other job on the list.",
        ],
        scripts: [
          {
            label: "Weekly update template",
            text: `Another [job type] finished in [area] this week. [One sentence about what made it interesting]. If you need [service], we have space next week - call us on [number].`,
          },
          {
            label: "Seasonal tip template",
            text: `[Season] tip from the ${businessName} team: [one genuinely useful tip for homeowners]. If yours needs a proper look, give us a call on [number].`,
          },
        ],
        proTips: [
          "Updates expire from prominence after about a week, which is exactly why the weekly habit matters more than any single post.",
          "Real job photos beat graphics. A slightly imperfect photo of real work always wins.",
        ],
      };
    case "website":
      return {
        goal: "Get a simple, working website linked from your Google profile so customers can check you out and contact you.",
        time: "An afternoon, doing it yourself",
        youNeed: ["A Google account that manages your Business Profile"],
        steps: [
          "If you already have a website, check that the contact or booking link works on your phone. Then go straight to the step for linking your site from Google.",
          "If you need a website, pick one of the no-code tools listed below (they are starting points, not the only options). The quickest route is to open Lovable, paste the ready-made prompt below with your details filled in, and let it build the page for you.",
          "Your page needs exactly five things, in this order: what you do and where, your services as a short list, genuine reviews, real photos, and a big tap-to-call phone button plus a contact form.",
          "Keep it to one page. Customers from Google want to check you are real and ring you, not read an essay.",
          `Only show qualifications you genuinely hold, such as ${t.credential}. ${t.credentialPlain}`,
          "Test it on your own phone: tap the phone number and make sure it dials, and send yourself a message through the contact form.",
          "Link it from Google: go to google.com/business, click 'Edit profile', then 'Contact', paste your website address into the 'Website' field and save.",
          "Search your business name in an incognito window and click the Website button on your profile to confirm it works.",
        ],
        scripts: [],
        proTips: [
          "A tap-to-call button that works on mobile is worth more than every other feature combined. Most of your visitors are on phones.",
          "One page that loads fast beats five pages that load slowly. Google also favours fast pages.",
        ],
      };
  }
}

/**
 * Bonus guide included in every Fix Pack: claiming the free ChatGPT business
 * listing OpenAI is rolling out. Written honestly: availability is limited and
 * the exact screens may change as OpenAI expands it.
 */
export function chatgptListingSop(businessName: string, area?: string): Sop {
  const hub = { name: "Businesses in ChatGPT", url: "https://openai.com/business/businesses-in-chatgpt/", bestFor: "Check eligibility and open Business Hub" };
  return {
    goal: "Give people checking your services, location or contact details a current source of information about your business.",
    time: "Allow time for verification",
    youNeed: ["Your official website, contact details and booking or enquiry link", "A list of confirmed services and opening hours"],
    tools: [hub],
    steps: [
      `Open the Businesses in ChatGPT link below, select Claim your business and sign in. Search for ${businessName} and check the details before selecting it. Follow the verification steps if offered. If you cannot claim it yet, you can still prepare your details and run the checks below.`,
      "Gather your public name, address or service area, hours, website, contact details and services. Test the links on your phone. Include prices or policies only if you can confirm them.",
      "Use the prompt below to draft a description in your own voice. Check every detail, fill in the placeholders and submit the confirmed information in the fields available in Business Hub.",
      "When the changes are public, check your profile and click the website or contact link. Ask an assistant one discovery question without your business name, one question about your business details, and one about a confirmed service. Save the question, answer and any source links.",
      "If an answer is unclear, open any cited page to see what it actually says. Fix inaccurate or missing details on pages you control. After the fix is public, repeat the same question with the same assistant and search setting.",
    ],
    scripts: [],
    prompts: [{
      label: "Draft a profile in your own voice",
      openIn: AI_ASSISTANTS,
      text: `Write a business profile for ${businessName} in ${area || "[your area]"}. Confirmed facts: [services, hours, website and booking or enquiry link]. Audience: [who we help]. Voice: [paste an anonymised example or your saved voice note]. Boundaries: [words to avoid and any field length limit]. First summarise the voice and flag missing facts. Wait for me to confirm. Then draft three versions: a short introduction, a services-first description and a booking or enquiry-first description. Use British English and only the facts supplied. Leave unknown details in brackets.`,
    }],
    proTips: [
      "Ask questions a real customer would ask: Where can I find [confirmed service] in [area]? Where is [business name] and how do I contact them? Does [business name] offer [confirmed service]?",
      "Check aggregated mentions, website clicks and discovery topics in Business Hub when available. Your before and after questions are spot checks. They cannot establish a ranking or prove what caused an answer to change.",
    ],
    guardrails: [
      "Only claim a business you own or are authorised to represent. Claiming does not guarantee placement or recommendations.",
      "Eligible UK businesses can check profile access. Business Agents are a separate feature, initially available to eligible US ecommerce and online service businesses.",
    ],
  };
}

/** Short fallback used where only a quick step list is needed (e.g. downloads). */
export function diyInstructions(f: Finding, trade: Trade): string[] {
  return sopFor(f, trade, "your business").steps;
}
