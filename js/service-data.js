const staticServices = {
    // --- MAIN CATEGORIES ---
    'incorporation': {
        name: 'Business Incorporation Services',
        description: 'Comprehensive setup and registration services for all types of business entities globally. We guide you through the optimal structure for your business goals.',
        acts: 'Jurisdictional Business Laws',
        sub_services: [
            { name: 'Entity Selection', description: 'Choosing between Company, LLP, Firm, etc.' },
            { name: 'Legal Documentation', description: 'Drafting Charter documents and agreements.' }
        ]
    },
    'compliance': {
        name: 'Compliance & Registrations',
        description: 'Stay ahead of regulatory requirements with our automated and expert-led compliance management services for statutory and tax laws.',
        acts: 'Income Tax, GST, Companies Act, FEMA',
        sub_services: [
            { name: 'Statutory Filings', description: 'Timely submission of annual and periodic returns.' },
            { name: 'Regulatory Advisory', description: 'Interpreting changes in law for your business.' }
        ]
    },
    'audit': {
        name: 'Audit & Assurance',
        description: 'High-quality auditing services that provide transparency, build stakeholder trust, and identify operational risks.',
        acts: 'Standards on Auditing (SA)',
        sub_services: [
            { name: 'Statutory Audit', description: 'Verification of financial statements.' },
            { name: 'Tax Audit', description: 'Compliance with tax-specific audit requirements.' }
        ]
    },

    // --- INDIA SPECIFIC ---
    'company-inc': {
        name: 'Company Incorporation',
        description: 'End-to-end setup for Private Limited, Public Limited, and One Person Companies (OPC). Our service includes name approval, digital signatures, MOA/AOA drafting, and obtaining the Certificate of Incorporation.',
        acts: 'Companies Act, 2013',
        sub_services: [
            { name: 'Private Limited Company', description: 'Ideal for startups and growing businesses.' },
            { name: 'One Person Company (OPC)', description: 'Perfect for solo entrepreneurs.' },
            { name: 'Section 8 Company', description: 'For non-profit organizations.' }
        ]
    },
    'partnership-inc': {
        name: 'Partnership Firm Registration',
        description: 'Registration of partnership firms under the Indian Partnership Act. We handle deed drafting and registration with the Registrar of Firms.',
        acts: 'Indian Partnership Act, 1932',
        sub_services: [
            { name: 'Deed Drafting', description: 'Creating robust partnership agreements.' },
            { name: 'RoF Registration', description: 'Formal registration for legal standing.' }
        ]
    },
    'llp-act': {
        name: 'LLP Act Compliance',
        description: 'Comprehensive compliance management for Limited Liability Partnerships, including annual filings (Form 11 & Form 8) and statutory maintenance.',
        acts: 'Limited Liability Partnership Act, 2008',
        sub_services: [
            { name: 'Annual Return', description: 'Filing of Form 11.' },
            { name: 'Statement of Accounts', description: 'Filing of Form 8.' }
        ]
    },
    'notice-143-1': {
        name: 'Notice under Section 143(1)',
        description: 'Preliminary adjustment notice from the Income Tax Department. We help you verify mismatches between your return and the department\'s records and file rectified responses.',
        acts: 'Income Tax Act, 1961',
        sub_services: [
            { name: 'Mismatch Analysis', description: 'Identifying data discrepancies.' },
            { name: 'Rectification Filing', description: 'Addressing errors via the e-filing portal.' }
        ]
    },
    'scrutiny-notices': {
        name: 'Scrutiny Notices',
        description: 'Deep-dive assessments by tax authorities. Our experts manage the entire submission process, ensuring all documentation is presented accurately and professionally.',
        acts: 'Income Tax Act, 1961',
        sub_services: [
            { name: 'Documentation Support', description: 'Preparing detailed records for the AO.' },
            { name: 'Representation', description: 'Handling communication with tax officers.' }
        ]
    },
    'gst-scn': {
        name: 'GST Show Cause Notice (SCN)',
        description: 'Legal summons issued for alleged violations. We review allegations, identify legal grounds for defense, and draft robust legal replies.',
        acts: 'GST Act, 2017',
        sub_services: [
            { name: 'Allegation Review', description: 'Analyzing the basis of the notice.' },
            { name: 'Reply Drafting', description: 'Formulating legal defenses.' }
        ]
    },
    'project-report': {
        name: 'Project Report Preparation',
        description: 'Detailed financial projections and business plans for bank loans, investor pitches, and internal strategy.',
        acts: 'Banking Norms, MSME Guidelines',
        sub_services: [
            { name: 'Financial Projections', description: 'P&L, Balance Sheet, and Cash Flow 5-year forecasts.' },
            { name: 'Feasibility Analysis', description: 'Market and technical feasibility studies.' }
        ]
    },
    'trust-ngo': {
        name: 'Trust & NGO Compliance',
        description: 'End-to-end management for non-profits, including Trust Deed drafting, Society registration, and 12A/80G tax exemptions.',
        acts: 'Indian Trusts Act, Societies Registration Act',
        sub_services: [
            { name: 'Trust Registration', description: 'Formation of public and private trusts.' },
            { name: '12A & 80G', description: 'Tax exemption certificates for donors.' }
        ]
    },

    // --- UAE SPECIFIC ---
    'uae-accounting': {
        name: 'UAE Accounting & Bookkeeping',
        description: 'Maintaining financial records in accordance with IFRS standards for businesses operating in the UAE mainland and free zones.',
        acts: 'UAE Federal Law, IFRS',
        sub_services: [
            { name: 'Record Maintenance', description: 'Systematic recording of all financial transactions.' },
            { name: 'IFRS Compliance', description: 'Ensuring financial statements meet international standards.' }
        ]
    },
    'uae-vat': {
        name: 'UAE VAT Services',
        description: 'Complete VAT management including registration, impact assessment, return filing, and FTA audit support.',
        acts: 'UAE Federal Decree-Law on VAT',
        sub_services: [
            { name: 'VAT Return Filing', description: 'Quarterly or monthly submission to FTA.' },
            { name: 'VAT Audit Support', description: 'Representing clients during FTA inspections.' }
        ]
    },
    'uae-setup': {
        name: 'UAE Business Setup',
        description: 'Guidance on company formation in UAE Mainland, Free Zones, and Offshore jurisdictions.',
        acts: 'UAE Commercial Companies Law',
        sub_services: [
            { name: 'Mainland Setup', description: 'Direct access to UAE market.' },
            { name: 'Free Zone Setup', description: '100% foreign ownership and tax benefits.' }
        ]
    },

    // --- USA SPECIFIC ---
    'usa-formation': {
        name: 'USA Business Formation',
        description: 'Strategic setup for LLCs, C-Corps, and S-Corps across all 50 states, with specialized focus on Delaware and Wyoming for global founders.',
        acts: 'State Business Laws, IRS Guidelines',
        sub_services: [
            { name: 'LLC Formation', description: 'Asset protection and pass-through taxation.' },
            { name: 'EIN Application', description: 'Obtaining your Federal Tax ID.' }
        ]
    },
    'usa-tax': {
        name: 'USA Taxation & Planning',
        description: 'Preparation and filing of forms 1120, 1120-S, 1065, and state franchise tax returns for international and domestic entities.',
        acts: 'Internal Revenue Code (IRC)',
        sub_services: [
            { name: 'Federal Return', description: 'Standard annual tax filing.' },
            { name: 'State Franchise Tax', description: 'Annual state-level compliance.' }
        ]
    },
    'boi-reporting': {
        name: 'BOI Reporting (FinCEN)',
        description: 'Compliance with the Corporate Transparency Act (CTA) through Beneficial Ownership Information reporting to FinCEN.',
        acts: 'Corporate Transparency Act (CTA)',
        sub_services: [
            { name: 'Initial Filing', description: 'Submitting beneficial owner details.' },
            { name: 'Reporting Updates', description: 'Managing changes in ownership structure.' }
        ]
    },
    'trademark-filing': {
        name: 'Trademark Filing & Brand Protection',
        description: 'Protecting your brand identity through registration with IP authorities in India (CGPDTM), USA (USPTO), and UAE (Ministry of Economy).',
        acts: 'Trademark Act, 1999 (India), Lanham Act (USA)',
        sub_services: [
            { name: 'Search & Filing', description: 'Availability check and application submission.' },
            { name: 'Objection Support', description: 'Responding to office actions and objections.' }
        ]
    }
};

// Common/Generic descriptions for other items
const getGenericService = (name) => ({
    name: name,
    description: `Expert ${name} solutions tailored for your business needs. We provide end-to-end support for ${name}, ensuring full compliance with the latest regulations and professional standards. Our team of specialists handles the documentation, filing, and representation required for seamless execution.`,
    acts: 'Local Jurisdiction Laws',
    sub_services: [
        { name: 'Consultation', description: 'Strategic advice on implementation.' },
        { name: 'Execution', description: 'Managed filing and documentation.' },
        { name: 'Monitoring', description: 'Ongoing compliance and updates.' }
    ]
});
