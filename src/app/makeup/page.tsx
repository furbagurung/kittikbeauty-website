import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { createWhatsappLink } from "@/lib/whatsapp";

const title = "Professional Makeup Artist Services in Nepal | Kittik Beauty";
const description =
  "Book professional makeup artist services in Nepal with Kittik Beauty for bridal makeup, engagement makeup, party makeup, photoshoot makeup, and home service makeup.";

const services = [
  {
    name: "Bridal Makeup",
    description:
      "Elegant bridal makeup in Nepal for wedding days, receptions, and traditional ceremonies.",
  },
  {
    name: "Engagement Makeup",
    description:
      "Soft, polished engagement makeup designed around your outfit, face, and event style.",
  },
  {
    name: "Party Makeup",
    description:
      "Clean party makeup service for celebrations, formal events, and special evenings.",
  },
  {
    name: "Photoshoot Makeup",
    description:
      "Camera-ready makeup for personal shoots, brand shoots, portraits, and creative projects.",
  },
  {
    name: "Home Service Makeup",
    description:
      "Professional makeup at your preferred location for comfortable, convenient booking.",
  },
];

const reasons = [
  "Professional makeup for special occasions",
  "Beauty-product knowledge from Kittik Beauty",
  "Customized looks based on face, outfit, and event",
  "Clean, premium finish for photos and real life",
  "WhatsApp support for makeup booking in Nepal",
];

const bookingSteps = [
  "Choose your service",
  "Share date, time, and location",
  "Confirm look and requirements",
  "Final booking confirmation on WhatsApp",
];

const faqs = [
  {
    question: "Do you provide bridal makeup in Nepal?",
    answer:
      "Yes. Kittik Beauty provides bridal makeup in Nepal for weddings, receptions, and related ceremonies. Booking details are confirmed through WhatsApp.",
  },
  {
    question: "Can I book party makeup through WhatsApp?",
    answer:
      "Yes. You can book party makeup service through WhatsApp by sharing your preferred date, time, location, and event details.",
  },
  {
    question: "Do you provide home service makeup?",
    answer:
      "Yes. Home service makeup is available based on schedule and location. Share your location on WhatsApp for confirmation.",
  },
  {
    question: "How early should I book makeup service?",
    answer:
      "For bridal and engagement makeup, earlier booking is recommended. For party and photoshoot makeup, contact Kittik Beauty as soon as your date is confirmed.",
  },
  {
    question: "Do you provide makeup for photoshoots?",
    answer:
      "Yes. Kittik Beauty provides photoshoot makeup for portraits, brand content, outdoor shoots, and creative projects.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "makeup artist in Nepal",
    "bridal makeup in Nepal",
    "party makeup service",
    "engagement makeup",
    "photoshoot makeup",
    "makeup booking in Nepal",
    "professional makeup artist",
    "Kittik Beauty makeup service",
  ],
  alternates: {
    canonical: "/makeup",
  },
  openGraph: {
    title,
    description,
    url: "/makeup",
    siteName: "Kittik Beauty",
    type: "website",
  },
};

function bookingMessage(serviceName = "Makeup Service") {
  return [
    "Hello Kittik Beauty, I want to book makeup service.",
    `Service: ${serviceName}`,
    "Preferred Date:",
    "Preferred Time:",
    "Location:",
  ].join("\n");
}

