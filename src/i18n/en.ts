// Canonical English copy for the whole site — every component that renders
// text pulls it from here (via useTranslations()) rather than hardcoding it,
// so src/i18n/de.ts has one single, exhaustive shape to translate against.
// Structural/visual data (icon paths, positions, machine ids, nodeIndex
// cross-links) stays local to each component; only what a visitor actually
// reads lives here.
export const en = {
  common: {
    seeItInAction: 'See it in action →',
    testItOnYourDevice: 'Test it on your device',
    testItOnYourDeviceArrow: 'Test it on your device →',
    backToHome: '← Back to home',
    illustrativeExample: 'Illustrative example',
    liveUpdatedHourly: 'live · updated hourly',
    sampleMetric: 'sample metric',
    whatIsThis: 'What is this?',
    whatIs: (name: string) => `What is ${name}?`,
    moreAbout: (name: string) => `More about ${name}`,
  },

  nav: {
    skipToContent: 'Skip to content',
    homeAriaLabel: 'Preempt Analytics — home',
    toggleMenu: 'Toggle menu',
    dashboard: 'Dashboard',
    howItWorks: 'How It Works',
    solutions: 'Solutions',
    techStack: 'Tech Stack',
    projectTeam: 'Project & Team',
  },

  accessibilityMenu: {
    buttonLabel: 'Accessibility',
    panelHeading: 'Accessibility settings',
    textSize: 'Text size',
    textSizeDecrease: 'Decrease text size',
    textSizeReset: 'Reset text size',
    textSizeIncrease: 'Increase text size',
    highContrast: 'High contrast',
    highContrastDescription: 'Stronger contrast within the site’s dark theme.',
    reduceMotion: 'Reduce motion',
    reduceMotionDescription: 'Turns off hover pulses, reveals, and other ambient animation.',
    reset: 'Reset to defaults',
  },

  // buttonLabel/panelHeading are plain THIS-locale strings (like
  // accessibilityMenu's own buttonLabel). The list itself always shows each
  // language's own autonym (Wikipedia-style: "Deutsch", not "German") —
  // switchTo() is only for the per-item aria-label, which names the target
  // language IN THIS PAGE'S language ("Switch to German") rather than its
  // autonym, so a screen reader announces the control in the language it's
  // already reading.
  languageSwitcher: {
    buttonLabel: 'Language',
    panelHeading: 'Choose a language',
    switchTo: (name: string) => `Switch to ${name}`,
  },

  footer: {
    projectAndTeam: 'Project & Team',
    program: 'neuefische AI Engineering Bootcamp · Cohort 2026',
    links: 'Links',
    seeItInAction: 'See it in action',
    testItOnYourDevice: 'Test it on your device',
    githubRepository: 'GitHub repository',
    backToTop: 'Back to top ↑',
    aboutBody:
      'Predictive maintenance for industrial equipment — a complete MLOps pipeline: live sensor predictions, automated drift monitoring, and self-triggering retraining.',
    aboutCapstonePrefix: 'A capstone project showcase built on',
    aboutCapstoneBold: 'simulated CNC sensor data',
    aboutCapstoneSuffix: '— not a live paying-customer deployment, yet.',
    builtUsingOpenData: 'Built using open data from',
    madeWithLoveIn: 'Made with love in',
    europe: 'Europe',
    copyright: (year: number) => `© ${year} Preempt Analytics — capstone project. Built with Astro & Tailwind.`,
    ledTicker: 'NO ANALYTICS · NO TRACKING · NO SURVEILLANCE CAPITALISM',
    ledTickerSrOnly: 'No analytics. No tracking. No surveillance capitalism.',
    noLoggingSuffix: '— nothing you do here is logged.',
    privacyTipLabel: 'Our privacy approach',
    privacyTipBody:
      'No cookies — not even "necessary" ones. No analytics, no trackers, no fingerprinting, and nothing sent to a third party. This site doesn\'t collect anything about your visit, so there\'s nothing to ask your consent for under GDPR/ePrivacy — which is also why there\'s no cookie banner here.',
    privacyTipHostingPrefix:
      'We collect nothing ourselves, but this site is hosted on GitHub Pages — GitHub may log visitor IPs as standard server operation. See their',
    privacyTipHostingLinkLabel: 'privacy statement',
    privacyTipHostingSuffix: 'for more on this.',
  },

  siteToast: {
    illustrationAlt: 'Illustration of a tar-like monster with the Google, Apple, Facebook, Amazon, and Microsoft logos on its heads',
    headline: 'We reject surveillance capitalism',
    body: 'No cookies, no analytics, no trackers — nothing about this visit is collected, so there’s nothing to ask your consent for. This is just here to say so, once. We back that up with real choices too: self-hosted fonts, no third-party scripts, nothing quietly calling home to Google or anyone else.',
    closingInPrefix: 'Closing in',
    closingInSuffix: 's',
    paused: 'Paused',
    dismiss: 'Got it',
  },

  hero: {
    eyebrow: 'Predictive maintenance, powered by AI',
    headingLine1: 'Predict failures.',
    headingPrevent: 'Prevent',
    headingLine2: 'downtime.',
    subtitle:
      'A predictive-maintenance system that catches machine failures before they happen — built to show how manufacturing teams could maximize uptime and efficiency.',
    capstoneNote: 'A capstone project showcase, running on simulated CNC sensor data.',
    hoverForDetails: 'Hover for details',
    checkingFor: 'Checking for…',
    markers: {
      powerFailure: {
        title: 'Power Failure',
        detail: 'Tracks torque and speed together — it’s the combination that signals trouble, not either alone.',
        ariaLabel: 'Power Failure: tracks torque and speed together, since it’s the combination that signals trouble.',
      },
      toolWearFailure: {
        title: 'Tool Wear Failure',
        detail: 'Watches tool wear climb toward its replacement window — catching it before a worn tool is left to fail at random.',
        ariaLabel: 'Tool Wear Failure: watches wear-time climb toward its replacement window, before a worn tool is left to fail at random.',
      },
      heatDissipationFailure: {
        title: 'Heat Dissipation Failure',
        detail: 'Watches the temperature gap and speed together, before heat has nowhere to go.',
        ariaLabel: 'Heat Dissipation Failure: watches the temperature gap and speed together, before heat has nowhere to go.',
      },
    },
  },

  howItWorks: {
    heading: 'The AI + MLOps loop behind continuous reliability',
    subtitle: 'One system. One loop. Always learning.',
    mobileLoopBack: 'feeds back into Collect — always learning',
    steps: [
      {
        title: 'Collect',
        body: 'Stream sensor data from the machines in real time.',
        info: 'Sensors on the machines send real-time readings — temperature, vibration, pressure — every few seconds. Nothing else in this loop works without this: it’s the raw material every prediction is built on. Think of it as the system’s eyes and ears on the factory floor.',
      },
      {
        title: 'Predict',
        body: 'AI models assess failure probability continuously.',
        info: 'AI models look at those incoming readings and continuously estimate how likely each machine is to fail soon. Instead of waiting for a scheduled inspection, you get an early, ongoing read on machine health. This is what turns raw sensor data into a warning you can actually act on.',
      },
      {
        title: 'Detect',
        body: 'Anomalies and drift are caught early and automatically.',
        info: 'The system watches for two kinds of change: early warning signs of failure, and a shift in the incoming data itself (called "drift") that could make predictions less reliable. Catching drift automatically means problems get flagged before predictions quietly get worse. This step is what keeps the whole loop trustworthy.',
      },
      {
        title: 'Retrain',
        body: 'Models retrain on fresh data through the pipeline.',
        info: 'When drift or new patterns are detected, the model is automatically retrained on the freshest data — no engineer has to notice a problem and kick it off by hand. This keeps predictions accurate as machines age or conditions change. It’s what makes this a living system instead of a one-time model that slowly goes stale.',
      },
      {
        title: 'Improve',
        body: 'Predictions get better over time — cutting downtime and cost.',
        info: 'With an up-to-date model back in place, predictions get sharper instead of drifting downward over time. That means fewer surprise breakdowns and less time and money spent on unnecessary maintenance. This is where the loop pays off — every trip around Collect → Predict → Detect → Retrain leaves the system a little better than before.',
      },
    ],
    outcome: {
      title: 'Business Impact',
      body: 'Increase uptime. Lower costs. Extend asset life.',
      info: 'All of the above adds up to fewer unplanned stoppages, lower maintenance costs, and equipment that lasts longer before it needs replacing. This is the reason the whole loop exists — every technical step earns its place by producing this outcome. The results then feed back into Collect, so the improvement never stops.',
    },
  },

  benefits: {
    eyebrow: 'What the system can help with',
    heading: 'Fewer surprises. Lower costs. Longer-lasting machines.',
    tiles: [
      {
        title: 'Reduce Downtime',
        body: 'Prevent unexpected failures and unplanned stops.',
        eco: 'Emergency repairs are wasteful, not just costly — a failure caught too late often means an urgent replacement part rushed in on next-day freight instead of standard shipping. Preventing the failure means normal, planned shipping instead of a carbon-heavy scramble.',
      },
      {
        title: 'Extend Asset Life',
        body: 'Catch issues early and reduce wear and tear.',
        eco: 'Every machine carries an environmental cost baked in before it’s even switched on — the energy and raw materials used to build it. Keeping equipment running longer instead of replacing it early spreads that upfront footprint over more years of useful life.',
      },
      {
        title: 'Lower Maintenance Costs',
        body: 'Replace parts based on actual condition, not guesswork.',
        eco: 'Calendar-based maintenance often replaces parts on a fixed schedule whether they need it or not — swapping out something that still has useful life left. Replacing only what’s actually worn means less scrap metal, oil, and packaging.',
      },
      {
        title: 'Increase Operational Efficiency',
        body: 'More uptime. Smoother operations. Happier teams.',
        eco: 'A machine running with an undetected fault — vibration, misalignment, friction — typically draws more energy than one running smoothly, wasting it as heat and wear. Catching problems early keeps machines running at their efficient best, not just their functional minimum.',
      },
    ],
    ecoTipLabel: (title: string) => `Environmental benefit of ${title}`,
  },

  mlopsSystem: {
    eyebrow: 'For the technical reader',
    heading: 'The MLOps System Behind the Predictions',
    subtitlePrefix: 'The same loop from',
    subtitleLinkText: 'How it works',
    subtitleSuffix: '— now with the tools that run it.',
    builtWithHeading: 'Built with',
    poweredByHeading: 'Powered by',
    nodes: [
      {
        title: 'Sensor Data',
        body: 'Live/simulated readings from machines',
        info: 'This is the same “Collect” step from How It Works, shown here as the actual system piece that receives it: an ingestion point that takes in live sensor readings (or simulated ones, for the demo) and hands them to the prediction model.',
      },
      {
        title: 'Predict API',
        body: 'Real-time inference & failure probability',
        info: 'A small web service with one job: take in a sensor reading and return a failure-probability score, in real time. “API” just means “a way for one piece of software to ask another for something” — here, asking for a prediction.',
      },
      {
        title: 'Drift Check',
        body: 'Detects data & model drift',
        info: 'Evidently is an open-source tool that statistically compares today’s incoming sensor data against the data the model was originally trained on. If the two have drifted too far apart, that’s an early sign the model needs retraining before its predictions quietly get worse.',
      },
      {
        title: 'CI/CD',
        body: 'Automated CI/CD for ML',
        info: 'GitHub’s built-in automation runner. When drift is flagged, this is what actually kicks off the retraining job in the background — no engineer has to notice the alert and start it by hand.',
      },
      {
        title: 'DVC',
        body: 'Versioned data + retraining',
        info: 'DVC ("Data Version Control") works like Git, but for datasets and models instead of code. It keeps a versioned record of exactly which data produced which model, so every retraining run is traceable and repeatable.',
      },
      {
        title: 'MLflow',
        body: 'Compare, track & promote models',
        info: 'MLflow logs every training run’s results side by side, so a new model can be compared against the one currently live. Only a model that’s actually better gets "promoted" to production.',
      },
    ],
    builtWith: [
      {
        name: 'Python',
        body: 'Data processing & modeling',
        info: 'The programming language the whole system is written in — one of the most common languages for data science and machine learning.',
      },
      {
        name: 'Pandas',
        body: 'Data analysis',
        info: 'A Python library for loading, cleaning, and reshaping tabular data — think of it as a scriptable, programmable spreadsheet.',
      },
      {
        name: 'Scikit-learn',
        body: 'ML modeling',
        info: 'A Python library of ready-made machine learning algorithms. This is what the failure-prediction model itself is built and trained with.',
      },
      {
        name: 'NumPy',
        body: 'Numerical computing',
        info: 'The fast, low-level number-crunching library that Pandas and Scikit-learn are both built on top of — rarely used directly, but doing most of the heavy lifting underneath.',
      },
    ],
    poweredBy: [
      {
        name: 'Evidently AI',
        body: 'Data & model drift monitoring',
        info: 'The open-source library that watches for drift — comparing live production data against the training data on an ongoing basis, not just once at launch.',
      },
      {
        name: 'GitHub Actions',
        body: 'Automated CI/CD for ML',
        info: 'A free automation service built into GitHub. It’s the engine that runs the retraining pipeline on a trigger or schedule — no separate server to babysit.',
      },
      {
        name: 'DVC',
        body: 'Data version control',
        info: 'Short for "Data Version Control" — same tool as in the diagram above. It’s what makes "which data trained this exact model" an answerable question instead of a guess.',
      },
      {
        name: 'MLflow',
        body: 'Experiment tracking & model registry',
        info: 'Experiment tracking and model registry, in one tool. Every training run gets logged and compared, and whichever model is currently "promoted" is the one serving live predictions.',
      },
    ],
    claims: [
      { title: 'Automated', body: 'No manual retraining' },
      { title: 'Reproducible', body: 'DVC-versioned data & pipeline' },
      { title: 'Monitored', body: 'Evidently drift checks' },
      { title: 'Open-source stack', body: 'Runs on your own machine' },
    ],
  },

  liveFactory: {
    headingLine1: 'Live Factory.',
    headingLine2: 'Real Predictions.',
    subtitle:
      'The system can watch CNC milling machines around the clock. The moment tool wear, or process temperature starts to shift, it catches the change — often hours before that could cause a failure.',
    imageAlt: 'Isometric view of a CNC milling factory floor with five machines, glowing teal sensor lights, and a catwalk structure.',
    checkingFor: 'Checking for',
    failureModes: {
      toolWear: 'Tool Wear Failure',
      power: 'Power Failure',
      heatDissipation: 'Heat Dissipation Failure',
      overstrain: 'Overstrain Failure',
    },
    hoverForDetails: 'Hover for details',
    noDriftDetected: 'No drift detected',
    machineDetails: {
      cnc02: 'Nominal — no anomalies',
      cnc03: 'All parameters normal',
      cnc04: 'Within safe operating band',
      cnc05: 'Everything looks fine here',
    },
    healthyAriaLabel: (name: string) => `${name}: no drift detected, Safe `,
    driftDetected: 'Drift detected',
    driftAriaLabel: (name: string) => `${name}: drift detected, tool wear shift, 2.3 hours to failure`,
    toolWearShift: 'Tool Wear Shift',
    hoursToFailure: '2.3 hrs to failure',
    seeItInAction: 'See it in action →',
  },

  userStory: {
    headingLine1: 'While the dayshift',
    headingLine2: 'sleep…',
    subtitle: 'The system is able to monitor the machines all night.',
    beats: [
      { time: '02:16 AM', title: 'Drift Detected', body: 'Tool-wear shift spotted on CNC-01 by Evidently AI.' },
      { time: '02:17 AM', title: 'Pipeline Triggered', body: 'The GitHub Actions pipeline kicks off automatically.' },
      { time: '02:28 AM', title: 'Model Retrained', body: 'A fresh model trains on the latest factory data.' },
      { time: '02:45 AM', title: 'Model Promoted', body: 'The new version beats the old one and goes live automatically.' },
      { time: '06:47 AM', title: 'System Healthy', body: 'The maintenance lead opens the dashboard. No calls. No incidents.' },
    ],
    overnightImpactHeading: 'Overnight Impact',
    impact: {
      failurePrevented: '1 potential failure prevented',
      downtimeAvoided: '~8 hours of downtime avoided',
      savedSuffix: 'saved',
      productionOnTrack: 'Production stayed on track',
    },
    impactDisclaimer: 'A walkthrough of one night — not aggregated customer data.',
    impactFootnotePrefix: 'Try your own numbers in',
    impactFootnoteLink: 'the calculator below ↓',
    maintenanceLeadAlt:
      'A maintenance lead, seen from behind with no identifiable face, checking an abstract glowing dashboard on a tablet on a factory floor at night.',
    morningSummaryHeading: 'Morning Summary',
    morningSummaryLine1: 'No incidents.',
    morningSummaryLine2: 'Model upgraded overnight.',
    seeTheDashboard: 'See the dashboard →',
    closingLine1: 'One system.',
    closingLine2: 'Always learning.',
    closingLine3: 'Always protecting.',
  },

  savingsCalculator: {
    eyebrow: 'Scenario: You are in charge of a factory',
    heading: 'What could this save you?',
    subtitle: 'Drag the slider to roughly what unplanned downtime costs you each month.',
    sliderLabel: 'Your monthly unplanned downtime cost',
    sliderAriaLabel: 'Your monthly unplanned downtime cost, in euros',
    sliderInfoLabel: 'What does this include?',
    sliderInfoBody: (maxFormatted: string) =>
      `Lost production, rushed repairs, idle staff — the real cost each time a machine breaks down without warning. Not the routine maintenance you already budget for. Not sure what to pick? A single line with occasional stoppages usually costs €2,000–€10,000/month; a busier multi-shift line typically runs €15,000–${maxFormatted}/month. Start with whichever’s closer, then adjust.`,
    contextIntro: 'You may have seen bigger downtime numbers elsewhere — here’s where four widely-cited figures actually sit.',
    citations: [
      {
        value: '$2.3M',
        unit: '/hr',
        source: 'Automotive plants',
        infoLabel: 'About the Siemens figure',
        infoBody: 'Siemens’ 2024 downtime report: automotive plants can lose up to this much per hour of idle production — a different scale of operation than a single production line like the one above. Source:',
        linkText: 'Siemens, True Cost of Downtime 2024',
      },
      {
        value: '$125k',
        unit: '/hr',
        source: 'Global average',
        infoLabel: 'About the ABB figure',
        infoBody: 'ABB’s 2023 survey of 3,215 plant-maintenance leaders worldwide found this to be the global average cost per hour of unplanned downtime — many individual businesses report well below it. Source:',
        linkText: 'ABB, Value of Reliability survey',
      },
      {
        value: '€147k',
        unit: '/hr',
        source: 'Germany average',
        infoLabel: 'About the German figure',
        infoBody: 'The same ABB survey’s German breakout — an average across industrial companies of every size, not just large plants, so plenty of smaller operations sit well under it. Source:',
        linkText: 'ABB, Value of Reliability survey (Germany)',
      },
      {
        value: '<£500',
        unit: '/hr',
        source: 'Smallest UK firms',
        infoLabel: 'About the RS Industria figure',
        infoBody: 'The smallest UK manufacturers — the scale closest to a single production line — are the ones RS Industria’s survey found reporting under £500/hour. Source:',
        linkText: 'RS Industria, UK manufacturing survey',
      },
    ],
    ifNothingChanges: 'If nothing changes',
    withPredictiveMaintenance: 'With predictive maintenance',
    estimatedSavings: 'Estimated savings',
    perMonthSuffix: ' / month',
    treesSaved: 'Trees saved (equivalent)',
    treesInfoLabel: 'How is this estimated?',
    treesInfoBody: (perTreeFormatted: string) =>
      `A rough, illustrative comparison, not a carbon calculation — this project’s model predicts failures, not emissions. Unplanned downtime commonly wastes energy (idle machines, restart surges, scrapped material); we compare the scale of that avoided waste to a mature tree’s yearly CO2 absorption (~21kg), using ${perTreeFormatted} saved per year ≈ one tree. Meant to give a feel for the scale, not a precise figure.`,
    perYearSuffix: ' / year',
    recallSentencePrefix: '· This model currently catches',
    recallSentenceSuffix: 'of failures before they happen.',
    recallInfoLabel: 'How is this estimate calculated?',
    recallInfoBody: (recall: number) =>
      `We use the model’s real recall rate — how many of the real failures it catches in advance. For example, since it currently catches ${recall}% of failures, we assume ${recall}% of your downtime cost is avoided too. It’s one real, live number, not a marketing multiplier — but it’s still an estimate. Your actual savings depend on your own failure costs, response times, and operations.`,
    seeLiveNumber: 'See the live number →',
  },

  statCard: {
    tapForDetails: 'Tap for details',
  },

  statRow: {
    failureRecall: 'Failure Recall',
    failureRecallInfo:
      '"Recall" measures how many of the machine failures that actually happened were correctly flagged in advance. A higher number means fewer failures slip through unnoticed.',
    failurePrecision: 'Failure Precision',
    failurePrecisionInfo:
      '"Precision" measures how often a failure warning turns out to be a real one. A higher number means fewer false alarms — you’re not chasing problems that were never really there.',
    retrainsAutomatically: 'Retrains Automatically',
    lastRetrainedPrefix: 'Last retrained',
    retrainsInfo:
      'The model isn’t trained once and left alone. It automatically retrains itself as new sensor data comes in, so its predictions keep improving instead of slowly going stale.',
  },

  dashboardPanels: {
    overview: 'Overview',
    'live-machines': 'Live Machines',
    alerts: 'Alerts',
    predictions: 'Predictions',
    'maintenance-queue': 'Maintenance Queue',
    'work-orders': 'Work Orders',
    'model-health': 'Model Health',
    reports: 'Reports',
    settings: 'Settings',
  } as Record<string, string>,

  productPreview: {
    eyebrow: 'The product',
    heading: 'Here’s what the dashboard could look like.',
    bodyPrefix: 'in a real factory setting: A maintenance control center: fleet health, machines ranked by failure probability, and live sensor readings. The sidebar is',
    bodyInteractive: 'interactive',
    bodySuffix: ', and serves either mockups or real data— click through the sections yourself to explore.',
    legendLiveData: 'Live, interactive data',
    legendDashboardPreview: 'Dashboard preview',
    browserChromeUrl: 'preempt-analytics · maintenance control center',
    sectionsAriaLabel: 'Dashboard sections',
    soonBadge: 'Soon',
    inDevelopmentSuffix: ' (in development)',
    dashboardPreviewBadge: 'Dashboard preview',
    dashboardPreviewInfoLabel: 'What does "Dashboard preview" mean?',
    dashboardPreviewInfoBody:
      'Please note: this preview includes a wider range of data points than what our model currently uses.',
    panelAlt: {
      overview:
        'Preempt Analytics maintenance dashboard overview: an Overall Fleet Health tile at 94%, a Priority Maintenance Queue ranking machines such as Press-07 (97% failure probability, critical) and CNC-03 (89%, high), a failure-probability trend chart, and live sensor tiles for temperature, vibration, rotational speed, torque and tool wear.',
      alerts:
        'Concept mockup of an Alerts view: a feed of maintenance alert cards (e.g. "Drift Detected — Tool Wear Shift", "Abnormal Vibration Detected") each with a severity badge, machine ID, and timestamp, plus a summary strip of active/critical/resolved counts.',
      predictions:
        'Concept mockup of a Predictions view: machines ranked by failure probability with a color-coded severity bar and estimated time to likely failure, a probability-band legend, and a probability-over-time trend chart for the top-ranked machine.',
    } as Record<string, string>,
    soonPlaceholder: 'This part of the dashboard is still in development.',
    liveMachines: {
      heading: 'Live Machines',
      body: 'A real run of the demo, recorded and played back. Every sensor reading and every probability below came out of the production models — none of it is mocked up.',
      badge: 'Recording · not live',
      play: 'Play',
      pause: 'Pause',
      playAriaLabel: 'Play recording',
      pauseAriaLabel: 'Pause recording',
      scrubAriaLabel: 'Scrub through the recording',
      machinePrefix: 'Machine ',
      probabilityChartAriaLabel: 'Failure probability across the whole recorded run for the selected machine',
      thresholdCaption: 'Dashed line marks the 80% alert threshold.',
      sensorLabels: {
        airTemp: 'Air temp',
        processTemp: 'Process temp',
        rotationalSpeed: 'Rotational speed',
        torque: 'Torque',
        toolWear: 'Tool wear',
      },
      caption: (recordedOn: string, recordedSpan: string, recordedVersions: string) =>
        `Recorded ${recordedOn} · ${recordedSpan} minutes of factory time · models ${recordedVersions}. Readings come from the demo’s own sensor generator, sampled from the AI4I 2020 dataset; the probabilities are what the production models returned for them. Machine ids are the real ones from the run.`,
      qualityGrade: 'quality grade',
      predictedFailure: 'Predicted failure',
      normal: 'Normal',
      failureTypes: {
        power: 'Power Failure',
        toolWear: 'Tool Wear Failure',
        heatDissipation: 'Heat Dissipation Failure',
        overstrain: 'Overstrain Failure',
      },
    },
    modelHealth: {
      heading: 'Model Health',
      body: 'How well the model that’s serving predictions right now actually performs — read from the model registry when this page was built, not typed in by hand.',
      failureRecall: 'Failure Recall',
      failureRecallInfo: '"Recall" measures how many of the machine failures that actually happened were correctly flagged in advance.',
      failurePrecision: 'Failure Precision',
      failurePrecisionInfo: '"Precision" measures how often a failure warning turns out to be a real one.',
      calibration: 'Calibration',
      calibrationInfo:
        'Most scores only ask whether the yes/no call was right. This one scores the confidence behind it — how close the model’s probabilities land to what actually happened. Lower is better, and 0 would be perfect.',
      trainTestGap: 'Train/Test Gap',
      trainTestGapInfo:
        'How much better the model scores on the data it learned from than on data it had never seen. A small gap means it learned the pattern rather than memorizing the answers. It’s measured on every retrain, not checked once at the start.',
      modelVersion: 'Model Version',
      modelVersionCaption: 'binary classifier · production',
      modelVersionInfo: 'MLflow version numbers increment with every retrain, so the current version number doubles as a retrain count.',
      lastRetrained: 'Last Retrained',
      lastRetrainedInfo: 'The model retrains itself automatically as new sensor data comes in — it isn’t trained once and left alone.',
      healthSummaryMisses: (missOneIn: number, falseAlarms: number) =>
        `it misses roughly 1 failure in ${missOneIn}, and about ${falseAlarms} of every 100 warnings turn out to be false alarms`,
      healthSummaryPerfect: (falseAlarms: number) =>
        `it flagged every failure it was tested on, and about ${falseAlarms} of every 100 warnings turn out to be false alarms`,
      inPlainTerms: (summary: string) =>
        `In plain terms: ${summary}. Every retrain is scored the same way before it’s allowed to replace the model already in production.`,
    },
    settings: {
      heading: 'About this demo',
      body: 'Predictive maintenance for industrial equipment — a complete MLOps pipeline: live sensor predictions, automated drift monitoring, and self-triggering retraining.',
      capstoneNote: 'A capstone project showcase built on simulated CNC sensor data — not a live paying-customer deployment.',
      team: 'Team',
      program: 'Program',
      source: 'Source',
      githubRepository: 'GitHub repository',
      privacy: 'Privacy',
      privacyValue: 'No analytics, no tracking',
    },
    closingCaption:
      'Model Health and Settings show real, live data from the production model. Overview, Alerts, and Predictions are dashboard previews of how a full deployment might look.',
  },

  productPage: {
    title: 'See it in action — Preempt Analytics',
    description: 'A look at the Preempt Analytics maintenance control center: fleet health, machines ranked by failure probability, and live sensor readings, all in one place.',
  },

  tryItYourselfPage: {
    title: 'Run it yourself — Preempt Analytics',
    description: 'Run the Preempt Analytics predictive-maintenance demo on your own machine. Two prerequisites (Docker Desktop and Git), a friendly menu, and a link to the full instructions on GitHub.',
    heading: 'Run Preempt Analytics on your own machine.',
    subheading: 'Everything runs inside Docker — no Python, no ML knowledge needed. Just two quick installs, then some waiting while things download.',
    modelRetrains: 'Model Retrains',
    modelRetrainsInfo:
      'The model behind this demo doesn’t stay frozen. It retrains and redeploys itself automatically as new data comes in — no one does it by hand. This number counts how many times that’s happened so far.',
    ciPipelineRuns: 'CI Pipeline Runs',
    ciLiveLastRun: (relative: string) => `live · last run ${relative}`,
    ciPipelineInfo:
      'A CI ("continuous integration") pipeline automatically builds and tests the code every time it changes, catching problems before they reach you. This number is how many times that pipeline has run on this project.',
    trail1: {
      title: 'Never done anything like this before? Here’s the whole path.',
      body1: 'You don’t need to know how to code. The whole journey is three steps:',
      step1: '1. Install Docker Desktop and Git (below) — two free apps, installed like any other program.',
      step2: '2. Get the code onto your computer — paste one command into a terminal (explained below).',
      step3: '3. Run the menu script and press a number — press 6 first to turn everything on, then any other number to try something.',
      closing: 'That’s the whole thing — no Docker commands to memorize, just a couple of lines to paste and a number to press after that.',
    },
    prerequisitesIntro: 'You need two things, both free, both one-time installs:',
    dockerLinkText: 'Docker Desktop',
    dockerInfoLabel: 'What is Docker Desktop?',
    dockerInfoBody: 'Docker Desktop is a free app that runs this whole project in a self-contained box on your computer — you won’t need to separately install Python, databases, or anything else by hand.',
    dockerTrailing: '— install it and make sure it’s running (the whale icon in your menu/task bar).',
    gitLinkText: 'Git',
    gitInfoLabel: 'What is Git?',
    gitInfoBody: 'Git is the tool that downloads ("clones") a project’s full history onto your computer. Macs often offer to install it automatically the first time you type a git command in Terminal — just follow the prompt.',
    gitTrailing: '— used once, to get the project folder onto your computer.',
    getCodeHeading: 'Get the code onto your computer',
    openTerminal: 'Open a terminal and paste this:',
    thatFolderNote: 'That folder is your project folder for everything below. Prefer to browse first?',
    viewSourceOnGithub: 'View the source on GitHub →',
    trail2: {
      title: 'What’s GitHub? What does "cloning" mean?',
      body1: 'GitHub is a website where code is stored and shared — think of it like a shared drive, but for software projects.',
      body2Prefix: 'Cloning just means downloading a full copy of that project onto your own computer — the',
      body2Code: 'git clone',
      body2Suffix: 'command above does exactly that.',
      body3: 'A terminal (or "command line") is a text-based way of giving your computer instructions. Paste the two lines above in, one at a time, and press Enter after each.',
    },
    easyWayHeading: 'The easy way — a menu, no commands to remember',
    easyWayBody: 'Once you have the project folder on your computer (see above), open a terminal in that folder and run one script below. It replaces every Docker command with a numbered menu.',
    macLinuxComment: '# Mac / Linux',
    windowsComment: '# Windows',
    pressSixNote: 'Press 6 first — that turns on the background services (once per session is enough). After that, press 1 or 2 to simulate sensor readings, 3 to open the drift report, or 4/5 to watch things happen live.',
    typeItHeading: 'Prefer to type it? Three commands',
    typeItBody: 'This replaces everything above — get the code and start the stack in one go, no menu needed.',
    fromThereNote: 'From there you can generate sensor readings and watch drift detection trigger an automatic retraining run — the full walkthrough lives in the README.',
    headsUpLead: 'Heads up:',
    headsUpBody: 'retraining runs on a shared demo pipeline (about 10 runs/hour for everyone combined). If that limit’s been hit, your data still uploads — this run’s retraining is skipped rather than queued, and the limit frees up again on a rolling basis. Nothing is broken.',
    fullInstructions: 'Full instructions on GitHub →',
  },

  beginnersTrail: {
    eyebrow: 'Beginner’s trail',
    clickToStayOpen: 'click to stay open',
  },

  codeBlock: {
    copyAriaLabel: 'Copy command to clipboard',
    copy: 'Copy',
    copied: 'Copied!',
  },

  infoTip: {
    defaultLabel: 'What is this?',
  },
};
