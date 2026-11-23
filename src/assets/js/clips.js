// Game clips: play a muted, looping clip while it is on screen, unless the device asks for reduced
// motion. A clip the visitor pauses stays paused. Without this script the clips wait for Play.
const clips = document.querySelectorAll('video[data-clip]');
if (clips.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const auto = new WeakSet(); // pauses made here, not by the visitor
  const stopped = new WeakSet();
  const seen = new IntersectionObserver((entries) => {
    for (const { target: v, isIntersecting } of entries) {
      if (isIntersecting && !stopped.has(v)) v.play().catch(() => {});
      else if (!isIntersecting && !v.paused) { auto.add(v); v.pause(); }
    }
  }, { threshold: 0.4 });
  for (const v of clips) {
    v.addEventListener('pause', () => { if (!auto.delete(v) && !document.hidden) stopped.add(v); });
    v.addEventListener('play', () => stopped.delete(v));
    seen.observe(v);
  }
}