function StructuredData() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BeautySalon",
      name: "Kittik Beauty",
      url: "https://kittikbeauty.com/makeup",
      description,
      areaServed: {
        "@type": "Country",
        name: "Nepal",
      },
      makesOffer: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: "Makeup artist service",
          areaServed: "Nepal",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "NPR",
          description: "Price on consultation",
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kittikbeauty.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Makeup Services",
          item: "https://kittikbeauty.com/makeup",
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function MakeupServicesPage() {
  return (
    <PageShell>
      <StructuredData />

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1304px] gap-7 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#5F5F5F] uppercase">
              Kittik Beauty makeup service
            </p>
            <h1 className="mt-3 max-w-4xl text-[34px] font-black leading-[1.02] tracking-tight text-brandEmerald sm:text-5xl lg:text-6xl">
              Professional Makeup Artist Services in Nepal
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5F5F5F] sm:text-lg sm:leading-8">
              Book professional makeup services for weddings, engagements,
              parties, photoshoots, and special events with Kittik Beauty.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={createWhatsappLink(bookingMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brandGreen px-6 text-sm font-bold text-white transition hover:bg-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Book on WhatsApp
              </Link>
              <Link
                href="#services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brandGold/35 bg-white px-6 text-sm font-bold text-brandEmerald transition hover:bg-brandCream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
              >
                View Services
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] border border-brandGold/25 bg-brandCream p-5 shadow-[0_18px_48px_rgba(0,69,31,0.08)]">
            <p className="text-sm font-bold text-brandEmerald">Available for</p>
            <div className="mt-4 grid gap-2">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center gap-3 rounded-2xl border border-brandGold/25 bg-white px-4 py-3 text-sm font-bold text-brandEmerald"
                >
                  <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                  {service.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-[26px] font-black leading-tight tracking-tight text-brandEmerald sm:text-4xl">
              Makeup Services
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5F5F5F] sm:text-base">
              Choose a professional makeup artist service and send your booking
              details directly through WhatsApp.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <article
                key={service.name}
                className="flex min-h-[220px] flex-col rounded-[22px] border border-brandGold/25 bg-white p-4 shadow-[0_10px_28px_rgba(0,69,31,0.05)]"
              >
                <div className="flex-1">
                  <h3 className="text-base font-black leading-tight text-brandEmerald">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">
                    {service.description}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-brandGold">
                    Price on consultation
                  </p>
                </div>
                <Link
                  href={createWhatsappLink(bookingMessage(service.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-brandGreen px-4 text-sm font-bold text-white transition hover:bg-brandEmerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandGold"
                >
                  Book on WhatsApp
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1304px] gap-4 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[24px] border border-brandGold/25 bg-white p-5 shadow-[0_10px_28px_rgba(0,69,31,0.05)] sm:p-6">
            <h2 className="text-2xl font-black tracking-tight text-brandEmerald">
              Why Choose Kittik Beauty
            </h2>
            <div className="mt-5 grid gap-3">
              {reasons.map((reason) => (
                <div key={reason} className="flex gap-3 text-sm leading-6 text-[#5F5F5F]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brandGold" aria-hidden="true" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-brandGold/25 bg-brandCream p-5 sm:p-6">
            <h2 className="text-2xl font-black tracking-tight text-brandEmerald">
              Makeup Booking Process
            </h2>
            <div className="mt-5 grid gap-3">
              {bookingSteps.map((step, index) => (
                <div key={step} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brandGreen text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div className="rounded-2xl border border-brandGold/25 bg-white px-4 py-3 text-sm font-bold text-brandEmerald">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[980px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          <h2 className="text-[26px] font-black leading-tight tracking-tight text-brandEmerald sm:text-4xl">
            Makeup Service FAQs
          </h2>
          <div className="mt-5 divide-y divide-brandGold/25 rounded-[24px] border border-brandGold/25 bg-white">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-4 sm:p-5">
                <h3 className="text-base font-black text-brandEmerald">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5F5F5F]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1304px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-[26px] bg-brandGreen p-6 text-white sm:p-8 lg:p-10">
            <h2 className="text-[28px] font-black leading-tight tracking-tight sm:text-4xl">
              Ready to book your makeup look?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Send your service, date, time, and location to Kittik Beauty on
              WhatsApp for makeup booking in Nepal.
            </p>
            <Link
              href={createWhatsappLink(bookingMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-brandEmerald transition hover:bg-[#F3E7C3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Book on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
