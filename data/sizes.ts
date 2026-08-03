// ── Men's suit sizing chart ───────────────────────────────────────────────────
// All measurements are in inches.
// Three fits are provided: Slim (closer cut), Tailored (standard), Classic (relaxed).

export type SizeLabel = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type FitType   = "Slim" | "Tailored" | "Classic";

// ── Men's shoe sizes (UK / US side-by-side) ──────────────────────────────────
export type ShoeSizeLabel =
  | "UK 6 / US 7"
  | "UK 6.5 / US 7.5"
  | "UK 7 / US 8"
  | "UK 7.5 / US 8.5"
  | "UK 8 / US 9"
  | "UK 8.5 / US 9.5"
  | "UK 9 / US 10"
  | "UK 9.5 / US 10.5"
  | "UK 10 / US 11"
  | "UK 10.5 / US 11.5"
  | "UK 11 / US 12"
  | "UK 12 / US 13";

export const SHOE_SIZES: ShoeSizeLabel[] = [
  "UK 6 / US 7",
  "UK 6.5 / US 7.5",
  "UK 7 / US 8",
  "UK 7.5 / US 8.5",
  "UK 8 / US 9",
  "UK 8.5 / US 9.5",
  "UK 9 / US 10",
  "UK 9.5 / US 10.5",
  "UK 10 / US 11",
  "UK 10.5 / US 11.5",
  "UK 11 / US 12",
  "UK 12 / US 13",
];

export interface SizeMeasurement {
  neck:          string;  // e.g. "14.5 – 15"
  chest:         string;
  stomach:       string;
  waist:         string;
  shoulder:      string;  // single value
  jacketLength:  string;  // single value
  pantsLength:   string;  // inseam range
  sleeve:        string;  // single value
}

export const SIZE_LABELS: SizeLabel[] = ["XS", "S", "M", "L", "XL", "XXL"];
export const FIT_TYPES:   FitType[]   = ["Slim", "Tailored", "Classic"];

// ── Measurement descriptions ─────────────────────────────────────────────────

export const MEASUREMENT_LABELS: Record<keyof SizeMeasurement, string> = {
  neck:         "Neck",
  chest:        "Chest",
  stomach:      "Stomach",
  waist:        "Waist",
  shoulder:     "Shoulder Width",
  jacketLength: "Jacket Length",
  pantsLength:  "Pants Inseam",
  sleeve:       "Sleeve Length",
};

export const MEASUREMENT_HOW_TO: Record<keyof SizeMeasurement, string> = {
  neck:         "Measure around base of neck where collar sits",
  chest:        "Measure fullest part of chest, arms relaxed",
  stomach:      "Measure around the torso midway between chest and waist",
  waist:        "Measure around natural waistline, above hip bones",
  shoulder:     "Measure seam to seam across the back of shoulders",
  jacketLength: "From centre-back collar to jacket hem",
  pantsLength:  "From crotch seam to ankle bone (inseam)",
  sleeve:       "From shoulder seam to wrist bone",
};

// ── Tailored (base) measurements per size ────────────────────────────────────
const TAILORED: Record<SizeLabel, SizeMeasurement> = {
  XS:  { neck: "13.5 – 14",  chest: "34 – 35", stomach: "32 – 33", waist: "28 – 29", shoulder: "16.5", jacketLength: "28.5", pantsLength: "29 – 30", sleeve: "32.5" },
  S:   { neck: "14.5 – 15",  chest: "36 – 37", stomach: "34 – 35", waist: "30 – 31", shoulder: "17.0", jacketLength: "29.5", pantsLength: "30 – 31", sleeve: "33.5" },
  M:   { neck: "15.5 – 16",  chest: "38 – 39", stomach: "36 – 37", waist: "32 – 33", shoulder: "17.5", jacketLength: "30.0", pantsLength: "31 – 32", sleeve: "34.5" },
  L:   { neck: "16.5 – 17",  chest: "40 – 41", stomach: "38 – 39", waist: "34 – 35", shoulder: "18.0", jacketLength: "30.5", pantsLength: "32 – 33", sleeve: "35.5" },
  XL:  { neck: "17.5 – 18",  chest: "42 – 43", stomach: "40 – 41", waist: "36 – 37", shoulder: "18.5", jacketLength: "31.0", pantsLength: "33 – 34", sleeve: "36.5" },
  XXL: { neck: "18.5 – 19",  chest: "44 – 45", stomach: "42 – 43", waist: "38 – 39", shoulder: "19.0", jacketLength: "31.5", pantsLength: "34 – 35", sleeve: "37.5" },
};

