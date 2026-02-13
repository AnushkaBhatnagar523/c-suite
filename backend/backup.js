const fs = require('fs');
const path = require('path');

// Configuration
const DB_PATH = path.join(__dirname, 'database', 'csuite.db');
const BACKUP_DIR = path.join(__dirname, 'backups');
const MAX_BACKUPS = 7; // Keep last 7 backups

// Create backups directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('✓ Created backups directory');
}

// Generate backup filename with timestamp
function getBackupFilename() {
    const now = new Date();
    const timestamp = now.toISOString()
        .replace(/:/g, '-')
        .replace(/\..+/, '')
        .replace('T', '_');
    return `csuite_backup_${timestamp}.db`;
}

// Perform backup
function backupDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            console.error('❌ Database file not found:', DB_PATH);
            return false;
        }

        const backupPath = path.join(BACKUP_DIR, getBackupFilename());
        fs.copyFileSync(DB_PATH, backupPath);

        const stats = fs.statSync(backupPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        console.log(`✓ Backup created: ${path.basename(backupPath)}`);
        console.log(`  Size: ${sizeMB} MB`);
        console.log(`  Path: ${backupPath}`);

        // Clean up old backups
        cleanupOldBackups();

        return true;
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        return false;
    }
}

// Remove old backups, keeping only MAX_BACKUPS most recent
function cleanupOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('csuite_backup_') && file.endsWith('.db'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Sort by newest first

        if (files.length > MAX_BACKUPS) {
            const toDelete = files.slice(MAX_BACKUPS);
            toDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`  Removed old backup: ${file.name}`);
            });
        }

        console.log(`  Total backups: ${Math.min(files.length, MAX_BACKUPS)}`);
    } catch (error) {
        console.error('Warning: Could not cleanup old backups:', error.message);
    }
}

// List all backups
function listBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('csuite_backup_') && file.endsWith('.db'))
            .map(file => {
                const filePath = path.join(BACKUP_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
                    created: stats.mtime.toLocaleString()
                };
            })
            .sort((a, b) => b.created.localeCompare(a.created));

        if (files.length === 0) {
            console.log('No backups found');
            return;
        }

        console.log('\n📦 Available Backups:\n');
        files.forEach((file, index) => {
            console.log(`${index + 1}. ${file.name}`);
            console.log(`   Size: ${file.size}`);
            console.log(`   Created: ${file.created}\n`);
        });
    } catch (error) {
        console.error('Error listing backups:', error.message);
    }
}

// Restore from backup
function restoreBackup(backupFilename) {
    try {
        const backupPath = path.join(BACKUP_DIR, backupFilename);

        if (!fs.existsSync(backupPath)) {
            console.error('❌ Backup file not found:', backupFilename);
            return false;
        }

        // Create a backup of current database before restoring
        const currentBackup = path.join(BACKUP_DIR, `before_restore_${Date.now()}.db`);
        if (fs.existsSync(DB_PATH)) {
            fs.copyFileSync(DB_PATH, currentBackup);
            console.log(`✓ Current database backed up to: ${path.basename(currentBackup)}`);
        }

        // Restore the backup
        fs.copyFileSync(backupPath, DB_PATH);
        console.log(`✓ Database restored from: ${backupFilename}`);

        return true;
    } catch (error) {
        console.error('❌ Restore failed:', error.message);
        return false;
    }
}

// CLI interface
const command = process.argv[2];

switch (command) {
    case 'backup':
        console.log('\n🔄 Starting database backup...\n');
        backupDatabase();
        break;

    case 'list':
        listBackups();
        break;

    case 'restore':
        const filename = process.argv[3];
        if (!filename) {
            console.error('❌ Please provide backup filename');
            console.log('Usage: node backup.js restore <backup_filename>');
            process.exit(1);
        }
        console.log('\n🔄 Restoring database...\n');
        restoreBackup(filename);
        break;

    default:
        console.log(`
📦 C-Suite Database Backup Utility

Usage:
  node backup.js backup          Create a new backup
  node backup.js list             List all backups
  node backup.js restore <file>   Restore from backup

Examples:
  node backup.js backup
  node backup.js list
  node backup.js restore csuite_backup_2026-02-08_20-30-00.db

Configuration:
  Database: ${DB_PATH}
  Backups:  ${BACKUP_DIR}
  Max backups kept: ${MAX_BACKUPS}
        `);
}

module.exports = { backupDatabase, listBackups, restoreBackup };
