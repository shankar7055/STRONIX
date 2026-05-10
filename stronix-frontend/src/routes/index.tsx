import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { StringProgress, StringTune } from "@fiddle-digital/string-tune";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Exat — New typeface by Hot Type" },
      { name: "description", content: "Exat — a new display typeface by Hot Type. 21 styles, variable font, 1715 glyphs, supports 430+ languages." },
      { property: "og:title", content: "Exat — New typeface by Hot Type" },
      { property: "og:description", content: "A new modernist display typeface in 21 styles, with extensive OpenType features and 430+ language support." },
    ],
  }),
});

const NAV = [
  ["About font", "about"],
  ["Type tester", "tester"],
  ["Extensive Character Set", "glyphs"],
  ["Design Space", "design-space"],
  ["Stylistic Sets", "stylistic"],
  ["Open Type Features", "opentype"],
  ["Language Support", "languages"],
];

const STYLES = [
  "Extra Light Condensed","Light Condensed","Regular Condensed","Medium Condensed","Bold Condensed","Extra Bold Condensed","Black Condensed",
  "Extra Light","Light","Regular","Medium","Bold","Extra Bold","Black",
  "Extra Light Wide","Light Wide","Regular Wide","Medium Wide","Bold Wide","Extra Bold Wide","Black Wide",
];

const OT_FEATURES = ["Case sensitive forms","Fractions","Numerators","Denominators","Superscript","Subscript","Tabular figures","Slashed zero","Catalan","Dutch","Romanian & Moldavian","Serbian","Bulgarian","Ukrainian"];

const LANGUAGES = ["Abaza","Abron","Abua","Acheron","Achinese","Acholi","Achuar-Shiwiar","Adamawa Fulfulde","Adangme","Adyghe","Afar","Afrikaans","Aghul","Aguaruna","Ahtna","Akoose","Alekano","Aleut","Amahuaca","Amarakaeri","Amis","Anaang","Andaandi","Angas","Anufo","Anuta","Arabela","Aragonese","Arbëreshë Albanian","Archi","Asháninka","Ashéninka Perené","Asturian","Atayal","Avaric","Awa-Cuaiquer","Awing","Baatonum","Bafia","Bagirmi Fulfulde","Balante-Ganja","Balinese","Balkan Romani","Bambara","Banjar","Baoulé","Bari","Basque","Belarusian","Bemba","Bengali","Berber","Bislama","Bosnian","Breton","Bulgarian","Catalan","Cebuano","Chamorro","Chechen","Cherokee","Cheyenne","Chichewa","Chuvash","Corsican","Cree","Croatian","Czech","Danish","Dutch","English","Esperanto","Estonian","Ewe","Faroese","Fijian","Finnish","French","Frisian","Fulah","Galician","Ganda","Georgian","German","Greenlandic","Guarani","Haitian Creole","Hausa","Hawaiian","Hiligaynon","Hmong","Hungarian","Icelandic","Igbo","Ilocano","Indonesian","Interlingua","Irish","Italian","Javanese","Kabyle","Kalmyk","Kanuri","Kashubian","Kazakh","Kikuyu","Kinyarwanda","Kirundi","Komi","Kongo","Kurdish","Kyrgyz","Ladin","Latin","Latvian","Lingala","Lithuanian","Luba-Kasai","Luxembourgish","Macedonian","Malagasy","Malay","Maltese","Manx","Maori","Marshallese","Mongolian","Nahuatl","Nauru","Navajo","Ndebele","Nepali","Norwegian","Occitan","Ossetian","Palauan","Polish","Portuguese","Quechua","Romanian","Romansh","Russian","Samoan","Sango","Sardinian","Scottish Gaelic","Serbian","Sesotho","Setswana","Shona","Silesian","Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swati","Swedish","Tagalog","Tahitian","Tajik","Tatar","Tetum","Tongan","Tsonga","Tswana","Turkish","Turkmen","Tuvan","Udmurt","Ukrainian","Uyghur","Uzbek","Venda","Vietnamese","Volapük","Võro","Walloon","Welsh","Wolof","Xhosa","Yapese","Yoruba","Zazaki","Zulu","…and many more"];

