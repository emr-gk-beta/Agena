# AGENA — 3 Dakikalık Tanıtım Videosu Senaryosu

**Süre:** 3 dakika · **Hedef:** Engineering lead, dev manager, CTO
**Format:** Screen recording + voiceover + minimal motion graphics
**Diller:** TR (ana) + EN (ayrı render); subtitle'lar SRT olarak burn-in
**Müzik:** Synthwave / lo-fi (Epidemic Sound — `Tides of Time` veya benzeri minimalist), %20 volume

---

## Sahne 1 — Hook (0:00 – 0:15)

| Süre | Eylem |
|---|---|
| 0:00 | Müzik kısık başlasın (intro fade in 1sn). Ekran: gerçek bir Azure DevOps sprint board, 30+ unestimated work item satır satır görünüyor. Kursor üstünden geçiyor, hiç dokunmadan. |
| 0:03 | Üst sağ köşede minimalist counter: "Bu sprint için: **34 work item · 0 story point · 0 atama**". |
| 0:08 | Counter'ın altında ikinci satır kayar: **"Sprint planning toplantısı: 14:00–18:00 · 4 saat"**. |
| 0:12 | Ekran karartılır (1.5sn fade). Tek bir kelime ortada: **"Niye?"** |

**TR Voiceover:**
> Sprint planning. Her hafta. Dört saat. Otuz iş. Sıfır puan.
> Ve her hafta aynı tartışma — kim ne kadar zorlanır, kime atayalım.

**EN Voiceover:**
> Sprint planning. Every week. Four hours. Thirty work items. Zero estimates.
> Same debate every time — who's gonna struggle, who do we assign it to.

---

## Sahne 2 — Boss Mode Reveal (0:15 – 0:30)

| Süre | Eylem |
|---|---|
| 0:15 | Karanlıktan **Boss Mode pixel office** açılır — full screen pixel art, 4 agent masalarında çalışıyor, monitörlerde kod akıyor, kahve buharı yükseliyor. Hafif parallax animasyon (background scroll yavaş). |
| 0:20 | Üst banner: **"AGENA"** logo + tagline "Agentic AI for engineering teams". |
| 0:25 | Pixel agent'lardan birinin masasında "PR #4221 OPENED ✓" notification belirir. Diğerinde "Sentry issue resolved" işareti. |
| 0:28 | Ekran kayma animasyonu — pixel office'ten gerçek dashboard'a transition (1.5sn slide). |

**TR Voiceover:**
> Bu Agena. Senin engineering ekibin için otonom AI agentlar.
> Refinement, code review, bug fix, deployment — hepsi tek platformda.

**EN Voiceover:**
> Meet Agena. Autonomous AI agents for your engineering team.
> Refinement, code review, bug fixes, deploys — one platform.

---

## Sahne 3 — Refinement Demo (0:30 – 1:30) ★ ANA SAHNE

**Bu en uzun sahne, ürünün kalbi. 1 dakikalık tek bir akış göster.**

