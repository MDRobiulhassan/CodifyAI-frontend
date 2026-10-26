import { useEffect, useState } from 'react';

const PROMPTS = [
  'Build a project management dashboard...',
  'Create a storefront for handmade products...',
  'Design a booking app for a local restaurant...',
];

export function useTypewriterPlaceholder(): string {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    let promptIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const prompt = PROMPTS[promptIndex];
      if (deleting) {
        characterIndex = Math.max(0, characterIndex - 1);
        setPlaceholder(prompt.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          promptIndex = (promptIndex + 1) % PROMPTS.length;
          timer = window.setTimeout(tick, 320);
        } else {
          timer = window.setTimeout(tick, 24);
        }
        return;
      }

      characterIndex = Math.min(prompt.length, characterIndex + 1);
      setPlaceholder(prompt.slice(0, characterIndex));
      if (characterIndex === prompt.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1500);
      } else {
        timer = window.setTimeout(tick, 62);
      }
    };

    timer = window.setTimeout(tick, 450);
    return () => window.clearTimeout(timer);
  }, []);

  return placeholder;
}
