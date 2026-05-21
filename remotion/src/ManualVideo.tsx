import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { TitleCard } from "./components/TitleCard";
import { DeptMontage } from "./components/DeptMontage";
import {
  SceneFounder,
  SceneProblem,
  ScenePlatform,
  SceneROI,
  SceneAncillary,
  SceneMoat,
  SceneAsk,
} from "./scenes/manual/ManualScenes";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// Timeline (must match generate-vo-manual.mjs)
// 1:17  2:26  3:22  4:30  5:38 (5 depts × 7.6s)  6:28  7:24  8:22  9:33  = 240s = 7200f
export const MANUAL_TOTAL = s(240);

export const ManualVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      <Audio src={staticFile("audio/vo-manual.mp3")} volume={1} />

      <Series>
        {/* 1 · Cover */}
        <Series.Sequence durationInFrames={s(17)}>
          <TitleCard
            eyebrow="1325.AI · Complete Platform Manual"
            title="The Agentic OS"
            subtitle="for the next billion businesses · Thomas D. Bowling, Founder · Chairman · Chief Architect"
          />
        </Series.Sequence>

        {/* 2 · Founder letter */}
        <Series.Sequence durationInFrames={s(26)}>
          <SceneFounder />
        </Series.Sequence>

        {/* 3 · Problem */}
        <Series.Sequence durationInFrames={s(22)}>
          <SceneProblem />
        </Series.Sequence>

        {/* 4 · Platform overview */}
        <Series.Sequence durationInFrames={s(30)}>
          <ScenePlatform />
        </Series.Sequence>

        {/* 5 · Workforce — 5 dept montages */}
        <Series.Sequence durationInFrames={s(7.6)}>
          <DeptMontage image="images/agents/dept-finance.jpg" department="Finance" members={["#10 · Bookkeeper","#11 · Tax Strategist","#12 · Invoice Manager","#13 · Collections","#14 · Budget Analyst"]} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={s(7.6)}>
          <DeptMontage image="images/agents/dept-marketing.jpg" department="Marketing" members={["#15 · Content","#16 · Social","#17 · SEO","#18 · Email","#19 · Brand"]} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={s(7.6)}>
          <DeptMontage image="images/agents/dept-operations.jpg" department="Operations" members={["#20 · Support","#21 · Scheduling","#22 · Vendors","#23 · Quality","#24 · HR"]} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={s(7.6)}>
          <DeptMontage image="images/agents/dept-growth.jpg" department="Growth" members={["#25 · Lead Research","#26 · Outbound SDR","#27 · Funnel Ops","#28 · Partnerships"]} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={s(7.6)}>
          <DeptMontage image="images/agents/dept-community.jpg" department="Community" members={["#29 · Reviews","#30 · PR","#31 · Events","#32 · Loyalty","#33 · Ambassadors"]} />
        </Series.Sequence>

        {/* 6 · ROI */}
        <Series.Sequence durationInFrames={s(28)}>
          <SceneROI />
        </Series.Sequence>

        {/* 7 · Ancillary */}
        <Series.Sequence durationInFrames={s(24)}>
          <SceneAncillary />
        </Series.Sequence>

        {/* 8 · IP & Moat */}
        <Series.Sequence durationInFrames={s(22)}>
          <SceneMoat />
        </Series.Sequence>

        {/* 9 · The Ask */}
        <Series.Sequence durationInFrames={s(33)}>
          <SceneAsk />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
