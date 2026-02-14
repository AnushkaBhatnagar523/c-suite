const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'csuite.db');
const db = new sqlite3.Database(dbPath);

const services = [
    {
        service_name: 'Audit & Assurance',
        slug: 'audit',
        description: 'Auditing is not just a statutory requirement but a tool for improving business processes and ensuring financial transparency. Our assurance services provide stakeholders with the confidence they need in your financial reporting.',
        applicable_acts: 'Companies Act, 2013; Income Tax Act, 1961 (Tax Audit); Standards on Auditing (SA) issued by ICAI',
        sub_services: JSON.stringify([
            { name: 'Statutory Audit', description: 'Mandatory audit for companies as per Companies Act.' },
            { name: 'Tax Audit', description: 'Audit under Section 44AB of the Income Tax Act.' },
            { name: 'GST Audit', description: 'Audit and reconciliation under GST laws.' },
            { name: 'Internal Audit', description: 'Review of internal processes and controls.' },
            { name: 'Concurrent Audit', description: 'On-going audit mostly for banking institutions.' },
            { name: 'Management Audit', description: 'Review for operational efficiency and due diligence.' }
        ]),
        meta_title: 'Audit & Assurance Services | C-Suite',
        meta_description: 'Professional Audit and Assurance services for businesses. Statutory, Tax, and Internal audits.'
    },
    {
        service_name: 'Compliance & Registrations',
        slug: 'compliance',
        description: 'Maintaining a "compliant" status is critical for any entity to avoid heavy penalties and strikes from the Registrar. We handle all recurring and one-time registration requirements for your business.',
        applicable_acts: 'Companies Act, 2013; LLP Act, 2008; Societies Registration Act, 1860; Indian Trusts Act, 1882; FEMA, 1999',
        sub_services: JSON.stringify([
            { name: 'Annual MCA Filings', description: 'Hassle-free filing of AOC-4, MGT-7, and Form 8/11 for LLPs.' },
            { name: 'Society & Trust Setup', description: 'End-to-end registration under the Societies Registration Act or Trust Act.' },
            { name: 'NGO Compliance', description: '80G/12A registration, CSR-1 filing, and NGO Darpan registration.' },
            { name: 'Event-Based Filings', description: 'Documentation for change in directors, trustees, or registered office.' },
            { name: 'Amendments & Renewals', description: 'Handling periodic license renewals and constitution amendments.' }
        ]),
        meta_title: 'Compliance & Registrations | C-Suite',
        meta_description: 'Corporate compliance and mandatory registrations for businesses in India. MCA, ROC, and statutory filings.'
    },
    {
        service_name: 'Income Tax Services',
        slug: 'income-tax',
        description: 'Navigating the complex landscape of direct taxation in India requires both technical expertise and strategic foresight. Our Income Tax practice focuses on ensuring total compliance while identifying legal avenues to optimize your tax position.',
        applicable_acts: 'Income Tax Act, 1961; Income Tax Rules, 1962; Black Money Act, 2015; Finance Acts',
        sub_services: JSON.stringify([
            { name: 'Income Tax Return filing', description: 'Precision-driven ITR filing for all assessment years.' },
            { name: 'Tax planning & advisory', description: 'Legally minimizing tax liabilities through smart investments and exemptions.' },
            { name: 'Notices & assessments', description: 'Drafting technical responses and resolving scrutiny cases.' },
            { name: 'Appeals & representations', description: 'Expert representation before CIT(A) and higher judicial authorities.' },
            { name: 'International Taxation', description: 'DTAA advisory and NRI tax compliance support.' }
        ]),
        meta_title: 'Income Tax Services | C-Suite',
        meta_description: 'Expert Income Tax services in India under the Income Tax Act, 1961. Strategic tax planning and compliance.'
    },
    {
        service_name: 'GST Services',
        slug: 'gst',
        description: 'Goods and Services Tax (GST) has transformed the indirect tax landscape in India. While it simplifies the tax structure, the compliance burden remains high. Our GST desk provides accurate, technology-driven solutions.',
        applicable_acts: 'CGST Act, 2017; SGST Acts, 2017; IGST Act, 2017; Compensation Act, 2017',
        sub_services: JSON.stringify([
            { name: 'GST Registration', description: 'New registrations, amendments, and revocations for all business types.' },
            { name: 'Monthly Compliance', description: 'Accurate filing of GSTR-1, GSTR-3B, and CMP-08.' },
            { name: 'Annual Reconciliation', description: 'Comprehensive filing of GSTR-9 and 9C with detailed audit trails.' },
            { name: 'ITC Maximization', description: 'Regular reconciliation with GSTR-2A/2B to prevent credit leakage.' },
            { name: 'Department Liaison', description: 'Representation for GST audits, investigation responses, and refund claims.' }
        ]),
        meta_title: 'GST Services | C-Suite',
        meta_description: 'Comprehensive GST services in India. Registration, return filing, and compliance advisory.'
    },
    {
        service_name: 'Labour Law Compliance',
        slug: 'labour-law',
        description: 'Ensuring the welfare of your workforce is not just a moral obligation but a legal one. Our Labour Law experts help you navigate the complex landscape of employee benefits and statutory contributions.',
        applicable_acts: 'EPF Act, 1952; ESI Act, 1948; Factories Act, 1948; Payment of Gratuity Act, 1972; LWF Acts',
        sub_services: JSON.stringify([
            { name: 'PF & ESI Compliance', description: 'Registration and monthly filings for EPF and ESI.' },
            { name: 'Labour Welfare Fund', description: 'Compliance with state-specific LWF regulations.' },
            { name: 'Payroll Processing', description: 'Accurate payroll with statutory deductions (TDS, PF, ESI).' },
            { name: 'Statutory Registers', description: 'Maintenance of mandatory registers and inspection support.' },
            { name: 'Gratuity Management', description: 'Calculation and advice on gratuity payments.' },
            { name: 'Shop & Establishment', description: 'Registration and renewal of Shop & Establishment license (Gumasta).' }
        ]),
        meta_title: 'Labour Law Compliance | C-Suite',
        meta_description: 'Expert Labour Law compliance services in India. PF, ESI, and statutory welfare compliance for employers.'
    }
];

db.serialize(() => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO services (service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    services.forEach(s => {
        stmt.run(s.service_name, s.slug, s.description, s.applicable_acts, s.sub_services, s.meta_title, s.meta_description);
    });

    stmt.finalize();
    console.log('Successfully migrated services to database.');
});

db.close();
