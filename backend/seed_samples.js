const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'csuite.db');
const db = new sqlite3.Database(dbPath);

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

db.serialize(() => {
    // Insert Blogs
    const blogStmt = db.prepare(`INSERT OR REPLACE INTO blogs (title, slug, content, category, author, status) VALUES (?, ?, ?, ?, ?, ?)`);
    sampleBlogs.forEach(b => {
        blogStmt.run(b.title, b.slug, b.content, b.category, b.author, b.status);
    });
    blogStmt.finalize();

    // Insert Circulars
    const circStmt = db.prepare(`INSERT OR REPLACE INTO circulars (title, authority, reference_no, summary, pdf_url, issued_date) VALUES (?, ?, ?, ?, ?, ?)`);
    sampleCirculars.forEach(c => {
        circStmt.run(c.title, c.authority, c.reference_no, c.summary, c.pdf_url, c.issued_date);
    });
    circStmt.finalize();

    console.log('✅ Sample Blogs and Circulars successfully created in SQLite database.');
});

db.close();
