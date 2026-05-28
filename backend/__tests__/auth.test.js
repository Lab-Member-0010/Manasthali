import { jest } from '@jest/globals';
import asyncHandler from '../middleware/asyncHandler.js';
import jwt from 'jsonwebtoken';

describe('asyncHandler', () => {
  it('calls next with error when the handler throws', async () => {
    const error = new Error('Something went wrong');
    const handler = asyncHandler(async () => { throw error; });
    const req = {};
    const res = {};
    const next = jest.fn();
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('passes through when handler succeeds', async () => {
    const handler = asyncHandler(async (req, res) => {
      res.json({ success: true });
    });
    const req = {};
    const res = { json: jest.fn() };
    const next = jest.fn();
    await handler(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('handles synchronous throw inside async function', async () => {
    const handler = asyncHandler(async () => {
      throw new Error('Sync error');
    });
    const req = {};
    const res = {};
    const next = jest.fn();
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Sync error' }));
  });

  it('does not call next when handler returns a value', async () => {
    const handler = asyncHandler(async (req, res) => {
      res.status(200).end();
    });
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
    const next = jest.fn();
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('asyncHandler – parameter handling', () => {
  it('passes req, res, next to the wrapped function', async () => {
    const fn = jest.fn(async (req, res, next) => { res.end(); });
    const handler = asyncHandler(fn);
    const req = { body: {} };
    const res = { end: jest.fn() };
    const next = jest.fn();
    await handler(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });
});

describe('JWT utilities (standalone logic)', () => {
  it('generates a token with correct structure', () => {
    const payload = { userId: '507f1f77bcf86cd799439011' };
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    expect(typeof token).toBe('string');
    const decoded = jwt.verify(token, secret);
    expect(decoded).toMatchObject(payload);
  });

  it('rejects token with wrong secret', () => {
    const payload = { userId: '507f1f77bcf86cd799439011' };
    const token = jwt.sign(payload, 'correct-secret', { expiresIn: '7d' });
    expect(() => jwt.verify(token, 'wrong-secret')).toThrow();
  });
});
