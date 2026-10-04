/**
 * CAMILLE MORMAL REVERSE-ENGINEERED PRINCIPLES — INTERNAL IMPLEMENTATION ARCHITECTURE
 * 
 * Reference: https://camillemormal.com/
 * Adapted for: BrandShoots Opening Film & Preloader Experience
 * 
 * 1. Pacing & Tension Over Rapid Stimulation:
 *    Camille Mormal does not spam immediate UI noise. It creates tension through deliberate
 *    darkness, progressive focal cues, and disciplined holds. In BrandShoots, we hold in void black
 *    before revealing the tactile device silhouette, letting anticipation build.
 * 
 * 2. Overlapping Choreography (Continuous Flow vs Isolated Steps):
 *    Animations do not follow a naïve "A ends -> wait -> B begins" pattern. As memory frame 01
 *    undergoes a micro-scale exposure pop, memory frame 02 is already preheated in the DOM and cutting in.
 *    The transitions blend hard cuts, shutter clicks, and micro-crops like a live editor timeline.
 * 
 * 3. Minimal Technical HUD vs Generic HUD:
 *    Reject tacky cyberpunk or futuristic video-game overlays. Instead, adopt restrained, authentic
 *    cinematography director-monitor metadata (REC dot, 35MM T1.5, RAW 4K, 24 FPS, TC 00:04:12:18).
 * 
 * 4. Multi-Layered Physicality & Parallax:
 *    Avoid flat PNG card look. Three distinct spatial coordinate layers exist:
 *    - Deep environment ambient haze / void
 *    - Physical gimbal chassis and chamfered monitor edges
 *    - Recessed glass screen with shifting specular reflections and internal footage depth.
 * 
 * 5. Memory-to-Silence Deceleration:
 *    Following the rapid 5-8 memory blitz, speed abruptly drops. Motion settles into stillness.
 *    The user breathes. Autofocus hunts subtly and snaps sharp.
 * 
 * 6. The "Photo Taken" Climax:
 *    The logo reveal feels like a high-speed camera shutter firing (shutter iris squeeze ->
 *    acoustic/visual CLICK -> blinding 120ms white flash -> aperture burst -> Brand Blue locked).
 * 
 * 7. Screen Expansion as Spatial Handoff:
 *    Never "fade-out" the loader. The physical device viewport zooms towards the camera lens,
 *    its bezels flying outside the screen, until the device screen becomes the 100vw x 100vh viewport
 *    revealing the already-rendered Hero stage. Zero reload, zero unmount flicker.
 */

export const CAMILLE_PRINCIPLES = {
  tensionHoldMs: 300,
  staggerOverlap: 0.18,
  autofocusDuration: 0.45,
  shutterSnapDuration: 0.12,
  expansionDuration: 1.15,
  easing: {
    cinematicOut: "power3.out",
    cinematicInOut: "power4.inOut",
    snapFlash: "expo.out",
    expandViewport: "power4.inOut"
  }
} as const;
