"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const path_1 = require("path");
const readDirSync = require("recursive-readdir-sync");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Flattering file structure...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const newDocs = core_1.getInput('temp_docs_folder');
        const filenames = this.generateNewStructData(newDocs);
        const flippedFilenames = this.flipKeysWithValues(filenames);
        for (const newFilename in filenames) {
            const oldFilename = filenames[newFilename];
            if (oldFilename !== newFilename) {
                this.renameFile(newDocs, oldFilename, newFilename);
            }
            this.fixesToNewStyleLinks(newDocs.concat('/', newFilename), flippedFilenames);
        }
    }
    /**
     * Generate filenames data for new files structure
     *
     * @param string cwd Docs path
     */
    generateNewStructData(cwd) {
        const newStructData = {};
        const files = this.getAllFilesInfo(cwd);
        for (const fileInfo of this.filterFileInfoByShortPath(files, false)) {
            newStructData[fileInfo.filename] = fileInfo.filename;
        }
        for (const fileInfo of this.filterFileInfoByShortPath(files, true)) {
            const oldFilePath = fileInfo.shortPath.concat('/', fileInfo.filename);
            if (typeof newStructData[fileInfo.filename] != 'undefined') {
                newStructData[fileInfo.filename] = oldFilePath;
            }
            else {
                newStructData[this.generateAltFilename(fileInfo)] = oldFilePath;
            }
        }
        return newStructData;
    }
    /**
     * Fixes links to new style
     *
     * @param string filename Filename where to fix links
     * @param object filenames Filenames data to fix
     */
    fixesToNewStyleLinks(filename, filenames) {
        core_1.debug(` Fixing ${filename}...`);
        const content = fs_1.readFileSync(filename).toString();
        const newContent = content.replace(/\[([^\]]+)]\(([^\)]+)\)/gm, (fullMsg, link, name) => '['.concat(filenames[link]
            .split('.')
            .slice(0, -1)
            .join('.'), '](', name, ')'));
        if (newContent !== content) {
            core_1.debug('  Changed.');
            fs_1.writeFileSync(filename, newContent);
        }
    }
    /**
     * Flip keys with values for object
     *
     * @param object obj Object to flip
     */
    flipKeysWithValues(obj) {
        const ret = {};
        for (const x in obj) {
            ret[obj[x]] = x;
        }
        return ret;
    }
    /**
     * Gets all files info in path
     *
     * @param string cwd Path where to get files info
     */
    getAllFilesInfo(cwd) {
        return readDirSync(cwd).map((file) => {
            const shortFilename = path_1.basename(file);
            const pathWithoutFilename = path_1.dirname(file);
            const pathPrefix = pathWithoutFilename.substr(cwd.length);
            return {
                filename: shortFilename,
                shortPath: pathPrefix
            };
        });
    }
    /**
     * Renames file
     *
     * @param string newDocs New docs
     * @param string oldFilename Old filename
     * @param string newFilename New filename
     */
    renameFile(newDocs, oldFilename, newFilename) {
        core_1.debug(` Renaming ${oldFilename} -> ${newFilename}...`);
        fs_1.renameSync(newDocs.concat('/', oldFilename), newDocs.concat('/', newFilename));
    }
    /**
     * Filters file infos by short path
     *
     * @param object[] files Files to filter
     * @param boolean withShortPath Should have anything in short path
     */
    filterFileInfoByShortPath(files, withShortPath) {
        return files.filter((fileInfo) => {
            return withShortPath
                ? fileInfo.shortPath !== ''
                : fileInfo.shortPath === '';
        });
    }
    /**
     * Generates alternative filename
     *
     * @param object fileInfo Fileinfo from where to generate new filename
     */
    generateAltFilename(fileInfo) {
        const filenameWithoutExt = fileInfo.filename
            .split('.')
            .slice(0, -1)
            .join('.');
        const ext = path_1.extname(fileInfo.filename);
        return '"'.concat(filenameWithoutExt, ' (', fileInfo.shortPath.replace('/', '\\'), ')', ext, '"');
    }
}
exports.default = default_1;
