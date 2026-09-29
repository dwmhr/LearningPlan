// Temporary mock data. Shape here should mirror whatever the backend
// endpoint eventually returns for each of these — no UI concerns (icons,
// colors, styling) belong in this file; those stay in the component
// (see SKILL_STYLES / ASSESSMENT_ICONS etc. in the components file).

import {
  IeltsAssessment,
  IeltsFocusArea,
  IeltsOverview,
  IeltsSyllabus,
} from "./ielts-types";

export const ieltsOverview: IeltsOverview = {
  packageName: "Standard Package",
  hours: 15,
  bandLow: 5.5,
  bandHigh: 6.5,
  targetBand: 8.0,
  skills: [
    { key: "listening", label: "Listening", score: 5.5, target: 6.5 },
    { key: "reading", label: "Reading", score: 6.0, target: 7.0 },
    { key: "writing", label: "Writing", score: 8.5, target: 9.0 },
    { key: "speaking", label: "Speaking", score: 7.5, target: 8.5 },
  ],
};

export const ieltsFocusAreas: IeltsFocusArea[] = [
  {
    key: "listening",
    title: "Specific Details",
    ctaLabel: "Practice Listening",
    href: "/ielts/listening",
  },
  {
    key: "reading",
    title: "Identifying Main Ideas",
    ctaLabel: "Practice Reading",
    href: "/ielts/reading",
  },
  {
    key: "writing",
    title: "Task Achievement",
    ctaLabel: "Practice Writing",
    href: "/ielts/writing",
  },
  {
    key: "speaking",
    title: "Fluency & Cohesion",
    ctaLabel: "Practice Speaking",
    href: "/ielts/speaking",
  },
];

