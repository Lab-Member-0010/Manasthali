import request from 'supertest';
import express from 'express';
import { body, validationResult } from 'express-validator';

const createTestApp = (validators) => {
  const app = express();
  app.use(express.json());
  app.post('/test', validators, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(200).json({ message: 'ok' });
  });
  return app;
};

describe('POST /users/register – validation', () => {
  const validators = [
    body("username", "Username is required").notEmpty(),
    body("email", "Invalid email ID").isEmail(),
    body("email", "Email ID is required").notEmpty(),
    body("password", "Password is required").notEmpty(),
  ];

  it('accepts valid registration data', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ username: 'johndoe', email: 'john@example.com', password: 'secret123' });
    expect(res.status).toBe(200);
  });

  it('rejects missing username', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ email: 'john@example.com', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects missing email', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ username: 'johndoe', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects invalid email format', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ username: 'johndoe', email: 'not-an-email', password: 'secret123' });
    expect(res.status).toBe(400);
  });

  it('rejects missing password', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ username: 'johndoe', email: 'john@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /users/verify-otp – validation', () => {
  const validators = [
    body("email", "Invalid email ID").isEmail(),
    body("otp", "OTP is required").notEmpty(),
  ];

  it('accepts valid OTP verification data', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ email: 'john@example.com', otp: '123456' });
    expect(res.status).toBe(200);
  });

  it('rejects missing OTP', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ email: 'john@example.com' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid email for OTP verification', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ email: 'bad', otp: '123456' });
    expect(res.status).toBe(400);
  });
});

describe('POST /users/login – validation', () => {
  it('accepts login data (no validators in route, but body should parse)', async () => {
    const app = createTestApp([]);
    const res = await request(app)
      .post('/test')
      .send({ email: 'john@example.com', password: 'secret123' });
    expect(res.status).toBe(200);
  });
});

describe('POST /users/forgot-password – validation', () => {
  const validators = [
    body("email", "Invalid email ID").isEmail(),
  ];

  it('rejects missing email', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ email: 'bad' });
    expect(res.status).toBe(400);
  });

  it('accepts valid email', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ email: 'john@example.com' });
    expect(res.status).toBe(200);
  });
});

describe('POST /users/reset-password – validation', () => {
  const validators = [
    body("token", "Token is required").notEmpty(),
    body("newPassword", "New password is required").notEmpty(),
  ];

  it('rejects missing token', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ newPassword: 'newpass123' });
    expect(res.status).toBe(400);
  });

  it('rejects missing newPassword', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ token: 'sometoken' });
    expect(res.status).toBe(400);
  });

  it('accepts valid reset data', async () => {
    const app = createTestApp(validators);
    const res = await request(app)
      .post('/test')
      .send({ token: 'sometoken', newPassword: 'newpass123' });
    expect(res.status).toBe(200);
  });
});

describe('POST /posts – description validation', () => {
  const validators = [
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
  ];

  it('rejects empty description', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ description: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects missing description', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
  });

  it('accepts valid description', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ description: 'Hello world' });
    expect(res.status).toBe(200);
  });
});

describe('POST /quiz/submit – answers validation', () => {
  const validators = [
    body('answers').isArray({ min: 32, max: 32 }).withMessage('Exactly 32 answers required'),
  ];

  it('rejects non-array answers', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ answers: 'not-an-array' });
    expect(res.status).toBe(400);
  });

  it('rejects array with wrong length (too short)', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ answers: [1, 2, 3] });
    expect(res.status).toBe(400);
  });

  it('rejects array with wrong length (too long)', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ answers: Array(40).fill(1) });
    expect(res.status).toBe(400);
  });

  it('accepts exactly 32 answers', async () => {
    const app = createTestApp(validators);
    const res = await request(app).post('/test').send({ answers: Array(32).fill(1) });
    expect(res.status).toBe(200);
  });
});
