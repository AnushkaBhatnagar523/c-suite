const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./database/db');

const sampleBlogs = [
    {
        title: "Understanding GST Scrutiny Notices",
        slug: "understanding-gst-scrutiny-notices",
        content: "### What is a GST Scrutiny Notice?\n\nA GST scrutiny notice (ASMT-10) is issued when there are discrepancies between your GSTR-1, GSTR-3B, and GSTR-2A data. Our guide explains how to respond effectively to satisfy department queries and avoid heavy penalties.",
        category: "GST Compliance",
        author: "CA Vaibhav Sharma",
        status: "published"
    },
    {
        title: "Navigating Income Tax for Startups",
        slug: "income-tax-startups-india",
        content: "### Benefits for DIPP Recognized Startups\n\nStartups in India can enjoy 100% tax holidays for 3 consecutive years. Learn about Section 80-IAC and the conditions for claiming these tax benefits in the upcoming assessment year.",
        category: "Tax Planning",
        author: "C-Suite Advisory Team",
        status: "published"
    },
    {
        title: "Annual Compliance Checklist 2026",
        slug: "compliance-checklist-2026",
        content: "### Stay Ahead of the Deadlines\n\nFrom MCA AOC-4 filings to quarterly TDS returns, the compliance landscape for 2026 is evolving. This checklist covers the key dates every business owner must mark on their calendar.",
        category: "Corporate Compliance",
        author: "Compliance Desk",
        status: "published"
    }
];

const sampleCirculars = [
    {
        title: "CBDT Notification: Extension of ITR Deadlines",
        authority: "CBDT",
        reference_no: "Notif. No. 12/2026",
        summary: "The Central Board of Direct Taxes has extended the deadline for filing Income Tax Returns for corporates by 30 days.",
        pdf_url: "#",
        issued_date: "Feb 10, 2026"
    },
    {
        title: "GST Council: New Rates on Tech Services",
        authority: "GST Council",
        reference_no: "Circular 56/2026",
        summary: "Key updates from the 54th GST Council meeting regarding the export of software services and input tax credit eligibility.",
        pdf_url: "#",
        issued_date: "Feb 08, 2026"
    },
    {
        title: "ROC Update: New Beneficial Ownership Rules",
        authority: "MCA",
        reference_no: "MCA-DIR-2026",
        summary: "Mandatory disclosure of Significant Beneficial Ownership (SBO) in the new Form BEN-2 to enhance corporate transparency.",
        pdf_url: "#",
        issued_date: "Feb 05, 2026"
    }
];

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

async function seed() {
    console.log('🌱 Seeding PostgreSQL database...');

    // Seed Blogs
    for (const b of sampleBlogs) {
        await new Promise((resolve) => {
            db.run('INSERT INTO blogs (title, slug, content, category, author, status) VALUES (?, ?, ?, ?, ?, ?)',
                [b.title, b.slug, b.content, b.category, b.author, b.status], resolve);
        });
    }
    console.log('✅ Blogs seeded');

    // Seed Circulars
    for (const c of sampleCirculars) {
        await new Promise((resolve) => {
            db.run('INSERT INTO circulars (title, authority, reference_no, summary, pdf_url, issued_date) VALUES (?, ?, ?, ?, ?, ?)',
                [c.title, c.authority, c.reference_no, c.summary, c.pdf_url, c.issued_date], resolve);
        });
    }
    console.log('✅ Circulars seeded');

    // Seed Services
    for (const s of services) {
        await new Promise((resolve) => {
            db.run('INSERT INTO services (service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [s.service_name, s.slug, s.description, s.applicable_acts, s.sub_services, s.meta_title, s.meta_description], resolve);
        });
    }
    console.log('✅ Services seeded');

    console.log('🌟 Seeding complete!');
    process.exit(0);
}

setTimeout(seed, 2000);