export const ieltsSyllabus: IeltsSyllabus = {
  title: "Syllabus",
  description:
    "Sequence is generated from the diagnostic test score, piece database, package mapping, and SWLR rotation.",
  blocks: [
    { block: 1, hours: 15 },
    { block: 2, hours: 30 },
    { block: 3, hours: 45 },
  ],
  rows: [
    /* ================================================================ */
    /* BLOCK 1 — 15 hours                                                */
    /* ================================================================ */

    // --- Orientation ---
    {
      session: 1,
      skill: "All Skills",
      block: 1,
      bandLane: "IELTS Orientation",
      title: "Introduction to IELTS",
      details:
        "This session introduces the IELTS test format, four-skill structure, scoring logic, and learning pathway so students understand how each skill session connects to their target band.",
      asyncReinforcement:
        "Students review the IELTS test overview from tutor OR complete the IELTS Orientation Quiz on LMS.",
      done: false,
    },

    // --- Listening block (3 sessions) ---
    {
      session: 2,
      skill: "Listening",
      block: 1,
      bandLane: "5.5-6.0",
      title: "Listening Accuracy Lab: Keyword capture",
      details:
        "This session strengthens students' ability to notice keyword capture while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Paraphrase Mapping. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on keyword capture from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 3,
      skill: "Listening",
      block: 1,
      bandLane: "5.5-6.0",
      title: "Listening Prediction Drill: Predict answer type",
      details:
        "This session strengthens students' ability to notice predict answer type while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Prediction Practice. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on predict answer type from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 4,
      skill: "Listening",
      block: 1,
      bandLane: "5.5-6.0",
      title: "Listening Accuracy Lab: Predict answer type (2)",
      details:
        "This session strengthens students' ability to notice predict answer type (2) while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Model Analysis. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on predict answer type (2) from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },

    // --- Reading block (3 sessions) ---
    {
      session: 5,
      skill: "Reading",
      block: 1,
      bandLane: "6.0-6.5",
      title: "Reading Question Strategy: Skimming main idea",
      details:
        "This session trains students to use skimming main idea when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Question Strategy. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on skimming main idea from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 6,
      skill: "Reading",
      block: 1,
      bandLane: "6.0-6.5",
      title: "Reading Paraphrase Mapping: Scanning detail",
      details:
        "This session trains students to use scanning detail when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Paraphrase Mapping. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on scanning detail from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 7,
      skill: "Reading",
      block: 1,
      bandLane: "6.0-6.5",
      title: "Reading Paraphrase Mapping: Paraphrase spotting",
      details:
        "This session trains students to use paraphrase spotting when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Paraphrase Mapping. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on paraphrase spotting from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },

    // --- Writing block (3 sessions) ---
    {
      session: 8,
      skill: "Writing",
      block: 1,
      bandLane: "7.5-8.0",
      title:
        "Writing Development Workshop: Task achievement (for task 1) and task response (for task 2)",
      details:
        "This session helps students turn task achievement (for task 1) and task response (for task 2) into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Response Development. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on task achievement (for task 1) and task response (for task 2) from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 9,
      skill: "Writing",
      block: 1,
      bandLane: "7.5-8.0",
      title: "Writing Revision Clinic: Coherence and cohesion",
      details:
        "This session helps students turn coherence and cohesion into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on coherence and cohesion from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 10,
      skill: "Writing",
      block: 1,
      bandLane: "7.5-8.0",
      title: "Writing Revision Clinic: Grammatical range and accuracy",
      details:
        "This session helps students turn grammatical range and accuracy into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on grammatical range and accuracy from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },

    // --- Speaking block (3 sessions) ---
    {
      session: 11,
      skill: "Speaking",
      block: 1,
      bandLane: "7.5-8.0",
      title: "Speaking Simulation: Hesitation control",
      details:
        "This session helps students make hesitation control usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on hesitation control from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 12,
      skill: "Speaking",
      block: 1,
      bandLane: "7.5-8.0",
      title: "Speaking Simulation: Fluency pace",
      details:
        "This session helps students make fluency pace usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on fluency pace from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 13,
      skill: "Speaking",
      block: 1,
      bandLane: "7.5-8.0",
      title: "Speaking Model Review: Answer expansion - giving reasons/examples",
      details:
        "This session helps students make answer expansion - giving reasons/examples usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Model Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on answer expansion - giving reasons/examples from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },

    // --- Drilling block (2 sessions) ---
    {
      session: 14,
      skill: "Drilling",
      block: 1,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Listening & Reading focus",
      details:
        "This session runs timed, exam-style drilling that combines Listening and Reading — the two skills holding the overall band back the most per the diagnostic test — to reinforce keyword capture, prediction, and scanning/skimming strategy under real test conditions. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from the previous sessions.",
      asyncReinforcement:
        "Students complete and submit a timed Listening + Reading mock section from tutor OR complete the Mixed Drilling Quiz on LMS.",
      done: false,
    },
    {
      session: 15,
      skill: "Drilling",
      block: 1,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Full four-skill review",
      details:
        "This session runs a compressed, full four-skill drilling round covering Listening, Reading, Writing, and Speaking, so students practice switching between skills under time pressure the way they will on test day. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from all previous sessions.",
      asyncReinforcement:
        "Students complete and submit a full timed mock section from tutor OR complete the Final Drilling Quiz on LMS.",
      done: false,
    },

    // --- Final Assessment (kept inside block 1, unchanged from before) ---
  

    /* ================================================================ */
    /* BLOCK 2 — sessions 16-31 (31 hours total)                        */
    /* ================================================================ */

    // --- Orientation ---
  
    // --- Listening (3 sessions) ---
    {
      session: 16,
      skill: "Listening",
      block: 2,
      bandLane: "6.0-6.5",
      title: "Listening Accuracy Lab: Distinguishing similar sounds",
      details:
        "This session strengthens students' ability to notice distinguishing similar sounds while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Sound Discrimination. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on distinguishing similar sounds from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 17,
      skill: "Listening",
      block: 2,
      bandLane: "6.0-6.5",
      title: "Listening Prediction Drill: Note completion accuracy",
      details:
        "This session strengthens students' ability to notice note completion accuracy while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Note Completion Practice. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on note completion accuracy from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 18,
      skill: "Listening",
      block: 2,
      bandLane: "6.0-6.5",
      title: "Listening Model Review: Multiple-choice distractors",
      details:
        "This session strengthens students' ability to notice multiple-choice distractors while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Model Analysis. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on multiple-choice distractors from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },

    // --- Reading (3 sessions) ---
    {
      session: 19,
      skill: "Reading",
      block: 2,
      bandLane: "6.5-7.0",
      title: "Reading Question Strategy: Matching headings",
      details:
        "This session trains students to use matching headings when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Question Strategy. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on matching headings from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 20,
      skill: "Reading",
      block: 2,
      bandLane: "6.5-7.0",
      title: "Reading Paraphrase Mapping: True/False/Not Given accuracy",
      details:
        "This session trains students to use true/false/not given accuracy when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Paraphrase Mapping. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on true/false/not given accuracy from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 21,
      skill: "Reading",
      block: 2,
      bandLane: "6.5-7.0",
      title: "Reading Model Review: Sentence completion",
      details:
        "This session trains students to use sentence completion when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Model Analysis. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on sentence completion from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },

    // --- Writing (3 sessions) ---
    {
      session: 22,
      skill: "Writing",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Writing Development Workshop: Complex sentence structures",
      details:
        "This session helps students turn complex sentence structures into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Response Development. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on complex sentence structures from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 23,
      skill: "Writing",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Writing Revision Clinic: Lexical resource",
      details:
        "This session helps students turn lexical resource into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on lexical resource from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 24,
      skill: "Writing",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Writing Revision Clinic: Task 2 argument development",
      details:
        "This session helps students turn task 2 argument development into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on task 2 argument development from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
      {
      session: 25,
      skill: "Writing",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Writing Revision Clinic: Task 2 argument development",
      details:
        "This session helps students turn task 2 argument development into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on task 2 argument development from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },

    // --- Speaking (3 sessions) ---
    {
      session: 26,
      skill: "Speaking",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Speaking Simulation: Part 2 long-turn structuring",
      details:
        "This session helps students make part 2 long-turn structuring usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on part 2 long-turn structuring from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 27,
      skill: "Speaking",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Speaking Simulation: Part 3 abstract discussion",
      details:
        "This session helps students make part 3 abstract discussion usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on part 3 abstract discussion from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 28,
      skill: "Speaking",
      block: 2,
      bandLane: "8.0-8.5",
      title: "Speaking Model Review: Idiomatic expression",
      details:
        "This session helps students make idiomatic expression usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Model Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on idiomatic expression from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },

    // --- Drilling (3 sessions) ---
    {
      session: 29,
      skill: "Drilling",
      block: 2,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Listening & Reading focus (Round 2)",
      details:
        "This session runs timed, exam-style drilling that combines Listening and Reading again, at a higher level of difficulty, to reinforce sound discrimination, note completion, and True/False/Not Given accuracy under real test conditions. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from the previous sessions.",
      asyncReinforcement:
        "Students complete and submit a timed Listening + Reading mock section from tutor OR complete the Mixed Drilling Quiz on LMS.",
      done: false,
    },
    {
      session: 30,
      skill: "Drilling",
      block: 2,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Writing & Speaking focus",
      details:
        "This session runs timed, exam-style drilling that combines Writing and Speaking, pushing students to apply complex sentence structures, lexical resource, and long-turn structuring under real test conditions. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from the previous sessions.",
      asyncReinforcement:
        "Students complete and submit a timed Writing + Speaking mock section from tutor OR complete the Mixed Drilling Quiz on LMS.",
      done: false,
    },
   

    /* ================================================================ */
    /* BLOCK 3 — sessions 32-49 (49 hours total)                        */
    /* ================================================================ */

    // --- Orientation ---
   
    // --- Listening (3 sessions) ---
    {
      session: 31,
      skill: "Listening",
      block: 3,
      bandLane: "6.5-7.0",
      title: "Listening Accuracy Lab: Complex instructions and sequencing",
      details:
        "This session strengthens students' ability to notice complex instructions and sequencing while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Sequencing Practice. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on complex instructions and sequencing from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 32,
      skill: "Listening",
      block: 3,
      bandLane: "6.5-7.0",
      title: "Listening Prediction Drill: Map and plan labelling",
      details:
        "This session strengthens students' ability to notice map and plan labelling while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Prediction Practice. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on map and plan labelling from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },
    {
      session: 33,
      skill: "Listening",
      block: 3,
      bandLane: "6.5-7.0",
      title: "Listening Model Review: Speaker attitude and tone",
      details:
        "This session strengthens students' ability to notice speaker attitude and tone while processing IELTS audio, especially when information is short, fast, or easy to confuse. Activity type: Model Analysis. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on speaker attitude and tone from tutor OR complete the Listening Quiz on LMS.",
      done: false,
    },

    // --- Reading (3 sessions) ---
    {
      session: 34,
      skill: "Reading",
      block: 3,
      bandLane: "7.0-7.5",
      title: "Reading Question Strategy: Summary completion",
      details:
        "This session trains students to use summary completion when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Question Strategy. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on summary completion from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 35,
      skill: "Reading",
      block: 3,
      bandLane: "7.0-7.5",
      title: "Reading Paraphrase Mapping: Matching features",
      details:
        "This session trains students to use matching features when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Paraphrase Mapping. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on matching features from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },
    {
      session: 36,
      skill: "Reading",
      block: 3,
      bandLane: "7.0-7.5",
      title: "Reading Model Review: Yes/No/Not Given accuracy",
      details:
        "This session trains students to use yes/no/not given accuracy when navigating IELTS Reading passages and choosing answers based on text evidence rather than surface keywords. Activity type: Model Analysis. The emphasis is repeated IELTS-style application, noticing recurring errors, and explaining answer choices.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on yes/no/not given accuracy from tutor OR complete the Reading Quiz on LMS.",
      done: false,
    },

    // --- Writing (4 sessions) ---
        {
      session: 37,
      skill: "Writing",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Writing Revision Clinic: Cohesive devices at band 9",
      details:
        "This session helps students turn cohesive devices at band 9 into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on cohesive devices at band 9 from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 38,
      skill: "Writing",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Writing Revision Clinic: Advanced vocabulary precision",
      details:
        "This session helps students turn advanced vocabulary precision into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Error Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on advanced vocabulary precision from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },
    {
      session: 39,
      skill: "Writing",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Writing Development Workshop: Balanced argument essays for Task 2",
      details:
        "This session helps students turn balanced argument essays for task 2 into clearer IELTS Writing output, with attention to task fulfilment, organization, and sentence-level control. Activity type: Response Development. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on balanced argument essays for task 2 from tutor OR complete the Writing Quiz on LMS.",
      done: false,
    },

    // --- Speaking (4 sessions) ---
   
    {
      session: 40,
      skill: "Speaking",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Speaking Simulation: Extended answers on abstract topics",
      details:
        "This session helps students make extended answers on abstract topics usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on extended answers on abstract topics from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 41,
      skill: "Speaking",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Speaking Model Review: Native-like collocations",
      details:
        "This session helps students make native-like collocations usable in IELTS Speaking answers before moving into longer or less scaffolded responses. Activity type: Model Analysis. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on native-like collocations from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 42,
      skill: "Speaking",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Speaking Simulation: Full mock interview",
      details:
        "This session helps students make a full mock interview usable in IELTS Speaking answers before sitting the real test, combining Part 1, Part 2, and Part 3 into one continuous, timed run-through. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on a full mock interview from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },
    {
      session: 43,
      skill: "Speaking",
      block: 3,
      bandLane: "8.5-9.0",
      title: "Speaking Simulation: Full mock interview",
      details:
        "This session helps students make a full mock interview usable in IELTS Speaking answers before sitting the real test, combining Part 1, Part 2, and Part 3 into one continuous, timed run-through. Activity type: Speaking Simulation. The emphasis is precision, flexibility, self-correction, and higher-band quality control.",
      asyncReinforcement:
        "Students complete and submit independent IELTS-style practice on a full mock interview from tutor OR complete the Speaking Quiz on LMS.",
      done: false,
    },

    // --- Drilling (3 sessions) ---
    {
      session: 44,
      skill: "Drilling",
      block: 3,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Listening & Reading focus (Round 3)",
      details:
        "This session runs timed, exam-style drilling that combines Listening and Reading at full test difficulty, reinforcing sequencing, map labelling, summary completion, and matching-features accuracy under real test conditions. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from the previous sessions.",
      asyncReinforcement:
        "Students complete and submit a timed Listening + Reading mock section from tutor OR complete the Mixed Drilling Quiz on LMS.",
      done: false,
    },
        {
      session: 45,
      skill: "Drilling",
      block: 3,
      bandLane: "Consolidation",
      title: "Mixed-Skill Drilling: Full four-skill final review",
      details:
        "This session runs a full, exam-length four-skill drilling round covering Listening, Reading, Writing, and Speaking, so students rehearse the complete test-day sequence and timing before the final assessment. Activity type: Timed Drilling. The emphasis is speed, accuracy under pressure, and consolidating strategies from every previous session.",
      asyncReinforcement:
        "Students complete and submit a full timed mock section from tutor OR complete the Final Drilling Quiz on LMS.",
      done: false,
    },
  ],
};

export const ieltsAssessments: IeltsAssessment[] = [
  {
    key: "diagnostic",
    title: "Diagnostic Test",
    status: "completed",
    statusLabel: "Completed",

    overallLow: 5.5,
    overallHigh: 6.5,
    overallSummary:
      "Solid foundation overall, led by strong writing performance. Listening and reading are the two skills holding the overall band back the most, so they're the priority for the next study block.",
    listening: {
      low: 5.0,
      high: 6.0,
      summary:
        "Missed specific details in fast-paced audio, especially numbers, names, and dates during section 2 and 3.",
      nextAction: "Drill note-completion tasks using authentic academic lecture recordings.",
    },
    reading: {
      low: 5.5,
      high: 6.5,
      summary:
        "Paraphrasing recognition is solid, but accuracy drops on main-idea and matching-heading question types.",
      nextAction: "Practice skimming for gist before attempting matching-heading exercises.",
    },
    writing: {
      low: 8.0,
      high: 9.0,
      summary:
        "Strongest skill so far — clear task response and coherent paragraphing in both Task 1 and Task 2.",
      nextAction: "Refine advanced vocabulary range to push toward a consistent band 9.",
    },
    speaking: {
      low: 7.0,
      high: 8.0,
      summary:
        "Generally fluent with good range, but hesitation increases noticeably in Part 3 abstract discussion.",
      nextAction: "Practice extended answers on abstract/opinion topics to reduce hesitation.",
    },
  },
  {
    key: "pretest",
    title: "Pretest",
    status: "upcoming",
    statusLabel: "Upcoming",
  },
  {
    key: "final",
    title: "Final Test",
    status: "upcoming",
    statusLabel: "Upcoming",
  },
];