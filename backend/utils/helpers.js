const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

const sanitizeHtml = (html) => {
    // Basic sanitization logic if external libs fail to install
    // In a real app, use sanitize-html or dompurify
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
};

module.exports = { slugify, sanitizeHtml };
