import request from 'supertest';
import express from 'express';
import { body, validationResult } from 'express-validator';

const calculateScores = (answers) => {
  const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
  scores.E_I += answers[0] + answers[1] + answers[2] + answers[3];
  scores.E_I -= answers[16] + answers[17] + answers[18] + answers[19];
  scores.S_N += answers[4] + answers[5] + answers[6] + answers[7];
  scores.S_N -= answers[20] + answers[21] + answers[22] + answers[23];
  scores.T_F += answers[8] + answers[9] + answers[10] + answers[11];
  scores.T_F -= answers[24] + answers[25] + answers[26] + answers[27];
  scores.J_P += answers[12] + answers[13] + answers[14] + answers[15];
  scores.J_P -= answers[28] + answers[29] + answers[30] + answers[31];
  return scores;
};

const getPersonalityType = (scores) => {
  const personality = [];
  personality.push(scores.E_I > 0 ? 'E' : 'I');
  personality.push(scores.S_N > 0 ? 'S' : 'N');
  personality.push(scores.T_F > 0 ? 'T' : 'F');
  personality.push(scores.J_P > 0 ? 'J' : 'P');
  return personality.join('');
};

describe('calculateScores', () => {
  it('returns zero scores for an all-zero answers array', () => {
    const answers = Array(32).fill(0);
    const scores = calculateScores(answers);
    expect(scores).toEqual({ E_I: 0, S_N: 0, T_F: 0, J_P: 0 });
  });

  it('computes positive E_I when extraversion answers are high', () => {
    const answers = Array(32).fill(0);
    answers[0] = 5; answers[1] = 5; answers[2] = 5; answers[3] = 5;
    answers[16] = 1; answers[17] = 1; answers[18] = 1; answers[19] = 1;
    const scores = calculateScores(answers);
    expect(scores.E_I).toBe(16);
  });

  it('computes negative E_I when introversion answers are high', () => {
    const answers = Array(32).fill(0);
    answers[16] = 5; answers[17] = 5; answers[18] = 5; answers[19] = 5;
    answers[0] = 1; answers[1] = 1; answers[2] = 1; answers[3] = 1;
    const scores = calculateScores(answers);
    expect(scores.E_I).toBe(-16);
  });

  it('computes positive S_N when sensing answers are high', () => {
    const answers = Array(32).fill(0);
    answers[4] = 5; answers[5] = 5; answers[6] = 5; answers[7] = 5;
    answers[20] = 1; answers[21] = 1; answers[22] = 1; answers[23] = 1;
    const scores = calculateScores(answers);
    expect(scores.S_N).toBe(16);
  });

  it('computes positive T_F when thinking answers are high', () => {
    const answers = Array(32).fill(0);
    answers[8] = 5; answers[9] = 5; answers[10] = 5; answers[11] = 5;
    answers[24] = 1; answers[25] = 1; answers[26] = 1; answers[27] = 1;
    const scores = calculateScores(answers);
    expect(scores.T_F).toBe(16);
  });

  it('computes positive J_P when judging answers are high', () => {
    const answers = Array(32).fill(0);
    answers[12] = 5; answers[13] = 5; answers[14] = 5; answers[15] = 5;
    answers[28] = 1; answers[29] = 1; answers[30] = 1; answers[31] = 1;
    const scores = calculateScores(answers);
    expect(scores.J_P).toBe(16);
  });

  it('handles mixed values correctly', () => {
    const answers = Array(32).fill(2);
    const scores = calculateScores(answers);
    expect(scores.E_I).toBe(0);
    expect(scores.S_N).toBe(0);
    expect(scores.T_F).toBe(0);
    expect(scores.J_P).toBe(0);
  });

  it('works with maximum values (e.g. 5 per answer)', () => {
    const answers = Array(32).fill(5);
    const scores = calculateScores(answers);
    expect(scores.E_I).toBe(0);
    expect(scores.S_N).toBe(0);
    expect(scores.T_F).toBe(0);
    expect(scores.J_P).toBe(0);
  });
});

