import { describe, expect, test } from '@jest/globals';
import bundle from '../../src';
import { isExternalReference } from '../../src/util';
import fs from 'fs';
import path from 'path';

describe('[integration testing] bundler should ', () => {
  test('should return bundled doc', async () => {
    const files = ['./tests/camera.yml', './tests/audio.yml'];
    const response = await bundle(
      files.map(file =>
        fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
      ),
      {
        base: fs.readFileSync(
          path.resolve(process.cwd(), './tests/base.yml'),
          'utf-8'
        ),
        validate: false,
      }
    );

    expect(response).toBeDefined();
  });

  test('should not throw if value of `$ref` is not a string', async () => {
    const files = ['./tests/wrong-ref-not-string.yaml'];

    // If async function `bundle()` resolved Promise successfully, that means it
    // did not throw exception during process of execution, which is the
    // objective of testing.
    expect(
      await bundle(
        files.map(file =>
          fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
        ),
        {
          referenceIntoComponents: false,
        }
      )
    ).resolves;
  });

  test('should not throw if value of `$ref` is absent', async () => {
    const files = ['./tests/wrong-ref-absent.yaml'];

    // If async function `bundle()` resolved Promise successfully, that means it
    // did not throw exception during process of execution, which is the
    // objective of testing.
    expect(
      await bundle(
        files.map(file =>
          fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
        ),
        {
          referenceIntoComponents: false,
        }
      )
    ).resolves;
  });

  test('should be able to bundle base file', async () => {
    const files = ['./tests/base-option/lights.yaml', './tests/base-option/camera.yaml']

    expect(
      await bundle(
        files.map(file => fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')),
        { referenceIntoComponents: false, base: fs.readFileSync(path.resolve(process.cwd(), './tests/base-option/base.yaml'), 'utf-8') }
      )
    ).resolves;

  })

  test('should be able to change the baseDir folder', async () => {
    const files = ['./tests/specfiles/main.yaml']
    expect(
      await bundle(
        files.map(file => fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')),
        {baseDir: './tests/specfiles'}
      )
    ).resolves
  })
});

describe('[unit testing]', () => {
  test('`isExternalReference()` should return `true` on external reference', () => {
    expect(isExternalReference('./components/messages/UserSignedUp')).toBeTruthy();
  });
  test('`isExternalReference()` should return `false` on local reference', () => {
    expect(isExternalReference('#/components/messages/UserSignedUp')).toBeFalsy();
  });
});
