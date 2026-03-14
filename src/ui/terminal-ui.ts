import chalk from "chalk";
import cfonts from "cfonts";
import ora from "ora";

const sanitize = (message: string): string =>
  // eslint-disable-next-line no-control-regex
  message.replace(/\x1b\[[0-9;]*m/g, "");

interface TableOptions {
  headers: string[];
  rows: string[][];
  columnStyles?: Array<(s: string) => string>;
}

interface SummaryItem {
  type: "success" | "warning" | "error" | "info";
  count: number;
  label: string;
}

const colorMap = {
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
};

const iconMap = {
  success: "✔",
  warning: "⚠",
  error: "✖",
  info: "ℹ",
};

export const ui = {
  banner: (): void => {
    cfonts.say("🥪SANDWICH", {
      font: "block", // define the font face
      align: "left", // define text alignment
      colors: ["system"], // define all colors
      background: "transparent", // define the background color, you can also use `backgroundColor` here as key
      space: true,
    });
  },

  title: (message: string): void => {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  },

  text: (text: string, { breakline = false } = {}): void => {
    console.log(`${breakline ? "\n" : ""}${text}${breakline ? "\n" : ""}`);
  },

  info: (message: string): void => {
    console.log(chalk.blue("ℹ"), sanitize(message));
  },

  success: (message: string): void => {
    console.log(chalk.green("✔"), sanitize(message));
  },

  warning: (message: string): void => {
    console.log(chalk.yellow("⚠"), sanitize(message));
  },

  error: (message: string): void => {
    console.error(chalk.red("✖"), sanitize(message));
  },

  spinner: (text: string) => ora({ text: sanitize(text), color: "cyan" }),

  table: ({ headers, rows, columnStyles }: TableOptions): void => {
    const widths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length)),
    );

    const pad = (s: string, w: number) => s.padEnd(w);
    const sep = widths.map((w) => "─".repeat(w + 2)).join("┼");

    console.log("┌" + widths.map((w) => "─".repeat(w + 2)).join("┬") + "┐");
    console.log(
      "│ " +
        headers.map((h, i) => chalk.bold(pad(h, widths[i]))).join(" │ ") +
        " │",
    );
    console.log("├" + sep + "┤");

    for (const row of rows) {
      console.log(
        "│ " +
          row
            .map((cell, i) => {
              const styled = columnStyles?.[i]
                ? columnStyles[i](pad(cell ?? "", widths[i]))
                : pad(cell ?? "", widths[i]);
              return styled;
            })
            .join(" │ ") +
          " │",
      );
    }

    console.log("└" + widths.map((w) => "─".repeat(w + 2)).join("┴") + "┘");
  },

  summary: ({
    title,
    items,
  }: {
    title: string;
    items: SummaryItem[];
  }): void => {
    console.log();
    console.log(chalk.bold(title));
    for (const item of items) {
      if (item.count === 0) continue;
      const color = colorMap[item.type];
      const icon = iconMap[item.type];
      console.log(
        `  ${color(icon)} ${color(String(item.count))} ${item.label}`,
      );
    }
    console.log();
  },
};
