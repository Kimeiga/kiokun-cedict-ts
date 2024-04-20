import { useWritable } from './use-shared-store';

export const useDarkMode = () => useWritable('dark', true);
export const isSimplifiedMode = () => useWritable('isSimplifiedMode', true);
