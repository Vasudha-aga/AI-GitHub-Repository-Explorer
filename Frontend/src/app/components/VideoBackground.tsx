import { useEffect, useRef } from "react";
import Hls from "hls.js";

const MUX_STREAM = "https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8";
const LIGHT_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4";

interface VideoBackgroundProps {
  overlayOpacity?: number;
  className?: string;
  overlayGradient?: string;
  blur?: number;
  /** "dark" uses the HLS stream; "light" uses the MP4 */
  theme?: "dark" | "light";
}

export function VideoBackground({
  overlayOpacity = 0.72,
  className = "",
  overlayGradient,
  blur = 0,
  theme = "dark",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (theme === "light") {
      video.src = LIGHT_VIDEO;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false, backBufferLength: 0 });
      hls.loadSource(MUX_STREAM);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = MUX_STREAM;
      video.addEventListener("loadedmetadata", () => video.play().catch(() => {}));
    }
  }, [theme]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: blur ? `blur(${blur}px) saturate(1.1)` : "saturate(1.1)", transform: "scale(1.04)" }}
      />
      <div className="absolute inset-0" style={{ background: `rgba(${theme === "light" ? "240,240,248" : "4,4,8"}, ${overlayOpacity})` }} />
      {overlayGradient && <div className="absolute inset-0" style={{ background: overlayGradient }} />}
    </div>
  );
}
