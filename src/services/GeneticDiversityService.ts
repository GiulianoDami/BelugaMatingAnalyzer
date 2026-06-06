export class GeneticDiversityService {
  /**
   * Calculates the heterozygosity rate for a given set of genotypes
   * @param genotypes - Array of genotype pairs (e.g., [['A', 'B'], ['A', 'A'], ['B', 'C']])
   * @returns Heterozygosity rate as a decimal between 0 and 1
   */
  calculateHeterozygosity(genotypes: [string, string][]): number {
    if (genotypes.length === 0) return 0;
    
    let heterozygousCount = 0;
    
    for (const genotype of genotypes) {
      if (genotype[0] !== genotype[1]) {
        heterozygousCount++;
      }
    }
    
    return heterozygousCount / genotypes.length;
  }

  /**
   * Calculates the observed genetic diversity (number of unique alleles)
   * @param genotypes - Array of genotype pairs
   * @returns Number of unique alleles
   */
  calculateObservedAlleles(genotypes: [string, string][]): number {
    const alleles = new Set<string>();
    
    for (const genotype of genotypes) {
      alleles.add(genotype[0]);
      alleles.add(genotype[1]);
    }
    
    return alleles.size;
  }

  /**
   * Calculates the expected genetic diversity under Hardy-Weinberg equilibrium
   * @param genotypeFrequencies - Object mapping genotype to frequency
   * @returns Expected heterozygosity
   */
  calculateExpectedHeterozygosity(genotypeFrequencies: Record<string, number>): number {
    // For simplicity, assuming diploid organisms with two alleles per locus
    // This is a simplified version - real implementation would need more complex calculations
    const alleleFrequencies = this.calculateAlleleFrequencies(genotypeFrequencies);
    
    let expectedHeterozygosity = 0;
    const alleles = Object.keys(alleleFrequencies);
    
    for (let i = 0; i < alleles.length; i++) {
      for (let j = i + 1; j < alleles.length; j++) {
        expectedHeterozygosity += 2 * alleleFrequencies[alleles[i]] * alleleFrequencies[alleles[j]];
      }
    }
    
    return expectedHeterozygosity;
  }

  /**
   * Calculates allele frequencies from genotype frequencies
   * @param genotypeFrequencies - Object mapping genotype to frequency
   * @returns Object mapping allele to frequency
   */
  private calculateAlleleFrequencies(genotypeFrequencies: Record<string, number>): Record<string, number> {
    const alleleCounts: Record<string, number> = {};
    const totalGenotypes = Object.values(genotypeFrequencies).reduce((sum, freq) => sum + freq, 0);
    
    for (const [genotype, frequency] of Object.entries(genotypeFrequencies)) {
      const [allele1, allele2] = genotype.split('/');
      alleleCounts[allele1] = (alleleCounts[allele1] || 0) + (frequency / totalGenotypes);
      alleleCounts[allele2] = (alleleCounts[allele2] || 0) + (frequency / totalGenotypes);
    }
    
    return alleleCounts;
  }

  /**
   * Calculates inbreeding coefficient (Fis) using Nei's method
   * @param observedHeterozygosity - Observed heterozygosity rate
   * @param expectedHeterozygosity - Expected heterozygosity rate
   * @returns Inbreeding coefficient
   */
  calculateInbreedingCoefficient(
    observedHeterozygosity: number,
    expectedHeterozygosity: number
  ): number {
    if (expectedHeterozygosity === 0) return 0;
    
    return 1 - (observedHeterozygosity / expectedHeterozygosity);
  }
}