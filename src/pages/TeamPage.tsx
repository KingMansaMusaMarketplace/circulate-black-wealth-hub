import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';

// Background-only pass: all headshots re-composited onto Kayla's navy (#0D1D30)
// so the leadership grid reads as one deliberate gallery. Subjects unchanged.
import clarence from '@/assets/team/navy_bg/Clarence_Smith_v3.jpg';
import craig from '@/assets/team/navy_bg/Craig_Stevenson.jpg';
import dakarai from '@/assets/team/navy_bg/Dakarai_Mosley_headshot.jpg';
import eric from '@/assets/team/navy_bg/Eric_Webb.jpg';
import james from '@/assets/team/navy_bg/James_Carson_headshot.jpg';
import judith from '@/assets/team/navy_bg/Judith_Fitzgerald.jpg';
import keith from '@/assets/team/navy_bg/Keith_McGregory.jpg';
import kimberly from '@/assets/team/navy_bg/Kimberly_Bates_corporate.jpg';
import lisa from '@/assets/team/Lisa_Gavin_navy_v5.jpg';
import maurice from '@/assets/team/navy_bg/Maurice_G.jpg';
import napoleon from '@/assets/team/navy_bg/Napolean_Paul_headshot.jpg';
import stephen from '@/assets/team/navy_bg/Stephen_Hughes.jpg';
import thomas from '@/assets/team/navy_bg/Thomas_D_Bowling_headshot_v2.jpg';
import brandon from '@/assets/team/navy_bg/Brandon_Jones.jpg';
import vaughn from '@/assets/team/navy_bg/Vaughn_Hester.jpg';
import terry from '@/assets/team/navy_bg/Terry_Thompson.jpg';
import john from '@/assets/team/navy_bg/John_Atwater.jpg';
import zay from '@/assets/team/navy_bg/Zay_Barton_v4.jpg';
import sharif from '@/assets/team/navy_bg/Sharif_Abdus_Salaam_headshot.jpg';
import brandonPalm from '@/assets/team/navy_bg/Brando_Palm_headshot.jpg';
import donald from '@/assets/team/navy_bg/Donald_Palm_PhD.jpg';
import corey from '@/assets/team/navy_bg/Corey_Mays_headshot.jpg';
import kayla from '@/assets/team/navy_bg/Kayla_Bruton_navy_v13.jpg';
import douglas from '@/assets/team/navy_bg/Douglas_Morrison_headshot.jpg';
import robert from '@/assets/team/navy_bg/Robert_Wilson_headshot.jpg';
import charlotte from '@/assets/team/navy_bg/Charlotte_Farmer_headshot.jpg';
import joseph from '@/assets/team/navy_bg/Joseph_Weaver.jpg';
import johnClyburn from '@/assets/team/navy_bg/John_Clyburn.jpg';
import jayRoberson from '@/assets/team/navy_bg/Jay_Roberson.jpg';


type Member = {
  name: string;
  title: string;
  photo: string;
  bio?: string;
  linkedin?: string;
  email?: string;
  objectPosition?: string;
  photoScale?: number;
  photoOffsetY?: string;
  fixedPhotoBackground?: boolean;
};

// NOTE: Titles/bios are placeholders — send Kayla the finals and we'll swap them in.
const founder: Member = {
  name: 'Thomas D. Bowling',
  title: 'Founder & Chief Architect',
  photo: thomas,
  bio: 'Inventor of the 1325.AI operating system and the MCP infrastructure layer for the $12T global Black economy.',
  photoScale: 1,
  photoOffsetY: '0%',
};



const leadership: Member[] = [
  { name: 'Craig Stevenson', title: 'Co-Founder', photo: craig },
  { name: 'Lisa Cooper Gavin', title: 'President', photo: lisa, photoScale: 1.15, photoOffsetY: '0%' },
  { name: 'Clarence Smith', title: 'VP of Sales', photo: clarence },
  { name: 'Maurice G. Howard', title: 'VP of Technology', photo: maurice },
  { name: 'Keith McGregory', title: 'VP of Corporate Development', photo: keith },
  { name: 'Judith Fitzgerald, J.D./MPhil', title: 'Resource Development Officer', photo: judith },
  { name: 'Eric Christopher Webb, DDiv.', title: 'VP of Outreach', photo: eric },
  { name: 'Kimberly Bates', title: 'Chief of Staff', photo: kimberly },
  { name: 'James Carson, M.D.', title: 'Chief Social Media Officer', photo: james, photoScale: 1.3, photoOffsetY: '12%' },
  { name: 'Dakarai Mosley', title: 'VP of Entertainment', photo: dakarai },
  { name: 'Stephen Hughes', title: 'VP of Marketing', photo: stephen },
  { name: 'Napoleon Paul', title: 'VP of Media Production & Content Strategy', photo: napoleon },
  { name: 'Brandon Jones, Ph.D.', title: 'Chief Grants Officer', photo: brandon },
  { name: 'Vaughn Hester', title: 'Senior Director of Veteran Affairs', photo: vaughn },
  { name: 'Terry Thompson, M.D.', title: 'Chief Communication Officer', photo: terry },
  { name: 'John G. Atwater, M.D.', title: 'Chief Business Development Officer', photo: john },
  { name: 'Zay Barton', title: 'Director of Youth Entrepreneurship and Curriculum Development', photo: zay },
  { name: 'Sharif Abdus-Salaam, M.D.', title: 'Chief Economic Empowerment Officer', photo: sharif },
  { name: 'Brandon Palm', title: 'Senior (AI) Consultant', photo: brandonPalm },
  { name: 'Donald Palm, Ph.D.', title: 'Chief Education Officer', photo: donald },
  { name: 'Corey Mays', title: 'Chief Sports Officer', photo: corey },
  { name: 'Kayla Bruton', title: 'Senior Contracts Manager', photo: kayla, objectPosition: 'center top', photoScale: 1 },
  { name: 'Douglas K. Morrison', title: 'General Counsel', photo: douglas, photoScale: 0.96 },
  { name: 'Robert H. Wilson, M.D.', title: 'Chief International Officer', photo: robert },
  { name: 'Charlotte Farmer, Ph.D.', title: 'Executive Advisor', photo: charlotte, photoScale: 1.6, photoOffsetY: '22%' },
  { name: 'Joseph Weaver', title: 'Chief Strategy Officer', photo: joseph },
  { name: 'John Clyburn', title: 'Chief Public Policy Officer', photo: johnClyburn },
  { name: 'Jay Roberson', title: 'BD Advisor', photo: jayRoberson },

  
];

