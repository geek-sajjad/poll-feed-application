import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  duration: '20s',
  vus: 630,
};

const BASE_URL = 'http://localhost:8000/polls';

export default function () {
  const params = {
    tags: { 'Content-Type': 'application/json' },
  };

  const url = `${BASE_URL}?tag=tech,sd&page=1&limit=10&userId=ef8348e0-a6ba-44e9-add4-d8544a570dc1`;
  const res = http.get(url, params);

  check(res, {
    'status is 200': r => r.status === 200,
    'response is JSON': r =>
      r.headers['Content-Type'].includes('application/json'),
  });

  sleep(0.3);
}
