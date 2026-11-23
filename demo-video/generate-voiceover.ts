import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { execSync } from "child_process";

// Load .env
const envPath = new URL(".env", import.meta.url).pathname;
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^(\w+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY || API_KEY === "your-key-here") {
  console.error("Set ELEVENLABS_API_KEY in .env");
  process.exit(1);
}

// Voice configuration
// "Aria" is a warm, natural female voice. Change voiceId for a different voice.
// Browse voices at https://elevenlabs.io/voice-library
// Good Indian English options: search "Indian" in the voice library
const VOICE_ID = "9BWtsMINqrJLrRacOk9x"; // Aria — warm, expressive female
const MODEL_ID = "eleven_multilingual_v2";

const SCENES: { id: string; text: string; startMs: number }[] = [
  {
    id: "scene1",
    startMs: 500,
    text: "Shaadi Invites. Beautiful digital wedding invitations — created in minutes.",
  },
  {
    id: "scene2a",
    startMs: 5500,
    text: "Start by choosing from eighteen premium templates. Each one designed for Indian weddings.",
  },
  {
    id: "scene3a",
    startMs: 13500,
    text: "Enter the couple's names and family details. The invitation preview updates in real time.",
  },
  {
    id: "scene3b",
    startMs: 20000,
    text: "Add the wedding date, venue, and ceremony details. Every field is reflected instantly on the invitation.",
  },
  {
    id: "scene3c",
    startMs: 27000,
    text: "Include additional celebrations — Mehendi, Sangeet, Reception — each with its own date and venue.",
  },
  {
    id: "scene3d",
    startMs: 33500,
    text: "Choose background music, add a dress code, and personalise the finishing touches.",
  },
  {
    id: "scene4a",
    startMs: 38500,
    text: "With one click, the invitation goes live — with its own unique shareable link.",
  },
  {
    id: "scene4b",
    startMs: 43000,
    text: "Copy the link, or send it directly on WhatsApp. Your customer gets a beautiful invitation, ready to share with guests.",
  },
  {
    id: "scene4c",
    startMs: 49500,
    text: "From choosing a template to a published invitation — the entire process takes under five minutes.",
  },
  {
    id: "scene5a",
    startMs: 56000,
    text: "Add digital invitations to your store with Shaadi Invites. Eighteen templates. One-click publishing. WhatsApp delivery.",
  },
  {
    id: "scene5b",
    startMs: 65000,
    text: "Get started today at shaadiinvites.in.",
  },
];

const OUT_DIR = "public/audio/elevenlabs";

async function generateScene(scene: (typeof SCENES)[number]) {
  console.log(`Generating: ${scene.id} — "${scene.text.slice(0, 50)}..."`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    console.error(`  FAILED (${response.status}): ${err}`);
    return false;
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const outPath = `${OUT_DIR}/${scene.id}.mp3`;
  writeFileSync(outPath, audioBuffer);

  // Get duration with ffprobe
  try {
    const dur = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${outPath}"`,
    )
      .toString()
      .trim();
    console.log(`  ✓ ${outPath} (${parseFloat(dur).toFixed(1)}s)`);
  } catch {
    console.log(`  ✓ ${outPath}`);
  }
  return true;
}

async function mixFinalAudio() {
  console.log("\nMixing final audio track...");

  // Build ffmpeg filter to place each segment at its start time
  const inputs = SCENES.map((s) => `-i ${OUT_DIR}/${s.id}.mp3`).join(" ");
  const delays = SCENES.map(
    (s, i) => `[${i}]adelay=${s.startMs}|${s.startMs}[d${i}]`,
  ).join(";");
  const mixInputs = SCENES.map((_, i) => `[d${i}]`).join("");

  // Create 75s silence base
  execSync(
    `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 75 -acodec pcm_s16le ${OUT_DIR}/silence.wav 2>/dev/null`,
  );

  const cmd = `ffmpeg -y -i ${OUT_DIR}/silence.wav ${inputs} -filter_complex "${delays};[0]volume=0[base];[base]${mixInputs}amix=inputs=${SCENES.length + 1}:duration=first:normalize=0" -acodec pcm_s16le public/audio/narration-elevenlabs.wav 2>/dev/null`;
  execSync(cmd);

  // Mix with BGM
  execSync(
    `ffmpeg -y -i public/audio/narration-elevenlabs.wav -i public/audio/bgm.wav -filter_complex "[0]volume=1.0[voice];[1]volume=0.15[music];[voice][music]amix=inputs=2:duration=first:normalize=0" -acodec pcm_s16le public/audio/final-mix-elevenlabs.wav 2>/dev/null`,
  );

  // Clean up
  execSync(`rm -f ${OUT_DIR}/silence.wav`);

  console.log("✓ public/audio/narration-elevenlabs.wav");
  console.log("✓ public/audio/final-mix-elevenlabs.wav");
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let totalChars = 0;
  for (const scene of SCENES) totalChars += scene.text.length;
  console.log(
    `Generating ${SCENES.length} segments (${totalChars} characters total)\n`,
  );

  for (const scene of SCENES) {
    const ok = await generateScene(scene);
    if (!ok) {
      console.error("Aborting due to API error.");
      process.exit(1);
    }
    // Small delay between requests
    await new Promise((r) => setTimeout(r, 500));
  }

  await mixFinalAudio();

  console.log(
    "\nDone! Update DemoVideo.tsx to use 'audio/final-mix-elevenlabs.wav'",
  );
}

main();
