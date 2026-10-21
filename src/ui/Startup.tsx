import React, { useEffect, useState } from 'react';
import { render, Box, Text } from 'ink';
import gradient from 'gradient-string';
import { getActiveTheme } from '../config/themes';
import { getLogoText } from './banner';

/**
 * Renders a brief animated boot sequence using Ink (React for CLIs)
 * before handing control back to the classic readline-based REPL.
 * Ink is intentionally scoped to this one-shot splash screen — the
 * interactive shell itself uses readline so we get proper scrollback,
 * history and terminal-native line editing.
 */

const BOOT_STEPS = [
  'Initializing Jaiki CLI...',
  'Loading configuration...',
  'Detecting environment...',
  'Loading plugins...',
  'Ready.',
];

interface StartupAnimationProps {
  onComplete: () => void;
  stepDelayMs?: number;
  customAscii?: string;
}

const StartupAnimation: React.FC<StartupAnimationProps> = ({
  onComplete,
  stepDelayMs = 120,
  customAscii,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const theme = getActiveTheme();

  useEffect(() => {
    if (stepIndex >= BOOT_STEPS.length) {
      const timeout = setTimeout(onComplete, 150);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setStepIndex((i) => i + 1), stepDelayMs);
    return () => clearTimeout(timeout);
  }, [stepIndex]);

  return (
    <Box flexDirection="column">
      <Text>{gradient([theme.primary, theme.accent]).multiline(getLogoText(customAscii))}</Text>
      {BOOT_STEPS.slice(0, stepIndex).map((step, i) => (
        <Text key={i} color={theme.success}>
          {'✔ '}
          {step}
        </Text>
      ))}
    </Box>
  );
};

/**
 * Plays the animation and resolves once it finishes. Falls back to an
 * instant no-op if stdout is not a TTY (e.g. piped output, CI logs).
 */
export function playStartupAnimation(customAscii?: string): Promise<void> {
  return new Promise((resolve) => {
    if (!process.stdout.isTTY) {
      resolve();
      return;
    }

    const { unmount } = render(
      <StartupAnimation
        customAscii={customAscii}
        onComplete={() => {
          unmount();
          resolve();
        }}
      />,
      { patchConsole: false }
    );
  });
}
