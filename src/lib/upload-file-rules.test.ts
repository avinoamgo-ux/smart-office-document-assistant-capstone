import { describe, expect, it } from 'vitest';
import {
  formatFileSize,
  MAX_UPLOAD_BYTES,
  TOO_LARGE_MESSAGE_HE,
  UNSUPPORTED_TYPE_MESSAGE_HE,
  validateUploadSelection,
  type UploadSelection,
} from './upload-file-rules';

const PDF_MIME = 'application/pdf';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function selection(overrides: Partial<UploadSelection> = {}): UploadSelection {
  return { name: 'invoice-4471.pdf', type: PDF_MIME, size: 2048, ...overrides };
}

describe('validateUploadSelection — F1 client-side rules', () => {
  it('accepts the three types named in the sources', () => {
    for (const type of [PDF_MIME, DOCX_MIME, 'text/plain']) {
      expect(validateUploadSelection(selection({ type }))).toEqual({ ok: true });
    }
  });

  it('rejects an unsupported type with the message shown on screen', () => {
    const result = validateUploadSelection(selection({ name: 'scan.png', type: 'image/png' }));

    expect(result).toEqual({
      ok: false,
      reason: 'unsupported_type',
      message: UNSUPPORTED_TYPE_MESSAGE_HE,
    });
  });

  it('rejects an empty or unknown reported type rather than guessing from the name', () => {
    expect(validateUploadSelection(selection({ name: 'report.pdf', type: '' })).ok).toBe(false);
  });

  it('accepts a file exactly at the 10 MB limit and rejects one byte more', () => {
    expect(validateUploadSelection(selection({ size: MAX_UPLOAD_BYTES })).ok).toBe(true);

    expect(validateUploadSelection(selection({ size: MAX_UPLOAD_BYTES + 1 }))).toEqual({
      ok: false,
      reason: 'too_large',
      message: TOO_LARGE_MESSAGE_HE,
    });
  });

  it('reports the type problem first when a file is both unsupported and oversized', () => {
    const result = validateUploadSelection(
      selection({ type: 'application/zip', size: MAX_UPLOAD_BYTES + 1 }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('unsupported_type');
  });
});

describe('formatFileSize', () => {
  it('shows bytes, KB and MB', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(MAX_UPLOAD_BYTES)).toBe('10.0 MB');
  });

  it('does not invent a size it was not given', () => {
    expect(formatFileSize(Number.NaN)).toBe('—');
    expect(formatFileSize(-1)).toBe('—');
  });
});
