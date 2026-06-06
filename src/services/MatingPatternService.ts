import { GenotypeData, MatingPattern, MateSwitchingEvent } from '../models/MatingAnalysis';

export class MatingPatternService {
  /**
   * Identifies mating patterns from genotype data
   * @param genotypeData - Array of genotype samples with parentage information
   * @returns Array of identified mating patterns
   */
  public identifyMatingPatterns(genotypeData: GenotypeData[]): MatingPattern[] {
    const patterns: MatingPattern[] = [];
    const parentPairs = new Map<string, number>();
    
    // Group offspring by parent pairs
    genotypeData.forEach(sample => {
      if (sample.father && sample.mother) {
        const pairKey = `${sample.father}-${sample.mother}`;
        parentPairs.set(pairKey, (parentPairs.get(pairKey) || 0) + 1);
      }
    });
    
    // Convert to pattern objects
    parentPairs.forEach((count, pairKey) => {
      const [father, mother] = pairKey.split('-');
      patterns.push({
        fatherId: father,
        motherId: mother,
        offspringCount: count,
        matingFrequency: count / genotypeData.length
      });
    });
    
    return patterns;
  }
  
  /**
   * Detects mate switching events in beluga whale populations
   * @param genotypeData - Array of genotype samples with temporal information
   * @returns Array of detected mate switching events
   */
  public detectMateSwitching(genotypeData: GenotypeData[]): MateSwitchingEvent[] {
    const switchingEvents: MateSwitchingEvent[] = [];
    const individualHistory = new Map<string, string[]>();
    
    // Build history of mates for each individual
    genotypeData.forEach(sample => {
      if (sample.offspringId && sample.father && sample.mother) {
        // Track father's mates
        if (!individualHistory.has(sample.father)) {
          individualHistory.set(sample.father, []);
        }
        const fatherMates = individualHistory.get(sample.father)!;
        if (!fatherMates.includes(sample.mother)) {
          fatherMates.push(sample.mother);
        }
        
        // Track mother's mates
        if (!individualHistory.has(sample.mother)) {
          individualHistory.set(sample.mother, []);
        }
        const motherMates = individualHistory.get(sample.mother)!;
        if (!motherMates.includes(sample.father)) {
          motherMates.push(sample.father);
        }
      }
    });
    
    // Identify switching events
    individualHistory.forEach((mates, individualId) => {
      if (mates.length > 1) {
        switchingEvents.push({
          individualId,
          mateCount: mates.length,
          mateList: [...mates],
          switchingEvents: this.calculateSwitchingEvents(mates)
        });
      }
    });
    
    return switchingEvents;
  }
  
  /**
   * Calculates genetic diversity metrics for mating patterns
   * @param genotypeData - Array of genotype samples
   * @returns Genetic diversity metrics
   */
  public calculateGeneticDiversity(genotypeData: GenotypeData[]): Record<string, number> {
    const diversityMetrics: Record<string, number> = {};
    const alleleFrequencies = new Map<string, Map<string, number>>();
    
    // Calculate allele frequencies
    genotypeData.forEach(sample => {
      Object.entries(sample.genotypes).forEach(([locus, alleles]) => {
        if (!alleleFrequencies.has(locus)) {
          alleleFrequencies.set(locus, new Map<string, number>());
        }
        const locusFrequencies = alleleFrequencies.get(locus)!;
        
        alleles.forEach(allele => {
          locusFrequencies.set(allele, (locusFrequencies.get(allele) || 0) + 1);
        });
      });
    });
    
    // Calculate heterozygosity
    let totalLoci = 0;
    let totalHeterozygotes = 0;
    
    genotypeData.forEach(sample => {
      Object.values(sample.genotypes).forEach(alleles => {
        totalLoci++;
        if (alleles[0] !== alleles[1]) {
          totalHeterozygotes++;
        }
      });
    });
    
    diversityMetrics.heterozygosity = totalLoci > 0 ? totalHeterozygotes / totalLoci : 0;
    
    // Calculate allelic richness
    let totalAlleles = 0;
    let uniqueAlleles = 0;
    
    alleleFrequencies.forEach(locusFrequencies => {
      totalAlleles += locusFrequencies.size;
      uniqueAlleles += Array.from(locusFrequencies.values()).filter(freq => freq === 1).length;
    });
    
    diversityMetrics.allelicRichness = totalAlleles > 0 ? uniqueAlleles / totalAlleles : 0;
    
    return diversityMetrics;
  }
  
  private calculateSwitchingEvents(mates: string[]): number {
    // Simple calculation: number of transitions between different mates
    let switches = 0;
    for (let i = 1; i < mates.length; i++) {
      if (mates[i] !== mates[i-1]) {
        switches++;
      }
    }
    return switches;
  }
}