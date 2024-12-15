export type ChangeType = 'feature' | 'improvement' | 'bugfix' | 'other';

export interface Change {
  type: ChangeType;
  description: string;
}

export interface Version {
  version: string;
  date: string;
  changes: Change[];
}

export const commitChanges: Version[] = [];
