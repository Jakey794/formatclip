export type FormatRequest = {
  text: string;
  instruction: string;
};

export type FormatResponse = {
  formatted_text: string;
  detected_type: string;
  changes_made: string[];
};

export type FormatError = {
  message: string;
};
