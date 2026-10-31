const cloudSheet = document.querySelector(".cloud-sheet");
const storyPages = [...document.querySelectorAll("[data-phone-screen]")];
const phone = document.querySelector("#sharedDevice");
const phoneContent = document.querySelector("#phoneContent");
const sharedStage = document.querySelector(".shared-stage");
const journey = document.querySelector(".phone-journey");
const stageLabel = document.querySelector("#stageLabel");
const stageCaption = document.querySelector("#stageCaption");
let framePending = false;
let currentScreen = "";
let switchTimer;

const songRows = `
  <div class="screen-songlist">
    <div class="screen-song"><span class="song-thumb"></span><span class="song-info"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="song-duration">03:48</span></div>
    <div class="screen-song"><span class="song-thumb sky"></span><span class="song-info"><strong>Normal No More</strong><small>椅子乐团</small></span><span class="song-duration">04:12</span></div>
    <div class="screen-song"><span class="song-thumb mint"></span><span class="song-info"><strong>海边的风</strong><small>Lovely Sunday</small></span><span class="song-duration">03:26</span></div>
  </div>`;

const screens = {
  home: `
    <div class="phone-screen">
      <div class="screen-head"><div><div class="screen-kicker">GOOD EVENING</div><div class="screen-title">听点喜欢的</div></div><span class="screen-avatar">声</span></div>
      <div class="screen-search"><span>⌕</span> 搜索歌曲、艺术家、专辑</div>
      <div class="screen-section-label"><strong>最近收藏</strong><span>全部　→</span></div>
      <div class="screen-albums">
        <div class="screen-album"><div class="album-art album-sunset"><i></i></div><div class="album-name">深蓝</div><div class="album-artist">陈婧霏</div></div>
        <div class="screen-album"><div class="album-art album-sky"><i></i></div><div class="album-name">Lovely Sunday</div><div class="album-artist">椅子乐团</div></div>
      </div>
      <div class="screen-section-label"><strong>最近播放</strong><span>⋯</span></div>
      ${songRows}
      <div class="mini-player"><span class="mini-cover"></span><span class="mini-song"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="play-symbol">Ⅱ</span></div>
    </div>`,
  intro: `
    <div class="phone-screen screen-intro">
      <div class="screen-head"><div><div class="screen-kicker">ALL YOUR FAVORITES</div><div class="screen-title">一处安放</div></div><span class="screen-avatar">✳</span></div>
      <div class="screen-search"><span>⌕</span> 搜索喜欢的音乐</div>
      <div class="screen-section-label"><strong>你的音乐</strong><span>都在这里　→</span></div>
      <div class="intro-library-card"><div class="intro-library-art"><i></i><i></i><i></i></div><div><strong>音乐库</strong><small>本地收藏与歌单</small></div><b>→</b></div>
      <div class="screen-section-label"><strong>最近喜欢</strong><span>全部　♡</span></div>
      ${songRows}
      <div class="intro-source-row"><span>本地音乐</span><i>✳</i><span>更多来源</span></div>
      <div class="mini-player"><span class="mini-cover"></span><span class="mini-song"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="play-symbol">Ⅱ</span></div>
    </div>`,
  library: `
    <div class="phone-screen">
      <div class="screen-head"><div><div class="screen-kicker">YOUR MUSIC</div><div class="screen-title">音乐库</div></div><span class="screen-avatar">♫</span></div>
      <div class="screen-search"><span>⌕</span> 搜索本地音乐</div>
      <div class="screen-section-label"><strong>专辑</strong><span>最近添加　⌄</span></div>
      <div class="screen-albums">
        <div class="screen-album"><div class="album-art album-sunset"><i></i></div><div class="album-name">深蓝</div><div class="album-artist">陈婧霏 · 9 首</div></div>
        <div class="screen-album"><div class="album-art album-sky"><i></i></div><div class="album-name">Lovely Sunday</div><div class="album-artist">椅子乐团 · 10 首</div></div>
        <div class="screen-album"><div class="album-art album-mint"><i></i></div><div class="album-name">慢慢喜欢你</div><div class="album-artist">莫文蔚 · 12 首</div></div>
        <div class="screen-album"><div class="album-art album-violet"><i></i></div><div class="album-name">Aerial</div><div class="album-artist">Kate Bush · 16 首</div></div>
      </div>
      <div class="mini-player"><span class="mini-cover"></span><span class="mini-song"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="play-symbol">Ⅱ</span></div>
    </div>`,
  lyrics: `
    <div class="phone-screen screen-lyrics">
      <div class="lyrics-top"><span>‹</span><span>正在播放</span><span>⋯</span></div>
      <div class="lyrics-cover"><i></i></div>
      <div class="lyrics-song-title">晚风经过</div><div class="lyrics-artist">陈婧霏　·　深蓝</div>
      <div class="lyrics-lines"><span>夜色轻轻落在肩上</span><span class="current">你从晚风里经过</span><span>像一场温柔的回响</span><span>陪我穿过漫长时光</span></div>
      <div class="lyrics-progress"><div class="progress-track"><i></i></div><div class="progress-time"><span>01:24</span><span>03:48</span></div></div>
    </div>`,
  playlist: `
    <div class="phone-screen screen-playlist">
      <div class="screen-head"><div><div class="screen-kicker">MADE BY YOU</div><div class="screen-title">我的歌单</div></div><span class="screen-avatar">＋</span></div>
      <div class="screen-playlist-art"><i></i></div>
      <div class="screen-playlist-title">散步时听</div><div class="screen-playlist-sub">今天也慢慢走　·　08 首</div>
      <div class="screen-section-label"><strong>歌单曲目</strong><span>播放全部　▶</span></div>
      ${songRows}
      <div class="mini-player"><span class="mini-cover"></span><span class="mini-song"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="play-symbol">Ⅱ</span></div>
    </div>`,
  open: `
    <div class="phone-screen screen-open">
      <div class="screen-head"><div><div class="screen-kicker">SOURCES, YOUR WAY</div><div class="screen-title">音乐来源</div></div><span class="screen-avatar">⌕</span></div>
      <div class="screen-search"><span>⌕</span> 搜索歌曲或歌单</div>
      <div class="provider-head"><small>OPEN PROVIDERS</small><strong>连接你的音乐世界</strong></div>
      <div class="provider-list">
        <div class="provider-row"><span class="provider-symbol">♫</span><strong>本地音乐</strong><small>已连接</small></div>
        <div class="provider-row"><span class="provider-symbol">⌁</span><strong>Music Provider</strong><small>可扩展</small></div>
        <div class="provider-row"><span class="provider-symbol">♡</span><strong>统一收藏</strong><small>跨来源</small></div>
      </div>
      <div class="provider-privacy"><i></i> 听歌记录保存在本地</div>
      <div class="mini-player"><span class="mini-cover"></span><span class="mini-song"><strong>晚风经过</strong><small>陈婧霏 · 深蓝</small></span><span class="play-symbol">Ⅱ</span></div>
    </div>`
};

