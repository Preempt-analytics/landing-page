// Professional German translation of src/i18n/en.ts. Typed against that
// file's exact shape (see ./index.ts's `Dictionary` type) — a missing or
// renamed key here is a build-time TS error, not a silently-blank string in
// production. Product/library proper nouns (Docker Desktop, Git, MLflow,
// DVC, Python, GitHub, CI/CD…) and literal shell commands are intentionally
// left untranslated, matching standard German technical-writing practice.
import type { Dictionary } from './index';

export const de: Dictionary = {
  common: {
    seeItInAction: 'In Aktion sehen →',
    testItOnYourDevice: 'Auf dem eigenen Gerät testen',
    testItOnYourDeviceArrow: 'Auf dem eigenen Gerät testen →',
    backToHome: '← Zurück zur Startseite',
    illustrativeExample: 'Illustratives Beispiel',
    liveUpdatedHourly: 'live · stündlich aktualisiert',
    sampleMetric: 'Beispielwert',
    whatIsThis: 'Was bedeutet das?',
    whatIs: (name: string) => `Was ist ${name}?`,
    moreAbout: (name: string) => `Mehr über ${name}`,
  },

  nav: {
    skipToContent: 'Zum Inhalt springen',
    homeAriaLabel: 'Preempt Analytics — Startseite',
    toggleMenu: 'Menü öffnen/schließen',
    dashboard: 'Dashboard',
    howItWorks: 'So funktioniert’s',
    solutions: 'Lösungen',
    techStack: 'Tech-Stack',
    projectTeam: 'Projekt & Team',
  },

  accessibilityMenu: {
    buttonLabel: 'Barrierefreiheit',
    panelHeading: 'Einstellungen für Barrierefreiheit',
    textSize: 'Textgröße',
    textSizeDecrease: 'Textgröße verkleinern',
    textSizeReset: 'Textgröße zurücksetzen',
    textSizeIncrease: 'Textgröße vergrößern',
    highContrast: 'Hoher Kontrast',
    highContrastDescription: 'Stärkerer Kontrast innerhalb des dunklen Designs der Website.',
    reduceMotion: 'Bewegung reduzieren',
    reduceMotionDescription: 'Deaktiviert Hover-Effekte, Einblendungen und andere dezente Animationen.',
    reset: 'Auf Standardwerte zurücksetzen',
  },

  languageSwitcher: {
    buttonLabel: 'Sprache',
    panelHeading: 'Sprache auswählen',
    switchTo: (name: string) => `Auf ${name} wechseln`,
  },

  footer: {
    projectAndTeam: 'Projekt & Team',
    program: 'neuefische AI Engineering Bootcamp · Cohort 2026',
    links: 'Links',
    seeItInAction: 'In Aktion sehen',
    testItOnYourDevice: 'Auf dem eigenen Gerät testen',
    githubRepository: 'GitHub-Repository',
    backToTop: 'Nach oben ↑',
    aboutBody:
      'Vorausschauende Wartung für Industrieanlagen — eine vollständige MLOps-Pipeline: Live-Sensorvorhersagen, automatisierte Drift-Überwachung und selbstauslösendes Retraining.',
    aboutCapstonePrefix: 'Ein Abschlussprojekt auf Basis',
    aboutCapstoneBold: 'simulierter CNC-Sensordaten',
    aboutCapstoneSuffix: '— noch kein produktiver Einsatz bei zahlenden Kunden.',
    builtUsingOpenData: 'Erstellt mit offenen Daten von',
    madeWithLoveIn: 'Mit Liebe entwickelt in',
    europe: 'Europa',
    copyright: (year: number) => `© ${year} Preempt Analytics — Abschlussprojekt. Erstellt mit Astro & Tailwind.`,
    ledTicker: 'KEINE ANALYSE · KEIN TRACKING · KEIN ÜBERWACHUNGSKAPITALISMUS',
    ledTickerSrOnly: 'Keine Analyse. Kein Tracking. Kein Überwachungskapitalismus.',
    noLoggingSuffix: '— nichts, was Sie hier tun, wird aufgezeichnet.',
    privacyTipLabel: 'Unser Datenschutzansatz',
    privacyTipBody:
      'Keine Cookies — nicht einmal „notwendige“. Keine Analyse, keine Tracker, kein Fingerprinting, und nichts wird an Dritte übermittelt. Diese Seite erfasst nichts über Ihren Besuch, daher gibt es nach DSGVO/ePrivacy nichts, wofür wir Ihre Einwilligung einholen müssten — deshalb gibt es hier auch keinen Cookie-Banner.',
    privacyTipHostingPrefix:
      'Wir selbst erfassen nichts, diese Seite wird jedoch über GitHub Pages gehostet — GitHub kann Besucher-IPs im Rahmen des üblichen Serverbetriebs protokollieren. Mehr dazu in deren',
    privacyTipHostingLinkLabel: 'Datenschutzerklärung',
    privacyTipHostingSuffix: '.',
  },

  siteToast: {
    illustrationAlt: 'Illustration eines teerartigen Monsters mit den Logos von Google, Apple, Facebook, Amazon und Microsoft auf seinen Köpfen',
    headline: 'Wir lehnen Überwachungskapitalismus ab',
    body: 'Keine Cookies, keine Analyse, keine Tracker — nichts an diesem Besuch wird erfasst, daher gibt es nichts, wofür wir um Ihre Einwilligung bitten müssten. Das hier sagen wir einfach einmal deutlich. Das untermauern wir auch technisch: selbst gehostete Schriftarten, keine Skripte von Drittanbietern — nichts ruft im Hintergrund bei Google oder sonst wem zu Hause an.',
    closingInPrefix: 'Schließt in',
    closingInSuffix: 's',
    paused: 'Pausiert',
    dismiss: 'Verstanden',
  },

  hero: {
    eyebrow: 'Vorausschauende Wartung, angetrieben von KI',
    headingLine1: 'Ausfälle vorhersagen.',
    headingPrevent: 'Stillstand',
    headingLine2: 'vermeiden.',
    subtitle:
      'Ein System für vorausschauende Wartung, das Maschinenausfälle erkennt, bevor sie eintreten — entwickelt, um zu zeigen, wie Fertigungsteams Betriebszeit und Effizienz maximieren könnten.',
    capstoneNote: 'Ein Abschlussprojekt auf Basis simulierter CNC-Sensordaten.',
    hoverForDetails: 'Für Details hierhin bewegen',
    checkingFor: 'Prüft auf …',
    markers: {
      powerFailure: {
        title: 'Leistungsausfall',
        detail: 'Erfasst Drehmoment und Drehzahl gemeinsam — erst die Kombination signalisiert ein Problem, nicht jeder Wert für sich.',
        ariaLabel: 'Leistungsausfall: erfasst Drehmoment und Drehzahl gemeinsam, da erst die Kombination ein Problem signalisiert.',
      },
      toolWearFailure: {
        title: 'Werkzeugverschleiß-Ausfall',
        detail: 'Beobachtet, wie der Werkzeugverschleiß sich dem Austauschfenster nähert — und erkennt es, bevor ein abgenutztes Werkzeug zufällig ausfällt.',
        ariaLabel: 'Werkzeugverschleiß-Ausfall: beobachtet, wie die Verschleißzeit sich dem Austauschfenster nähert, bevor ein abgenutztes Werkzeug zufällig ausfällt.',
      },
      heatDissipationFailure: {
        title: 'Wärmeabgabe-Ausfall',
        detail: 'Beobachtet Temperaturdifferenz und Drehzahl gemeinsam, bevor die Wärme keinen Weg mehr hat, zu entweichen.',
        ariaLabel: 'Wärmeabgabe-Ausfall: beobachtet Temperaturdifferenz und Drehzahl gemeinsam, bevor die Wärme keinen Weg mehr hat, zu entweichen.',
      },
    },
  },

  howItWorks: {
    heading: 'Der KI- und MLOps-Kreislauf hinter kontinuierlicher Zuverlässigkeit',
    subtitle: 'Ein System. Ein Kreislauf. Lernt ständig dazu.',
    mobileLoopBack: 'fließt zurück in Datenerfassung — lernt ständig dazu',
    steps: [
      {
        title: 'Datenerfassung',
        body: 'Sensordaten der Maschinen in Echtzeit streamen.',
        info: 'Sensoren an den Maschinen senden alle paar Sekunden Echtzeit-Messwerte — Temperatur, Vibration, Druck. Ohne diesen Schritt funktioniert nichts anderes im Kreislauf: Er liefert das Rohmaterial, auf dem jede Vorhersage aufbaut. Man kann es sich als die Augen und Ohren des Systems auf dem Fabrikboden vorstellen.',
      },
      {
        title: 'Vorhersagen',
        body: 'KI-Modelle bewerten fortlaufend die Ausfallwahrscheinlichkeit.',
        info: 'KI-Modelle werten die eingehenden Messwerte aus und schätzen fortlaufend ein, wie wahrscheinlich ein baldiger Ausfall je Maschine ist. Statt auf eine geplante Inspektion zu warten, erhalten Sie einen frühen, laufenden Einblick in den Maschinenzustand. So werden aus rohen Sensordaten Warnungen, auf die tatsächlich reagiert werden kann.',
      },
      {
        title: 'Erkennen',
        body: 'Anomalien und Drift werden früh und automatisch erkannt.',
        info: 'Das System achtet auf zwei Arten von Veränderung: frühe Warnzeichen für einen Ausfall und eine Verschiebung in den eingehenden Daten selbst (genannt „Drift“), die Vorhersagen unzuverlässiger machen könnte. Drift automatisch zu erkennen bedeutet, dass Probleme gemeldet werden, bevor Vorhersagen unbemerkt schlechter werden. Dieser Schritt hält den gesamten Kreislauf vertrauenswürdig.',
      },
      {
        title: 'Neu trainieren',
        body: 'Modelle werden über die Pipeline mit aktuellen Daten neu trainiert.',
        info: 'Werden Drift oder neue Muster erkannt, wird das Modell automatisch mit den aktuellsten Daten neu trainiert — kein Techniker muss das Problem bemerken und den Vorgang manuell anstoßen. So bleiben Vorhersagen präzise, auch wenn Maschinen altern oder sich Bedingungen ändern. Das macht daraus ein lebendiges System statt eines einmalig trainierten Modells, das langsam veraltet.',
      },
      {
        title: 'Verbessern',
        body: 'Vorhersagen werden mit der Zeit besser — das senkt Stillstand und Kosten.',
        info: 'Mit einem aktuellen Modell werden Vorhersagen schärfer, statt mit der Zeit schlechter zu werden. Das bedeutet weniger überraschende Ausfälle und weniger Zeit und Geld für unnötige Wartung. Hier zahlt sich der Kreislauf aus — jeder Durchlauf von Datenerfassung → Vorhersagen → Erkennen → Neu trainieren hinterlässt ein etwas besseres System als zuvor.',
      },
    ],
    outcome: {
      title: 'Geschäftlicher Nutzen',
      body: 'Mehr Verfügbarkeit. Geringere Kosten. Längere Lebensdauer der Anlagen.',
      info: 'All das summiert sich zu weniger ungeplanten Stillständen, geringeren Wartungskosten und Anlagen, die länger halten, bevor sie ersetzt werden müssen. Das ist der Grund, warum es den gesamten Kreislauf überhaupt gibt — jeder technische Schritt rechtfertigt sich durch dieses Ergebnis. Die Resultate fließen dann zurück in Datenerfassung, sodass die Verbesserung nie endet.',
    },
  },

  benefits: {
    eyebrow: 'Wobei das System helfen kann',
    heading: 'Weniger Überraschungen. Geringere Kosten. Langlebigere Maschinen.',
    tiles: [
      {
        title: 'Stillstand reduzieren',
        body: 'Unerwartete Ausfälle und ungeplante Stopps vermeiden.',
        eco: 'Notfallreparaturen sind nicht nur teuer, sondern auch verschwenderisch — ein zu spät erkannter Ausfall bedeutet oft ein dringend per Expressversand statt Standardlieferung beschafftes Ersatzteil. Wird der Ausfall verhindert, genügt normaler, geplanter Versand statt einer CO2-intensiven Hauruck-Aktion.',
      },
      {
        title: 'Lebensdauer verlängern',
        body: 'Probleme früh erkennen und Verschleiß reduzieren.',
        eco: 'Jede Maschine trägt bereits vor der ersten Inbetriebnahme einen ökologischen Rucksack — die Energie und Rohstoffe, die für ihren Bau nötig waren. Wird eine Anlage länger genutzt statt früh ersetzt, verteilt sich dieser Fußabdruck auf mehr Jahre Nutzungsdauer.',
      },
      {
        title: 'Wartungskosten senken',
        body: 'Teile nach tatsächlichem Zustand ersetzen, nicht nach Vermutung.',
        eco: 'Kalendergestützte Wartung ersetzt Teile oft nach festem Zeitplan, ob nötig oder nicht — und tauscht damit etwas aus, das noch Nutzungsdauer hätte. Wird nur ersetzt, was wirklich verschlissen ist, entstehen weniger Schrott, Altöl und Verpackungsmüll.',
      },
      {
        title: 'Betriebseffizienz steigern',
        body: 'Mehr Verfügbarkeit. Reibungslosere Abläufe. Zufriedenere Teams.',
        eco: 'Eine Maschine mit einem unentdeckten Defekt — Vibration, Fehlausrichtung, Reibung — verbraucht typischerweise mehr Energie als eine rund laufende und verschwendet sie als Wärme und Verschleiß. Wer Probleme früh erkennt, hält Maschinen auf ihrem effizientesten Niveau, nicht nur knapp über dem Funktionsminimum.',
      },
    ],
    ecoTipLabel: (title: string) => `Ökologischer Vorteil von „${title}“`,
  },

  mlopsSystem: {
    eyebrow: 'Für technisch Interessierte',
    heading: 'Das MLOps-System hinter den Vorhersagen',
    subtitlePrefix: 'Derselbe Kreislauf aus',
    subtitleLinkText: 'So funktioniert’s',
    subtitleSuffix: '— jetzt mit den Tools, die ihn betreiben.',
    builtWithHeading: 'Erstellt mit',
    poweredByHeading: 'Angetrieben von',
    nodes: [
      {
        title: 'Sensordaten',
        body: 'Live-/simulierte Messwerte der Maschinen',
        info: 'Das ist derselbe Schritt „Datenerfassung“ aus So funktioniert’s, hier gezeigt als die tatsächliche Systemkomponente, die ihn empfängt: ein Erfassungspunkt, der Live-Sensordaten (oder simulierte, für die Demo) aufnimmt und an das Vorhersagemodell weitergibt.',
      },
      {
        title: 'Predict-API',
        body: 'Echtzeit-Inferenz & Ausfallwahrscheinlichkeit',
        info: 'Ein kleiner Webdienst mit einer einzigen Aufgabe: einen Sensorwert entgegennehmen und in Echtzeit eine Ausfallwahrscheinlichkeit zurückgeben. „API“ bedeutet einfach „eine Möglichkeit für eine Software, eine andere um etwas zu bitten“ — hier: um eine Vorhersage.',
      },
      {
        title: 'Drift-Prüfung',
        body: 'Erkennt Daten- und Modell-Drift',
        info: 'Evidently ist ein Open-Source-Tool, das die heute eingehenden Sensordaten statistisch mit den Daten vergleicht, auf denen das Modell ursprünglich trainiert wurde. Haben sich beide zu weit voneinander entfernt, ist das ein frühes Zeichen dafür, dass das Modell neu trainiert werden muss, bevor seine Vorhersagen unbemerkt schlechter werden.',
      },
      {
        title: 'CI/CD',
        body: 'Automatisiertes CI/CD für ML',
        info: 'Der in GitHub integrierte Automatisierungs-Runner. Wird Drift gemeldet, stößt genau dieser Dienst den Retraining-Job im Hintergrund an — kein Techniker muss die Meldung bemerken und den Vorgang manuell starten.',
      },
      {
        title: 'DVC',
        body: 'Versionierte Daten + Retraining',
        info: 'DVC („Data Version Control“) funktioniert wie Git, aber für Datensätze und Modelle statt für Code. Es führt eine versionierte Aufzeichnung darüber, welche Daten welches Modell erzeugt haben, sodass jeder Retraining-Lauf nachvollziehbar und wiederholbar ist.',
      },
      {
        title: 'MLflow',
        body: 'Modelle vergleichen, verfolgen & befördern',
        info: 'MLflow protokolliert die Ergebnisse jedes Trainingslaufs nebeneinander, sodass ein neues Modell mit dem aktuell produktiven verglichen werden kann. Nur ein tatsächlich besseres Modell wird in die Produktion „befördert“.',
      },
    ],
    builtWith: [
      {
        name: 'Python',
        body: 'Datenverarbeitung & Modellierung',
        info: 'Die Programmiersprache, in der das gesamte System geschrieben ist — eine der gängigsten Sprachen für Data Science und maschinelles Lernen.',
      },
      {
        name: 'Pandas',
        body: 'Datenanalyse',
        info: 'Eine Python-Bibliothek zum Laden, Bereinigen und Umformen tabellarischer Daten — vergleichbar mit einer skriptfähigen, programmierbaren Tabellenkalkulation.',
      },
      {
        name: 'Scikit-learn',
        body: 'ML-Modellierung',
        info: 'Eine Python-Bibliothek mit vorgefertigten Algorithmen für maschinelles Lernen. Damit wird das Ausfallvorhersagemodell selbst gebaut und trainiert.',
      },
      {
        name: 'NumPy',
        body: 'Numerisches Rechnen',
        info: 'Die schnelle, systemnahe Bibliothek fürs Zahlenrechnen, auf der sowohl Pandas als auch Scikit-learn aufbauen — selten direkt genutzt, leistet aber im Hintergrund den Großteil der Arbeit.',
      },
    ],
    poweredBy: [
      {
        name: 'Evidently AI',
        body: 'Überwachung von Daten- & Modell-Drift',
        info: 'Die Open-Source-Bibliothek, die auf Drift achtet — sie vergleicht laufend Live-Produktionsdaten mit den Trainingsdaten, nicht nur einmalig beim Start.',
      },
      {
        name: 'GitHub Actions',
        body: 'Automatisiertes CI/CD für ML',
        info: 'Ein kostenloser, in GitHub integrierter Automatisierungsdienst. Er ist die Antriebskraft, die die Retraining-Pipeline auslöse- oder zeitplangesteuert ausführt — kein separater Server, um den man sich kümmern müsste.',
      },
      {
        name: 'DVC',
        body: 'Datenversionierung',
        info: 'Kurz für „Data Version Control“ — dasselbe Tool wie im Diagramm oben. Es macht die Frage „welche Daten haben genau dieses Modell trainiert“ zu einer beantwortbaren Frage statt einer Vermutung.',
      },
      {
        name: 'MLflow',
        body: 'Experiment-Tracking & Modellregistrierung',
        info: 'Experiment-Tracking und Modellregistrierung in einem Tool. Jeder Trainingslauf wird protokolliert und verglichen, und das jeweils „beförderte“ Modell liefert die Live-Vorhersagen.',
      },
    ],
    claims: [
      { title: 'Automatisiert', body: 'Kein manuelles Retraining' },
      { title: 'Reproduzierbar', body: 'DVC-versionierte Daten & Pipeline' },
      { title: 'Überwacht', body: 'Evidently-Drift-Prüfungen' },
      { title: 'Open-Source-Stack', body: 'Läuft auf dem eigenen Rechner' },
    ],
  },

  liveFactory: {
    headingLine1: 'Live-Fabrik.',
    headingLine2: 'Echte Vorhersagen.',
    subtitle:
      'Das System kann CNC-Fräsmaschinen rund um die Uhr überwachen. Sobald sich Werkzeugverschleiß oder Prozesstemperatur zu verändern beginnen, erkennt es die Veränderung — oft Stunden, bevor sie zu einem Ausfall führen könnte.',
    imageAlt: 'Isometrische Ansicht einer CNC-Fräshalle mit fünf Maschinen, leuchtend türkisfarbenen Sensorlichtern und einem Laufsteg.',
    checkingFor: 'Prüft auf',
    failureModes: {
      toolWear: 'Werkzeugverschleiß-Ausfall',
      power: 'Leistungsausfall',
      heatDissipation: 'Wärmeabgabe-Ausfall',
      overstrain: 'Überlastungs-Ausfall',
    },
    hoverForDetails: 'Für Details hierhin bewegen',
    noDriftDetected: 'Keine Drift erkannt',
    machineDetails: {
      cnc02: 'Normal — keine Auffälligkeiten',
      cnc03: 'Alle Parameter normal',
      cnc04: 'Innerhalb des sicheren Betriebsbereichs',
      cnc05: 'Hier sieht alles gut aus',
    },
    healthyAriaLabel: (name: string) => `${name}: keine Drift erkannt, sicher `,
    driftDetected: 'Drift erkannt',
    driftAriaLabel: (name: string) => `${name}: Drift erkannt, Werkzeugverschleiß-Verschiebung, 2,3 Stunden bis zum Ausfall`,
    toolWearShift: 'Werkzeugverschleiß-Verschiebung',
    hoursToFailure: '2,3 Std. bis zum Ausfall',
    seeItInAction: 'In Aktion sehen →',
  },

  userStory: {
    headingLine1: 'Während die Tagschicht',
    headingLine2: 'schläft…',
    subtitle: 'Das System kann die Maschinen die ganze Nacht überwachen.',
    beats: [
      { time: '02:16 Uhr', title: 'Drift erkannt', body: 'Werkzeugverschleiß-Verschiebung an CNC-01 von Evidently AI erkannt.' },
      { time: '02:17 Uhr', title: 'Pipeline ausgelöst', body: 'Die GitHub-Actions-Pipeline startet automatisch.' },
      { time: '02:28 Uhr', title: 'Modell neu trainiert', body: 'Ein neues Modell trainiert mit den aktuellsten Sensordaten.' },
      { time: '02:45 Uhr', title: 'Modell befördert', body: 'Die neue Version übertrifft die alte und geht automatisch live.' },
      { time: '06:47 Uhr', title: 'System einwandfrei', body: 'Die Wartungsleitung öffnet das Dashboard. Keine Anrufe. Keine Vorfälle.' },
    ],
    overnightImpactHeading: 'Auswirkung über Nacht',
    impact: {
      failurePrevented: '1 möglicher Ausfall verhindert',
      downtimeAvoided: '~8 Stunden Stillstand vermieden',
      savedSuffix: 'gespart',
      productionOnTrack: 'Produktion blieb planmäßig',
    },
    impactDisclaimer: 'Ein Durchlauf einer einzelnen Nacht — keine aggregierten Kundendaten.',
    impactFootnotePrefix: 'Probieren Sie Ihre eigenen Zahlen',
    impactFootnoteLink: 'im Rechner weiter unten aus ↓',
    maintenanceLeadAlt:
      'Eine Wartungsleitung von hinten, ohne erkennbares Gesicht, prüft nachts auf einer Fabrikhalle ein abstrakt leuchtendes Dashboard auf einem Tablet.',
    morningSummaryHeading: 'Morgendliche Zusammenfassung',
    morningSummaryLine1: 'Keine Vorfälle.',
    morningSummaryLine2: 'Modell über Nacht aktualisiert.',
    seeTheDashboard: 'Dashboard ansehen →',
    closingLine1: 'Ein System.',
    closingLine2: 'Lernt ständig dazu.',
    closingLine3: 'Schützt langfristig.',
  },

  savingsCalculator: {
    eyebrow: 'Szenario: Sie leiten eine Fabrik',
    heading: 'Wie viel könnten Sie damit sparen?',
    subtitle: 'Bewegen Sie den Regler auf den Betrag, den ungeplanter Stillstand Sie monatlich ungefähr kostet.',
    sliderLabel: 'Ihre monatlichen Kosten durch ungeplanten Stillstand',
    sliderAriaLabel: 'Ihre monatlichen Kosten durch ungeplanten Stillstand, in Euro',
    sliderInfoLabel: 'Was ist damit gemeint?',
    sliderInfoBody: (maxFormatted: string) =>
      `Produktionsausfall, überstürzte Reparaturen, stillstehendes Personal — die tatsächlichen Kosten, wenn eine Maschine unangekündigt ausfällt. Nicht die routinemäßige Wartung, die Sie ohnehin einplanen. Unsicher, welchen Wert Sie wählen sollen? Eine einzelne Linie mit gelegentlichen Stopps kostet meist 2.000–10.000 €/Monat; eine ausgelastete Mehrschichtlinie liegt typischerweise bei 15.000–${maxFormatted}/Monat. Beginnen Sie mit dem näherliegenden Wert und passen Sie ihn dann an.`,
    contextIntro: 'Möglicherweise haben Sie anderswo größere Stillstandszahlen gesehen — hier sehen Sie, wo vier häufig zitierte Werte tatsächlich liegen.',
    citations: [
      {
        value: '$2.3M',
        unit: '/Std.',
        source: 'Automobilwerke',
        infoLabel: 'Zur Siemens-Zahl',
        infoBody: 'Siemens-Stillstandsbericht 2024: Automobilwerke können bis zu diesem Betrag pro Stunde Produktionsausfall verlieren — eine andere Größenordnung als eine einzelne Produktionslinie wie oben. Quelle:',
        linkText: 'Siemens, True Cost of Downtime 2024',
      },
      {
        value: '$125k',
        unit: '/Std.',
        source: 'Weltweiter Durchschnitt',
        infoLabel: 'Zur ABB-Zahl',
        infoBody: 'Die ABB-Umfrage 2023 unter 3.215 Instandhaltungsleitungen weltweit ermittelte diesen Wert als weltweiten Durchschnitt der Kosten pro Stunde ungeplanten Stillstands — viele einzelne Unternehmen liegen deutlich darunter. Quelle:',
        linkText: 'ABB, Value of Reliability survey',
      },
      {
        value: '€147k',
        unit: '/Std.',
        source: 'Durchschnitt Deutschland',
        infoLabel: 'Zur Deutschland-Zahl',
        infoBody: 'Die deutsche Teilauswertung derselben ABB-Umfrage — ein Durchschnitt über Industrieunternehmen jeder Größe, nicht nur Großbetriebe, sodass viele kleinere Betriebe deutlich darunter liegen. Quelle:',
        linkText: 'ABB, Value of Reliability survey (Germany)',
      },
      {
        value: '<£500',
        unit: '/Std.',
        source: 'Kleinste UK-Betriebe',
        infoLabel: 'Zur RS-Industria-Zahl',
        infoBody: 'Die kleinsten britischen Hersteller — die Größenordnung am nächsten an einer einzelnen Produktionslinie — gaben laut RS-Industria-Umfrage Werte unter 500 £/Stunde an. Quelle:',
        linkText: 'RS Industria, UK manufacturing survey',
      },
    ],
    ifNothingChanges: 'Wenn sich nichts ändert',
    withPredictiveMaintenance: 'Mit vorausschauender Wartung',
    estimatedSavings: 'Geschätzte Ersparnis',
    perMonthSuffix: ' / Monat',
    treesSaved: 'Gerettete Bäume (Äquivalent)',
    treesInfoLabel: 'Wie wird das geschätzt?',
    treesInfoBody: (perTreeFormatted: string) =>
      `Ein grober, illustrativer Vergleich, keine CO2-Berechnung — das Modell dieses Projekts sagt Ausfälle vorher, keine Emissionen. Ungeplanter Stillstand verschwendet üblicherweise Energie (stillstehende Maschinen, Anlaufspitzen, Ausschussmaterial); wir vergleichen die Größenordnung dieser vermiedenen Verschwendung mit der jährlichen CO2-Aufnahme eines ausgewachsenen Baumes (~21 kg), wobei ${perTreeFormatted} eingesparte Kosten pro Jahr ≈ einem Baum entsprechen. Das soll ein Gefühl für die Größenordnung geben, keine präzise Zahl.`,
    perYearSuffix: ' / Jahr',
    recallSentencePrefix: '· Dieses Modell erkennt derzeit',
    recallSentenceSuffix: 'der Ausfälle, bevor sie eintreten.',
    recallInfoLabel: 'Wie wird diese Schätzung berechnet?',
    recallInfoBody: (recall: number) =>
      `Wir verwenden die reale Recall-Rate des Modells — wie viele der tatsächlichen Ausfälle es im Voraus erkennt. Da es derzeit ${recall}% der Ausfälle erkennt, nehmen wir an, dass auch ${recall}% Ihrer Stillstandskosten vermieden werden. Das ist eine reale, live gemessene Zahl, kein Marketing-Multiplikator — aber weiterhin eine Schätzung. Ihre tatsächliche Ersparnis hängt von Ihren eigenen Ausfallkosten, Reaktionszeiten und Abläufen ab.`,
    seeLiveNumber: 'Live-Zahl ansehen →',
  },

  statCard: {
    tapForDetails: 'Für Details tippen',
  },

  statRow: {
    failureRecall: 'Ausfall-Recall',
    failureRecallInfo:
      '„Recall“ misst, wie viele der tatsächlich aufgetretenen Maschinenausfälle im Voraus korrekt erkannt wurden. Ein höherer Wert bedeutet, dass weniger Ausfälle unbemerkt durchrutschen.',
    failurePrecision: 'Ausfall-Precision',
    failurePrecisionInfo:
      '„Precision“ misst, wie oft sich eine Ausfallwarnung als echt herausstellt. Ein höherer Wert bedeutet weniger Fehlalarme — Sie jagen keinen Problemen hinterher, die es nie wirklich gab.',
    retrainsAutomatically: 'Trainiert automatisch neu',
    lastRetrainedPrefix: 'Zuletzt neu trainiert',
    retrainsInfo:
      'Das Modell wird nicht einmal trainiert und dann sich selbst überlassen. Es trainiert sich automatisch neu, sobald neue Sensordaten eintreffen, sodass seine Vorhersagen sich stetig verbessern, statt langsam zu veralten.',
  },

  dashboardPanels: {
    overview: 'Übersicht',
    'live-machines': 'Live-Maschinen',
    alerts: 'Warnungen',
    predictions: 'Vorhersagen',
    'maintenance-queue': 'Wartungswarteschlange',
    'work-orders': 'Arbeitsaufträge',
    'model-health': 'Modellzustand',
    reports: 'Berichte',
    settings: 'Einstellungen',
  },

  productPreview: {
    eyebrow: 'Das Produkt',
    heading: 'So könnte das Dashboard aussehen.',
    bodyPrefix: 'In einer echten Fabrikumgebung: eine Wartungszentrale mit Zustand der Maschinenflotte, nach Ausfallwahrscheinlichkeit sortierten Maschinen und Live-Sensordaten. Die Seitenleiste ist',
    bodyInteractive: 'interaktiv',
    bodySuffix: ', und zeigt je nach Bereich eine Vorschau oder echte Daten — klicken Sie sich selbst durch die Abschnitte.',
    legendLiveData: 'Live, interaktive Daten',
    legendDashboardPreview: 'Dashboard-Vorschau',
    browserChromeUrl: 'preempt-analytics · Wartungszentrale',
    sectionsAriaLabel: 'Dashboard-Bereiche',
    soonBadge: 'Bald',
    inDevelopmentSuffix: ' (in Entwicklung)',
    dashboardPreviewBadge: 'Dashboard-Vorschau',
    dashboardPreviewInfoLabel: 'Was bedeutet „Dashboard-Vorschau“?',
    dashboardPreviewInfoBody:
      'Bitte beachten Sie: Diese Vorschau enthält eine größere Bandbreite an Datenpunkten, als unser Modell derzeit nutzt.',
    panelAlt: {
      overview:
        'Übersicht des Preempt Analytics Wartungsdashboards: eine Kachel „Gesamter Flottenzustand“ bei 94 %, eine Prioritäts-Wartungswarteschlange mit eingestuften Maschinen wie Press-07 (97 % Ausfallwahrscheinlichkeit, kritisch) und CNC-03 (89 %, hoch), ein Trenddiagramm der Ausfallwahrscheinlichkeit sowie Live-Sensorkacheln für Temperatur, Vibration, Drehzahl, Drehmoment und Werkzeugverschleiß.',
      alerts:
        'Konzeptioneller Mockup einer Warnungsansicht: ein Feed aus Wartungswarnungs-Karten (z. B. „Drift erkannt — Werkzeugverschleiß-Verschiebung“, „Anomale Vibration erkannt“), jeweils mit Schweregrad-Badge, Maschinen-ID und Zeitstempel, sowie eine Zusammenfassungsleiste mit aktiven/kritischen/gelösten Zählungen.',
      predictions:
        'Konzeptioneller Mockup einer Vorhersagenansicht: nach Ausfallwahrscheinlichkeit eingestufte Maschinen mit farbcodiertem Schweregrad-Balken und geschätzter Zeit bis zum wahrscheinlichen Ausfall, einer Legende der Wahrscheinlichkeitsbänder sowie einem Trenddiagramm der Wahrscheinlichkeit über die Zeit für die höchsteingestufte Maschine.',
    },
    soonPlaceholder: 'Dieser Teil des Dashboards befindet sich noch in Entwicklung.',
    liveMachines: {
      heading: 'Live-Maschinen',
      body: 'Ein echter Durchlauf der Demo, aufgezeichnet und abgespielt. Jeder Sensorwert und jede Wahrscheinlichkeit unten stammt aus den produktiven Modellen — nichts davon ist simuliert.',
      badge: 'Aufzeichnung · nicht live',
      play: 'Abspielen',
      pause: 'Pause',
      playAriaLabel: 'Aufzeichnung abspielen',
      pauseAriaLabel: 'Aufzeichnung pausieren',
      scrubAriaLabel: 'Durch die Aufzeichnung navigieren',
      machinePrefix: 'Maschine ',
      probabilityChartAriaLabel: 'Ausfallwahrscheinlichkeit über den gesamten aufgezeichneten Verlauf für die ausgewählte Maschine',
      thresholdCaption: 'Die gestrichelte Linie markiert den 80-%-Warnschwellenwert.',
      sensorLabels: {
        airTemp: 'Lufttemperatur',
        processTemp: 'Prozesstemperatur',
        rotationalSpeed: 'Drehzahl',
        torque: 'Drehmoment',
        toolWear: 'Werkzeugverschleiß',
      },
      caption: (recordedOn: string, recordedSpan: string, recordedVersions: string) =>
        `Aufgezeichnet am ${recordedOn} · ${recordedSpan} Minuten Fabrikzeit · Modelle ${recordedVersions}. Die Messwerte stammen aus dem eigenen Sensorgenerator der Demo, abgetastet aus dem AI4I-2020-Datensatz; die Wahrscheinlichkeiten sind die von den produktiven Modellen dafür zurückgegebenen Werte. Die Maschinen-IDs sind die echten aus dem Durchlauf.`,
      qualityGrade: 'Qualitätsstufe',
      predictedFailure: 'Vorhergesagter Ausfall',
      normal: 'Normal',
      failureTypes: {
        power: 'Leistungsausfall',
        toolWear: 'Werkzeugverschleiß-Ausfall',
        heatDissipation: 'Wärmeabgabe-Ausfall',
        overstrain: 'Überlastungs-Ausfall',
      },
    },
    modelHealth: {
      heading: 'Modellzustand',
      body: 'Wie gut das Modell, das gerade die Vorhersagen liefert, tatsächlich abschneidet — ausgelesen aus der Modellregistrierung beim Erstellen dieser Seite, nicht von Hand eingetragen.',
      failureRecall: 'Ausfall-Recall',
      failureRecallInfo: '„Recall“ misst, wie viele der tatsächlich aufgetretenen Maschinenausfälle im Voraus korrekt erkannt wurden.',
      failurePrecision: 'Ausfall-Precision',
      failurePrecisionInfo: '„Precision“ misst, wie oft sich eine Ausfallwarnung als echt herausstellt.',
      calibration: 'Kalibrierung',
      calibrationInfo:
        'Die meisten Kennzahlen fragen nur, ob die Ja/Nein-Entscheidung richtig war. Diese bewertet die dahinterliegende Sicherheit — wie nah die Wahrscheinlichkeiten des Modells an dem liegen, was tatsächlich eingetreten ist. Niedriger ist besser, 0 wäre perfekt.',
      trainTestGap: 'Train/Test-Differenz',
      trainTestGapInfo:
        'Wie viel besser das Modell auf den Daten abschneidet, aus denen es gelernt hat, als auf Daten, die es nie gesehen hat. Eine kleine Differenz bedeutet, dass es das Muster gelernt hat, statt die Antworten auswendig zu lernen. Sie wird bei jedem Retraining gemessen, nicht nur einmal zu Beginn geprüft.',
      modelVersion: 'Modellversion',
      modelVersionCaption: 'Binärklassifikator · Produktion',
      modelVersionInfo: 'MLflow-Versionsnummern erhöhen sich bei jedem Retraining, sodass die aktuelle Versionsnummer zugleich als Retraining-Zähler dient.',
      lastRetrained: 'Zuletzt neu trainiert',
      lastRetrainedInfo: 'Das Modell trainiert sich automatisch neu, sobald neue Sensordaten eintreffen — es wird nicht einmal trainiert und dann sich selbst überlassen.',
      healthSummaryMisses: (missOneIn: number, falseAlarms: number) =>
        `es verpasst etwa 1 von ${missOneIn} Ausfällen, und etwa ${falseAlarms} von 100 Warnungen erweisen sich als Fehlalarm`,
      healthSummaryPerfect: (falseAlarms: number) =>
        `es hat jeden Ausfall erkannt, mit dem es getestet wurde, und etwa ${falseAlarms} von 100 Warnungen erweisen sich als Fehlalarm`,
      inPlainTerms: (summary: string) =>
        `Anders gesagt: ${summary}. Jedes Retraining wird nach demselben Maßstab bewertet, bevor es das aktuell produktive Modell ersetzen darf.`,
    },
    settings: {
      heading: 'Über diese Demo',
      body: 'Vorausschauende Wartung für Industrieanlagen — eine vollständige MLOps-Pipeline: Live-Sensorvorhersagen, automatisierte Drift-Überwachung und selbstauslösendes Retraining.',
      capstoneNote: 'Ein Abschlussprojekt auf Basis simulierter CNC-Sensordaten — kein produktiver Einsatz bei zahlenden Kunden.',
      team: 'Team',
      program: 'Programm',
      source: 'Quelle',
      githubRepository: 'GitHub-Repository',
      privacy: 'Datenschutz',
      privacyValue: 'Keine Analyse, kein Tracking',
    },
    closingCaption:
      'Modellzustand und Einstellungen zeigen echte Live-Daten aus dem produktiven Modell. Übersicht, Warnungen und Vorhersagen sind Dashboard-Vorschauen davon, wie ein vollständiger Einsatz aussehen könnte.',
  },

  productPage: {
    title: 'In Aktion sehen — Preempt Analytics',
    description: 'Ein Blick in die Wartungszentrale von Preempt Analytics: Flottenzustand, nach Ausfallwahrscheinlichkeit eingestufte Maschinen und Live-Sensordaten, alles an einem Ort.',
  },

  tryItYourselfPage: {
    title: 'Selbst ausführen — Preempt Analytics',
    description: 'Führen Sie die Predictive-Maintenance-Demo von Preempt Analytics auf Ihrem eigenen Rechner aus. Zwei Voraussetzungen (Docker Desktop und Git), ein freundliches Menü und ein Link zur vollständigen Anleitung auf GitHub.',
    heading: 'Preempt Analytics auf dem eigenen Rechner ausführen.',
    subheading: 'Alles läuft innerhalb von Docker — keine Python- oder ML-Kenntnisse nötig. Nur zwei kurze Installationen, dann etwas Warten beim Herunterladen.',
    modelRetrains: 'Modell-Retrainings',
    modelRetrainsInfo:
      'Das Modell hinter dieser Demo bleibt nicht statisch. Es trainiert sich neu und stellt sich automatisch neu bereit, sobald neue Daten eintreffen — niemand macht das von Hand. Diese Zahl zählt, wie oft das bisher passiert ist.',
    ciPipelineRuns: 'CI-Pipeline-Läufe',
    ciLiveLastRun: (relative: string) => `live · letzter Lauf ${relative}`,
    ciPipelineInfo:
      'Eine CI-Pipeline („Continuous Integration“) baut und testet den Code automatisch bei jeder Änderung und fängt Probleme ab, bevor sie Sie erreichen. Diese Zahl gibt an, wie oft diese Pipeline für dieses Projekt bereits gelaufen ist.',
    trail1: {
      title: 'Noch nie so etwas gemacht? Hier ist der komplette Weg.',
      body1: 'Sie müssen nicht programmieren können. Der gesamte Weg besteht aus drei Schritten:',
      step1: '1. Docker Desktop und Git installieren (unten) — zwei kostenlose Programme, installiert wie jedes andere auch.',
      step2: '2. Den Code auf den eigenen Rechner holen — einen Befehl in ein Terminal einfügen (unten erklärt).',
      step3: '3. Das Menüskript starten und eine Zahl drücken — zuerst 6 drücken, um alles zu aktivieren, danach eine beliebige andere Zahl zum Ausprobieren.',
      closing: 'Das ist schon alles — keine Docker-Befehle zum Auswendiglernen, nur ein paar Zeilen zum Einfügen und danach eine Zahl zum Drücken.',
    },
    prerequisitesIntro: 'Sie benötigen zwei Dinge, beide kostenlos, beide nur einmalig zu installieren:',
    dockerLinkText: 'Docker Desktop',
    dockerInfoLabel: 'Was ist Docker Desktop?',
    dockerInfoBody: 'Docker Desktop ist eine kostenlose App, die dieses gesamte Projekt in einer in sich geschlossenen Box auf Ihrem Rechner ausführt — Sie müssen nicht separat Python, Datenbanken oder Ähnliches von Hand installieren.',
    dockerTrailing: '— installieren und sicherstellen, dass es läuft (das Wal-Symbol in Ihrer Menü-/Taskleiste).',
    gitLinkText: 'Git',
    gitInfoLabel: 'Was ist Git?',
    gitInfoBody: 'Git ist das Werkzeug, das die vollständige Historie eines Projekts auf Ihren Rechner herunterlädt („klont“). Macs bieten oft an, es automatisch zu installieren, sobald Sie zum ersten Mal einen Git-Befehl im Terminal eingeben — folgen Sie einfach der Aufforderung.',
    gitTrailing: '— einmalig verwendet, um den Projektordner auf Ihren Rechner zu holen.',
    getCodeHeading: 'Den Code auf den eigenen Rechner holen',
    openTerminal: 'Ein Terminal öffnen und Folgendes einfügen:',
    thatFolderNote: 'Dieser Ordner ist Ihr Projektordner für alles Weitere. Lieber erst einmal stöbern?',
    viewSourceOnGithub: 'Quellcode auf GitHub ansehen →',
    trail2: {
      title: 'Was ist GitHub? Was bedeutet „Klonen“?',
      body1: 'GitHub ist eine Website, auf der Code gespeichert und geteilt wird — vergleichbar mit einem gemeinsamen Laufwerk, nur für Softwareprojekte.',
      body2Prefix: 'Klonen bedeutet einfach, eine vollständige Kopie des Projekts auf den eigenen Rechner herunterzuladen — der Befehl',
      body2Code: 'git clone',
      body2Suffix: 'oben macht genau das.',
      body3: 'Ein Terminal (oder „Kommandozeile“) ist eine textbasierte Möglichkeit, Ihrem Rechner Anweisungen zu geben. Fügen Sie die beiden Zeilen oben nacheinander ein und drücken Sie jeweils Enter.',
    },
    easyWayHeading: 'Der einfache Weg — ein Menü, keine Befehle zum Merken',
    easyWayBody: 'Sobald der Projektordner auf Ihrem Rechner liegt (siehe oben), öffnen Sie ein Terminal in diesem Ordner und starten eines der Skripte unten. Es ersetzt jeden Docker-Befehl durch ein nummeriertes Menü.',
    macLinuxComment: '# Mac / Linux',
    windowsComment: '# Windows',
    pressSixNote: 'Zuerst 6 drücken — das aktiviert die Hintergrunddienste (einmal pro Sitzung reicht). Danach 1 oder 2 drücken, um Sensordaten zu simulieren, 3 für den Drift-Bericht, oder 4/5, um live zuzusehen.',
    typeItHeading: 'Lieber selbst eintippen? Drei Befehle',
    typeItBody: 'Das ersetzt alles oben — Code holen und Stack starten in einem Schritt, kein Menü nötig.',
    fromThereNote: 'Von dort aus können Sie Sensordaten erzeugen und beobachten, wie die Drift-Erkennung ein automatisches Retraining auslöst — die vollständige Anleitung finden Sie in der README.',
    headsUpLead: 'Zu beachten:',
    headsUpBody: 'Retraining läuft auf einer gemeinsam genutzten Demo-Pipeline (insgesamt etwa 10 Läufe/Stunde für alle zusammen). Ist dieses Limit erreicht, werden Ihre Daten trotzdem hochgeladen — das Retraining für diesen Lauf wird übersprungen statt eingereiht, und das Limit gibt sich laufend wieder frei. Nichts ist kaputt.',
    fullInstructions: 'Vollständige Anleitung auf GitHub →',
  },

  beginnersTrail: {
    eyebrow: 'Einsteiger-Pfad',
    clickToStayOpen: 'klicken, um geöffnet zu bleiben',
  },

  codeBlock: {
    copyAriaLabel: 'Befehl in die Zwischenablage kopieren',
    copy: 'Kopieren',
    copied: 'Kopiert!',
  },

  infoTip: {
    defaultLabel: 'Was bedeutet das?',
  },
};
