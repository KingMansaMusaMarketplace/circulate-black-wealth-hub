import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { AgentSpotlight } from "./components/AgentSpotlight";
import { DeptMontage } from "./components/DeptMontage";
import { TitleCard } from "./components/TitleCard";
import { AgenticClosingCTA } from "./components/AgenticClosingCTA";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

export const AgenticVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      <Audio src={staticFile("audio/vo-agentic.mp3")} volume={1} />

      <Series>
        <Series.Sequence durationInFrames={s(8.5)}>
          <TitleCard eyebrow="1325.AI Presents" title="Meet Your AI C-Suite" subtitle="33 agentic employees. One subscription. Zero excuses." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(16.5)}>
          <AgentSpotlight image="images/agents/kayla-ceo.jpg" number="#01" name="Kayla" title="Chief Executive Officer" responsibility="Leads the entire AI workforce. Sets strategy, allocates resources, and ensures every agent works in concert to grow your business." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-operations.jpg" number="#02" name="Kayla Ops" title="Chief Operating Officer" responsibility="Runs day-to-day operations. Manages workflows, automates routine tasks, and keeps your business humming twenty-four seven." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-finance.jpg" number="#03" name="Kayla Finance" title="Chief Financial Officer" responsibility="Owns your numbers. Tracks revenue, manages cash flow, generates reports, and forecasts growth in real time." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-marketing.jpg" number="#04" name="Kayla Marketing" title="Chief Marketing Officer" responsibility="Builds your brand. Crafts campaigns, writes content, manages social, and turns audiences into loyal customers." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-revenue.jpg" number="#05" name="Kayla Revenue" title="Chief Revenue Officer" responsibility="Closes the deals. Qualifies leads, runs sales sequences, follows up relentlessly, and drives top-line growth." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-tech.jpg" number="#06" name="Kayla Tech" title="Chief Technology Officer" responsibility="Powers your stack. Integrates tools, monitors uptime, secures data, and keeps your infrastructure rock solid." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-growth.jpg" number="#07" name="Kayla Growth" title="Chief Growth Officer" responsibility="Finds the next wave. Tests new channels, optimizes funnels, and unlocks compounding growth loops." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-legal.jpg" number="#08" name="Kayla Legal" title="Chief Legal Officer" responsibility="Protects your business. Drafts contracts, monitors compliance, and flags risk before it becomes a problem." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(13.5)}>
          <AgentSpotlight image="images/agents/kayla-ir.jpg" number="#09" name="Kayla IR" title="Chief Investor Relations Officer" responsibility="Speaks to capital. Manages investor updates, prepares reports, and keeps stakeholders engaged and confident." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(5.5)}>
          <TitleCard eyebrow="And Behind Them" title="24 Specialists" subtitle="Working in five elite departments — every hour, every day." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(26.5)}>
          <DeptMontage image="images/agents/dept-finance.jpg" department="Finance" members={["#10 · Bookkeeper","#11 · Tax Strategist","#12 · Invoice Manager","#13 · Collections Agent","#14 · Budget Analyst"]} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(26.5)}>
          <DeptMontage image="images/agents/dept-marketing.jpg" department="Marketing" members={["#15 · Content Writer","#16 · Social Manager","#17 · SEO Specialist","#18 · Email Strategist","#19 · Brand Designer"]} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(26.5)}>
          <DeptMontage image="images/agents/dept-operations.jpg" department="Operations" members={["#20 · Customer Support","#21 · Scheduler","#22 · Vendor Liaison","#23 · Quality Auditor","#24 · HR Coordinator"]} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(26.5)}>
          <DeptMontage image="images/agents/dept-growth.jpg" department="Growth" members={["#25 · Lead Researcher","#26 · Outbound SDR","#27 · Funnel Optimizer","#28 · Partnership Scout"]} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(26.5)}>
          <DeptMontage image="images/agents/dept-community.jpg" department="Community" members={["#29 · Reviews Manager","#30 · PR Liaison","#31 · Event Coordinator","#32 · Loyalty Programs","#33 · Ambassador Lead"]} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(8.5)}>
          <TitleCard eyebrow="The Math" title="$2M+ team. $299/month." subtitle="Replace what used to take a 33-person workforce." />
        </Series.Sequence>

        <Series.Sequence durationInFrames={s(70)}>
          <AgenticClosingCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