const stageCopy = {
  home: ["YOUR SOUNDSPACE", "MADE FOR LISTENING"],
  intro: ["ALL YOUR FAVORITES", "ONE HOME FOR MUSIC"],
  library: ["YOUR LIBRARY", "LOCAL MUSIC"],
  lyrics: ["WORDS IN TIME", "SYNCED LYRICS"],
  playlist: ["MADE BY YOU", "YOUR PLAYLISTS"],
  open: ["OPEN PROVIDERS", "MUSIC, YOUR WAY"]
};

const phonePoses = {
  home: { x: 0, yaw: 0, scale: 1, pitch: 4, roll: -3, lift: 0 },
  intro: { x: -100, yaw: 360, scale: 1.04, pitch: 3, roll: -1, lift: 0 },
  library: { x: -50, yaw: 360, scale: 1, pitch: 0, roll: 0, lift: 0 },
  lyrics: { x: 0, yaw: 333, scale: 1.24, pitch: -8, roll: 4, lift: -5 },
  playlist: { x: 0, yaw: 350, scale: .82, pitch: 3, roll: -2, lift: 0 },
  open: { x: -50, yaw: 360, scale: .9, pitch: 0, roll: 0, lift: 0 }
};
const poseProperties = ["x", "yaw", "scale", "pitch", "roll", "lift"];

function blendPose(from, to, progress) {
  const eased = progress * progress * (3 - 2 * progress);
  return Object.fromEntries(poseProperties.map((property) => [
    property,
    from[property] + (to[property] - from[property]) * eased
  ]));
}

function getPhonePose() {
  const sequence = ["intro", "library", "lyrics", "playlist", "open"];
  let pose = phonePoses.home;
  let previousName = "home";
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;

  for (const name of sequence) {
    const page = document.querySelector(`#${name === "playlist" ? "playlists" : name}`);
    const pageTop = page.getBoundingClientRect().top + scrollY;
    const start = pageTop - viewportHeight * .8;
    const end = pageTop - viewportHeight * .2;
    if (scrollY < start) break;
    const progress = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
    pose = blendPose(phonePoses[previousName], phonePoses[name], progress);
    if (progress < 1) return pose;
    previousName = name;
    pose = phonePoses[name];
  }
  return pose;
}

function setScreen(name) {
  if (!screens[name] || currentScreen === name) return;
  currentScreen = name;
  journey.dataset.scene = name;
  const screen = phoneContent.querySelector(".phone-screen");
  if (screen) screen.classList.add("is-switching");
  window.clearTimeout(switchTimer);
  switchTimer = window.setTimeout(() => {
    phoneContent.innerHTML = screens[name];
    const [label, caption] = stageCopy[name];
    stageLabel.textContent = label;
    stageCaption.textContent = caption;
  }, 170);
}

function updateScrollState() {
  const pose = getPhonePose();
  sharedStage.style.setProperty("--stage-shift", `${pose.x}%`);
  phone.style.setProperty("--pose-yaw", `${pose.yaw}deg`);
  phone.style.setProperty("--pose-pitch", `${pose.pitch}deg`);
  phone.style.setProperty("--pose-roll", `${pose.roll}deg`);
  phone.style.setProperty("--phone-lift", `${pose.lift}px`);
  phone.style.setProperty("--device-scale", String(pose.scale));
  phone.style.setProperty("--device-scale-mobile", String(pose.scale * .72));

  const marker = window.innerHeight * .48;
  let nearest = storyPages[0];
  let nearestDistance = Infinity;
  for (const page of storyPages) {
    const rect = page.getBoundingClientRect();
    const center = rect.top + Math.min(rect.height, window.innerHeight) * .48;
    const distance = Math.abs(center - marker);
    if (distance < nearestDistance) {
      nearest = page;
      nearestDistance = distance;
    }
  }
  setScreen(nearest.dataset.phoneScreen);

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  const driftX = Math.sin(window.scrollY * .00022) * 36;
  const driftY = -Math.min(window.scrollY * .012, 72) + Math.sin(window.scrollY * .00016) * 22;
  const cloudScale = 1.02 + Math.sin(window.scrollY * .00012) * .018;
  cloudSheet.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) scale(${cloudScale})`;
  framePending = false;
}

function requestScrollUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateScrollState);
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
setScreen("home");
updateScrollState();
document.documentElement.classList.add("js");
