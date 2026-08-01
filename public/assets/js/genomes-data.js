/* Single source of truth for the genome datasets table.
   One object per species; `asm` lists that species' assemblies (primary first).
   Accessions verified via the NCBI Datasets API for Tunicata (taxid 7712).
   Consumed by genomes.js, which renders one collapsible row per species. */

window.TUNICATE_GENOMES = {
  // Date this dataset was last refreshed from NCBI/TUNOME (YYYY-MM-DD).
  // Bump this whenever you update the data — it is shown on the page as a
  // staleness cue and reminder to re-run the update (see UPDATING.md).
  updated: "2026-08-01",

  // Optional subtitle shown next to each order's group header (scientific only).
  orderSubtitles: {},

  species: [
    // ===================== ASCIDIACEA · PHLEBOBRANCHIA =====================
    { sp: "Ciona intestinalis", family: "Cionidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "KH", acc: "GCA_000224145.2", size: "115 Mb", year: 2013, ref: "Community reference", refseq: "GCF_000224145.3", note: "Classic Kyoto “KH” assembly, chromosome-level. Biologically Type A (= C. robusta). Basis of the KH/KY gene models. RefSeq GCF_000224145.3." },
      { n: "ASM1832782v2", acc: "GCA_018327825.2", size: "140 Mb", year: 2025, ref: "NCBI reference", refseq: "GCF_018327825.1", note: "Genuine Type B (Roscoff). Nanopore + Hi-C, chromosome-level. RefSeq GCF_018327825.1. Hap2 GCA_018327805.2." },
      { n: "v1.0", acc: "GCA_000183065.1", size: "117 Mb", year: 2002, note: "Original DOE JGI draft (Dehal et al. 2002) — the first invertebrate-chordate genome." },
      { n: "ASM5357238v1", acc: "GCA_053572385.1", size: "136 Mb", year: 2025, note: "Additional Kyoto scaffold assembly." },
      { n: "kaCioInte3_p1.1", acc: "GCA_055049045.1", size: "164 Mb", year: 2026, note: "Canadian genome platform. Alt haplotype GCA_055048995.1." },
      { n: "HT (Ghost / KY21)", resource: { url: "http://ghost.zool.kyoto-u.ac.jp/download_ht.html", label: "GHOST" }, size: "123 Mb", year: 2019, gm: true, gmUrl: "http://ghost.zool.kyoto-u.ac.jp/download_ht.html", gmLabel: "GHOST", note: "Type A = C. robusta. Ghost HT assembly + KY21 gene models — the community Type-A gene-model reference. No separate GCA under C. robusta." },
    ]},
    { sp: "Ciona savignyi", family: "Cionidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM5413134v1", acc: "GCA_054131345.1", size: "201 Mb", year: 2025, ref: "Reference", note: "New chromosome-level assembly (Chinese Academy of Sciences)." },
      { n: "ASM14926v1", acc: "GCA_000149265.1", size: "587 Mb", year: 2004, note: "Classic Broad Institute reference; highly heterozygous, hence the large size." },
      { n: "Csav_2025", acc: "GCA_978045305.1", size: "201 Mb", year: 2026, note: "Scaffold version." },
      { n: "ENS81", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, size: "177 Mb", year: null, gm: true, note: "Ensembl v81 gene models (via ANISEED) — the gene-model reference." },
    ]},
    { sp: "Phallusia mammillata", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPhaMamm4.hap1.1", acc: "GCA_965637545.1", size: "240 Mb", year: 2025, ref: "Reference", refseq: "GCF_965637545.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_965637545.1." },
      { n: "kaPhaMamm4.hap2.1", acc: "GCA_965637525.1", size: "240 Mb", year: 2025, note: "Alternate haplotype." },
      { n: "Phmamm_MTP2014", acc: "GCA_003260075.1", size: "234 Mb", year: 2018, gm: true, note: "CNRS MTP2014 assembly — carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Phallusia fumigata", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPhaFumi1.1", acc: "GCA_964656945.1", size: "190 Mb", year: 2025, ref: "Reference", note: "Genoscope, chromosome-level." },
      { n: "Phfumi_MTP2014", acc: "GCA_008931825.1", size: "232 Mb", year: 2019, gm: true, note: "CNRS MTP2014 assembly — carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Phallusia philippinensis", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM5575519v1", acc: "GCA_055755195.1", size: "150 Mb", year: 2026, note: "Keio University, contig-level." },
    ]},
    { sp: "Ascidia mentula", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscMent1.1", acc: "GCA_947561715.1", size: "197 Mb", year: 2022, ref: "Reference", gm: true, refseq: "GCF_947561715.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_947561715.1. Alt haplotype GCA_947561685.1." },
    ]},
    { sp: "Ascidiella aspersa", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscAspe10.2", acc: "GCA_963924565.2", size: "308 Mb", year: 2026, ref: "Reference", gm: true, refseq: "GCF_963924565.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_963924565.1. Alt haplotype GCA_963924595.2." },
    ]},
    { sp: "Ascidiella scabra", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAscScab1.hap1.1", acc: "GCA_966096145.1", size: "318 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_966096775.1." },
    ]},
    { sp: "Corella eumyota", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaCorEumy4.1", acc: "GCA_963082875.1", size: "129 Mb", year: 2023, ref: "Reference", gm: true, refseq: "GCF_963082875.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_963082875.1. Alt haplotype GCA_963082865.1." },
    ]},
    { sp: "Corella parallelogramma", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaCorPara1.hap1.1", acc: "GCA_981110275.1", size: "133 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_981110325.1." },
    ]},
    { sp: "Perophora annectens", family: "Perophoridae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPerAnne1_p1.1", acc: "GCA_048173355.1", size: "478 Mb", year: 2025, gm: true, note: "Canadian genome platform, contig-level. Alt haplotype GCA_048173345.1." },
    ]},
    { sp: "Diazona violacea", family: "Diazonidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDiaViol1.hap1.1", acc: "GCA_980750685.1", size: "153 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_980751085.1. (Diazonidae; sometimes placed in Aplousobranchia.)" },
    ]},

    // ===================== ASCIDIACEA · STOLIDOBRANCHIA =====================
    { sp: "Styela clava", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaStyClav1.hap1.2", acc: "GCA_964204865.2", size: "377 Mb", year: 2025, ref: "Reference", refseq: "GCF_964204865.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_964204865.1. Hap2 GCA_964204955.2." },
      { n: "ASM1312258v2", acc: "GCA_013122585.2", size: "341 Mb", year: 2021, gm: true, refseq: "GCF_013122585.1", note: "Ocean Univ. China assembly (RefSeq GCF_013122585.1) — carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Styela plicata", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Splicata_v2", acc: "GCA_963675895.2", size: "419 Mb", year: 2024, gm: true, note: "Univ. de Barcelona, chromosome-level." },
    ]},
    { sp: "Halocynthia roretzi", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Harore_MTP2014", acc: "GCA_013436055.1", size: "120 Mb", year: 2020, gm: true, note: "CNRS MTP2014, scaffold-level. Classic developmental model (sea pineapple). Carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Halocynthia aurantium", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Haaura_MTP2014", acc: "GCA_013436065.1", size: "128 Mb", year: 2020, gm: true, note: "CNRS MTP2014, scaffold-level (sea peach). Carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Halocynthia papillosa", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaHalPapi5.1", acc: "GCA_965234635.1", size: "152 Mb", year: 2025, gm: true, note: "Genoscope, chromosome-level (red sea squirt)." },
    ]},
    { sp: "Boltenia villosa", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "ASM3147184v1", acc: "GCA_031471845.1", size: "334 Mb", year: 2023, gm: true, note: "Iridian Genomes, scaffold-level (spiny/hairy sea squirt)." },
    ]},
    { sp: "Pyura microcosmus", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPyuMicr1.1", acc: "GCA_984895145.1", size: "760 Mb", year: 2026, note: "Genoscope, chromosome-level. Alt haplotype GCA_984901695.1." },
    ]},
    { sp: "Microcosmus claudicans", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaMicClau1.1", acc: "GCA_982557775.1", size: "394 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Microcosmus squamiger", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaMicSqua1.1", acc: "GCA_977109195.1", size: "189 Mb", year: 2025, note: "NBIS Sweden, chromosome-level." },
    ]},
    { sp: "Microcosmus polymorphus", family: "Pyuridae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981691995.1", size: "321 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
    ]},
    { sp: "Botryllus schlosseri", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Bs_hap1", acc: "GCA_051294905.1", size: "496 Mb", year: 2025, ref: "Reference", refseq: "GCF_051294905.1", note: "CNRS/Sorbonne, chromosome-level. Golden star tunicate — regeneration/allorecognition model. RefSeq GCF_051294905.1. Hap2 GCA_051294915.1." },
      { n: "356a-chromosome-assembly", acc: "GCA_000444245.1", size: "580 Mb", year: 2013, gm: true, note: "Original Stanford assembly (the classic colonial-model reference). Carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Botrylloides diegensis", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaBotDieg4.1", acc: "GCA_982130965.1", size: "203 Mb", year: 2026, note: "Genoscope, chromosome-level (chain tunicate)." },
    ]},
    { sp: "Botrylloides violaceus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981691465.1", size: "129 Mb", year: 2026, ref: "Reference", note: "Univ. of Bari, chromosome-level." },
      { n: "ASM3041233v1", acc: "GCA_030412335.1", size: "121 Mb", year: 2023, gm: true, note: "Cal Poly assembly — carries the TUNOME gene model." },
    ]},
    { sp: "Botrylloides israeliense", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaBotIsra2.hap2", acc: "GCA_979627895.1", size: "370 Mb", year: 2026, note: "Leibniz-IZW, chromosome-level." },
      { n: "kaBotIsra2.hap1", acc: "GCA_979628125.1", size: "377 Mb", year: 2026, note: "Haplotype 1." },
    ]},
    { sp: "Polycarpa mamillaris", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolMami1.hap2.1", acc: "GCA_965278745.1", size: "690 Mb", year: 2025, gm: true, note: "Sanger ToL." },
      { n: "kaPolMami1.hap1.1", acc: "GCA_965278815.1", size: "697 Mb", year: 2025, note: "Haplotype 1." },
    ]},
    { sp: "Polycarpa errans", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolErra1.1", acc: "GCA_984930155.1", size: "912 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Asterocarpa humilis", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAstHumi1.hap1.1", acc: "GCA_965654205.1", size: "313 Mb", year: 2025, note: "Sanger ToL. Compass sea squirt. Hap2 GCA_965654265.1." },
    ]},
    { sp: "Symplegma brakenhielmi", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "—", acc: "GCA_981692185.1", size: "562 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
    ]},
    { sp: "Distomus variolosus", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDisVari1.1", acc: "GCA_984577845.1", size: "839 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
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
      { n: "kaAplTurb1.1", acc: "GCA_918807975.1", size: "606 Mb", year: 2021, ref: "Reference", gm: true, refseq: "GCF_918807975.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_918807975.1. Alt haplotype GCA_918843895.1." },
    ]},
    { sp: "Aplidium pallidum", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAplPall1.1", acc: "GCA_974891035.1", size: "808 Mb", year: 2025, note: "Sanger ToL. Alt haplotype GCA_965669705.1." },
    ]},
    { sp: "Aplidium elegans", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaAplEleg1.1", acc: "GCA_978019705.1", size: "560 Mb", year: 2026, note: "Genoscope, chromosome-level (sea strawberry)." },
    ]},
    { sp: "Polyclinum aurantium", family: "Polyclinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaPolAura3.1", acc: "GCA_986268195.1", size: "257 Mb", year: 2026, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Clavelina lepadiformis", family: "Clavelinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaClaLepa1.1", acc: "GCA_947623445.1", size: "210 Mb", year: 2022, ref: "Reference", refseq: "GCF_947623445.1", note: "Sanger ToL, chromosome-level. Light-bulb sea squirt. RefSeq GCF_947623445.1. Alt haplotype GCA_947623165.1." },
      { n: "Cllepa_BANY2021", acc: "GCA_961645235.1", size: "234 Mb", year: 2024, gm: true, note: "CNRS contig assembly (with GCA_963966165.1 — likely two cryptic species). Carries the ANISEED/TUNOME gene model." },
    ]},
    { sp: "Pycnoclavella producta", family: "Clavelinidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaClaProd1.hap1.1", acc: "GCA_966112915.1", size: "531 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_966096445.1." },
    ]},
    { sp: "Didemnum vexillum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDidVexi2", acc: "GCA_965643705.1", size: "829 Mb", year: 2025, note: "Genoscope, chromosome-level. Carpet sea squirt — notorious invasive species." },
    ]},
    { sp: "Didemnum molle", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDidMoll1.1", acc: "GCA_977014785.1", size: "879 Mb", year: 2025, note: "Sanger ToL, contig-level. Green urn sea squirt. Alt haplotype GCA_977014865.1." },
    ]},
    { sp: "Diplosoma listerianum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipList1.hap1.1", acc: "GCA_965643625.1", size: "289 Mb", year: 2025, note: "Sanger ToL. Hap2 GCA_965643605.1." },
    ]},
    { sp: "Diplosoma virens", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipVire1.1", acc: "GCA_963680785.1", size: "936 Mb", year: 2023, gm: true, note: "Sanger ToL. Alt haplotype GCA_963680775.1." },
    ]},
    { sp: "Diplosoma spongiforme", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDipSpon1.hap1.1", acc: "GCA_982093745.1", size: "435 Mb", year: 2026, note: "Sanger ToL. Hap2 GCA_982093785.1." },
    ]},
    { sp: "Trididemnum clinides", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriClin1.2", acc: "GCA_963675345.2", size: "887 Mb", year: 2026, gm: true, note: "Sanger ToL. Alt haplotype GCA_963675475.2." },
    ]},
    { sp: "Trididemnum nubilum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriNubi1.1", acc: "GCA_963965965.1", size: "1.05 Gb", year: 2024, gm: true, note: "Sanger ToL — the largest tunicate assembly here. Alt haplotype GCA_963965985.1." },
    ]},
    { sp: "Trididemnum miniatum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaTriMini1.1", acc: "GCA_964006365.1", size: "625 Mb", year: 2024, gm: true, note: "Sanger ToL. Alt haplotype GCA_964006535.1." },
    ]},
    { sp: "Lissoclinum perforatum", family: "Didemnidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaLisPerf1.1", acc: "GCA_977071135.1", size: "383 Mb", year: 2025, note: "Genoscope, chromosome-level." },
    ]},
    { sp: "Distaplia bermudensis", family: "Holozoidae", order: "Aplousobranchia", cls: "Ascidiacea", asm: [
      { n: "kaDisBerm", acc: "GCA_981692175.1", size: "446 Mb", year: 2026, note: "Univ. of Bari, chromosome-level." },
    ]},

    // ===================== APPENDICULARIA · COPELATA =====================
    { sp: "Oikopleura dioica", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "OKI2018_I68_1.0", acc: "GCA_907165135.1", size: "64 Mb", year: 2021, ref: "Reference", gm: true, refseq: "GCF_907165135.1", note: "Okinawa population, telomere-to-telomere (OIST). One of the smallest animal genomes. RefSeq GCF_907165135.1." },
      { n: "ASM20953v1", acc: "GCA_000209535.1", size: "70 Mb", year: 2010, note: "Original Genoscope draft (Denoeud et al. 2010), Bergen strain." },
    ]},
    { sp: "Oikopleura vanhoeffeni", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436785v1", acc: "GCA_004367855.1", size: "644 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Oikopleura albicans", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436787v1", acc: "GCA_004367875.1", size: "366 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Oikopleura longicauda", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436789v1", acc: "GCA_004367895.1", size: "309 Mb", year: 2019, gm: true, note: "Univ. of Bergen, contig-level." },
    ]},
    { sp: "Mesochordaeus erythrocephalus", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436797v1", acc: "GCA_004367975.1", size: "874 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level." },
    ]},
    { sp: "Bathochordaeus stygius", family: "Oikopleuridae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436795v1", acc: "GCA_004367955.1", size: "397 Mb", year: 2019, gm: true, note: "Univ. of Bergen, scaffold-level. Deep-sea giant larvacean." },
    ]},
    { sp: "Fritillaria borealis", family: "Fritillariidae", order: "Copelata", cls: "Appendicularia", asm: [
      { n: "ASM436807v1", acc: "GCA_004368075.1", size: "143 Mb", year: 2019, note: "Univ. of Bergen. Only non-Oikopleuridae appendicularian genome." },
    ]},

    // ===================== THALIACEA · SALPIDA =====================
    { sp: "Salpa thompsoni", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "tSalTho2.1", acc: "GCA_047495815.1", size: "743 Mb", year: 2025, ref: "Reference", gm: true, note: "Univ. of Connecticut, contig-level. Antarctic salp." },
      { n: "Salp genome 1.0", acc: "GCA_001749815.1", size: "319 Mb", year: 2016, note: "Earlier draft." },
    ]},
    { sp: "Salpa aspera", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "tSalAsp1.1", acc: "GCA_047324265.1", size: "903 Mb", year: 2025, gm: true, note: "Univ. of Connecticut, scaffold-level." },
    ]},
    { sp: "Thalia democratica", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "ktThaDemo2.hap1.1", acc: "GCA_965202585.1", size: "802 Mb", year: 2025, ref: "Reference", gm: true, refseq: "GCF_965202585.1", note: "Sanger ToL, chromosome-level. RefSeq GCF_965202585.1. Hap2 GCA_965202575.1." },
    ]},
    { sp: "Pegea sp. RAD2-039", family: "Salpidae", order: "Salpida", cls: "Thaliacea", asm: [
      { n: "ASM3462036v1", acc: "GCA_034620365.1", size: "106 Mb", year: 2023, gm: true, note: "Bigelow Laboratory, contig-level, single-cell-derived; species unresolved." },
    ]},

    // ===== Species with a gene model but NO NCBI assembly (from TUNOME / ANISEED) =====
    { sp: "Corella inflata", family: "Corellidae", order: "Phlebobranchia", cls: "Ascidiacea", asm: [
      { n: "Core_infl", resource: { url: "http://ryanlab.whitney.ufl.edu/genomes/Core_infl/", label: "Ryan Lab" }, size: "121 Mb", year: 2020, gm: true, note: "No NCBI GCA. Genome + gene models hosted by the Ryan Lab (also in ANISEED/TUNOME)." },
    ]},
    { sp: "Botrylloides leachii", family: "Styelidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "Bleachii draft", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, size: "159 Mb", year: 2018, gm: true, note: "Draft genome (Blanchoud et al. 2018); no NCBI GCA. Regeneration model. Genome + gene models via ANISEED/TUNOME." },
    ]},
    { sp: "Molgula oculata", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOcul2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, size: "154 Mb", year: 2014, gm: true, note: "No NCBI GCA. Tail-forming species; genome + gene models via ANISEED/TUNOME." },
    ]},
    { sp: "Molgula occulta", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOccu2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, size: "175 Mb", year: 2014, gm: true, note: "No NCBI GCA. Tailless species (classic tail-loss evo-devo pair with M. oculata); genome + gene models via ANISEED/TUNOME." },
    ]},
    { sp: "Molgula occidentalis", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea", asm: [
      { n: "MolOcci2014", resource: { url: "https://www.aniseed.fr/", label: "ANISEED" }, size: "250 Mb", year: 2014, gm: true, note: "No NCBI GCA. Genome + gene models via ANISEED/TUNOME." },
    ]},
  ],
};