const MemberCard = ({ member, index }: { member: Member; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    className="group relative"
  >
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 hover:border-mansagold/40 transition-all duration-500">
      <div className={`aspect-[4/5] overflow-hidden rounded-2xl ${member.fixedPhotoBackground ? 'bg-[hsl(var(--team-photo-background))]' : 'bg-gradient-to-br from-mansablue/40 to-black'}`}>
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            style={{
              objectPosition: member.objectPosition ?? 'center top',
              transform: `translateY(${member.photoOffsetY ?? '0'}) scale(${member.photoScale ?? 1})`,
            }}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mansagold/60 text-6xl font-serif rounded-2xl">
            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-white text-lg font-semibold tracking-tight">{member.name}</h3>
        <p className="text-mansagold text-sm mt-1 font-medium uppercase tracking-wider">{member.title}</p>
        {member.bio && <p className="text-blue-100/70 text-sm mt-3 leading-relaxed">{member.bio}</p>}
        {(member.linkedin || member.email) && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="text-blue-100/60 hover:text-mansagold transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="text-blue-100/60 hover:text-mansagold transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const TeamPage = () => {
  return (
    <>
      <Helmet>
        <title>Leadership & Team | 1325.AI</title>
        <meta name="description" content="Meet the leadership behind 1325.AI — the MCP infrastructure layer for the $12T global Black economy." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/30 via-black to-black" />
          <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-mansagold text-xs md:text-sm uppercase tracking-[0.3em] mb-6"
            >
              Leadership
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight leading-[1.05] mb-8"
            >
              The team building the operating system<br className="hidden md:block" />
              <span className="text-mansagold italic"> for a $12 trillion economy.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="max-w-2xl mx-auto text-blue-100/70 text-lg leading-relaxed"
            >
              Founders, operators, and advisors bringing decades of experience across enterprise
              sales, finance, technology, ministry, and community organizing to power 1325.AI and
              the 42 Agentic AI Employees.
            </motion.p>
          </div>
        </section>

        {/* Founder */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <p className="text-mansagold text-xs uppercase tracking-[0.3em] mb-3">Founder</p>
            <div className="h-px w-16 bg-mansagold/60" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-mansablue/60 to-black border border-mansagold/30 overflow-hidden">
                {founder.photo ? (
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    loading="lazy"
                    style={{
                      objectPosition: founder.objectPosition ?? 'center top',
                      transform: `translateY(${founder.photoOffsetY ?? '0'}) scale(${founder.photoScale ?? 1})`,
                    }}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-2xl">
                    <span className="text-mansagold/70 text-7xl font-serif italic">TB</span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-3">{founder.name}</h2>
              <p className="text-mansagold uppercase tracking-widest text-sm mb-6">{founder.title}</p>
              <p className="text-blue-100/80 text-lg leading-relaxed">{founder.bio}</p>
              <blockquote className="mt-8 pl-6 border-l-2 border-mansagold/60">
                <p className="text-blue-100/90 text-lg italic leading-relaxed">
                  "For too long, we have been divided economically. 1325.AI is the MCP infrastructure layer that turns Black-owned business into global-scale enterprise."
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Leadership grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="mb-10">
            <p className="text-mansagold text-xs uppercase tracking-[0.3em] mb-3">Leadership & Advisors</p>
            <div className="h-px w-16 bg-mansagold/60" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leadership.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 bg-gradient-to-b from-black to-mansablue/20">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">Join us.</h2>
            <p className="text-blue-100/70 max-w-xl mx-auto mb-8">
              We're hiring operators, engineers, and community leaders who want to build the
              infrastructure layer for the global Black economy.
            </p>
            <a
              href="mailto:Partner@1325.AI"
              className="inline-flex items-center gap-2 bg-mansagold text-black font-semibold px-8 py-4 rounded-full hover:bg-mansagold/90 transition-colors"
            >
              <Mail className="w-4 h-4" /> Partner@1325.AI
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default TeamPage;
