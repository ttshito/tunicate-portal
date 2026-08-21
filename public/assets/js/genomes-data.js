/* Single source of truth for the genome datasets table.
   One object per species; `asm` lists that species' assemblies (primary first).
   Accessions verified via the NCBI Datasets API for Tunicata (taxid 7712).
   Consumed by genomes.js, which renders one collapsible row per species. */

window.TUNICATE_GENOMES = {
  // Date this dataset was last refreshed from NCBI/TUNOME (YYYY-MM-DD).
  // Bump this whenever you update the data — it is shown on the page as a
  // staleness cue and reminder to re-run the update (see UPDATING.md).
  updated: "2026-08-21",

  // Optional subtitle shown next to each order's group header (scientific only).
  orderSubtitles: {},

  species: [
    // ===================== ASCIDIACEA · PHLEBOBRANCHIA =====================
    { sp: "Ciona intestinalis", family: "Cionidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "KH", acc: "GCA_000224145.2", level: "Chromosome", chrPct: 67.9, size: "115 Mb", year: 2013, ref: "Community reference", refseq: "GCF_000224145.3", aniseed: true, note: "Classic Kyoto “KH” assembly: NCBI lists it as chromosome-level, but only 67.9% (78 Mb) sits on the 14 chromosomes — the other 37 Mb is in 1,257 unplaced scaffolds (Satou et al. 2019). Biologically Type A (= C. robusta). Basis of the KH2012 gene models (the KY21 models are on the GHOST HT assembly). RefSeq GCF_000224145.3 (Annotation Release 104, 2018) — NCBI has since retired it (“suppressed: superseded by newer assembly for species”, the species reference moved to the Type-B GCF_018327825.1); the record and its files are still served. ANISEED serves the KH2012 gene models (KH “Joined Scaffold”) under C. robusta." },
      { n: "ASM1832782v2", acc: "GCA_018327825.2", level: "Chromosome", chrPct: 95.8, size: "140 Mb", year: 2025, ref: "NCBI reference", refseq: "GCF_018327825.1", note: "Genuine Type B (Roscoff). Nanopore + Hi-C, chromosome-level. RefSeq GCF_018327825.1. Hap2 GCA_018327805.2." },
      { n: "v1.0", acc: "GCA_000183065.1", level: "Scaffold", size: "117 Mb", year: 2002, note: "Original DOE JGI draft (Dehal et al. 2002) — the first invertebrate-chordate genome." },
      { n: "ASM5357238v1", acc: "GCA_053572385.1", level: "Scaffold", size: "136 Mb", year: 2025, note: "Additional Kyoto scaffold assembly." },
      { n: "kaCioInte3_p1.1", acc: "GCA_055049045.1", level: "Scaffold", size: "164 Mb", year: 2026, note: "Canadian genome platform. Alt haplotype GCA_055048995.1." },
      { n: "HT (Ghost / KY21)", acc: "GCA_009617815.2", level: "Chromosome", chrPct: 95.6, size: "123 Mb", year: 2019, gm: true, gmUrl: "http://ghost.zool.kyoto-u.ac.jp/download_ht.html", gmLabel: "GHOST", note: "Type A = C. robusta. Ghost HT assembly (Satou et al. 2019, Kyoto, PacBio/MECAT, inbred Type-A line) + KY21 gene models — the community Type-A gene-model reference. On GenBank as ASM961781v2 GCA_009617815.2; the gene models are only at GHOST." },
      { n: "ASM5357250v1", acc: "GCA_053572505.1", level: "Scaffold", size: "34 Mb", year: 2025, note: "Kyoto Nanopore/Illumina deposit; NCBI flags it as “genome length too small” (34 Mb vs the ~120 Mb genome) — partial, not a whole-genome reference." },
    ]},
    { sp: "Ciona savignyi", family: "Cionidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM5413134v1", acc: "GCA_054131345.1", level: "Chromosome", chrPct: 96, size: "201 Mb", year: 2025, ref: "Reference", note: "New chromosome-level assembly (Chinese Academy of Sciences)." },
      { n: "ASM14926v1", acc: "GCA_000149265.1", level: "Scaffold", size: "587 Mb", year: 2004, note: "Classic Broad Institute reference; highly heterozygous, hence the large size." },
      { n: "Csav_2025", acc: "GCA_978045305.1", level: "Scaffold", size: "201 Mb", year: 2026, note: "Scaffold version." },
      { n: "ENS81", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, level: "Scaffold", size: "177 Mb", year: null, gm: true, aniseed: true, note: "Ensembl v81 gene models (via ANISEED) — the gene-model reference. Built on the Broad CSAV2.0 assembly (haploid reference haplotype of GCA_000149265.1)." },
    ]},
    { sp: "Phallusia mammillata", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPhaMamm4.hap1.1", acc: "GCA_965637545.1", level: "Chromosome", chrPct: 97.3, size: "240 Mb", year: 2025, ref: "Reference", refseq: "GCF_965637545.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_965637545.1." },
      { n: "kaPhaMamm4.hap2.1", acc: "GCA_965637525.1", level: "Scaffold", size: "240 Mb", year: 2025, note: "Alternate haplotype." },
      { n: "Phmamm_MTP2014", acc: "GCA_003260075.1", level: "Scaffold", size: "234 Mb", year: 2018, gm: true, aniseed: true, note: "CNRS MTP2014 assembly — carries the ANISEED/TUNOME gene model (ANISEED: Phmamm MTP2014, 2018 release)." },
    ]},
    { sp: "Phallusia fumigata", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPhaFumi1.1", acc: "GCA_964656945.1", level: "Chromosome", chrPct: 99.7, size: "190 Mb", year: 2025, ref: "Reference", note: "Genoscope, chromosome-level." },
      { n: "Phfumi_MTP2014", acc: "GCA_008931825.1", level: "Scaffold", size: "232 Mb", year: 2019, gm: true, aniseed: true, note: "CNRS MTP2014 assembly — carries the ANISEED/TUNOME gene model (ANISEED: Phfumi MTP2014 transcripts, 2018 genome release)." },
    ]},
    { sp: "Phallusia philippinensis", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM5575519v1", acc: "GCA_055755195.1", level: "Contig", size: "150 Mb", year: 2026, note: "Keio University, contig-level." },
    ]},
    { sp: "Ascidia mentula", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscMent1.1", acc: "GCA_947561715.1", level: "Chromosome", chrPct: 97.6, size: "197 Mb", year: 2022, ref: "Reference", gm: true, refseq: "GCF_947561715.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_947561715.1. Alt haplotype GCA_947561685.1." },
    ]},
    { sp: "Ascidiella aspersa", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscAspe10.2", acc: "GCA_963924565.2", level: "Chromosome", chrPct: 99.7, size: "308 Mb", year: 2026, ref: "Reference", gm: true, refseq: "GCF_963924565.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_963924565.1. Alt haplotype GCA_963924595.2." },
    ]},
    { sp: "Ascidiella scabra", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscScab1.hap1.1", acc: "GCA_966096145.1", level: "Chromosome", chrPct: 96, size: "318 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_966096775.1." },
    ]},
    // ----- Assembled but not public yet (status:"progress", state:"assembled").
    //       Soka University (M. Nydam) WGS panel, reported 2026. See §5b of UPDATING.md.
    { sp: "Ascidia sydneiensis samea", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026,
        level: "Draft assembly \u2014 level not reported",
        gm: "Not deposited (the study searched its own draft genome database)",
        contact: "Tatsuya Ueki", institution: "Hiroshima University", country: "Japan",
        url: "https://seeds.office.hiroshima-u.ac.jp/profile/en.b550fd2969ab6aab520e17560c007669.html",
        pub: [
          { label: "Adi et al. 2026, Zool. Sci. 43(3):227\u2013235", url: "https://doi.org/10.2108/zs250091" },
          { label: "BioProject PRJDB35622", url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJDB35622" },
        ],
        note: "Draft genome of the vanadium-rich ascidian, built for the vanabin gene-evolution study (Hiroshima University with OIST). The DDBJ BioProject \u2014 whole-genome assembly of three wild-type individuals \u2014 was released on 2026-08-19; no INSDC assembly accession has appeared yet, so there is nothing to download. Recheck NCBI for a GCA." } },
    { sp: "Ascidia ceratodes", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "543 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Wilmington, CA, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Ascidia virginea", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "369 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "San Diego, CA, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Ascidia zara", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "560 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Ventura, CA, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Corella eumyota", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaCorEumy4.1", acc: "GCA_963082875.1", level: "Chromosome", chrPct: 98.6, size: "129 Mb", year: 2023, ref: "Reference", gm: true, refseq: "GCF_963082875.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_963082875.1. Alt haplotype GCA_963082865.1." },
    ]},
    { sp: "Corella parallelogramma", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaCorPara1.hap1.1", acc: "GCA_981110275.1", level: "Chromosome", chrPct: 93.9, size: "133 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_981110325.1." },
    ]},
    { sp: "Perophora annectens", family: "Perophoridae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPerAnne1_p1.1", acc: "GCA_048173355.1", level: "Contig", size: "478 Mb", year: 2025, gm: true, note: "Canadian genome platform, contig-level. Alt haplotype GCA_048173345.1." },
    ]},
    { sp: "Diazona violacea", family: "Diazonidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDiaViol1.hap1.1", acc: "GCA_980750685.1", level: "Chromosome", chrPct: 99.5, size: "153 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_980751085.1. (Diazonidae; sometimes placed in Aplousobranchia.)" },
    ]},

    // ===================== ASCIDIACEA · STOLIDOBRANCHIA =====================
    { sp: "Styela clava", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaStyClav1.hap1.2", acc: "GCA_964204865.2", level: "Chromosome", chrPct: 95.8, size: "377 Mb", year: 2025, ref: "Reference", refseq: "GCF_964204865.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_964204865.1. Hap2 GCA_964204955.2." },
      { n: "ASM1312258v2", acc: "GCA_013122585.2", level: "Scaffold", size: "341 Mb", year: 2021, gm: true, refseq: "GCF_013122585.1", note: "Ocean Univ. China assembly — carries the ANISEED/TUNOME gene model. Its RefSeq GCF_013122585.1 has been retired by NCBI (“suppressed: superseded by newer assembly for species” — the species reference moved to the ToL GCF_964204865.1); the record and its files are still served." },
    ]},
    { sp: "Styela plicata", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Splicata_v2", acc: "GCA_963675895.2", level: "Chromosome", chrPct: 93.6, size: "419 Mb", year: 2024, gm: true, note: "Univ. de Barcelona, chromosome-level." },
    ]},
    { sp: "Halocynthia roretzi", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Harore_MTP2014", acc: "GCA_013436055.1", level: "Scaffold", size: "120 Mb", year: 2020, gm: true, aniseed: true, note: "CNRS MTP2014, scaffold-level. Classic developmental model (sea pineapple). Carries the ANISEED/TUNOME gene model (ANISEED: Harore MTP2014, 2018 release)." },
    ]},
    { sp: "Halocynthia aurantium", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Haaura_MTP2014", acc: "GCA_013436065.1", level: "Scaffold", size: "128 Mb", year: 2020, gm: true, aniseed: true, note: "CNRS MTP2014, scaffold-level (sea peach). Carries the ANISEED/TUNOME gene model (ANISEED: Haaura MTP2014, 2018 genome release)." },
    ]},
    { sp: "Halocynthia papillosa", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaHalPapi5.1", acc: "GCA_965234635.1", level: "Chromosome", chrPct: 88.9, size: "152 Mb", year: 2025, gm: true, note: "Genoscope, chromosome-level (red sea squirt)." },
    ]},
    { sp: "Boltenia villosa", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM3147184v1", acc: "GCA_031471845.1", level: "Scaffold", size: "334 Mb", year: 2023, gm: true, note: "Iridian Genomes, scaffold-level (spiny/hairy sea squirt)." },
    ]},
    { sp: "Pyura microcosmus", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPyuMicr1.1", acc: "GCA_984895145.1", level: "Chromosome", chrPct: 79, size: "760 Mb", year: 2026, note: "Genoscope, chromosome-level. Alt haplotype GCA_984901695.1." },
    ]},
    { sp: "Microcosmus claudicans", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaMicClau1.1", acc: "GCA_982557775.1", level: "Chromosome", chrPct: 98.6, size: "394 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Microcosmus squamiger", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaMicSqua1.1", acc: "GCA_977109195.1", level: "Chromosome", chrPct: 98.2, size: "189 Mb", year: 2025, note: "NBIS Sweden, chromosome-level." },
      { n: "Soka WGS", unpublished: true, size: "~236 Mb", year: null, note: "Assembled at Soka University (M. Nydam) but not publicly released \u2014 reported 2026 (project announced 2022); sampled at San Diego, CA, USA. No chromosome-scale assembly, no gene models deposited. Contact via the portal Discord." },
    ]},
    { sp: "Microcosmus polymorphus", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981691995.1", level: "Chromosome", chrPct: 94.8, size: "321 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
    ]},
    // ----- Assembled but not public yet (status:"progress", state:"assembled").
    //       Soka University (M. Nydam) WGS panel, reported 2026. See §5b of UPDATING.md.
    { sp: "Herdmania pallida", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "402 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Miami, FL, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Pyura haustor", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "827 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "San Juan Island, WA, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Pyura herdmani", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "426 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Port Elizabeth, South Africa",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Pyura mirabilis", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "378 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Shaw Island, WA, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Pyura praeputialis", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "362 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Botany Bay, Australia",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Pyura vittata", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "242 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Puerto Rico",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Botryllus schlosseri", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Bs_hap1", acc: "GCA_051294905.1", level: "Chromosome", chrPct: 96.8, size: "496 Mb", year: 2025, ref: "Reference", refseq: "GCF_051294905.1", note: "CNRS/Sorbonne, chromosome-level. Golden star tunicate — regeneration/allorecognition model. RefSeq GCF_051294905.1. Hap2 GCA_051294915.1." },
      { n: "kaBotSchl7_p1.1", acc: "GCA_059910395.1", level: "Contig", size: "557 Mb", year: 2026, note: "Canada's national genome sequencing platform (HiFi/hifiasm), contig-level. Alt pseudohaplotype GCA_059910365.1 (420 Mb)." },
      { n: "356a-chromosome-assembly", acc: "GCA_000444245.1", level: "Scaffold", size: "580 Mb", year: 2013, gm: true, aniseed: true, note: "Original Stanford assembly (the classic colonial-model reference). Despite the name, NCBI classifies it as scaffold-level. Carries the ANISEED/TUNOME gene model — ANISEED serves the chromosome-scale “botznik-chr” fasta of this 2013 release." },
    ]},
    { sp: "Botrylloides diegensis", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaBotDieg4.1", acc: "GCA_982130965.1", level: "Chromosome", chrPct: 81, size: "203 Mb", year: 2026, note: "Genoscope, chromosome-level (chain tunicate)." },
      { n: "Soka WGS", unpublished: true, year: null, note: "Assembled at Soka University (M. Nydam) but not publicly released \u2014 reported 2026 (project announced 2021); sampled at Port Nelson, New Zealand. No chromosome-scale assembly, no gene models deposited. Contact via the portal Discord." },
    ]},
    { sp: "Botrylloides violaceus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981691465.1", level: "Chromosome", chrPct: 91.5, size: "129 Mb", year: 2026, ref: "Reference", note: "Univ. of Bari, chromosome-level." },
      { n: "kaBotViol2_p1.1", acc: "GCA_047301215.1", level: "Contig", size: "246 Mb", year: 2025, note: "Canada's national genome sequencing platform (HiFi/hifiasm), contig-level. Alt pseudohaplotype GCA_047301245.1 (231 Mb)." },
      { n: "ASM3041233v1", acc: "GCA_030412335.1", level: "Scaffold", size: "121 Mb", year: 2023, gm: true, note: "Cal Poly assembly — carries the TUNOME gene model." },
      { n: "Soka WGS", unpublished: true, year: null, note: "Assembled at Soka University (M. Nydam) but not publicly released \u2014 reported 2026 (project announced 2021); sampled at Asamushi, Japan. No chromosome-scale assembly, no gene models deposited. Contact via the portal Discord." },
    ]},
    { sp: "Botrylloides israeliense", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaBotIsra2.hap2", acc: "GCA_979627895.1", level: "Chromosome", chrPct: 98.9, size: "370 Mb", year: 2026, note: "Leibniz-IZW, chromosome-level." },
      { n: "kaBotIsra2.hap1", acc: "GCA_979628125.1", level: "Chromosome", chrPct: 98.7, size: "377 Mb", year: 2026, note: "Haplotype 1." },
    ]},
    { sp: "Polycarpa mamillaris", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolMami1.hap2.1", acc: "GCA_965278745.1", level: "Chromosome", chrPct: 88.4, size: "690 Mb", year: 2025, gm: true, note: "Sanger ToL." },
      { n: "kaPolMami1.hap1.1", acc: "GCA_965278815.1", level: "Chromosome", chrPct: 87.9, size: "697 Mb", year: 2025, note: "Haplotype 1." },
    ]},
    { sp: "Polycarpa errans", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolErra1.1", acc: "GCA_984930155.1", level: "Chromosome", chrPct: 95.4, size: "912 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Asterocarpa humilis", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAstHumi1.hap1.1", acc: "GCA_965654205.1", level: "Chromosome", chrPct: 99.7, size: "313 Mb", year: 2025, note: "Sanger ToL. Compass sea squirt. Hap2 GCA_965654265.1." },
    ]},
    { sp: "Symplegma brakenhielmi", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981692185.1", level: "Chromosome", chrPct: 95.6, size: "562 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
      { n: "Soka WGS", unpublished: true, year: null, note: "Assembled at Soka University (M. Nydam) but not publicly released \u2014 reported 2026 (project announced 2021); sampled at Bocas del Toro, Panama. No chromosome-scale assembly, no gene models deposited. Contact via the portal Discord." },
    ]},
    { sp: "Distomus variolosus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDisVari1.1", acc: "GCA_984577845.1", level: "Chromosome", chrPct: 97.3, size: "839 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    // ----- Assembled but not public yet (status:"progress", state:"assembled").
    //       Soka University (M. Nydam) WGS panel, reported 2026. See §5b of UPDATING.md.
    { sp: "Botrylloides praelongus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2021,
        level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Shizugawa, Japan",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Botrylloides frankovichi", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2021,
        level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Barnes Key, FL, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Botryllus horridus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2021,
        level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Miura, Japan",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Botryllus gaiae", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2021,
        level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Falmouth, United Kingdom",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },

    // ----- Sequencing in progress (no genome yet). status:"progress" → red name,
    //       excluded from assembly/species counts, expands to show contact. asm: [].
    //       See §5b of UPDATING.md.
    { sp: "Polyandrocarpa zorritensis", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { year: 2026, contact: "Stefano Tiozzo", institution: "CNRS – Sorbonne University", country: "France" } },
    { sp: "Molgula appendiculata", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { year: 2026, contact: "Sébastien Darras", institution: "CNRS – Sorbonne University", country: "France" } },

    // ===================== ASCIDIACEA · APLOUSOBRANCHIA =====================
    { sp: "Aplidium turbinatum", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAplTurb1.1", acc: "GCA_918807975.1", level: "Chromosome", chrPct: 99.9, size: "606 Mb", year: 2021, ref: "Reference", gm: true, refseq: "GCF_918807975.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_918807975.1. Alt haplotype GCA_918843895.1." },
    ]},
    { sp: "Aplidium pallidum", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAplPall1.1", acc: "GCA_974891035.1", level: "Chromosome", chrPct: 99.9, size: "808 Mb", year: 2025, note: "Sanger ToL. Alt haplotype GCA_965669705.1." },
    ]},
    { sp: "Aplidium elegans", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAplEleg1.1", acc: "GCA_978019705.1", level: "Chromosome", chrPct: 96.6, size: "560 Mb", year: 2026, note: "Genoscope, chromosome-level (sea strawberry)." },
    ]},
    { sp: "Polyclinum aurantium", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolAura3.1", acc: "GCA_986268195.1", level: "Chromosome", chrPct: 99.2, size: "257 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Clavelina lepadiformis", family: "Clavelinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaClaLepa1.1", acc: "GCA_947623445.1", level: "Chromosome", chrPct: 98.6, size: "210 Mb", year: 2022, ref: "Reference", refseq: "GCF_947623445.1", note: "Sanger ToL, chromosome-level. Light-bulb sea squirt. RefSeq GCF_947623445.1. Alt haplotype GCA_947623165.1." },
      { n: "kaClaLepa18-hap1.1", acc: "GCA_982319195.1", level: "Chromosome", chrPct: 91.8, size: "194 Mb", year: 2026, note: "NBIS (Sweden), 9 chromosomes. Hap2 kaClaLepa18-hap2.1 GCA_982319175.1 (219 Mb, 84.7% anchored)." },
      { n: "Cllepa_BANY2021", acc: "GCA_961645235.1", level: "Contig", size: "234 Mb", year: 2024, gm: true, note: "CNRS contig assembly (with GCA_963966165.1 — likely two cryptic species). Carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Pycnoclavella producta", family: "Clavelinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaClaProd1.hap1.1", acc: "GCA_966112915.1", level: "Chromosome", chrPct: 99.5, size: "531 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_966096445.1." },
    ]},
    { sp: "Didemnum vexillum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDidVexi2", acc: "GCA_965643705.1", level: "Chromosome", chrPct: 99.7, size: "829 Mb", year: 2025, note: "Genoscope, chromosome-level. Carpet sea squirt — notorious invasive species." },
    ]},
    { sp: "Didemnum molle", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDidMoll1.1", acc: "GCA_977014785.1", level: "Contig", size: "879 Mb", year: 2025, note: "Sanger ToL, contig-level. Green urn sea squirt. Alt haplotype GCA_977014865.1." },
    ]},
    { sp: "Diplosoma listerianum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipList1.hap1.1", acc: "GCA_965643625.1", level: "Chromosome", chrPct: 98.8, size: "289 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_965643605.1." },
      { n: "Soka WGS", unpublished: true, size: "~1,199 Mb", year: null, note: "Assembled at Soka University (M. Nydam) but not publicly released \u2014 reported 2026 (project announced 2022); sampled at Long Beach, CA, USA. No chromosome-scale assembly, no gene models deposited. Contact via the portal Discord." },
    ]},
    { sp: "Diplosoma virens", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipVire1.1", acc: "GCA_963680785.1", level: "Chromosome", chrPct: 96.3, size: "936 Mb", year: 2023, gm: true, note: "Sanger ToL. Alt haplotype GCA_963680775.1." },
    ]},
    { sp: "Diplosoma spongiforme", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipSpon1.hap1.1", acc: "GCA_982093745.1", level: "Chromosome", chrPct: 96.5, size: "435 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_982093785.1." },
    ]},
    { sp: "Trididemnum clinides", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriClin1.2", acc: "GCA_963675345.2", level: "Chromosome", chrPct: 99.9, size: "887 Mb", year: 2026, gm: true, note: "Sanger ToL. Alt haplotype GCA_963675475.2." },
    ]},
    { sp: "Trididemnum nubilum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriNubi1.1", acc: "GCA_963965965.1", level: "Chromosome", chrPct: 95.7, size: "1.05 Gb", year: 2024, gm: true, note: "Sanger ToL — the largest tunicate assembly here. Alt haplotype GCA_963965985.1." },
    ]},
    { sp: "Trididemnum miniatum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriMini1.1", acc: "GCA_964006365.1", level: "Chromosome", chrPct: 98.5, size: "625 Mb", year: 2024, gm: true, note: "Sanger ToL. Alt haplotype GCA_964006535.1." },
    ]},
    // ----- Assembled but not public yet (status:"progress", state:"assembled").
    //       Soka University (M. Nydam) WGS panel, reported 2026. See §5b of UPDATING.md.
    { sp: "Didemnum fragile", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "1,194 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Cook's Bay, Moorea, French Polynesia",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Didemnum ligulum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "954 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Moorea, French Polynesia",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Didemnum perlucidum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "891 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "St. Petersburg, FL, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Lissoclinum verrilli", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "1,163 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Miami, FL, USA",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Trididemnum cf. savignii", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea",
      status: "progress", asm: [],
      progress: { state: "assembled", year: 2026, since: 2022,
        size: "1,729 Mb", level: "No chromosome-scale assembly", gm: "None deposited",
        site: "Off the coast of Campeche, Mexico",
        contact: "Marie Nydam", institution: "Soka University", country: "USA",
        url: "https://www.soka.edu/about/faculty-staff/marie-nydam" } },
    { sp: "Lissoclinum perforatum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaLisPerf1.1", acc: "GCA_977071135.1", level: "Chromosome", chrPct: 99.8, size: "383 Mb", year: 2025, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Distaplia bermudensis", family: "Holozoidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDisBerm", acc: "GCA_981692175.1", level: "Chromosome", chrPct: 99.6, size: "446 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
    ]},

    // ===================== APPENDICULARIA · COPELATA =====================
    { sp: "Oikopleura dioica", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "OKI2018_I68_1.0", acc: "GCA_907165135.1", level: "Chromosome", chrPct: 99, size: "64 Mb", year: 2021, ref: "Reference", gm: true, refseq: "GCF_907165135.1", note: "Okinawa population, telomere-to-telomere (OIST). One of the smallest animal genomes. RefSeq GCF_907165135.1." },
      { n: "ASM20955v1", acc: "GCA_000209555.1", level: "Scaffold", size: "45 Mb", year: 2010, note: "Second Genoscope 2010 deposit (4,196 scaffolds, N50 20 kb) — more fragmented than ASM20953v1, which carries the ANISEED OdB3 gene models." },
      { n: "ASM20953v1", acc: "GCA_000209535.1", level: "Scaffold", size: "70 Mb", year: 2010, aniseed: true, note: "Original Genoscope draft (Denoeud et al. 2010), Bergen strain. Carries the ANISEED gene model — ANISEED serves the scaffolded OdB3 fasta (S1, S2, … ~6.8/5.5 Mb) of this assembly, with a 2019 protein set. Not the OKI2018 reference." },
    ]},
    { sp: "Oikopleura vanhoeffeni", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436785v1", acc: "GCA_004367855.1", level: "Scaffold", size: "644 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Oikopleura albicans", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436787v1", acc: "GCA_004367875.1", level: "Scaffold", size: "366 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Oikopleura longicauda", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436789v1", acc: "GCA_004367895.1", level: "Contig", size: "309 Mb", year: 2019, gm: true, note: "Univ. of Bergen, contig-level." },
    ]},
    { sp: "Mesochordaeus erythrocephalus", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436797v1", acc: "GCA_004367975.1", level: "Scaffold", size: "874 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Bathochordaeus stygius", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436795v1", acc: "GCA_004367955.1", level: "Scaffold", size: "397 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level. Deep-sea giant larvacean." },
    ]},
    { sp: "Fritillaria borealis", family: "Fritillariidae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436807v1", acc: "GCA_004368075.1", level: "Scaffold", size: "143 Mb", year: 2019, note: "Univ. of Bergen. Only non-Oikopleuridae appendicularian genome." },
    ]},

    // ===================== THALIACEA · SALPIDA =====================
    { sp: "Salpa thompsoni", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "tSalTho2.1", acc: "GCA_047495815.1", level: "Contig", size: "743 Mb", year: 2025, ref: "Reference", gm: true, note: "Univ. of Connecticut, contig-level. Antarctic salp." },
      { n: "Salp genome 1.0", acc: "GCA_001749815.1", level: "Scaffold", size: "319 Mb", year: 2016, note: "Earlier draft." },
    ]},
    { sp: "Salpa aspera", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "tSalAsp1.1", acc: "GCA_047324265.1", level: "Scaffold", size: "903 Mb", year: 2025, gm: true, note: "Univ. of Connecticut, scaffold-level." },
    ]},
    { sp: "Thalia democratica", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "ktThaDemo2.hap1.1", acc: "GCA_965202585.1", level: "Chromosome", chrPct: 90.7, size: "802 Mb", year: 2025, ref: "Reference", gm: true, refseq: "GCF_965202585.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_965202585.1. Hap2 GCA_965202575.1." },
    ]},
    { sp: "Pegea sp. RAD2-039", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "ASM3462036v1", acc: "GCA_034620365.1", level: "Contig", size: "106 Mb", year: 2023, gm: true, note: "Bigelow Laboratory, contig-level, single-cell-derived; species unresolved." },
    ]},

    // ===== Species with a gene model but NO NCBI assembly (from TUNOME / ANISEED) =====
    { sp: "Corella inflata", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "Core_infl", resource: { url: "http://ryanlab.whitney.ufl.edu/genomes/Core_infl/", label: "Ryan Lab" }, level: "Scaffold", size: "121 Mb", year: 2020, gm: true, note: "No NCBI GCA. Genome + gene models hosted by the Ryan Lab (also in ANISEED/TUNOME)." },
    ]},
    { sp: "Botrylloides leachii", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Bleachii draft (SBv3)", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, level: "Scaffold", size: "159 Mb", year: 2018, gm: true, aniseed: true, note: "Draft genome (Blanchoud et al. 2018); no NCBI GCA. Regeneration model. Genome + gene models via ANISEED/TUNOME — ANISEED: SBv3 genome, v5 transcripts, v4 proteins." },
    ]},
    { sp: "Molgula oculata", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOcul2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, level: "Scaffold", size: "154 Mb", year: 2014, gm: true, aniseed: true, note: "No NCBI GCA. Tail-forming species; genome + gene models via ANISEED/TUNOME — ANISEED serves the “Mocu_genome_v12” fasta of this assembly." },
    ]},
    { sp: "Molgula occulta", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOccu2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, level: "Scaffold", size: "175 Mb", year: 2014, gm: true, note: "No NCBI GCA. Tailless species (classic tail-loss evo-devo pair with M. oculata); genome + gene models via ANISEED/TUNOME." },
    ]},
    { sp: "Molgula occidentalis", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOcci2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, level: "Scaffold", size: "250 Mb", year: 2014, gm: true, aniseed: true, note: "No NCBI GCA. Genome + gene models via ANISEED/TUNOME — ANISEED release “august 2015” of this assembly." },
    ]},
  ],
};