| Süre | Eylem |
|---|---|
| 0:30 | Sahne: `/dashboard/refinement`. Üstte "BiÖğrenci Sorgulamada Cache'leme" item'ı vurgulanır (görseli daha önce kaydetmiş ekran). Sprint dropdown: "2026_10_Nankatsu". |
| 0:33 | "Çalıştır" butonuna tıklanır. **Run modal açılır** — Agent: Claude CLI, Repo: orkestra (Gelişmiş ▾'da seçili), Language: Turkish. |
| 0:36 | Modal'da "▶ Başlat" butonuna basılır. Modal kapanır, ekranda "⏳ Analiz ediliyor" loading. **Time-lapse cut** — saat ikonu döner. |
| 0:42 | **Sonuç kartı açılır.** Yakın çekim:<br>• **5 SP** · 58% confidence<br>• "Netleştirme gerekli" rozeti<br>• Etkilenen Dosyalar: 4 dosya (ApiLogs.php, ApiClient.php, HttpClient.php, Upgrade.php) — her biri "blame" butonuyla<br>• Önerilen Kişi: **Kadir Doğuş SEÇKİN** ✓ (yeşil rozet, 9 commit · 3 dosya, son 6 ay) |
| 0:55 | Callout animasyonu: yeşil ✓ rozetinin yanında daire çizilir, ok ekranın altındaki "Yaz → Azure DevOps" butonuna işaret eder. |
| 1:00 | "Yaz" butonuna tıklanır. **Modal açılır** — preview: 5 puan, comment text, **"Atayalım: Kadir Doğuş SEÇKİN"** chip'i yeşil. "▶ Yaz" tıklanır. |
| 1:05 | "✓ Yazıldı" yeşil pill. Sayfada satır yeşillenir. |
| 1:08 | **SPLIT-SCREEN BAŞLAR** — sol: Agena (yazıldı durumu); sağ: aynı anda Azure work item açılır. **Story Points field anında 5'e dönüşür**, "Assigned to: Kadir Doğuş SEÇKİN" yazısı belirir, History sekmesinde "[AGENA AI]" yorumu görünür. |
| 1:18 | Split-screen tek ekrana döner. **Counter belirir**: "**90 saniye · SP yazıldı, atama yapıldı, 6 soru PO'ya iletildi**" |
| 1:25 | "Klasik refinement: 4 saat" → animasyonla "**Agena: 90 saniye**" geçişi (sayı animasyonu). |

**TR Voiceover** (1 dakika boyunca):
> Tek bir tıklama. Agena work item'ı okur, kodun kendisini okur — son 6 ayın commit history'sini grepler — ve sana üç şey verir.
>
> Bir, dürüst bir story point — **5 puan**, çünkü cache key tasarımı + TTL kararı + log altyapısı gerekiyor. Hangi geçmiş işe benzediğini de söyler: **#8562, Emrah'ın 5 puanlık Sentry işine.**
>
> İki, **kim yapmalı**. Bu dosyalara son 6 ayda en çok kim commit atmış? Kadir, dokuz commit, üç dosya. Takım listende olduğu için yeşil ✓ rozet alıyor.
>
> Üç — eksik şeyleri sorma listesi. Cache TTL ne, başarısız doğrulama cache'lenmeli mi, invalidasyon nasıl olacak. **PO'ya altı somut soru, hazır.**
>
> Ve "Yaz" tıkladığında — Azure work item'a **SP düşüyor, atama yapılıyor, yorum gidiyor**. Tek call'da. Aynı anda.
>
> Klasik refinement dört saat. Agena ile **90 saniye**.

**EN Voiceover** (mirror):
> One click. Agena reads the work item, reads the code itself — greps the last six months of commits — and gives you three things.
>
> First: an honest story-point estimate — **5 points** — because cache key design plus TTL decision plus logging needs. It tells you which past work it resembles: **#8562, Emrah's 5-point Sentry job.**
>
> Second: **who should do it.** Who's been committing to these files in the last six months? Kadir — nine commits, three files. He's on your team list, so he gets the green checkmark.
>
> Third: a list of what's missing. Cache TTL? Cache failed validations? Invalidation strategy? **Six concrete questions, ready for the PO.**
>
> Click "Write" — and the Azure work item gets the **story points, the assignee, and the comment.** All three. One round trip.
>
> Traditional refinement: four hours. Agena: **ninety seconds.**

**On-screen text overlays:**
- 0:42 "Story Points: **5**"
- 0:48 "Recommended: **Kadir Doğuş SEÇKİN** (9 commits · 3 files)"
- 1:08 (sağ split): Azure DevOps logo + "Updated just now"
- 1:25 "**4 hours → 90 seconds**" (büyük, motion zoom)

---

## Sahne 4 — Skills Catalog (1:30 – 2:00)

| Süre | Eylem |
|---|---|
| 1:30 | `/dashboard/skills` ekranı. 9 default skill listesi görünür: "httpx pagination trap", "asyncio task GC", "Idempotent migrations" vs. |
| 1:35 | Üst banner sınırlanır, animasyon: yeni bir task açılır (yan ekran), "📋 Yeni: Stock allocator pagination". |
| 1:40 | **Animasyon overlay**: yeni task'ın description'ı vector embedding'e dönüşür → Qdrant'taki skills arasında "Stock allocator pattern" %81 match. Skill'in `prompt_fragment`'ı turuncu kutudan agent'ın system prompt'una uçar. |
| 1:50 | Agent çıktısı belirir: "Use SiteBasedAllocator class. Don't compute inline." (ekrandan tek satır olarak akar, typewriter efekti). |
| 1:55 | "✨ Import defaults" butonu pulse animasyonuyla highlight olur. |

**TR Voiceover:**
> Tamamladığınız her iş, tekrar kullanılabilir bir pattern'e dönüşür.
>
> Agena, dün çözdüğünüz **stock allocator** problemini hatırlar. Yarın benzer bir iş geldiğinde, bu pattern'i agent'ın prompt'una otomatik enjekte eder.
>
> Çözümler birikir. Aynı bug ikinci kere yaşanmaz.

**EN Voiceover:**
> Every completed task becomes a reusable pattern.
>
> Agena remembers yesterday's stock allocator fix. When a similar task arrives tomorrow, the pattern is auto-injected into the agent's prompt.
>
> Solutions compound. Same bug never happens twice.

---

## Sahne 5 — Multi-Repo Orchestration + DORA (2:00 – 2:30)

| Süre | Eylem |
|---|---|
| 2:00 | `/dashboard/dora` hub. 7 repo kartı grid'de — her birinde Lead Time / Deploy Freq / CFR / MTTR. Renkli tier rozetleri (Elite / High / Medium). |
| 2:05 | Bir karta hover edilir, **"Sync All"** tıklanır. Animasyonla 7 kartta paralel olarak commit/PR sayıları artarken görünür (1k → 5k → 14k tıkleyerek). |
| 2:15 | Multi-repo task ekranı: tek task → 3 repo seçilmiş → 3 paralel pipeline → 3 ayrı PR açıldı. Branch isimleri ekranda akar: `agentflow/2026_10_30-fix-cache`. |
| 2:25 | Cut: gerçek sayılar — "Bu hafta: 47 tamamlanan task, 23 PR merge, 5 saat ortalama lead time". |

**TR Voiceover:**
> Yedi farklı repoda paralel çalışıyorsun? **Tek task, üç repo, üç PR — eşzamanlı.** Her biri bağımsız, AI pipeline'ı kendi başına koşuyor.
>
> Ve sonuçları görüyorsun. Lead time, deploy sıklığı, change failure rate — her repo için ayrı, gerçek git verisinden.

**EN Voiceover:**
> Seven repos, parallel work? **One task, three repos, three PRs — concurrent.** Each independent, each pipeline running on its own.
>
> And you see the impact. Lead time, deploy frequency, change failure rate — per repo, computed from real git data.

---

## Sahne 6 — 7 Dil Toggle (2:30 – 2:45)

| Süre | Eylem |
|---|---|
| 2:30 | Dashboard üstündeki language picker tıklanır. Dropdown açılır: 🇹🇷 Türkçe · 🇬🇧 English · 🇪🇸 Español · 🇩🇪 Deutsch · 🇨🇳 中文 · 🇮🇹 Italiano · 🇯🇵 日本語. |
| 2:33 | Hızlı dil geçişi animasyonu — TR → JA → DE → ZH her birinde sayfa anında değişir, 1.5sn arayla. |
| 2:42 | EN'de durur. Static. |

**TR Voiceover:**
> Yedi dilde çalışıyor. Tüm UI, tüm prompt'lar, hatta refinement çıktısı kullanıcının dilinde.

**EN Voiceover:**
> Seven languages. All UI, all prompts, even refinement output in the user's language.

---

## Sahne 7 — CTA (2:45 – 3:00)

| Süre | Eylem |
|---|---|
| 2:45 | Boss Mode pixel office geri döner — bu sefer agent'ların ekranlarında actual screenshots dönüyor (refinement, dashboard). |
| 2:50 | URL büyük: **agena.dev** + altta "5 dakikada kuruluyor · open source · MIT license". |
| 2:55 | GitHub stars sayacı animasyonla artar: "Star us on GitHub". |
| 2:58 | Logo + son frame: AGENA + tagline. Müzik fade out. |

**TR Voiceover:**
> Agena. Açık kaynak, beş dakikada kurulur, kendi sunucularınızda çalışır.
>
> **agena.dev**

**EN Voiceover:**
> Agena. Open source, five minutes to deploy, runs on your own infra.
>
> **agena.dev**

---

## Üretim Checklist

### Kayıt öncesi
- [ ] Bu senaryoyu son hâline getir, sahne sahne onayla
- [ ] Test sprint'i hazırla — gerçek görünen 30+ work item, gerçek `BiÖğrenci Cache'leme` item'ı (refinement için)
- [ ] Default skill'leri Import et (Sahne 4 için DB dolu olsun)
- [ ] DORA 7 repo sync olsun (Sahne 5 için sayılar dolu)
- [ ] Boss Mode loading test et (1080p crisp)
- [ ] Browser zoom %110, dashboard cleanup (sidebar açık, gereksiz badge yok)

### Kayıt
- [ ] **ScreenStudio** veya **Cleanshot X**, 60 fps, 4K, kursor highlight ON
- [ ] Sahne sahne ayrı kaydet, her sahne için 2-3 take
- [ ] Sessiz ortam, voiceover ayrı kayıt (Riverside)
- [ ] Subtitle için ayrıca telaffuz scripti — Whisper transcribe'a verilecek

### Edit
- [ ] **DaVinci Resolve** (free) veya Final Cut Pro
- [ ] 3-5sn'de bir kesim, 5sn'den uzun statik ekran yok
- [ ] Motion callouts: ok, daire, slow zoom — sade tut, 3-4 element
- [ ] Subtitle burn-in (TR + EN ayrı render)
- [ ] Music: %20 volume voice altında, intro/outro %40

### Yayın
- [ ] **Landing page hero** altına embed (autoplay, muted)
- [ ] **YouTube** — TR ve EN ayrı upload, chapter timestamps açıklamada
- [ ] **X** — 2:20 versiyon (Sahne 3 + 7 birleşimi, sıkıştırılmış)
- [ ] **LinkedIn** — 90 sn versiyon (Sahne 1, 2, 3 sadece)
- [ ] **Boss Mode pixel art GIF** — 10 sn, X için organik viral material

---

## Backup Sahneler (uzun versiyon için)

10 dakikalık deep-dive yapacaksan eklenebilecekler:

- **Sentry → AI fix → PR full döngüsü** (2 dk) — Sentry'de error → otomatik task → AI fix yazıyor → PR açıyor → reviewer onayı
- **Prompt Studio** (1 dk) — runtime'da prompt edit, A/B test, hot reload
- **CLI demo** (1 dk) — `agena refinement analyze --repo orkestra` terminal command
- **Self-hosted setup** (1 dk) — `./start.sh` → 5 dakikada her şey ayakta

---

## Notlar

**Subtitle stratejisi:**
- TR ve EN aynı videoda alt-üst burn-in **kötü fikir** — okuma yükü çok
- 2 ayrı render daha iyi (TR-altyazılı + EN-altyazılı)
- Sosyalde otomatik altyazı kullanma — Whisper'la kendin generate et, manuel düzelt

**Music seçimi:**
- Synthwave / lo-fi tonu Boss Mode'un pixel atmosferine uyar
- Fakat agresif beat değil — voiceover'ı boğmaz
- Outro biraz daha lift, "kapanış" hissi versin

**Renk paleti — motion graphics:**
- Agena yeşili (#0d9488 / #5eead4) ana accent
- Mor (#a78bfa) skills için
- Mavi (#3b82f6) DORA için
- Altyazı: white text, semi-transparent black background bar (alttan %15)
