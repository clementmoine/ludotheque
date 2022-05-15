import { getFileExtension, removeUploadedFile } from './file';

import fs from 'fs';

jest.mock('fs');

describe('getFileExtension', () => {
  it('should return the file extension', () => {
    const result = getFileExtension('test.txt');
    expect(result).toEqual('txt');
  });

  it('should return an empty string when the file has no extension', () => {
    const result = getFileExtension('test');
    expect(result).toEqual('');
  });

  it('should return an empty string when the file has no extension and has a dot', () => {
    const result = getFileExtension('test.');
    expect(result).toEqual('');
  });

  it('should return the last extension when the file has multiple dots', () => {
    const result = getFileExtension('test.txt.jpg');
    expect(result).toEqual('jpg');
  });
});

describe('removeUploadedFile', () => {
  it('should remove the file an existing file', () => {
    (fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockImplementation(() => true);

    // Call the function
    removeUploadedFile('test.txt');

    // Assertions
    expect(fs.existsSync).toHaveBeenCalledWith(`${process.cwd()}/public/uploads/test.txt`);
    expect(fs.unlinkSync).toHaveBeenCalledWith(`${process.cwd()}/public/uploads/test.txt`);
  });

  it('should not remove the file an non existing file', () => {
    (fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockImplementation(() => false);

    // Call the function
    removeUploadedFile('test-not-existing.txt');

    // Assertions
    expect(fs.existsSync).toHaveBeenCalledWith(`${process.cwd()}/public/uploads/test-not-existing.txt`);
    expect(fs.unlinkSync).not.toHaveBeenCalledWith(`${process.cwd()}/public/uploads/test.txt`);
  });
});