const STYLISTIC = [
  { h: "Thin Alternatives", b: "Transform accents and symbols into refined, thinner alternates with a single OpenType toggle." },
  { h: "Encapsulated Numbers", b: "Drop numerals into circles and squares — handy for wayfinding, pagination, or editorial layouts." },
  { h: "Encapsulated Letters", b: "Place every letter inside a square or circle, with both filled and outlined options for stronger visual impact." },
  { h: "Alternative a", b: "When the brief gets specific, swap to a tailed lowercase a that quietly changes the entire personality of the text." },
];

function Index() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stringTune = StringTune.getInstance();
    (window as unknown as { StringTuneContext?: unknown }).StringTuneContext = stringTune;
    stringTune.use(StringProgress);
    stringTune.start(0);
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden bg-background text-foreground">
      <div className="st-content">
        <Header />
        <Hero />
        <NavList />
        <About />
        <TypeTester />
        <Glyphs />
        <DesignSpace />
        <Stylistic />
        <OpenType />
        <Languages />
        <Marquee />
      </div>
      <Footer />
    </main>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
    gsap.defaults({ ease: "main", duration: 0.7 });

    const navWrap = document.querySelector(".nav");
    if (!navWrap) return;

    const overlay = navWrap.querySelector(".overlay");
    const menu = navWrap.querySelector(".menu");
    const bgPanels = navWrap.querySelectorAll(".bg-panel");
    const menuToggles = document.querySelectorAll("[data-menu-toggle]");
    const menuLinks = navWrap.querySelectorAll(".menu-link");
    const fadeTargets = navWrap.querySelectorAll("[data-menu-fade]");
    const menuButton = document.querySelector(".menu-button");
    const menuButtonTexts = menuButton?.querySelectorAll("p") ?? [];
    const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");
    const menuButtonIconTarget = menuButtonIcon ?? [];

    if (!overlay || !menu) return;

    gsap.set(navWrap, { display: "none" });
    gsap.set(menu, { xPercent: 120 });
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(bgPanels, { xPercent: 101 });
    gsap.set(menuLinks, { yPercent: 140, rotate: 10 });
    gsap.set(fadeTargets, { autoAlpha: 0, yPercent: 50 });

    const tl = gsap.timeline();

    const openNav = () => {
      navWrap.setAttribute("data-nav", "open");
      setOpen(true);

      tl.clear()
        .set(navWrap, { display: "block" })
        .set(menu, { xPercent: 0 }, "<")
        .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
        .fromTo(menuButtonIconTarget, { rotate: 0 }, { rotate: 315 }, "<")
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
        .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
        .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
        .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
    };

    const closeNav = () => {
      navWrap.setAttribute("data-nav", "closed");
      setOpen(false);

      tl.clear()
        .to(overlay, { autoAlpha: 0 })
        .to(menu, { xPercent: 120 }, "<")
        .to(menuButtonTexts, { yPercent: 0 }, "<")
        .to(menuButtonIconTarget, { rotate: 0 }, "<")
        .set(navWrap, { display: "none" });
    };

    const onToggleClick = () => {
      const state = navWrap.getAttribute("data-nav");
      if (state === "open") closeNav();
      else openNav();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
        closeNav();
      }
    };

    menuToggles.forEach((toggle) => toggle.addEventListener("click", onToggleClick));
    document.addEventListener("keydown", onKeyDown);

    return () => {
      menuToggles.forEach((toggle) => toggle.removeEventListener("click", onToggleClick));
      document.removeEventListener("keydown", onKeyDown);
      tl.kill();
    };
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10 md:py-6 mix-blend-difference text-[var(--hero-fg)]">
        <a href="#top" className="flex items-center gap-3">
          <FlameMark />
          <span className="hidden sm:inline text-[15px] font-medium tracking-tight">Exat — New typeface by Hot Type</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="#get" className="group inline-flex items-center gap-2 text-[15px] font-medium tracking-tight">
            Get Font <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <button
            type="button"
            className="menu-button"
            data-menu-toggle
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <span className="menu-button-text" aria-hidden="true">
              <p>Menu</p>
              <p>Close</p>
            </span>
            <span className="menu-button-icon" aria-hidden="true">
              <span className="icon-wrap">+</span>
            </span>
          </button>
        </div>
      </header>
      <div id="site-menu" className="nav" data-nav="closed" aria-hidden={!open}>
        <div className="overlay" data-menu-toggle />
        <div className="menu">
          <div className="menu-bg" aria-hidden="true">
            <div className="bg-panel first" />
            <div className="bg-panel second" />
            <div className="bg-panel" />
          </div>
          <div className="menu-inner">
            <div className="flex items-center justify-between px-8 pt-10" data-menu-fade>
              <div className="flex items-center gap-3">
                <FlameMark />
                <span className="text-[15px] font-medium">Exat — Hot Type</span>
              </div>
            </div>
            <ul className="menu-list">
              {NAV.map(([label, id]) => (
                <li key={id} className="menu-list-item">
                  <a className="menu-link" href={`#${id}`} data-menu-toggle>
                    <span className="menu-link-heading">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Hero() {
  const heroWord = "Stronix";
  return (
    <section id="top" className="relative flex min-h-screen items-end pb-[2vw] px-[2vw]">
      <h1
        className="select-none whitespace-nowrap font-black leading-[0.78] tracking-[-0.05em]"
        style={{ color: "var(--hero-fg)", fontSize: "min(27vw, 92vh)", marginLeft: "-1.5vw" }}
      >
        {heroWord}
      </h1>
    </section>
  );
}

function NavList() {
  return (
    <section className="border-t border-foreground/20">
      <ul className="divide-y divide-foreground/20">
        {NAV.map(([label, id], i) => (
          <li key={id}>
            <a href={`#${id}`} className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6 text-2xl md:text-4xl font-medium tracking-tight hover:bg-foreground/5 transition">
              <span><span className="text-foreground/50 mr-4 tabular-nums">0{i + 1}</span>{label}</span>
              <span>→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHead({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <header className="px-6 md:px-10 pt-24 md:pt-32 pb-10" id={id}>
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">{kicker}</p>
      <h2 className="mt-6 text-4xl md:text-7xl font-black tracking-[-0.03em] leading-[0.95] max-w-5xl">{title}</h2>
    </header>
  );
}

function About() {
  return (
    <section className="bg-[var(--hero-fg)] text-background">
      <SectionHead id="about" kicker="01 — About font" title="Exat strikes a balance between form and function, neutrality and character." />
      <div className="px-6 md:px-10 pb-24 grid md:grid-cols-2 gap-10 max-w-7xl">
        <div className="space-y-6 text-lg md:text-xl leading-relaxed">
          <p>Inspired by the artistic and architectural endeavors of EXAT 51, the typeface centers on clean lines and structural clarity. It captures the essence of modernist ideas — equal parts form and function — while quietly nodding to one of the most popular typefaces of all time.</p>
          <p>Exat ships with extraordinary width and weight options across a robust character set, giving the user complete control to choose the right type for any situation.</p>
        </div>
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-background/80">
          <p>EXAT 51 — short for Experimental Atelier, formed in 1951 — was a pioneering Croatian collective of architects and artists committed to abstract art and a model of Total Design. Ivan Picelj, one of its co-founders, became a central figure in the international New Tendencies movement of the 1960s.</p>
          <p>Between 1962 and 1964 Picelj self-published seven issues of his "Edition a" booklets. Each cover featured a single silk-screened lowercase "a" — a modified Helvetica — printed in a different vivid color. Exat began as a redrawing of that letter and the wish to build a typographic world around it.</p>
        </div>
      </div>
    </section>
  );
}

function TypeTester() {
  const [text, setText] = useState("Modernism in motion");
  const [size, setSize] = useState(160);
  const [weight, setWeight] = useState(900);
  const [tracking, setTracking] = useState(-3);
  return (
    <section id="tester" className="border-t border-foreground/20">
      <SectionHead id="tester" kicker="02 — Type tester" title="Type tester." />
      <div className="px-6 md:px-10 pb-12">
        <div className="border border-foreground/30 rounded-md overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent p-6 md:p-10 outline-none resize-none text-[var(--hero-fg)] font-black leading-[0.95]"
            rows={3}
            style={{ fontSize: `${size}px`, fontWeight: weight, letterSpacing: `${tracking}px` }}
          />
          <div className="flex flex-wrap gap-6 px-6 py-4 border-t border-foreground/30 bg-foreground/5 text-sm">
            <Slider label="Size" value={size} min={40} max={280} onChange={setSize} suffix="px" />
            <Slider label="Weight" value={weight} min={200} max={900} step={100} onChange={setWeight} />
            <Slider label="Tracking" value={tracking} min={-10} max={10} onChange={setTracking} suffix="px" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <label className="flex items-center gap-3 min-w-[200px] flex-1">
      <span className="uppercase tracking-wider w-20 text-foreground/70">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-foreground" />
      <span className="tabular-nums w-16 text-right">{value}{suffix}</span>
    </label>
  );
}

function Glyphs() {
  const sample = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!?&@#$€£¥%*+=<>/()[]{}«»".split("");
  return (
    <section id="glyphs" className="bg-foreground text-[var(--hero-fg)]">
      <header className="px-6 md:px-10 pt-24 md:pt-32 pb-10">
        <p className="text-sm uppercase tracking-[0.2em] opacity-60">03 — Extensive Character Set</p>
        <h2 className="mt-6 text-4xl md:text-7xl font-black tracking-[-0.03em] leading-[0.95] max-w-5xl">Glyphs for all occasions.</h2>
      </header>
      <div className="px-6 md:px-10 pb-12 max-w-4xl text-lg md:text-xl leading-relaxed opacity-90">
        <p>Exat ships with a remarkable 1,715 glyphs per style: numerals, symbols, punctuation, extended currency, encapsulated letters and numbers, math, arrows — and even a dingbat set. Total typographic firepower for the most demanding briefs.</p>
      </div>
      <div className="px-6 md:px-10 pb-24 grid grid-cols-6 sm:grid-cols-10 md:grid-cols-14 gap-px bg-current/10">
        {sample.map((g, i) => (
          <div key={i} className="aspect-square bg-foreground flex items-center justify-center text-2xl md:text-3xl font-medium hover:bg-[var(--hero-fg)] hover:text-foreground transition">
            {g}
          </div>
        ))}
      </div>
    </section>
  );
}

function DesignSpace() {
  return (
    <section id="design-space" className="border-t border-foreground/20 bg-background text-foreground">
      <SectionHead id="design-space" kicker="04 — Design Space" title="Widths, weights & variable font." />
      <div className="px-6 md:px-10 pb-12 max-w-4xl text-lg md:text-xl leading-relaxed">
        <p>Seven weights from Extra Light to Black, expanded across Condensed, Normal and Wide subfamilies — twenty-one carefully crafted styles in total. Variable font technology gives complete control over the exact cut for any setting.</p>
      </div>
      <ul className="px-6 md:px-10 pb-24 grid grid-cols-1 md:grid-cols-3 gap-x-10">
        {STYLES.map((s) => (
          <li key={s} className="border-t border-foreground/20 py-3 flex items-baseline justify-between">
            <span className="text-lg md:text-xl font-medium tracking-tight">{s}</span>
            <span className="text-sm text-foreground/50">Aa</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stylistic() {
  return (
    <section id="stylistic" className="bg-[var(--hero-fg)] text-background">
      <SectionHead id="stylistic" kicker="05 — Stylistic Sets" title="Customisation with alternates." />
      <div className="px-6 md:px-10 pb-24 grid md:grid-cols-2 gap-x-10 gap-y-12">
        {STYLISTIC.map((item) => (
          <div key={item.h} className="border-t border-background/30 pt-6">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">{item.h}</h3>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-background/80">{item.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OpenType() {
  return (
    <section id="opentype" className="border-t border-foreground/20">
      <SectionHead id="opentype" kicker="06 — Open Type Features" title="Smart functionality, end to end." />
      <div className="px-6 md:px-10 pb-12 max-w-4xl text-lg md:text-xl leading-relaxed">
        <p>Everything you'd expect from comprehensive OpenType support — and a little more. Case-sensitive forms, language-specific behaviours, stylistic interventions, fractions, superior and inferior figures, slashed zero. One click away in the OpenType menu.</p>
      </div>
      <ul className="px-6 md:px-10 pb-24 flex flex-wrap gap-2">
        {OT_FEATURES.map((f) => (
          <li key={f} className="border border-foreground/40 rounded-full px-4 py-2 text-sm md:text-base">{f}</li>
        ))}
      </ul>
    </section>
  );
}

function Languages() {
  return (
    <section id="languages" className="bg-foreground text-[var(--hero-fg)]">
      <header className="px-6 md:px-10 pt-24 md:pt-32 pb-10">
        <p className="text-sm uppercase tracking-[0.2em] opacity-60">07 — Language Support</p>
        <h2 className="mt-6 text-4xl md:text-7xl font-black tracking-[-0.03em] leading-[0.95] max-w-5xl">Two scripts, over 430 languages.</h2>
      </header>
      <div className="px-6 md:px-10 pb-12 max-w-4xl text-lg md:text-xl leading-relaxed opacity-90">
        <p>The character set covers Christoph Koeberlin's Latin M for Latin-based languages and the Adobe Extended Cyrillic Glyph set — supporting Russian, Belarusian, Bulgarian, Ukrainian, Serbian and Macedonian, among many more.</p>
      </div>
      <ul className="px-6 md:px-10 pb-24 columns-2 sm:columns-3 md:columns-5 gap-x-8 text-sm md:text-base [column-fill:_balance] opacity-90">
        {LANGUAGES.map((l) => (
          <li key={l} className="break-inside-avoid py-1">{l}</li>
        ))}
      </ul>
    </section>
  );
}

function Marquee() {
  const items = ["EXAT", "1715 GLYPHS", "21 STYLES", "VARIABLE", "430+ LANGUAGES", "HOT TYPE"];
  return (
    <section className="bg-background border-y border-foreground/20 overflow-hidden py-10">
      <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[var(--hero-fg)] text-7xl md:text-9xl font-black tracking-tight">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="shrink-0">{t} <span className="opacity-40">✱</span></span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="get"
      className="st-footer"
      {...({ string: "progress", "string-exit-vp": "bottom" } as any)}
    >
      <div className="st-grid">
        <p className="st-title">Built for modern supply chain teams.</p>

        <span className="st-logo">Stronix</span>

        <nav className="st-nav st-nav-menu" aria-label="Menu">
          <a href="#about">About</a>
          <a href="#tester">Tester</a>
          <a href="#glyphs">Glyphs</a>
          <a href="#design-space">Design</a>
        </nav>

        <nav className="st-nav st-nav-help" aria-label="Help">
          <a href="#opentype">Features</a>
          <a href="#languages">Languages</a>
          <a href="#get">Get</a>
        </nav>

        <nav className="st-nav st-nav-legal" aria-label="Legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </nav>

        <nav className="st-nav st-nav-socials" aria-label="Social">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">YouTube</a>
        </nav>

        <div className="st-copy">© 2026 Stronix. All rights reserved.</div>
      </div>
    </footer>
  );
}

function FlameMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M16 2c1 4-2 6-4 9-2.4 3.5-2 7 0 9-1-3 1-5 3-6-1 3 1 5 3 6 3-2 4-6 2-10-1.5-3-3-5-4-8zM9 18c-2 2-3 5-2 8 1 3 5 4 9 4s8-1 9-4c1-3 0-6-2-8-1 4-4 6-7 6s-6-2-7-6z" />
    </svg>
  );
}
