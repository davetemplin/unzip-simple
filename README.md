# unzip-simple

A super-simple unzip API that simplifies file extraction...
```js
import unzip from 'unzip-simple';
const [file] = await unzip('single-file-example.zip');
console.log(file.buffer.toString());
```

Filter files by applying a [file globbing](https://en.wikipedia.org/wiki/Glob_(programming)) pattern...
```js
const files = await unzip({input: 'multi-file-example.zip', filter: '*.txt'});
```


# Usage Examples

### Extract all files from a ZIP archive on disc...
```js
import unzip from 'unzip-simple';
const files = await unzip('example.zip');
for (const file of files)
    console.log(file.name, file.buffer.toString());
```

### Extract all files from a downloaded ZIP archive...
```js
import unzip from 'unzip-simple';
import fetch from 'node-fetch';
const response = await fetch('https://github.com/davetemplin/unzip-simple/raw/master/test/example1.zip');
const buffer = await response.buffer();
const files = await unzip(buffer);
```

### Obtain a directory listing from a ZIP archive without performing any file extraction...
```js
import unzip from 'unzip-simple';
const files = await unzip({input: 'example.zip', extract: false});
for (const file of files)
    console.log(file.name, file.compressed, file.uncompressed);
```
```
foo.txt 208 330
bar.txt 148 213
...
```

### Extract a specific file...
```js
const files = await unzip({input: 'example.zip', filter: 'foo/bar.txt'});
```

### Extract only text files...
```js
const files = await unzip({input: 'example.zip', filter: '*.txt'});
```

### Extract all files except images...
```js
const files = await unzip({input: 'example.zip', filter: '!*.jpg'});
```


# API
The API for this library is defined by a single function that accepts a set of options and returns an array of files in the ZIP archive. Alternatively, just the path or buffer of the ZIP archive can be passed as the input.

## Function
```
unzip(options: UnzipOptions|string|Buffer|number): Promise<UnzipFile[]>
```

## UnzipOptions
The options specify the input ZIP archive file, an optional filter to target specific files, and a flag that determines whether to extract files.

option  | type                   | description
------- | ---------------------- | ---
input   | `string|Buffer|number` | Specifies the input ZIP archive file. Can be a path to a file, an in-memory buffer, or a file-descriptor.
extract | `boolean`              | Determines whether files are to be extracted from the ZIP archive. Use `true` to extract files or `false` to obtain a directory listing of the ZIP archive. *(default=true)*
filter  | `string`               | Filters files from the ZIP archive. Any valid file globbing pattern can be used. If not specified, all files are included by default.

## UnzipFile
The API returns an array of files, where each file contains the name and content for each extracted file along with the compressed and uncompressed file size.

attribute    | type     | description
------------ | -------- | ---
name         | `string` | File-name of the file within the ZIP archive.
buffer       | `Buffer` | A buffer containing the data extracted from the file in the ZIP archive. Use `buffer.toString()` to convert to text.
compressed   | `number` | Compressed size of the file (in bytes).
uncompressed | `number` | Uncompressed size of the file (in bytes).
 

This API is intended for handling light-weight data extraction that can be easily held in-memory. If dealing with very large archives is a requirement, a lower level streaming interface like the one provided in *yauzl* should be used instead.