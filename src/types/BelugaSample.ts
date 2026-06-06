/**
 * Type definition for a beluga DNA sample
 */
export interface BelugaSample {
  /** Unique identifier for the sample */
  id: string;
  
  /** Genetic markers for the sample */
  geneticMarkers: string[];
  
  /** Date when the sample was collected */
  collectionDate: Date;
  
  /** Geographic coordinates where the sample was collected */
  location: {
    latitude: number;
    longitude: number;
  };
  
  /** Age of the beluga at time of sampling */
  age?: number;
  
  /** Sex of the beluga */
  sex: 'male' | 'female';
  
  /** Unique identifier for the mother (if known) */
  motherId?: string;
  
  /** Unique identifier for the father (if known) */
  fatherId?: string;
}

/**
 * Type definition for mating pattern analysis results
 */
export interface MatingPatternResult {
  /** The beluga sample being analyzed */
  sample: BelugaSample;
  
  /** List of potential mates with compatibility scores */
  potentialMates: {
    /** Reference to the potential mate's sample */
    mate: BelugaSample;
    
    /** Compatibility score (0-1) indicating mating likelihood */
    compatibilityScore: number;
    
    /** Genetic distance from the sample */
    geneticDistance: number;
  }[];
  
  /** Indicates if inbreeding is detected */
  isInbred: boolean;
  
  /** Confidence level of the mating pattern analysis */
  confidenceLevel: number;
}