describe('getPersonalityType', () => {
  it('returns ESTJ when all scores are positive', () => {
    const scores = { E_I: 10, S_N: 10, T_F: 10, J_P: 10 };
    expect(getPersonalityType(scores)).toBe('ESTJ');
  });

  it('returns INFP when all scores are negative', () => {
    const scores = { E_I: -10, S_N: -10, T_F: -10, J_P: -10 };
    expect(getPersonalityType(scores)).toBe('INFP');
  });

  it('returns ENTP for mixed E_I positive, S_N negative, T_F positive, J_P negative', () => {
    const scores = { E_I: 5, S_N: -5, T_F: 5, J_P: -5 };
    expect(getPersonalityType(scores)).toBe('ENTP');
  });

  it('returns INFP when all scores are zero', () => {
    const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
    expect(getPersonalityType(scores)).toBe('INFP');
  });

  it('returns ISFP for specific scores', () => {
    const scores = { E_I: -3, S_N: 7, T_F: -2, J_P: -8 };
    expect(getPersonalityType(scores)).toBe('ISFP');
  });
});

describe('end-to-end: calculateScores + getPersonalityType', () => {
  it('correctly identifies an ESTJ personality', () => {
    const answers = Array(32).fill(1);
    answers[0] = 5; answers[1] = 5; answers[2] = 5; answers[3] = 5;
    answers[16] = 1; answers[17] = 1; answers[18] = 1; answers[19] = 1;
    answers[4] = 5; answers[5] = 5; answers[6] = 5; answers[7] = 5;
    answers[20] = 1; answers[21] = 1; answers[22] = 1; answers[23] = 1;
    answers[8] = 5; answers[9] = 5; answers[10] = 5; answers[11] = 5;
    answers[24] = 1; answers[25] = 1; answers[26] = 1; answers[27] = 1;
    answers[12] = 5; answers[13] = 5; answers[14] = 5; answers[15] = 5;
    answers[28] = 1; answers[29] = 1; answers[30] = 1; answers[31] = 1;
    const scores = calculateScores(answers);
    expect(getPersonalityType(scores)).toBe('ESTJ');
  });

  it('correctly identifies an INFP personality', () => {
    const answers = Array(32).fill(1);
    answers[0] = 1; answers[1] = 1; answers[2] = 1; answers[3] = 1;
    answers[16] = 5; answers[17] = 5; answers[18] = 5; answers[19] = 5;
    answers[4] = 1; answers[5] = 1; answers[6] = 1; answers[7] = 1;
    answers[20] = 5; answers[21] = 5; answers[22] = 5; answers[23] = 5;
    answers[8] = 1; answers[9] = 1; answers[10] = 1; answers[11] = 1;
    answers[24] = 5; answers[25] = 5; answers[26] = 5; answers[27] = 5;
    answers[12] = 1; answers[13] = 1; answers[14] = 1; answers[15] = 1;
    answers[28] = 5; answers[29] = 5; answers[30] = 5; answers[31] = 5;
    const scores = calculateScores(answers);
    expect(getPersonalityType(scores)).toBe('INFP');
  });
});

describe('POST /quiz/submit – validation middleware', () => {
  const validators = [
    body('answers').isArray({ min: 32, max: 32 }).withMessage('Exactly 32 answers required'),
  ];

  const createApp = () => {
    const app = express();
    app.use(express.json());
    app.post('/quiz/submit', validators, (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return res.status(200).json({ message: 'passed validation' });
    });
    return app;
  };

  it('rejects request with no answers field', async () => {
    const app = createApp();
    const res = await request(app).post('/quiz/submit').send({});
    expect(res.status).toBe(400);
  });

  it('rejects request with answers as a string', async () => {
    const app = createApp();
    const res = await request(app).post('/quiz/submit').send({ answers: 'invalid' });
    expect(res.status).toBe(400);
  });

  it('rejects array of 31 elements', async () => {
    const app = createApp();
    const res = await request(app).post('/quiz/submit').send({ answers: Array(31).fill(1) });
    expect(res.status).toBe(400);
  });

  it('rejects array of 33 elements', async () => {
    const app = createApp();
    const res = await request(app).post('/quiz/submit').send({ answers: Array(33).fill(1) });
    expect(res.status).toBe(400);
  });

  it('accepts exactly 32 answers', async () => {
    const app = createApp();
    const res = await request(app).post('/quiz/submit').send({ answers: Array(32).fill(1) });
    expect(res.status).toBe(200);
  });
});
