/**
 * MDX Library - Centralized exports for MDX components and utilities
 * 
 * This barrel file provides convenient single-import access to all
 * MDX-related factories, types, and utilities used throughout the application.
 */

// Core factories
export { createNumberedContent } from './factories';
export { createContentRef } from './refFactory';

// Utility functions
export {
    formatDisplayNumber,
    extractIdNumber,
    createContextWrapper
} from './utils';

// TypeScript types
export type {
    NumberedContentProps,
    ContentRefProps,
    ContentConfig,
    RefConfig
} from './types';