// ── Slim: 2" narrower chest/stomach, 1.5" narrower waist ─────────────────────
const SLIM: Record<SizeLabel, SizeMeasurement> = {
  XS:  { neck: "13.5 – 14",  chest: "32 – 33", stomach: "30 – 31", waist: "26.5 – 27.5", shoulder: "16.5", jacketLength: "28.5", pantsLength: "29 – 30", sleeve: "32.5" },
  S:   { neck: "14.5 – 15",  chest: "34 – 35", stomach: "32 – 33", waist: "28.5 – 29.5", shoulder: "17.0", jacketLength: "29.5", pantsLength: "30 – 31", sleeve: "33.5" },
  M:   { neck: "15.5 – 16",  chest: "36 – 37", stomach: "34 – 35", waist: "30.5 – 31.5", shoulder: "17.5", jacketLength: "30.0", pantsLength: "31 – 32", sleeve: "34.5" },
  L:   { neck: "16.5 – 17",  chest: "38 – 39", stomach: "36 – 37", waist: "32.5 – 33.5", shoulder: "18.0", jacketLength: "30.5", pantsLength: "32 – 33", sleeve: "35.5" },
  XL:  { neck: "17.5 – 18",  chest: "40 – 41", stomach: "38 – 39", waist: "34.5 – 35.5", shoulder: "18.5", jacketLength: "31.0", pantsLength: "33 – 34", sleeve: "36.5" },
  XXL: { neck: "18.5 – 19",  chest: "42 – 43", stomach: "40 – 41", waist: "36.5 – 37.5", shoulder: "19.0", jacketLength: "31.5", pantsLength: "34 – 35", sleeve: "37.5" },
};

// ── Classic: 2" wider chest/stomach/waist ────────────────────────────────────
const CLASSIC: Record<SizeLabel, SizeMeasurement> = {
  XS:  { neck: "13.5 – 14",  chest: "36 – 37", stomach: "34 – 35", waist: "30 – 31", shoulder: "16.5", jacketLength: "28.5", pantsLength: "29 – 30", sleeve: "32.5" },
  S:   { neck: "14.5 – 15",  chest: "38 – 39", stomach: "36 – 37", waist: "32 – 33", shoulder: "17.0", jacketLength: "29.5", pantsLength: "30 – 31", sleeve: "33.5" },
  M:   { neck: "15.5 – 16",  chest: "40 – 41", stomach: "38 – 39", waist: "34 – 35", shoulder: "17.5", jacketLength: "30.0", pantsLength: "31 – 32", sleeve: "34.5" },
  L:   { neck: "16.5 – 17",  chest: "42 – 43", stomach: "40 – 41", waist: "36 – 37", shoulder: "18.0", jacketLength: "30.5", pantsLength: "32 – 33", sleeve: "35.5" },
  XL:  { neck: "17.5 – 18",  chest: "44 – 45", stomach: "42 – 43", waist: "38 – 39", shoulder: "18.5", jacketLength: "31.0", pantsLength: "33 – 34", sleeve: "36.5" },
  XXL: { neck: "18.5 – 19",  chest: "46 – 47", stomach: "44 – 45", waist: "40 – 41", shoulder: "19.0", jacketLength: "31.5", pantsLength: "34 – 35", sleeve: "37.5" },
};

export const SIZE_CHART: Record<FitType, Record<SizeLabel, SizeMeasurement>> = {
  Slim:     SLIM,
  Tailored: TAILORED,
  Classic:  CLASSIC,
};

export const FIT_DESCRIPTIONS: Record<FitType, string> = {
  Slim:     "Close to the body — a sharp, contemporary silhouette. Best for lean to average builds.",
  Tailored: "Our signature fit — structured through the chest with a clean waist suppression.",
  Classic:  "A relaxed, comfortable cut with ample room through the chest and waist.",
};
