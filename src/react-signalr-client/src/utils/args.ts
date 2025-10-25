import type { PayloadArg } from "../types";

/**
 * Build arguments array from PayloadArg array
 * @param args - Array of payload arguments
 * @returns Parsed arguments array
 * @throws Error if argument parsing fails
 */
export const buildArgs = (args: PayloadArg[]): unknown[] => {
  return args.map((arg) => {
    const value = arg.value.trim();

    switch (arg.type) {
      case "number": {
        const num = Number(value);
        if (Number.isNaN(num)) {
          throw new Error("Number arguments must be valid numeric values.");
        }
        return num;
      }
      case "json": {
        try {
          return value ? JSON.parse(value) : null;
        } catch {
          throw new Error(
            "JSON arguments must be valid JSON objects or arrays."
          );
        }
      }
      default: {
        return value;
      }
    }
  });
};
